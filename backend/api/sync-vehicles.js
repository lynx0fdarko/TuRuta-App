// backend/api/sync-vehicles.js
import { supabase } from "../lib/supabaseAdmin.js"

import fetch from "node-fetch"

const BASE = process.env.WHATSGPS_BASE_URL || "https://www.whatsgps.com"
const NAME = process.env.WHATSGPS_USERNAME
const PASS = process.env.WHATSGPS_PASSWORD

export default async function handler(_req, res) {
  try {
    // 1. Login seguro
    const loginUrl = `${BASE}/user/login.do?name=${NAME}&password=${PASS}`
    const r = await fetch(loginUrl).catch(err => {
      throw new Error(`Error de red en login: ${err.message}`)
    })
    if (!r.ok) throw new Error(`Login HTTP ${r.status}`)
    const loginData = await r.json().catch(() => {
      throw new Error("Respuesta inválida en login (no JSON)")
    })

    if (loginData.ret !== 1 || !loginData.data?.token) {
      console.error("Respuesta login:", loginData)
      throw new Error("Login fallido en WhatsGPS")
    }

    const token = loginData.data.token
    const userId = loginData.data.userId

    // 2. Obtener vehículos
    const carsUrl = `${BASE}/car/getByUserId.do?token=${token}&targetUserId=${userId}`
    const r2 = await fetch(carsUrl).catch(err => {
      throw new Error(`Error de red al obtener vehículos: ${err.message}`)
    })
    if (!r2.ok) throw new Error(`Cars HTTP ${r2.status}`)
    const carsData = await r2.json().catch(() => {
      throw new Error("Respuesta inválida en vehicles (no JSON)")
    })

    if (carsData.ret !== 1) {
      console.error("Respuesta vehículos:", carsData)
      throw new Error("No se pudieron obtener los vehículos")
    }

    const cars = carsData.data || []
    if (!cars.length) {
      return res.json({ ok: true, inserted: 0, warning: "No hay vehículos en WhatsGPS" })
    }

    let inserted = 0
    for (const car of cars) {
      try {
        const matricula = car.machineName || null
        const imei = car.imei || null
        const carNO = car.carNO || null // → route.number
        const driverName = car.driverName || null // → buses.operator
        const isActive = car.clientServiceStatus === 1 // bool

        if (!matricula || !imei) {
          console.warn("Vehículo ignorado por datos incompletos:", car)
          continue
        }

        // 3. Upsert en rutas (si carNO existe)
        let routeId = null
        if (carNO) {
          const { data: route, error: routeErr } = await supabase
            .from("routes")
            .upsert(
              { number: carNO, name: carNO },
              { onConflict: "number" }
            )
            .select("id")
            .single()

          if (routeErr) {
            console.error("Error insertando route:", routeErr)
            throw new Error(routeErr.message)
          }
          routeId = route?.id || null
        }

        // 4. Upsert en buses
        const { data: bus, error: busErr } = await supabase
          .from("buses")
          .upsert(
            {
              matricula,
              operator: driverName,
              is_active: isActive,
              route_id: routeId,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "matricula" }
          )
          .select("id")
          .single()

        if (busErr) {
          console.error("Error insertando bus:", busErr)
          throw new Error(busErr.message)
        }

        // 5. Upsert en gps_devices
        const { error: devErr } = await supabase
          .from("gps_devices")
          .upsert(
            {
              bus_id: bus.id,
              whatsgps_device_id: imei, // IMEI
              car_id: String(car.carId),  // campo con el ID real de WhatsGPS
              created_at: new Date().toISOString(),
            },
            { onConflict: "whatsgps_device_id" }
          )

        if (devErr) {
          console.error("Error insertando gps_device:", devErr)
          throw new Error(devErr.message)
        }

        inserted++
      } catch (innerErr) {
        console.error("Error procesando vehículo:", innerErr.message)
        continue // seguimos con el siguiente vehículo
      }
    }

    return res.json({ ok: true, inserted })
  } catch (err) {
    console.error("Error general:", err.message)
    return res.status(500).json({ error: err.message })
  }
}
