"use client"

import { useState } from "react"
import useSWR from "swr"
import SideRail from "@/components/SideRail"
import styles from "./routes.module.css"

const fetcher = (u) => fetch(u).then(r => r.json())

export default function RoutesPage() {
  // Estado del buscador
  const [q, setQ] = useState("")

  // Llamada al endpoint
  const { data, error, isLoading } = useSWR(
    `/api/routes?q=${encodeURIComponent(q)}`,
    fetcher
  )

  // Si la API aún no existe, crea datos de prueba para evitar errores
  const items = data?.items ?? [
    {
      id: 1,
      code: "117",
      name: "Villa José Benito Escobar a Universidad Casimiro Sotelo Montenegro",
      stops: [
        "Villa José Benito Escobar", "Cancha Benito Escobar", "Colegio Las Américas",
        "El Molino", "Transagro", "Pali las Mercedes", "Entrada las Mercedes"
      ]
    },
    {
      id: 2,
      code: "118",
      name: "Villa Libertad a Cuesta El Plomo",
      stops: [
        "Terminal Lourdes Sur", "Villa Libertad", "Ichen", "La Sábana",
        "Pulpería Meydar", "La Chelita", "Farmacia Villa Venezuela"
      ]
    },
    {
      id: 3,
      code: "119",
      name: "Cuesta El Plomo a Villa Fraternidad",
      stops: [
        "Cuesta El Plomo Sur", "Clínica Bethel", "INIMOP", "Centro Comercial Linda Vista",
        "Pulpería Emmanuel", "Fotos Luminiton"
      ]
    },
  ]

  if (error) return <div>Error cargando rutas ❌</div>

  return (
    <main className={styles.screen}>
      <SideRail />

      <header className={styles.header}>
        <h1 className={styles.title}>🧭 Menú de Ruta</h1>
        <div className={styles.logo}>EnRuta</div>
      </header>

      <section className={styles.content}>
        <div className={styles.searchRow}>
          <div className={styles.searchIcon}>🔍</div>
          <input
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            placeholder="Explora y elige tu recorrido"
            className={styles.search}
          />
          <div className={styles.userIcon}>👤</div>
        </div>

        <div className={styles.list}>
          {isLoading && <div className={styles.skel}>Cargando rutas…</div>}

          {!isLoading && items.map(r => (
            <article key={r.id} className={styles.card}>
              <div className={styles.pill}>{r.code}</div>
              <div className={styles.cardBody}>
                <div className={styles.cardTitle}>{r.name}</div>
                {r.stops && (
                  <div className={styles.cardPath}>
                    {r.stops.join(" > ")}...
                  </div>
                )}
                <div className={styles.cardFooter}>
                  <a
                    className={styles.more}
                    href={`/dashboard?route=${encodeURIComponent(r.code)}`}
                  >
                    Ver más →
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
