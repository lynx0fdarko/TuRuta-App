// app/(drawer)/(tabs)/routes.js
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { MaterialCommunityIcons } from '@expo/vector-icons'
<<<<<<< HEAD
import { useRouter } from 'expo-router'                 // 👈 importar
=======
import { useRouter } from 'expo-router'
import { BlurView } from 'expo-blur'

>>>>>>> 228b9f4a06669bb0f80b588f716e48e750ee2a7b
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
<<<<<<< HEAD
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
=======
  const router = useRouter()

  return (
    <SafeAreaView style={styles.safe}>
      {/* ===== Header “vidrio” con menos espacio arriba ===== */}
      <View style={[styles.headerRow, { paddingTop: Math.max(insets.top - 4, 8) }]}>
        {/* Perfil (blur circle) */}
        <BlurView intensity={35} tint="light" style={styles.blurCircle}>
          <AvatarButton
            size={42}
            uri={null}
            onPress={() => router.push('/(drawer)/profile')}
          />
        </BlurView>

        {/* Centro: tarjeta blur con título */}
        <BlurView intensity={35} tint="light" style={styles.blurCard}>
          <Text style={styles.menuTitle}>Menú de Rutas</Text>
          <Text style={styles.menuSubtitle}>Explora y elige tu recorrido</Text>
        </BlurView>

        {/* Buscar (blur circle) */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {}}
        >
          <BlurView intensity={35} tint="light" style={styles.blurCircle}>
            <MaterialCommunityIcons name="magnify" size={22} color={colors.secondary} />
          </BlurView>
        </TouchableOpacity>
      </View>

      {/* ===== Lista ===== */}
>>>>>>> 228b9f4a06669bb0f80b588f716e48e750ee2a7b
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

<<<<<<< HEAD
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
=======
  /* ===== Header ===== */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 6, // un poco más compacto
  },
  blurCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#00000010',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 3 },
    }),
  },
  blurCard: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#00000010',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 6 } },
      android: { elevation: 4 },
    }),
  },
  menuTitle: {
    color: '#1B2B4B',
>>>>>>> 228b9f4a06669bb0f80b588f716e48e750ee2a7b
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
<<<<<<< HEAD
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

=======
  menuSubtitle: {
    color: '#3E516A',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },

  /* ===== Lista ===== */
>>>>>>> 228b9f4a06669bb0f80b588f716e48e750ee2a7b
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
