// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL) {
  throw new Error('[Supabase] Falta EXPO_PUBLIC_SUPABASE_URL en .env')
}
if (!SUPABASE_ANON_KEY) {
  throw new Error('[Supabase] Falta EXPO_PUBLIC_SUPABASE_ANON_KEY en .env')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,       // guarda la sesión local
    autoRefreshToken: true,     // refresca tokens automáticamente
    detectSessionInUrl: false,  // en RN no se usa URL para auth
  },
})
