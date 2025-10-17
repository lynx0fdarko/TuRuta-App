import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,  // <- solo server
  { auth: { persistSession: false } }
)

export async function GET() {
  const { data, error } = await supabase
    .from("vehicle_positions")
    .select("id, lat, lng, heading, speed, plate")
    .limit(1000)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ items: data ?? [] }, { headers: { "Cache-Control": "no-store" } })
}

export const dynamic = "force-dynamic"
