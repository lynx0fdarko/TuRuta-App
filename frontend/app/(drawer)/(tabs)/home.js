import { MaterialCommunityIcons } from '@expo/vector-icons'
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { useRouter } from 'expo-router'
import { useMemo, useRef, useState } from 'react'
import { Animated, Dimensions, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import AvatarButton from '../../../components/AvatarButton'
import GlassBox from '../../../components/GlassBox'
import { colors } from '../../../styles/colors'
import { typography } from '../../../styles/typography'

const COLLAPSED_PERCENT = 0.4
const { height: WIN_H } = Dimensions.get('window')
const SEARCH_BOTTOM = Math.round(WIN_H * COLLAPSED_PERCENT) + 12

// Región inicial (Managua aprox.)
const INITIAL_REGION = {
  latitude: 12.136389,
  longitude: -86.251389,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
}

// Estilo opcional del mapa (oscuro suave)
const MAP_STYLE = [
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
]

export default function Home() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const bottomSheetRef = useRef(null)
  const snapPoints = useMemo(() => ['40%', '75%'], [])
  const [tab, setTab] = useState('recent') // 'recent' | 'favorites'
  const fadeAnimRef = useRef(new Animated.Value(1))
  const fadeAnim = fadeAnimRef.current
  
  // Callback cuando el BottomSheet cambia de snap point
  const handleAnimate = (fromIndex, toIndex) => {
    console.log('🎬 Animando desde', fromIndex, 'hacia', toIndex)
    // toIndex: -1 (cerrado), 0 (40%), 1 (75%)
    const targetOpacity = toIndex === 0 ? 1 : 0
    
    Animated.timing(fadeAnimRef.current, {
      toValue: targetOpacity,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }

  const trips = [
    { id: 1, from: 'San judas',        to: 'UNIVERSIDAD',         time: 'Hace 2h' },
    { id: 2, from: 'Mercado Oriental', to: 'Metrocentro',    time: 'Ayer', highlighted: true },
    { id: 3, from: 'Ticuantepe',       to: 'Managua centro', time: 'Lunes' },
  ]

  const favorites = [
    { id: 'f1', from: 'UNIVERSIDAD', to: 'Galerías Santo Domingo' },
    { id: 'f2', from: 'UNIVERSIDAD', to: 'La Plancha, El Carmen', highlighted: true },
  ]

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* 🗺️ MAPA como fondo */}
      <MapView
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton={false}
        customMapStyle={MAP_STYLE}
        toolbarEnabled={false}
        rotateEnabled={false}
      />

      {/* 🔝 Capa de UI encima del mapa */}
      <SafeAreaView style={{ flex: 1 }} pointerEvents="box-none">
        {/* Avatar (foto de perfil botón) */}
        <AvatarButton
          uri={null}
          size={56}
          onPress={() => router.push('/(drawer)/profile')}
          containerStyle={{
            position: 'absolute',
            left: 16,
            top: insets.top + 4,
            zIndex: 100,
          }}
          outline={true}
        />

        {/* Buscador ANCLADO al borde superior del sheet */}
        <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
          <Animated.View style={[styles.searchAnchor, {
            bottom: SEARCH_BOTTOM,
            opacity: fadeAnim,
          }]}>
            <GlassBox
              radius={16}
              padding={8}
              intensity={Platform.OS === 'android' ? 42 : 34}
              shadow={false}
              style={styles.searchGlass}
            >
              <View style={styles.searchBox}>
                <View style={{ flex: 1, alignItems: 'center', marginLeft: 32 }}>
                  <TextInput
                    placeholder="¿A dónde vas?"
                    placeholderTextColor={colors.textSoft}
                    style={styles.searchInput}
                    returnKeyType="search"
                    underlineColorAndroid="transparent"
                  />
                </View>
                <TouchableOpacity style={styles.searchCircle}>
                  <MaterialCommunityIcons name="magnify" size={22} color={colors.white} />
                </TouchableOpacity>
              </View>
            </GlassBox>
          </Animated.View>
        </View>

        {/* BottomSheet (el panel cubre el buscador al subir) */}
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          index={0}
          onAnimate={handleAnimate}
          backgroundStyle={styles.sheetBackground}
          handleIndicatorStyle={{ backgroundColor: colors.handle }}
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              appearsOnIndex={1}
              disappearsOnIndex={-1}
              opacity={0.45}
              pressBehavior="collapse"
            />
          )}
        >
          <BottomSheetScrollView
            contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Título + chip conmutador */}
            <View style={styles.titleRow}>
              <Text style={[typography.h2, { color: colors.white }]}>
                {tab === 'recent' ? 'Viajes recientes' : 'Favoritos'}
              </Text>

              <TouchableOpacity
                onPress={() => setTab((t) => (t === 'recent' ? 'favorites' : 'recent'))}
                style={[styles.toggleChip, tab === 'favorites' && styles.toggleChipActive]}
                activeOpacity={0.85}
              >
                <MaterialCommunityIcons
                  name={tab === 'recent' ? 'history' : 'map-marker'}
                  size={16}
                  color={tab === 'favorites' ? colors.white : colors.secondary}
                />
                <Text style={[styles.toggleText, tab === 'favorites' && styles.toggleTextActive]}>
                  {tab === 'recent' ? 'Favoritos' : 'Viajes recientes'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Lista: recientes o favoritos */}
            {(tab === 'recent' ? trips : favorites).map((item) => {
              if (tab === 'favorites') {
                const highlighted = item.highlighted
                return (
                  <View
                    key={item.id}
                    style={[styles.favCard, highlighted && styles.favCardHighlight]}
                  >
                    <View style={[styles.favIconBox, highlighted && styles.favIconBoxHighlight]}>
                      <MaterialCommunityIcons
                        name="map-marker"
                        size={22}
                        color={highlighted ? '#3C3C3C' : colors.iconOnBlue}
                      />
                    </View>

                    <Text
                      numberOfLines={2}
                      style={[styles.favTitle, highlighted && styles.favTitleHighlight]}
                    >
                      {item.from} ➜ {item.to}
                    </Text>

                    <TouchableOpacity
                      onPress={() => {}}
                      style={[styles.starBtn, highlighted && styles.starBtnHighlight]}
                    >
                      <MaterialCommunityIcons
                        name="star"
                        size={18}
                        color={highlighted ? '#3C3C3C' : colors.iconOnBlue}
                      />
                    </TouchableOpacity>
                  </View>
                )
              }

              // Recientes
              const trip = item
              if (trip.highlighted) {
                return (
                  <View key={trip.id} style={styles.solidCard}>
                    <MaterialCommunityIcons name="map-marker-path" size={24} color={colors.secondary} />
                    <View style={{ flex: 1 }}>
                      <Text style={[typography.h3, { color: '#2A2A2A' }]}>
                        {trip.from} → {trip.to}
                      </Text>
                      <Text style={[typography.caption, { color: '#4E4E4E' }]}>{trip.time}</Text>
                    </View>
                    <TouchableOpacity style={styles.chevBtnHighlight}>
                      <MaterialCommunityIcons name="chevron-right" size={22} color={'#3C3C3C'} />
                    </TouchableOpacity>
                  </View>
                )
              }

              return (
                <GlassBox
                  key={trip.id}
                  radius={16}
                  padding={16}
                  intensity={28}
                  shadow={false}
                  style={{ marginBottom: 12 }}
                  childrenStyle={{}}
                >
                  <View style={styles.card}>
                    <MaterialCommunityIcons name="map-marker-path" size={24} color={colors.primary} />
                    <View style={{ flex: 1 }}>
                      <Text style={[typography.h3, { color: colors.white }]}>
                        {trip.from} → {trip.to}
                      </Text>
                      <Text style={[typography.caption, { color: colors.textSoft }]}>{trip.time}</Text>
                    </View>
                    <TouchableOpacity style={styles.chevBtn}>
                      <MaterialCommunityIcons name="chevron-right" size={22} color={colors.iconOnBlue} />
                    </TouchableOpacity>
                  </View>
                </GlassBox>
              )
            })}
          </BottomSheetScrollView>
        </BottomSheet>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  // Buscador anclado arriba del sheet
  searchAnchor: {
    width: '100%',
    position: 'absolute',
    // left: 0, right: 0,
    // alignItems: 'center',
    zIndex: 20,
  },
  searchGlass: {
    position: 'relative',
    margin: 'auto',
    marginBottom: 40,
    width: '85%',
    height: 56,
    backgroundColor: '#39527b',
  },
  searchBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'center',
  },
  searchInput: {
    // flex: 1,
    // minWidth: 0,
    // height: '100%',
    fontSize: 18,
    // color: colors.white,
    textAlign: 'center',
  },
  searchCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#314f69',
    marginLeft: 8,
  },

  sheetBackground: {
    backgroundColor: colors.panel,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: colors.border,
    ...(Platform.OS === 'android' ? { elevation: 10 } : {}),
  },

  // Header del sheet
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  // Chip conmutador Recientes ↔ Favoritos
  toggleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleChipActive: {
    backgroundColor: '#092235',
    borderColor: 'rgba(255,255,255,0.08)',
  },
  toggleText: { color: colors.secondary, fontWeight: '700', fontSize: 12 },
  toggleTextActive: { color: colors.white },

  // Tarjetas Recientes
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    gap: 12,
  },
  solidCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.highlight,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    ...(Platform.OS === 'android'
      ? { elevation: 4 }
      : { shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 6 } }),
  },
  chevBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.cardAlt,
    marginLeft: 10,
    borderWidth: 1, borderColor: colors.border,
  },
  chevBtnHighlight: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderColor: 'rgba(60,60,60,0.12)',
  },

  // Tarjetas Favoritos
  favCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  favCardHighlight: {
    backgroundColor: colors.highlight,
    borderColor: 'rgba(60,60,60,0.08)',
  },
  favIconBox: {
    width: 48, height: 48, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.secondary + '33',
    marginRight: 12,
    borderWidth: 1, borderColor: colors.border,
  },
  favIconBoxHighlight: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderColor: 'rgba(60,60,60,0.12)',
  },
  favTitle: { flex: 1, color: colors.white, fontWeight: '700' },
  favTitleHighlight: { color: '#2A2A2A', fontWeight: '700' },
  starBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.secondary + '33',
    marginLeft: 10,
    borderWidth: 1, borderColor: colors.border,
  },
  starBtnHighlight: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderColor: 'rgba(60,60,60,0.12)',
  },
})
