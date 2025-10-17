import { supabase } from "../lib/supabaseAdmin.js"
import { withCors } from "../lib/cors.js"

async function handler(req, res) {
  try {
    const { bus_id } = req.query

    if (!bus_id) {
      return res
        .status(400)
        .json({ ok: false, error: "Falta el parámetro bus_id en la URL" })
    }

    // Consulta del historial de posiciones del bus específico
    const { data, error } = await supabase
      .from("bus_positions")
      .select(`
        bus_id,
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
      .eq("bus_id", bus_id)
      .order("recorded_at", { ascending: false })
      .limit(1000)

    if (error) throw error

    const result = data.map((r) => ({
      bus_id: r.bus_id,
      matricula: r.buses?.matricula ?? null,
      cooperative_name: r.buses?.cooperatives?.name ?? null,
      is_active: r.buses?.is_active ?? null,
      lat: r.lat,
      lng: r.lng,
      speed_kph: r.speed_kph,
      heading: r.heading,
      recorded_at: r.recorded_at,
    }))

    return res.status(200).json({ ok: true, count: result.length, data: result })
  } catch (err) {
    console.error("Error en /history:", err.message)
    return res.status(500).json({ ok: false, error: err.message })
  }
}

export default withCors(handler, { methods: ["GET", "OPTIONS"] })
