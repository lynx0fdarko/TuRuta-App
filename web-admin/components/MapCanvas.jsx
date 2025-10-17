"use client"

import { useEffect, useRef } from "react"
import useSWR from "swr"
import { setOptions, importLibrary } from "@googlemaps/js-api-loader"

const fetcher = (u) => fetch(u).then(r => r.json())

export default function MapCanvas() {
  const mapRef = useRef(null)
  const map = useRef(null)
  const markers = useRef(new Map()) // id -> Marker

  // 1) Cargar Google Maps con la nueva API
  useEffect(() => {
    if (!mapRef.current || map.current) return

    ;(async () => {
      setOptions({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
        version: "weekly",
      })

      // Carga la librería de mapas
      const { Map } = await importLibrary("maps")
      // Si necesitas geometry:
      // await importLibrary("geometry")

      map.current = new Map(mapRef.current, {
        center: { lat: 12.136389, lng: -86.251389 },
        zoom: 13,
        mapId: "ENRUTA_MAP",
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControl: false,
      })
    })()
  }, [])

  // 2) Polling de vehículos
  const { data } = useSWR("/api/vehicles", fetcher, { refreshInterval: 5000 })

  // 3) Sincroniza marcadores
  useEffect(() => {
    if (!map.current || !data?.items) return
    const google = window.google
    const nextIds = new Set()

    data.items.forEach(v => {
      nextIds.add(v.id)

      const icon = {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        scale: 4,
        rotation: v.heading || 0,
        fillOpacity: 1,
        strokeWeight: 1,
      }

      let mk = markers.current.get(v.id)
      if (!mk) {
        mk = new google.maps.Marker({
          position: { lat: v.lat, lng: v.lng },
          map: map.current,
          icon,
          title: `${v.plate} • ${Math.round(v.speed)} km/h`,
        })
        markers.current.set(v.id, mk)
      } else {
        mk.setPosition({ lat: v.lat, lng: v.lng })
        mk.setIcon(icon)
        mk.setTitle(`${v.plate} • ${Math.round(v.speed)} km/h`)
      }
    })

    // Limpia los que ya no vienen en la respuesta
    for (const [id, mk] of markers.current.entries()) {
      if (!nextIds.has(id)) {
        mk.setMap(null)
        markers.current.delete(id)
      }
    }
  }, [data])

  return <div ref={mapRef} style={{ position: "absolute", inset: 0 }} />
}
