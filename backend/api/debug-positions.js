// backend/api/debug-history.js
import fetch from "node-fetch"

const BASE = process.env.WHATSGPS_BASE_URL || "https://www.whatsgps.com"
const NAME = process.env.WHATSGPS_USERNAME
const PASS = process.env.WHATSGPS_PASSWORD

export default async function handler(req, res) {
  try {
    // 1. Login
    const loginUrl = `${BASE}/user/login.do?name=${NAME}&password=${PASS}`
    const r = await fetch(loginUrl)
    const loginData = await r.json()
    if (loginData.ret !== 1) throw new Error("Login failed")

    const token = loginData.data.token
    const userId = loginData.data.userId

    // 2. Obtener carId del query string (?carId=xxxx)
    const carId = req.query?.carId || req.query?.id || "3486433" // default al tuyo
    if (!carId) {
      return res.status(400).json({ error: "Falta carId en query" })
    }

    // 3. Fechas de prueba (últimas 24h en UTC)
    const end = new Date()
    const start = new Date(end.getTime() - 24 * 60 * 60 * 1000)

    const format = (d) =>
      d.toISOString().replace("T", " ").substring(0, 19) // yyyy-mm-dd HH:MM:SS

    const startTime = format(start)
    const endTime = format(end)

    // 4. Llamar a historial
    const url = `${BASE}/position/queryHistory.do?token=${token}&carId=${carId}&startTime=${startTime}&endTime=${endTime}&mapType=2`
    const r2 = await fetch(url)
    const data = await r2.json()

    if (data.ret !== 1) {
      return res.status(502).json({ error: "History fetch failed", raw: data })
    }

    // 5. Responder con las posiciones
    return res.json({
      ok: true,
      carId,
      startTime,
      endTime,
      count: data.data?.length || 0,
      positions: data.data || [],
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
