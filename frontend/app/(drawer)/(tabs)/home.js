import React, { useRef, useMemo } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native'
import BottomSheet, { BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import GlassBox from '../../../components/GlassBox'
import { colors } from '../../../styles/colors'
import { typography } from '../../../styles/typography'

const COLLAPSED_PERCENT = 0.40 // sheet al 40%
const { height: WIN_H } = Dimensions.get('window')
const SEARCH_BOTTOM = Math.round(WIN_H * COLLAPSED_PERCENT) + 12 // buscador pegado al borde del sheet

export default function Home() {
  const bottomSheetRef = useRef(null)
  const snapPoints = useMemo(() => ['40%', '75%'], [])

  const trips = [
    { id: 1, from: 'San judas',        to: 'UNICIT',         time: 'Hace 2h' },
    { id: 2, from: 'Mercado Oriental', to: 'Metrocentro',    time: 'Ayer', highlighted: true },
    { id: 3, from: 'Ticuantepe',       to: 'Managua centro', time: 'Lunes' },
  ]

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Gradiente diagonal */}
      <LinearGradient
        colors={[colors.bgStart, colors.bgEnd]}
        start={{ x: 0.1, y: 0.0 }}
        end={{ x: 1.0, y: 1.0 }}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Avatar (opcional) */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.avatarBtn} activeOpacity={0.8}>
            <MaterialCommunityIcons name="account" size={28} color={colors.iconOnBlue} />
          </TouchableOpacity>
        </View>

        {/* Buscador ANCLADO al borde superior del sheet (posición absoluta) */}
        <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
          <View style={[styles.searchAnchor, { bottom: SEARCH_BOTTOM }]}>
            <GlassBox radius={16} padding={8} intensity={Platform.OS === 'android' ? 42 : 34} shadow={false} style={styles.searchGlass}>
              <View style={styles.searchBox}>
                <TextInput
                  placeholder="¿A dónde vas?"
                  placeholderTextColor={colors.textSoft}
                  style={styles.searchInput}
                  returnKeyType="search"
                  underlineColorAndroid="transparent"
                />
                <TouchableOpacity style={styles.searchCircle}>
                  <MaterialCommunityIcons name="magnify" size={22} color={colors.white} />
                </TouchableOpacity>
              </View>
            </GlassBox>
          </View>
        </View>

        {/* BottomSheet (el panel cubre el buscador al subir) */}
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          index={0}
          backgroundStyle={styles.sheetBackground}
          handleIndicatorStyle={{ backgroundColor: colors.handle }}
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              appearsOnIndex={1}      // 👈 no bloquea el buscador en 40%
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
            {/* Título + chip Favoritos */}
            <View style={styles.titleRow}>
              <Text style={[typography.h2, { color: colors.white }]}>Viajes recientes</Text>
              <TouchableOpacity style={styles.favChip} activeOpacity={0.8}>
                <MaterialCommunityIcons name="map-marker" size={16} color={colors.white} />
                <Text style={styles.favText}>Favoritos</Text>
              </TouchableOpacity>
            </View>

            {/* Tarjetas */}
            {trips.map((trip) => (
              <View key={trip.id} style={[styles.cardWrap, trip.highlighted && styles.cardWrapHighlight]}>
                <View style={[styles.leadIcon, trip.highlighted && styles.leadIconHighlight]}>
                  <MaterialCommunityIcons
                    name={trip.highlighted ? 'navigation-variant' : 'transit-connection-variant'}
                    size={20}
                    color={trip.highlighted ? '#3C3C3C' : colors.iconOnBlue}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[typography.h3, trip.highlighted ? styles.cardTitleHighlight : styles.cardTitle]}>
                    {trip.from} ➜ {trip.to}
                  </Text>
                  <Text style={trip.highlighted ? styles.cardTimeHighlight : styles.cardTime}>
                    {trip.time}
                  </Text>
                </View>

                <TouchableOpacity style={[styles.chevBtn, trip.highlighted && styles.chevBtnHighlight]}>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={22}
                    color={trip.highlighted ? '#3C3C3C' : colors.iconOnBlue}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </BottomSheetScrollView>
        </BottomSheet>
      </SafeAreaView>
    </View>
  )
}

const RADIUS = 16

const styles = StyleSheet.create({
  headerRow: {
    paddingHorizontal: 16,
    paddingTop: 4,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  avatarBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.border,
  },

  // Buscador anclado arriba del sheet
  searchAnchor: {
    position: 'absolute',
    left: 0, right: 0,
    alignItems: 'center',
  },
  searchGlass: { width: '88%', maxWidth: 520 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 48,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
  },
  searchCircle: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.22)',
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

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  favChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.chipBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  favText: { color: colors.white, fontWeight: '700', fontSize: 12 },

  cardWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: RADIUS,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardWrapHighlight: {
    backgroundColor: colors.highlight,
    borderColor: 'rgba(60,60,60,0.08)',
  },
  leadIcon: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.cardAlt,
    marginRight: 12,
    borderWidth: 1, borderColor: colors.border,
  },
  leadIconHighlight: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderColor: 'rgba(60,60,60,0.12)',
  },
  cardTitle: { color: colors.white, fontWeight: '700' },
  cardTitleHighlight: { color: '#2A2A2A', fontWeight: '700' },
  cardTime: { color: colors.textSoft, marginTop: 2 },
  cardTimeHighlight: { color: '#4E4E4E', marginTop: 2 },
  chevBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.cardAlt,
    marginLeft: 10,
    borderWidth: 1, borderColor: colors.border,
  },
  chevBtnHighlight: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderColor: 'rgba(60,60,60,0.12)',
  },
})
