import SideRail from "@/components/SideRail"
import styles from "./reports.module.css"
import SearchPanel from "./SearchPanel"
import AlertButton from "@/components/AlertButton" // si ya lo tienes; sino quita el botón

const COOPS = [
  { name: "Cooperativa Cootbusa",         desc: "Opera la ruta 101, que va desde el Mercado Mayoreo hacia Las Brisas." },
  { name: "Cooperativa Andrés Castro",    desc: "Opera la ruta 102, que recorre el trayecto entre el Mercado Mayoreo y Acahualinca." },
  { name: "Cooperativa Parrales Vallejos",desc: "Maneja la ruta 103, que va desde la Cuesta El Plomo hasta Laureles Sur." },
  { name: "Cooperativa Omar Baca",        desc: "Se encarga de la ruta 104, que conecta el Mercado Mayoreo con Hialeah." },
]

export default function ReportsPage() {
  let items = []  // se llenará desde SearchPanel
  let loading = false

  return (
    <main className={styles.root}>
      <SideRail />
      <header className={styles.header}>
        <h1 className={styles.title}>❗ Reportes ciudadanos</h1>
        <div className={styles.logo}>EnRuta</div>
      </header>

      <section className={styles.columns}>
        {/* Izquierda: buscador + resultados */}
        <div className={styles.leftCol}>
          <SearchPanel onResults={(res, meta) => { items = res; loading = meta.loading }} />

          {(loading ? Array.from({length:2}).map((_,i)=>(
            <div key={i} className={styles.reportCard}>Cargando…</div>
          )) : (items.length ? items : [])).map((r, idx) => (
            <article key={r?.id ?? idx} className={styles.reportCard}>
              <div className={styles.reportHeader}>
                <span className={styles.routeChip}>{r.ruta || "—"}</span>
                <span className={`${styles.badge} ${
                  r.tipo === "Retraso" ? styles.badgeDelay :
                  r.tipo === "Desvío"  ? styles.badgeDetour :
                  styles.badgeDefault
                }`}>{r.tipo || "Reporte"}</span>
              </div>
              <div className={styles.reportBody}>
                <div className={styles.reportTitle}>{r.titulo || "Sin título"}</div>
                <p className={styles.reportText}>{r.detalle || "—"}</p>
              </div>
              <div className={styles.reportFooter}>
                <button className={styles.linkBtn}>Ver detalle</button>
              </div>
            </article>
          ))}
        </div>

        {/* Derecha: cooperativas (estático por ahora) */}
        <div className={styles.rightCol}>
          <div className={styles.alertHeader}>📣 Alertar a cooperativas</div>
          {COOPS.map(c => (
            <div key={c.name} className={styles.coopRow}>
              <div className={styles.coopInfo}>
                <div className={styles.coopName}>🚌 {c.name}</div>
                <div className={styles.coopDesc}>{c.desc}</div>
              </div>
              <button className={styles.alertBtn}>🔔 Enviar alerta</button>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
