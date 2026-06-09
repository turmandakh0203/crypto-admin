"use client";

import { useState } from "react";
import CategoryModal from "@/components/CategoryModal";
import type { Category } from "@/types/news";
import EditButton from "@/components/EditButton";

interface Props {
  initialCategories: Category[];
}

const Th = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <th
    className={`text-left px-4 py-2.5 text-[11px] tracking-widest text-muted font-semibold ${className ?? ""}`}
  >
    {children}
  </th>
);

const Td = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <td className={`px-4 py-3 text-[12px] text-muted font-mono ${className ?? ""}`}>{children}</td>
);

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
    <div className="min-h-screen bg-bg text-ink py-3 px-6">
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
        <table className="w-full ">
          <thead>
            <tr className="border-b border-border bg-bg">
              <Th>#</Th>
              <Th>Нэр</Th>
              <Th>Section_label</Th>
              <Th>Line_1</Th>
              <Th>Line_2</Th>
              <Th className="w-[300px]">description</Th>
              <Th>sort_order</Th>
              <Th>төлөв</Th>
              <Th>Slug</Th>
              <Th>Nav label</Th>
              <Th>Icon</Th>
              <Th>Үйлдэл</Th>
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
                <Td>{cat.sort_order}</Td>
                <td className="px-4 py-3">
                  <p className="text-[14px] text-ink">{cat.name}</p>
                </td>
                <Td>{cat.section_label}</Td>
                <Td>{cat.line1}</Td>
                <Td>{cat.line2}</Td>
                <Td>{cat.description}</Td>
                <Td>{cat.sort_order}</Td>
                <td className="px-4 py-3">
                  <span
                    className={`text-[10px] tracking-[0.1em] uppercase font-bebas inline-flex px-2 py-1 border rounded-full ${
                      cat.is_active
                        ? "text-success border-[rgba(80,216,128,0.3)] bg-[rgba(80,216,128,0.08)]"
                        : "text-accent border-accent bg-transparent"
                    }`}
                  >
                    {cat.is_active ? "Идэвхтэй" : "Идэвхгүй"}
                  </span>
                </td>
                <Td>{cat.slug}</Td>
                <Td>{cat.nav_label || "—"}</Td>
                <Td>{cat.icon}</Td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <EditButton onClick={() => openEdit(cat)} />
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
