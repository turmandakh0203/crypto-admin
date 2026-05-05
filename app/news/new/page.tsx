import NewsForm from '@/components/NewsForm'
import { getCategories } from '@/app/actions/news'

export default async function NewNewsPage() {
  const categories = await getCategories()
  return <NewsForm categories={categories} />
}
