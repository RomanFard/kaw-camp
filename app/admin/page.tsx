"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#F7F1E3] p-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between rounded-2xl border border-[#D4C5A0] bg-white p-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900">
              🎛️ پنل مدیریت KAW CAMP
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              این صفحه موقتیه — بهزودی با مدیریت کدهای تخفیف جایگزین میشه
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-100"
          >
            خروج
          </button>
        </div>
      </div>
    </main>
  );
}