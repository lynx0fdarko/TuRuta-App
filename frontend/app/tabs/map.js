import { useMemo } from 'react'
import { StyleSheet, View, Text } from 'react-native'

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
      <MapView provider={PROVIDER_GOOGLE} style={styles.map} initialRegion={INITIAL_REGION}>
        <Marker coordinate={INITIAL_REGION} title="Bus" />
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  fallback: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  fallbackText: { textAlign: 'center' },
})
