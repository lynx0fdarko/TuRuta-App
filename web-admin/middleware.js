// middleware.js
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(req) {
  const { pathname } = req.nextUrl

  // rutas públicas
  if (pathname.startsWith('/login') || pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  const res = NextResponse.next()

  // Cliente Supabase para middleware (usa cookies del req/res)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => res.cookies.set({ name, value, ...options }),
        remove: (name, options) => res.cookies.set({ name, value: '', ...options }),
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const url = new URL('/login', req.url)
    url.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(url)
  }

  return res
}

export const config = { matcher: ['/((?!_next|favicon.ico|images).*)'] }
