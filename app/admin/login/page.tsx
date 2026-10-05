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
    <main className="flex min-h-screen items-center justify-center bg-[#F7F1E3] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#D4C5A0] bg-white p-8 shadow-lg">
        {/* لوگو / عنوان */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#E89070] text-3xl">
            🔐
          </div>
          <h1 className="text-2xl font-black text-gray-900">ورود ادمین</h1>
          <p className="mt-1 text-sm text-gray-500">
            پنل مدیریت KAW CAMP
          </p>
        </div>

        {/* فرم */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-bold text-gray-700">
              ایمیل
            </label>
            <input
              type="email"
              required
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@kawcamp.com"
              className="w-full rounded-lg border border-[#D4C5A0] bg-[#F7F1E3]/30 px-4 py-2.5 text-left text-sm outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-bold text-gray-700">
              رمز عبور
            </label>
            <input
              type="password"
              required
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-[#D4C5A0] bg-[#F7F1E3]/30 px-4 py-2.5 text-left text-sm outline-none focus:border-amber-500"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#E89070] py-3 text-sm font-bold text-white transition hover:bg-[#D77E5E] disabled:opacity-50"
          >
            {loading ? "در حال ورود..." : "ورود به پنل"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          دسترسی محدود به مدیران سیستم
        </p>
      </div>
    </main>
  );
}