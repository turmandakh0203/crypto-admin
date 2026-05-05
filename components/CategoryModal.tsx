"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveCategory, deleteCategory } from "@/app/actions/news";
import type { Category } from "@/types/news";
import DeleteButton from "@/components/DeleteButton";

interface Props {
  category?: Category;
  onClose: () => void;
}

export default function CategoryModal({ category, onClose }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    sort_order: category?.sort_order ?? 0,
    name: category?.name ?? "",
    slug: category?.slug ?? "",
    nav_label: category?.nav_label ?? "",
    section_label: category?.section_label ?? "",
    line1: category?.line1 ?? "",
    line2: category?.line2 ?? "",
    description: category?.description ?? "",
    icon: category?.icon ?? "",
    is_active: category?.is_active ?? true,
  });

  function set(key: keyof typeof form, value: string | number | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    if (!form.name || !form.slug) {
      setError("Нэр болон slug заавал бөглөнө үү.");
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await saveCategory(
      {
        sort_order: Number(form.sort_order),
        name: form.name,
        slug: form.slug,
        nav_label: form.nav_label,
        section_label: form.section_label,
        line1: form.line1,
        line2: form.line2,
        description: form.description,
        icon: form.icon,
        is_active: form.is_active,
      },
      category?.id
    );
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    router.refresh();
    onClose();
  }

  async function handleDelete() {
    if (!category) return;
    const { error } = await deleteCategory(category.id);
    if (error) {
      setError(error);
      return;
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-surface border border-faint w-full max-w-[560px] rounded-xl shadow-lg flex flex-col overflow-hidden max-h-[90vh]">
        {/* top accent line */}
        <div
          className="absolute inset-x-0 top-0 h-[1px] z-10"
          style={{
            background: "linear-gradient(90deg, transparent 0%, #e63329 50%, transparent 100%)",
          }}
        />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-faint flex-shrink-0">
          <div>
            <p className="text-[9px] tracking-[0.2em] uppercase text-accent font-mono mb-0.5">
              {category ? "Засах" : "Шинэ категори"}
            </p>
            <h2 className="text-lg text-ink font-ttNormsPro font-bold">
              {category ? category.name : "Категори нэмэх"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-ink transition text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-5 overflow-y-auto">
          {/* Row 1: sort_order + is_active */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Эрэмбэ">
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => set("sort_order", e.target.value)}
                className="adm-input"
                placeholder="0"
              />
            </Field>
            <Field label="Төлөв">
              <button
                type="button"
                onClick={() => set("is_active", !form.is_active)}
                className={`h-[32px] flex items-center gap-2 text-xs px-4 rounded-full border transition w-full justify-center ${
                  form.is_active
                    ? "text-success border-[rgba(80,216,128,0.4)] bg-[rgba(80,216,128,0.08)]"
                    : "text-accent border-[rgba(230,51,41,0.4)] bg-[rgba(230,51,41,0.08)]"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${form.is_active ? "bg-success" : "bg-accent"}`}
                />
                {form.is_active ? "Идэвхтэй" : "Идэвхгүй"}
              </button>
            </Field>
          </div>

          {/* Row 2: name + slug */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Нэр *">
              <input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="adm-input"
                placeholder="Крипто мэдээ"
              />
            </Field>
            <Field label="Slug *">
              <input
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)}
                className="adm-input"
                placeholder="crypto-news"
              />
            </Field>
          </div>

          {/* Row 3: nav_label + section_label */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nav label">
              <input
                value={form.nav_label}
                onChange={(e) => set("nav_label", e.target.value)}
                className="adm-input"
                placeholder="Мэдээ"
              />
            </Field>
            <Field label="Section label">
              <input
                value={form.section_label}
                onChange={(e) => set("section_label", e.target.value)}
                className="adm-input"
                placeholder="Онцлох мэдээ"
              />
            </Field>
          </div>

          {/* Row 4: line1 + line2 */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Line 1">
              <input
                value={form.line1}
                onChange={(e) => set("line1", e.target.value)}
                className="adm-input"
                placeholder="Шугам 1"
              />
            </Field>
            <Field label="Line 2">
              <input
                value={form.line2}
                onChange={(e) => set("line2", e.target.value)}
                className="adm-input"
                placeholder="Шугам 2"
              />
            </Field>
          </div>

          {/* Row 5: icon */}
          <Field label="Icon">
            <input
              value={form.icon}
              onChange={(e) => set("icon", e.target.value)}
              className="adm-input"
              placeholder="bitcoin, ethereum ..."
            />
          </Field>

          {/* Row 6: description */}
          <Field label="Тайлбар">
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="adm-textarea resize-none"
              rows={3}
              placeholder="Категорийн тухай товч тайлбар..."
            />
          </Field>

          {error && <p className="text-accent text-xs font-mono">{error}</p>}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-4 border-t border-faint flex items-center gap-2 flex-shrink-0 justify-between">
          {category && <DeleteButton onDelete={handleDelete} label="Устгах" />}
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex px-4 py-1.5 bg-default text-white text-[10px] tracking-[0.14em] uppercase rounded-full font-ttNormsPro hover:bg-[#c0281f] transition disabled:opacity-50"
          >
            {loading ? "Хадгалж байна..." : "Хадгалах"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] tracking-widest uppercase text-muted font-mono">{label}</label>
      {children}
    </div>
  );
}
