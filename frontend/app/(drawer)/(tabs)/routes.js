// app/(drawer)/(tabs)/routes.js
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { useRouter } from 'expo-router'
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import AvatarButton from '../../../components/AvatarButton'
import GlassBox from '../../../components/GlassBox'
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
  const yellowArtifact = require('../../../assets/images/Artifact.png')

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
    backgroundColor: 'transparent',
    borderWidth: 0,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 6 } },
      android: { elevation: 0 },
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
  badgeText: { color: '#4B5A43', fontWeight: '900', fontSize: 16 },
  badgeRound: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E7EDC9', alignItems: 'center', justifyContent: 'center' },

  infoBox: { backgroundColor: BLUE_CARD + 'D6' },
  routeTitle: { color: '#10324A', fontSize: 16, fontWeight: '800', marginBottom: 6 },
  routePath: { color: '#10324A', fontSize: 13, lineHeight: 18 },
  more: { color: '#0B2C6E', fontWeight: '900' }, // aparece solo si lineCount>2
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
