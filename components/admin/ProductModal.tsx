"use client";

import { useEffect, useState } from "react";
import ImageUploader from "@/components/admin/ImageUploader";
import GalleryManager from "@/components/admin/GalleryManager";
import ColorManager, { type ColorItem } from "@/components/admin/ColorManager";
import SizeManager, { type SizeItem } from "@/components/admin/SizeManager";
import type { Category } from "@/data/products";

export type ProductFormData = {
  id: string;
  name: string;
  slug: string;
  englishName: string;
  price: string;
  oldPrice: string;
  category: Category;
  image: string;
  images: string[];
  rating: string;
  reviews: string;
  inStock: boolean;
  shortDesc: string;
  description: string;
  features: string;
  brand: string;
  colors: ColorItem[];
  sizes: SizeItem[];
};

// استایل اجباری برای همه inputها
const inputStyle: React.CSSProperties = {
  color: "#111827",
  backgroundColor: "#ffffff",
  WebkitTextFillColor: "#111827",
  caretColor: "#111827",
  colorScheme: "light",
};

const inputCls =
  "w-full rounded-lg border border-[#D4C5A0] px-4 py-2.5 text-sm outline-none focus:border-amber-500";

const inputLtrCls =
  "w-full rounded-lg border border-[#D4C5A0] px-4 py-2.5 font-mono text-left text-sm outline-none focus:border-amber-500";

export default function ProductModal({
  open,
  editingId,
  initialData,
  categories,
  saving,
  error,
  onClose,
  onSave,
}: {
  open: boolean;
  editingId: string | null;
  initialData: ProductFormData;
  categories: { key: string; label: string; emoji: string }[];
  saving: boolean;
  error: string;
  onClose: () => void;
  onSave: (data: ProductFormData) => void;
}) {
  const [form, setForm] = useState<ProductFormData>(initialData);

  useEffect(() => {
    if (open) setForm(initialData);
  }, [open, initialData]);

  function update<K extends keyof ProductFormData>(
    key: K,
    value: ProductFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      style={{ colorScheme: "light" }}
    >
      <div
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
        style={{ colorScheme: "light" }}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-black text-gray-900">
            {editingId ? "✏️ ویرایش محصول" : "➕ محصول جدید"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(form);
          }}
          className="space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-gray-700">
                ID *
              </label>
              <input
                type="text"
                value={form.id}
                onChange={(e) => update("id", e.target.value)}
                disabled={!!editingId}
                dir="ltr"
                autoComplete="off"
                style={inputStyle}
                className={inputLtrCls}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-gray-700">
                Slug *
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => update("slug", e.target.value)}
                dir="ltr"
                autoComplete="off"
                placeholder="tent-3person"
                style={inputStyle}
                className={inputLtrCls}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-gray-700">
                نام محصول (فارسی) *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="چادر کوهنوردی ۳ نفره"
                autoComplete="off"
                style={inputStyle}
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-gray-700">
                نام انگلیسی
              </label>
              <input
                type="text"
                value={form.englishName}
                onChange={(e) => update("englishName", e.target.value)}
                dir="ltr"
                autoComplete="off"
                style={inputStyle}
                className={inputLtrCls}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-gray-700">
                قیمت (تومان) *
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
                min="0"
                autoComplete="off"
                style={inputStyle}
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-gray-700">
                قیمت قبل از تخفیف
              </label>
              <input
                type="number"
                value={form.oldPrice}
                onChange={(e) => update("oldPrice", e.target.value)}
                min="0"
                autoComplete="off"
                placeholder="اختیاری"
                style={inputStyle}
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-gray-700">
                دسته‌بندی *
              </label>
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value as Category)}
                style={inputStyle}
                className={inputCls}
              >
                {categories.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.emoji} {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-gray-700">
                برند
              </label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => update("brand", e.target.value)}
                dir="ltr"
                autoComplete="off"
                placeholder="Naturehike"
                style={inputStyle}
                className={inputLtrCls}
              />
            </div>
          </div>

          <ImageUploader
            value={form.image}
            onChange={(url) => update("image", url)}
            label="آدرس تصویر اصلی *"
          />

          <GalleryManager
            images={form.images}
            onChange={(images) => update("images", images)}
          />

          <ColorManager
            colors={form.colors}
            onChange={(colors) => update("colors", colors)}
          />

          <SizeManager
            sizes={form.sizes}
            onChange={(sizes) => update("sizes", sizes)}
          />

          <div>
            <label className="mb-1.5 block text-sm font-bold text-gray-700">
              توضیح کوتاه
            </label>
            <input
              type="text"
              value={form.shortDesc}
              onChange={(e) => update("shortDesc", e.target.value)}
              autoComplete="off"
              style={inputStyle}
              className={inputCls}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-bold text-gray-700">
              توضیحات کامل
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              style={inputStyle}
              className={`${inputCls} resize-none`}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-bold text-gray-700">
              ویژگی‌ها (هر خط یکی)
            </label>
            <textarea
              rows={4}
              value={form.features}
              onChange={(e) => update("features", e.target.value)}
              placeholder="پارچه ضدآب ۵۰۰۰mm&#10;اسکلت آلومینیومی"
              style={inputStyle}
              className={`${inputCls} resize-none`}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-gray-700">
                امتیاز (۰-۵)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={form.rating}
                onChange={(e) => update("rating", e.target.value)}
                autoComplete="off"
                style={inputStyle}
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-gray-700">
                تعداد نظرات
              </label>
              <input
                type="number"
                min="0"
                value={form.reviews}
                onChange={(e) => update("reviews", e.target.value)}
                autoComplete="off"
                style={inputStyle}
                className={inputCls}
              />
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#D4C5A0] p-3">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) => update("inStock", e.target.checked)}
              className="h-4 w-4 accent-amber-500"
            />
            <span className="text-sm font-bold text-gray-700">
              محصول موجود است
            </span>
          </label>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">
              ⚠️ {error}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-[#E84C4C] py-3 text-sm font-bold text-white transition hover:bg-[#D63F3F] disabled:opacity-50"
            >
              {saving
                ? "در حال ذخیره..."
                : editingId
                ? "ذخیره تغییرات"
                : "افزودن محصول"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#D4C5A0] px-6 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}