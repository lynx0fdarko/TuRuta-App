import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { MotiView } from 'moti'
import { Ionicons } from '@expo/vector-icons'

export default function Favorites() {
  const favs = [
    { id: '1', name: 'Ruta 111 – Metrocentro' },
    { id: '2', name: 'Parada UCA' },
  ]

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favoritos ⭐</Text>
      <FlatList
        data={favs}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: index * 150 }}
          >
            <TouchableOpacity style={styles.item}>
              <Ionicons name="star" size={20} color="#f5a623" />
              <Text style={styles.itemText}>{item.name}</Text>
            </TouchableOpacity>
          </MotiView>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 10 },
  item: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemText: { fontSize: 16, marginLeft: 10 },
})
