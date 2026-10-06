"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/context/ToastContext";
import ImageUploader from "@/components/admin/ImageUploader";
import { categories } from "@/data/products";
import {
  getAllCategoryPhotos,
  upsertCategoryPhoto,
  deleteCategoryPhoto,
  type CategoryPhoto,
} from "@/lib/supabase/categoryPhotos";

export default function CategoriesPage() {
  const toast = useToast();
  const [photos, setPhotos] = useState<CategoryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  async function load() {
    setLoading(true);
    const data = await getAllCategoryPhotos();
    setPhotos(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getPhotoForCategory(key: string) {
    return photos.find((p) => p.category_key === key);
  }

  function openModal(categoryKey: string) {
    const existing = getPhotoForCategory(categoryKey);
    setEditingKey(categoryKey);
    setPhotoUrl(existing?.photo || "");
    setIsActive(existing?.is_active ?? true);
    setFormError("");
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editingKey) return;
    if (!photoUrl.trim()) return setFormError("تصویر الزامی است");

    setSaving(true);
    const catIndex = categories.findIndex((c) => c.key === editingKey);

    const { error } = await upsertCategoryPhoto({
      category_key: editingKey,
      photo: photoUrl.trim(),
      order_index: catIndex,
      is_active: isActive,
    });

    if (error) {
      setFormError("خطا: " + error.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    setModalOpen(false);
    toast.success("تصویر ذخیره شد");
    load();
  }

  async function handleDelete(categoryKey: string) {
    const existing = getPhotoForCategory(categoryKey);
    if (!existing) return;
    if (!confirm("حذف تصویر این دسته‌بندی؟")) return;
    const { error } = await deleteCategoryPhoto(existing.id);
    if (error) return toast.error("خطا: " + error.message);
    toast.success("تصویر حذف شد");
    load();
  }

  const editingCategory = categories.find((c) => c.key === editingKey);

  return (
    <main className="min-h-screen bg-[#050505]">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <a
            href="/admin"
            className="text-sm text-zinc-500 hover:text-[#E84C4C]"
          >
            ← بازگشت به داشبورد
          </a>
          <h1 className="mt-2 text-3xl font-black text-white">
            🖼️ مدیریت تصاویر دسته‌بندی
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            تصاویر این بخش در گرید «دسته‌بندی‌های محبوب» صفحه اصلی نمایش داده
            می‌شوند
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="rounded-2xl border border-zinc-800 bg-[#0A0A0A] p-12 text-center text-zinc-500">
            در حال بارگذاری...
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat) => {
              const photo = getPhotoForCategory(cat.key);
              return (
                <div
                  key={cat.key}
                  className="group overflow-hidden rounded-2xl border border-zinc-800 bg-[#0A0A0A]"
                >
                  {/* Photo */}
                  <div className="relative aspect-square overflow-hidden bg-zinc-950">
                    {photo?.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photo.photo}
                        alt={cat.label}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-zinc-600">
                        <span className="text-4xl">{cat.emoji}</span>
                        <span className="text-[10px]">بدون تصویر</span>
                      </div>
                    )}

                    {!photo?.is_active && photo && (
                      <span className="absolute right-2 top-2 rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-black text-zinc-400">
                        غیرفعال
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <p className="text-sm font-black text-white">
                      {cat.label}
                    </p>
                    <p className="mt-0.5 text-[10px] text-zinc-500" dir="ltr">
                      {cat.key}
                    </p>

                    <div className="mt-3 flex gap-1.5">
                      <button
                        onClick={() => openModal(cat.key)}
                        className="flex-1 rounded-lg border border-[#E84C4C]/40 bg-[#E84C4C]/10 px-2 py-1.5 text-[11px] font-bold text-[#E84C4C] transition hover:bg-[#E84C4C] hover:text-white"
                      >
                        {photo ? "✏️ ویرایش" : "➕ افزودن"}
                      </button>
                      {photo && (
                        <button
                          onClick={() => handleDelete(cat.key)}
                          className="rounded-lg border border-red-500/40 bg-red-500/10 px-2 py-1.5 text-[11px] font-bold text-red-500 transition hover:bg-red-500 hover:text-white"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#0A0A0A] p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white">
                  {editingCategory.emoji} {editingCategory.label}
                </h2>
                <p className="mt-0.5 text-xs text-zinc-500">
                  {getPhotoForCategory(editingKey!) ? "ویرایش تصویر" : "افزودن تصویر"}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <ImageUploader
                value={photoUrl}
                onChange={setPhotoUrl}
                label="تصویر دسته‌بندی *"
              />

              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-800 p-3">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 accent-[#E84C4C]"
                />
                <span className="text-sm font-bold text-white">
                  نمایش در صفحه اصلی
                </span>
              </label>

              {formError && (
                <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm font-bold text-red-500">
                  ⚠️ {formError}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-lg bg-[#E84C4C] py-3 text-sm font-black text-white transition hover:bg-[#D63F3F] disabled:opacity-50"
                >
                  {saving ? "در حال ذخیره..." : "ذخیره"}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-zinc-800 px-6 py-3 text-sm font-bold text-zinc-400 transition hover:bg-zinc-900"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

