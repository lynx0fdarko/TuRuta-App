// app/(drawer)/(tabs)/routes.js
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'                 // 👈 importar
import GlassBox from '../../../components/GlassBox'
import AvatarButton from '../../../components/AvatarButton'
import { colors } from '../../../styles/colors'

const DATA = [
  {
    id: '117',
    title: 'Villa José Benito Escobar a Universidad Casimiro Sotelo Montenegro',
    path:
      'Villa José Benito Escobar > Cancha Benito Escobar > Colegio Las Américas > El Molino > Transagro > Pali las Mercedes > Entrada las Mercedes...'
  },
  {
    id: '118',
    title: 'Villa Libertad a Cuesta el plomo',
    path:
      'Terminal Laureles Sur > Villa Libertad > Ixchen > La Sábana > Pulpería Meydar > La Chelita > Farmacia Villa Venezuela > Colegio Villa Venezuela...'
  },
  {
    id: '119',
    title: 'Cuesta el plomo a Villa Fraternidad',
    path:
      'Cuesta el Plomo Sur > Clínica Bethel > INIFOM > Centro Comercial Linda Vista > Linda Vista Sur > Pulpería Emmanuel > Fotos Lumintron...'
  },
  {
    id: '120',
    title: 'Mayoreo a El Seminario',
    path:
      'Mercado Mayoreo > Semáforo Mayoreo > Autos flores > MATEPSA > Howard > Maxi Pali La Reynaga > Pulpería Doña Perna > Miguel Gutiérrez...'
  }
]

export default function RoutesScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()                            // 👈 crear instancia

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <AvatarButton
          size={56}
          uri={null} // pasa la URL real si la tenés
          onPress={() => router.push('/(drawer)/profile')}   // 👈 usar router aquí
          containerStyle={{ marginTop: insets.top }}
        />

        <GlassBox radius={18} padding={14} shadow={false} style={styles.headerPill}>
          <Text style={styles.headerTitle}>El dorado ➜ Los Robles</Text>
          <Text style={styles.headerSubtitle}>Ruta 105 · 15 min</Text>
        </GlassBox>

        <TouchableOpacity activeOpacity={0.85} style={styles.searchBtn}>
          <MaterialCommunityIcons name="magnify" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Lista */}
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 140 }}>
        {DATA.map((item) => (
          <View key={item.id} style={styles.cardWrap}>
            <View style={styles.rowTop}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.id}</Text>
              </View>
              <TouchableOpacity style={styles.badgeRound}>
                <MaterialCommunityIcons name="clock-check-outline" size={18} color="#285D65" />
              </TouchableOpacity>
            </View>

            <GlassBox radius={18} padding={14} shadow={Platform.OS === 'android'} style={styles.infoBox}>
              <View style={{ flex: 1 }}>
                <Text style={styles.routeTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.routePath} numberOfLines={2}>
                  {item.path} <Text style={styles.more}>Ver más</Text>
                </Text>
              </View>

              <TouchableOpacity style={styles.airBtn}>
                <MaterialCommunityIcons name="send" size={20} color="#1C325B" />
              </TouchableOpacity>
            </GlassBox>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

/** Colores base del mock */
const YELLOW = '#F4E791'
const YELLOW_DEEP = '#E6DA7F'
const BLUE_CARD = '#4B87B0'

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: YELLOW },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 12,
  },
  headerPill: {
    flex: 1,
    backgroundColor: '#C8D6C4' + '66',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  headerSubtitle: {
    color: '#EAF2FF',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 2,
  },
  searchBtn: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#9EC3C7',
    alignItems: 'center', justifyContent: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 10, shadowOffset: { width: 0, height: 6 } },
      android: { elevation: 6 },
    }),
  },

  cardWrap: {
    backgroundColor: YELLOW_DEEP,
    borderRadius: 26,
    padding: 12,
    marginBottom: 18,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 5 } },
      android: { elevation: 3 },
    }),
  },
  rowTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  badge: {
    backgroundColor: '#E7EDC9',
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#4B5A43', fontWeight: '900', fontSize: 16 },
  badgeRound: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#E7EDC9',
    alignItems: 'center', justifyContent: 'center',
  },
  infoBox: { backgroundColor: BLUE_CARD + 'D6' },
  routeTitle: { color: '#10324A', fontSize: 16, fontWeight: '800', marginBottom: 6 },
  routePath: { color: '#10324A', fontSize: 13, lineHeight: 18 },
  more: { color: '#0B2C6E', fontWeight: '900' },
  airBtn: {
    marginLeft: 10,
    alignSelf: 'center',
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#EAEFF7',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#C5D3EA',
  },
})
