import { getNewsBySlug } from "@/app/actions/news";
import { notFound } from "next/navigation";
import Link from "next/link";
import ExercisePlayground, { type ExerciseConfig } from "@/components/ExercisePlayground";

export const dynamic = "force-dynamic";

const TAG_COLORS = [
  { color: "#e49d4b", bg: "rgba(228,157,75,0.12)", border: "rgba(228,157,75,0.3)" },
  { color: "#3060b0", bg: "rgba(48,96,176,0.12)", border: "rgba(48,96,176,0.3)" },
  { color: "#50d880", bg: "rgba(80,216,128,0.12)", border: "rgba(80,216,128,0.3)" },
  { color: "#e63329", bg: "rgba(230,51,41,0.12)", border: "rgba(230,51,41,0.3)" },
  { color: "#a78bfa", bg: "rgba(167,139,250,0.12)", border: "rgba(167,139,250,0.3)" },
];

function parseTags(raw: string): string[] {
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function readingTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 120));
}

function getYoutubeId(url: string) {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  return m ? m[1] : null;
}

export default async function NewsPreviewPage({ params }: { params: { slug: string } }) {
  const news = await getNewsBySlug(params.slug);
  if (!news) notFound();

  const tags = parseTags(news.tags);
  const isPublished = news.published;
  const youtubeId = news.video_url ? getYoutubeId(news.video_url) : null;

  return (
    <div className="min-h-screen bg-bg text-ink">
      {/* Admin toolbar */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-bg border-b border-faint">
        <div className="flex items-center gap-3">
          <Link
            href="/news"
            className="text-[11px] font-mono text-muted hover:text-ink tracking-widest border border-muted hover:border-ink px-2 py-0.5 rounded-full uppercase transition"
          >
            ← Буцах
          </Link>
          <div className="w-px h-3 bg-border" />
          <span
            className={`text-[11px] tracking-[0.1em] rounded-full font-bebas px-2 py-0.5 border ${
              isPublished
                ? "text-success border-[rgba(80,216,128,0.3)] bg-[rgba(80,216,128,0.05)]"
                : "text-muted border-border"
            }`}
          >
            {isPublished ? "Live" : "Draft"}
          </span>
        </div>
        <Link
          href={`/news/${params.slug}/edit`}
          className="px-4 py-1.5 bg-accent text-white text-[11px] rounded-full tracking-widest uppercase hover:bg-[#c0281f] transition"
        >
          Засах
        </Link>
      </div>

      <article>
        {/* Hero */}
        {news.image_url && (
          <div className="relative w-full h-[420px] overflow-hidden">
            <img src={news.image_url} alt={news.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50" />

            {/* Category */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2">
              <span className="text-[14px] tracking-[0.16em] uppercase text-accent font-bebas border-t-2 border-accent">
                {news.categories?.name}
              </span>
            </div>

            {/* Title */}
            <div className="absolute bottom-8 left-0 right-0 px-8">
              <div className="max-w-[760px]">
                {tags[0] && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-4 h-[1.5px] bg-accent" />
                    <span className="text-[10px] tracking-[0.22em] uppercase text-accent font-mono font-bold">
                      {tags[0]}
                    </span>
                  </div>
                )}
                <h1
                  className="font-ttNormsPro text-[28px] md:text-[52px] leading-[1.1] font-semibold"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, rgb(255,155,60) 0%, rgb(170,15,8) 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {news.title}
                </h1>

                {/* Meta */}
                <div className="flex items-center gap-2 mt-4 flex-wrap">
                  <span className="text-[10px] font-mono font-semibold tracking-[0.1em] text-[#f0ece0]/70">
                    {formatDate(news.created_at)}
                  </span>
                  {news.author && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-[1px] bg-accent" />
                      <span className="text-[11px] font-mono text-white/70">{news.author}</span>
                      {news.author_role && (
                        <span className="text-[9px] text-white/60">({news.author_role})</span>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-[1px] bg-accent" />
                    <span className="text-[11px] font-mono font-semibold tracking-[0.1em] text-[#f0ece0]/70">
                      {readingTime(news.content)} мин унших
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="max-w-[840px] mx-auto px-6 py-10">
          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {tags.map((tag, i) => {
                const c = TAG_COLORS[i % 5];
                return (
                  <span
                    key={tag}
                    className="text-[8px] tracking-[0.12em] uppercase px-2 py-[3px] rounded-full border font-SpaceGrotesk"
                    style={{
                      color: c.color,
                      backgroundColor: c.bg,
                      borderColor: c.border,
                    }}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          )}

          {/* Lead */}
          {news.lead && (
            <p className="text-[15px] text-muted leading-[1.8] border-l-2 border-accent pl-4 mb-8">
              {news.lead}
            </p>
          )}

          {/* YouTube */}
          {youtubeId && (
            <div className="relative w-full aspect-video mb-8 rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}`}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-invert max-w-none prose-p:text-muted prose-p:text-sm prose-h2:text-ink prose-h2:font-ttNormsPro prose-h2:font-bold prose-a:text-accent prose-code:text-accent prose-strong:text-[#ccc] prose-h3:text-[18px] prose-h3:font-semibold prose-h3:text-ink prose-h3:mt-8 prose-h3:mb-3"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />

          {/* Exercise */}
          {news.exercise_config &&
            (() => {
              try {
                const config: ExerciseConfig = JSON.parse(news.exercise_config!);
                return <ExercisePlayground config={config} />;
              } catch {
                return null;
              }
            })()}
        </div>
      </article>
    </div>
  );
}
