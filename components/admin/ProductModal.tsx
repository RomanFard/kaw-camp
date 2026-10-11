"use client";

import { useEffect, useRef, useState } from "react";
import ImageUploader from "@/components/admin/ImageUploader";
import GalleryManager from "@/components/admin/GalleryManager";
import ColorManager, { type ColorItem } from "@/components/admin/ColorManager";
import SizeManager, { type SizeItem } from "@/components/admin/SizeManager";
import SpecsManager, { type ProductSpec } from "@/components/admin/SpecsManager";
import AttributesPicker from "@/components/admin/AttributesPicker";
import type { Category } from "@/data/products";
import type { Brand } from "@/lib/supabase/brands";
import type { Attribute } from "@/lib/supabase/attributes";

export type ProductFormData = {
  id: string;
  name: string;
  slug: string;
  englishName: string;
  price: string;
  oldPrice: string;
  costPrice: string;
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
  specs?: ProductSpec[];
};

const inputCls =
  "w-full rounded-xl border border-theme bg-theme-surface px-3.5 py-2.5 text-xs text-theme placeholder:text-theme-muted outline-none focus:border-accent transition";

const inputLtrCls =
  "w-full rounded-xl border border-theme bg-theme-surface px-3.5 py-2.5 font-mono text-left text-xs text-theme placeholder:text-theme-muted outline-none focus:border-accent transition";

type TabType = "general" | "media" | "specs" | "variants" | "details";

/* ═══════════════════════════════════════════
   BrandCombobox — dropdown سفارشی
   ═══════════════════════════════════════════ */
function BrandCombobox({
  value,
  onChange,
  brands,
  inputCls: cls,
}: {
  value: string;
  onChange: (v: string) => void;
  brands: Brand[];
  inputCls: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", onClickOutside);
      return () => document.removeEventListener("mousedown", onClickOutside);
    }
  }, [open]);

  const activeBrands = brands.filter((b) => b.is_active);

  const filtered = query.trim()
    ? activeBrands.filter((b) =>
        b.name.toLowerCase().includes(query.toLowerCase())
      )
    : activeBrands;

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            setQuery("");
            setOpen(true);
          }}
          dir="ltr"
          placeholder="Naturehike"
          className={`${cls} pl-9`}
        />
        <button
          type="button"
          onClick={() => {
            setQuery("");
            setOpen((s) => !s);
          }}
          className="absolute left-1 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-theme-muted transition hover:bg-theme-card hover:text-theme"
          aria-label="نمایش لیست برندها"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className={`h-3.5 w-3.5 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </button>
      </div>

      {open && (
        <div className="absolute z-30 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-theme bg-theme-card p-1 shadow-2xl">
          {filtered.length === 0 && !query.trim() && (
            <div className="px-3 py-3 text-center text-[11px] text-theme-muted">
              برندی ثبت نشده —{" "}
              <a
                href="/admin/brands"
                target="_blank"
                className="text-accent underline"
              >
                افزودن برند
              </a>
            </div>
          )}

          {filtered.length === 0 && query.trim() && (
            <button
              type="button"
              onClick={() => {
                onChange(query.trim());
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-right text-xs text-theme transition hover:bg-theme-surface"
            >
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                ➕
              </span>
              <span>
                استفاده از «<span className="font-bold">{query}</span>» به‌عنوان
                برند جدید
              </span>
            </button>
          )}

          {filtered.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => {
                onChange(b.name);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-right transition hover:bg-theme-surface ${
                value === b.name ? "bg-accent/10" : ""
              }`}
            >
              <span className="flex h-8 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-md border border-theme bg-theme-surface p-0.5">
                {b.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={b.logo}
                    alt={b.name}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-[9px] text-theme-muted">—</span>
                )}
              </span>
              <span className="flex-1 text-xs font-bold text-theme">
                {b.name}
              </span>
              {value === b.name && (
                <span className="text-xs text-accent">✓</span>
              )}
            </button>
          ))}

          <div className="mt-1 border-t border-theme pt-1">
            <a
              href="/admin/brands"
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-right text-[11px] text-theme-muted transition hover:bg-theme-surface hover:text-theme"
            >
              <span>⚙️</span>
              <span>مدیریت برندها</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductModal({
  open,
  editingId,
  initialData,
  categories,
  brands = [],
  attributes = [],
  saving,
  error,
  onClose,
  onSave,
}: {
  open: boolean;
  editingId: string | null;
  initialData: ProductFormData;
  categories: { key: string; label: string; emoji: string }[];
  brands?: Brand[];
  attributes?: Attribute[];
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
    { id: "specs", label: "مشخصات فنی", icon: "📐" },
    { id: "variants", label: "ویژگی و تنوع", icon: "🎨" },
    { id: "details", label: "توضیحات و امتیاز", icon: "📝" },
  ];

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-theme bg-theme-card text-theme shadow-2xl">
        {/* هدر */}
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

        {/* تب‌ها */}
        <div className="border-b border-theme bg-theme-surface/50">
          <div className="flex items-center gap-2 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition ${
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
        </div>

        {/* بدنه */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(form);
          }}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
            {/* تب ۱ */}
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
                      {brands.filter((b) => b.is_active).length > 0 && (
                        <span className="ml-1 text-[10px] font-normal">
                          (
                          {brands
                            .filter((b) => b.is_active)
                            .length.toLocaleString("fa-IR")}{" "}
                          برند موجود)
                        </span>
                      )}
                    </label>
                    <BrandCombobox
                      value={form.brand}
                      onChange={(v) => update("brand", v)}
                      brands={brands}
                      inputCls={inputLtrCls}
                    />
                    <p className="mt-1 text-[10px] text-theme-muted">
                      💡 روی فلش ▾ بزن تا لیست برندها رو ببینی
                    </p>
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

            {/* تب ۲ */}
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

            {/* 🆕 تب ۳ — مشخصات فنی */}
            {activeTab === "specs" && (
              <div className="space-y-5">
                <AttributesPicker
                  attributes={attributes}
                  specs={form.specs ?? []}
                  onChange={(specs) => update("specs", specs)}
                  category={form.category}
                />

                <SpecsManager
                  specs={form.specs ?? []}
                  onChange={(specs) => update("specs", specs)}
                />
              </div>
            )}

            {/* تب ۴ */}
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

            {/* تب ۵ */}
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

          {/* فوتر */}
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