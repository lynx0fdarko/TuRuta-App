// backend/api/ingest-history.js
import { supabase } from "../lib/supabaseAdmin.js"
import { getHistory } from "../lib/whatsgps.js"

export default async function handler(req, res) {
  try {
    const { carId, hours = 24 } = req.query
    if (!carId) {
      return res.status(400).json({ error: "Falta carId en query ?carId=" })
    }

    // rango de tiempo (últimas X horas)
    const endTime = new Date()
    const startTime = new Date(endTime.getTime() - hours * 3600 * 1000)

    const fmt = (d) =>
      d.toISOString().slice(0, 19).replace("T", " ") // formato "YYYY-MM-DD HH:mm:ss"

    const history = await getHistory({
      carId,
      startTime: fmt(startTime),
      endTime: fmt(endTime),
      mapType: 2, // Google
    })

    if (!Array.isArray(history) || history.length === 0) {
      return res.json({ ok: true, inserted: 0, warning: "No hay historial en WhatsGPS" })
    }

    // buscar device en Supabase
    const { data: devices, error: devErr } = await supabase
      .from("gps_devices")
      .select("id, bus_id, whatsgps_device_id")

    if (devErr) throw new Error(`Error al leer gps_devices: ${devErr.message}`)

    const device = devices.find((d) => d.whatsgps_device_id === String(carId))
    if (!device) {
      return res
        .status(404)
        .json({ error: `No se encontró device con whatsgps_device_id=${carId}` })
    }

    // transformar posiciones → filas de bus_positions
    const rows = history.map((p) => ({
      bus_id: device.bus_id,
      device_id: device.id,
      lat: p.lat,
      lng: p.lon,
      speed_kph: p.speed ?? null,
      heading: p.dir ?? null,
      recorded_at: p.pointDt ? new Date(p.pointDt).toISOString() : new Date().toISOString(),
    }))

    // insertar histórico en bus_positions
    const { error: insErr } = await supabase.from("bus_positions").insert(rows)
    if (insErr) throw new Error(`Error al insertar en bus_positions: ${insErr.message}`)

    // actualizar última posición en bus_live
    const last = rows[rows.length - 1]
    const { error: liveErr } = await supabase
      .from("bus_live")
      .upsert(
        {
          device_id: device.id,
          bus_id: device.bus_id,
          lat: last.lat,
          lng: last.lng,
          speed_kph: last.speed_kph,
          heading: last.heading,
          recorded_at: last.recorded_at,
        },
        { onConflict: "device_id" }
      )
    if (liveErr) throw new Error(`Error al actualizar bus_live: ${liveErr.message}`)

    return res.json({ ok: true, inserted: rows.length, last })
  } catch (err) {
    console.error("Error en ingest-history:", err)
    return res.status(500).json({ error: err.message || "Error inesperado en ingest-history" })
  }
}
