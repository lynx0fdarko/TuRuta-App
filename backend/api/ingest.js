// api/ingest.js
import { supabase } from "../lib/supabaseAdmin.js"
import { withCors } from "../lib/cors.js"
import fetch from "node-fetch"

const BASE = process.env.WHATSGPS_BASE_URL || "https://www.whatsgps.com"
const NAME = process.env.WHATSGPS_USERNAME
const PASS = process.env.WHATSGPS_PASSWORD

// Ventana de historial en minutos (por defecto 24h)
const HISTORY_MINUTES = parseInt(process.env.HISTORY_MINUTES || "1440")

const validCoord = (lat, lng) =>
  Number.isFinite(lat) &&
  Number.isFinite(lng) &&
  lat >= -90 && lat <= 90 &&
  lng >= -180 && lng <= 180

function formatYYYYMMDD_HHMMSS(date) {
  // yyyy-mm-dd HH:mm:ss
  const pad = n => String(n).padStart(2, "0")
  const y = date.getUTCFullYear()
  const m = pad(date.getUTCMonth() + 1)
  const d = pad(date.getUTCDate())
  const hh = pad(date.getUTCHours())
  const mm = pad(date.getUTCMinutes())
  const ss = pad(date.getUTCSeconds())
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
}

function shiftDateBySeconds(date, seconds) {
  return new Date(date.getTime() + seconds * 1000)
}

async function login() {
  const url = `${BASE}/user/login.do?name=${encodeURIComponent(NAME)}&password=${encodeURIComponent(PASS)}`
  const r = await fetch(url)
  const j = await r.json()
  if (j.ret !== 1) throw new Error("Login fallido en WhatsGPS")
  // timeZone en segundos (p.ej. 28800 = UTC+8)
  return { token: j.data.token, userId: j.data.userId, timeZone: Number(j.data.timeZone || 0) }
}

// algunos despliegues piden targetUserId, otros userId
async function getLiveStatuses(token, userId, mapType = 2) {
  const candidates = [
    `${BASE}/carStatus/getByUserId.do?token=${encodeURIComponent(token)}&targetUserId=${encodeURIComponent(userId)}&mapType=${mapType}`,
    `${BASE}/carStatus/getByUserId.do?token=${encodeURIComponent(token)}&userId=${encodeURIComponent(userId)}&mapType=${mapType}`
  ]
  for (const url of candidates) {
    const r = await fetch(url)
    const j = await r.json().catch(() => ({}))
    if (j?.ret === 1 && Array.isArray(j.data)) {
      return { data: j.data, url }
    }
  }
  return { data: [], url: candidates[candidates.length - 1] }
}

async function getHistory(token, carId, mapType = 2) {
  const end = new Date()
  const start = new Date(end.getTime() - 12 * 60 * 60 * 1000) // Últimas 12h por defecto
  const fmt = d => d.toISOString().replace("T", " ").substring(0, 19)
  const startTime = fmt(start)
  const endTime = fmt(end)

  const url = `${BASE}/position/queryHistory.do?token=${token}&carId=${carId}&startTime=${encodeURIComponent(
    startTime
  )}&endTime=${encodeURIComponent(endTime)}&mapType=${mapType}`

  const r = await fetch(url)
  const j = await r.json().catch(() => ({}))
  if (j?.ret === 1 && Array.isArray(j.data)) return { data: j.data, url }
  return { data: [], url, raw: j }
}

