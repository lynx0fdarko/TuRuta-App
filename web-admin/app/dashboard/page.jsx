import MapCanvas from "@/components/MapCanvas"
import SideRail from "@/components/SideRail"

export default function Dashboard() {
  return (
    <main style={{ position:"relative", width:"100%", height:"100dvh", overflow:"hidden", background:"#f6f0c8" }}>
      <SideRail />
      <div style={{
        position:"absolute", right:16, top:16, zIndex:20,
        background:"#2b2851", color:"white", padding:"10px 18px",
        borderRadius:"16px 16px 0 16px", fontWeight:700, fontSize:22
      }}>
        EnRuta
      </div>
      <div style={{ position:"absolute", inset:0, zIndex:10 }}>
        <MapCanvas />
      </div>
    </main>
  )
}
