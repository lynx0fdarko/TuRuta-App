// lib/location.js
// Servicio centralizado y robusto para ubicación con Expo Location.
// Maneja permisos, servicios, posición actual con timeout/fallback,
// watchers, abrir ajustes, utilidades de distancia y geocodificación.

import * as Location from 'expo-location'
import { Alert, Linking, Platform } from 'react-native'

/** Códigos de error estandarizados */
export const LOCATION_ERRORS = {
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  SERVICES_DISABLED: 'SERVICES_DISABLED',
  TIMEOUT: 'TIMEOUT',
  UNKNOWN: 'UNKNOWN',
}

/** Opciones por defecto */
const DEFAULTS = {
  accuracy: Location.Accuracy.High,
  timeoutMs: 10000,            // 10s para no colgar la UI
  fallbackToLastKnown: true,   // intenta última posición si falla
  distanceInterval: 5,         // watcher: mínimo 5m para disparar callback
  timeInterval: 2000,          // watcher: cada 2s como mínimo
}

/** Promesa con timeout para no colgar esperando GPS */
function withTimeout(promise, ms, onTimeoutMsg = 'Tiempo de espera agotado') {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(onTimeoutMsg)), ms)
    ),
  ])
}

/** Abre la pantalla de Ajustes del sistema para habilitar permisos */
export async function openAppSettings() {
  try {
    const canOpen = await Linking.canOpenURL('app-settings:')
    if (canOpen) {
      await Linking.openURL('app-settings:')
    } else if (Linking.openSettings) {
      await Linking.openSettings()
    } else {
      Alert.alert('No se pudieron abrir los Ajustes')
    }
  } catch (e) {
    Alert.alert('No se pudieron abrir los Ajustes', String(e?.message ?? e))
  }
}

/** Verifica si los servicios de ubicación del dispositivo están activos (GPS) */
export async function areLocationServicesEnabled() {
  try {
    return await Location.hasServicesEnabledAsync()
  } catch {
    // Android viejos a veces rompen esta llamada. Asume true para no bloquear.
    return true
  }
}

/** Pide permisos foreground si aún no están concedidos */
export async function ensureForegroundPermission() {
  try {
    const existing = await Location.getForegroundPermissionsAsync()
    if (existing.status === 'granted') return { granted: true, status: 'granted' }

    const requested = await Location.requestForegroundPermissionsAsync()
    return { granted: requested.status === 'granted', status: requested.status }
  } catch (e) {
    return { granted: false, status: 'error', error: e }
  }
}

/**
 * OJO: Permiso en background requiere configuración extra (task y app.json).
 * Incluimos utilidad, pero no lo llames sin haber configurado Task Manager.
 */
export async function ensureBackgroundPermission() {
  try {
    const existing = await Location.getBackgroundPermissionsAsync()
    if (existing.status === 'granted') return { granted: true, status: 'granted' }

    const requested = await Location.requestBackgroundPermissionsAsync()
    return { granted: requested.status === 'granted', status: requested.status }
  } catch (e) {
    return { granted: false, status: 'error', error: e }
  }
}

/**
 * Garantiza permisos y servicios o muestra un alert con opción a Ajustes.
 * @returns {Promise<{ok: boolean, reason?: string}>}
 */
export async function ensurePermissionsAndServicesInteractive() {
  const { granted } = await ensureForegroundPermission()
  if (!granted) {
    Alert.alert(
      'Permiso de ubicación requerido',
      'Activa la ubicación para ver paradas cercanas.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Abrir Ajustes', onPress: openAppSettings },
      ]
    )
    return { ok: false, reason: LOCATION_ERRORS.PERMISSION_DENIED }
  }

  const enabled = await areLocationServicesEnabled()
  if (!enabled) {
    Alert.alert(
      'Ubicación desactivada',
      'Activa los servicios de ubicación (GPS) para continuar.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Abrir Ajustes', onPress: openAppSettings },
      ]
    )
    return { ok: false, reason: LOCATION_ERRORS.SERVICES_DISABLED }
  }

  return { ok: true }
}

/**
 * Obtiene posición actual con timeout y fallback a última posición conocida.
 * @param {Object} options
 * @param {Location.Accuracy} options.accuracy
 * @param {number} options.timeoutMs
 * @param {boolean} options.fallbackToLastKnown
 * @returns {Promise<{ latitude: number, longitude: number } | null>}
 */
