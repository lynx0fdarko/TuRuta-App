// lib/supabase-browser.js
"use client"
import { createBrowserClient } from "@supabase/ssr"
export function supabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY")
  return createBrowserClient(url, key)
}
