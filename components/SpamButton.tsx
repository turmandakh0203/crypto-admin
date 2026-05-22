"use client";
import { SpamIcon } from "@/components/icons";

interface SpamButtonProps {
  label?: string;
}

export default function SpamButton({ label = "Спам" }: SpamButtonProps) {
  return (
    <>
      <div className="grid justify-items-center">
        <button
          type="submit"
          className="text-[9px] tracking-widest uppercase font-bold rounded-full px-5 py-[1px] border border-amber text-white bg-amber transition"
        >
          <SpamIcon className="w-4 h-4" />
        </button>

        <span className="text-[12px] font-bebas font-semibold text-ink">{label}</span>
      </div>
    </>
  );
}
