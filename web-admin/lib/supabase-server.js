import { createClient } from "@supabase/supabase-js"

export function supabaseServer() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY // solo server

  if (!url || !key) {
    throw new Error("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY")
  }

  return createClient(url, key, {
    auth: { persistSession: false },
    global: { headers: { "x-application-name": "enruta-web-admin" } }
  })
}
