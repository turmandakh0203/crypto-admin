"use client";
import { useState, useRef } from "react";
import { type News, type Category } from "@/types/news";
import { saveNews } from "@/app/actions/news";
import { useRouter } from "next/navigation";
import TiptapEditor from "./TiptapEditor";
import { supabase } from "@/lib/supabase";
import { ImageIcon } from "./icons";

function parseTags(raw: string | string[] | undefined): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

type Props = { existing?: News; categories: Category[] };

export default function NewsForm({ existing, categories }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [imgUploading, setImgUploading] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [pushNotif, setPushNotif] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const imgFileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: existing?.title ?? "",
    slug: existing?.slug ?? "",
    category_id: existing?.category_id ?? 0,
    lead: existing?.lead ?? "",
    content: existing?.content ?? "",
    image_url: existing?.image_url ?? "",
    video_url: existing?.video_url ?? "",
    author: existing?.author ?? "",
    author_role: existing?.author_role ?? "",
    exercise_config: existing?.exercise_config ?? "",
    tags: parseTags(existing?.tags),
    published: existing?.published ?? false,
  });

  const handleTitle = (v: string) => {
    setForm((f) => ({
      ...f,
      title: v,
      slug:
        f.slug ||
        v
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
    }));
  };

  const uploadImage = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setImgUploading(true);
    setMsg(null);
    const ext = file.name.split(".").pop();
    const path = `covers/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("Images").upload(path, file, { upsert: true });
    if (error) {
      setMsg({ type: "error", text: "Upload амжилтгүй: " + error.message });
    } else {
      const { data } = supabase.storage.from("Images").getPublicUrl(path);
      setForm((f) => ({ ...f, image_url: data.publicUrl }));
    }
    setImgUploading(false);
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const t = tagInput.trim();
      if (t && !form.tags.includes(t)) setForm((f) => ({ ...f, tags: [...f.tags, t] }));
      setTagInput("");
    }
  };
  const removeTag = (t: string) =>
    setForm((f) => ({ ...f, tags: f.tags.filter((x: string) => x !== t) }));

  const save = async (publishAs: boolean) => {
    if (!form.title || !form.slug) {
      setMsg({ type: "error", text: "Гарчиг болон slug заавал оруулна уу!" });
      return;
    }
    setLoading(true);
    setMsg(null);
    const payload = {
      title: form.title,
      slug: form.slug,
      category_id: form.category_id,
      lead: form.lead,
      content: form.content,
      image_url: form.image_url,
      video_url: form.video_url || null,
      author: form.author || null,
      author_role: form.author_role || null,
      exercise_config: form.exercise_config || null,
      tags: JSON.stringify(form.tags),
      published: publishAs,
    };
    const { error } = await saveNews(payload, existing?.id);
    setLoading(false);
    if (error) {
      setMsg({ type: "error", text: "Алдаа: " + error });
    } else {
      setForm((f) => ({ ...f, published: publishAs }));
      setMsg({ type: "success", text: publishAs ? "✓ Нийтлэгдлээ!" : "✓ Нөөрөг хадгалагдлаа!" });
      setTimeout(() => router.push("/news"), 1200);
    }
  };

  return (
    <div className="h-full bg-bg text-ink flex flex-col overflow-hidden">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-8 py-[9px] border-b border-border flex-shrink-0">
        <h1 className="font-ttNormsPro font-bold text-[28px] tracking-[0.05em] uppercase">
          {existing ? (
            <>
              МЭДЭЭ <span className="text-accent">ЗАСАХ</span>
            </>
          ) : (
            <>
              ШИНЭ <span className="text-accent">МЭДЭЭ</span>
            </>
          )}
        </h1>
        <div className="flex items-center gap-3">
          {msg && (
            <span
              className={`text-[11px] font-mono ${msg.type === "error" ? "text-accent" : "text-success"}`}
            >
              {msg.text}
            </span>
          )}
          <button
            onClick={() => save(false)}
            disabled={loading}
            className="px-3 py-1.5 text-[12px] tracking-[0.14em] uppercase font-bebas border border-amber text-amber hover:text-ink hover:border-ink rounded-full transition"
          >
            {loading ? "..." : "DRAFT ХАДГАЛАХ"}
          </button>
          <button
            onClick={() => save(true)}
            disabled={loading}
            className="px-3 py-1.5 text-[12px] tracking-[0.14em] uppercase font-bebas bg-accent text-white rounded-full hover:bg-[#c0281f] transition"
          >
            {loading ? "..." : "НИЙТЛЭХ"}
          </button>
        </div>
      </div>

      {/* ── Main 2-column layout ── */}
      <div className="flex flex-1 min-h-0">
        {/* ── Left: Editor ── */}
        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="block text-[10px] tracking-[0.12em] uppercase text-muted font-bebas font-semibold mb-1.5">
              Гарчиг
            </label>
            <input
              className="w-full bg-transparent border border-border rounded-full px-4 py-1.5 text-[15px] placeholder:text-muted/40 focus:outline-none focus:border-accent transition"
              value={form.title}
              onChange={(e) => handleTitle(e.target.value)}
              placeholder="Мэдээний гарчиг оруулна уу..."
            />
          </div>
          {/* Lead / sub-title */}
          <div>
            <label className="block text-[10px] tracking-[0.12em] uppercase text-muted font-bebas font-semibold mb-1.5">
              Дэд гарчиг / Хураангуй
            </label>
            <input
              className="w-full bg-transparent border border-border rounded-full px-4 py-1.5 text-[14px] text-ink placeholder:text-muted/40 focus:outline-none focus:border-accent transition"
              value={form.lead}
              onChange={(e) => setForm((f) => ({ ...f, lead: e.target.value }))}
              placeholder="Товч тайлбар..."
            />
          </div>
          {/* Rich text editor */}
          <div className="grid">
            <label className="block text-[10px] tracking-[0.12em] uppercase text-muted font-bebas font-semibold mb-1.5">
              Агуулга
            </label>
            <TiptapEditor
              value={form.content}
              onChange={(html) => setForm((f) => ({ ...f, content: html }))}
            />
          </div>
          {/* Exercise config */}
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-bebas font-semibold mb-1.5">
              Exercise config (JSON)
            </label>
            <textarea
              className="w-full bg-transparent border border-faint rounded-xl px-3 py-1.5 text-[12px] font-bebas text-ink placeholder:text-muted/30 focus:outline-none focus:border-border transition resize-none"
              rows={10}
              value={form.exercise_config}
              onChange={(e) => setForm((f) => ({ ...f, exercise_config: e.target.value }))}
              placeholder={'{"title":"...","inputs":[...],"actions":[...]}'}
            />
          </div>{" "}
        </div>

        {/* ── Right: Sidebar ── */}
        <div className="w-[400px] border-l border-border overflow-y-auto flex-shrink-0 flex flex-col">
          <div className="px-5 py-4 border-b border-faint">
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted font-bebas font-semibold">
              Нийтлэлийн мэдээлэл
            </p>
          </div>

          <div className="flex flex-col gap-5 px-5 py-5">
            {/* Author */}
            <SideField label="Зохиогч">
              <input
                className="sidebar-input"
                value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                placeholder="Б. Нарантуяа"
              />
            </SideField>

            {/* Author role */}
            <SideField label="Зохиогчийн үүрэг">
              <input
                className="sidebar-input"
                value={form.author_role}
                onChange={(e) => setForm((f) => ({ ...f, author_role: e.target.value }))}
                placeholder="Редактор, Судлаач..."
              />
            </SideField>

            {/* Category */}
            <SideField label="Ангилал">
              <select
                className="sidebar-input"
                value={form.category_id}
                onChange={(e) => setForm((f) => ({ ...f, category_id: Number(e.target.value) }))}
              >
                <option value={0} disabled>
                  Ангилал сонгох...
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </SideField>

            {/* Tags */}
            <SideField label="Tag-ууд (Enter дарж нэмэх)">
              <div className="flex flex-wrap gap-1.5 p-2 border border-border rounded-full bg-surface min-h-[38px]">
                {form.tags.map((t: string) => (
                  <span
                    key={t}
                    className="flex items-center gap-1 text-[10px] tracking-[0.1em] uppercase font-mono px-2 py-0.5 rounded-full border border-[rgba(230,51,41,0.5)] text-accent bg-[rgba(230,51,41,0.08)]"
                  >
                    {t}
                    <button onClick={() => removeTag(t)} className="hover:opacity-70 leading-none">
                      ×
                    </button>
                  </span>
                ))}
                <input
                  className="text-[11px] font-mono bg-transparent focus:outline-none text-muted placeholder:text-muted/30 min-w-[80px] flex-1"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={addTag}
                  placeholder="+ таг нэмэх"
                />
              </div>
            </SideField>

            {/* Slug (collapsed, small) */}
            <div>
              <label className="block text-[10px] tracking-[0.12em] uppercase text-muted font-bebas font-semibold mb-1.5">
                Slug (URL)
              </label>
              <input
                className="sidebar-input"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="news-slug-url"
              />
            </div>

            {/* YouTube */}
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-muted font-bebas font-semibold mb-1.5">
                YouTube URL
              </label>
              <input
                className="sidebar-input"
                value={form.video_url}
                onChange={(e) => setForm((f) => ({ ...f, video_url: e.target.value }))}
                placeholder="https://youtube.com/..."
              />
            </div>

            {/* Featured image */}
            <SideField label="Cover зураг оруулах">
              {form.image_url ? (
                <div className="relative rounded-lg overflow-hidden border border-border">
                  <img src={form.image_url} alt="" className="w-full h-36 object-cover" />
                  <button
                    onClick={() => setForm((f) => ({ ...f, image_url: "" }))}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white text-[11px] flex items-center justify-center hover:bg-black/80 transition"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => imgFileRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) uploadImage(file);
                  }}
                  className={`flex flex-col items-center justify-center gap-2 h-36 border rounded-lg cursor-pointer transition ${
                    dragOver
                      ? "border-accent bg-[rgba(230,51,41,0.06)]"
                      : "border-border bg-surface hover:border-muted"
                  }`}
                >
                  {imgUploading ? (
                    <span className="text-[11px] text-muted font-mono">Байршуулж байна...</span>
                  ) : (
                    <>
                      <ImageIcon className="text-muted" />
                      <span className="text-[11px] text-muted font-mono">Зураг оруулна уу</span>
                    </>
                  )}
                </div>
              )}
              <input
                ref={imgFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])}
              />
            </SideField>

            {/* Status */}
            {/* <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-muted font-mono mb-3">
                Статус
              </p>
              <div className="flex flex-col gap-3">
                <ToggleRow
                  label="Нийтлэх"
                  desc="Дарсны дараа шууд харагдана"
                  value={form.published}
                  onChange={(v) => setForm((f) => ({ ...f, published: v }))}
                />
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

function SideField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] tracking-[0.12em] uppercase text-muted font-bebas font-semibold mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
