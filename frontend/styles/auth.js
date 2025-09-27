// styles/auth.js
// Estilos específicos para pantallas de autenticación (login/signup).
// Aquí se dejan solo contenedores, títulos e inputs.
// Los botones se importan desde buttons.js.

import { StyleSheet } from 'react-native'
import { colors } from './colors'
import { spacing } from './spacing'

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
    color: colors.primary,
  },
  input: {
    width: '100%',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
})
