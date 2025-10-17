import { createClient } from "@supabase/supabase-js"

export function supabaseServer(serviceRole = false) {
  const url = process.env.SUPABASE_URL
  const key = serviceRole
    ? process.env.SUPABASE_SERVICE_ROLE_KEY
    : process.env.SUPABASE_ANON_KEY
  if (!url || !key) throw new Error("Faltan SUPABASE_URL/KEY")
  return createClient(url, key, { auth: { persistSession: false } })
}
