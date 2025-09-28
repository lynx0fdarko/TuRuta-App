import { useRef, useMemo } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { colors } from '../../../styles/colors'
import { typography } from '../../../styles/typography'

export default function Home() {
  const bottomSheetRef = useRef(null)
  const snapPoints = useMemo(() => ['40%', '75%'], [])

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Buscador centrado */}
      <View style={styles.centered}>
        <View style={styles.searchBox}>
          <TextInput
            placeholder="¿A dónde vas?"
            placeholderTextColor={colors.muted}
            style={styles.searchInput}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.searchButton}>
            <MaterialCommunityIcons name="magnify" size={22} color={colors.background} />
          </TouchableOpacity>
        </View>
      </View>

      {/* BottomSheet con tarjetas */}
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={0}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={{ backgroundColor: colors.muted }}
      >
        <BottomSheetScrollView contentContainerStyle={{ padding: 16 }}>
          <Text style={[typography.h2, { marginBottom: 12 }]}>Viajes recientes</Text>

          {[
            { id: 1, from: 'San Judas', to: 'UNICIT', time: 'Hace 2h' },
            { id: 2, from: 'Mercado Oriental', to: 'Metrocentro', time: 'Ayer' },
            { id: 3, from: 'Ticuantepe', to: 'Managua Centro', time: 'Lunes' },
          ].map((trip) => (
            <View key={trip.id} style={styles.card}>
              <MaterialCommunityIcons name="map-marker-path" size={24} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={typography.h3}>
                  {trip.from} → {trip.to}
                </Text>
                <Text style={typography.caption}>{trip.time}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color={colors.muted} />
            </View>
          ))}
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  )
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 4,
    width: '100%',
    maxWidth: 420,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
  searchButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sheetBackground: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
    gap: 12,
  },
})
