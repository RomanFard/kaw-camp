"use client";

import { useEffect, useState } from "react";
import { getAppContent, setAppContent } from "@/lib/supabase/appContent";
import type { PopularCategory } from "@/lib/contentTypes";
import { useToast } from "@/components/context/ToastContext";
import ImageUploader from "@/components/admin/ImageUploader";

const EMPTY: PopularCategory = {
  key: "",
  label: "",
  emoji: "📦",
  image: "",
  href: "/products",
};

export default function PopularTab() {
  const toast = useToast();
  const [items, setItems] = useState<PopularCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const data = await getAppContent<PopularCategory[]>("popular_categories");
    setItems(data ?? []);
    setLoading(false);
  }

  function addNew() {
    setItems((p) => [...p, { ...EMPTY, key: `cat-${Date.now()}` }]);
    setEditing(items.length);
  }

  function update<K extends keyof PopularCategory>(
    i: number,
    field: K,
    value: PopularCategory[K]
  ) {
    setItems((prev) =>
      prev.map((item, idx) => (idx === i ? { ...item, [field]: value } : item))
    );
  }

  function remove(i: number) {
    if (!confirm("حذف این دسته؟")) return;
    setItems((p) => p.filter((_, idx) => idx !== i));
    setEditing(null);
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    setItems((p) => {
      const copy = [...p];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  }

  async function save() {
    setSaving(true);
    const { error } = await setAppContent("popular_categories", items);
    setSaving(false);
    if (error) return toast.error("خطا: " + error.message);
    toast.success("دسته‌بندی‌های محبوب ذخیره شد");
    setEditing(null);
  }

  if (loading) return <div className="p-12 text-center text-gray-500">در حال بارگذاری...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {items.length} دسته — این‌ها توی بخش «دسته‌بندی‌های محبوب» صفحه اصلی نمایش داده می‌شن
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={addNew}
            className="rounded-lg bg-[#E84C4C] px-4 py-2 text-sm font-bold text-white hover:bg-[#D63F3F]"
          >
            ➕ افزودن
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {saving ? "..." : "💾 ذخیره"}
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center text-gray-400">
          هنوز دسته‌ای اضافه نشده
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {items.map((cat, i) => (
            <div
              key={i}
              className="rounded-xl border border-[#D4C5A0] bg-white p-4"
            >
              {editing === i ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="key (انگلیسی)"
                      value={cat.key}
                      onChange={(e) => update(i, "key", e.target.value)}
                      dir="ltr"
                      style={{ color: "#111827", colorScheme: "light" }}
                      className="rounded-lg border border-[#D4C5A0] bg-white px-3 py-2 text-sm"
                    />
                    <input
                      placeholder="emoji"
                      value={cat.emoji}
                      onChange={(e) => update(i, "emoji", e.target.value)}
                      style={{ color: "#111827", colorScheme: "light" }}
                      className="rounded-lg border border-[#D4C5A0] bg-white px-3 py-2 text-center text-lg"
                    />
                  </div>
                  <input
                    placeholder="نام دسته"
                    value={cat.label}
                    onChange={(e) => update(i, "label", e.target.value)}
                    style={{ color: "#111827", colorScheme: "light" }}
                    className="w-full rounded-lg border border-[#D4C5A0] bg-white px-3 py-2 text-sm"
                  />
                  <input
                    placeholder="لینک (مثلاً /products?cat=tent)"
                    value={cat.href}
                    onChange={(e) => update(i, "href", e.target.value)}
                    dir="ltr"
                    style={{ color: "#111827", colorScheme: "light" }}
                    className="w-full rounded-lg border border-[#D4C5A0] bg-white px-3 py-2 font-mono text-xs"
                  />
                  <ImageUploader
                    value={cat.image}
                    onChange={(url) => update(i, "image", url)}
                    label="عکس دسته"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditing(null)}
                      className="flex-1 rounded-lg bg-gray-100 py-2 text-xs font-bold text-gray-700"
                    >
                      بستن
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(i)}
                      className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600"
                    >
                      🗑 حذف
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-3 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                    {cat.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cat.image} alt={cat.label} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-5xl">{cat.emoji}</span>
                    )}
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-bold text-gray-900">
                        {cat.emoji} {cat.label || "(بدون نام)"}
                      </div>
                      <div className="truncate font-mono text-[10px] text-gray-400">
                        {cat.key}
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 gap-1">
                      <button
                        type="button"
                        onClick={() => move(i, -1)}
                        disabled={i === 0}
                        className="rounded p-1 text-xs hover:bg-gray-100 disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => move(i, 1)}
                        disabled={i === items.length - 1}
                        className="rounded p-1 text-xs hover:bg-gray-100 disabled:opacity-30"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing(i)}
                        className="rounded bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700"
                      >
                        ✏️
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}