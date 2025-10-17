"use client"
import SideRail from "@/components/SideRail"
import styles from "./reports.module.css"

const TAGS = ["Retraso", "Estado de unidad", "Desvío", "Accidente"]

const REPORTES = [
  {
    id: "117",
    ruta: "117",
    tipo: "Retraso",
    titulo: "Villa José Benito Escobar → Universidad Casimiro Sotelo",
    detalle:
      "Se detuvo en la parada de la Universidad Casimiro Sotelo 20 minutos, causó atraso y embotellamiento.",
  },
  {
    id: "118",
    ruta: "118",
    tipo: "Desvío",
    titulo: "Villa Libertad → Cuesta El Plomo",
    detalle:
      "Por trabajos viales en Calle Villa Venezuela tomaron un desvío, alterando 10 minutos del recorrido normal.",
  },
]

const COOPS = [
  { name: "Cooperativa Cootbusa", desc: "Opera la ruta 101, que va desde el Mercado Mayoreo hacia Las Brisas." },
  { name: "Cooperativa Andrés Castro", desc: "Opera la ruta 102, que recorre el trayecto entre el Mercado Mayoreo y Acahualinca." },
  { name: "Cooperativa Parrales Vallejos", desc: "Maneja la ruta 103, que va desde la Cuesta El Plomo hasta Laureles Sur." },
  { name: "Cooperativa Omar Baca", desc: "Se encarga de la ruta 104, que conecta el Mercado Mayoreo con Hialeah." },
]

export default function ReportsPage() {
  return (
    <main className={styles.root}>
      <SideRail />

      {/* Header + Logo */}
      <header className={styles.header}>
        <h1 className={styles.title}>❗ Reportes ciudadanos</h1>
        <div className={styles.logo}>EnRuta</div>
      </header>

      <section className={styles.columns}>
        {/* Columna izquierda */}
        <div className={styles.leftCol}>
          {/* Cintas de filtros */}
          <div className={styles.tagsCard}>
            <div className={styles.routePill}>117</div>
            <div className={styles.tagList}>
              {TAGS.map(t => (
                <span key={t} className={styles.tag}>{t}</span>
              ))}
              <button className={styles.moreBtn}>Ver más</button>
            </div>
          </div>

          {/* Buscador de reportes */}
          <div className={styles.filtersCard}>
            <div className={styles.filtersHeader}>📘 Reportes ciudadanos</div>
            <div className={styles.inputWrap}>
              <input placeholder="Ruta o Unidad (Opcional)" className={styles.input} />
            </div>
          </div>

          {/* Tarjetas ejemplo */}
          {REPORTES.map(r => (
            <article key={r.id} className={styles.reportCard}>
              <div className={styles.reportHeader}>
                <span className={styles.routeChip}>{r.ruta}</span>
                <span
                  className={`${styles.badge} ${
                    r.tipo === "Retraso"
                      ? styles.badgeDelay
                      : r.tipo === "Desvío"
                      ? styles.badgeDetour
                      : styles.badgeDefault
                  }`}
                >
                  {r.tipo}
                </span>
              </div>

              <div className={styles.reportBody}>
                <div className={styles.reportTitle}>{r.titulo}</div>
                <p className={styles.reportText}>{r.detalle}</p>
              </div>

              <div className={styles.reportFooter}>
                <button className={styles.linkBtn}>Ver detalle</button>
              </div>
            </article>
          ))}
        </div>

        {/* Columna derecha */}
        <div className={styles.rightCol}>
          <div className={styles.alertHeader}>📣 Alertar a cooperativas</div>

          {COOPS.map(c => (
            <div key={c.name} className={styles.coopRow}>
              <div className={styles.coopInfo}>
                <div className={styles.coopName}>🚌 {c.name}</div>
                <div className={styles.coopDesc}>{c.desc}</div>
              </div>
              <button
                className={styles.alertBtn}
                onClick={() => alert(`Alerta enviada a ${c.name}`)}
              >
                🔔 Enviar alerta
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
