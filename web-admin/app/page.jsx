import MapCanvas from "@/components/MapCanvas"
import SideRail from "@/components/SideRail"

export default function Home() {
  return (
    <main
      style={{
        position: "relative",
        width: "100%",
        height: "100dvh",
        overflow: "hidden",
        background: "#f6f0c8",
      }}
    >
      {/* Rail a la izquierda */}
      <SideRail />

      {/* Logo */}
      <div
        style={{
          position: "absolute",
          right: 16,
          top: 16,
          zIndex: 20, // por encima del mapa
          background: "#2b2851",
          color: "white",
          padding: "10px 18px",
          borderRadius: "16px 16px 0 16px",
          fontWeight: 700,
          fontSize: 22,
          pointerEvents: "auto",
        }}
      >
        EnRuta
      </div>

      {/* Mapa (debajo visualmente) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,           // <- debajo del rail y logo
          pointerEvents: "auto", // el mapa sigue siendo interactivo
        }}
      >
        <MapCanvas />
      </div>
    </main>
  )
}
