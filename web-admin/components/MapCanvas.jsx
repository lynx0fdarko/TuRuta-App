"use client"

import { useEffect, useRef } from "react"

function loadGoogleMaps(key) {
  if (typeof window === "undefined") return Promise.reject()
  if (window.google?.maps) return Promise.resolve(window.google.maps)

  // evita duplicar el script
  const EXISTING_ID = "gmaps-sdk"
  const prev = document.getElementById(EXISTING_ID)
  if (prev) {
    return new Promise((resolve) => {
      prev.addEventListener("load", () => resolve(window.google.maps), { once: true })
    })
  }

  return new Promise((resolve, reject) => {
    const s = document.createElement("script")
    s.id = EXISTING_ID
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&v=weekly&libraries=geometry`
    s.async = true
    s.onerror = () => reject(new Error("No se pudo cargar Google Maps"))
    s.onload = () => resolve(window.google.maps)
    document.head.appendChild(s)
  })
}

export default function MapCanvas() {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef(new Map())     // id -> Marker
  const routeRef = useRef(null)            // Polyline de la ruta
  const idleListenerRef = useRef(null)     // para limpiar el listener
  const intervalRef = useRef(null)

  useEffect(() => {
    async function init() {
      const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY   // <- simplificado
      const gmaps = await loadGoogleMaps(key)

      const center = { lat: 12.136389, lng: -86.251389 } // Managua
      const map = new gmaps.Map(containerRef.current, {
        center,
        zoom: 12,
        mapId: "DEMO_MAP",
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControl: false,
      })
      mapRef.current = map

      const getSymbol = (heading = 0) => ({
        path: "M 0 -10 L 6 10 L 0 6 L -6 10 Z",
        anchor: new gmaps.Point(0, 0),
        scale: 1,
        fillColor: "#1f2353",
        fillOpacity: 1,
        strokeWeight: 1.5,
        strokeColor: "#ffe15a",
        rotation: heading || 0,
      })

      async function loadVehicles() {
        const b = map.getBounds()
        if (!b) return
        const bbox = [
          b.getSouthWest().lng(),
          b.getSouthWest().lat(),
          b.getNorthEast().lng(),
          b.getNorthEast().lat(),
        ].join(",")

        const res = await fetch(`/api/vehicles?bbox=${bbox}&limit=1500`, { cache: "no-store" })
        const { items = [] } = await res.json()

        const seen = new Set()
        for (const v of items) {
          if (!Number.isFinite(v.lat) || !Number.isFinite(v.lng)) continue
          seen.add(v.id)

          if (!markersRef.current.has(v.id)) {
            const marker = new gmaps.Marker({
              position: { lat: v.lat, lng: v.lng },
              map,
              title: `${v.plate ?? v.id} • ${Math.round(v.speed ?? 0)} km/h`,
              icon: getSymbol(v.heading),
            })
            markersRef.current.set(v.id, marker)
          } else {
            const m = markersRef.current.get(v.id)
            m.setPosition({ lat: v.lat, lng: v.lng })
            m.setIcon(getSymbol(v.heading))
            m.setTitle(`${v.plate ?? v.id} • ${Math.round(v.speed ?? 0)} km/h`)
          }
        }

        // elimina los que ya no vienen
        for (const [id, m] of markersRef.current) {
          if (!seen.has(id)) {
            m.setMap(null)
            markersRef.current.delete(id)
          }
        }
      }

      // ----- Ruta desde ?route=CODE -----
      async function loadRouteFromQuery() {
        const code = new URLSearchParams(window.location.search).get("route")
        if (!code) return

        try {
          // Endpoint que devuelve { coords: [{lat,lng}, ...] }
          const data = await fetch(`/api/route-geometry?code=${encodeURIComponent(code)}`, {
            cache: "no-store",
          }).then(r => r.json())

          if (!data?.coords?.length) return

          // Limpia ruta previa
          if (routeRef.current) {
            routeRef.current.setMap(null)
            routeRef.current = null
          }

          // Dibuja nueva polyline
          routeRef.current = new gmaps.Polyline({
            path: data.coords,
            geodesic: true,
            strokeColor: "#2b6cb0",
            strokeOpacity: 0.9,
            strokeWeight: 4,
            map,
          })

          // Fit bounds a la ruta
          const bounds = new gmaps.LatLngBounds()
          data.coords.forEach(c => bounds.extend(c))
          map.fitBounds(bounds, 48)
        } catch (e) {
          console.error("loadRouteFromQuery error:", e)
        }
      }
      // -----------------------------------

      await loadVehicles()
      await loadRouteFromQuery()

      // refresco periódico y en cada idle
      intervalRef.current = window.setInterval(loadVehicles, 10000)
      idleListenerRef.current = map.addListener("idle", loadVehicles)
    }

    init().catch(console.error)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (idleListenerRef.current) idleListenerRef.current.remove()

      for (const [, m] of markersRef.current) m.setMap(null)
      markersRef.current.clear()
      if (routeRef.current) {
        routeRef.current.setMap(null)
        routeRef.current = null
      }
      mapRef.current = null
    }
  }, [])

  return <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />
}
