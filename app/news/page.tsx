import { deleteNews, getNewsListLimit } from "@/app/actions/news";
import NewsPagination from "@/components/NewsPagination";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";
import SeeButton from "@/components/SeeButton";
import EditButton from "@/components/EditButton";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

export default async function NewsListPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const limit = [10, 20, 50, 100].includes(Number(params.limit)) ? Number(params.limit) : 10;

  const { data: news, total } = await getNewsListLimit(page, limit);

  return (
    <div className="min-h-screen bg-bg text-ink p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-ttNormsPro font-bold text-3xl">
          <span className="text-accent">Нийтлэлүүд</span>
        </h1>
        <Link
          href="/news/new"
          className="px-4 py-2 bg-accent font-semibold tracking-[0.16em] rounded-full text-white text-xs tracking-widest uppercase hover:bg-[#c0281f] transition"
        >
          + Шинэ нийтлэл
        </Link>
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-bg">
              <th className="text-left px-4 py-2.5 text-[11px] tracking-widest text-muted font-semibold w-[70px]">
                Төлөв
              </th>
              <th className="text-left px-4 py-2.5 text-[11px] tracking-widest text-muted font-semibold">
                Нийтлэл
              </th>
              <th className="text-left px-4 py-2.5 text-[11px] tracking-widest text-muted font-semibold w-[110px]">
                Ангилал
              </th>
              <th className="text-left px-4 py-2.5 text-[11px] tracking-widest text-muted font-semibold w-[110px]">
                Огноо
              </th>
              <th className="text-left px-4 py-2.5 text-[11px] tracking-widest text-muted font-semibold w-[110px]">
                Үйлдэл
              </th>
            </tr>
          </thead>
          <tbody>
            {news.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted text-xs font-mono">
                  Нийтлэл байхгүй байна
                </td>
              </tr>
            )}
            {news.map((n) => (
              <tr key={n.id} className="border-t border-faint hover:bg-surface transition">
                <td className="px-4 py-3">
                  <span
                    className={`text-[10px] tracking-[0.1em] uppercase flex justify-center px-1.5 py-0.5 border rounded-full font-bebas ${
                      n.published
                        ? "text-success border-[rgba(80,216,128)] bg-[rgba(80,216,128,0.08)]"
                        : "text-amber bg-[rgba(201, 125, 16,0.08)] border-amber"
                    }`}
                  >
                    {n.published ? "Live" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 min-w-0">
                  <div className="flex items-center gap-3">
                    <img
                      src={n.image_url || "/placeholder.png"}
                      alt={n.title}
                      className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-[14px] truncate max-w-[380px]">{n.title}</p>
                      <p className="text-[11px] text-muted font-mono mt-0.5 truncate max-w-[380px]">
                        {n.slug}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-[12px] text-muted font-mono whitespace-nowrap">
                  {n.categories?.name ?? "—"}
                </td>
                <td className="px-4 py-3 text-[11px] text-muted font-mono whitespace-nowrap">
                  {new Date(n.created_at).toLocaleDateString("mn-MN")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/news/${n.slug}`}>
                      <SeeButton label="See" />
                    </Link>

                    <Link href={`/news/${n.slug}/edit`}>
                      <EditButton label="Edit" />
                    </Link>
                    <DeleteButton onDelete={deleteNews.bind(null, n.id)} label="Delete" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <NewsPagination page={page} limit={limit} total={total} />
      </div>
    </div>
  );
}
