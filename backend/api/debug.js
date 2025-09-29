import fetch from "node-fetch";

const BASE = process.env.WHATSGPS_BASE_URL || "https://www.whatsgps.com";
const NAME = process.env.WHATSGPS_USERNAME;
const PASS = process.env.WHATSGPS_PASSWORD;

export default async function handler(_req, res) {
  try {
    // Paso 1: Login
    const loginUrl = `${BASE}/user/login.do?name=${NAME}&password=${PASS}`;
    const r = await fetch(loginUrl);
    const loginData = await r.json();

    if (loginData.ret !== 1) {
      return res.status(401).json({ error: "Login failed", loginData });
    }

    const token = loginData.data?.token;
    const userId = loginData.data?.userId;

    // Paso 2: Consultar vehículos usando targetUserId
    const carsUrl = `${BASE}/car/getByUserId.do?token=${token}&targetUserId=${userId}`;
    const r2 = await fetch(carsUrl);
    const carsData = await r2.json();

    // Respuesta combinada para debug
    return res.json({
      ok: true,
      login: loginData,
      cars: carsData,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
