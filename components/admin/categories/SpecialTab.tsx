"use client";

import { useEffect, useState } from "react";
import { getAppContent, setAppContent } from "@/lib/supabase/appContent";
import { SPECIAL_ICON_KEYS, type SpecialCategory } from "@/lib/contentTypes";
import { useToast } from "@/components/context/ToastContext";

const EMPTY: SpecialCategory = {
  key: "",
  label: "",
  subtitle: "",
  iconKey: "tent",
  href: "/products",
};

export default function SpecialTab() {
  const toast = useToast();
  const [items, setItems] = useState<SpecialCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    setLoading(true);
    const data = await getAppContent<SpecialCategory[]>("special_categories");
    setItems(data ?? []);
    setLoading(false);
  }

  function addNew() {
    setItems((p) => [...p, { ...EMPTY, key: `sp-${Date.now()}` }]);
    setEditing(items.length);
  }

  function update<K extends keyof SpecialCategory>(
    i: number,
    field: K,
    value: SpecialCategory[K]
  ) {
    setItems((prev) =>
      prev.map((item, idx) => (idx === i ? { ...item, [field]: value } : item))
    );
  }

  function remove(i: number) {
    if (!confirm("حذف این کارت؟")) return;
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
    const { error } = await setAppContent("special_categories", items);
    setSaving(false);
    if (error) return toast.error("خطا: " + error.message);
    toast.success("دسته‌بندی‌های ویژه ذخیره شد");
    setEditing(null);
  }

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-theme-muted">
        در حال بارگذاری...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* هدر */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-theme-muted">
          {items.length.toLocaleString("fa-IR")} کارت — توی بخش «دسته‌بندی ویژه» زیر
          بنر نمایش داده می‌شن
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={addNew}
            className="rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90"
          >
            ➕ افزودن
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {saving ? "..." : "💾 ذخیره"}
          </button>
        </div>
      </div>

      {/* لیست خالی */}
      {items.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-theme p-12 text-center text-xs text-theme-muted">
          هنوز کارتی اضافه نشده
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {items.map((cat, i) => (
            <div
              key={i}
              className="rounded-xl border border-theme bg-theme-card p-4 shadow-sm"
            >
              {editing === i ? (
                /* ─── حالت ویرایش ─── */
                <div className="space-y-3">
                  <input
                    placeholder="key (انگلیسی)"
                    value={cat.key}
                    onChange={(e) => update(i, "key", e.target.value)}
                    dir="ltr"
                    className="w-full rounded-lg border border-theme bg-theme-surface px-3 py-2 font-mono text-xs text-theme outline-none transition placeholder:text-theme-muted focus:border-accent"
                  />
                  <input
                    placeholder="عنوان"
                    value={cat.label}
                    onChange={(e) => update(i, "label", e.target.value)}
                    className="w-full rounded-lg border border-theme bg-theme-surface px-3 py-2 text-xs text-theme outline-none transition placeholder:text-theme-muted focus:border-accent"
                  />
                  <input
                    placeholder="زیرعنوان"
                    value={cat.subtitle}
                    onChange={(e) => update(i, "subtitle", e.target.value)}
                    className="w-full rounded-lg border border-theme bg-theme-surface px-3 py-2 text-xs text-theme outline-none transition placeholder:text-theme-muted focus:border-accent"
                  />
                  <select
                    value={cat.iconKey}
                    onChange={(e) => update(i, "iconKey", e.target.value)}
                    className="w-full rounded-lg border border-theme bg-theme-surface px-3 py-2 text-xs text-theme outline-none transition focus:border-accent"
                  >
                    {SPECIAL_ICON_KEYS.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                  <input
                    placeholder="لینک"
                    value={cat.href}
                    onChange={(e) => update(i, "href", e.target.value)}
                    dir="ltr"
                    className="w-full rounded-lg border border-theme bg-theme-surface px-3 py-2 font-mono text-xs text-theme outline-none transition placeholder:text-theme-muted focus:border-accent"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditing(null)}
                      className="flex-1 rounded-lg border border-theme bg-theme-surface py-2 text-xs font-bold text-theme-muted transition hover:text-theme"
                    >
                      بستن
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(i)}
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-500 transition hover:bg-red-500/20"
                    >
                      🗑 حذف
                    </button>
                  </div>
                </div>
              ) : (
                /* ─── حالت نمایش ─── */
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-theme">
                      {cat.label || "(بدون نام)"}
                    </div>
                    <div className="truncate text-[11px] text-theme-muted">
                      {cat.subtitle}
                    </div>
                    <div className="mt-1 font-mono text-[10px] text-theme-muted">
                      {cat.key} · {cat.iconKey}
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      className="rounded p-1 text-xs text-theme-muted transition hover:bg-theme-surface hover:text-theme disabled:opacity-30"
                      aria-label="بالا"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      disabled={i === items.length - 1}
                      className="rounded p-1 text-xs text-theme-muted transition hover:bg-theme-surface hover:text-theme disabled:opacity-30"
                      aria-label="پایین"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(i)}
                      className="rounded-lg border border-theme bg-theme-surface px-2 py-1 text-xs font-bold text-theme transition hover:border-accent"
                    >
                      ✏️
                    </button>
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