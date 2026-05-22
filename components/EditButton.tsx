"use client";
import { EditIcon } from "@/components/icons";

interface EditButtonProps {
  label?: string;
  onClick?: () => void;
}

export default function EditButton({ label, onClick }: EditButtonProps) {
  return (
    <>
      <div className="grid justify-items-center">
        <button
          type="button"
          onClick={onClick}
          className={`flex items-center gap-1 text-[9px] rounded-full  ${label ? "px-5 py-[1px]" : "px-4 py-0.5"} border border-default text-white bg-default transition`}
        >
          <EditIcon className="w-4 h-4" />
          <p
            className={`text-white text-[14px] font-semibold font-ttNormsPro ${label ? "hidden" : ""}`}
          >
            Засах
          </p>
        </button>

        <span className="text-[12px] font-bebas font-semibold text-ink">{label}</span>
      </div>
    </>
  );
}
