'use client'
import 'maplibre-gl/dist/maplibre-gl.css'
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre'
import { useEffect, useState } from 'react'

export default function MapSection() {
  const [points, setPoints] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch('/api/positions', { cache: 'no-store' })
        const d = await r.json()
        setPoints(Array.isArray(d) ? d : [])
      } finally {
        setLoading(false)
      }
    }
    load()
    const t = setInterval(load, 10000) // refresca cada 10s
    return () => clearInterval(t)
  }, [])

  return (
    <div className="h-[460px] rounded-2xl overflow-hidden border bg-white">
      <Map
        initialViewState={{ longitude: -86.251389, latitude: 12.136389, zoom: 11 }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      >
        <NavigationControl position="top-right" />
        {!loading && points.map(p => (
          <Marker key={p.bus_id} longitude={p.lng} latitude={p.lat} anchor="bottom">
            <div className="w-3 h-3 rounded-full bg-blue-600 ring-2 ring-white" title={p.matricula} />
          </Marker>
        ))}
      </Map>
    </div>
  )
}
