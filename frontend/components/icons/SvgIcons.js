// components/icons/SvgIcons.js
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import Svg, { Defs, FeDropShadow, Filter, Path } from 'react-native-svg';


// Función helper para convertir hex a RGBA
function hexToRgba(hex, opacity = 1) {
  // Remover el # si existe
  hex = hex.replace('#', '');
  
  // Convertir a RGB
  const r = Number.parseInt(hex.substring(0, 2), 16);
  const g = Number.parseInt(hex.substring(2, 4), 16);
  const b = Number.parseInt(hex.substring(4, 6), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function colorToRgba(color, opacity = 1) {
  // Si ya es RGBA, cambiar solo la opacidad
  if (color.startsWith('rgba')) {
    return color.replaceAll(/[\d.]+\)$/g, `${opacity})`);
  }
  
  // Si es RGB, convertir a RGBA
  if (color.startsWith('rgb')) {
    return color.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
  }
  
  // Si es hex, convertir
  if (color.startsWith('#')) {
    return hexToRgba(color, opacity);
  }
  
  // Para colores con nombre, necesitarías un mapa o librería
  return color;
}

// Helper para aplicar sombras a SVG
const getSvgShadowStyle = (color, shadowIntensity = 0.3) => ({
  ...Platform.select({
    ios: {
      shadowColor: color,
      shadowOpacity: shadowIntensity,
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 2 },
    },
    android: { 
      elevation: 2,
    },
  }),
})

/**
 * AccountSvgIcon - Ícono SVG de cuenta personalizado con sombra nativa SVG
 * Ventajas: Sin fondo cuadrado, mejor control de sombras, más suave
 * @param {number} size - Tamaño del ícono
 * @param {string} color - Color del ícono
 * @param {boolean} outline - Si true, muestra solo los bordes sin relleno
 * @param {number} strokeWidth - Grosor del borde cuando outline=true
 */
export function AccountSvgIcon({ 
  size = 24, 
  color = '#FFFFFF', 
  outline = false, 
  strokeWidth = 1
}) {
  return (
    <Svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24"
    >
      {/* Definición del filtro de sombra */}
      <Defs>
        <Filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <FeDropShadow 
            dx={0}          // Desplazamiento horizontal
            dy={2}          // Desplazamiento vertical
            stdDeviation={3} // Difuminado de la sombra
            floodOpacity={0.4} // Opacidad de la sombra
            floodColor="#000" // Color de la sombra
          />
        </Filter>
      </Defs>
      
      {/* Path del ícono de cuenta con filtro de sombra */}
      <Path
        d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"
        fill={outline ? colorToRgba(color, 0.35) : color}
        stroke={outline ? color : 'none'}
        strokeWidth={outline ? strokeWidth : 0}
        filter="url(#shadow)"
      />
    </Svg>
  )
}

// Ícono de usuario/cuenta
export function UserSvgIcon({ size = 24, color = '#000', shadow = false }) {
  return (
    <Svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24"
      style={shadow ? getSvgShadowStyle(color) : {}}
    >
      <Path
        d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"
        fill={color}
      />
    </Svg>
  )
}

// Ícono de configuración
export function SettingsSvgIcon({ size = 24, color = '#000', shadow = false }) {
  return (
    <Svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24"
      style={shadow ? getSvgShadowStyle(color) : {}}
    >
      <Path
        d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"
        fill={color}
      />
    </Svg>
  )
}

// Ícono de home
export function HomeSvgIcon({ size = 24, color = '#000', shadow = false }) {
  return (
    <Svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24"
      style={shadow ? getSvgShadowStyle(color) : {}}
    >
      <Path
        d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"
        fill={color}
      />
    </Svg>
  )
}

// Ícono de bus (para tu app de transporte)
export function BusSvgIcon({ size = 24, color = '#000', shadow = false }) {
  return (
    <Svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24"
      style={shadow ? getSvgShadowStyle(color) : {}}
    >
      <Path
        d="M18,11H6V6H18M16.5,17A1.5,1.5 0 0,1 15,15.5A1.5,1.5 0 0,1 16.5,14A1.5,1.5 0 0,1 18,15.5A1.5,1.5 0 0,1 16.5,17M7.5,17A1.5,1.5 0 0,1 6,15.5A1.5,1.5 0 0,1 7.5,14A1.5,1.5 0 0,1 9,15.5A1.5,1.5 0 0,1 7.5,17M4,16C4,16.88 4.39,17.67 5,18.22V20A1,1 0 0,0 6,21H7A1,1 0 0,0 8,20V19H16V20A1,1 0 0,0 17,21H18A1,1 0 0,0 19,20V18.22C19.61,17.67 20,16.88 20,16V6C20,2.5 16.42,2 12,2C7.58,2 4,2.5 4,6V16Z"
        fill={color}
      />
    </Svg>
  )
}

// PropTypes para validación

AccountSvgIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  outline: PropTypes.bool,
  strokeWidth: PropTypes.number,
}

AccountSvgIcon.defaultProps = {
  size: 24,
  color: '#FFFFFF',
  outline: false,
  strokeWidth: 1,
}

UserSvgIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  shadow: PropTypes.bool,
}

UserSvgIcon.defaultProps = {
  size: 24,
  color: '#000',
  shadow: false,
}

SettingsSvgIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  shadow: PropTypes.bool,
}

SettingsSvgIcon.defaultProps = {
  size: 24,
  color: '#000',
  shadow: false,
}

HomeSvgIcon.propTypes = { 
  size: PropTypes.number,
  color: PropTypes.string,
  shadow: PropTypes.bool,
}

HomeSvgIcon.defaultProps = {
  size: 24,
  color: '#000',
  shadow: false,
}

BusSvgIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  shadow: PropTypes.bool,
}

BusSvgIcon.defaultProps = {
  size: 24,
  color: '#000',
  shadow: false,
}
