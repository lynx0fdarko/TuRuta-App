// app/(drawer)/profile/index.js
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert, Platform, Image } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import GlassBox from '../../../components/GlassBox'
import { colors } from '../../../styles/colors'
// import { supabase } from '../../../lib/supabase' // ← descomenta si usarás Supabase

export default function ProfileScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  // Mock inicial; reemplaza con tu data real
  const [profile, setProfile] = useState({
    name: 'Usuario EnRuta',
    email: 'usuario@enruta.com',
    phone: '+505 8888 8888',
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

  const call = () => {
    if (!profile.phone) return Alert.alert('Sin teléfono', 'No hay número registrado.')
    Linking.openURL(`tel:${profile.phone.replace(/\s+/g, '')}`)
  }

  const mail = () => {
    if (!profile.email) return Alert.alert('Sin correo', 'No hay correo registrado.')
    Linking.openURL(`mailto:${profile.email}`)
  }

  const edit = () => {
    // Crea luego app/(drawer)/profile/edit.js si quieres edición real
    Alert.alert('Editar', 'Aquí abrirías la pantalla para editar el perfil.')
    // router.push('/(drawer)/profile/edit')
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Fondo en degradado, como Home */}
      <LinearGradient
        colors={[colors.bgStart, colors.bgEnd]}
        start={{ x: 0.1, y: 0.0 }}
        end={{ x: 1.0, y: 1.0 }}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 8) }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.circleBtn} accessibilityLabel="Volver">
            <MaterialCommunityIcons name="chevron-left" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Perfil</Text>
          {/* Espaciador para equilibrar el layout */}
          <View style={{ width: 40 }} />
        </View>

        {/* Card principal con efecto vidrio */}
        <View style={styles.content}>
          <GlassBox radius={18} padding={20} intensity={Platform.OS === 'android' ? 40 : 32} shadow style={styles.card}>
            <View style={styles.avatarWrap}>
              {profile.avatarUrl ? (
                <Image source={{ uri: profile.avatarUrl }} style={styles.avatarImg} />
              ) : (
                <View style={styles.avatarFallback}>
                  <MaterialCommunityIcons name="account" size={42} color={colors.white} />
                </View>
              )}
            </View>

            <Text style={styles.name} numberOfLines={1}>{profile.name}</Text>
            {!!profile.email && <Text style={styles.secondary}>{profile.email}</Text>}
            {!!profile.phone && <Text style={styles.secondary}>{profile.phone}</Text>}

            {/* Acciones */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionBtn} onPress={call}>
                <MaterialCommunityIcons name="phone" size={20} color="#1C325B" />
                <Text style={styles.actionText}>Llamar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={mail}>
                <MaterialCommunityIcons name="email" size={20} color="#1C325B" />
                <Text style={styles.actionText}>Correo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={edit}>
                <MaterialCommunityIcons name="pencil" size={20} color="#1C325B" />
                <Text style={styles.actionText}>Editar</Text>
              </TouchableOpacity>
            </View>
          </GlassBox>

          {/* Sección info adicional (opcional) */}
          <GlassBox radius={14} padding={16} intensity={24} style={styles.extraBox}>
            <View style={styles.row}>
              <MaterialCommunityIcons name="shield-check" size={18} color={colors.iconOnBlue} />
              <Text style={styles.extraText}>Cuenta verificada</Text>
            </View>
            <View style={styles.row}>
              <MaterialCommunityIcons name="map-marker" size={18} color={colors.iconOnBlue} />
              <Text style={styles.extraText}>Managua, Nicaragua</Text>
            </View>
          </GlassBox>
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
  headerTitle: { color: colors.white, fontSize: 18, fontWeight: '800' },
  circleBtn: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1, borderColor: colors.border,
  },

  content: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarWrap: {
    alignSelf: 'center',
    marginBottom: 12,
  },
  avatarImg: { width: 86, height: 86, borderRadius: 43 },
  avatarFallback: {
    width: 86, height: 86, borderRadius: 43,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center', justifyContent: 'center',
  },
  name: { color: colors.white, fontSize: 20, fontWeight: '800', textAlign: 'center' },
  secondary: { color: colors.textSoft, textAlign: 'center', marginTop: 2 },

  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18, gap: 10 },
  actionBtn: {
    flex: 1,
    backgroundColor: '#EAEFF7',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#C5D3EA',
  },
  actionText: { color: '#1C325B', fontWeight: '700', marginTop: 2 },

  extraBox: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  extraText: { color: colors.white },
})
