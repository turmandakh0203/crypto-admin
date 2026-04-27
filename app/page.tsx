import { supabaseAdmin, type News } from '@/lib/supabase'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const { data: all } = await supabaseAdmin()
    .from('news')
    .select('id, title, slug, category, published, created_at')
    .order('created_at', { ascending: false })

  const news = (all ?? []) as Pick<News, 'id' | 'title' | 'slug' | 'category' | 'published' | 'created_at'>[]
  const total     = news.length
  const published = news.filter(n => n.published).length
  const drafts    = total - published
  const recent    = news.slice(0, 5)

  const byCategory = news.reduce<Record<string, number>>((acc, n) => {
    acc[n.category] = (acc[n.category] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="p-7">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-ttNormsPro font-bold tracking-[0.12em] text-ink">Dashboard</h1>
          <p className="text-[10px] text-muted font-mono mt-0.5 tracking-[0.08em]">Crypto News Admin</p>
        </div>
        <Link href="/news/new" className="px-4 py-2 bg-accent text-white text-[10px] tracking-[0.14em] uppercase font-mono hover:bg-[#c0281f] transition">
          + Шинэ мэдээ
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: 'Нийт мэдээ',  value: total,     color: 'text-ink'     },
          { label: 'Нийтлэгдсэн', value: published, color: 'text-success' },
          { label: 'Draft',        value: drafts,    color: 'text-muted'   },
        ].map(s => (
          <div key={s.label} className="border border-faint bg-bg px-5 py-4">
            <div className="text-[8px] tracking-[0.18em] uppercase text-muted font-mono mb-2">{s.label}</div>
            <div className={`text-4xl font-mono ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_200px] gap-4">

        {/* Сүүлийн мэдээ */}
        <div className="border border-faint bg-bg">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-faint">
            <span className="text-[8px] tracking-[0.18em] uppercase text-muted font-mono">Сүүлийн мэдээ</span>
            <Link href="/news" className="text-[8px] tracking-[0.1em] text-accent font-mono hover:underline uppercase">Бүгд →</Link>
          </div>
          {recent.map((n, i) => (
            <div key={n.id} className={`flex items-center justify-between px-4 py-3 ${i !== 0 ? 'border-t border-faint' : ''}`}>
              <div className="min-w-0">
                <p className="text-[12px] text-[#aaa] truncate">{n.title}</p>
                <p className="text-[8px] text-muted font-mono mt-0.5">{n.category}</p>
              </div>
              <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                <span className={`text-[7px] tracking-[0.08em] font-mono px-1.5 py-0.5 border ${
                  n.published
                    ? 'text-success border-[rgba(80,216,128,0.2)] bg-[rgba(80,216,128,0.05)]'
                    : 'text-muted border-faint'
                }`}>{n.published ? 'Live' : 'Draft'}</span>
                <Link href={`/news/${n.slug}/edit`} className="text-[8px] text-muted font-mono hover:text-ink transition">Засах</Link>
              </div>
            </div>
          ))}
        </div>

        {/* Ангилал */}
        <div className="border border-faint bg-bg">
          <div className="px-4 py-2.5 border-b border-faint">
            <span className="text-[8px] tracking-[0.18em] uppercase text-muted font-mono">Ангилалаар</span>
          </div>
          {Object.entries(byCategory).map(([cat, count], i) => (
            <div key={cat} className={`flex items-center justify-between px-4 py-3 ${i !== 0 ? 'border-t border-faint' : ''}`}>
              <span className="text-[10px] text-muted font-mono">{cat}</span>
              <span className="text-[12px] text-ink font-mono">{count}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
