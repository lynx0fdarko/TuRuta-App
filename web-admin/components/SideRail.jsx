"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

const ITEMS = [
  { href: "/dashboard", label: "Mapa",     icon: "🚌" },
  { href: "/reports",   label: "Reportes", icon: "❗" },
   { href: "/routes",    label: "Rutas",    icon: "🗺️" },
]


export default function SideRail() {
  const pathname = usePathname()
  return (
    <aside style={{
      position: "absolute",
      left: 12, top: 80, bottom: 80, width: 52,
      display: "flex", flexDirection: "column", gap: 12, alignItems: "center",
      padding: 8, borderRadius: 14, backdropFilter: "blur(6px)",
      background: "rgba(255,255,255,0.08)",
      zIndex: 20,                 // <- por encima del mapa
      pointerEvents: "auto"
    }}>
      {ITEMS.map((it) => {
        const active = pathname === it.href
        return (
          <Link key={it.href} href={it.href} aria-label={it.label}
            style={{
              width: 44, height: 44, borderRadius: 12, display: "grid",
              placeItems: "center", fontSize: 20, color: "white",
              textDecoration: "none", cursor: "pointer",
              border: active ? "2px solid #ffd84d" : "1px solid rgba(255,255,255,0.2)",
              background: active ? "rgba(255,216,77,0.25)" : "rgba(255,255,255,0.06)",
              boxShadow: active ? "0 6px 20px rgba(255,216,77,0.25)" : "none"
            }}>
            {it.icon}
          </Link>
        )
      })}
    </aside>
  )
}
