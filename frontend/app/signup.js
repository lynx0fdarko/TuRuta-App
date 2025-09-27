import { useState } from 'react'
import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../lib/supabase'
import { MaterialCommunityIcons } from '@expo/vector-icons'

// 👇 estilos globales
import { authStyles } from '../styles/auth'
import { buttonStyles } from '../styles/buttons'
import { colors } from '../styles/colors'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Debes ingresar correo y contraseña')
      return
    }
    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres')
      return
    }

    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      if (error.message.toLowerCase().includes('already')) {
        Alert.alert('Ya existe', 'Ese correo ya está registrado, inicia sesión.')
      } else {
        Alert.alert('Error al registrar', error.message)
      }
    } else {
      Alert.alert('Éxito', 'Revisa tu correo para confirmar tu cuenta')
      router.replace('/login')
    }
  }

  return (
    <View style={authStyles.container}>
      <Text style={authStyles.title}>Crear Cuenta ✨</Text>

      <TextInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        style={authStyles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Contraseña (mínimo 6 caracteres)"
        value={password}
        onChangeText={setPassword}
        style={authStyles.input}
        secureTextEntry
      />

      {/* Botón de registro */}
      <TouchableOpacity style={buttonStyles.primary} onPress={handleSignUp}>
        <MaterialCommunityIcons name="account-plus" size={22} color={colors.background} />
        <Text style={buttonStyles.primaryText}>Registrarse</Text>
      </TouchableOpacity>

      {/* Botón para volver a login */}
      <TouchableOpacity style={buttonStyles.outline} onPress={() => router.replace('/login')}>
        <Text style={buttonStyles.outlineText}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  )
}
