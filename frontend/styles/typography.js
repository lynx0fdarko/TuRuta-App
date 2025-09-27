// styles/typography.js
// Define estilos de texto comunes en toda la app.
// Usa estos estilos en vez de escribir fontSize/fontWeight en cada pantalla.

import { StyleSheet } from 'react-native'
import { colors } from './colors'

export const typography = StyleSheet.create({
  h1: { fontSize: 28, fontWeight: 'bold', color: colors.text },
  h2: { fontSize: 22, fontWeight: '600', color: colors.text },
  body: { fontSize: 16, color: colors.text },
  small: { fontSize: 12, color: colors.secondary },
})
