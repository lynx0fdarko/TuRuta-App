// backend/api/debug-vehicles.js
import fetch from "node-fetch";

const BASE = process.env.WHATSGPS_BASE_URL || "https://www.whatsgps.com";
const NAME = process.env.WHATSGPS_USERNAME;
const PASS = process.env.WHATSGPS_PASSWORD;

export default async function handler(_req, res) {
  try {
    // 1. Login
    const loginUrl = `${BASE}/user/login.do?name=${NAME}&password=${PASS}`;
    const r = await fetch(loginUrl);
    const loginData = await r.json();

    if (loginData.ret !== 1) {
      throw new Error("Login failed: " + JSON.stringify(loginData));
    }

    const token = loginData.data.token;
    const userId = loginData.data.userId;
    const entId = loginData.data.entId;
    const deptId = loginData.data.deptId;

    // 2. Probar distintos parámetros
    const paramsToTry = [
      { key: "userId", value: userId },
      { key: "targetUserId", value: userId },
      { key: "entId", value: entId },
      { key: "deptId", value: deptId },
    ];

    const results = {};
    for (const p of paramsToTry) {
      const url = new URL("/car/getByUserId.do", BASE);
      url.searchParams.set("token", token);
      url.searchParams.set(p.key, String(p.value));

      const resp = await fetch(url);
      const data = await resp.json();
      results[p.key] = data;
    }

    return res.json({
      ok: true,
      login: {
        userId,
        entId,
        deptId,
      },
      results,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
