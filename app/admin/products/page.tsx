"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ProductModal, { type ProductFormData } from "@/components/admin/ProductModal";
import AdminSidebar from "@/components/admin/AdminSidebar";
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

const EMPTY_FORM: ProductFormData = {
  id: "",
  name: "",
  slug: "",
  englishName: "",
  price: "",
  oldPrice: "",
  costPrice: "",   // 🆕
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

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // 🆕 state برای منوی موبایل
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  async function openAddModal() {
    const newId = await generateNextProductId();
    setEditingId(null);
    setFormData({ ...EMPTY_FORM, id: newId });
    setFormError("");
    setModalOpen(true);
  }

  function openEditModal(p: Product) {
    setEditingId(p.id);
    setFormData({
      id: p.id,
      name: p.name,
      slug: p.slug,
      englishName: p.englishName ?? "",
      price: String(p.price),
      oldPrice: p.oldPrice ? String(p.oldPrice) : "",
      costPrice: (p as any).costPrice ? String((p as any).costPrice) : "",   // 🆕
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

  async function handleSave(form: ProductFormData) {
    setFormError("");

    if (!form.name.trim()) return setFormError("نام محصول الزامی است");
    if (!form.slug.trim()) return setFormError("slug الزامی است");
    if (!form.price.trim() || Number(form.price) <= 0)
      return setFormError("قیمت باید بزرگتر از صفر باشد");
    if (!form.image.trim()) return setFormError("عکس اصلی الزامی است");

    setSaving(true);
    const cleanImages = form.images.map((s) => s.trim()).filter(Boolean);

    const productData: Product = {
      id: form.id,
      name: form.name.trim(),
      slug: form.slug.trim(),
      englishName: form.englishName.trim() || undefined,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      costPrice: form.costPrice ? Number(form.costPrice) : 0,   // 🆕
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
      setFormError("خطا: " + result.error.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    setModalOpen(false);
    toast.success(editingId ? "محصول ویرایش شد" : "محصول اضافه شد");
    load();
  }

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

  async function handleReset() {
    if (!confirm("آیا مطمئنی؟ محصولات اولیه جایگزین می‌شوند.")) return;

    setLoading(true);
    await supabase.from("products").delete().neq("id", "___never___");
    await supabase.from("products").insert(
      seedProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        old_price: p.oldPrice ?? null,
        cost_price: 0,
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
    <div dir="rtl" className="flex min-h-screen bg-theme text-theme">
      {/* Backdrop موبایل */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
        />
      )}

      {/* سایدبار مشترک */}
      <AdminSidebar
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
      />

      {/* محتوای اصلی */}
      <main className="flex-1 overflow-x-hidden p-4 pb-12 sm:p-8">
        <div className="mx-auto max-w-7xl">
          {/* هدر بالای صفحه */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              {/* دکمه منو موبایل */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-theme bg-theme-card text-theme transition hover:bg-theme-surface md:hidden"
                aria-label="باز کردن منو"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                  />
                </svg>
              </button>

              <div>
                <h1 className="text-2xl font-black text-theme">
                  📦 مدیریت محصولات
                </h1>
                <p className="text-xs text-theme-muted">
                  {stats.total.toLocaleString("fa-IR")} محصول کل •{" "}
                  {stats.inStock.toLocaleString("fa-IR")} موجود
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-xl border border-theme bg-theme-card px-4 py-2.5 text-xs font-bold text-theme-muted transition hover:text-theme"
              >
                🔄 بازنشانی داده‌ها
              </button>
              <button
                type="button"
                onClick={openAddModal}
                className="rounded-xl bg-accent px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:opacity-90"
              >
                ➕ محصول جدید
              </button>
            </div>
          </div>

          {/* کارت‌های آماری */}
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="کل محصولات" value={stats.total} icon="📦" />
            <StatCard label="موجود در انبار" value={stats.inStock} icon="✅" />
            <StatCard label="تخفیف‌دار" value={stats.discounted} icon="🏷️" />
            <StatCard label="ناموجود" value={stats.outOfStock} icon="⛔" />
          </div>

          {/* نوار ابزار جستجو و فیلتر */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 جستجو در نام، برند، شناسه..."
              className="flex-1 rounded-xl border border-theme bg-theme-card px-4 py-2.5 text-xs text-theme outline-none transition placeholder:text-theme-muted focus:border-accent"
            />
            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value as Category | "all")
              }
              className="rounded-xl border border-theme bg-theme-card px-4 py-2.5 text-xs text-theme outline-none transition focus:border-accent"
            >
              <option value="all">همه دسته‌بندی‌ها</option>
              {categories.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.emoji} {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* جدول محصولات */}
          <div className="overflow-hidden rounded-2xl border border-theme bg-theme-card shadow-sm">
            {loading ? (
              <div className="p-12 text-center text-xs text-theme-muted">
                در حال بارگذاری محصولات...
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-xs text-theme-muted">
                محصولی با این مشخصات یافت نشد
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="border-b border-theme bg-theme-surface font-bold text-theme-muted">
                    <tr>
                      <th className="px-4 py-3">تصویر</th>
                      <th className="px-4 py-3">شناسه</th>
                      <th className="px-4 py-3">نام محصول</th>
                      <th className="px-4 py-3">دسته‌بندی</th>
                      <th className="px-4 py-3">قیمت</th>
                      <th className="px-4 py-3">وضعیت موجودی</th>
                      <th className="px-4 py-3 text-left">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-theme">
                    {filtered.map((p) => {
                      const cat = categories.find(
                        (c) => c.key === p.category
                      );
                      return (
                        <tr
                          key={p.id}
                          className="transition hover:bg-theme-surface/40"
                        >
                          <td className="px-4 py-2.5">
                            <div className="h-10 w-10 overflow-hidden rounded-xl border border-theme bg-theme-surface">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={p.image}
                                alt={p.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-2.5 font-mono text-[11px] text-theme-muted">
                            {p.id}
                          </td>
                          <td className="px-4 py-2.5">
                            <p className="line-clamp-1 font-bold text-theme">
                              {p.name}
                            </p>
                            {p.brand && (
                              <p className="text-[10px] text-theme-muted">
                                {p.brand}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-2.5 text-theme-muted">
                            {cat ? `${cat.emoji} ${cat.label}` : p.category}
                          </td>
                          <td className="px-4 py-2.5">
                            <p className="font-bold text-theme">
                              {formatPrice(p.price)}
                            </p>
                            {p.oldPrice && (
                              <p className="text-[10px] text-theme-muted line-through">
                                {formatPrice(p.oldPrice)}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-2.5">
                            <button
                              type="button"
                              onClick={() => handleToggleStock(p)}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
                                p.inStock
                                  ? "bg-green-500"
                                  : "border border-theme bg-theme-surface"
                              }`}
                            >
                              <span
                                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${
                                  p.inStock
                                    ? "translate-x-0.5"
                                    : "translate-x-5"
                                }`}
                              />
                            </button>
                          </td>
                          <td className="px-4 py-2.5 text-left">
                            <div className="flex justify-end gap-1.5">
                              <a
                                href={`/product/${p.id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-lg border border-theme bg-theme-surface px-2.5 py-1.5 font-bold text-theme transition hover:border-accent"
                                title="مشاهده"
                              >
                                👁
                              </a>
                              <button
                                type="button"
                                onClick={() => openEditModal(p)}
                                className="rounded-lg border border-theme bg-theme-surface px-2.5 py-1.5 font-bold text-theme transition hover:border-accent"
                                title="ویرایش"
                              >
                                ✏️
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(p.id, p.name)}
                                className="rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 font-bold text-red-500 transition hover:bg-red-500/20"
                                title="حذف"
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

        <ProductModal
          open={modalOpen}
          editingId={editingId}
          initialData={formData}
          categories={categories}
          saving={saving}
          error={formError}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-theme bg-theme-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-theme-muted">{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <div className="mt-2 text-xl font-black text-theme">
        {value.toLocaleString("fa-IR")}
      </div>
    </div>
  );
}