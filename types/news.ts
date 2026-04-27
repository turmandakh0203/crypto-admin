// Supabase schema-тай яг тохирсон төрөл
export type News = {
  id: number
  title: string
  slug: string
  category: string
  lead: string
  content: string
  image_url: string
  tags: string        // JSON text: '["tag1","tag2"]'
  published: boolean
  created_at: string
  video_url?: string
  exercise_config?: string
  author?: string
  author_role?: string
}

export const CATEGORIES = ['Криптограф', 'Криптоанализ', 'Кодлол', 'Мэдээ'] as const

export const NAV = [
  { href: '/',         label: 'Dashboard',  icon: '▦' },
  { href: '/news',     label: 'Мэдээ',      icon: '≡' },
  // { href: '/news/new', label: 'Шинэ мэдээ', icon: '+' },
] as const
