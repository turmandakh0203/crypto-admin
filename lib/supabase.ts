import { createClient } from '@supabase/supabase-js'

export type { News } from '@/types/news'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side (form save/update)
export const supabase = createClient(supabaseUrl, supabaseKey)

// Server-side (RLS тойрч бүгдийг уншина, cache байхгүй)
export const supabaseAdmin = () => createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { global: { fetch: (url, options = {}) => fetch(url, { ...options, cache: 'no-store' }) } }
)
