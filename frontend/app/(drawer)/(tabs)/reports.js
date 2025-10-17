// app/(drawer)/(tabs)/reports.js
import React, { useMemo, useRef, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native'
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import GlassBox from '../../../components/GlassBox'
import { colors } from '../../../styles/colors'
import { typography } from '../../../styles/typography'

const CATEGORIES = [
  { key: 'delay', label: 'Retraso', icon: 'clock-alert' },
  { key: 'accident', label: 'Accidente', icon: 'car-emergency' },
  { key: 'detour', label: 'Desvío', icon: 'arrow-decision-auto' },
  { key: 'condition', label: 'Estado de unidad', icon: 'bus' },
  { key: 'security', label: 'Seguridad', icon: 'shield-alert' },
]

export default function ReportsScreen() {
  const [selected, setSelected] = useState('delay')
  const [message, setMessage] = useState('')
  const [route, setRoute] = useState('')
  const [submitted, setSubmitted] = useState([])

  const messageRef = useRef(null)
  const routeRef = useRef(null)

  const sheetRef = useRef(null)
  const snapPoints = useMemo(() => ['45%', '80%'], [])

  const onSubmit = () => {
    if (!message.trim()) {
      Keyboard.dismiss()
      Alert.alert('Falta descripción', 'Cuenta brevemente lo sucedido.')
      return
    }
    Keyboard.dismiss()
    const fake = {
      id: String(Date.now()),
      category: selected,
      message: message.trim(),
      route: route.trim(),
      created_at: new Date().toISOString(),
    }
    setSubmitted((arr) => [fake, ...arr])
    setMessage('')
    setRoute('')
    Alert.alert('¡Gracias!', 'Tu reporte ha sido enviado.')
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ flex: 1 }}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={[typography.h1, { color: colors.white }]}>Reportes ciudadanos</Text>
              <Text style={[typography.small, { color: colors.textSoft }]}>
                Retrasos, accidentes, desvíos, estado de unidades o seguridad.
              </Text>
            </View>

            {/* Formulario */}
            <View style={{ paddingHorizontal: 16 }}>
              <GlassBox radius={16} padding={12} intensity={28} shadow={false} style={{ marginBottom: 12 }}>
                <Text style={[typography.h2, { color: colors.white, marginBottom: 8 }]}>Crear reporte</Text>

                {/* Categorías */}
                <View style={styles.catRow}>
                  {CATEGORIES.map((c) => {
                    const active = c.key === selected
                    return (
                      <TouchableOpacity
                        key={c.key}
                        style={[styles.catChip, active && styles.catChipActive]}
                        onPress={() => setSelected(c.key)}
                        activeOpacity={0.9}
                      >
                        <MaterialCommunityIcons
                          name={c.icon}
                          size={18}
                          
                          color="#fff"
                        />
                        <Text style={[styles.catText, active && styles.catTextActive]}>{c.label}</Text>
                      </TouchableOpacity>
                    )
                  })}
                </View>

                {/* Ruta / unidad */}
                <TextInput
                  ref={routeRef}
                  value={route}
                  onChangeText={setRoute}
                  placeholder="Ruta o unidad (opcional)"
                  placeholderTextColor={colors.textSoft}
                  style={styles.input}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => messageRef.current?.focus()}
                />

                {/* Descripción */}
                <TextInput
                  ref={messageRef}
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Describe lo ocurrido (lugar, hora, referencia)…"
                  placeholderTextColor={colors.textSoft}
                  style={[styles.input, { height: 96, textAlignVertical: 'top' }]}
                  multiline
                  returnKeyType="done"
                  blurOnSubmit={true}
                  onSubmitEditing={onSubmit}
                />

                <TouchableOpacity style={styles.submitBtn} onPress={onSubmit} activeOpacity={0.95}>
                  <MaterialCommunityIcons name="send" size={18} color={colors.white} />
                  <Text style={styles.submitText}>Enviar reporte</Text>
                </TouchableOpacity>
              </GlassBox>
            </View>

            {/* Listado en BottomSheet */}
            <BottomSheet
              ref={sheetRef}
              index={0}
              snapPoints={snapPoints}
              backgroundStyle={styles.sheetBackground}
              handleIndicatorStyle={{ backgroundColor: colors.handle }}
              keyboardBehavior="extend"
              keyboardBlurBehavior="restore"
            >
              <BottomSheetScrollView
                contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.titleRow}>
                  <Text style={[typography.h2, { color: colors.white }]}>Mis reportes</Text>
                </View>

                {submitted.length === 0 ? (
                  <Text style={[typography.body, { color: colors.textSoft }]}>
                    Aún no has enviado reportes. Cuando envíes, aparecerán aquí.
                  </Text>
                ) : (
                  submitted.map((r) => (
                    <GlassBox key={r.id} radius={14} padding={12} intensity={22} shadow={false} style={{ marginBottom: 10 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <MaterialCommunityIcons
                          name={CATEGORIES.find((c) => c.key === r.category)?.icon || 'alert'}
                          size={20}
                          color={colors.primary}
                        />
                        <Text style={[typography.h3, { color: colors.white }]}>
                          {CATEGORIES.find((c) => c.key === r.category)?.label || 'Incidencia'}
                        </Text>
                      </View>
                      {!!r.route && (
                        <Text style={[typography.small, { color: colors.secondary, marginTop: 4 }]}>
                          Ruta/Unidad: {r.route}
                        </Text>
                      )}
                      <Text style={[typography.body, { color: colors.white, marginTop: 6 }]}>
                        {r.message}
                      </Text>
                      <Text style={[typography.caption, { color: colors.textSoft, marginTop: 6 }]}>
                        {new Date(r.created_at).toLocaleString()}
                      </Text>
                    </GlassBox>
                  ))
                )}
              </BottomSheetScrollView>
            </BottomSheet>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  catRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  catChipActive: {
    backgroundColor: '#092235',
    borderColor: 'rgba(255,255,255,0.08)',
  },
  catText: { color: colors.secondary, fontWeight: '700', fontSize: 12 },
  catTextActive: { color: colors.white },
  input: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.white,
    marginBottom: 10,
  },
  submitBtn: {
    marginTop: 6,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    ...(Platform.OS === 'android'
      ? { elevation: 3 }
      : { shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } }),
  },
  submitText: { color: colors.white, fontWeight: '700' },
  sheetBackground: {
    backgroundColor: colors.panel,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: colors.border,
    ...(Platform.OS === 'android' ? { elevation: 10 } : {}),
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
})
