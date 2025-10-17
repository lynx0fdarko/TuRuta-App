import MapCanvas from "@/components/MapCanvas"

export default function Home() {
  return (
    <main style={{ position: "relative", width: "100%", height: "100dvh", overflow: "hidden", background: "#0c0e16" }}>
      {/* Sidebar vertical de acciones (placeholder) */}
      <aside style={{
        position: "absolute", left: 12, top: 80, bottom: 80, width: 52,
        display: "flex", flexDirection: "column", gap: 12, alignItems: "center",
        padding: 8, borderRadius: 14, backdropFilter: "blur(6px)",
        background: "rgba(255,255,255,0.08)", zIndex: 10
      }}>
        {["🚌","📍","🗺️","🔄","🚏","🔔","➕","⚙️"].map((ico, i) => (
          <button key={i} aria-label={`btn-${i}`} style={{
            width: 44, height: 44, borderRadius: 12, border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.06)", fontSize: 20, color: "white", cursor: "pointer"
          }}>
            {ico}
          </button>
        ))}
      </aside>

      {/* Logo EnRuta arriba-derecha */}
      <div style={{
        position: "absolute", right: 16, top: 16, zIndex: 10,
        background: "#2b2851", color: "white", padding: "10px 18px",
        borderRadius: "16px 16px 0 16px", fontWeight: 700, fontSize: 22
      }}>
        EnRuta
      </div>

      {/* Mapa ocupando todo */}
      <MapCanvas />
    </main>
  )
}
