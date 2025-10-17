// web-admin/lib/whatsgps.js
export async function getVehicles() {
  const base = process.env.WHATSGPS_BASE_URL
  const user = process.env.WHATSGPS_USERNAME
  const pass = process.env.WHATSGPS_PASSWORD

  if (!base || !user || !pass) {
    throw new Error("Faltan env de WhatGPS")
  }

  // ⚠️ Ajusta esta llamada al endpoint real de WhatGPS.
  // Devuelve un arreglo de vehículos: [{ id, lat, lng, heading, speed, plate }, ...]
  const res = await fetch(`${base}/vehicles`, {
    headers: {
      "Authorization": "Basic " + Buffer.from(`${user}:${pass}`).toString("base64"),
      "Accept": "application/json",
    },
    // Si WhatGPS requiere método/param extra, ajústalo aquí.
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(`WhatGPS ${res.status}`)
  }

  const data = await res.json()

  // 🔁 Normaliza al formato esperado por el frontend:
  // Ajusta mapeo de campos según la respuesta real de WhatGPS
  return (data?.vehicles || data || []).map(v => ({
    id: String(v.id ?? v.deviceId ?? v.unitId),
    lat: Number(v.lat ?? v.latitude),
    lng: Number(v.lng ?? v.longitude),
    heading: Number(v.heading ?? v.course ?? 0),
    speed: Number(v.speed ?? 0),
    plate: v.plate ?? v.name ?? v.label ?? "N/A",
  })).filter(v => Number.isFinite(v.lat) && Number.isFinite(v.lng))
}
