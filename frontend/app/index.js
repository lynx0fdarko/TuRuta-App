import { useEffect, useRef } from 'react'
import { View, Animated, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

export default function Index() {
  const fadeAnim = useRef(new Animated.Value(1)).current
  const router = useRouter()

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1500,
      delay: 1000, // espera 1s antes de desvanecer
      useNativeDriver: true,
    }).start(() => {
      router.replace('/login')
    })
  }, [fadeAnim, router])

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        {/* Logo por defecto de Expo */}
        <Ionicons name="logo-react" size={120} color="#000" />
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
})
