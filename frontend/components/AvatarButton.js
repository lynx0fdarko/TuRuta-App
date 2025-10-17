
import { LinearGradient } from 'expo-linear-gradient'
import PropTypes from 'prop-types'
import { memo } from 'react'
import { Image, Platform, Pressable, StyleSheet, View } from 'react-native'
import { AccountSvgIcon } from './icons/SvgIcons'

/**
 * AvatarButton
 * - Muestra foto (uri) o ícono SVG personalizado.
 * - Estilo circular con sombra, borde suave y brillo superior.
 * - onPress navega al perfil si no se provee otro handler.
 */
function AvatarButton({
  uri = null,
  size = 56,
  onPress,
  containerStyle,
  bgColor = '#86A8C9',            // azul suave del botón
  iconColor = '#FFFFFF',
  outline = false,                // Si true, muestra solo bordes del ícono
}) {
  const radius = size / 2
  const iconSize = Math.round(size * 0.5)

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Abrir perfil"
      hitSlop={10}
      style={[
        styles.shadowWrap,
        {
          width: size,
          height: size,
          borderRadius: radius,
        },
        containerStyle,
      ]}
    >
      {/* Círculo base */}
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: '100%',
            backgroundColor: bgColor,
            borderColor: 'rgba(255,255,255,0.35)', // borde fino translúcido
          },
        ]}
      >
        {/* Brillo superior */}
        <LinearGradient
          pointerEvents="none"
          colors={['rgba(255,255,255,0.38)', 'rgba(255,255,255,0.12)', 'transparent']}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[
            styles.gloss,
            {
              borderRadius: radius,
            },
          ]}
        />

        {/* Foto o ícono */}
        {uri ? (
          <Image
            source={{ uri }}
            resizeMode="cover"
            style={{
              width: size * 0.78,
              height: size * 0.78,
              borderRadius: (size * 0.78) / 2,
            }}
          />
        ) : (
          <AccountSvgIcon 
            size={iconSize} 
            color={iconColor} 
            outline={outline}
          />
        )}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  shadowWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.22,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 8 },
      },
      android: { elevation: 1 },
    }),
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1, // borde suave
    overflow: 'hidden', // recorta el brillo
  },
  gloss: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '60%', // brillo solo arriba
  }
})

// Validación de props para AvatarButton
AvatarButton.propTypes = {
  uri: PropTypes.string,                    // URL de la imagen del avatar (opcional)
  size: PropTypes.number,                   // Tamaño del avatar en píxeles
  onPress: PropTypes.func,                  // Función a ejecutar al presionar
  containerStyle: PropTypes.oneOfType([    // Estilos adicionales del contenedor
    PropTypes.object,
    PropTypes.array
  ]),
  bgColor: PropTypes.string,                // Color de fondo del avatar
  iconColor: PropTypes.string,              // Color del ícono por defecto
  outline: PropTypes.bool,                  // Si true, muestra solo bordes del ícono
}

// Valores por defecto
AvatarButton.defaultProps = {
  uri: null,
  size: 56,
  onPress: undefined,
  containerStyle: {},
  bgColor: '#86A8C9',
  iconColor: '#FFFFFF',
  outline: false,
}

export default memo(AvatarButton)
