// styles/buttons.js
// Estilos reutilizables para todos los botones de la app.
// Se combinan con iconos o textos según el caso.

import { StyleSheet } from 'react-native'
import { colors } from './colors'
import { spacing } from './spacing'

export const buttonStyles = StyleSheet.create({
  primary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 25,
    width: '100%',
    marginTop: spacing.sm,
  },
  primaryText: {
    color: colors.background,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  outline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    padding: spacing.md,
    borderRadius: 25,
    width: '100%',
    marginTop: spacing.sm,
  },
  outlineText: {
    color: colors.primary,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  guest: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    padding: spacing.md,
    borderRadius: 25,
    width: '100%',
    marginTop: spacing.md,
  },
})
