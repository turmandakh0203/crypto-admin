import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'

export type { News } from '@/types/news'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

// Client-side: cookie-д session хадгалдаг тул middleware-тай зөв ажилладаг
export const supabase = createClientComponentClient()

// Server-side (RLS тойрч бүгдийг уншина, cache байхгүй)
export const supabaseAdmin = () => createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { global: { fetch: (url, options = {}) => fetch(url, { ...options, cache: 'no-store' }) } }
)
