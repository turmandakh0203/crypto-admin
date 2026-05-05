import { getNewsBySlug, getCategories } from '@/app/actions/news'
import NewsForm from '@/components/NewsForm'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function EditNewsPage({ params }: { params: { slug: string } }) {
  const [news, categories] = await Promise.all([
    getNewsBySlug(params.slug),
    getCategories(),
  ])

  if (!news) notFound()

  return <NewsForm existing={news} categories={categories} />
}
