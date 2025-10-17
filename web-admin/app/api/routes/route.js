import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  { auth: { persistSession: false } }
)

export const dynamic = "force-dynamic"

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get("q") || "").trim()

  let query = supabase
    .from("routes")
    .select("id, code, name, path, stops")
    .order("code")

  if (q) {
    query = query.or(`code.ilike.%${q}%,name.ilike.%${q}%`)
  }

  const { data, error } = await query.limit(100)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ items: data })
}
