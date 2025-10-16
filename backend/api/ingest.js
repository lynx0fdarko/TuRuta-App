// api/ingest.js
import { supabase } from '../lib/supabaseAdmin.js'
import { withCors } from '../lib/cors.js'
import { getUserId, getStatusesByUser } from '../lib/whatsgps.js'

const validCoord = (lat, lng) =>
  Number.isFinite(lat) &&
  Number.isFinite(lng) &&
  lat >= -90 &&
  lat <= 90 &&
  lng >= -180 &&
  lng <= 180

async function handler(_req, res) {
  try {
    const userId = await getUserId()
    const statuses = (await getStatusesByUser(userId, { mapType: 2 })) || []

    if (!statuses.length) {
      console.warn("⚠️ WhatsGPS no devolvió posiciones activas.")
      return res.json({ ok: true, inserted_historical: 0, updated_live: 0, ts: new Date().toISOString() })
    }

    // Traer los dispositivos registrados en Supabase
    const { data: devices, error: dErr } = await supabase
      .from('gps_devices')
      .select('id, bus_id, whatsgps_device_id, car_id')
    if (dErr) throw new Error(dErr.message)

    // Mapa por IMEI (whatsgps_device_id)
    const byImei = new Map((devices || []).map(d => [String(d.whatsgps_device_id), d]))

    const histRows = []
    const liveRows = []

    console.log(`Statuses recibidos: ${statuses.length}`)

    for (const s of statuses) {
      const imei = String(s.imei)
      const dev = byImei.get(imei)
      if (!dev) continue // no está registrado ese dispositivo

      const lat = parseFloat(s.lat)
      const lng = parseFloat(s.lon)
      if (!validCoord(lat, lng)) continue

      const recorded_at = s.pointDt
        ? new Date(s.pointDt).toISOString()
        : new Date().toISOString()

      const wkt = `SRID=4326;POINT(${lng} ${lat})`

      histRows.push({
        bus_id: dev.bus_id,
        device_id: dev.id,
        position: wkt,
        recorded_at,
      })

      liveRows.push({
        device_id: dev.id,
        bus_id: dev.bus_id,
        lat,
        lng,
        speed_kph: Number.isFinite(s.speed) ? s.speed : null,
        heading: Number.isFinite(s.dir) ? s.dir : null,
        recorded_at,
      })
    }

    // Guardar en histórico
    if (histRows.length) {
      const { error: histErr } = await supabase
        .from('bus_positions')
        .insert(histRows, { ignoreDuplicates: true })
      if (histErr) throw new Error(`bus_positions: ${histErr.message}`)
    }

    // Guardar en tabla "live"
    if (liveRows.length) {
      const { error: liveErr } = await supabase
        .from('bus_live')
        .upsert(liveRows, { onConflict: 'device_id' })
      if (liveErr) throw new Error(`bus_live: ${liveErr.message}`)
    }

    res.json({
      ok: true,
      inserted_historical: histRows.length,
      updated_live: liveRows.length,
      ts: new Date().toISOString(),
    })
  } catch (e) {
    console.error("Error en ingest:", e.message)
    res.status(500).json({ error: e.message })
  }
}

export default withCors(handler, { methods: ['GET', 'POST', 'OPTIONS'] })
