// app/(drawer)/profile/index.js
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert, Platform, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { colors } from '../../../styles/colors'
// ⬇️ Si usas Supabase para auth/perfil, descomenta esto:
// import { supabase } from '../../../lib/supabase'

export default function ProfileScreen() {
  const router = useRouter()
  // Mock inicial; luego puedes cargar de Supabase
  const [profile, setProfile] = useState({
    name: 'Usuario EnRuta',
    email: 'usuario@enruta.com',
    phone: '+505 8888 8888',
    avatarUrl: null, // URL de imagen si tienes
  })

  // Ejemplo de carga desde Supabase (opcional)
  // useEffect(() => {
  //   (async () => {
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

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header simple */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.circleBtn}>
          <MaterialCommunityIcons name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Card principal */}
      <View style={styles.card}>
        <View style={styles.avatarWrap}>
          {profile.avatarUrl ? (
            <Image source={{ uri: profile.avatarUrl }} style={styles.avatarImg} />
          ) : (
            <MaterialCommunityIcons name="account" size={42} color="#fff" />
          )}
        </View>

        <Text style={styles.name}>{profile.name}</Text>
        {!!profile.email && <Text style={styles.secondary}>{profile.email}</Text>}
        {!!profile.phone && <Text style={styles.secondary}>{profile.phone}</Text>}

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={call}>
            <MaterialCommunityIcons name="phone" size={20} color="#1C325B" />
            <Text style={styles.actionText}>Llamar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={mail}>
            <MaterialCommunityIcons name="email" size={20} color="#1C325B" />
            <Text style={styles.actionText}>Correo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => Alert.alert('Editar', 'Aquí abrirías la edición del perfil.')}
          >
            <MaterialCommunityIcons name="pencil" size={20} color="#1C325B" />
            <Text style={styles.actionText}>Editar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#22335F' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 10,
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  circleBtn: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },

  card: {
    margin: 16, padding: 20, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 14, shadowOffset: { width: 0, height: 8 } },
      android: { elevation: 4 },
    }),
  },
  avatarWrap: {
    width: 84, height: 84, borderRadius: 42,
    alignSelf: 'center', alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 12,
  },
  avatarImg: { width: 84, height: 84, borderRadius: 42 },
  name: { color: '#fff', fontSize: 20, fontWeight: '800', textAlign: 'center' },
  secondary: { color: '#C7D2FE', textAlign: 'center', marginTop: 2 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, gap: 10 },
  actionBtn: {
    flex: 1, backgroundColor: '#EAEFF7', borderRadius: 12, paddingVertical: 12,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#C5D3EA',
  },
  actionText: { color: '#1C325B', fontWeight: '700', marginTop: 2 },
})
