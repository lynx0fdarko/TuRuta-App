import { createClientServer } from '@/lib/supabase-server'
import MapSection from '@/components/MapSection'   // ⬅️ IMPORT DIRECTO (MapSection tiene 'use client')

export default async function Dashboard() {
  const sb = createClientServer()

  const [{ count: buses }, { count: routes }] = await Promise.all([
    sb.from('buses').select('*', { head: true, count: 'exact' }),
    sb.from('routes').select('*', { head: true, count: 'exact' }),
  ])

  const { data: overview = [] } = await sb.from('v_coop_overview').select('*')

  const { data: recentBuses = [] } = await sb
    .from('buses')
    .select('id, matricula, route_id, cooperative_id, is_active, created_at')
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Panel general</h1>
      {/* KPIs */}
      {/* ... (tu mismo código) ... */}
      {/* Mapa */}
      <section className="space-y-3">
        <h2 className="font-semibold">Mapa en vivo</h2>
        <MapSection />
      </section>
      {/* Tablas */}
      {/* ... (tu mismo código) ... */}
    </main>
  )
}
