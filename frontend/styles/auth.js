// styles/auth.js
// Estilos específicos para pantallas de autenticación (login/signup).
// Aquí se dejan solo contenedores, títulos e inputs.
// Los botones se importan desde buttons.js.

import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { spacing } from './spacing';

export const authStyles = StyleSheet.create({
  // Estilo para el ImageBackground component
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  // Método alternativo: Image absoluta
  absoluteBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    height: '100%',
  },
  // Overlay para oscurecer la imagen de fondo si es necesario
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Negro con 30% opacidad
  },
  // Overlay con gradiente (simulado)
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    // En React Native necesitarías expo-linear-gradient para gradientes reales
  },
  container: {
    // flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    // padding: spacing.lg,
    // Ya no necesitamos backgroundColor aquí
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    // marginBottom: spacing.lg,
    color: colors.secondary,
    // Agregar sombra para que se vea mejor sobre la imagen
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    textAlign: 'center'
  },
  input: {
    width: '100%',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginBottom: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparente
  },
})

export const signUpStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFABF'
  },
  title: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
    color: '#3E416D',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 12,
    fontSize: 12,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
  },
});

// Estilos para el carousel
// const { width: screenWidth } = Dimensions.get('window')

export const carouselStyles = StyleSheet.create({
  container: {
    display: 'flex',
    height: 250,
    marginBottom: 70,
    borderRadius: 15,
    overflow: 'visible',
    width: '150%',
    // width: screenWidth * 0.85,
    alignSelf: 'center',
    position: 'relative',
  },
  image: {
    width: '32%',
    height: '100%',
    borderRadius: 15,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 15,
    width: '100%',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(62, 65, 109, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: 'rgba(62, 65, 109, 1)',
    width: 12,
    height: 12,
    borderRadius: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
})
