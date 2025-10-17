// app/(drawer)/profile/index.js
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert, Image, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import GlassBox from '../../../components/GlassBox'
import { AccountSvgIcon, colorToRgba } from '../../../components/icons/SvgIcons'
import { colors } from '../../../styles/colors'
// import { supabase } from '../../../lib/supabase' // ← descomenta si usarás Supabase

export default function ProfileScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  // Mock inicial; reemplaza con tu data real
  const [profile, setProfile] = useState({
    name: 'Usuario EnRuta',
    email: 'usuario@enruta.com',
    avatarUrl: null, // URL de foto; si es null mostramos ícono
  })

  // Ejemplo de carga desde Supabase (opcional)
  // useEffect(() => {
  //   ;(async () => {
  //     const { data: { user } } = await supabase.auth.getUser()
  //     if (!user) return
  //     const { data, error } = await supabase
  //       .from('profiles')
  //       .select('full_name, phone, avatar_url')
  //       .eq('id', user.id)
  //       .single()
  //     if (!error && data) {
  //       setProfile({
  //         name: data.full_name ?? user.email,
  //         email: user.email,
  //         phone: data.phone ?? '',
  //         avatarUrl: data.avatar_url ?? null,
  //       })
  //     }
  //   })()
  // }, [])

  const CloseSign = () => {
    Alert.alert('Cerrando Sesion.')
  }

  const edit = () => {
    // Crea luego app/(drawer)/profile/edit.js si quieres edición real
    Alert.alert('Editar', 'Aquí abrirías la pantalla para editar el perfil.')
    // router.push('/(drawer)/profile/edit')
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#272C61' }}>

      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 8) }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.circleBtn} accessibilityLabel="Volver">
            <MaterialCommunityIcons name="chevron-left" size={48} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Perfil</Text>
          {/* Espaciador para equilibrar el layout */}
          <View style={{ width: 40, marginLeft: 23 }} />
        </View>

        {/* Card principal con efecto vidrio */}
        <View style={styles.content}>
          <GlassBox
            radius={18}
            padding={20}
            intensity={Platform.OS === 'android' ? 40 : 32}
            style={styles.card}
            childrenStyle={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}
          >
            <View style={styles.avatarWrap}>
              {profile.avatarUrl ? (
                <Image source={{ uri: profile.avatarUrl }} style={styles.avatarImg} />
              ) : (
                <View style={styles.avatarFallback}>
                  <AccountSvgIcon 
                    size={48} 
                    color={"#FFF"} 
                    outline={true}
                  />
                </View>
              )}
            </View>

            <View style={{ display: 'flex', flexDirection: 'column' }}>
              <Text style={styles.name}>{profile.name}</Text>
              {!!profile.email && <Text style={styles.secondary}>{profile.email}</Text>}
              {/* {!!profile.phone && <Text style={styles.secondary}>{profile.phone}</Text>} */}
            </View>


            {/* Acciones */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionBtn} onPress={edit}>
                <Text style={styles.actionText}>Editar Perfil</Text>
              </TouchableOpacity>
            
              <TouchableOpacity style={styles.actionBtn} onPress={CloseSign}>
                <Text style={styles.actionText}>Cerrar Sesion</Text>
              </TouchableOpacity>
            </View>
          </GlassBox>

          {/* Sección info adicional (opcional) */}
          {/* <GlassBox radius={14} padding={16} intensity={24} style={styles.extraBox}>
            <View style={styles.row}>
              <MaterialCommunityIcons name="shield-check" size={18} color={colors.iconOnBlue} />
              <Text style={styles.extraText}>Cuenta verificada</Text>
            </View>
            <View style={styles.row}>
              <MaterialCommunityIcons name="map-marker" size={18} color={colors.iconOnBlue} />
              <Text style={styles.extraText}>Managua, Nicaragua</Text>
            </View>
          </GlassBox> */}
        </View>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { color: colors.white, fontSize: 24, fontWeight: '800' },
  circleBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },

  content: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    // flex: 1,
    borderWidth: 2,
    borderColor: colors.border,
    width: '100%',
    height: 250,
    borderRadius: 40,

  },
  avatarWrap: {
    alignSelf: 'center',
    marginBottom: 12,
  },
  avatarImg: { width: 86, height: 86, borderRadius: 43 },
  avatarFallback: {
    width: 94, height: 94, borderRadius: 62,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center', justifyContent: 'center',
    boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.25)',
    marginTop: -14,
  },
  name: { color: colors.white, fontSize: 22, fontWeight: '800', textAlign: 'center', marginTop: -15},
  secondary: { color: colors.textSoft, fontSize: 12, textAlign: 'center', marginTop: -1 },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 10
  },
  actionBtn: {
    flex: 1,
    backgroundColor: colorToRgba('#7394BA', 0.35),
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.35)',
    marginTop: -10,
  },
  actionText: {   color: '#FFF', fontWeight: '700', marginTop: 2 },

  extraBox: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  extraText: { color: colors.white },
})
