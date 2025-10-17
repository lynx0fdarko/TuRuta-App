import { supabase } from "../lib/supabaseAdmin.js"
import { handleError } from "../lib/utils.js"

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("buses")
        .select("id, matricula, is_active, route_id, cooperative_id")

      if (error) throw error
      return res.status(200).json({ ok: true, data })
    }

    if (req.method === "DELETE") {
      const { id } = req.query
      if (!id) throw new Error("Falta el parámetro id")
      const { error } = await supabase.from("buses").delete().eq("id", id)
      if (error) throw error
      return res.status(200).json({ ok: true, message: "Bus eliminado" })
    }

    return res.status(405).json({ ok: false, error: "Método no permitido" })
  } catch (err) {
    return handleError(res, err)
  }
}
