// app/(drawer)/(tabs)/routes.js
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { useRouter } from 'expo-router'
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import AvatarButton from '../../../components/AvatarButton'
import GlassBox from '../../../components/GlassBox'
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
  const router = useRouter()
  const yellowArtifact = require('../../../assets/images/Artifact.png')

  return (
    <SafeAreaView style={styles.safe}>
      <Image source={yellowArtifact} style={{
        position: 'absolute',
        width: 200,
        height: 225,
        top: -50,
        left: -45,
        transform: [{ rotate: '200deg' }]
      }}/>
      <Image source={yellowArtifact} style={{
        position: 'absolute',
        width: 200,
        height: 225,
        top: '28%',
        right: -105,
        transform: [{ rotate: '-30deg' }]
      }}/>
      <Image source={yellowArtifact} style={{
        position: 'absolute',
        width: 275,
        height: 325,
        bottom: -110,
        left: 0,
        transform: [{ rotate: '55deg' }],
        objectFit: 'contain'
      }}/>
      {/* ===== Header “vidrio” con menos espacio arriba ===== */}
      <View style={[styles.headerRow, { paddingTop: Math.max(insets.top - 4, 8) }]}>
        
        {/* Perfil (blur circle) */}
        <BlurView intensity={35} tint="extraLight" style={styles.blurCircle}>
          <AvatarButton
            size={90}
            uri={null}
            bgColor='rgba(255,255,255,0.35)'
            iconColor='rgba(255,255,255, 0.85)'
            onPress={() => router.push('/(drawer)/profile')}
            outline={true}
          />
        </BlurView>

        {/* Centro: tarjeta blur con título */}
        <BlurView intensity={35} tint="light" style={styles.blurCard}>
          <View style={styles.blurCardInner}>
            <Text style={styles.menuTitle}>El dorado → Los Robles</Text>
            <Text style={styles.menuSubtitle}>Ruta 105 - 15 min</Text>
          </View>
          {/* Buscar (blur circle) */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {}}
          >
            <BlurView intensity={35} tint="light" style={[styles.blurCircle, { boxShadow: 'none', marginRight: 3 }]}>
              <MaterialCommunityIcons name="magnify" size={22} color={colors.white} />
            </BlurView>
          </TouchableOpacity>
        </BlurView>

      </View>

      {/* ===== Lista ===== */}
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 90 }}>
        {DATA.map((item) => (
          <View key={item.id} style={styles.cardWrap}>
            <View style={styles.rowTop}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.id}</Text>
                <MaterialCommunityIcons name="clock-check-outline" size={18} color="#FFF" />
              </View>
            </View>

            <GlassBox radius={18} padding={14} shadow={Platform.OS === 'android'} style={styles.infoBox}>
              <View style={{ flex: 1, marginStart: 12 }}>
                <Text style={styles.routeTitle} numberOfLines={6}>{item.title}</Text>
                <Text style={styles.routePath} numberOfLines={6}>
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
const BLUE_CARD = '#8fbac1'

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: YELLOW },

  /* ===== Header ===== */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    marginRight: 25,
  },
  blurCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#00000010',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 0 },
    }),
    boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.25)',
  },
  blurCard: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    flex: 1,
    paddingVertical: 6,
    borderRadius: 100,
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#00000010',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 6 } },
      android: { elevation: 4 },
    }),
    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.25)',
  },
  blurCardInner: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    color: '#FFF',
    marginLeft: 20,
    padding: 0
  },
  menuTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
  menuSubtitle: {
    color: '#FFF',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 2,
    fontWeight: '200'
  },

  /* ===== Lista ===== */
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
  rowTop: { flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 10,
  },
  badge: {
    flexDirection: 'row',
    gap: 15,
    backgroundColor: '#96a996',
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)',
  },
  badgeText: { color: '#303959', fontWeight: '900', fontSize: 16 },
  badgeRound: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#E7EDC9',
    alignItems: 'center', justifyContent: 'center',
  },
  infoBox: {
    backgroundColor: '#8fbac1',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)',
  },
  routeTitle: {
    color: '#10324A',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2,
    lineHeight: 12
  },
  routePath: {
    color: '#10324A',
    fontSize: 11,
    lineHeight: 12
  },
  more: { color: '#0B2C6E', fontWeight: '900' },
  airBtn: {
    marginRight: -10,
    alignSelf: 'center',
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
