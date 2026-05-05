import { getNewsList, getNewsViews } from "@/app/actions/news";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const news = await getNewsList();
  const newsViews = await getNewsViews();
  const total = news.length;
  const published = news.filter((n) => n.published).length;
  const drafts = total - published;
  const recent = news.slice(0, 5);

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
        <Link
          href="/news/new"
          className="px-4 py-2 rounded-full bg-accent text-white text-[10px] tracking-[0.14em] uppercase font-ttNormsPro hover:bg-[#c0281f] transition"
        >
          + Шинэ мэдээ
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 p-6">
        {[
          { label: "Нийт мэдээ", value: total, color: "text-ink" },
          { label: "Нийтлэгдсэн", value: published, color: "text-success" },
          { label: "Draft", value: drafts, color: "text-accent" },
          { label: "Нийт уншигч", value: newsViews.length, color: "text-default" },
        ].map((s) => (
          <div key={s.label} className="border border-faint bg-bg px-5 py-4 rounded-xl">
            <div
              className={`text-[10px] tracking-[0.12em] font-semibold uppercase mb-2 ${s.color}`}
            >
              {s.label}
            </div>
            <div className={`text-4xl font-mono ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_200px] gap-4 p-6">
        {/* Сүүлийн мэдээ */}
        <div className="border border-faint bg-bg rounded-xl">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-faint">
            <span className="text-[12px] tracking-[0.12em] uppercase text-ink font-semibold">
              Сүүлийн мэдээ
            </span>
            <Link
              href="/news"
              className="text-[10px] tracking-[0.1em] text-accent font-mono hover:underline uppercase"
            >
              Бүгд →
            </Link>
          </div>
          {recent.map((n, i) => (
            <div
              key={n.id}
              className={`flex items-center justify-between px-4 py-3 ${i !== 0 ? "border-t border-faint" : ""}`}
            >
              <div className="min-w-0">
                <p className="text-[16px] text-[#aaa] truncate">{n.title}</p>
                <p className="text-[13px] text-muted font-mono mt-0.5">{n.categories?.name}</p>
              </div>
              <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                <span
                  className={`text-[10px] tracking-[0.1em] uppercase font-semibold flex justify-center px-2 py-0.5 border rounded-full font-bebas flex-shrink-0 ${
                    n.published
                      ? "text-success border-[rgba(80,216,128)] bg-[rgba(80,216,128,0.08)]"
                      : "text-accent bg-[rgba(230,51,41,0.08)] border-[rgba(230,51,41)]"
                  }`}
                >
                  {n.published ? "Live" : "Draft"}
                </span>
                <Link
                  href={`/news/${n.slug}/edit`}
                  className="text-[10px] tracking-widest uppercase font-bebas font-semibold rounded-full border border-default px-2 py-0.5 text-default hover:bg-[rgba(48,96,176,0.30)] transition"
                >
                  Засах
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Ангилал */}
        <div className="border border-faint bg-bg rounded-xl">
          <div className="px-4 py-2.5 border-b border-faint">
            <span className="text-[12px] tracking-[0.12em] uppercase text-ink font-semibold">
              Ангилалаар
            </span>
          </div>
          {Object.entries(byCategory).map(([cat, count], i) => (
            <div
              key={cat}
              className={`flex items-center justify-between px-4 py-3 ${i !== 0 ? "border-t border-faint" : ""}`}
            >
              <span className="text-[10px] text-muted font-mono">{cat}</span>
              <span className="text-[12px] text-ink font-mono">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
