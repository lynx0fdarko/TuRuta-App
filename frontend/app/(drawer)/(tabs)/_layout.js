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
          tabBarStyle: { display: 'none' }, // ocultamos la tab bar nativa
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.muted,
        }}
      >
        {/* Direcciones (Home) */}
        <Tabs.Screen name="home" options={{ title: 'Direcciones' }} />
        {/* Paradas y Horario */}
        <Tabs.Screen name="stops" options={{ title: 'Paradas y Horario' }} />
        {/* Recorridos */}
        <Tabs.Screen name="favorites" options={{ title: 'Recorridos' }} />
      </Tabs>

      {/* Barra flotante de navegación */}
      <FloatingBar />
    </View>
  )
}
