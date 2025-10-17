import { StyleSheet, Text, View } from 'react-native'
import AvatarButton from './AvatarButton'

/**
 * AvatarButtonDemo - Demostración de las opciones de AvatarButton
 * Muestra tanto el ícono relleno como el outline
 */
export function AvatarButtonDemo() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AvatarButton Demo</Text>
      
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Relleno (normal)</Text>
          <AvatarButton 
            size={60}
            bgColor="#86A8C9"
            iconColor="#FFFFFF"
            outline={false}
          />
        </View>
        
        <View style={styles.column}>
          <Text style={styles.label}>Solo bordes (outline)</Text>
          <AvatarButton 
            size={60}
            bgColor="#86A8C9"
            iconColor="#FFFFFF"
            outline={true}
          />
        </View>
      </View>
      
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Outline con color diferente</Text>
          <AvatarButton 
            size={60}
            bgColor="#E8F4F8"
            iconColor="#2196F3"
            outline={true}
          />
        </View>
        
        <View style={styles.column}>
          <Text style={styles.label}>Outline más grueso</Text>
          <AvatarButton 
            size={60}
            bgColor="#FFF3E0"
            iconColor="#FF9800"
            outline={true}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  column: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
})

export default AvatarButtonDemo