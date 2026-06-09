"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NAV } from "@/types/news";
import ThemeToggle from "./ThemeToggle";
import LogoutButton from "./LogoutButton";
import { useTheme } from "next-themes";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { resolvedTheme } = useTheme();
  const isDark = !mounted || resolvedTheme === "dark";
  const logo = isDark ? "/ciphernews_icon_white.svg" : "/ciphernews_icon_dark.svg";

  if (pathname === "/login") return <>{children}</>;

  return (
    <div className="h-screen bg-bg text-ink flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[56px] hover:w-[200px] group/sidebar transition-[width] duration-200 ease-in-out flex-shrink-0 border-r border-faint flex flex-col sticky top-0 h-screen overflow-hidden">
        {/* Brand */}
        <div className="px-[14px] py-[18px] border-b border-faint flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-7 h-7 flex-shrink-0" />
          <div className="leading-[1] opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150 whitespace-nowrap">
            <div className="text-[15px] tracking-[1px] uppercase text-ink font-bold">CRYPTO</div>
            <div className="text-[13px] tracking-[1px] text-accent uppercase font-bold">NEWS</div>
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
                className={`flex items-center gap-3 px-[14px] py-2.5 text-[13px] tracking-[0.08em] border-l-2 transition-all font-bebas ${
                  isActive
                    ? "border-accent text-ink bg-[rgba(230,51,41,0.06)]"
                    : "border-transparent text-muted hover:text-[#888] hover:border-border"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150 whitespace-nowrap">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="flex items-center justify-between h-12 gap-2 p-2 border-t border-[var(--border)]">
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {mounted && (
              <span className="text-[11px] tracking-[0.08em] uppercase font-ttNormsPro text-muted">
                {isDark ? "Dark" : "Light"}
              </span>
            )}
          </div>
          <div className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150 flex items-center whitespace-nowrap overflow-hidden">
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
    </div>
  );
}
