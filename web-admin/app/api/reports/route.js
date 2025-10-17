import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get("q") || "").trim()
  const tag = (searchParams.get("tag") || "").trim() // "Retraso" | "Desvío" | ...
  const supabase = supabaseServer() // RLS/anon

  // ⚠️ Ajusta a tu tabla/vista real
  // Supuesto: citizen_reports(id, route_code, type, title, detail, created_at)
  let query = supabase
    .from("citizen_reports")
    .select("id, route_code, type, title, detail, created_at")
    .order("created_at", { ascending: false })

  if (q) {
    query = query.or(
      `route_code.ilike.%${q}%,title.ilike.%${q}%,detail.ilike.%${q}%`
    )
  }
  if (tag) query = query.eq("type", tag)

  const { data, error } = await query.limit(100)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const items = (data || []).map(r => ({
    id: r.id,
    ruta: String(r.route_code ?? ""),
    tipo: r.type ?? "",
    titulo: r.title ?? "",
    detalle: r.detail ?? "",
  }))
  return NextResponse.json({ items })
}
