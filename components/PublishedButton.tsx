"use client";
import { PublishedIcon } from "@/components/icons";

interface PublishedButtonProps {
  label?: string;
}

export default function PublishedButton({ label = "Нуух" }: PublishedButtonProps) {
  return (
    <>
      <div className="grid justify-items-center">
        <button
          type="submit"
          className="text-[9px] tracking-widest uppercase font-bold rounded-full px-5 py-[1px] border border-success text-white bg-success transition"
        >
          <PublishedIcon className="w-4 h-4" />
        </button>

        <span className="text-[12px] font-bebas font-semibold text-ink">{label}</span>
      </div>
    </>
  );
}
