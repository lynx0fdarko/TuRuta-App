// components/FloatingBar.js
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter, usePathname } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { colors } from '../styles/colors'

/**
 * Configuración de tabs → icono + ruta
 */
const TABS = [
  { name: 'home', icon: 'magnify', aria: 'Direcciones' },
  { name: 'stops', icon: 'bus-stop', aria: 'Paradas y horarios' },
  { name: 'favorites', icon: 'routes', aria: 'Recorridos' },
]

export default function FloatingBar() {
  const router = useRouter()
  const pathname = usePathname()
  const insets = useSafeAreaInsets()

  const go = (name) => router.replace(`/(drawer)/(tabs)/${name}`)

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <View
        style={[
          styles.wrap,
          { bottom: Math.max(insets.bottom + 12, 20) }, // respeta SafeArea
        ]}
        pointerEvents="box-none"
      >
        <BlurView intensity={40} tint="light" style={styles.glass}>
          {TABS.map(({ name, icon, aria }) => {
            const active =
              pathname?.includes(`/(drawer)/(tabs)/${name}`) ||
              pathname?.endsWith(`/${name}`)
            return (
              <TouchableOpacity
                key={name}
                onPress={() => go(name)}
                accessibilityRole="button"
                accessibilityLabel={aria}
                style={[styles.item, active && styles.itemActive]}
              >
                <MaterialCommunityIcons
                  name={icon}
                  size={24}
                  color={active ? colors.primary : colors.text}
                />
              </TouchableOpacity>
            )
          })}
        </BlurView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  glass: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.85)', // fallback si blur falla
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 6,
  },
  item: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemActive: {
    backgroundColor: 'rgba(47,108,82,0.12)', // tono del primary con alpha
  },
})
