'use client'
import { useState, useRef } from 'react'
import { type News, CATEGORIES } from '@/types/news'
import { saveNews } from '@/app/actions/news'
import { useRouter } from 'next/navigation'
import TiptapEditor from './TiptapEditor'
import { supabase } from '@/lib/supabase'


function parseTags(raw: string | string[] | undefined): string[] {
  if (!raw) return []
  if (Array.isArray(raw)) return raw
  try { return JSON.parse(raw) } catch { return [] }
}


type Props = { existing?: News }

export default function NewsForm({ existing }: Props) {
  const router  = useRouter()
  const [loading,        setLoading]       = useState(false)
  const [msg, setMsg]                      = useState<{ type: 'error' | 'success'; text: string } | null>(null)
  const [tagInput,       setTagInput]      = useState('')
  const [imgUploading,   setImgUploading]  = useState(false)
  const imgFileRef = useRef<HTMLInputElement>(null)

  const uploadCoverImage = async (file: File) => {
    if (!file.type.startsWith('image/')) return
    setImgUploading(true)
    setMsg(null)
    const ext  = file.name.split('.').pop()
    const path = `covers/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('Images').upload(path, file, { upsert: true })
    if (error) {
      const hint = error.message.includes('Bucket not found') || error.message.includes('400')
        ? ' — Supabase-д "images" нэртэй Public bucket үүсгэнэ үү'
        : ''
      setMsg({ type: 'error', text: 'Upload амжилтгүй: ' + error.message + hint })
    } else {
      const { data } = supabase.storage.from('Images').getPublicUrl(path)
      setForm(f => ({ ...f, image_url: data.publicUrl }))
    }
    setImgUploading(false)
  }

  const [form, setForm] = useState({
    title:          existing?.title           ?? '',
    slug:           existing?.slug            ?? '',
    category:       existing?.category        ?? 'Криптограф',
    lead:           existing?.lead            ?? '',
    content:        existing?.content         ?? '',
    image_url:      existing?.image_url       ?? '',
    video_url:      existing?.video_url       ?? '',
    author:         existing?.author          ?? '',
    author_role:    existing?.author_role     ?? '',
    exercise_config: existing?.exercise_config ?? '',
    tags:           parseTags(existing?.tags),
    published:      existing?.published ?? false,
  })

  const handleTitle = (v: string) => {
    setForm(f => ({
      ...f,
      title: v,
      slug: f.slug || v.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    }))
  }

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const t = tagInput.trim()
      if (t && !form.tags.includes(t)) setForm(f => ({ ...f, tags: [...f.tags, t] }))
      setTagInput('')
    }
  }
  const removeTag = (t: string) => setForm(f => ({ ...f, tags: f.tags.filter((x: string) => x !== t) }))

  const save = async (publishAs: boolean) => {
    if (!form.title || !form.slug) {
      setMsg({ type: 'error', text: 'Гарчиг болон slug заавал оруулна уу!' })
      return
    }
    setLoading(true)
    setMsg(null)

    const payload = {
      title:           form.title,
      slug:            form.slug,
      category:        form.category,
      lead:            form.lead,
      content:         form.content,
      image_url:       form.image_url,
      video_url:       form.video_url || null,
      author:          form.author || null,
      author_role:     form.author_role || null,
      exercise_config: form.exercise_config || null,
      tags:            JSON.stringify(form.tags),
      published:       publishAs,
    }

    const { error } = await saveNews(payload, existing?.id)

    setLoading(false)
    if (error) {
      setMsg({ type: 'error', text: 'Алдаа: ' + error })
    } else {
      setForm(f => ({ ...f, published: publishAs }))
      setMsg({ type: 'success', text: publishAs ? '✓ Амжилттай нийтлэгдлээ!' : '✓ Draft хадгалагдлаа!' })
      setTimeout(() => router.push('/news'), 1200)
    }
  }

  return (
    <div className="adm-wrap">
      <div className="adm-header">
        <h1 className="adm-page-title">
          {existing ? 'МЭДЭЭ' : 'ШИНЭ'} <span className="adm-title-red">{existing ? 'ЗАСАХ' : 'МЭДЭЭ'}</span>
        </h1>
        <div className="adm-btn-row">
          <button className="adm-btn-out" onClick={() => save(false)} disabled={loading}>
            {loading ? 'Хадгалж байна...' : 'Draft хадгалах'}
          </button>
          <button className="adm-btn-red" onClick={() => save(true)} disabled={loading}>
            {loading ? 'Нийтэлж байна...' : 'Нийтлэх'}
          </button>
        </div>
      </div>

      {msg && <p className={msg.type === 'error' ? 'adm-error' : 'adm-success'}>{msg.text}</p>}

      {/* Үндсэн мэдээлэл */}
      <div className="adm-card">
        <p className="adm-section-lbl">Үндсэн мэдээлэл</p>
        <div className="adm-grid2">
          <div>
            <label className="adm-label">Гарчиг</label>
            <input className="adm-input" value={form.title}
              onChange={e => handleTitle(e.target.value)} placeholder="Мэдээний гарчиг..." />
          </div>
          <div>
            <label className="adm-label">Slug (URL)</label>
            <input className="adm-input" value={form.slug}
              onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="news-slug-url" />
          </div>
        </div>

        <div className="adm-grid2">
          <div>
            <label className="adm-label">Ангилал</label>
            <select className="adm-select" value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="adm-label">Tag-ууд (Enter дарж нэмэх)</label>
            <div className="adm-tag-wrap">
              {form.tags.map((t: string) => (
                <span key={t} className="adm-tag-chip">
                  {t}
                  <button onClick={() => removeTag(t)} className="hover:opacity-70">×</button>
                </span>
              ))}
              <input className="adm-tag-text" value={tagInput}
                onChange={e => setTagInput(e.target.value)} onKeyDown={addTag} placeholder="tag нэмэх..." />
            </div>
          </div>
        </div>

        <div className="mb-3">
          <label className="adm-label">Товч тайлбар (lead)</label>
          <textarea className="adm-textarea" rows={3} value={form.lead}
            onChange={e => setForm(f => ({ ...f, lead: e.target.value }))}
            placeholder="Мэдээний товч тайлбар..." />
        </div>

        <div>
          <label className="adm-label">Агуулга</label>
          <TiptapEditor
            value={form.content}
            onChange={html => setForm(f => ({ ...f, content: html }))}
          />
        </div>
      </div>

      {/* Медиа */}
      <div className="adm-card">
        <p className="adm-section-lbl">Медиа</p>
        <div className="adm-grid2">
          <div>
            <label className="adm-label">Cover зургийн URL</label>
            <div style={{ display: 'flex', gap: 6 }}>
              <input className="adm-input" type="url" value={form.image_url}
                onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://..." />
              <button
                type="button" className="adm-btn-out"
                style={{ whiteSpace: 'nowrap', padding: '0 10px', fontSize: 11 }}
                onClick={() => imgFileRef.current?.click()}
                disabled={imgUploading}
              >{imgUploading ? '...' : '📁'}</button>
              <input ref={imgFileRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => e.target.files?.[0] && uploadCoverImage(e.target.files[0])} />
            </div>
            {form.image_url && (
              <img src={form.image_url} alt="" style={{ marginTop: 8, maxHeight: 80, border: '1px solid #1c1c1c', objectFit: 'cover' }} />
            )}
          </div>
          <div>
            <label className="adm-label">YouTube URL</label>
            <input className="adm-input" type="url" value={form.video_url}
              onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))} placeholder="https://youtube.com/..." />
          </div>
        </div>
      </div>

      {/* Зохиогч */}
      <div className="adm-card">
        <p className="adm-section-lbl">Зохиогч</p>
        <div className="adm-grid2">
          <div>
            <label className="adm-label">Нэр</label>
            <input className="adm-input" value={form.author}
              onChange={e => setForm(f => ({ ...f, author: e.target.value }))} placeholder="Зохиогчийн нэр..." />
          </div>
          <div>
            <label className="adm-label">Үүрэг / Гарчиг</label>
            <input className="adm-input" value={form.author_role}
              onChange={e => setForm(f => ({ ...f, author_role: e.target.value }))} placeholder="Редактор, Судлаач..." />
          </div>
        </div>
      </div>

      {/* Дасгал */}
      <div className="adm-card">
        <p className="adm-section-lbl">Интерактив дасгал (Exercise config JSON)</p>
        <textarea className="adm-textarea" rows={10} value={form.exercise_config}
          onChange={e => setForm(f => ({ ...f, exercise_config: e.target.value }))}
          placeholder={'{"title":"...","inputs":[...],"actions":[...]}'} />
      </div>

      {/* Тохиргоо */}
      <div className="adm-card">
        <p className="adm-section-lbl">Тохиргоо</p>
        <div className="adm-toggle-row">
          <span className="adm-toggle-lbl">Нийтлэх (Published)</span>
          <Toggle value={form.published} onChange={v => setForm(f => ({ ...f, published: v }))} />
        </div>
      </div>
    </div>
  )
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)}
      className={`w-8 h-[18px] rounded-full relative transition-colors ${value ? 'bg-[#e63329]' : 'bg-[#1c1c1c]'}`}>
      <span className={`absolute top-[2px] w-3.5 h-3.5 rounded-full bg-white transition-all ${value ? 'left-[18px]' : 'left-[2px]'}`} />
    </button>
  )
}
