"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Имэйл эсвэл нууц үг буруу байна.");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="text-[28px] font-bold text-accent tracking-tight">CRYPTO NEWS</div>
          <div className="text-[12px] text-muted tracking-[0.12em] uppercase mt-1">Dashboard</div>
        </div>

        <form
          onSubmit={handleLogin}
          className="border border-faint bg-bg rounded-xl px-6 py-7 flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] tracking-[0.1em] uppercase text-muted font-semibold">
              Имэйл
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="bg-transparent border border-faint rounded-lg px-3 py-2.5 text-[14px] text-ink outline-none focus:border-accent transition placeholder:text-muted"
              placeholder="admin@example.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] tracking-[0.1em] uppercase text-muted font-semibold">
              Нууц үг
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-transparent border border-faint rounded-lg px-3 py-2.5 text-[14px] text-ink outline-none focus:border-accent transition placeholder:text-muted"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-[12px] text-accent font-semibold">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full py-2.5 rounded-lg bg-accent text-white text-[12px] tracking-[0.1em] uppercase font-semibold hover:bg-[#c0281f] transition disabled:opacity-50"
          >
            {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
          </button>
        </form>
      </div>
    </div>
  );
}
