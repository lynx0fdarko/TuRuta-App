import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { MotiView } from 'moti'
import { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Alert, Image, ImageBackground, Pressable, Text, View } from 'react-native'
import { supabase } from '../lib/supabase'

// estilos globales
import { authStyles } from '../styles/auth'
import { buttonStyles } from '../styles/buttons'
import { colors } from '../styles/colors'
import { spacing } from '../styles/spacing'

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
    <ImageBackground 
      style={[authStyles.backgroundImage, authStyles.container]}
      source={require('../assets/login/Managua-se-renueva-117-nuevos-buses-Yutong-fortalecen-el-transporte.webp')}
      resizeMode='cover'
      imageStyle={{ marginLeft: -320, width: '200%' }}
    >
      <View style={{
        display: 'flex',
        position: 'absolute',
        top: '33%',
      }}>
        <Image source={require('../assets/images/Icono-blanco.png')} style={{
          width: 'auto',
          height: 120,
          resizeMode: 'contain',
        }}/>
        <Text style={{
          color: '#FFFFFF',
          fontSize: 48,
          fontWeight: 'bold',
          textAlign: 'center',
        }}>EnRuta</Text>
      </View>
      <View style={{
        width: '120%',
        height: '40%',
        position: 'absolute', 
        bottom: 0,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: '100%',
        borderTopRightRadius: '100%',
        opacity: 0.85,
      }}/>

      <View style={{
        display: 'flex',
        justifyContent: 'center',
        height: '40%',
        position: 'absolute',
        bottom: 0,
        width: '80%',
      }}>
        <Text style={authStyles.title}>Bienvenido a EnRuta</Text>
        <Text style={{
          textAlign: 'center',
          color: colors.secondary,
          marginBottom: spacing.sm
        }}>¡Escoge tu destino,{'\n'}nosotros tu mejor ruta!</Text>
        <View style={{ display: 'flex', gap: 6, width: '60%', alignSelf: 'center' }}>
          {/* Botón Login */}
          <MotiView from={{ scale: 0.98, opacity: 0.9 }} animate={{ scale: 1, opacity: 1 }}>
            <Pressable
              style={[buttonStyles.primary, (loading || !isFormValid) && { opacity: 0.6 }, { padding: 6 }]}
              onPress={handleLogin}
              disabled={loading || !isFormValid}
              accessibilityRole="button"
              accessibilityLabel="Iniciar sesión"
            >
              {loading ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <>
                  <MaterialCommunityIcons name="login" size={22} color={colors.secondary} />
                  <Text style={[buttonStyles.primaryText, { color: colors.secondary }]}>Iniciar Sesión</Text>
                </>
              )}
            </Pressable>
          </MotiView>

          {/* Crear cuenta */}
          <MotiView from={{ translateY: 20, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }} transition={{ delay: 150 }}>
            <Pressable
              style={[buttonStyles.outline, loading && { opacity: 0.6 }, { padding: 4 }]}
              onPress={() => router.push('/signup')}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel="Crear cuenta"
            >
              <MaterialCommunityIcons name="account-plus" size={22} color={colors.secondary} />
              <Text style={buttonStyles.outlineText}>Crear Cuenta</Text>
            </Pressable>
          </MotiView>

          {/* Invitado */}
          <MotiView from={{ translateY: 20, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }} transition={{ delay: 300 }}>
            <Pressable
              style={[buttonStyles.guest, loading && { opacity: 0.6 }]}
              onPress={handleGuest}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel="Entrar como invitado"
            >
              <MaterialCommunityIcons name="account-off" size={22} color={colors.background} />
              <Text style={[buttonStyles.primaryText, { color: colors.white }]}>Entrar como Invitado</Text>
            </Pressable>
          </MotiView>
        </View>
      </View>
    </ImageBackground>
  )
}
