"use client";
import { HideIcon } from "@/components/icons";

interface HideButtonProps {
  label?: string;
}

export default function HideButton({ label = "Нуух" }: HideButtonProps) {
  return (
    <>
      <div className="grid justify-items-center">
        <button
          type="submit"
          className="text-[9px] tracking-widest uppercase font-bold rounded-full px-5 py-[1px] border border-default text-white bg-default transition"
        >
          <HideIcon className="w-4 h-4" />
        </button>

        <span className="text-[12px] font-bebas font-semibold text-ink">{label}</span>
      </div>
    </>
  );
}
