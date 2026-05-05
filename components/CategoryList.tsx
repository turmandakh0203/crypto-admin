"use client";

import { useState } from "react";
import CategoryModal from "@/components/CategoryModal";
import type { Category } from "@/types/news";

interface Props {
  initialCategories: Category[];
}

export default function CategoryList({ initialCategories }: Props) {
  const categories = initialCategories;
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Category | undefined>(undefined);

  function openCreate() {
    setSelected(undefined);
    setModalOpen(true);
  }

  function openEdit(cat: Category) {
    setSelected(cat);
    setModalOpen(true);
  }

  return (
    <div className="min-h-screen bg-bg text-ink p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-ttNormsPro font-bold text-3xl">
          <span className="text-accent">Категориуд</span>
        </h1>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-accent font-semibold tracking-[0.16em] rounded-full text-white text-xs uppercase hover:bg-[#c0281f] transition"
        >
          + Шинэ категори
        </button>
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-bg">
              <th className="text-left px-4 py-2.5 text-[11px] tracking-widest text-muted font-semibold">
                #
              </th>
              <th className="text-left px-4 py-2.5 text-[11px] tracking-widest text-muted font-semibold">
                Нэр
              </th>
              <th className="text-left px-4 py-2.5 text-[11px] tracking-widest text-muted font-semibold">
                Section_label
              </th>
              <th className="text-left px-4 py-2.5 text-[11px] tracking-widest text-muted font-semibold">
                Line_1
              </th>
              <th className="text-left px-4 py-2.5 text-[11px] tracking-widest text-muted font-semibold">
                Line_2
              </th>
              <th className="text-left px-4 py-2.5 text-[11px] tracking-widest text-muted font-semibold w-[300px]">
                description
              </th>
              <th className="text-left px-4 py-2.5 text-[11px] tracking-widest text-muted font-semibold">
                sort_order
              </th>
              <th className="text-left px-4 py-2.5 text-[11px] tracking-widest text-muted font-semibold">
                төлөв
              </th>
              <th className="text-left px-4 py-2.5 text-[11px] tracking-widest text-muted font-semibold">
                Slug
              </th>
              <th className="text-left px-4 py-2.5 text-[11px] tracking-widest text-muted font-semibold">
                Nav label
              </th>
              <th className="text-left px-4 py-2.5 text-[11px] tracking-widest text-muted font-semibold">
                Icon
              </th>
              <th className="text-left px-4 py-2.5 text-[11px] tracking-widest text-muted font-semibold">
                Үйлдэл
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted text-xs font-mono">
                  Категори байхгүй байна
                </td>
              </tr>
            )}
            {categories.map((cat) => (
              <tr key={cat.id} className="border-t border-faint hover:bg-surface transition">
                <td className="px-4 py-3 text-[12px] text-muted font-mono">{cat.sort_order}</td>
                <td className="px-4 py-3">
                  <p className="text-[14px] text-ink">{cat.name}</p>
                </td>
                <td className="px-4 py-3 text-[12px] text-muted font-mono">{cat.section_label}</td>
                <td className="px-4 py-3 text-[12px] text-muted font-mono">{cat.line1}</td>
                <td className="px-4 py-3 text-[12px] text-muted font-mono">{cat.line2}</td>
                <td className="px-4 py-3 text-[12px] text-muted font-mono">{cat.description}</td>
                <td className="px-4 py-3 text-[12px] text-muted font-mono">{cat.sort_order}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-[10px] tracking-[0.1em] uppercase font-bebas inline-flex px-2 py-1 border rounded-full ${
                      cat.is_active
                        ? "text-success border-[rgba(80,216,128,0.3)] bg-[rgba(80,216,128,0.08)]"
                        : "text-muted border-border bg-transparent"
                    }`}
                  >
                    {cat.is_active ? "Идэвхтэй" : "Идэвхгүй"}
                  </span>
                </td>
                <td className="px-4 py-3 text-[12px] text-muted font-mono">{cat.slug}</td>
                <td className="px-4 py-3 text-[12px] text-muted font-mono">
                  {cat.nav_label || "—"}
                </td>
                <td className="px-4 py-3 text-[12px] text-muted font-mono">{cat.icon}</td>

                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <button
                      onClick={() => openEdit(cat)}
                      className="text-[10px] tracking-widest uppercase font-bold rounded-full bg-[#3060b01a] border border-[#3060b0cc] px-3 py-1 text-[#3060B0] hover:bg-[rgba(48,96,176,0.30)] transition"
                    >
                      Засах
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && <CategoryModal category={selected} onClose={() => setModalOpen(false)} />}
    </div>
  );
}
