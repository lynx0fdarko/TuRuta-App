// styles/layout.js
// Estilos de estructura general: contenedores, filas, tarjetas.
// Sirven para pantallas como Home, Map, Favorites.

import { StyleSheet } from 'react-native'
import { colors } from './colors'
import { spacing } from './spacing'

export const layout = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: spacing.md,
  },
})
