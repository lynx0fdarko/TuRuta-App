// app/index.js
import { useEffect, useRef } from 'react'
import { View, Animated, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { supabase } from '../lib/supabase'

export default function Index() {
  const fadeAnim = useRef(new Animated.Value(1)).current
  const router = useRouter()

  useEffect(() => {
    // chequea si hay sesión guardada
    supabase.auth.getSession().then(({ data }) => {
      const destino = data.session ? '/(drawer)/(tabs)/home' : '/login'
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1500,
        delay: 1000,
        useNativeDriver: true,
      }).start(() => {
        router.replace(destino)
      })
    })
  }, [fadeAnim, router])

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Ionicons name="bus" size={120} color="#2f6c52" />
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
})
