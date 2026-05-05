"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

interface Props {
  page: number;
  limit: number;
  total: number;
}

function PageSizeSelect({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 border border-border rounded-full px-3 py-1 text-ink bg-surface hover:border-ink transition min-w-[52px] justify-between"
      >
        {value}
        <svg
          className={`w-3 h-3 text-ink transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 bottom-full mb-1 bg-surface border border-border rounded-xl overflow-hidden shadow-lg z-50 min-w-full">
          {PAGE_SIZE_OPTIONS.map((n) => (
            <button
              key={n}
              onClick={() => {
                onChange(n);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 hover:bg-bg transition ${
                n === value ? "text-accent" : "text-ink"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NewsPagination({ page, limit, total }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(total / limit);

  function navigate(newPage: number, newLimit: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    params.set("limit", String(newLimit));
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border text-xs text-muted font-mono">
      <div className="flex items-center gap-2">
        <span>Хуудсанд:</span>
        <PageSizeSelect value={limit} onChange={(v) => navigate(1, v)} />
      </div>

      <span>
        {total === 0 ? "0" : (page - 1) * limit + 1}–{Math.min(page * limit, total)} / {total}
      </span>

      <div className="flex items-center gap-1">
        <button
          disabled={page <= 1}
          onClick={() => navigate(page - 1, limit)}
          className="px-2 py-1 border border-border rounded-full hover:border-accent hover:text-ink transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ‹
        </button>
        <span className="px-2">
          {page} / {totalPages || 1}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => navigate(page + 1, limit)}
          className="px-2 py-1 border border-border rounded-full hover:border-accent hover:text-ink transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ›
        </button>
      </div>
    </div>
  );
}
