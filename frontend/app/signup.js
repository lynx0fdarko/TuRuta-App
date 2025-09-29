import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { supabase } from '../lib/supabase'

// 👇 estilos globales
import { carouselStyles, signUpStyles } from '../styles/auth'
import { buttonStyles } from '../styles/buttons'
import { colors } from '../styles/colors'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const router = useRouter()

  // Imágenes del carousel
  const carouselImages = [
    require('../assets/login/Nicaragua-buses-chinos-1.jpg'),
    require('../assets/login/Nicaragua-celebra-entrega-total-de-3-mil-autobuses-Yutong-scaled.jpg'),
    require('../assets/login/Managua-se-renueva-117-nuevos-buses-Yutong-fortalecen-el-transporte.webp'),
    require('../assets/login/Usuarios-de-Managua-podran-reportar-conductas-temerarias-en-autobuses-del-transporte-publico-.webp'),
  ]

  const yellowArtifact = require('../assets/images/Artifact.png')

  // Auto-scroll del carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000) // Cambia cada 5 segundos

    return () => clearInterval(interval)
  }, [carouselImages.length])

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
    <View style={signUpStyles.container}>
      <Text style={signUpStyles.title}>
        Crear{'\n'}Cuenta
      </Text>

      <Image source={yellowArtifact} style={{
        position: 'absolute',
        width: 200,
        height: 225,
        top: -120,
        right: 75,
        transform: [{ rotate: '235deg' }]
      }}/>
      <Image source={yellowArtifact} style={{
        position: 'absolute',
        width: 200,
        height: 225,
        left: -110,
        bottom: 150,
        transform: [{ rotate: '150deg' }]
      }}/>
      <Image source={yellowArtifact} style={{
        position: 'absolute',
        width: 200,
        height: 225,
        bottom: -45,
        right: -75, 
      }}/>

      {/* Carousel de imágenes */}
      <View style={carouselStyles.container}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexGrow: 1 }}>
          <Image
            source={carouselImages.at(currentImageIndex-1)}
            style={carouselStyles.image}
            resizeMode="cover"
          />
          <Image
            source={carouselImages.at(currentImageIndex)}
            style={[carouselStyles.image, { transform: [{ translateY: 45 }] }]}
            resizeMode="cover"
          />
          <Image
            source={carouselImages.at((currentImageIndex+1)%4)}
            style={carouselStyles.image}
            resizeMode="cover"
          />
        </View>
      </View>
      <View style={{ display: 'flex', width: '100%', margin: 15 }}>
        {/* Indicadores de puntos */}
        <View style={carouselStyles.pagination}>
          {carouselImages.map((image, index) => (
            <TouchableOpacity
              key={`dot-${image}`}
              onPress={() => setCurrentImageIndex(index)}
              style={[
                carouselStyles.paginationDot,
                index === currentImageIndex ? carouselStyles.paginationDotActive : null
              ]}
            />
          ))}
        </View>
      </View>

      <View style={{ display: 'flex', width: '50%', gap: 5 }}>
        <TextInput
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          style={signUpStyles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          style={signUpStyles.input}
          secureTextEntry
        />
        {/* Botón de registro */}
        <TouchableOpacity style={[buttonStyles.primary]} onPress={handleSignUp}>
          <MaterialCommunityIcons name="notebook-edit" size={16} color={colors.white} />
          <Text style={[buttonStyles.primaryText, { color: colors.white, fontSize: 12, paddingVertical: 2 }]}>Registrarse</Text>
        </TouchableOpacity>

        {/* Botón para volver a login */}
        <TouchableOpacity style={[buttonStyles.secondary]} onPress={() => router.replace('/login')}>
          <Text style={[buttonStyles.secondaryText, { color: colors.white, fontSize: 12, paddingVertical: 8 }]}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}
