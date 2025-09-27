// styles/forms.js
import { StyleSheet } from 'react-native'
import { colors } from './colors'
import { spacing } from './spacing'

export const formStyles = StyleSheet.create({
  // Input estándar reutilizable
  input: {
    width: '100%',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginBottom: spacing.md,
    backgroundColor: colors.background,
    color: colors.text,
    fontSize: 16,
  },

  // Barra de búsqueda más redondeada
  search: {
    width: '100%',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 25,
    marginBottom: spacing.lg,
    backgroundColor: colors.background,
    color: colors.text,
    fontSize: 16,
  },

  // Etiquetas pequeñas arriba de los inputs
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: spacing.xs,
    color: colors.text,
  },

  // Mensajes de error bajo el input
  error: {
    fontSize: 12,
    color: colors.danger,
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
  },
})
