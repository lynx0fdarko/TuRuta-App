import { supabase } from "../lib/supabaseAdmin.js"
import { withCors } from "../lib/cors.js"

async function handler(_req, res) {
  try {
    const { data, error } = await supabase
      .from("bus_live")
      .select(`
        bus_id,
        whatsgps_device_id,
        lat,
        lng,
        speed_kph,
        heading,
        recorded_at,
        buses!inner (
          matricula,
          is_active,
          cooperative_id,
          cooperatives (
            name
          )
        )
      `)
      .order("recorded_at", { ascending: false })

    if (error) throw error

    const result = data.map((r) => ({
      bus_id: r.bus_id,
      device_id: r.whatsgps_device_id ?? null,
      matricula: r.buses?.matricula ?? null,
      cooperative_name: r.buses?.cooperatives?.name ?? null,
      is_active: r.buses?.is_active ?? null,
      lat: r.lat,
      lng: r.lng,
      speed_kph: r.speed_kph,
      heading: r.heading,
      recorded_at: r.recorded_at,
    }))

    return res.status(200).json(result)
  } catch (err) {
    console.error("Error en /live:", err.message)
    return res.status(500).json({ ok: false, error: err.message })
  }
}

export default withCors(handler, { methods: ["GET", "OPTIONS"] })
