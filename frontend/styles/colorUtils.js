// styles/colorUtils.js
// Utilidades para manipular colores

/**
 * Oscurece un color hexadecimal por un porcentaje dado
 * @param {string} color - Color en formato hex (#ffffff) o rgb
 * @param {number} amount - Cantidad a oscurecer (0-100)
 * @returns {string} Color oscurecido
 */
export function darkenColor(color, amount) {
  const usePound = color[0] === '#'
  const col = usePound ? color.slice(1) : color
  
  const r = parseInt(col.substring(0, 2), 16)
  const g = parseInt(col.substring(2, 4), 16)
  const b = parseInt(col.substring(4, 6), 16)
  
  const newR = Math.max(0, Math.floor(r * (100 - amount) / 100))
  const newG = Math.max(0, Math.floor(g * (100 - amount) / 100))
  const newB = Math.max(0, Math.floor(b * (100 - amount) / 100))
  
  const toHex = (c) => {
    const hex = c.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  
  return (usePound ? '#' : '') + toHex(newR) + toHex(newG) + toHex(newB)
}

/**
 * Aclara un color hexadecimal por un porcentaje dado
 * @param {string} color - Color en formato hex
 * @param {number} amount - Cantidad a aclarar (0-100)
 * @returns {string} Color aclarado
 */
export function lightenColor(color, amount) {
  const usePound = color[0] === '#'
  const col = usePound ? color.slice(1) : color
  
  const r = parseInt(col.substring(0, 2), 16)
  const g = parseInt(col.substring(2, 4), 16)
  const b = parseInt(col.substring(4, 6), 16)
  
  const newR = Math.min(255, Math.floor(r + (255 - r) * amount / 100))
  const newG = Math.min(255, Math.floor(g + (255 - g) * amount / 100))
  const newB = Math.min(255, Math.floor(b + (255 - b) * amount / 100))
  
  const toHex = (c) => {
    const hex = c.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  
  return (usePound ? '#' : '') + toHex(newR) + toHex(newG) + toHex(newB)
}

/**
 * Convierte color RGBA a hexadecimal
 * @param {string} rgba - Color en formato rgba(r,g,b,a)
 * @returns {string} Color en hex
 */
export function rgbaToHex(rgba) {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/)
  if (!match) return rgba
  
  const r = parseInt(match[1])
  const g = parseInt(match[2])
  const b = parseInt(match[3])
  
  const toHex = (c) => {
    const hex = c.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  
  return '#' + toHex(r) + toHex(g) + toHex(b)
}

/**
 * Convierte un color a su versión oscura para efectos hover/press
 * @param {string} color - Color base
 * @returns {string} Color oscurecido para efectos
 */
export function getHoverColor(color) {
  // Si es rgba, convertir a hex primero
  const hexColor = color.startsWith('rgba') ? rgbaToHex(color) : color
  return darkenColor(hexColor, 15) // Oscurece 15%
}

/**
 * Genera variaciones de un color
 * @param {string} baseColor - Color base
 * @returns {object} Objeto con variaciones del color
 */
export function getColorVariations(baseColor) {
  const hexColor = baseColor.startsWith('rgba') ? rgbaToHex(baseColor) : baseColor
  
  return {
    base: baseColor,
    light: lightenColor(hexColor, 20),
    lighter: lightenColor(hexColor, 40),
    dark: darkenColor(hexColor, 20),
    darker: darkenColor(hexColor, 40),
    hover: darkenColor(hexColor, 15),
    pressed: darkenColor(hexColor, 25)
  }
}