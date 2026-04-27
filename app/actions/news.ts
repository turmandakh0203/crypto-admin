'use server'
import { supabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

type Payload = {
  title: string
  slug: string
  category: string
  lead: string
  content: string
  image_url: string
  video_url: string | null
  author: string | null
  author_role: string | null
  exercise_config: string | null
  tags: string
  published: boolean
}

export async function deleteNews(id: number): Promise<{ error: string | null }> {
  const { error } = await supabaseAdmin().from('news').delete().eq('id', id)
  if (!error) revalidatePath('/news')
  return { error: error?.message ?? null }
}

export async function saveNews(payload: Payload, id?: number): Promise<{ error: string | null }> {
  const db = supabaseAdmin()

  if (id) {
    const { error } = await db.from('news').update(payload).eq('id', id)
    if (!error) revalidatePath('/news')
    return { error: error?.message ?? null }
  } else {
    const { error } = await db.from('news').insert([{ ...payload, created_at: new Date().toISOString() }])
    if (!error) revalidatePath('/news')
    return { error: error?.message ?? null }
  }
}
