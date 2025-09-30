// app/login/credentials.js
import { useMemo, useState } from 'react'
import { View, Text, TextInput, StyleSheet, Alert, Pressable, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { LinearGradient } from 'expo-linear-gradient'

import { supabase } from '../../lib/supabase'
import { colors } from '../../styles/colors'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export default function CredentialsScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const isValid = useMemo(() => emailRegex.test(email.trim()) && password.length >= 6, [email, password])

  const doLogin = async () => {
    if (!isValid || loading) return
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })
      if (error) {
        const msg = (error.message || '').toLowerCase()
        if (msg.includes('email not confirmed')) {
          Alert.alert('Correo no confirmado', 'Confirma tu correo antes de entrar.')
        } else if (msg.includes('invalid login')) {
          Alert.alert('Credenciales inválidas', 'Correo o contraseña incorrectos.')
        } else {
          Alert.alert('Error al iniciar sesión', error.message)
        }
        return
      }
      if (data?.session) router.replace('/(drawer)/(tabs)/home')
    } catch (e) {
      Alert.alert('Fallo inesperado', String(e?.message ?? e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <LinearGradient colors={['#f0f0f0', '#6b7278']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.screen}>
      {/* encabezado */}
      <View style={{ paddingHorizontal: 24 }}>
        <Text style={styles.title}>Iniciar{'\n'}sesión</Text>
        <Text style={styles.subtitle}>¿Ya tienes una cuenta? Ingresa los datos</Text>
      </View>

      {/* tarjeta amarilla */}
      <View style={styles.card}>
        <Text style={styles.brand}>EnRuta</Text>

        <Text style={styles.label}>Correo o Usuario</Text>
        <TextInput
          placeholder="tu@correo.com"
          placeholderTextColor="rgba(255,255,255,0.85)"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          inputMode="email"
          returnKeyType="next"
        />

        <Text style={[styles.label, { marginTop: 14 }]}>Contraseña</Text>
        <TextInput
          placeholder="••••••••"
          placeholderTextColor="rgba(255,255,255,0.85)"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
          returnKeyType="done"
        />

        <Pressable
          onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          onPress={() => {
            Haptics.selectionAsync()
            doLogin()
          }}
          style={({ pressed }) => [
            styles.cta,
            (!isValid || loading) && { opacity: 0.6 },
            pressed && { transform: [{ translateY: 1 }] },
          ]}
          disabled={!isValid || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name="login" size={20} color="#fff" />
              <Text style={styles.ctaText}>¡Comencemos!</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* botón para volver a la bienvenida */}
      <Pressable
        onPress={() => router.replace('/login')}
        style={({ pressed }) => [{ alignSelf: 'flex-end', marginTop: 10, marginRight: 24 }, pressed && { opacity: 0.6 }]}
      >
        <View style={styles.homeBtn}>
          <MaterialCommunityIcons name="home" size={18} color="#fff" />
          <Text style={styles.homeBtnText}>Inicio</Text>
        </View>
      </Pressable>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingTop: 48, paddingBottom: 24 },
  title: { fontSize: 40, fontWeight: '800', color: colors.secondary, lineHeight: 44 },
  subtitle: { color: colors.secondary, opacity: 0.85, marginTop: 6 },
  card: {
    marginTop: 16,
    marginHorizontal: 24,
    backgroundColor: colors.highlight,
    borderRadius: 28,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  brand: { textAlign: 'center', fontSize: 28, fontWeight: '800', color: colors.secondary, marginBottom: 8 },
  label: { color: colors.secondary, fontWeight: '600', marginBottom: 8 },
  input: {
    height: 48,
    borderRadius: 28,
    paddingHorizontal: 16,
    backgroundColor: colors.primary,
    color: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cta: {
    alignSelf: 'flex-end',
    marginTop: 18,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  ctaText: { color: '#fff', fontWeight: '800', marginLeft: 8 },
  homeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    elevation: 3,
  },
  homeBtnText: { color: '#fff', marginLeft: 6, fontWeight: '600' },
})
