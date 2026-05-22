"use client";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { DeleteIcon } from "./icons";

interface DeleteButtonProps {
  onDelete: () => Promise<unknown>;
  label?: string;
}

export default function DeleteButton({ onDelete, label }: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete();
      router.refresh();
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => !loading && setOpen(false)}
      />
      <div className="relative bg-surface border border-faint w-[340px] p-6 rounded-lg shadow-lg flex flex-col">
        <div
          className="absolute inset-x-0 top-0 h-[1px] z-10"
          style={{
            background: "linear-gradient(90deg, transparent 0%, #fe2726 50%, transparent 100%)",
          }}
        />
        <div className="flex items-center gap-2 mb-4">
          <span className="text-accent text-base">⚠</span>
          <span className="text-[9px] tracking-[0.2em] uppercase font-ttNormsPro text-accent">
            Устгах баталгаажуулалт
          </span>
        </div>
        <p className="text-[16px] text-ink font-ttNormsPro mb-1">Устгахдаа итгэлтэй байна уу?</p>
        <p className="text-[12px] text-muted font-ttNormsPro mb-6">
          Энэ үйлдлийг буцаах боломжгүй.
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 py-2 bg-accent text-white text-[10px] tracking-[0.14em] uppercase rounded-full font-ttNormsPro hover:bg-[#c0281f] transition disabled:opacity-50"
          >
            {loading ? "Устгаж байна..." : "Тийм, устга"}
          </button>
          <button
            onClick={() => setOpen(false)}
            disabled={loading}
            className="flex-1 py-2 border border-border text-muted text-[10px] tracking-[0.14em] uppercase rounded-full font-ttNormsPro hover:text-ink hover:border-[#333] transition disabled:opacity-50"
          >
            Болих
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="grid justify-items-center">
        <button
          onClick={() => setOpen(true)}
          className={`flex items-center gap-1 text-[9px] tracking-widest rounded-full  ${label ? "px-5 py-[1px]" : "px-10 py-0.5"}  text-[#EB534E] border border-accent bg-[#EB534E] transition`}
        >
          <DeleteIcon className="text-white w-4 h-4" />
          <p
            className={`text-white text-[14px] font-semibold font-ttNormsPro ${label ? "hidden" : ""}`}
          >
            Устгах
          </p>
        </button>
        <span className="text-[12px] font-bebas font-semibold text-ink">{label}</span>
      </div>
      {open && createPortal(modal, document.body)}
    </>
  );
}
