"use server";
import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import type { Comment } from "@/types/news";

export async function getComments(status?: string): Promise<Comment[]> {
  let query = supabaseAdmin()
    .from("comments")
    .select("*, news(id, title, slug)")
    .order("created_at", { ascending: false });

  if (status && ["pending", "published", "spam"].includes(status)) {
    query = query.eq("status", status);
  }

  const { data } = await query;
  return (data ?? []) as unknown as Comment[];
}

export async function getCommentCounts(): Promise<Record<string, number>> {
  const { data } = await supabaseAdmin()
    .from("comments")
    .select("status");

  const counts: Record<string, number> = { all: 0, pending: 0, published: 0, spam: 0 };
  for (const row of data ?? []) {
    counts.all++;
    counts[row.status] = (counts[row.status] ?? 0) + 1;
  }
  return counts;
}

export async function setCommentStatus(
  id: number,
  status: "pending" | "published" | "spam"
): Promise<void> {
  await supabaseAdmin().from("comments").update({ status }).eq("id", id);
  revalidatePath("/comments");
}

export async function deleteComment(id: number): Promise<void> {
  await supabaseAdmin().from("comments").delete().eq("id", id);
  revalidatePath("/comments");
}
