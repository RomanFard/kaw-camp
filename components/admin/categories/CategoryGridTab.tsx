"use client";

import { useEffect, useState } from "react";
import { getAppContent, setAppContent } from "@/lib/supabase/appContent";
import { useToast } from "@/components/context/ToastContext";
import type { CategoryGridFilter } from "@/lib/contentTypes";

const DEFAULT: CategoryGridFilter[] = [
  { key: "best", label: "منتخب ها", photos: ["tent", "sleep", "mattress", "backpack", "clothing", "boots"] },
  { key: "tent", label: "چادر", photos: ["tent", "bottle", "cooking", "lighting", "tools", "accessories"] },
  { key: "sleep", label: "کیسه خواب", photos: ["sleep", "mattress", "tent", "bottle", "lighting", "backpack"] },
  { key: "mattress", label: "زیرانداز", photos: ["mattress", "sleep", "tent", "backpack", "clothing", "boots"] },
  { key: "backpack", label: "کوله پشتی", photos: ["backpack", "accessories", "bottle", "clothing", "boots", "tent"] },
  { key: "clothing", label: "لباس کوهنوردی", photos: ["clothing", "boots", "socks", "gaiters", "backpack", "tent"] },
  { key: "shoes", label: "کفش کوهنوردی", photos: ["boots", "gaiters", "socks", "clothing", "backpack", "tent"] },
];

const PHOTO_OPTIONS = [
  "tent", "sleep", "mattress", "backpack", "clothing", "boots",
  "socks", "gaiters", "tools", "lighting", "bottle", "cooking",
  "accessories", "sunglasses", "watch", "bicycle",
];

const inputCls =
  "w-full rounded-md border border-[#D4C5A0] bg-white px-2 py-1.5 text-xs text-gray-900 outline-none focus:border-amber-500";

export default function CategoryGridTab() {
  const toast = useToast();
  const [items, setItems] = useState<CategoryGridFilter[]>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getAppContent<CategoryGridFilter[]>("category_grid");
      if (data && data.length > 0) setItems(data);
      setLoading(false);
    })();
  }, []);

  function updateFilter(idx: number, field: "key" | "label", value: string) {
    setItems((p) =>
      p.map((f, i) => (i === idx ? { ...f, [field]: value } : f))
    );
  }

  function updatePhoto(fIdx: number, pIdx: number, value: string) {
    setItems((p) =>
      p.map((f, i) =>
        i === fIdx
          ? { ...f, photos: f.photos.map((ph, j) => (j === pIdx ? value : ph)) }
          : f
      )
    );
  }

  function addFilter() {
    setItems((p) => [...p, { key: `new-${Date.now()}`, label: "دسته جدید", photos: ["tent", "sleep", "mattress", "backpack", "clothing", "boots"] }]);
  }

  function removeFilter(idx: number) {
    if (!confirm("حذف این فیلتر؟")) return;
    setItems((p) => p.filter((_, i) => i !== idx));
  }

  function moveFilter(idx: number, dir: -1 | 1) {
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    setItems((p) => {
      const c = [...p];
      [c[idx], c[j]] = [c[j], c[idx]];
      return c;
    });
  }

  function addPhoto(fIdx: number) {
    setItems((p) =>
      p.map((f, i) =>
        i === fIdx ? { ...f, photos: [...f.photos, "tent"] } : f
      )
    );
  }

  function removePhoto(fIdx: number, pIdx: number) {
    setItems((p) =>
      p.map((f, i) =>
        i === fIdx ? { ...f, photos: f.photos.filter((_, j) => j !== pIdx) } : f
      )
    );
  }

  async function save() {
    setSaving(true);
    const { error } = await setAppContent("category_grid", items);
    setSaving(false);
    if (error) return toast.error("خطا: " + error.message);
    toast.success("ذخیره شد");
  }

  if (loading) return <div className="p-12 text-center text-gray-500">در حال بارگذاری...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {items.length} فیلتر — اسم دکمه‌ها و عکس‌های هر کدوم رو اینجا تنظیم کن
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={addFilter}
            className="rounded-lg bg-[#E84C4C] px-4 py-2 text-sm font-bold text-white hover:bg-[#D63F3F]"
          >
            ➕ فیلتر جدید
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

      <div className="space-y-3">
        {items.map((filter, idx) => (
          <div key={idx} className="rounded-xl border border-[#D4C5A0] bg-white p-4">
            <div className="mb-3 flex items-center gap-2">
              <input
                value={filter.label}
                onChange={(e) => updateFilter(idx, "label", e.target.value)}
                placeholder="نام دکمه"
                style={{ color: "#111827", colorScheme: "light" }}
                className={`${inputCls} flex-1 font-bold`}
              />
              <input
                value={filter.key}
                onChange={(e) => updateFilter(idx, "key", e.target.value)}
                placeholder="key (انگلیسی)"
                dir="ltr"
                style={{ color: "#111827", colorScheme: "light" }}
                className={`${inputCls} max-w-[150px] font-mono`}
              />
              <button
                type="button"
                onClick={() => moveFilter(idx, -1)}
                disabled={idx === 0}
                className="px-2 text-xs hover:bg-gray-100 disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveFilter(idx, 1)}
                disabled={idx === items.length - 1}
                className="px-2 text-xs hover:bg-gray-100 disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => removeFilter(idx)}
                className="rounded bg-red-50 px-2 py-1 text-xs text-red-600"
              >
                🗑
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {filter.photos.map((photo, pIdx) => (
                <div
                  key={pIdx}
                  className="flex items-center gap-1 rounded-lg border border-[#D4C5A0] bg-[#F7F1E3]/30 p-1"
                >
                  <select
                    value={photo}
                    onChange={(e) => updatePhoto(idx, pIdx, e.target.value)}
                    style={{ color: "#111827", colorScheme: "light" }}
                    className="rounded border border-[#D4C5A0] bg-white px-2 py-1 text-xs"
                  >
                    {PHOTO_OPTIONS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removePhoto(idx, pIdx)}
                    className="rounded bg-red-50 px-1.5 text-xs text-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addPhoto(idx)}
                className="rounded-lg border border-dashed border-[#D4C5A0] px-3 py-1 text-xs font-bold text-gray-500 hover:bg-gray-50"
              >
                ➕ عکس
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}