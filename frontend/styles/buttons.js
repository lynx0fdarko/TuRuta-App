// styles/buttons.js
// Estilos reutilizables para todos los botones de la app.
// Se combinan con iconos o textos según el caso.

import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { spacing } from './spacing';

const buttonRadius = 15;

export const buttonStyles = StyleSheet.create({
  primary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    padding: spacing.xs,
    borderRadius: buttonRadius,
    width: '100%',
  },
  // Variante oscura del botón primario para efectos pressed
  primaryPressed: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryPressed, // Color más oscuro
    padding: spacing.xs,
    borderRadius: buttonRadius,
    width: '100%',
  },
  primaryText: {
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondary: {
    flexDirection: 'row',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryDark,
    borderRadius: buttonRadius,
    width: '100%',
  },
  // Variante oscura del botón secundario
  secondaryPressed: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondaryDark,
    padding: spacing.xxs,
    paddingHorizontal: spacing.md,
    borderRadius: buttonRadius,
    width: '100%',
  },
  secondaryText: {
    fontWeight: 'bold',
  },
  outline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.secondaryLight,
    // padding: spacing.xs,
    borderRadius: buttonRadius,
    width: '100%',
    // marginTop: spacing.sm,
  },
  outlineText: {
    color: colors.secondaryLight,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  guest: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    padding: spacing.sm,
    borderRadius: buttonRadius,
    width: '100%'
  },
})