export async function getCurrentLocation(options = {}) {
  const accuracy = options.accuracy ?? DEFAULTS.accuracy
  const timeoutMs = options.timeoutMs ?? DEFAULTS.timeoutMs
  const fallbackToLastKnown = options.fallbackToLastKnown ?? DEFAULTS.fallbackToLastKnown

  try {
    // Permisos y servicios
    const ok = await ensurePermissionsAndServicesInteractive()
    if (!ok.ok) return null

    // Posición actual con timeout
    const result = await withTimeout(
      Location.getCurrentPositionAsync({ accuracy }),
      timeoutMs,
      'No se pudo obtener tu ubicación a tiempo.'
    )

    if (result?.coords?.latitude && result?.coords?.longitude) {
      return {
        latitude: result.coords.latitude,
        longitude: result.coords.longitude,
      }
    }

    // Si vino roto, intenta fallback
    if (fallbackToLastKnown) {
      const last = await Location.getLastKnownPositionAsync()
      if (last?.coords?.latitude && last?.coords?.longitude) {
        return {
          latitude: last.coords.latitude,
          longitude: last.coords.longitude,
        }
      }
    }

    Alert.alert('Error de ubicación', 'No se pudo obtener tu posición.')
    return null
  } catch (e) {
    // Timeout u otro error
    if (fallbackToLastKnown) {
      try {
        const last = await Location.getLastKnownPositionAsync()
        if (last?.coords?.latitude && last?.coords?.longitude) {
          return {
            latitude: last.coords.latitude,
            longitude: last.coords.longitude,
          }
        }
      } catch {}
    }
    Alert.alert('Error de ubicación', String(e?.message ?? e))
    return null
  }
}

/**
 * Inicia un watcher de posición. Devuelve función para detenerlo.
 * @param {(coords:{latitude:number, longitude:number})=>void} onChange
 * @param {Object} options
 * @returns {Promise<() => void>} unsubscribe function
 */
export async function watchPosition(onChange, options = {}) {
  const accuracy = options.accuracy ?? DEFAULTS.accuracy
  const distanceInterval = options.distanceInterval ?? DEFAULTS.distanceInterval
  const timeInterval = options.timeInterval ?? DEFAULTS.timeInterval

  try {
    const ok = await ensurePermissionsAndServicesInteractive()
    if (!ok.ok) return () => {}

    const subscription = await Location.watchPositionAsync(
      { accuracy, distanceInterval, timeInterval },
      (loc) => {
        if (loc?.coords?.latitude && loc?.coords?.longitude) {
          onChange({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          })
        }
      }
    )

    return () => {
      try {
        subscription?.remove?.()
      } catch {}
    }
  } catch (e) {
    Alert.alert('No se pudo iniciar el seguimiento de ubicación', String(e?.message ?? e))
    return () => {}
  }
}

/**
 * Reverse geocoding: convierte coordenadas en dirección aproximada.
 * @returns {Promise<null | { city?: string, street?: string, name?: string, region?: string, country?: string, postalCode?: string }>}
 */
export async function reverseGeocode({ latitude, longitude }) {
  try {
    const res = await Location.reverseGeocodeAsync({ latitude, longitude })
    if (Array.isArray(res) && res.length > 0) {
      const g = res[0]
      return {
        name: g.name,
        street: g.street,
        city: g.city || g.subregion,
        region: g.region,
        country: g.country,
        postalCode: g.postalCode,
      }
    }
    return null
  } catch (e) {
    // No revientes la app por una dirección
    return null
  }
}

/** Utilidad: distancia Haversine en metros */
export function getDistanceMeters(a, b) {
  if (!a || !b) return Number.NaN
  const R = 6371e3
  const φ1 = (a.latitude * Math.PI) / 180
  const φ2 = (b.latitude * Math.PI) / 180
  const Δφ = ((b.latitude - a.latitude) * Math.PI) / 180
  const Δλ = ((b.longitude - a.longitude) * Math.PI) / 180

  const sinΔφ = Math.sin(Δφ / 2)
  const sinΔλ = Math.sin(Δλ / 2)
  const c = 2 * Math.asin(Math.sqrt(sinΔφ * sinΔφ + Math.cos(φ1) * Math.cos(φ2) * sinΔλ * sinΔλ))
  return R * c
}

/** Ordena puntos por proximidad a un ancla */
export function sortByDistance(anchor, points) {
  if (!anchor || !Array.isArray(points)) return []
  return [...points].sort((p1, p2) => {
    const d1 = getDistanceMeters(anchor, p1)
    const d2 = getDistanceMeters(anchor, p2)
    return d1 - d2
  })
}

/** Convierte coordenadas + radio (km) a región de MapView */
export function toMapRegion(center, radiusKm = 1) {
  // aproximación simple: 1 grado ~ 111 km
  const delta = radiusKm / 111
  return {
    latitude: center.latitude,
    longitude: center.longitude,
    latitudeDelta: delta,
    longitudeDelta: delta,
  }
}

/** Helpers de plataforma por si quieres condicionar comportamientos */
export const isIOS = Platform.OS === 'ios'
export const isAndroid = Platform.OS === 'android'
