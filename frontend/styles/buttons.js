// styles/buttons.js
// Estilos reutilizables para todos los botones de la app.

import { StyleSheet } from 'react-native'
import { colors } from './colors'
import { spacing } from './spacing'

const buttonRadius = 15

export const buttonStyles = StyleSheet.create({
  // PRIMARIO
  primary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: buttonRadius,
    width: '100%',
  },
  primaryPressed: {
    backgroundColor: colors.primaryPressed,
  },
  primaryText: {
    color: colors.white,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  // SECUNDARIO (llamado "secondary" en tu archivo)
  secondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryDark,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: buttonRadius,
    width: '100%',
  },
  secondaryPressed: {
    backgroundColor: colors.secondaryDark,
  },
  secondaryText: {
    color: colors.white,
    fontWeight: 'bold',
  },

  // OUTLINE
  outline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.secondaryLight,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: buttonRadius,
    width: '100%',
  },
  outlinePressed: {
    borderColor: colors.primaryPressed,
    backgroundColor: colors.primaryHover,
  },
  outlineText: {
    color: colors.secondaryLight,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  // INVITADO
  guest: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: buttonRadius,
    width: '100%',
  },
  guestPressed: {
    backgroundColor: colors.secondaryDark,
  },
  guestText: {
    color: colors.white,
    fontWeight: 'bold',
    marginLeft: 8,
  },
})
