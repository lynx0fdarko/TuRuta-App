import { useEffect, useRef, useState } from 'react'
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import * as Location from 'expo-location'
import BottomSheet from '@gorhom/bottom-sheet'
import { SafeAreaView } from 'react-native-safe-area-context'
import { typography } from '../../../styles/typography'
import { colors } from '../../../styles/colors'

export default function StopsScreen() {
  const [location, setLocation] = useState(null)


  const [loading, setLoading] = useState(true)
  const [stops, setStops] = useState([
    { id: '1', name: 'Parada Central', lat: 12.13282, lng: -86.2504, nextBus: '08:15 AM' },
    { id: '2', name: 'Universidad UNICIT', lat: 12.125, lng: -86.265, nextBus: '08:22 AM' },
    { id: '3', name: 'Mercado Oriental', lat: 12.1402, lng: -86.2701, nextBus: '08:30 AM' },
  ])
  const bottomSheetRef = useRef(null)

  // Pedir permisos y ubicación
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
          Alert.alert('Permiso requerido', 'Activa la ubicación para ver las paradas cercanas.')
          setLoading(false)
          return
        }

        let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High })
        setLocation(loc.coords)
      } catch (error) {
        Alert.alert('Error de ubicación', error.message || 'No se pudo obtener tu ubicación')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // Región inicial del mapa
  const initialRegion = {
    latitude: location ? location.latitude : 12.13282,
    longitude: location ? location.longitude : -86.2504,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Loader si está cargando */}
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={typography.body}>Buscando tu ubicación...</Text>
        </View>
      )}

      {/* Mapa */}
      {!loading && (
        <MapView style={{ flex: 1 }} initialRegion={initialRegion} showsUserLocation>
          {stops.map((stop) => (
            <Marker
              key={stop.id}
              coordinate={{ latitude: stop.lat, longitude: stop.lng }}
              title={stop.name}
              description={`Próximo bus: ${stop.nextBus}`}
              pinColor={colors.primary}
            />
          ))}
        </MapView>
      )}

      {/* Bottom Sheet */}
      <BottomSheet ref={bottomSheetRef} index={0} snapPoints={['25%', '50%', '80%']}>
        <View style={{ flex: 1, padding: 16 }}>
          <Text style={typography.h2}>🚌 Paradas cercanas</Text>

          {stops.length === 0 ? (
            <Text style={typography.body}>No hay paradas registradas en esta zona.</Text>
          ) : (
            <FlatList
              data={stops}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.stopCard}>
                  <Text style={typography.h3}>{item.name}</Text>
                  <Text style={typography.body}>Próximo bus: {item.nextBus}</Text>
                </View>
              )}
            />
          )}
        </View>
      </BottomSheet>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  stopCard: {
    backgroundColor: colors.surface ?? '#f9fafb',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    zIndex: 10,
  },
})
