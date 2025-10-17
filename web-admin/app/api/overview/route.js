import { NextResponse } from 'next/server'
import { createClientServer } from '@/lib/supabase-server'

export async function GET() {
  const sb = createClientServer()
  const { data, error } = await sb
    .from('v_coop_overview')
    .select('*')
    .order('cooperative_name', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
