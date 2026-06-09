import {
  getComments,
  getCommentCounts,
  setCommentStatus,
  deleteComment,
} from "@/app/actions/comments";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";
import SpamButton from "@/components/SpamButton";
import HideButton from "@/components/HideButton";
import PublishedButton from "@/components/PublishedButton";

export const dynamic = "force-dynamic";

const STATUS_TABS = [
  { key: "all", label: "Бүгд" },
  { key: "pending", label: "Хүлээгдэж буй" },
  { key: "published", label: "Нийтлэгдсэн" },
  { key: "spam", label: "Спам" },
];

const STATUS_STYLE: Record<string, string> = {
  pending: "text-default border-default",
  published: "text-success border-[rgba(80,216,128,0.4)] bg-[rgba(80,216,128,0.08)]",
  spam: "text-amber border-amber",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Хүлээгдэж буй",
  published: "Нийтлэгдсэн",
  spam: "Спам",
};

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export default async function CommentsPage({ searchParams }: Props) {
  const { status } = await searchParams;
  const activeStatus = status ?? "all";

  const [comments, counts] = await Promise.all([
    getComments(activeStatus === "all" ? undefined : activeStatus),
    getCommentCounts(),
  ]);

  return (
    <div className="min-h-screen bg-bg text-ink py-3 px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-ttNormsPro font-bold text-3xl">
          <span className="text-accent">Сэтгэгдэл</span>
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-5">
        {STATUS_TABS.map((tab) => {
          const isActive = activeStatus === tab.key;
          const count = counts[tab.key] ?? 0;
          return (
            <Link
              key={tab.key}
              href={tab.key === "all" ? "/comments" : `/comments?status=${tab.key}`}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] tracking-[0.12em] uppercase font-bebas font-semibold border transition ${
                isActive
                  ? "border-accent text-accent bg-[rgba(230,51,41,0.08)]"
                  : // : "border-border text-muted hover:text-ink hover:border-[#555]"
                    "border-[#555] text-ink hover:text-muted hover:border-border"
              }`}
            >
              {tab.label}
              <span className={`text-[10px] rounded-full`}>{count}</span>
            </Link>
          );
        })}
      </div>

      {/* Table */}
      <div className="border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-bg">
              <th className="text-left px-4 py-2.5 text-[11px] tracking-widest text-muted font-semibold w-[80px]">
                Төлөв
              </th>
              <th className="text-left px-4 py-2.5 text-[11px] tracking-widest text-muted font-semibold">
                Сэтгэгдэл
              </th>
              <th className="text-left px-4 py-2.5 text-[11px] tracking-widest text-muted font-semibold w-[400px]">
                Мэдээ
              </th>
              <th className="text-left px-4 py-2.5 text-[11px] tracking-widest text-muted font-semibold w-[120px]">
                Огноо
              </th>
              <th className="text-left px-4 py-2.5 text-[11px] tracking-widest text-muted font-semibold w-[200px]">
                Үйлдэл
              </th>
            </tr>
          </thead>
          <tbody>
            {comments.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted text-xs font-mono">
                  Сэтгэгдэл байхгүй байна
                </td>
              </tr>
            )}
            {comments.map((c) => (
              <tr key={c.id} className="border-t border-faint hover:bg-surface transition">
                {/* Status */}
                <td className="px-4 py-3 w-[150px]">
                  <span
                    className={`text-[12px] tracking-[0.1em] font-bebas font-semibold px-2 py-0.5 border rounded-full ${STATUS_STYLE[c.status]}`}
                  >
                    {STATUS_LABEL[c.status]}
                  </span>
                </td>

                {/* Comment */}
                <td className="px-4 py-3 min-w-0">
                  <p className="text-[12px] font-mono font-semibold text-muted mb-0.5">
                    {c.author_name}
                    {c.author_email && (
                      <span className="text-muted font-normal ml-1.5">({c.author_email})</span>
                    )}
                  </p>
                  <p className="text-[12px] text-ink leading-relaxed line-clamp-2 max-w-[420px]">
                    {c.body}
                  </p>
                </td>

                {/* News */}
                <td className="px-4 py-3">
                  {c.news ? (
                    <Link
                      href={`/news/${c.news.slug}`}
                      className="text-[11px] text-muted hover:text-ink font-mono underline underline-offset-2 line-clamp-2"
                    >
                      {c.news.title}
                    </Link>
                  ) : (
                    <span className="text-[11px] text-muted font-mono">—</span>
                  )}
                </td>

                {/* Date */}
                <td className="px-4 py-3 text-[11px] text-muted font-mono whitespace-nowrap">
                  {new Date(c.created_at).toLocaleDateString("mn-MN")}
                </td>

                {/* Actions */}
                <td className="px-4 py-3 w-[230px]">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {c.status !== "published" && (
                      <form action={setCommentStatus.bind(null, c.id, "published")}>
                        <PublishedButton label="Published" />
                      </form>
                    )}
                    {c.status === "published" && (
                      <form action={setCommentStatus.bind(null, c.id, "pending")}>
                        <HideButton label="Hide" />
                      </form>
                    )}
                    {c.status !== "spam" && (
                      <form action={setCommentStatus.bind(null, c.id, "spam")}>
                        <SpamButton label="Spam" />
                      </form>
                    )}
                    <DeleteButton onDelete={deleteComment.bind(null, c.id)} label="Delete" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
