"use client";

import { useEffect, useRef, useState } from "react";
import { getAppContent, setAppContent } from "@/lib/supabase/appContent";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/context/ToastContext";

const KEY = "category_photos";
const BUCKET = "products";
const FOLDER = "categories/photos";

export type CategoryPhoto = {
  name: string;
  url: string;
};

// 🆕 عکس‌های پیش‌فرض — همون‌ها که توی CategoryGrid و CategoryShowcase استفاده می‌شن
const DEFAULT_PHOTOS: CategoryPhoto[] = [
  { name: "tent", url: "/images/categories/photos/tent.jpg" },
  { name: "sleep", url: "/images/categories/photos/sleep.jpg" },
  { name: "mattress", url: "/images/categories/photos/mattress.jpg" },
  { name: "backpack", url: "/images/categories/photos/backpack.jpg" },
  { name: "clothing", url: "/images/categories/photos/clothing.jpg" },
  { name: "boots", url: "/images/categories/photos/boots.jpg" },
  { name: "socks", url: "/images/categories/photos/socks.jpg" },
  { name: "gaiters", url: "/images/categories/photos/gaiters.jpg" },
  { name: "tools", url: "/images/categories/photos/tools.jpg" },
  { name: "lighting", url: "/images/categories/photos/lighting.jpg" },
  { name: "bottle", url: "/images/categories/photos/bottle.jpg" },
  { name: "cooking", url: "/images/categories/photos/cooking.jpg" },
  { name: "accessories", url: "/images/categories/photos/accessories.jpg" },
];

export default function PhotosTab() {
  const toast = useToast();
  const [items, setItems] = useState<CategoryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadTargetRef = useRef<string | null>(null);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    setLoading(true);
    const data = await getAppContent<CategoryPhoto[]>(KEY);
    setItems(data && data.length > 0 ? data : DEFAULT_PHOTOS);
    setLoading(false);
  }

  function handlePickImage(name: string) {
    uploadTargetRef.current = name;
    fileRef.current?.click();
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const name = uploadTargetRef.current;
    if (!file || !name) return;

    setUploadingFor(name);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${FOLDER}/${name}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: true, cacheControl: "3600" });
      if (error) throw error;

      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
      const next = items.map((it) =>
        it.name === name ? { ...it, url: pub.publicUrl } : it
      );
      setItems(next);
      toast.success(`عکس «${name}» تغییر کرد`);
    } catch (err: any) {
      toast.error("خطا در آپلود: " + (err?.message ?? err));
    } finally {
      if (fileRef.current) fileRef.current.value = "";
      uploadTargetRef.current = null;
      setUploadingFor(null);
    }
  }

  function updateName(i: number, newName: string) {
    const clean = newName.trim().toLowerCase().replace(/\s+/g, "-");
    setItems((p) =>
      p.map((it, idx) => (idx === i ? { ...it, name: clean } : it))
    );
  }

  function addNew() {
    const name = `new-cat-${Date.now()}`;
    setItems((p) => [...p, { name, url: "" }]);
  }

  function remove(i: number) {
    if (!confirm("حذف این عکس؟ (فایل اصلی روی Storage پاک نمی‌شه، فقط از لیست حذف می‌شه)")) return;
    setItems((p) => p.filter((_, idx) => idx !== i));
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    setItems((p) => {
      const c = [...p];
      [c[i], c[j]] = [c[j], c[i]];
      return c;
    });
  }

  async function save() {
    setSaving(true);
    const { error } = await setAppContent(KEY, items);
    setSaving(false);
    if (error) return toast.error("خطا: " + error.message);
    toast.success("عکس‌های دسته‌بندی ذخیره شد");
  }

  async function reset() {
    if (!confirm("بازگشت به لیست پیش‌فرض؟")) return;
    setItems(DEFAULT_PHOTOS);
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
        <div>
          <p className="text-xs text-theme-muted">
            {items.length.toLocaleString("fa-IR")} عکس — اسم هر عکس، همون کلیدیه که
            توی کاروسل‌های صفحه اصلی استفاده می‌شه
          </p>
          <p className="mt-0.5 text-[10px] text-theme-muted">
            💡 مثال: اگر عکس <code className="rounded bg-theme-surface px-1 font-mono">tent</code> رو
            عوض کنی، همه‌جا که «چادر» نمایش داده می‌شه عکس جدید میاد
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
            onClick={addNew}
            className="rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90"
          >
            ➕ عکس جدید
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

      {/* گرید عکس‌ها */}
      {items.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-theme p-12 text-center text-xs text-theme-muted">
          هنوز عکسی اضافه نشده
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {items.map((photo, i) => {
            const isUploading = uploadingFor === photo.name;
            return (
              <div
                key={i}
                className="flex flex-col overflow-hidden rounded-xl border border-theme bg-theme-card shadow-sm"
              >
                {/* Preview */}
                <div className="relative aspect-square overflow-hidden bg-theme-surface">
                  {photo.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl text-theme-muted">
                      📷
                    </div>
                  )}

                  {/* overlay دکمه‌ها */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 opacity-0 transition hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => handlePickImage(photo.name)}
                      disabled={isUploading}
                      className="rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-50"
                    >
                      {isUploading ? "..." : "📷 تغییر"}
                    </button>
                  </div>

                  {/* شماره ترتیب */}
                  <span className="absolute right-1.5 top-1.5 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                    #{i + 1}
                  </span>
                </div>

                {/* Info */}
                <div className="flex flex-col gap-2 p-2.5">
                  <input
                    value={photo.name}
                    onChange={(e) => updateName(i, e.target.value)}
                    placeholder="نام کلید"
                    dir="ltr"
                    className="w-full rounded-lg border border-theme bg-theme-surface px-2 py-1.5 font-mono text-[11px] text-theme outline-none transition placeholder:text-theme-muted focus:border-accent"
                  />

                  <div className="flex items-center justify-between gap-1">
                    {/* move buttons */}
                    <div className="flex gap-0.5">
                      <button
                        type="button"
                        onClick={() => move(i, -1)}
                        disabled={i === 0}
                        className="rounded px-1.5 py-1 text-xs text-theme-muted transition hover:bg-theme-surface hover:text-theme disabled:opacity-30"
                        aria-label="بالا"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => move(i, 1)}
                        disabled={i === items.length - 1}
                        className="rounded px-1.5 py-1 text-xs text-theme-muted transition hover:bg-theme-surface hover:text-theme disabled:opacity-30"
                        aria-label="پایین"
                      >
                        ↓
                      </button>
                    </div>

                    {/* delete */}
                    <button
                      type="button"
                      onClick={() => remove(i)}
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-[10px] font-bold text-red-500 transition hover:bg-red-500/20"
                      aria-label="حذف"
                    >
                      🗑 حذف
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}