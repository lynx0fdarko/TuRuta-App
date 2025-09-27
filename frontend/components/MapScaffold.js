// components/MapScaffold.js
import { View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MapView from 'react-native-maps'
import { colors } from '../styles/colors'

const DARK_MAP = [
  { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#304a7d' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1626' }] },
]

export default function MapScaffold({
  children,
  initialRegion = { latitude: 12.1328, longitude: -86.2504, latitudeDelta: 0.05, longitudeDelta: 0.05 },
  showUser = true,
  customMapStyle = DARK_MAP,
}) {
  return (
    <SafeAreaView style={styles.root}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={initialRegion}
        showsUserLocation={showUser}
        customMapStyle={customMapStyle}
      />
      {/* Capa para tu UI flotante */}
      <View style={styles.overlay} pointerEvents="box-none">
        {children}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  overlay: { flex: 1, padding: 16 },
})
