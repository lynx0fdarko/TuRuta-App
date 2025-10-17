// app/api/vehicles/route.js
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
)

// GET /api/vehicles?bbox=minLng,minLat,maxLng,maxLat&updated_since=ISO&limit=1000
export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const bbox = (searchParams.get("bbox") || "").split(",").map(Number)
  const updatedSince = searchParams.get("updated_since")
  const limit = Math.min(Number(searchParams.get("limit") || 1000), 5000)

  let query = supabase
    .from("vehicle_positions")
    .select("id, lat, lng, heading, speed, plate, updated_at")
    .order("updated_at", { ascending: false })
    .limit(limit)

  // filtro por tiempo
  if (updatedSince) query = query.gte("updated_at", updatedSince)

  // filtro por bounding box [minLng,minLat,maxLng,maxLat]
  if (bbox.length === 4 && bbox.every(n => Number.isFinite(n))) {
    const [minLng, minLat, maxLng, maxLat] = bbox
    query = query
      .gte("lat", minLat).lte("lat", maxLat)
      .gte("lng", minLng).lte("lng", maxLng)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(
    { items: (data ?? []).map(v => ({
        id: v.id, lat: v.lat, lng: v.lng, heading: v.heading,
        speed: v.speed, plate: v.plate, ts: v.updated_at
    })) },
    { headers: { "Cache-Control": "no-store" } }
  )
}

export const dynamic = "force-dynamic"
export const runtime = "nodejs"
