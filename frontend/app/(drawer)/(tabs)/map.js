import React, { useMemo } from 'react'
import { StyleSheet, View, Text, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import AvatarButton from '../../../components/AvatarButton'

let MapViewModule
try {
  MapViewModule = require('react-native-maps')
} catch (error) {
  console.warn('react-native-maps no esta disponible en este entorno.', error)
}

const INITIAL_REGION = {
  latitude: 12.136389,
  longitude: -86.251389,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
}

export default function MapScreen() {
  const { MapView, Marker, PROVIDER_GOOGLE } = useMemo(() => {
    if (!MapViewModule) {
      return { MapView: null, Marker: null, PROVIDER_GOOGLE: null }
    }
    return {
      MapView: MapViewModule.default,
      Marker: MapViewModule.Marker,
      PROVIDER_GOOGLE: MapViewModule.PROVIDER_GOOGLE,
    }
  }, [])

  const insets = useSafeAreaInsets()
  const router = useRouter()

  if (!MapView) {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackText}>
          El componente de mapas no esta disponible en este entorno. Usa un build personalizado o Expo Go actualizado.
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={INITIAL_REGION}
      >
        <Marker coordinate={INITIAL_REGION} title="Bus" />
      </MapView>

      {/* Overlay absoluto por encima del MapView */}
      <View pointerEvents="box-none" style={styles.overlay}>
        {/* Botón de avatar arriba-izquierda */}
        <View
          pointerEvents="box-none"
          style={[
            styles.avatarWrap,
            { top: (insets?.top ?? 0) + 8 } // respeta la notch/status bar
          ]}
        >
          <AvatarButton
            size={56}
            uri={null} // URL real si la tienes
            onPress={() => router.push('/(drawer)/profile')}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  // Cubre toda la pantalla por encima del mapa
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,                // iOS
    pointerEvents: 'box-none',
  },

  // Contenedor ABSOLUTO del avatar (clave para Android)
  avatarWrap: {
    position: 'absolute',
    left: 12,
    // top lo seteo dinámico con insets
    zIndex: 1000,               // iOS
    ...Platform.select({
      android: { elevation: 12 }, // Android necesita elevation
    }),
  },

  fallback: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  fallbackText: { textAlign: 'center' },
})
