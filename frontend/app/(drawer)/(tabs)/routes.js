// app/(drawer)/(tabs)/routes.js
import React, { useMemo, useRef, useState, useEffect } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Platform, Keyboard } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { BlurView } from 'expo-blur'

import GlassBox from '../../../components/GlassBox'
import AvatarButton from '../../../components/AvatarButton'
import { colors } from '../../../styles/colors'

/* ==== Datos (puedes ampliar libremente) ==== */
const DATA = [
  { id: '101', title: 'Mercado Mayoreo ↔ Las Brisas',
    path: 'Mercado Mayoreo > Semáforos Mayoreo > Laureles Norte (Entrada N) > Palí Las Américas > El Madroño > Colegio Inmaculada > Concepción de María > Las Brisas' },
  { id: '102', title: 'Mercado Mayoreo ↔ Acahualinca',
    path: 'Mercado Mayoreo > Av. de las Milicias > Hospital Salud Integral > Rotonda El Güegüense > Parque Mennen > Mercado Oriental > Huellas de Acahualinca' },
  { id: '103', title: 'Laureles Sur ↔ Hospital Lenín Fonseca',
    path: 'Laureles Sur > Linda Vista Sur > Universidad Paulo Freire > El Seminario > ENACAL > INIFOM > Hospital Lenín Fonseca' },
  { id: '106', title: 'Berrtha Díaz ↔ El Seminario',
    path: 'Berrtha Díaz > Café Soluble > Subasta > Los Rieles > Pista El Mayoreo > Semáforos Mayoreo > El Seminario' },
  { id: '107', title: 'Camilo Ortega ↔ Mercado Oriental',
    path: 'Camilo Ortega > El Panal > El Redentor > Plaza Inter > Estadio Cranshaw > Mercado Oriental' },
  { id: '114', title: 'Rubenia ↔ Mercado Oriental',
    path: 'Rubenia > UdeM > Colonia Centroamérica > Rotonda El Güegüense > Mercado Oriental' },
  { id: '117', title: 'Villa José Benito Escobar ↔ Universidad Casimiro Sotelo',
    path: 'Villa J. B. Escobar > Cancha Benito Escobar > Colegio Las Américas > El Molino > Transagro > Pali Las Mercedes > U. Casimiro Sotelo' },
  { id: '118', title: 'Villa Libertad ↔ Cuesta el Plomo',
    path: 'Villa Libertad > Ixchen > La Sábana > Farmacia Villa Venezuela > 14 de Septiembre > Rotonda Cristo Rey > El Plomo' },
  { id: '119', title: 'Cuesta el Plomo ↔ Villa Fraternidad',
    path: 'Cuesta el Plomo Sur > INIFOM > Linda Vista Sur > Sagrado Corazón > Camilo Ortega > Villa Fraternidad' },
  { id: '120', title: 'Mercado Mayoreo ↔ El Seminario',
    path: 'Mercado Mayoreo > Semáforo Mayoreo > Autos Flores > MATEPSA > Howard > Maxi Palí La Reynaga > El Seminario' },
  { id: '175', title: 'Memorial Sandino ↔ Laureles Norte',
    path: 'Memorial Sandino > UNAN > Rotonda Rubenia > 7 Sur > Laureles Norte' },
  { id: '195', title: 'Milagro de Dios ↔ Parque Central',
    path: 'Milagro de Dios > Terminal 110 > Jorge Dimitrov > Parque Luis Alfonso > Parque Central' },
  { id: '210', title: 'Ciudad Sandino (Villa Soberana) ↔ Catedral',
    path: 'Villa Soberana > Ciudad Sandino > 7 Sur > Carretera Nueva a León > Antigua Casa Presidencial > Catedral de Managua' },
  { id: '261', title: 'Villa Roma ↔ Barrio Santa Rosa (MR4)',
    path: 'Villa Roma > Rubenia > UPOLI > Mercado Iván Montenegro > Rotonda La Virgen > Santa Rosa' },
  { id: '262', title: 'Comarca Los Vanegas ↔ INATEC',
    path: 'Los Vanegas > Monte Fresco > El Dorado > Sitel > ENEL Central > INATEC' },
  { id: '266', title: 'Las Mercedes ↔ Mercado Oriental',
    path: 'Las Mercedes > Aeropuerto > Carretera Norte > Rotonda El Güegüense > Mercado Oriental' },
]

