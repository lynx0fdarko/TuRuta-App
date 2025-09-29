import fetch from "node-fetch";
import supabase from "../lib/supabase.js";

const BASE = process.env.WHATSGPS_BASE_URL || "https://www.whatsgps.com";
const NAME = process.env.WHATSGPS_USERNAME;
const PASS = process.env.WHATSGPS_PASSWORD;

export default async function handler(_req, res) {
  try {
    // 1. login
    const loginUrl = `${BASE}/user/login.do?name=${NAME}&password=${PASS}`;
    const r = await fetch(loginUrl);
    const loginData = await r.json();
    if (loginData.ret !== 1) throw new Error("Login failed");

    const token = loginData.data.token;
    const userId = loginData.data.userId;

    // 2. obtener vehículos
    const carsUrl = `${BASE}/car/getByUserId.do?token=${token}&targetUserId=${userId}`;
    const r2 = await fetch(carsUrl);
    const carsData = await r2.json();
    if (carsData.ret !== 1) throw new Error("Cars fetch failed");

    let inserted = [];
    let updated = [];

    for (const c of carsData.data) {
      const matricula = c.machineName; // matrícula/nombre
      const imei = c.imei;
      const carId = c.carId;

      // 3a. Buscar bus existente por matrícula
      const { data: existingBus, error: busError } = await supabase
        .from("buses")
        .select("id")
        .eq("matricula", matricula)
        .maybeSingle();

      if (busError) throw busError;

      let busId = existingBus?.id;

      // Si no existe, crear bus
      if (!busId) {
        const { data: newBus, error: insertBusErr } = await supabase
          .from("buses")
          .insert({ matricula, is_active: true })
          .select("id")
          .single();

        if (insertBusErr) throw insertBusErr;
        busId = newBus.id;
        inserted.push({ busId, matricula });
      }

      // 3b. Insertar o actualizar gps_devices
      const { data: existingDevice, error: devErr } = await supabase
        .from("gps_devices")
        .select("id")
        .eq("whatsgps_device_id", imei)
        .maybeSingle();

      if (devErr) throw devErr;

      if (existingDevice) {
        // actualizar relación con bus_id si cambió
        const { error: updateErr } = await supabase
          .from("gps_devices")
          .update({ bus_id: busId })
          .eq("id", existingDevice.id);

        if (updateErr) throw updateErr;
        updated.push({ imei, busId });
      } else {
        // insertar nuevo dispositivo
        const { error: insertDevErr } = await supabase
          .from("gps_devices")
          .insert({ bus_id: busId, whatsgps_device_id: imei });

        if (insertDevErr) throw insertDevErr;
        inserted.push({ imei, busId });
      }
    }

    return res.json({ ok: true, inserted, updated });
  } catch (err) {
    console.error("sync-vehicles error:", err);
    return res.status(500).json({ error: err.message });
  }
}
