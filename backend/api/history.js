import { supabase } from '../lib/supabaseAdmin.js'
import { withCors } from '../lib/cors.js'

const clamp = (n, a, b) => Math.max(a, Math.min(b, n))

async function handler(req, res) {
  const { bus_id, from, to, limit } = req.query
  if (!bus_id) return res.status(400).json({ error: 'bus_id es requerido' })

  const lim = clamp(parseInt(limit || '500',10), 1, 5000)

  // Si usas geometry, lee desde una vista que expone lat/lng (ver paso 3)
  let q = supabase
    .from('bus_positions_latlng')
    .select('id,bus_id,lat,lng,recorded_at')
    .eq('bus_id', bus_id)

  if (from) q = q.gte('recorded_at', new Date(from).toISOString())
  if (to)   q = q.lte('recorded_at', new Date(to).toISOString())

  q = q.order('recorded_at', { ascending: false }).limit(lim)

  const { data, error } = await q
  if (error) return res.status(500).json({ error: error.message })

  data.sort((a,b) => new Date(a.recorded_at) - new Date(b.recorded_at))
  res.json(data)
}
export default withCors(handler, { methods: ['GET','OPTIONS'] })