/* ==== Tarjeta de ruta con "Ver más" solo cuando hace falta ==== */
function RouteCard({ item }) {
  const [expanded, setExpanded] = useState(false)
  const [measured, setMeasured] = useState(false)
  const [lineCount, setLineCount] = useState(0)

  // 1ª pasada: medimos sin truncar; luego aplicamos numberOfLines=2 si corresponde
  const handleTextLayout = (e) => {
    if (!measured) {
      setLineCount(e.nativeEvent.lines?.length ?? 0)
      setMeasured(true)
    }
  }

  const showToggle = lineCount > 2 // solo mostrar el "Ver más" si realmente se corta

  return (
    <View style={styles.cardWrap}>
      <View style={styles.rowTop}>
        <View style={styles.badge}><Text style={styles.badgeText}>{item.id}</Text></View>
        <TouchableOpacity style={styles.badgeRound}>
          <MaterialCommunityIcons name="clock-check-outline" size={18} color="#285D65" />
        </TouchableOpacity>
      </View>

      <GlassBox radius={18} padding={14} shadow={Platform.OS === 'android'} style={styles.infoBox}>
        <View style={{ flex: 1 }}>
          <Text style={styles.routeTitle} numberOfLines={2}>{item.title}</Text>

          <Text
            style={styles.routePath}
            onTextLayout={handleTextLayout}
            numberOfLines={measured && !expanded ? 2 : 0}
          >
            {item.path}
            {showToggle ? (
              <>
                {' '}
                <Text style={styles.more} onPress={() => setExpanded((v) => !v)}>
                  {expanded ? 'Ver menos' : 'Ver más'}
                </Text>
              </>
            ) : null}
          </Text>
        </View>

        <TouchableOpacity style={styles.airBtn}>
          <MaterialCommunityIcons name="send" size={20} color="#1C325B" />
        </TouchableOpacity>
      </GlassBox>
    </View>
  )
}

export default function RoutesScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  // 🔎 buscador
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  const toggleSearch = () => {
    if (searchOpen) {
      setQuery('')
      setSearchOpen(false)
      Keyboard.dismiss()
    } else {
      setSearchOpen(true)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return DATA
    return DATA.filter(r =>
      r.id.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q) ||
      r.path.toLowerCase().includes(q)
    )
  }, [query])

  useEffect(() => () => Keyboard.dismiss(), [])

  return (
    <SafeAreaView style={styles.safe}>
      {/* ===== Header ===== */}
      <View style={[styles.headerRow, { paddingTop: Math.max(insets.top - 4, 8) }]}>
        <BlurView intensity={35} tint="light" style={styles.blurCircle}>
          <AvatarButton size={42} uri={null} onPress={() => router.push('/(drawer)/profile')} />
        </BlurView>

        <BlurView intensity={Platform.OS === 'android' ? 20 : 35} tint="light" style={styles.blurCard}>
          {searchOpen ? (
            <View style={styles.searchRow}>
              <MaterialCommunityIcons name="magnify" size={18} color="#3E516A" />
              <TextInput
                ref={inputRef}
                value={query}
                onChangeText={setQuery}
                placeholder="Buscar ruta por número, nombre o recorrido…"
                placeholderTextColor="#3E516A"
                style={styles.searchInput}
                returnKeyType="search"
              />
            </View>
          ) : (
            <>
              <Text style={styles.menuTitle}>Menú de Rutas</Text>
              <Text style={styles.menuSubtitle}>Explora y elige tu recorrido</Text>
            </>
          )}
        </BlurView>

        <TouchableOpacity activeOpacity={0.85} onPress={toggleSearch}>
          <BlurView intensity={35} tint="light" style={styles.blurCircle}>
            <MaterialCommunityIcons name={searchOpen ? 'close' : 'magnify'} size={22} color={colors.secondary} />
          </BlurView>
        </TouchableOpacity>
      </View>

      {/* ===== Lista ===== */}
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, paddingBottom: 140 }}>
        {filtered.map((item) => <RouteCard key={item.id} item={item} />)}

        {filtered.length === 0 && (
          <Text style={{ textAlign: 'center', color: '#3E516A', marginTop: 24 }}>
            No se encontraron rutas para “{query}”.
          </Text>
        )}
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

  /* ===== Header ===== */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 6,
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
    backgroundColor: 'transparent',
    borderWidth: 0,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 6 } },
      android: { elevation: 0 },
    }),
  },
  menuTitle: { color: '#1B2B4B', fontSize: 18, fontWeight: '800', textAlign: 'center' },
  menuSubtitle: { color: '#3E516A', fontSize: 12, textAlign: 'center', marginTop: 2 },

  // 🔎 buscador
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8, width: '100%' },
  searchInput: { flex: 1, color: '#1B2B4B', paddingVertical: 6, fontSize: 14 },

  /* ===== Lista / tarjetas ===== */
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
  badgeRound: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E7EDC9', alignItems: 'center', justifyContent: 'center' },

  infoBox: { backgroundColor: BLUE_CARD + 'D6' },
  routeTitle: { color: '#10324A', fontSize: 16, fontWeight: '800', marginBottom: 6 },
  routePath: { color: '#10324A', fontSize: 13, lineHeight: 18 },
  more: { color: '#0B2C6E', fontWeight: '900' }, // aparece solo si lineCount>2
  airBtn: {
    marginLeft: 10,
    alignSelf: 'center',
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#EAEFF7',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#C5D3EA',
  },
})
