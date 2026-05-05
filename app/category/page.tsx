import { getAllCategories } from "@/app/actions/news";
import CategoryList from "@/components/CategoryList";

export const dynamic = "force-dynamic";

export default async function CategoryPage() {
  const categories = await getAllCategories();
  return <CategoryList initialCategories={categories} />;
}
