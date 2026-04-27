import { supabaseAdmin, type News } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ExercisePlayground, { type ExerciseConfig } from '@/components/ExercisePlayground'

export const dynamic = 'force-dynamic'

async function getNews(slug: string): Promise<News | null> {
  const { data } = await supabaseAdmin()
    .from('news')
    .select('*')
    .eq('slug', slug)
    .single()
  return data
}

function parseTags(raw: string): string[] {
  try { return JSON.parse(raw) } catch { return [] }
}

export default async function NewsPreviewPage({ params }: { params: { slug: string } }) {
  const news = await getNews(params.slug)
  if (!news) notFound()

  const tags = parseTags(news.tags)
  const isPublished = news.published

  return (
    <div className="min-h-screen bg-bg text-ink">

      {/* Toolbar */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-surface border-b border-faint">
        <div className="flex items-center gap-3">
          <Link href="/news" className="text-[9px] font-mono text-muted hover:text-ink tracking-widest uppercase transition">
            ← Буцах
          </Link>
          <div className="w-px h-3 bg-border" />
          <span className={`text-[7px] tracking-[0.1em] font-mono px-2 py-0.5 border ${
            isPublished
              ? 'text-success border-[rgba(80,216,128,0.3)] bg-[rgba(80,216,128,0.05)]'
              : 'text-muted border-border'
          }`}>
            {isPublished ? 'Live' : 'Draft'}
          </span>
        </div>
        <Link
          href={`/news/${params.slug}/edit`}
          className="px-4 py-1.5 bg-accent text-white text-[9px] tracking-widest uppercase hover:bg-[#c0281f] transition"
        >
          Засах
        </Link>
      </div>

      {/* Preview */}
      <div className="max-w-[800px] mx-auto px-6 py-10">

        {/* Hero зураг */}
        {news.image_url && (
          <div className="relative w-full h-[280px] overflow-hidden border border-border mb-8">
            <img src={news.image_url} alt={news.title} className="w-full h-full object-cover opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent" />
          </div>
        )}

        {/* Ангилал + tag */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[8px] tracking-[0.2em] uppercase text-accent font-mono">{news.category}</span>
          {tags.map((t, i) => (
            <span key={i} className="text-[7px] tracking-[0.1em] uppercase px-1.5 py-0.5 border border-border text-muted font-mono">{t}</span>
          ))}
        </div>

        {/* Гарчиг */}
        <h1 className="text-[36px] font-ttNormsPro font-bold leading-[1.1] text-ink mb-4">{news.title}</h1>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-faint">
          <span className="text-[9px] text-muted font-mono">
            {new Date(news.created_at).toLocaleDateString('mn-MN')}
          </span>
          {news.author && (
            <>
              <div className="w-[2px] h-[2px] rounded-full bg-border" />
              <span className="text-[9px] text-muted font-mono">{news.author}</span>
            </>
          )}
        </div>

        {/* Lead */}
        {news.lead && (
          <p className="text-sm text-muted leading-[1.8] border-l-2 border-accent pl-4 mb-8">{news.lead}</p>
        )}

        {/* Агуулга */}
        <div
          className="prose prose-invert max-w-none prose-p:text-muted prose-p:text-sm prose-h2:text-ink prose-h2:font-ttNormsPro prose-h2:font-bold prose-a:text-accent prose-code:text-accent prose-strong:text-[#ccc]"
          dangerouslySetInnerHTML={{ __html: news.content }}
        />

        {/* Интерактив туршилт */}
        {news.exercise_config && (() => {
          try {
            const config: ExerciseConfig = JSON.parse(news.exercise_config!)
            return <ExercisePlayground config={config} />
          } catch { return null }
        })()}
      </div>
    </div>
  )
}
