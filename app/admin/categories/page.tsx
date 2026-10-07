"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import PopularTab from "@/components/admin/categories/PopularTab";
import SpecialTab from "@/components/admin/categories/SpecialTab";
import MobileTab from "@/components/admin/categories/MobileTab";
import CategoryGridTab from "@/components/admin/categories/CategoryGridTab";
import ImageUploader from "@/components/admin/ImageUploader";
import { categories } from "@/data/products";
import {
  getAllCategoryPhotos,
  upsertCategoryPhoto,
  deleteCategoryPhoto,
  type CategoryPhoto,
} from "@/lib/supabase/categoryPhotos";

type Tab = "products" | "photos" | "special" | "popular" | "mobile" | "grid";

export default function AdminCategoriesPage() {
  const [tab, setTab] = useState<Tab>("popular");

  const tabs: { key: Tab; label: string }[] = [
    { key: "popular", label: "🔥 محبوب" },
    { key: "grid", label: "⭐ خاص پسندها" },
    { key: "special", label: "🎯 ویژه" },
    { key: "mobile", label: "📱 موبایل" },
    { key: "photos", label: "🖼 عکس‌ها" },
    { key: "products", label: "📦 محصولات" },
  ];

  return (
    <main className="min-h-screen bg-[#F7F1E3]">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="mb-6">
          <a
            href="/admin"
            className="text-sm text-gray-500 hover:text-amber-600"
          >
            ← بازگشت به داشبورد
          </a>
          <h1 className="mt-2 text-3xl font-black text-gray-900">
            🗂 مدیریت دسته‌بندی‌ها
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            مدیریت کامل دسته‌بندی‌های محبوب، خاص پسندها، ویژه، منوی موبایل و عکس‌ها
          </p>
        </div>

        {/* تب‌ها */}
        <div className="mb-6 flex flex-wrap gap-2 border-b border-[#D4C5A0] pb-3">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={
                "rounded-lg px-4 py-2 text-sm font-bold transition " +
                (tab === t.key
                  ? "bg-[#E84C4C] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100")
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* محتوای تب */}
        <div className="rounded-2xl border border-[#D4C5A0] bg-white p-5">
          {tab === "popular" && <PopularTab />}
          {tab === "grid" && <CategoryGridTab />}
          {tab === "special" && <SpecialTab />}
          {tab === "mobile" && <MobileTab />}
          {tab === "photos" && <PhotosTab />}
          {tab === "products" && (
            <div className="p-8 text-center">
              <p className="mb-4 text-gray-500">
                برای مدیریت محصولات به صفحه محصولات برو
              </p>
              <a
                href="/admin/products"
                className="inline-block rounded-lg bg-[#E84C4C] px-6 py-3 text-sm font-bold text-white hover:bg-[#D63F3F]"
              >
                📦 رفتن به مدیریت محصولات
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

/* ═══════════════════════════════════
   تب عکس‌ها
   ═══════════════════════════════════ */
function PhotosTab() {
  const supabase = createClient();
  const [photos, setPhotos] = useState<CategoryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    setLoading(true);
    const data = await getAllCategoryPhotos();
    setPhotos(data);
    setLoading(false);
  }

  function getPhoto(key: string) {
    return photos.find((p) => p.category_key === key);
  }

  async function handleChange(key: string, url: string) {
    setSaving(key);
    const existing = getPhoto(key);
    const { error } = await upsertCategoryPhoto({
      category_key: key,
      photo: url,
      order_index: existing?.order_index ?? 0,
      is_active: true,
    });
    setSaving(null);
    if (!error) load();
  }

  async function handleRemove(key: string) {
    const existing = getPhoto(key);
    if (!existing) return;
    if (!confirm("حذف این عکس؟")) return;
    setSaving(key);
    await deleteCategoryPhoto(existing.id);
    setSaving(null);
    load();
  }

  if (loading)
    return (
      <div className="p-12 text-center text-gray-500">در حال بارگذاری...</div>
    );

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        عکس هر دسته که در بخش «محبوب» صفحه اصلی استفاده می‌شه رو اینجا آپلود کن
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => {
          const existing = getPhoto(cat.key);
          return (
            <div
              key={cat.key}
              className="rounded-xl border border-[#D4C5A0] bg-white p-4"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="text-2xl">{cat.emoji}</span>
                <div>
                  <div className="text-sm font-bold text-gray-900">
                    {cat.label}
                  </div>
                  <div className="font-mono text-[10px] text-gray-400">
                    {cat.key}
                  </div>
                </div>
              </div>

              {existing?.photo ? (
                <div className="relative mb-2 aspect-[4/3] overflow-hidden rounded-lg border border-[#EDE4CE]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={existing.photo}
                    alt={cat.label}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemove(cat.key)}
                    disabled={saving === cat.key}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow-lg hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="mb-2 flex aspect-[4/3] items-center justify-center rounded-lg border-2 border-dashed border-[#D4C5A0] bg-gray-50 text-xs text-gray-400">
                  بدون تصویر
                </div>
              )}

              <ImageUploader
                value={existing?.photo ?? ""}
                onChange={(url) => handleChange(cat.key, url)}
                label={saving === cat.key ? "در حال ذخیره..." : "آپلود عکس"}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}