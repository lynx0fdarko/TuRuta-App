// styles/colors.js
// Define la paleta de colores global de la app.
// Aquí cambias un color y se refleja en toda la aplicación.

import { getColorVariations } from './colorUtils'

// Colores base
const baseColors = {
  primary: 'rgba(62, 146, 207, 1)',   // botones, títulos
  secondary: '#282a61',               // botón invitado, textos secundarios
  background: '#c5ccd1',              // Fondo general
  text: '#000',                       // Texto normal
  border: '#11101049',                // Bordes de inputs, tarjetas
  danger: '#d9534f',                  // errores/alertas
  success: '#28a745',                 // mensajes de éxito
  info: '#17a2b8',                    // información
  white: '#FFFFFF',                   // blanco puro
  black: '#000000',                   // negro puro

  // Nuevas (mock)
  bgStart:   '#6A8DF8',               // degradado arriba
  bgEnd:     '#23315C',               // degradado abajo
  textSoft:  '#C7D2FE',               // subtítulos/fechas
  muted:     '#6E86B8',               // indicadores/handle
  panel:     '#3B517F',               // sheet “Viajes recientes”
  glass:     'rgba(255,255,255,0.10)', // vidrio leve
  cardGlass: 'rgba(255,255,255,0.08)', // tarjetas
  highlight: '#FFE69B',               // tarjeta amarilla

  card:      'rgba(255,255,255,0.10)', // azul vidrio de tarjeta normal
  cardAlt:   'rgba(255,255,255,0.18)', // azul un poco más claro (chips/areas)
  chipBg:    'rgba(0,0,0,0.22)',       // chip “Favoritos” sobre el panel
  handle:    '#7F90B7',                // barrita del sheet
  iconOnBlue:'#C9D6FF',                // iconos sobre azul
}

// Generar variaciones automáticamente
export const colors = {
  ...baseColors,

  // Variaciones del color primario
  primaryDark:    getColorVariations(baseColors.primary).dark,
  primaryDarker:  getColorVariations(baseColors.primary).darker,
  primaryLight:   getColorVariations(baseColors.primary).light,
  primaryLighter: getColorVariations(baseColors.primary).lighter,
  primaryHover:   getColorVariations(baseColors.primary).hover,
  primaryPressed: getColorVariations(baseColors.primary).pressed,

  // Variaciones del color secundario
  secondaryDark:  getColorVariations(baseColors.secondary).dark,
  secondaryLight: getColorVariations(baseColors.secondary).light,
  secondaryHover: getColorVariations(baseColors.secondary).hover,

  // Variaciones de colores de estado
  dangerDark:  getColorVariations(baseColors.danger).dark,
  successDark: getColorVariations(baseColors.success).dark,
  infoDark:    getColorVariations(baseColors.info).dark,
}

// #282a61 #eade59 #3e92cf #c5ccd1
