import { supabase } from '../_lib/supabaseAdmin.js'
import { getUserId, getStatusesByUser } from '../_lib/whatsgps.js'

export default async function handler(_req, res) {
  const userId = await getUserId()
  const statuses = await getStatusesByUser(userId, { mapType: 2 }) // 2=Google

  // Mapea carId → device en tu tabla gps_devices (whatsgps_device_id = carId o IMEI, depende de cómo la modeles)
  const { data: devices } = await supabase.from('gps_devices').select('id, bus_id, whatsgps_device_id')

  const rows = []
  for (const s of statuses) {
    const device = devices?.find(d => d.whatsgps_device_id === String(s.carId))
    if (!device) continue
    rows.push({
      bus_id: device.bus_id,
      device_id: device.id,
      lat: s.lat, lng: s.lon,
      speed_kph: s.speed ?? null,
      heading: s.dir ?? null,
      recorded_at: s.pointTime ? new Date(Number(s.pointTime)).toISOString() : new Date().toISOString()
    })
  }

  if (rows.length) {
    const { error } = await supabase.from('bus_locations').insert(rows)
    if (error) return res.status(500).json({ error: error.message })
  }
  res.json({ ok: true, inserted: rows.length })
}
