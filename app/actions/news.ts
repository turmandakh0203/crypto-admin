"use server";
import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import type { Category, News, PageViews } from "@/types/news";

const NEWS_LIST_SELECT =
  "id, title, image_url, slug, category_id, categories(id, name), published, created_at";

export type NewsListItem = Pick<
  News,
  "id" | "title" | "image_url" | "slug" | "category_id" | "categories" | "published" | "created_at"
>;

export async function getNewsListLimit(
  page = 1,
  limit = 10
): Promise<{ data: NewsListItem[]; total: number }> {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const { data, count } = await supabaseAdmin()
    .from("news")
    .select(NEWS_LIST_SELECT, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);
  return { data: (data ?? []) as unknown as NewsListItem[], total: count ?? 0 };
}

export async function getNewsList(): Promise<NewsListItem[]> {
  const { data } = await supabaseAdmin()
    .from("news")
    .select(NEWS_LIST_SELECT)
    .order("created_at", { ascending: false });
  return (data ?? []) as unknown as NewsListItem[];
}

export async function getNewsBySlug(slug: string): Promise<News | null> {
  const { data } = await supabaseAdmin()
    .from("news")
    .select("*, categories(id, name)")
    .eq("slug", slug)
    .single();
  return data as unknown as News | null;
}

type Payload = {
  title: string;
  slug: string;
  category_id: number;
  lead: string;
  content: string;
  image_url: string;
  video_url: string | null;
  author: string | null;
  author_role: string | null;
  exercise_config: string | null;
  tags: string;
  published: boolean;
};

export async function getCategories(): Promise<Category[]> {
  const { data } = await supabaseAdmin()
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return (data ?? []) as Category[];
}

export async function getAllCategories(): Promise<Category[]> {
  const { data } = await supabaseAdmin()
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data ?? []) as Category[];
}

type CategoryPayload = {
  name: string;
  slug: string;
  nav_label: string;
  section_label: string;
  sort_order: number;
  is_active: boolean;
  description: string;
  line1: string;
  line2: string;
  icon: string;
};

export async function saveCategory(
  payload: CategoryPayload,
  id?: number
): Promise<{ error: string | null }> {
  const db = supabaseAdmin();
  if (id) {
    const { error } = await db.from("categories").update(payload).eq("id", id);
    if (!error) revalidatePath("/category");
    return { error: error?.message ?? null };
  } else {
    const { error } = await db.from("categories").insert([payload]);
    if (!error) revalidatePath("/category");
    return { error: error?.message ?? null };
  }
}

export async function deleteCategory(id: number): Promise<{ error: string | null }> {
  const { count } = await supabaseAdmin()
    .from("news")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);

  if (count && count > 0) {
    return { error: `Энэ категорид ${count} мэдээ холбоотой байна. Эхлээд мэдээнүүдийг устга эсвэл өөр категори руу шилжүүл.` };
  }

  const { error } = await supabaseAdmin().from("categories").delete().eq("id", id);
  if (!error) revalidatePath("/category");
  return { error: error?.message ?? null };
}

export async function getNewsViews(): Promise<PageViews[]> {
  const { data } = await supabaseAdmin().from("page_views").select("*");
  return (data ?? []) as PageViews[];
}

export async function deleteNews(id: number): Promise<{ error: string | null }> {
  const { error: pvError } = await supabaseAdmin().from("page_views").delete().eq("news_id", id);
  if (pvError) return { error: pvError.message };

  const { error } = await supabaseAdmin().from("news").delete().eq("id", id);
  if (!error) revalidatePath("/news");
  return { error: error?.message ?? null };
}

export async function saveNews(payload: Payload, id?: number): Promise<{ error: string | null }> {
  const db = supabaseAdmin();

  if (id) {
    const { error } = await db.from("news").update(payload).eq("id", id);
    if (!error) revalidatePath("/news");
    return { error: error?.message ?? null };
  } else {
    const { error } = await db
      .from("news")
      .insert([{ ...payload, created_at: new Date().toISOString() }]);
    if (!error) revalidatePath("/news");
    return { error: error?.message ?? null };
  }
}
