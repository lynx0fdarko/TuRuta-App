// backend/api/debug-locations.js
import fetch from "node-fetch";

const BASE = process.env.WHATSGPS_BASE_URL || "https://www.whatsgps.com";
const NAME = process.env.WHATSGPS_USERNAME;
const PASS = process.env.WHATSGPS_PASSWORD;

export default async function handler(_req, res) {
  try {
    if (!NAME || !PASS) {
      return res.status(500).json({ error: "Faltan credenciales de WhatsGPS" });
    }

    // 1️⃣ Login
    const loginUrl = `${BASE}/user/login.do?name=${NAME}&password=${PASS}`;
    const r = await fetch(loginUrl);
    const loginData = await r.json();

    if (!loginData?.data?.token || !loginData?.data?.userId) {
      throw new Error("Error al iniciar sesión en WhatsGPS");
    }

    const token = loginData.data.token;
    const userId = loginData.data.userId;

    // 2️⃣ Obtener estados de vehículos
    const statusUrl = `${BASE}/carStatus/getByUserId.do?token=${token}&targetUserId=${userId}&mapType=2`;
    const r2 = await fetch(statusUrl);
    const data = await r2.json();

    if (data.ret !== 1) {
      throw new Error(`WhatsGPS devolvió ret=${data.ret}`);
    }

    const list = (data.data || []).map((c) => ({
      carId: c.carId,
      placa: c.carNO || "N/A",
      nombre: c.machineName || "N/A",
      lat: c.lat,
      lng: c.lon,
      velocidad: c.speed ?? 0,
      direccion: c.dir ?? 0,
      ultima_actualizacion: c.pointTime
        ? new Date(Number(c.pointTime)).toISOString()
        : null,
    }));

    if (list.length === 0) {
      return res.status(200).json({
        ok: true,
        count: 0,
        warning: "WhatsGPS no devolvió posiciones activas",
      });
    }

    // 3️⃣ Respuesta limpia
    return res.status(200).json({
      ok: true,
      total: list.length,
      vehiculos: list,
    });
  } catch (err) {
    console.error("❌ Error en debug-locations:", err);
    return res.status(500).json({ error: err.message });
  }
}
