import { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../lib/supabase'
import { MotiView } from 'moti'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native-gesture-handler'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  // Crear cuenta
  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      Alert.alert('Error al registrar', error.message)
    } else {
      Alert.alert('Éxito', 'Revisa tu correo para confirmar tu cuenta')
      router.replace('/(tabs)/home')
    }
  }

  // Iniciar sesión
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      Alert.alert('Error al iniciar sesión', error.message)
    } else {
      router.replace('/(tabs)/home')
    }
  }

  // Modo invitado
  const handleGuest = () => router.replace('/(tabs)/home')

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a TuRuta 🚍</Text>

      <TextInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      {/* Botón Login */}
      <MotiView from={{ scale: 0.9, opacity: 0.8 }} animate={{ scale: 1, opacity: 1 }}>
        <TouchableOpacity style={styles.buttonPrimary} onPress={handleLogin}>
          <MaterialCommunityIcons name="login" size={22} color="#fff" />
          <Text style={styles.textPrimary}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </MotiView>

      {/* Botón Crear cuenta */}
      <MotiView from={{ translateY: 20, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }} transition={{ delay: 200 }}>
        <TouchableOpacity style={styles.buttonOutline} onPress={handleSignUp}>
          <MaterialCommunityIcons name="account-plus" size={22} color="#2f6c52" />
          <Text style={styles.textOutline}>Crear Cuenta</Text>
        </TouchableOpacity>
      </MotiView>

      {/* Botón Invitado */}
      <MotiView from={{ translateY: 20, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }} transition={{ delay: 400 }}>
        <TouchableOpacity style={styles.buttonGuest} onPress={handleGuest}>
          <MaterialCommunityIcons name="account-off" size={22} color="#fff" />
          <Text style={styles.textPrimary}>Entrar como Invitado</Text>
        </TouchableOpacity>
      </MotiView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 25, color: '#2f6c52' },
  input: { width: '100%', padding: 14, borderWidth: 1, borderColor: '#ccc', borderRadius: 12, marginBottom: 12 },
  buttonPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2f6c52',
    padding: 14,
    borderRadius: 25,
    width: '100%',
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  textPrimary: { color: '#fff', fontWeight: 'bold', marginLeft: 8 },
  buttonOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#2f6c52',
    padding: 14,
    borderRadius: 25,
    width: '100%',
    marginTop: 12,
  },
  textOutline: { color: '#2f6c52', fontWeight: 'bold', marginLeft: 8 },
  buttonGuest: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#444',
    padding: 14,
    borderRadius: 25,
    width: '100%',
    marginTop: 18,
  },
})
