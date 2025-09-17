import { useState } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { MotiView } from 'moti'
import { Ionicons } from '@expo/vector-icons'

export default function Home() {
  const [query, setQuery] = useState('')
  const routes = [
    { id: '1', name: 'Ruta 111 – Metrocentro' },
    { id: '2', name: 'Ruta 102 – Mercado Oriental' },
    { id: '3', name: 'Ruta 120 – UCA' },
  ]

  const filtered = routes.filter(r => r.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿A dónde vas?</Text>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#555" />
        <TextInput
          placeholder="Buscar ruta o destino"
          value={query}
          onChangeText={setQuery}
          style={styles.input}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <MotiView from={{ translateX: -20, opacity: 0 }} animate={{ translateX: 0, opacity: 1 }}>
            <TouchableOpacity style={styles.item}>
              <Ionicons name="bus" size={20} color="#2f6c52" />
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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1, borderColor: '#ccc', borderRadius: 12,
    paddingHorizontal: 10, marginBottom: 15
  },
  input: { flex: 1, padding: 10 },
  item: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemText: { fontSize: 16, marginLeft: 10 },
})
