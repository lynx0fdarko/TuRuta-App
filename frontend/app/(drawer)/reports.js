// app/(drawer)/reports.js
import React, { useMemo, useRef, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native'
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import GlassBox from '../../components/GlassBox'
import { colors } from '../../styles/colors'
import { typography } from '../../styles/typography'

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

  const router = useRouter()

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
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ flex: 1 }}>
            {/* Header */}
           <View style={styles.header}>
  <Text style={[typography.h1, { color: '#313668' }]}>
    Reportes ciudadanos
  </Text>

  <TouchableOpacity
    style={styles.headerBtn}
    onPress={() => router.push('/home')}
  >
    <MaterialCommunityIcons name="arrow-left" size={18} color="#fff" />
    <Text style={styles.headerBtnText}>Inicio</Text>
  </TouchableOpacity>
</View>

            {/* Formulario */}
            <View style={{ paddingHorizontal: 16 }}>
              <GlassBox
                borderRadius={16}
                padding={12}
                intensity={Platform.OS === 'android' ? 40 : 32}
                 style={styles.card}
                 childrenStyle={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
                <Text style={[typography.h2, { color: '#313668', marginTop: -20, marginBottom: -5 }]}>Crear reporte</Text>
                {/* Categorías */}
              <View style={styles.catRow}>
  {CATEGORIES.map((c) => {
    const active = c.key === selected
    const extraStyle = c.key === 'condition' ? { marginLeft: 40 } : {} 
    return (
      <TouchableOpacity
        key={c.key}
        style={[styles.catChip, active && styles.catChipActive, extraStyle]} 
        onPress={() => setSelected(c.key)}
        activeOpacity={0.9}
      >
        <MaterialCommunityIcons name={c.icon} size={18} color="#fff" />
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
                  placeholderTextColor="#000"
                  style={[styles.input, { marginTop: -15}]}
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
                  placeholderTextColor="#000"
                  style={[styles.input, { height: 70, marginTop: -10, textAlignVertical: 'top' }]}
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
 header: {
  paddingHorizontal: 16,
  paddingTop: Platform.OS === 'android' ? 16 : 8,
  paddingBottom: 8,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start', // 👈 en vez de 'space-between'
  gap: 10, // separa el botón del título
},

  catRow: {
  flexDirection: 'row-reverse',
  flexWrap: 'wrap',
  gap: 8,
  marginBottom: 12,
  justifyContent: 'space-between',
},
catChip: {
  flexDirection: 'row',      
  alignItems: 'center',      // centra verticalmente icono y texto
  gap: 6,
  paddingHorizontal: 10,
  paddingVertical: 8,
  borderRadius: 99,
  backgroundColor: '#89A7BD',
  borderWidth: 1,
  borderColor: colors.border,
  width: '30%',
  justifyContent: 'center',  // centra ambos en el eje horizontal
},
catChipActive: {
  backgroundColor: '#0d395aff',
  borderColor: 'rgba(255,255,255,0.08)',
},
catText: {
  color: '#fff',
  fontWeight: '700',
  fontSize: 12,
},
catTextActive: {
  color: colors.white,
},
  input: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.white,
    marginBottom: 10,
  },
 submitBtn: {
  marginTop: -2, // antes 6, sube el botón
  backgroundColor: '#889fafff',
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
    backgroundColor: '#364d5eff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: colors.border,
    ...(Platform.OS === 'android' ? { elevation: 10 } : {}),
  },
  
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12
   },
   card: {
  display: 'flex',
  flexDirection: 'column',
  borderWidth: 1.5,
  borderColor: colors.border,
  width: '100%',
  borderRadius: 30,
  backgroundColor: 'rgba(255, 255, 255, 0.08)',
  alignSelf: 'center',
  padding: 8,
  justifyContent: 'center',
  alignItems: 'center',
  transform: [{ scale: 1 }], // 👈 escala todo el bloque y su contenido
  
},
headerBtn: {
  flexDirection: 'row',
  alignItems: 'stretch',
  backgroundColor: '#89A7BD',
  paddingHorizontal: 12,
  paddingVertical: 4,
  borderRadius: 40,
  transform: [{ translateY: 5 }],
  gap: 5,
  width: 80,
  height: 30,
  ...(Platform.OS === 'android'
    ? { elevation: 3 }
    : {
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      }),
},
headerBtnText: {
  color: '#fff',
  fontWeight: '600',
  fontSize: 13,
},
})
