"use client";

import { useEffect, useState } from "react";
import { getAppContent, setAppContent } from "@/lib/actions/appContent";
import {
  type CategoryGridFilter,
  type CategoryGridPhoto,
  normalizeGridPhoto,
} from "@/lib/contentTypes";
import { useToast } from "@/components/context/ToastContext";

const KEY = "category_grid";

const DEFAULT_FILTERS: CategoryGridFilter[] = [
  {
    key: "tent",
    label: "چادر",
    photos: ["tent", "bottle", "cooking", "lighting"],
  },
  {
    key: "sleep",
    label: "کیسه خواب",
    photos: ["sleep", "mattress", "tent", "bottle"],
  },
  {
    key: "mattress",
    label: "زیرانداز",
    photos: ["mattress", "sleep", "tent", "backpack"],
  },
  {
    key: "backpack",
    label: "کوله پشتی",
    photos: ["backpack", "accessories", "bottle", "clothing"],
  },
];

export default function GridTab() {
  const toast = useToast();
  const [filters, setFilters] = useState<CategoryGridFilter[]>(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openPhoto, setOpenPhoto] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const data = await getAppContent<CategoryGridFilter[]>(KEY);
      if (data && data.length > 0) setFilters(data);
      setLoading(false);
    })();
  }, []);

  function updateFilter(i: number, patch: Partial<CategoryGridFilter>) {
    setFilters((p) => p.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));
  }

  function addFilter() {
    setFilters((p) => [
      ...p,
      {
        key: `cat-${Date.now()}`,
        label: "دسته جدید",
        photos: ["tent", "sleep", "mattress", "backpack"],
      },
    ]);
  }

  function removeFilter(i: number) {
    if (!confirm("حذف این تب؟")) return;
    setFilters((p) => p.filter((_, idx) => idx !== i));
  }

  function moveFilter(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= filters.length) return;
    setFilters((p) => {
      const c = [...p];
      [c[i], c[j]] = [c[j], c[i]];
      return c;
    });
  }

  function updatePhotoObj(
    fi: number,
    pi: number,
    patch: Partial<CategoryGridPhoto>
  ) {
    setFilters((p) =>
      p.map((f, idx) => {
        if (idx !== fi) return f;
        const currentObj = normalizeGridPhoto(f.photos[pi]);
        const newObj = { ...currentObj, ...patch };
        return {
          ...f,
          photos: f.photos.map((ph, j) => (j === pi ? newObj : ph)),
        };
      })
    );
  }

  function addPhoto(fi: number) {
    setFilters((p) =>
      p.map((f, idx) =>
        idx === fi ? { ...f, photos: [...f.photos, { name: "" }] } : f
      )
    );
  }

  function removePhoto(fi: number, pi: number) {
    setFilters((p) =>
      p.map((f, idx) =>
        idx === fi
          ? { ...f, photos: f.photos.filter((_, j) => j !== pi) }
          : f
      )
    );
  }

  function movePhoto(fi: number, pi: number, dir: -1 | 1) {
    const j = pi + dir;
    const arr = filters[fi].photos;
    if (j < 0 || j >= arr.length) return;
    setFilters((p) =>
      p.map((f, idx) => {
        if (idx !== fi) return f;
        const c = [...f.photos];
        [c[pi], c[j]] = [c[j], c[pi]];
        return { ...f, photos: c };
      })
    );
  }

  async function save() {
    setSaving(true);
    // normalize همه photos به object
    const normalized = filters.map((f) => ({
      ...f,
      photos: f.photos.map(normalizeGridPhoto),
    }));
    const { error } = await setAppContent(KEY, normalized);
    setSaving(false);
    if (error) return toast.error("خطا: " + error.message);
    toast.success("✅ گرید دسته‌بندی ذخیره شد");
    setFilters(normalized);
  }

  async function reset() {
    if (!confirm("بازگشت به پیش‌فرض؟")) return;
    setFilters(DEFAULT_FILTERS);
  }

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-theme-muted">
        در حال بارگذاری...
      </div>
    );
  }

  const inp =
    "w-full rounded-lg border border-theme bg-theme-surface px-3 py-2 text-xs text-theme outline-none transition placeholder:text-theme-muted focus:border-accent";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-theme-muted">
            {filters.length.toLocaleString("fa-IR")} تب — بخش «دسته‌بندی‌های
            محبوب» صفحه اصلی
          </p>
          <p className="mt-0.5 text-[10px] text-theme-muted">
            💡 برای هر عکس می‌تونی لینک اختصاصی، عنوان و توضیح بذاری
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={reset}
            className="rounded-xl border border-theme bg-theme-card px-3 py-2 text-xs font-bold text-theme-muted transition hover:text-theme"
          >
            🔄 ریست
          </button>
          <button
            type="button"
            onClick={addFilter}
            className="rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90"
          >
            ➕ تب جدید
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

      <div className="space-y-3">
        {filters.map((filter, fi) => (
          <div
            key={fi}
            className="rounded-xl border border-theme bg-theme-card p-4"
          >
            {/* هدر تب */}
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <input
                value={filter.label}
                onChange={(e) => updateFilter(fi, { label: e.target.value })}
                placeholder="عنوان تب"
                className={`${inp} flex-1 min-w-[120px] font-bold`}
              />
              <input
                value={filter.key}
                onChange={(e) => updateFilter(fi, { key: e.target.value })}
                placeholder="key"
                dir="ltr"
                className={`${inp} max-w-[140px] font-mono`}
              />
              <button
                type="button"
                onClick={() => moveFilter(fi, -1)}
                disabled={fi === 0}
                className="rounded p-1.5 text-xs text-theme-muted transition hover:bg-theme-surface hover:text-theme disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveFilter(fi, 1)}
                disabled={fi === filters.length - 1}
                className="rounded p-1.5 text-xs text-theme-muted transition hover:bg-theme-surface hover:text-theme disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => removeFilter(fi)}
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs font-bold text-red-500 transition hover:bg-red-500/20"
              >
                🗑
              </button>
            </div>

            {/* عکس‌ها */}
            <p className="mb-2 text-[11px] font-bold text-theme-muted">
              عکس‌ها ({filter.photos.length} تا):
            </p>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {filter.photos.map((rawPhoto, pi) => {
                const photo = normalizeGridPhoto(rawPhoto);
                const key = `${fi}-${pi}`;
                const isOpen = openPhoto === key;
                const customHref = photo.href ?? "";
                const customLabel = photo.label ?? "";
                const customDesc = photo.description ?? "";

                return (
                  <div
                    key={pi}
                    className="rounded-lg border border-theme bg-theme-surface/30 p-2.5"
                  >
                    {/* ردیف اول: thumbnail + name + actions */}
                    <div className="flex items-center gap-2">
                      {/* Thumbnail */}
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-theme-surface">
                        {photo.name ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={`/images/categories/photos/${photo.name}.jpg`}
                            alt={photo.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-base text-theme-muted">
                            📷
                          </span>
                        )}
                      </div>

                      <input
                        value={photo.name}
                        onChange={(e) =>
                          updatePhotoObj(fi, pi, { name: e.target.value })
                        }
                        placeholder="نام عکس (tent)"
                        dir="ltr"
                        className={`${inp} flex-1 font-mono`}
                      />

                      {/* Toggle custom */}
                      <button
                        type="button"
                        onClick={() => setOpenPhoto(isOpen ? null : key)}
                        className={
                          "rounded-lg border px-2 py-1 text-[10px] font-bold transition " +
                          (customHref || customLabel || customDesc
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600"
                            : "border-theme bg-theme-card text-theme-muted hover:border-accent hover:text-accent")
                        }
                        title="تنظیمات بیشتر"
                      >
                        ⚙️
                      </button>

                      {/* Move */}
                      <button
                        type="button"
                        onClick={() => movePhoto(fi, pi, -1)}
                        disabled={pi === 0}
                        className="rounded p-1 text-xs text-theme-muted transition hover:bg-theme-surface hover:text-theme disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => movePhoto(fi, pi, 1)}
                        disabled={pi === filter.photos.length - 1}
                        className="rounded p-1 text-xs text-theme-muted transition hover:bg-theme-surface hover:text-theme disabled:opacity-30"
                      >
                        ↓
                      </button>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => removePhoto(fi, pi)}
                        className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs font-bold text-red-500 transition hover:bg-red-500/20"
                      >
                        ✕
                      </button>
                    </div>

                    {/* پنل تنظیمات بیشتر */}
                    {isOpen && (
                      <div className="mt-2 space-y-2 border-t border-theme pt-2">
                        <div>
                          <label className="mb-1 block text-[10px] font-bold text-theme-muted">
                            لینک اختصاصی (اختیاری)
                          </label>
                          <input
                            value={customHref}
                            onChange={(e) =>
                              updatePhotoObj(fi, pi, {
                                href: e.target.value || undefined,
                              })
                            }
                            placeholder={`پیش‌فرض: /products?cat=${filter.key}`}
                            dir="ltr"
                            className={`${inp} font-mono text-[11px]`}
                          />
                          <p className="mt-1 text-[10px] text-theme-muted">
                            💡 می‌تونی بذاری:
                            <code className="mx-1 rounded bg-theme-surface px-1 font-mono">
                              /product/18
                            </code>
                            (محصول خاص) یا
                            <code className="mx-1 rounded bg-theme-surface px-1 font-mono">
                              /products?cat=tent
                            </code>
                          </p>
                        </div>

                        <div>
                          <label className="mb-1 block text-[10px] font-bold text-theme-muted">
                            عنوان اختصاصی (اختیاری)
                          </label>
                          <input
                            value={customLabel}
                            onChange={(e) =>
                              updatePhotoObj(fi, pi, {
                                label: e.target.value || undefined,
                              })
                            }
                            placeholder="پیش‌فرض: از اسم فایل"
                            className={`${inp} text-[11px]`}
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-[10px] font-bold text-theme-muted">
                            توضیح اختصاصی (اختیاری)
                          </label>
                          <input
                            value={customDesc}
                            onChange={(e) =>
                              updatePhotoObj(fi, pi, {
                                description: e.target.value || undefined,
                              })
                            }
                            placeholder="پیش‌فرض: از دیکشنری داخلی"
                            className={`${inp} text-[11px]`}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => addPhoto(fi)}
              className="mt-3 w-full rounded-lg border-2 border-dashed border-theme bg-theme-surface/50 py-2 text-[11px] font-bold text-theme-muted transition hover:border-accent hover:text-accent"
            >
              ➕ افزودن عکس
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}