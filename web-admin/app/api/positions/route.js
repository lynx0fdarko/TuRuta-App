import { NextResponse } from 'next/server'
import { createClientServer } from '@/lib/supabase-server'

export async function GET() {
  const sb = createClientServer()
  const { data, error } = await sb
    .from('v_bus_latest_position')
    .select('bus_id, matricula, route_id, cooperative_id, lat, lng, speed_kph, heading, recorded_at')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { headers: { 'Cache-Control': 's-maxage=5' } })
}
