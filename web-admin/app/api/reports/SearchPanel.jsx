"use client"
import useSWR from "swr"
import { useEffect, useMemo, useState } from "react"
import styles from "./reports.module.css"

const fetcher = (u) => fetch(u).then(r => r.json())

export default function SearchPanel({ onResults }) {
  const [q, setQ] = useState("")
  const [tag, setTag] = useState("") // "Retraso" | "Desvío" | "Accidente" | "Estado de unidad"
  const [debouncedQ, setDebouncedQ] = useState("")

  // debounce input 300ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim()), 300)
    return () => clearTimeout(t)
  }, [q])

  // rutas sugeridas
  const { data: routes } = useSWR(
    debouncedQ ? `/api/routes?q=${encodeURIComponent(debouncedQ)}` : null,
    fetcher
  )

  // reportes filtrados
  const { data: reports, isLoading } = useSWR(
    `/api/reports?q=${encodeURIComponent(debouncedQ)}${tag ? `&tag=${encodeURIComponent(tag)}` : ""}`,
    fetcher
  )

  // pasa resultados arriba para renderizar tarjetas
  useEffect(() => {
    onResults?.(reports?.items ?? [], { loading: isLoading })
  }, [reports, isLoading, onResults])

  const TAGS = useMemo(() => ([
    "Retraso", "Estado de unidad", "Desvío", "Accidente"
  ]), [])

  return (
    <>
      {/* Cinta de tags */}
      <div className={styles.tagsCard}>
        <div className={styles.routePill}>{debouncedQ || "117"}</div>
        <div className={styles.tagList}>
          {TAGS.map(t => (
            <button
              key={t}
              className={`${styles.tag} ${tag === t ? styles.badgeDelay : ""}`}
              onClick={() => setTag(tag === t ? "" : t)}
            >
              {t}
            </button>
          ))}
          <button className={styles.moreBtn} onClick={() => setTag("")}>Ver más</button>
        </div>
      </div>

      {/* Buscador */}
      <div className={styles.filtersCard}>
        <div className={styles.filtersHeader}>📘 Reportes ciudadanos</div>
        <div className={styles.inputWrap}>
          <input
            placeholder="Ruta o Unidad (Opcional)"
            className={styles.input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            list="routes-suggest"
          />
          {/* sugerencias de rutas (igual a menú de rutas) */}
          <datalist id="routes-suggest">
            {(routes?.items ?? []).map(r =>
              <option key={r.id} value={r.code}>{r.name}</option>
            )}
          </datalist>
        </div>
      </div>
    </>
  )
}
