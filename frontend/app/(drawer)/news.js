// app/(drawer)/news.js
import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import GlassBox from '../../components/GlassBox'
import { colors } from '../../styles/colors'
import { typography } from '../../styles/typography'
// import { supabase } from '../../lib/supabase' // ← cuando conectes backend

const CATEGORY_META = {
  traffic:  { label: 'Tráfico',       icon: 'traffic-light' },
  notice:   { label: 'Comunicado',    icon: 'bullhorn' },
  detour:   { label: 'Desvío',        icon: 'arrow-decision-auto' },
  safety:   { label: 'Seguridad',     icon: 'shield-alert' },
  service:  { label: 'Servicio',      icon: 'bus' },
}

const NEWS_MOCK = [
  {
    id: 'n1',
    title: 'Desvío temporal en Carretera Masaya',
    content: 'Trabajos de reparación entre Rotonda Ticuantepe y Km 13. Buses toman ruta alterna por Veracruz.',
    category: 'detour',
    created_at: new Date().toISOString(),
  },
  {
    id: 'n2',
    title: 'Incremento de demanda 7:00–9:00 AM',
    content: 'Refuerzos en rutas 102 y 110. Se recomienda llegar 10 minutos antes a su parada.',
    category: 'service',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: 'n3',
    title: 'Precaución en Mercado Oriental',
    content: 'Reportes de carterismo. Evite usar el teléfono a la vista en paradas cercanas.',
    category: 'safety',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
]

export default function NewsScreen() {
  const [items, setItems] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  const loadNews = useCallback(async () => {
    setRefreshing(true)
    try {
      // ← Conecta a Supabase cuando esté listo:
      // const { data, error } = await supabase
      //   .from('news')
      //   .select('*')
      //   .order('created_at', { ascending: false })
      // if (error) throw error
      // setItems(data)

      // Mock local:
      setItems(NEWS_MOCK)
    } catch (e) {
      console.warn('news load error:', e)
    } finally {
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { loadNews() }, [loadNews])

  const renderItem = ({ item }) => {
    const meta = CATEGORY_META[item.category] || { label: 'General', icon: 'newspaper-variant-outline' }
    return (
      <GlassBox radius={16} padding={14} intensity={26} shadow={false} style={{ marginBottom: 12 }}>
        <View style={styles.cardHeader}>
          <View style={styles.catPill}>
            <MaterialCommunityIcons name={meta.icon} size={14} color={colors.white} />
            <Text style={styles.catText}>{meta.label}</Text>
          </View>
          <Text style={styles.dateText}>
            {new Date(item.created_at).toLocaleString()}
          </Text>
        </View>

        <Text style={[typography.h3, { color: colors.white, marginBottom: 6 }]} numberOfLines={2}>
          {item.title}
        </Text>

        <Text style={[typography.body, { color: colors.textSoft }]} numberOfLines={3}>
          {item.content}
        </Text>

        <TouchableOpacity
          style={styles.moreBtn}
          activeOpacity={0.9}
          onPress={() => {} /* aquí podrías abrir un modal con el detalle */}
        >
          <Text style={styles.moreText}>Ver más</Text>
          <MaterialCommunityIcons name="chevron-right" size={18} color={colors.white} />
        </TouchableOpacity>
      </GlassBox>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={[typography.h1, { color: colors.white }]}>Noticias</Text>
          <Text style={[typography.small, { color: colors.textSoft }]}>
            Comunicados, desvíos y avisos importantes.
          </Text>
        </View>

        <FlatList
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
          data={items}
          keyExtractor={(it) => it.id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={loadNews} tintColor={colors.primary} />
          }
          ListEmptyComponent={
            <Text style={[typography.body, { color: colors.textSoft, paddingHorizontal: 16 }]}>
              No hay noticias por ahora.
            </Text>
          }
        />
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  catPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  catText: { color: colors.white, fontSize: 12, fontWeight: '700' },
  dateText: { color: colors.textSoft, fontSize: 12 },

  moreBtn: {
    marginTop: 10,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    ...(Platform.OS === 'android'
      ? { elevation: 2 }
      : { shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } }),
  },
  moreText: { color: colors.white, fontWeight: '700', fontSize: 13 },
})
