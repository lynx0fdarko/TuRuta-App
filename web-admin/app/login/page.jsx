'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientBrowser } from '@/lib/supabase-browser'  // ⬅️ cambio clave

export default function Login() {
  const s = createClientBrowser()
  const r = useRouter()
  const params = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const signIn = async (e) => {
    e?.preventDefault?.()
    if (!email || !password) return alert('Ingresa correo y contraseña')
    setLoading(true)
    const { error } = await s.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) return alert(error.message)
    r.replace(params.get('redirectedFrom') ?? '/dashboard')
  }

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <form onSubmit={signIn} className="w-full max-w-md bg-white rounded-2xl shadow p-6 space-y-3">
        <h1 className="text-xl font-bold">Acceder a EnRuta</h1>
        <input
          className="w-full border rounded-lg h-11 px-3"
          placeholder="Correo"
          type="email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />
        <input
          className="w-full border rounded-lg h-11 px-3"
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full h-11 rounded-full bg-blue-600 text-white font-semibold disabled:opacity-60"
          onClick={signIn}
          disabled={loading}
        >
          {loading ? 'Entrando…' : 'Iniciar sesión'}
        </button>
      </form>
    </div>
  )
}
