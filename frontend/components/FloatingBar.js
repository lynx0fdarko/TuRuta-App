// components/FloatingBar.js
import React from 'react'
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import { useRouter, usePathname } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { colors } from '../styles/colors'

/** Tabs: icono + ruta */
const TABS = [
  { name: 'home',      icon: 'magnify',   aria: 'Direcciones' },
  { name: 'stops',     icon: 'bus-stop',  aria: 'Paradas y horarios' },
  { name: 'routes', icon: 'routes',   aria: 'Itinerarios y rutas' },
]

const PILL_RADIUS = 9999

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
          { bottom: Math.max(insets.bottom + 12, 20) }, // respeta la SafeArea
        ]}
        pointerEvents="box-none"
      >
        {/* Wrapper: SOLO sombra (sin overflow) */}
        <View style={styles.shadowWrap}>
          {/* Contenido: blur + borde redondo + overflow */}
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
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  // La sombra vive aquí — iOS usa shadow*, Android usa elevation
  shadowWrap: {
    width: '65%',
    borderRadius: PILL_RADIUS,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
      },
      android: { elevation: 6 },
    }),
  },

  // Blur + recorte redondeado
  glass: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: PILL_RADIUS,
    overflow: 'hidden',        // recorta el blur a la píldora
    paddingVertical: 16,
    paddingHorizontal: 18,
    ...Platform.select({
      // En Android, fallback de color por si el blur es tenue
      android: { backgroundColor: colors.primary },
      ios: { backgroundColor: 'transparent' },
    }),
  },

  item: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemActive: {
    backgroundColor: 'rgba(47,108,82,0.12)', // primary con alpha
  },
})
