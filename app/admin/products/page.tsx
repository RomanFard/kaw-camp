"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/components/context/ToastContext";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  generateNextProductId,
} from "@/lib/supabase/products";
import {
  products as seedProducts,
  categories,
  type Product,
  type Category,
} from "@/data/products";
import ImageUploader from "@/components/admin/ImageUploader";
import GalleryManager from "@/components/admin/GalleryManager";
import ColorManager, { type ColorItem } from "@/components/admin/ColorManager";
import SizeManager, { type SizeItem } from "@/components/admin/SizeManager";

// ─── فرم ───
type FormData = {
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

const EMPTY_FORM: FormData = {
  id: "",
  name: "",
  slug: "",
  englishName: "",
  price: "",
  oldPrice: "",
  category: "tent",
  image: "",
  images: [""],
  rating: "5",
  reviews: "0",
  inStock: true,
  shortDesc: "",
  description: "",
  features: "",
  brand: "",
  colors: [],
  sizes: [],
};

export default function ProductsAdminPage() {
  const supabase = createClient();
  const toast = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");

  // مودال
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // ─── لود ───
  async function load() {
    setLoading(true);
    const data = await getAllProducts();
    setProducts(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── فیلتر ───
  const filtered = products.filter((p) => {
    if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      (p.brand ?? "").toLowerCase().includes(q) ||
      p.id.includes(q)
    );
  });

  // ─── باز کردن مودال افزودن ───
  async function openAddModal() {
    const newId = await generateNextProductId();
    setEditingId(null);
    setForm({ ...EMPTY_FORM, id: newId });
    setFormError("");
    setModalOpen(true);
  }

  // ─── باز کردن مودال ویرایش ───
  function openEditModal(p: Product) {
    setEditingId(p.id);
    setForm({
      id: p.id,
      name: p.name,
      slug: p.slug,
      englishName: p.englishName ?? "",
      price: String(p.price),
      oldPrice: p.oldPrice ? String(p.oldPrice) : "",
      category: p.category,
      image: p.image,
      images: p.images && p.images.length > 0 ? p.images : [""],
      rating: String(p.rating),
      reviews: String(p.reviews),
      inStock: p.inStock,
      shortDesc: p.shortDesc,
      description: p.description,
      features: (p.features ?? []).join("\n"),
      brand: p.brand ?? "",
      colors: (p.colors ?? []).map((c) => ({
        label: c.label,
        value: c.value,
        image: c.image,
      })),
      sizes: (p.sizes ?? []).map((s) => ({
        label: s.label,
        value: s.value,
        image: s.image,
      })),
    });
    setFormError("");
    setModalOpen(true);
  }

  // ─── ذخیره ───
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    // اعتبارسنجی
    if (!form.name.trim()) return setFormError("نام محصول الزامی است");
    if (!form.slug.trim()) return setFormError("slug الزامی است");
    if (!form.price.trim() || Number(form.price) <= 0)
      return setFormError("قیمت باید بزرگتر از صفر باشد");
    if (!form.image.trim()) return setFormError("عکس اصلی الزامی است");

    // اعتبارسنجی رنگ‌ها
    const invalidColor = form.colors.find((c) => !c.label.trim());
    if (invalidColor) return setFormError("همه رنگ‌ها باید نام داشته باشن");

    // اعتبارسنجی سایزها
    const invalidSize = form.sizes.find((s) => !s.label.trim());
    if (invalidSize) return setFormError("همه سایزها باید نام داشته باشن");

    setSaving(true);

    // آماده‌سازی عکس‌های گالری (حذف خالی‌ها)
    const cleanImages = form.images
      .map((s) => s.trim())
      .filter(Boolean);

    const productData: Product = {
      id: form.id,
      name: form.name.trim(),
      slug: form.slug.trim(),
      englishName: form.englishName.trim() || undefined,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      category: form.category,
      image: form.image.trim(),
      images: cleanImages.length > 0 ? cleanImages : undefined,
      rating: Number(form.rating) || 0,
      reviews: Number(form.reviews) || 0,
      inStock: form.inStock,
      shortDesc: form.shortDesc.trim(),
      description: form.description.trim(),
      features: form.features
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      brand: form.brand.trim() || undefined,
      colors: form.colors.length > 0 ? form.colors : undefined,
      sizes: form.sizes.length > 0 ? form.sizes : undefined,
    };

    let result;
    if (editingId) {
      result = await updateProduct(editingId, productData);
    } else {
      result = await createProduct(productData);
    }

    if (result.error) {
      if (result.error.message.includes("duplicate")) {
        setFormError("این slug یا ID قبلاً استفاده شده");
      } else {
        setFormError("خطا: " + result.error.message);
      }
      setSaving(false);
      return;
    }

    setSaving(false);
    setModalOpen(false);
    toast.success(editingId ? "محصول ویرایش شد" : "محصول اضافه شد");
    load();
  }

  // ─── حذف ───
  async function handleDelete(id: string, name: string) {
    if (!confirm(`آیا از حذف محصول "${name}" مطمئنی؟`)) return;

    const { error } = await deleteProduct(id);
    if (error) {
      toast.error("خطا: " + error.message);
      return;
    }
    toast.success(`محصول «${name}» حذف شد`);
    load();
  }

  // ─── Toggle موجودی ───
  async function handleToggleStock(p: Product) {
    const updated = { ...p, inStock: !p.inStock };
    const { error } = await updateProduct(p.id, updated);
    if (error) {
      toast.error("خطا: " + error.message);
      return;
    }
    setProducts((prev) =>
      prev.map((x) => (x.id === p.id ? { ...x, inStock: !p.inStock } : x))
    );
    toast.success(p.inStock ? "محصول ناموجود شد" : "محصول موجود شد");
  }

  // ─── ریست به داده‌های اولیه ───
  async function handleReset() {
    if (
      !confirm(
        `آیا مطمئنی؟ این کار همه محصولات Supabase رو پاک می‌کنه و ${seedProducts.length} محصول اولیه رو برمی‌گردونه.`
      )
    )
      return;

    setLoading(true);

    const { error: delErr } = await supabase
      .from("products")
      .delete()
      .neq("id", "___never___");

    if (delErr) {
      toast.error("خطا در حذف: " + delErr.message);
      setLoading(false);
      return;
    }

    const { error: insErr } = await supabase.from("products").insert(
      seedProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        old_price: p.oldPrice ?? null,
        category: p.category,
        image: p.image,
        images: p.images ?? null,
        rating: p.rating,
        reviews: p.reviews,
        in_stock: p.inStock,
        short_desc: p.shortDesc,
        description: p.description,
        features: p.features ?? [],
        brand: p.brand ?? null,
        english_name: p.englishName ?? null,
        colors: p.colors ?? null,
        sizes: p.sizes ?? null,
      }))
    );

    if (insErr) {
      toast.error("خطا در درج: " + insErr.message);
      setLoading(false);
      return;
    }

    toast.success("بازنشانی موفق!");
    load();
  }

  const stats = {
    total: products.length,
    inStock: products.filter((p) => p.inStock).length,
    discounted: products.filter((p) => p.oldPrice).length,
    outOfStock: products.filter((p) => !p.inStock).length,
  };

  return (
    <main className="min-h-screen bg-[#F7F1E3]">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <a
              href="/admin"
              className="text-sm text-gray-500 hover:text-amber-600"
            >
              ← بازگشت به داشبورد
            </a>
            <h1 className="mt-2 text-3xl font-black text-gray-900">
              📦 مدیریت محصولات
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {stats.total.toLocaleString("fa-IR")} محصول •{" "}
              {stats.inStock.toLocaleString("fa-IR")} موجود
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg border border-[#D4C5A0] bg-white px-4 py-2.5 text-xs font-bold text-gray-600 transition hover:bg-gray-50"
            >
              🔄 بازنشانی به اولیه
            </button>
            <button
              type="button"
              onClick={openAddModal}
              className="rounded-lg bg-[#E89070] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#D77E5E]"
            >
              ➕ محصول جدید
            </button>
          </div>
        </div>

        {/* آمار */}
        <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="کل" value={stats.total} icon="📦" />
          <StatCard label="موجود" value={stats.inStock} icon="✅" green />
          <StatCard label="تخفیف‌دار" value={stats.discounted} icon="🏷️" />
          <StatCard label="ناموجود" value={stats.outOfStock} icon="⛔" red />
        </div>

        {/* فیلترها */}
        <div className="mb-4 flex flex-wrap gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 جستجو در نام، slug، برند، ID..."
            className="min-w-[240px] flex-1 rounded-lg border border-[#D4C5A0] bg-white px-4 py-2.5 text-sm outline-none focus:border-amber-500"
          />
          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value as Category | "all")
            }
            className="rounded-lg border border-[#D4C5A0] bg-white px-4 py-2.5 text-sm outline-none focus:border-amber-500"
          >
            <option value="all">همه دسته‌ها</option>
            {categories.map((c) => (
              <option key={c.key} value={c.key}>
                {c.emoji} {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* جدول */}
        <div className="overflow-hidden rounded-2xl border border-[#D4C5A0] bg-white">
          {loading ? (
            <div className="p-12 text-center text-gray-500">
              در حال بارگذاری...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              محصولی با این فیلتر پیدا نشد
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="border-b border-[#EDE4CE] bg-[#F7F1E3]/50">
                  <tr className="text-xs font-bold text-gray-600">
                    <th className="px-3 py-3">عکس</th>
                    <th className="px-3 py-3">ID</th>
                    <th className="px-3 py-3">نام</th>
                    <th className="px-3 py-3">دسته</th>
                    <th className="px-3 py-3">قیمت</th>
                    <th className="px-3 py-3">موجودی</th>
                    <th className="px-3 py-3 text-left">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => {
                    const cat = categories.find((c) => c.key === p.category);
                    return (
                      <tr
                        key={p.id}
                        className="border-b border-[#EDE4CE] last:border-0 transition hover:bg-[#F7F1E3]/30"
                      >
                        <td className="px-3 py-2">
                          <div className="h-12 w-12 overflow-hidden rounded-lg border border-[#EDE4CE] bg-gray-50">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={p.image}
                              alt={p.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-3 py-2 font-mono text-xs text-gray-500">
                          {p.id}
                        </td>
                        <td className="px-3 py-2">
                          <div className="line-clamp-1 max-w-[280px] font-bold text-gray-900">
                            {p.name}
                          </div>
                          {p.brand && (
                            <div className="mt-0.5 text-[11px] text-gray-400">
                              {p.brand}
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-2 text-xs">
                          {cat ? `${cat.emoji} ${cat.label}` : p.category}
                        </td>
                        <td className="px-3 py-2">
                          <div className="font-bold text-gray-900">
                            {formatPrice(p.price)}
                          </div>
                          {p.oldPrice && (
                            <div className="text-[11px] text-gray-400 line-through">
                              {formatPrice(p.oldPrice)}
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          <button
                            type="button"
                            onClick={() => handleToggleStock(p)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                              p.inStock ? "bg-green-500" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                                p.inStock ? "translate-x-1" : "translate-x-6"
                              }`}
                            />
                          </button>
                        </td>
                        <td className="px-3 py-2 text-left">
                          <div className="flex justify-end gap-2">
                            <a
                              href={`/product/${p.id}`}
                              target="_blank"
                              className="rounded-lg border border-blue-300 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                            >
                              👁
                            </a>
                            <button
                              type="button"
                              onClick={() => openEditModal(p)}
                              className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 transition hover:bg-amber-100"
                            >
                              ✏️
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(p.id, p.name)}
                              className="rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-100"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ─── مودال ─── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-black text-gray-900">
                {editingId ? "✏️ ویرایش محصول" : "➕ محصول جدید"}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* ID + slug */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-700">
                    ID *
                  </label>
                  <input
                    type="text"
                    value={form.id}
                    onChange={(e) => setForm({ ...form, id: e.target.value })}
                    disabled={!!editingId}
                    dir="ltr"
                    className="w-full rounded-lg border border-[#D4C5A0] px-4 py-2.5 font-mono text-left text-sm outline-none focus:border-amber-500 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-700">
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    dir="ltr"
                    placeholder="tent-3person"
                    className="w-full rounded-lg border border-[#D4C5A0] px-4 py-2.5 font-mono text-left text-sm outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* نام + نام انگلیسی */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-700">
                    نام محصول (فارسی) *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="چادر کوهنوردی ۳ نفره"
                    className="w-full rounded-lg border border-[#D4C5A0] px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-700">
                    نام انگلیسی
                  </label>
                  <input
                    type="text"
                    value={form.englishName}
                    onChange={(e) =>
                      setForm({ ...form, englishName: e.target.value })
                    }
                    dir="ltr"
                    className="w-full rounded-lg border border-[#D4C5A0] px-4 py-2.5 text-left text-sm outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* قیمت + تخفیف */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-700">
                    قیمت (تومان) *
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    min="0"
                    className="w-full rounded-lg border border-[#D4C5A0] px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-700">
                    قیمت قبل از تخفیف
                  </label>
                  <input
                    type="number"
                    value={form.oldPrice}
                    onChange={(e) =>
                      setForm({ ...form, oldPrice: e.target.value })
                    }
                    min="0"
                    placeholder="اختیاری"
                    className="w-full rounded-lg border border-[#D4C5A0] px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* دسته + برند */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-700">
                    دسته‌بندی *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value as Category })
                    }
                    className="w-full rounded-lg border border-[#D4C5A0] bg-white px-4 py-2.5 text-sm outline-none focus:border-amber-500"
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
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    dir="ltr"
                    placeholder="Naturehike"
                    className="w-full rounded-lg border border-[#D4C5A0] px-4 py-2.5 text-left text-sm outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* عکس اصلی */}
              <ImageUploader
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
                label="آدرس تصویر اصلی *"
              />

              {/* گالری */}
              <GalleryManager
                images={form.images}
                onChange={(images) => setForm({ ...form, images })}
              />

              {/* رنگ‌بندی */}
              <ColorManager
                colors={form.colors}
                onChange={(colors) => setForm({ ...form, colors })}
              />

              {/* سایزبندی */}
              <SizeManager
                sizes={form.sizes}
                onChange={(sizes) => setForm({ ...form, sizes })}
              />

              {/* توضیح کوتاه */}
              <div>
                <label className="mb-1.5 block text-sm font-bold text-gray-700">
                  توضیح کوتاه
                </label>
                <input
                  type="text"
                  value={form.shortDesc}
                  onChange={(e) =>
                    setForm({ ...form, shortDesc: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#D4C5A0] px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                />
              </div>

              {/* توضیحات کامل */}
              <div>
                <label className="mb-1.5 block text-sm font-bold text-gray-700">
                  توضیحات کامل
                </label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full resize-none rounded-lg border border-[#D4C5A0] px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                />
              </div>

              {/* ویژگی‌ها */}
              <div>
                <label className="mb-1.5 block text-sm font-bold text-gray-700">
                  ویژگی‌ها (هر خط یکی)
                </label>
                <textarea
                  rows={4}
                  value={form.features}
                  onChange={(e) =>
                    setForm({ ...form, features: e.target.value })
                  }
                  placeholder="پارچه ضدآب ۵۰۰۰mm&#10;اسکلت آلومینیومی"
                  className="w-full resize-none rounded-lg border border-[#D4C5A0] px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                />
              </div>

              {/* امتیاز + نظرات */}
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
                    onChange={(e) =>
                      setForm({ ...form, rating: e.target.value })
                    }
                    className="w-full rounded-lg border border-[#D4C5A0] px-4 py-2.5 text-sm outline-none focus:border-amber-500"
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
                    onChange={(e) =>
                      setForm({ ...form, reviews: e.target.value })
                    }
                    className="w-full rounded-lg border border-[#D4C5A0] px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* موجودی */}
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#D4C5A0] p-3">
                <input
                  type="checkbox"
                  checked={form.inStock}
                  onChange={(e) =>
                    setForm({ ...form, inStock: e.target.checked })
                  }
                  className="h-4 w-4 accent-amber-500"
                />
                <span className="text-sm font-bold text-gray-700">
                  محصول موجود است
                </span>
              </label>

              {/* خطا */}
              {formError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">
                  ⚠️ {formError}
                </div>
              )}

              {/* دکمه‌ها */}
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-lg bg-[#E89070] py-3 text-sm font-bold text-white transition hover:bg-[#D77E5E] disabled:opacity-50"
                >
                  {saving
                    ? "در حال ذخیره..."
                    : editingId
                    ? "ذخیره تغییرات"
                    : "افزودن محصول"}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-[#D4C5A0] px-6 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
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

// ─── کامپوننت آماری ───
function StatCard({
  label,
  value,
  icon,
  green,
  red,
}: {
  label: string;
  value: number;
  icon: string;
  green?: boolean;
  red?: boolean;
}) {
  const color = green
    ? "text-green-700"
    : red
    ? "text-red-600"
    : "text-gray-900";
  return (
    <div className="rounded-xl border border-[#D4C5A0] bg-white p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500">{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <div className={`mt-1 text-2xl font-black ${color}`}>
        {value.toLocaleString("fa-IR")}
      </div>
    </div>
  );
}