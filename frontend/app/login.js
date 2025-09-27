import { useEffect, useMemo, useState } from 'react'
import { View, Text, TextInput, Alert, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../lib/supabase'
import { MotiView } from 'moti'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native-gesture-handler'

// estilos globales
import { authStyles } from '../styles/auth'
import { buttonStyles } from '../styles/buttons'
import { colors } from '../styles/colors'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Si ya hay sesión, manda a Home
  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data } = await supabase.auth.getSession()
      if (mounted && data?.session) router.replace('/(drawer)/(tabs)/home')
    })()
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (session) router.replace('/(drawer)/(tabs)/home')
    })
    return () => {
      mounted = false
      sub?.subscription?.unsubscribe?.()
    }
  }, [router])

  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email])
  const isFormValid = useMemo(
    () => emailRegex.test(normalizedEmail) && password.length >= 6,
    [normalizedEmail, password]
  )

  const guard = () => {
    if (loading) return 'busy'
    if (!normalizedEmail || !password) {
      Alert.alert('Faltan datos', 'Ingresa correo y contraseña')
      return 'missing'
    }
    if (!emailRegex.test(normalizedEmail)) {
      Alert.alert('Correo inválido', 'Revisa el formato del correo')
      return 'bad-email'
    }
    if (password.length < 6) {
      Alert.alert('Contraseña débil', 'La contraseña debe tener al menos 6 caracteres')
      return 'weak-pass'
    }
    return null
  }

  const handleLogin = async () => {
    const g = guard()
    if (g) return
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
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

  const handleGuest = () => {
    if (loading) return
    router.replace('/(drawer)/(tabs)/home')
  }

  return (
    <View style={authStyles.container}>
      <Text style={authStyles.title}>Bienvenido a EnRuta 🚍</Text>

      <TextInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        style={authStyles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        inputMode="email"
        returnKeyType="next"
      />

      <TextInput
        placeholder="Contraseña (mínimo 6)"
        value={password}
        onChangeText={setPassword}
        style={authStyles.input}
        secureTextEntry
        returnKeyType="done"
      />

      {/* Botón Login */}
      <MotiView from={{ scale: 0.98, opacity: 0.9 }} animate={{ scale: 1, opacity: 1 }}>
        <TouchableOpacity
          style={[buttonStyles.primary, (loading || !isFormValid) && { opacity: 0.6 }]}
          onPress={handleLogin}
          disabled={loading || !isFormValid}
          accessibilityRole="button"
          accessibilityLabel="Iniciar sesión"
        >
          {loading ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <>
              <MaterialCommunityIcons name="login" size={22} color={colors.background} />
              <Text style={buttonStyles.primaryText}>Iniciar Sesión</Text>
            </>
          )}
        </TouchableOpacity>
      </MotiView>

      {/* Crear cuenta */}
      <MotiView from={{ translateY: 20, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }} transition={{ delay: 150 }}>
        <TouchableOpacity
          style={[buttonStyles.outline, loading && { opacity: 0.6 }]}
          onPress={() => router.push('/signup')}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="Crear cuenta"
        >
          <MaterialCommunityIcons name="account-plus" size={22} color={colors.primary} />
          <Text style={buttonStyles.outlineText}>Crear Cuenta</Text>
        </TouchableOpacity>
      </MotiView>

      {/* Invitado */}
      <MotiView from={{ translateY: 20, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }} transition={{ delay: 300 }}>
        <TouchableOpacity
          style={[buttonStyles.guest, loading && { opacity: 0.6 }]}
          onPress={handleGuest}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="Entrar como invitado"
        >
          <MaterialCommunityIcons name="account-off" size={22} color={colors.background} />
          <Text style={buttonStyles.primaryText}>Entrar como Invitado</Text>
        </TouchableOpacity>
      </MotiView>
    </View>
  )
}
