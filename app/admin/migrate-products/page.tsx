"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { products } from "@/data/products";
import { useToast } from "@/components/context/ToastContext";

export default function MigrateProductsPage() {
  const supabase = createClient();
  const toast = useToast();

  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [inserted, setInserted] = useState(0);
  const [error, setError] = useState("");

  async function handleMigrate() {
    if (
      !confirm(
        `${products.length} محصول پیدا شد. آیا مطمئنی میخوای همه رو به Supabase منتقل کنی؟`
      )
    )
      return;

    setRunning(true);
    setError("");
    setInserted(0);

    // تبدیل به ساختار Supabase
    const rows = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      old_price: p.oldPrice ?? null,
      category: p.category,
      image: p.image,
      images: p.images ?? null,
      rating: p.rating,
      reviews: p.reviews,
      in_stock: p.inStock,
      short_desc: p.shortDesc,
      description: p.description,
      features: p.features ?? [],
      brand: p.brand ?? null,
      english_name: p.englishName ?? null,
      colors: p.colors ?? null,
    }));

    // upsert (اگه id تکراری بود، آپدیت میکنه — امن برای اجرای چندباره)
    const { error: upsertError } = await supabase
      .from("products")
      .upsert(rows, { onConflict: "id" });

    if (upsertError) {
      setError(upsertError.message);
      toast.error("خطا در مهاجرت: " + upsertError.message);
      setRunning(false);
      return;
    }

    setInserted(rows.length);
    setDone(true);
    setRunning(false);
    toast.success(`${rows.length} محصول با موفقیت منتقل شد!`);
  }

  return (
    <main className="min-h-screen bg-[#F7F1E3] p-8">
      <div className="mx-auto max-w-2xl">
        <a
          href="/admin"
          className="text-sm text-gray-500 hover:text-amber-600"
        >
          ← بازگشت به داشبورد
        </a>

        <h1 className="mt-4 text-3xl font-black text-gray-900">
          📦 مهاجرت محصولات
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          این صفحه، محصولات فایل <code className="font-mono">data/products.ts</code> رو
          یک‌بار به جدول Supabase منتقل می‌کنه.
        </p>

        {/* آمار */}
        <div className="mt-6 rounded-2xl border border-[#D4C5A0] bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500">
                محصولات در فایل TS
              </p>
              <p className="mt-1 text-3xl font-black text-gray-900">
                {products.length.toLocaleString("fa-IR")}
              </p>
            </div>
            <div className="text-4xl">📦</div>
          </div>

          {/* لیست پیش‌نمایش */}
          <div className="mt-4 max-h-40 overflow-y-auto rounded-lg border border-[#EDE4CE] bg-[#F7F1E3]/30 p-3">
            <ul className="space-y-1 text-xs text-gray-700">
              {products.map((p) => (
                <li key={p.id} className="truncate">
                  • {p.id} — {p.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* دکمه */}
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-sm font-bold text-amber-800">
            ⚠️ قبل از شروع
          </h2>
          <ul className="mt-2 space-y-1 text-xs text-amber-700">
            <li>• این عملیات idempotent هست (هر بار اجرا کنی، آپدیت میکنه، تکراری نمیسازه)</li>
            <li>• بعد از موفقیت، این صفحه رو حذف میکنیم</li>
            <li>• اگه خطا داد، همون کد رو دوباره بزن</li>
          </ul>
        </div>

        {/* نتیجه */}
        {done && (
          <div className="mt-6 rounded-2xl border border-green-300 bg-green-50 p-6 text-center">
            <p className="text-4xl">✅</p>
            <p className="mt-2 font-bold text-green-800">
              {inserted.toLocaleString("fa-IR")} محصول با موفقیت منتقل شد!
            </p>
            <a
              href="/admin/products"
              className="mt-4 inline-block rounded-lg bg-green-700 px-5 py-2 text-sm font-bold text-white"
            >
              رفتن به مدیریت محصولات →
            </a>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-300 bg-red-50 p-4">
            <p className="text-sm font-bold text-red-700">❌ {error}</p>
          </div>
        )}

        {/* دکمه اصلی */}
        {!done && (
          <button
            type="button"
            onClick={handleMigrate}
            disabled={running}
            className="mt-6 w-full rounded-xl bg-[#F59E0B] py-4 text-base font-black text-white transition hover:bg-[#D97706] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {running ? "در حال انتقال..." : "🚀 شروع مهاجرت"}
          </button>
        )}
      </div>
    </main>
  );
}