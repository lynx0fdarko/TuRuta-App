import { supabase } from '../lib/supabaseAdmin.js'
import { withCors } from '../lib/cors.js'

async function handler(_req, res) {
  const { data, error } = await supabase
    .from('bus_live')
    .select(`
      bus_id, device_id, lat, lng, speed_kph, heading, recorded_at,
      buses!inner (matricula, operator, is_active)
    `)
    .order('recorded_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })

  res.json(data.map(r => ({
    bus_id: r.bus_id,
    device_id: r.device_id,
    matricula: r.buses?.matricula ?? null,
    operator: r.buses?.operator ?? null,
    is_active: r.buses?.is_active ?? null,
    lat: r.lat, lng: r.lng, speed_kph: r.speed_kph, heading: r.heading,
    recorded_at: r.recorded_at
  })))
}
export default withCors(handler, { methods: ['GET','OPTIONS'] })
