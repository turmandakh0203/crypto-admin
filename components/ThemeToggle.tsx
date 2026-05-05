"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-10 h-6 rounded-full flex-shrink-0" />;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Цагаан горимд шилжих" : "Харанхуй горимд шилжих"}
      title={isDark ? "Цагаан горим" : "Харанхуй горим"}
      className="relative w-10 h-6 rounded-full overflow-hidden flex-shrink-0 cursor-pointer focus:outline-none transition-all duration-500"
      style={{
        background: isDark
          ? "linear-gradient(160deg, #0a0a1f 0%, #111130 100%)"
          : "linear-gradient(170deg, #38b6ff 0%, #7fd4ff 100%)",
      }}
    >
      {/* Clouds */}
      <div
        className="absolute inset-0"
        style={{ opacity: isDark ? 0 : 1, transition: "opacity 0.4s" }}
      >
        {/* Cloud A */}
        <div className="absolute" style={{ top: 5, right: 15 }}>
          <div
            className="absolute rounded-full bg-white"
            style={{ width: 14, height: 8, top: 3, left: 0 }}
          />
          <div
            className="absolute rounded-full bg-white"
            style={{ width: 9, height: 9, top: 0, left: 3 }}
          />
          <div
            className="absolute rounded-full bg-white"
            style={{ width: 10, height: 8, top: 3, left: 8 }}
          />
        </div>
        {/* Cloud B */}
        <div className="absolute" style={{ bottom: 10, right: 20 }}>
          <div
            className="absolute rounded-full bg-white/70"
            style={{ width: 9, height: 5, top: 3, left: 0 }}
          />
          <div
            className="absolute rounded-full bg-white/70"
            style={{ width: 6, height: 6, top: 0, left: 2 }}
          />
          <div
            className="absolute rounded-full bg-white/70"
            style={{ width: 7, height: 5, top: 3, left: 5 }}
          />
        </div>
      </div>

      {/* Stars */}
      <div
        className="absolute inset-0"
        style={{ opacity: isDark ? 1 : 0, transition: "opacity 0.4s" }}
      >
        {(
          [
            { t: 5, l: 13, s: 2 },
            { t: 15, l: 13, s: 1.5 },
            { t: 7, l: 6, s: 1.5 },
            { t: 20, l: 5, s: 1.5 },
            { t: 4, l: 19, s: 1 },
            { t: 23, l: 15, s: 1 },
          ] as { t: number; l: number; s: number }[]
        ).map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: star.t,
              left: star.l,
              width: star.s,
              height: star.s,
              opacity: 0.65 + (i % 3) * 0.12,
            }}
          />
        ))}
      </div>

      {/* Knob — sun / moon */}
      <div
        className="absolute top-0.5 w-5 h-5 rounded-full"
        style={{
          left: isDark ? "calc(100% - 22px)" : "2px",
          transition:
            "left 0.42s cubic-bezier(0.34, 1.15, 0.64, 1), background 0.5s, box-shadow 0.5s",
          background: isDark
            ? "#c8c8d8"
            : "radial-gradient(circle at 50% 50%, #fff59d 0%, #ffd600 55% , #ff9800 100%)",
          boxShadow: isDark
            ? "inset -4px -2px 0 0 #7878a0, 0 1px 4px rgba(0,0,0,0.5)"
            : "0 0 10px 4px rgba(255,200,0,0.35), 0 0 3px rgba(255,140,0,0.4)",
        }}
      />
    </button>
  );
}
