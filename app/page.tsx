import { getNewsList, getNewsViews } from "@/app/actions/news";
import { CategoryIcon, ClockIcon, CommentIcon, NewsListIcon, SeeIcon } from "@/components/icons";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const news = await getNewsList();
  const newsViews = await getNewsViews();
  const total = news.length;
  const published = news.filter((n) => n.published).length;
  const drafts = total - published;
  const publishRate = total > 0 ? Math.round((published / total) * 100) : 0;

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weeklyNew = news.filter((n) => new Date(n.created_at) >= weekAgo).length;

  const todayStr = now.toISOString().slice(0, 10);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);
  const todayViews = newsViews.filter((v) => v.viewed_at?.startsWith(todayStr)).length;
  const yesterdayViews = newsViews.filter((v) => v.viewed_at?.startsWith(yesterdayStr)).length;
  const viewDelta = todayViews - yesterdayViews;

  const viewCounts = newsViews.reduce<Record<number, number>>((acc, v) => {
    acc[v.news_id] = (acc[v.news_id] ?? 0) + 1;
    return acc;
  }, {});
  const topViewed = [...news]
    .sort((a, b) => (viewCounts[b.id] ?? 0) - (viewCounts[a.id] ?? 0))
    .slice(0, 5);

  const byCategory = news.reduce<Record<string, number>>((acc, n) => {
    const name = n.categories?.name ?? `#${n.category_id}`;
    acc[name] = (acc[name] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-2 border-b border-faint ">
        <div className="leading-[1]">
          <p className="text-[32px] font-bold text-ink">Dashboard</p>
          <p className="text-[14px] text-muted font-semibold mt-0.5 tracking-[0.08em]">
            Crypto News Admin
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/news/new"
            className="px-4 py-2 rounded-full bg-accent text-white text-[10px] tracking-[0.14em] uppercase font-ttNormsPro hover:bg-[#c0281f] transition"
          >
            + Шинэ мэдээ
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 p-6">
        {[
          {
            label: "Нийт мэдээ",
            icon: <NewsListIcon className="text-amber" />,
            value: total,
            css: "var(--amber)",
            text: `+${weeklyNew} энэ долоо хоногт`,
            textCss: "var(--success)",
          },
          {
            label: "Нийтлэгдсэн",
            icon: <SeeIcon className="text-success" />,
            value: published,
            css: "var(--success)",
            text: `${publishRate}% нийтлэлийн тувшин`,
            textCss: "var(--muted)",
          },
          {
            label: "Draft",
            icon: <ClockIcon className="text-accent" />,
            value: drafts,
            css: "var(--accent)",
            text: "нийтлэхэд бэлэн",
            textCss: "var(--muted)",
          },
          {
            label: "Нийт уншигч",
            icon: <SeeIcon className="text-default" />,
            value: newsViews.length,
            css: "var(--default)",
            text: `${viewDelta >= 0 ? "+" : ""}${viewDelta} өчигдрөөс`,
            textCss: "var(--success)",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="relative border border-faint bg-bg px-5 py-4 rounded-xl overflow-hidden"
          >
            <div
              className="absolute top-0 left-0 right-0 z-20 h-[2px]"
              style={{ background: s.css }}
            />
            <div className="flex justify-between items-center mb-2">
              <div
                className={`text-[11px] tracking-[0.12em] font-semibold uppercase mb-2 text-muted`}
              >
                {s.label}
              </div>
              <div
                className="w-8 h-8 p-2 rounded-full flex items-center justify-center"
                style={{ background: `color-mix(in srgb, ${s.css} 15%, transparent)` }}
              >
                {s.icon}
              </div>
            </div>
            <div className="text-4xl font-mono">{s.value}</div>
            {s.text && (
              <div className="text-[12px] font-semibold mt-2" style={{ color: s.textCss }}>
                {s.text}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_360px] gap-4 p-6">
        {/* Их уншигдсан мэдээ */}
        <div className="border border-faint bg-bg rounded-xl">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-faint">
            <span className="text-[12px] tracking-[0.12em] uppercase text-ink font-semibold">
              Их уншигдсан
            </span>
            <Link
              href="/news"
              className="text-[10px] tracking-[0.1em] text-ink hover:underline uppercase"
            >
              Бүгд →
            </Link>
          </div>
          {topViewed.map((n, i) => (
            <div
              key={n.id}
              className={`flex items-center justify-between px-4 py-3 ${i !== 0 ? "border-t border-faint" : ""}`}
            >
              <div className="min-w-0">
                <p className="text-[16px] text-ink truncate">{n.title}</p>
                <p className="text-[13px] text-muted font-mono mt-0.5">{n.categories?.name}</p>
              </div>
              <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                <span
                  className={`text-[10px] tracking-[0.1em] uppercase font-semibold flex justify-center px-2 py-0.5 border rounded-full flex-shrink-0 ${
                    n.published ? "text-success border-success " : "text-amber border-amber"
                  }`}
                >
                  {n.published ? "Live" : "Draft"}
                </span>
                <span className="text-[12px] text-default font-mono flex-shrink-0 flex items-center gap-1">
                  {viewCounts[n.id] ?? 0} <SeeIcon className="w-3 h-3 inline-block" />
                </span>
                {/* <Link
                  href={`/news/${n.slug}/edit`}
                  className="text-[10px] tracking-widest uppercase font-bebas font-semibold rounded-full border border-default px-2 py-0.5 text-default hover:bg-[rgba(48,96,176,0.30)] transition"
                >
                  Засах
                </Link> */}
              </div>
            </div>
          ))}
        </div>

        {/* Баруун багана: Ангилалаар + Хурдан үйлдэл */}
        <div className="flex flex-col gap-4">
          <div className="border border-faint bg-bg rounded-xl">
            <div className="px-4 py-2.5 border-b border-faint">
              <span className="text-[12px] tracking-[0.12em] uppercase text-ink font-semibold">
                Ангилалаар
              </span>
            </div>
            {(() => {
              const palette = ["var(--accent)", "var(--amber)", "var(--success)", "var(--default)"];
              const maxCount = Math.max(...Object.values(byCategory), 1);
              return Object.entries(byCategory).map(([cat, count], i) => {
                const clr = palette[i % palette.length];
                return (
                  <div key={cat} className="px-4 pt-3 pb-2.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: clr }}
                        />
                        <span className="text-[12px] text-[#aaa] font-mono truncate">{cat}</span>
                      </div>
                      <span className="text-[12px] text-muted font-mono ml-2 flex-shrink-0">
                        {count}
                      </span>
                    </div>
                    <div className="h-[2px] bg-faint rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${(count / maxCount) * 100}%`, background: clr }}
                      />
                    </div>
                  </div>
                );
              });
            })()}
          </div>

          {/* Хурдан үйлдэл */}
          <div className="border border-faint bg-bg rounded-xl">
            <div className="px-4 py-2.5 border-b border-faint">
              <span className="text-[12px] tracking-[0.12em] uppercase text-ink font-semibold">
                Хурдан үйлдэл
              </span>
            </div>
            <div className="grid grid-cols-2 gap-px bg-faint">
              {[
                { href: "/news/new", label: "Шинэ нийтлэл", Icon: NewsListIcon },
                { href: "/category", label: "Категори нэмэх", Icon: CategoryIcon },
                { href: "/comments", label: "Сэтгэгдэл", Icon: CommentIcon },
                { href: "/news", label: "Бүх мэдээ", Icon: NewsListIcon },
              ].map(({ href, label, Icon }) => (
                <Link
                  key={href + label}
                  href={href}
                  className="flex flex-col items-center justify-center gap-1.5 py-4 bg-bg hover:bg-faint transition text-center"
                >
                  <Icon className="w-5 h-5 text-accent" />
                  <span className="text-[9px] tracking-[0.1em] uppercase text-muted leading-tight">
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
