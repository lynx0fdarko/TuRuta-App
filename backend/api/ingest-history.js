// backend/api/ingest-history.js
import { supabase } from "../lib/supabaseAdmin.js"
import { getHistory } from "../lib/whatsgps.js"
import { handleError } from "../lib/utils.js"

export default async function handler(req, res) {
  try {
    const { carId, hours = 24 } = req.query
    if (!carId) {
      return res
        .status(400)
        .json({ ok: false, error: "Falta carId en query (?carId=...)" })
    }

    // Límite máximo: 7 días (168 horas)
    const safeHours = Math.min(Number(hours) || 24, 168)

    // Rango de tiempo (últimas X horas)
    const endTime = new Date()
    const startTime = new Date(endTime.getTime() - safeHours * 3600 * 1000)

    const fmt = (d) => d.toISOString().slice(0, 19).replace("T", " ")

    // Petición a WhatsGPS (con control de errores HTTP)
    let history
    try {
      history = await getHistory({
        carId,
        startTime: fmt(startTime),
        endTime: fmt(endTime),
        mapType: 2,
      })
    } catch (err) {
      throw new Error(`Error conectando con WhatsGPS: ${err.message}`)
    }

    // Verifica respuesta vacía o limitada
    if (!Array.isArray(history) || history.length === 0) {
      return res.json({
        ok: true,
        inserted: 0,
        warning: "No hay historial disponible en WhatsGPS",
      })
    }

    // Maneja posibles respuestas de límite 429 (Too Many Requests)
    if (history?.error === 429 || history === "queryHistory 429") {
      return res.status(429).json({
        ok: false,
        error:
          "WhatsGPS limitó las solicitudes (429). Intenta nuevamente en unos minutos o reduce el rango de horas.",
      })
    }

    // Buscar device en Supabase
    const { data: devices, error: devErr } = await supabase
      .from("gps_devices")
      .select("id, bus_id, whatsgps_device_id")

    if (devErr) throw new Error(`Error al leer gps_devices: ${devErr.message}`)

    const device = devices.find((d) => d.whatsgps_device_id === String(carId))
    if (!device) {
      return res.status(404).json({
        ok: false,
        error: `No se encontró device con whatsgps_device_id=${carId}`,
      })
    }

    // Transformar posiciones → filas de bus_positions
    const rows = history.map((p) => ({
      bus_id: device.bus_id,
      device_id: device.id,
      lat: p.lat,
      lng: p.lon,
      speed_kph: p.speed ?? null,
      heading: p.dir ?? null,
      recorded_at: p.pointDt
        ? new Date(p.pointDt).toISOString()
        : new Date().toISOString(),
    }))

    // Filtrar duplicados por timestamp y bus_id
    const uniqueRows = rows.filter(
      (v, i, a) =>
        a.findIndex(
          (t) => t.recorded_at === v.recorded_at && t.bus_id === v.bus_id
        ) === i
    )

    // Insertar histórico en bus_positions
    const { error: insErr } = await supabase
      .from("bus_positions")
      .insert(uniqueRows)
    if (insErr)
      throw new Error(`Error al insertar en bus_positions: ${insErr.message}`)

    // Actualizar última posición en bus_live
    const last = uniqueRows[uniqueRows.length - 1]
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
    if (liveErr)
      throw new Error(`Error al actualizar bus_live: ${liveErr.message}`)

    return res.json({
      ok: true,
      inserted: uniqueRows.length,
      last,
    })
  } catch (err) {
    console.error("Error en ingest-history:", err.message)
    return handleError(res, err)
  }
}
