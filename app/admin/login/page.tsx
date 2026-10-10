"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("ایمیل یا رمز عبور نادرست است");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-theme px-4">
      <div className="w-full max-w-md rounded-2xl border border-theme bg-theme-card p-8 shadow-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-3xl">
            🔐
          </div>
          <h1 className="text-2xl font-black text-theme">ورود ادمین</h1>
          <p className="mt-1 text-xs text-theme-muted">
            پنل مدیریت KAW CAMP
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-theme-muted">
              ایمیل
            </label>
            <input
              type="email"
              required
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@kawcamp.com"
              autoComplete="email"
              className="w-full rounded-xl border border-theme bg-theme-surface px-4 py-2.5 text-left text-xs text-theme outline-none transition placeholder:text-theme-muted focus:border-accent"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-theme-muted">
              رمز عبور
            </label>
            <input
              type="password"
              required
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full rounded-xl border border-theme bg-theme-surface px-4 py-2.5 text-left text-xs text-theme outline-none transition placeholder:text-theme-muted focus:border-accent"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-bold text-red-500">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent py-3 text-xs font-bold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "در حال ورود..." : "ورود به پنل"}
          </button>
        </form>

        <p className="mt-6 text-center text-[10px] text-theme-muted">
          دسترسی محدود به مدیران سیستم
        </p>
      </div>
    </main>
  );
}