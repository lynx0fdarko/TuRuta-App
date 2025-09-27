// app/(drawer)/_layout.js
import { Drawer } from 'expo-router/drawer'
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { colors } from '../../styles/colors'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'expo-router'
import { View, Text } from 'react-native'

function CustomDrawerContent(props) {
  const router = useRouter()
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  return (
    <DrawerContentScrollView {...props}>
      {/* Encabezado del drawer */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.primary }}>TuRuta</Text>
        <Text style={{ color: colors.secondary, marginTop: 4 }}>Mejor que esperar sin saber.</Text>
      </View>

      {/* Rutas generadas por expo-router (el (tabs)) */}
      <DrawerItemList {...props} />

      {/* Acciones extra */}
      <DrawerItem
        label="Perfil"
        onPress={() => router.push('/(drawer)/(tabs)/home')}
        icon={({ color, size }) => <MaterialCommunityIcons name="account-circle" color={color} size={size} />}
      />
      <DrawerItem
        label="Cerrar sesión"
        onPress={handleLogout}
        icon={({ color, size }) => <MaterialCommunityIcons name="logout" color={color} size={size} />}
      />
    </DrawerContentScrollView>
  )
}

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.muted,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      {/* El grupo de Tabs como una "pantalla" del Drawer */}
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: 'Inicio',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" color={color} size={size} />
          ),
        }}
      />
    </Drawer>
  )
}
