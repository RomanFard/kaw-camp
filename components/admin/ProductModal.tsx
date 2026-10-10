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
  costPrice: string; // 🆕 قیمت خرید (برای محاسبه سود)
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

const inputCls =
  "w-full rounded-xl border border-theme bg-theme-surface px-3.5 py-2.5 text-xs text-theme placeholder:text-theme-muted outline-none focus:border-accent transition";

const inputLtrCls =
  "w-full rounded-xl border border-theme bg-theme-surface px-3.5 py-2.5 font-mono text-left text-xs text-theme placeholder:text-theme-muted outline-none focus:border-accent transition";

type TabType = "general" | "media" | "variants" | "details";

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
  const [activeTab, setActiveTab] = useState<TabType>("general");

  useEffect(() => {
    if (open) {
      setForm(initialData);
      setActiveTab("general");
    }
  }, [open, initialData]);

  function update<K extends keyof ProductFormData>(
    key: K,
    value: ProductFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  if (!open) return null;

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: "general", label: "اصلی و قیمت", icon: "⚙️" },
    { id: "media", label: "تصاویر", icon: "🖼️" },
    { id: "variants", label: "ویژگی و تنوع", icon: "🎨" },
    { id: "details", label: "توضیحات و امتیاز", icon: "📝" },
  ];

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-theme bg-theme-card text-theme shadow-2xl">
        {/* هدر مودال */}
        <div className="flex items-center justify-between border-b border-theme px-6 py-4">
          <h2 className="text-base font-black text-theme">
            {editingId ? "✏️ ویرایش محصول" : "➕ افزودن محصول جدید"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-theme-surface text-theme-muted transition hover:text-theme"
          >
            ✕
          </button>
        </div>

        {/* نوار تب‌ها */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-theme bg-theme-surface/50 px-4 py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                activeTab === tab.id
                  ? "bg-accent text-white shadow-sm"
                  : "text-theme-muted hover:bg-theme-surface hover:text-theme"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* بدنه فرم */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(form);
          }}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            {/* تب ۱: اطلاعات اصلی و قیمت */}
            {activeTab === "general" && (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                      شناسه (ID) *
                    </label>
                    <input
                      type="text"
                      value={form.id}
                      onChange={(e) => update("id", e.target.value)}
                      disabled={!!editingId}
                      dir="ltr"
                      className={`${inputLtrCls} disabled:opacity-50`}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                      شناسه یکتا (Slug) *
                    </label>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) => update("slug", e.target.value)}
                      dir="ltr"
                      placeholder="tent-3person"
                      className={inputLtrCls}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                      نام فارسی *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="چادر ۳ نفره کله گاوی"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                      نام انگلیسی
                    </label>
                    <input
                      type="text"
                      value={form.englishName}
                      onChange={(e) => update("englishName", e.target.value)}
                      dir="ltr"
                      className={inputLtrCls}
                    />
                  </div>
                </div>

                {/* قیمت‌ها */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                      قیمت اصلی (تومان) *
                    </label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => update("price", e.target.value)}
                      min="0"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                      قیمت قبل تخفیف (اختیاری)
                    </label>
                    <input
                      type="number"
                      value={form.oldPrice}
                      onChange={(e) => update("oldPrice", e.target.value)}
                      min="0"
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* 🆕 قیمت خرید */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                    💰 قیمت خرید (تومان) — اختیاری
                  </label>
                  <input
                    type="number"
                    value={form.costPrice}
                    onChange={(e) => update("costPrice", e.target.value)}
                    min="0"
                    placeholder="برای محاسبه سود واقعی در صفحه حسابداری"
                    className={inputCls}
                  />
                  <p className="mt-1 text-[10px] text-theme-muted">
                    💡 این مبلغ فقط برای شما نمایش داده می‌شه و روی سایت عمومی
                    دیده نمی‌شه
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                      دسته‌بندی *
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) =>
                        update("category", e.target.value as Category)
                      }
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
                    <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                      برند
                    </label>
                    <input
                      type="text"
                      value={form.brand}
                      onChange={(e) => update("brand", e.target.value)}
                      dir="ltr"
                      placeholder="Naturehike"
                      className={inputLtrCls}
                    />
                  </div>
                </div>

                <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-theme bg-theme-surface p-3 transition hover:border-accent">
                  <input
                    type="checkbox"
                    checked={form.inStock}
                    onChange={(e) => update("inStock", e.target.checked)}
                    className="h-4 w-4 accent-accent"
                  />
                  <span className="text-xs font-bold text-theme">
                    محصول در انبار موجود است
                  </span>
                </label>
              </div>
            )}

            {/* تب ۲: تصاویر و رسانه */}
            {activeTab === "media" && (
              <div className="space-y-5">
                <ImageUploader
                  value={form.image}
                  onChange={(url) => update("image", url)}
                  label="آدرس تصویر اصلی *"
                />
                <GalleryManager
                  images={form.images}
                  onChange={(images) => update("images", images)}
                />
              </div>
            )}

            {/* تب ۳: ویژگی‌ها، رنگ‌ها و سایزها */}
            {activeTab === "variants" && (
              <div className="space-y-5">
                <ColorManager
                  colors={form.colors}
                  onChange={(colors) => update("colors", colors)}
                />
                <SizeManager
                  sizes={form.sizes}
                  onChange={(sizes) => update("sizes", sizes)}
                />
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                    ویژگی‌های فنی (هر خط یک مورد)
                  </label>
                  <textarea
                    rows={4}
                    value={form.features}
                    onChange={(e) => update("features", e.target.value)}
                    placeholder="پارچه ضدآب ۵۰۰۰mm&#10;اسکلت آلومینیومی"
                    className={`${inputCls} resize-none`}
                  />
                </div>
              </div>
            )}

            {/* تب ۴: توضیحات و نظرات */}
            {activeTab === "details" && (
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                    توضیح کوتاه
                  </label>
                  <input
                    type="text"
                    value={form.shortDesc}
                    onChange={(e) => update("shortDesc", e.target.value)}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                    توضیحات کامل محصول
                  </label>
                  <textarea
                    rows={5}
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    className={`${inputCls} resize-none`}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                      امتیاز اولیه (۰ تا ۵)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={form.rating}
                      onChange={(e) => update("rating", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                      تعداد نظرات
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.reviews}
                      onChange={(e) => update("reviews", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-bold text-red-500">
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* فوتر ثابت دکمه‌ها */}
          <div className="flex items-center gap-2 border-t border-theme bg-theme-surface/50 p-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl bg-accent py-2.5 text-xs font-bold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
            >
              {saving
                ? "در حال ذخیره‌سازی..."
                : editingId
                ? "ذخیره تغییرات"
                : "افزودن محصول"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-theme bg-theme-card px-5 py-2.5 text-xs font-bold text-theme-muted transition hover:text-theme"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}