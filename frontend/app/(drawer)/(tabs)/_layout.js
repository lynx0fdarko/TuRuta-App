// app/(drawer)/(tabs)/_layout.js
import { View } from 'react-native'
import { Tabs } from 'expo-router'
import { colors } from '../../../styles/colors'
import FloatingBar from '../../../components/FloatingBar'

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.muted,
        }}
      >
        <Tabs.Screen name="home"   options={{ title: 'Direcciones' }} />
        <Tabs.Screen name="stops"  options={{ title: 'Paradas y Horario' }} />
        {/* 👉 renombrado */}
        <Tabs.Screen name="routes" options={{ title: 'Rutas' }} />
      </Tabs>

      <FloatingBar />
    </View>
  )
}
