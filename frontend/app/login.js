// app/login.js
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { MotiView } from 'moti'
import { useEffect } from 'react'
import { Image, ImageBackground, Pressable, Text, View } from 'react-native'
import * as Haptics from 'expo-haptics'

import { authStyles } from '../styles/auth'
import { buttonStyles } from '../styles/buttons'
import { colors } from '../styles/colors'
import { spacing } from '../styles/spacing'
import { supabase } from '../lib/supabase'

export default function LoginWelcome() {
  const router = useRouter()

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

  return (
    <ImageBackground
      style={[authStyles.backgroundImage, authStyles.container]}
      source={require('../assets/login/Managua-se-renueva-117-nuevos-buses-Yutong-fortalecen-el-transporte.webp')}
      resizeMode="cover"
      imageStyle={{ marginLeft: -320, width: '200%' }}
    >
      {/* Marca + título */}
      <View style={{ position: 'absolute', top: '33%' }}>
        <Image
          source={require('../assets/images/Icono-blanco.png')}
          style={{ width: 'auto', height: 120, resizeMode: 'contain' }}
        />
        <Text style={{ color: colors.white, fontSize: 48, fontWeight: 'bold', textAlign: 'center' }}>
          EnRuta
        </Text>
      </View>

      {/* ola inferior */}
      <View
        style={{
          width: '120%',
          height: '40%',
          position: 'absolute',
          bottom: 0,
          backgroundColor: colors.white,
          borderTopLeftRadius: 100,
          borderTopRightRadius: 100,
          opacity: 0.85,
        }}
      />

      {/* CTA container */}
      <View
        style={{
          justifyContent: 'center',
          height: '40%',
          position: 'absolute',
          bottom: 0,
          width: '80%',
        }}
      >
        <Text style={authStyles.title}>Bienvenido a EnRuta</Text>
        <Text style={{ textAlign: 'center', color: colors.secondary, marginBottom: spacing.sm }}>
          ¡Escoge tu destino,{'\n'}nosotros tu mejor ruta!
        </Text>

        <View style={{ gap: 6, width: '60%', alignSelf: 'center' }}>
          {/* Iniciar sesión → ir al formulario */}
          <MotiView from={{ scale: 0.98, opacity: 0.9 }} animate={{ scale: 1, opacity: 1 }}>
            <Pressable
              onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              onPress={() => {
                Haptics.selectionAsync()
                router.push('/login/credentials')
              }}
              style={({ pressed }) => [
                buttonStyles.primary,
                pressed && buttonStyles.primaryPressed,
                { padding: 6 },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Ir al formulario de inicio de sesión"
            >
              <MaterialCommunityIcons name="login" size={22} color={colors.white} />
              <Text style={buttonStyles.primaryText}>Iniciar sesión</Text>
            </Pressable>
          </MotiView>

          {/* Crear cuenta */}
          <MotiView from={{ translateY: 20, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }} transition={{ delay: 150 }}>
            <Pressable
              onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              onPress={() => {
                Haptics.selectionAsync()
                router.push('/signup')
              }}
              style={({ pressed }) => [
                buttonStyles.outline,
                pressed && buttonStyles.outlinePressed,
                { padding: 4 },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Crear cuenta"
            >
              <MaterialCommunityIcons name="account-plus" size={22} color={colors.secondaryLight} />
              <Text style={buttonStyles.outlineText}>Crear cuenta</Text>
            </Pressable>
          </MotiView>

          {/* Invitado */}
          <MotiView from={{ translateY: 20, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }} transition={{ delay: 300 }}>
            <Pressable
              onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              onPress={() => {
                Haptics.selectionAsync()
                router.replace('/(drawer)/(tabs)/home')
              }}
              style={({ pressed }) => [buttonStyles.guest, pressed && buttonStyles.guestPressed]}
              accessibilityRole="button"
              accessibilityLabel="Entrar como invitado"
            >
              <MaterialCommunityIcons name="account-off" size={22} color={colors.white} />
              <Text style={buttonStyles.guestText}>Entrar como invitado</Text>
            </Pressable>
          </MotiView>
        </View>
      </View>
    </ImageBackground>
  )
}
