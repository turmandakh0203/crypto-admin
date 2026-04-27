import { supabaseAdmin, type News } from '@/lib/supabase'
import NewsForm from '@/components/NewsForm'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function EditNewsPage({ params }: { params: { slug: string } }) {
  const { data } = await supabaseAdmin()
    .from('news')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!data) notFound()

  return <NewsForm existing={data as News} />
}
