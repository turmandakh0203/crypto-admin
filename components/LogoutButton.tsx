"use client";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { LogoutIcon } from "./icons";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="p-1.5 rounded-full border border-muted hover:border-ink transition"
    >
      <LogoutIcon className="w-5 h-5 text-muted hover:text-ink" />
    </button>
  );
}
