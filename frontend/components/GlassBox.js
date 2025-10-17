// components/GlassBox.js
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import { Platform, StyleSheet, View } from 'react-native'
import { colors } from '../styles/colors'

export default function GlassBox({
  children,
  radius = 28,
  padding = 12,
  intensity = 34,
  style,
  shadow = false,
  childrenStyle = {
    display: 'flex',
    flexDirection: 'row',
  }
}) {
  const borderColor =
    Platform.OS === 'android' ? 'rgba(255,255,255,0.20)' : colors.border

  const androidOverlayColors = [
    'rgba(255,255,255,0.06)',
    'rgba(255,255,255,0.14)',
  ]

  return (
    <View style={[shadow ? styles.shadowWrap : null, { borderRadius: radius }]}>
      <View style={[styles.clip, { borderRadius: radius }, style]}>
        {/* MUY IMPORTANTE: no bloquear toques */}
        <BlurView
          pointerEvents="none"               // ← deja pasar los taps al TextInput
          tint="dark"
          intensity={Platform.OS === 'android' ? Math.max(intensity, 40) : intensity}
          style={StyleSheet.absoluteFill}
        />

        {Platform.OS === 'android' && (
          <LinearGradient
            pointerEvents="none"             // ← igual aquí
            colors={androidOverlayColors}
            style={StyleSheet.absoluteFill}
          />
        )}

        {/* Borde sutil (ya estaba sin eventos) */}
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            { borderColor, borderWidth: 1, borderRadius: radius },
          ]}
        />

        <View style={[childrenStyle,{ padding }]}>{children}</View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  shadowWrap: {
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
      },
      android: { elevation: 8 },
    }),
  },
  clip: {
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  children: {
    display: 'flex',
    flexDirection: 'row',
  }
})
