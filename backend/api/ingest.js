// backend/api/ingest.js
import { supabase } from '../lib/supabaseAdmin.js'
import { getUserId, getStatusesByUser } from '../lib/whatsgps.js'

export default async function handler(_req, res) {
  try {
    // 1. Validar credenciales básicas
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({ error: 'Faltan credenciales de Supabase' })
    }
    if (!process.env.WHATSGPS_USERNAME || !process.env.WHATSGPS_PASSWORD) {
      return res.status(500).json({ error: 'Faltan credenciales de WhatsGPS' })
    }

    // 2. Obtener usuario de WhatsGPS
    const userId = await getUserId()
    if (!userId) {
      return res.status(502).json({ error: 'No se pudo obtener userId de WhatsGPS' })
    }

    // 3. Obtener estatus de buses en tiempo real
    const statuses = await getStatusesByUser(userId, { mapType: 2 })
    if (!Array.isArray(statuses) || !statuses.length) {
      return res.status(200).json({ ok: true, inserted: 0, warning: 'No hay datos disponibles de WhatsGPS' })
    }

    // 4. Leer dispositivos registrados en DB
    const { data: devices, error: devicesError } = await supabase
      .from('gps_devices')
      .select('id, bus_id, whatsgps_device_id')

    if (devicesError) {
      return res.status(500).json({ error: `Error al consultar gps_devices: ${devicesError.message}` })
    }
    if (!devices || !devices.length) {
      return res.status(200).json({ ok: true, inserted: 0, warning: 'No hay dispositivos registrados en gps_devices' })
    }

    // 5. Mapear posiciones a buses
    const positions = []
    const liveUpdates = []

    for (const s of statuses) {
      const device = devices.find(d => d.whatsgps_device_id === String(s.carId))
      if (!device) continue

      const recordedAt = s.pointTime
        ? new Date(Number(s.pointTime)).toISOString()
        : new Date().toISOString()

      // Para histórico
      positions.push({
        bus_id: device.bus_id,
        position: `POINT(${s.lon} ${s.lat})`, // formato PostGIS
        recorded_at: recordedAt
      })

      // Para vivo
      liveUpdates.push({
        device_id: device.id,
        bus_id: device.bus_id,
        lat: s.lat,
        lng: s.lon,
        speed_kph: s.speed ?? null,
        heading: s.dir ?? null,
        recorded_at: recordedAt
      })
    }

    // 6. Insertar histórico en bus_positions
    if (positions.length > 0) {
      const { error: insertError } = await supabase.from('bus_positions').insert(positions)
      if (insertError) {
        console.error('Error al insertar en bus_positions:', insertError)
        return res.status(500).json({ error: `Error al insertar en bus_positions: ${insertError.message}` })
      }
    }

    // 7. Actualizar/Upsert en bus_live (última posición por dispositivo)
    if (liveUpdates.length > 0) {
      const { error: liveError } = await supabase
        .from('bus_live')
        .upsert(liveUpdates, { onConflict: 'device_id' }) // asegura que se actualice si ya existe
      if (liveError) {
        console.error('Error al actualizar bus_live:', liveError)
        return res.status(500).json({ error: `Error al actualizar bus_live: ${liveError.message}` })
      }
    }

    return res.status(200).json({
      ok: true,
      inserted_historical: positions.length,
      updated_live: liveUpdates.length
    })
  } catch (e) {
    console.error('Error inesperado en ingest:', e)
    return res.status(500).json({ error: e.message || 'Error inesperado en ingest' })
  }
}
