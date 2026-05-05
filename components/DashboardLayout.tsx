"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NAV } from "@/types/news";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "next-themes";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { resolvedTheme } = useTheme();
  const isDark = !mounted || resolvedTheme === "dark";
  const logo = isDark ? "/ciphernews_icon_white.svg" : "/ciphernews_icon_dark.svg";

  return (
    <div className="min-h-screen bg-bg text-ink flex">
      {/* Sidebar */}
      <aside className="w-[200px] flex-shrink-0 border-r border-faint flex flex-col sticky top-0 h-screen">
        {/* Brand */}
        <div className="px-5 py-4 border-b border-faint flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-7 h-7" />
          <div className="leading-[1]">
            <div className="text-[15px] tracking-[1px] uppercase text-ink font-bold">CRYPTO</div>
            <div className="text-[13px] tracking-[1px] text-accent uppercase font-bold ">NEWS</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3">
          {NAV.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-5 py-2.5 text-[13px] tracking-[0.08em] border-l-2 transition-all font-bebas ${
                  isActive
                    ? "border-accent text-ink bg-[rgba(230,51,41,0.06)]"
                    : "border-transparent text-muted hover:text-[#888] hover:border-border"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-1 flex items-center h-12 gap-3 border-t border-[var(--border)]  min-w-[180px]">
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {mounted && (
              <span className="text-[11px] tracking-[0.08em] uppercase font-ttNormsPro text-muted whitespace-nowrap">
                {isDark ? "Dark theme" : "Light theme"}
              </span>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
