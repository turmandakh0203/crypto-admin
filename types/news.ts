export type Category = {
  id: number;
  slug: string;
  name: string;
  section_label?: string;
  line1?: string;
  line2?: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  nav_label?: string;
  icon?: string;
};

export type PageViews = {
  id: number;
  news_id: number;
  viewed_at: string;
};

export type News = {
  id: number;
  title: string;
  slug: string;
  category_id: number;
  categories?: { id: number; name: string }; // joined from categories table
  lead: string;
  content: string;
  image_url: string;
  tags: string; // JSON text: '["tag1","tag2"]'
  published: boolean;
  created_at: string;
  video_url?: string;
  exercise_config?: string;
  author?: string;
  author_role?: string;
};

export type Comment = {
  id: number;
  news_id: number;
  news?: { id: number; title: string; slug: string };
  author_name: string;
  author_email?: string;
  body: string;
  status: "pending" | "published" | "spam";
  created_at: string;
};

import { ComponentType } from "react";
import { CategoryIcon, CommentIcon, MenuIcon, NewsListIcon } from "@/components/icons";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

export const NAV: NavItem[] = [
  { href: "/", label: "Dashboard", icon: MenuIcon },
  { href: "/news", label: "Мэдээ", icon: NewsListIcon },
  { href: "/category", label: "Категори", icon: CategoryIcon },
  { href: "/comments", label: "Сэтгэгдэл", icon: CommentIcon },
];
