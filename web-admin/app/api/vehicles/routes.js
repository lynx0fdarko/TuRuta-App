// web-admin/app/api/vehicles/route.js
import { NextResponse } from "next/server"
import { getVehicles } from "@/lib/whatsgps"

export const dynamic = "force-dynamic" // evita caché en prod

export async function GET() {
  try {
    const items = await getVehicles()
    // Controla caching del CDN sin estancar datos
    return NextResponse.json({ items }, {
      headers: { "Cache-Control": "no-store" },
    })
  } catch (e) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 })
  }
}
