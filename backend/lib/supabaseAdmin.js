// backend/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

// Usar SERVICE_ROLE_KEY en backend (⚠️ nunca en frontend)
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default supabase
