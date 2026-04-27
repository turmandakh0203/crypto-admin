import { supabaseAdmin, type News } from '@/lib/supabase'
import Link from 'next/link'
import DeleteButton from '@/components/DeleteButton'

export const dynamic = 'force-dynamic'

export default async function NewsListPage() {
  const { data } = await supabaseAdmin()
    .from('news')
    .select('id, title, slug, category, published, created_at')
    .order('created_at', { ascending: false })

  const news = (data ?? []) as Pick<News, 'id' | 'title' | 'slug' | 'category' | 'published' | 'created_at'>[]

  return (
    <div className="min-h-screen bg-bg text-ink p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-ttNormsPro font-bold text-3xl">
          <span className="text-accent">Нийтлэлүүд</span>
        </h1>
        <Link href="/news/new" className="px-4 py-2 bg-accent text-white text-xs tracking-widest uppercase hover:bg-[#c0281f] transition">
          + Шинэ нийтлэл
        </Link>
      </div>

      <div className="border border-border">
        {news.length === 0 && (
          <div className="p-8 text-center text-muted text-xs font-mono">Нийтлэл байхгүй байна</div>
        )}
        {news.map((n, i) => (
          <div key={n.id} className={`flex items-center justify-between px-4 py-3 ${i !== 0 ? 'border-t border-faint' : ''} hover:bg-surface transition`}>
            <div className="flex items-center gap-4 min-w-0">
              <span className={`text-[8px] tracking-[0.1em] uppercase px-1.5 py-0.5 border rounded-full font-ttNormsPro flex-shrink-0 ${
                n.published
                  ? 'text-success border-[rgba(80,216,128,0.3)] bg-[rgba(80,216,128,0.08)]'
                  : 'text-accent bg-[rgba(230,51,41,0.08)] border-[rgba(230,51,41,0.4)]'
              }`}>
                {n.published ? 'Live' : 'Draft'}
              </span>
              <div className="min-w-0">
                <p className="text-sm text-[#ccc] truncate">{n.title}</p>
                <p className="text-[9px] text-muted font-mono mt-0.5">{n.category} · {n.slug}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 ml-4">
              <span className="text-[9px] text-muted font-mono">
                {new Date(n.created_at).toLocaleDateString('mn-MN')}
              </span>
              <Link href={`/news/${n.slug}`} className="text-[9px] tracking-widest uppercase rounded-full border border-border px-3 py-1.5 text-muted hover:text-ink hover:border-[#333] transition">
                Харах
              </Link>
              <Link href={`/news/${n.slug}/edit`} className="text-[9px] tracking-widest uppercase rounded-full border border-border px-3 py-1.5 text-muted hover:text-ink hover:border-[#333] transition">
                Засах
              </Link>
              <DeleteButton id={n.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
