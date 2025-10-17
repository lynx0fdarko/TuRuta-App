"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabaseBrowser } from "@/lib/supabase-browser"
import styles from "./login.module.css"

export default function LoginPage() {
  const router = useRouter()
  const supabase = supabaseBrowser()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          // si "recordar", sesión de larga duración
          shouldCreateUser: false,
        },
      })
      if (error) throw error

      // Configura persistencia: true => localStorage, false => sessionStorage
      // (En @supabase/ssr se maneja con cookies, pero dejamos esto como UX extra)
      if (remember) {
        // nada extra que hacer; cookie persistente por default
      }

      // redirige al dashboard o al mapa
      router.replace("/dashboard")
    } catch (err) {
      setError(err?.message || "No se pudo iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.screen}>
      {/* Fondo: imagen */}
      <div className={styles.bg} />

      {/* Card central */}
      <section className={styles.card}>
        {/* Avatar/logo redondo */}
        <div className={styles.avatar}>
          <span className={styles.busIcon}>🚌</span>
        </div>

        <form onSubmit={onSubmit} className={styles.form} aria-label="Formulario de inicio de sesión">
          <label className={styles.label} htmlFor="email">Correo o usuario</label>
          <input
            id="email"
            type="email"
            className={styles.input}
            placeholder="Correo o usuario"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className={styles.hidden} htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            className={styles.input}
            placeholder="Contraseña"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className={styles.row}>
            <label className={styles.check}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Recordar contraseña</span>
            </label>

            <button
              type="button"
              className={styles.link}
              onClick={async () => {
                if (!email) {
                  setError("Escribe tu correo arriba para enviarte el enlace de recuperación.")
                  return
                }
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                  redirectTo: `${window.location.origin}/login/reset`,
                })
                if (error) setError(error.message)
                else alert("Te enviamos un correo para restablecer tu contraseña.")
              }}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {error && <div className={styles.error} role="alert">{error}</div>}

          <button className={styles.cta} type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "¡Comencemos!"}
          </button>
        </form>
      </section>
    </main>
  )
}