async function handler(_req, res) {
  try {
    console.log("=== INGEST WhatsGPS (rango UTC con formato oficial) ===")

    // 1) Login y zona horaria de la cuenta
    const { token, userId, timeZone } = await login()
    console.log("Login OK. userId:", userId, "timeZone(s):", timeZone)

    // 2) Cargar devices registrados
    const { data: devices, error: dErr } = await supabase
      .from("gps_devices")
      .select("id, bus_id, car_id, whatsgps_device_id")
    if (dErr) throw new Error("Error cargando gps_devices: " + dErr.message)

    if (!devices?.length) {
      console.warn("No hay dispositivos en gps_devices")
      return res.json({ ok: true, inserted_historical: 0, updated_live: 0, ts: new Date().toISOString() })
    }

    console.log("Dispositivos:", devices.length)
    const byImei = new Map((devices || []).map(d => [String(d.whatsgps_device_id), d]))
    const byCar = new Map((devices || []).map(d => [String(d.car_id), d]))
    console.log("Ej IMEIs:", Array.from(byImei.keys()).slice(0, 3))
    console.log("Ej carIds:", Array.from(byCar.keys()).slice(0, 3))

    // 3) Intento LIVE primero (mapType 2 -> 1)
    let live = await getLiveStatuses(token, userId, 2)
    console.log(`LIVE(mapType=2) -> ${live.data.length} items, url: ${live.url}`)
    if (!live.data.length) {
      live = await getLiveStatuses(token, userId, 1)
      console.log(`LIVE(mapType=1) -> ${live.data.length} items, url: ${live.url}`)
    }

    const histRows = []
    const liveRows = []

    // 4) Procesar LIVE si hay
    if (live.data.length) {
      for (const s of live.data) {
        const imei = s.imei ? String(s.imei) : null
        const carId = s.carId != null ? String(s.carId) : null
        const dev = imei ? byImei.get(imei) : (carId ? byCar.get(carId) : null)
        if (!dev) continue

        const lat = parseFloat(s.lat)
        const lng = parseFloat(s.lon)
        if (!validCoord(lat, lng)) continue

        const recorded_at = s.pointDt
          ? new Date(s.pointDt).toISOString()
          : (s.pointTime ? new Date(Number(s.pointTime)).toISOString() : new Date().toISOString())

        histRows.push({
          bus_id: dev.bus_id,
          whatsgps_device_id: dev.whatsgps_device_id,
          lat,
          lng,
          speed_kph: Number.isFinite(s.speed) ? s.speed : null,
          heading: Number.isFinite(s.dir) ? s.dir : null,
          recorded_at
        })

        liveRows.push({
          bus_id: dev.bus_id,
          whatsgps_device_id: dev.whatsgps_device_id,
          lat,
          lng,
          speed_kph: Number.isFinite(s.speed) ? s.speed : null,
          heading: Number.isFinite(s.dir) ? s.dir : null,
          recorded_at
        })
      }
    }

    // 5) Si no hay LIVE, usar HISTORIAL con rango UTC
    if (!histRows.length) {
      console.log(`No hay LIVE, consultando historial por dispositivo (últimas 12h)`)

      for (const dev of devices) {
        const carId = String(dev.car_id || "")
        if (!carId) continue

        // Probar mapType=2 y 1
        let h = await getHistory(token, carId, 2)
        console.log(`carId ${carId} history(2): ${h.data.length} url: ${h.url}`)
        if (!h.data.length) {
          const h1 = await getHistory(token, carId, 1)
          console.log(`carId ${carId} history(1): ${h1.data.length} url: ${h1.url}`)
          if (h1.data.length) h = h1
        }
        if (!h.data.length) continue

        for (const s of h.data) {
          const imei = s.imei ? String(s.imei) : null
          const devMatch = imei ? byImei.get(imei) : byCar.get(carId)
          if (!devMatch) continue

          const lat = parseFloat(s.lat)
          const lng = parseFloat(s.lon)
          if (!validCoord(lat, lng)) continue

          const recorded_at = s.pointDt
            ? new Date(s.pointDt).toISOString()
            : new Date().toISOString()

          histRows.push({
            bus_id: devMatch.bus_id,
            whatsgps_device_id: devMatch.whatsgps_device_id,
            lat,
            lng,
            speed_kph: Number.isFinite(s.speed) ? s.speed : null,
            heading: Number.isFinite(s.dir) ? s.dir : null,
            recorded_at
          })
        }

        // última posición como live
        const last = h.data[h.data.length - 1]
        if (last) {
          const lat = parseFloat(last.lat)
          const lng = parseFloat(last.lon)
          if (validCoord(lat, lng)) {
            liveRows.push({
              bus_id: dev.bus_id,
              whatsgps_device_id: dev.whatsgps_device_id,
              lat,
              lng,
              speed_kph: Number.isFinite(last.speed) ? last.speed : null,
              heading: Number.isFinite(last.dir) ? last.dir : null,
              recorded_at: last.pointDt
                ? new Date(last.pointDt).toISOString()
                : new Date().toISOString()
            })
          }
        }
      }
    }

    console.log(`Insertar -> históricos: ${histRows.length}, live: ${liveRows.length}`)

    // 6) Insert histórico
    if (histRows.length) {
      const ins = await supabase.from("bus_positions").insert(histRows)
      if (ins.error) {
        console.error("bus_positions insert error:", ins.error)
        throw new Error(ins.error.message)
      }
    }

    // 7) Upsert live
    if (liveRows.length) {
      const up = await supabase
        .from("bus_live")
        .upsert(liveRows, { onConflict: "whatsgps_device_id" })
      if (up.error) {
        console.error("bus_live upsert error:", up.error)
        throw new Error(up.error.message)
      }
    }

    res.json({
      ok: true,
      inserted_historical: histRows.length,
      updated_live: liveRows.length,
      ts: new Date().toISOString()
    })
  } catch (e) {
    console.error("❌ INGEST ERROR:", e)
    res.status(500).json({ error: e.message })
  }
}

export default withCors(handler, { methods: ["GET", "POST", "OPTIONS"] })
