"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/context/ToastContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ImageUploader from "@/components/admin/ImageUploader";
import {
  getAllBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  type Brand,
} from "@/lib/supabase/brands";

type FormData = {
  name: string;
  logo: string;
  href: string;
  order_index: string;
  is_active: boolean;
};

const EMPTY_FORM: FormData = {
  name: "",
  logo: "",
  href: "",
  order_index: "0",
  is_active: true,
};

export default function BrandsPage() {
  const toast = useToast();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  async function load() {
    setLoading(true);
    const data = await getAllBrands();
    setBrands(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openAddModal() {
    const next =
      brands.length > 0
        ? Math.max(...brands.map((b) => b.order_index)) + 1
        : 0;
    setEditingId(null);
    setForm({ ...EMPTY_FORM, order_index: String(next) });
    setFormError("");
    setModalOpen(true);
  }

  function openEditModal(brand: Brand) {
    setEditingId(brand.id);
    setForm({
      name: brand.name,
      logo: brand.logo,
      href: brand.href,
      order_index: String(brand.order_index),
      is_active: brand.is_active,
    });
    setFormError("");
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!form.name.trim()) return setFormError("نام برند الزامی است");
    if (!form.logo.trim()) return setFormError("لوگو الزامی است");

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      logo: form.logo.trim(),
      href: form.href.trim(),
      order_index: Number(form.order_index) || 0,
      is_active: form.is_active,
    };

    const result = editingId
      ? await updateBrand(editingId, payload)
      : await createBrand(payload);

    if (result.error) {
      setFormError("خطا: " + result.error.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    setModalOpen(false);
    toast.success(editingId ? "برند ویرایش شد" : "برند اضافه شد");
    load();
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`حذف برند "${name}"؟`)) return;
    const { error } = await deleteBrand(id);
    if (error) return toast.error("خطا: " + error.message);
    toast.success("برند حذف شد");
    load();
  }

  async function handleToggle(brand: Brand) {
    const { error } = await updateBrand(brand.id, {
      ...brand,
      is_active: !brand.is_active,
    });
    if (error) return toast.error("خطا: " + error.message);
    setBrands((prev) =>
      prev.map((b) =>
        b.id === brand.id ? { ...b, is_active: !brand.is_active } : b
      )
    );
    toast.success(brand.is_active ? "غیرفعال شد" : "فعال شد");
  }

  async function moveUp(brand: Brand, idx: number) {
    if (idx === 0) return;
    const prev = brands[idx - 1];
    await Promise.all([
      updateBrand(brand.id, { ...brand, order_index: prev.order_index }),
      updateBrand(prev.id, { ...prev, order_index: brand.order_index }),
    ]);
    load();
  }

  async function moveDown(brand: Brand, idx: number) {
    if (idx === brands.length - 1) return;
    const next = brands[idx + 1];
    await Promise.all([
      updateBrand(brand.id, { ...brand, order_index: next.order_index }),
      updateBrand(next.id, { ...next, order_index: brand.order_index }),
    ]);
    load();
  }

  return (
    <div dir="rtl" className="flex min-h-screen bg-theme text-theme">
      {/* Backdrop موبایل */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
        />
      )}

      {/* سایدبار */}
      <AdminSidebar
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
      />

      {/* محتوای اصلی */}
      <main className="flex-1 overflow-x-hidden p-4 pb-12 sm:p-8">
        <div className="mx-auto max-w-7xl">
          {/* هدر */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
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
                  🏷️ مدیریت برندها
                </h1>
                <p className="mt-1 text-xs text-theme-muted">
                  {brands.length.toLocaleString("fa-IR")} برند ثبت شده
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="rounded-xl bg-accent px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:opacity-90"
            >
              ➕ برند جدید
            </button>
          </div>

          {/* لیست برندها */}
          {loading ? (
            <div className="rounded-2xl border border-theme bg-theme-card p-12 text-center text-xs text-theme-muted">
              در حال بارگذاری...
            </div>
          ) : brands.length === 0 ? (
            <div className="rounded-2xl border border-theme bg-theme-card p-12 text-center text-xs text-theme-muted">
              هنوز برندی ثبت نشده
            </div>
          ) : (
            <div className="space-y-3">
              {brands.map((brand, idx) => (
                <div
                  key={brand.id}
                  className="flex flex-wrap items-center gap-4 rounded-2xl border border-theme bg-theme-card p-4 shadow-sm transition hover:border-accent/50"
                >
                  {/* Logo */}
                  <div className="flex h-16 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-theme bg-theme-surface p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="min-w-[180px] flex-1">
                    <span className="text-[10px] font-black text-theme-muted">
                      #{idx + 1}
                    </span>
                    <p className="mt-0.5 text-sm font-black text-theme">
                      {brand.name}
                    </p>
                    {brand.href && (
                      <p
                        className="mt-0.5 text-[10px] text-theme-muted"
                        dir="ltr"
                      >
                        {brand.href}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-shrink-0 items-center gap-2">
                    <div className="flex flex-col">
                      <button
                        type="button"
                        onClick={() => moveUp(brand, idx)}
                        disabled={idx === 0}
                        className="text-xs text-theme-muted transition hover:text-theme disabled:opacity-30"
                        aria-label="بالا"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => moveDown(brand, idx)}
                        disabled={idx === brands.length - 1}
                        className="text-xs text-theme-muted transition hover:text-theme disabled:opacity-30"
                        aria-label="پایین"
                      >
                        ▼
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggle(brand)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
                        brand.is_active
                          ? "bg-green-500"
                          : "border border-theme bg-theme-surface"
                      }`}
                      aria-label="فعال/غیرفعال"
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${
                          brand.is_active
                            ? "translate-x-0.5"
                            : "translate-x-5"
                        }`}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditModal(brand)}
                      className="rounded-lg border border-theme bg-theme-surface px-2.5 py-1.5 font-bold text-theme transition hover:border-accent"
                      title="ویرایش"
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(brand.id, brand.name)}
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 font-bold text-red-500 transition hover:bg-red-500/20"
                      title="حذف"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ─── Modal ─── */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-theme bg-theme-card p-6 shadow-2xl">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-black text-theme">
                  {editingId ? "✏️ ویرایش برند" : "➕ برند جدید"}
                </h2>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-theme-surface text-theme-muted transition hover:text-theme"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                      نام برند *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="Columbia"
                      className="w-full rounded-xl border border-theme bg-theme-surface px-4 py-2.5 text-xs text-theme outline-none transition placeholder:text-theme-muted focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                      ترتیب
                    </label>
                    <input
                      type="number"
                      value={form.order_index}
                      onChange={(e) =>
                        setForm({ ...form, order_index: e.target.value })
                      }
                      className="w-full rounded-xl border border-theme bg-theme-surface px-4 py-2.5 text-xs text-theme outline-none transition focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                    لینک (اختیاری)
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={form.href}
                    onChange={(e) =>
                      setForm({ ...form, href: e.target.value })
                    }
                    placeholder="https://columbia.com"
                    className="w-full rounded-xl border border-theme bg-theme-surface px-4 py-2.5 text-left font-mono text-xs text-theme outline-none transition placeholder:text-theme-muted focus:border-accent"
                  />
                </div>

                <ImageUploader
                  value={form.logo}
                  onChange={(url) => setForm({ ...form, logo: url })}
                  label="لوگوی برند *"
                />

                <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-theme bg-theme-surface p-3 transition hover:border-accent">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) =>
                      setForm({ ...form, is_active: e.target.checked })
                    }
                    className="h-4 w-4 accent-accent"
                  />
                  <span className="text-xs font-bold text-theme">
                    برند فعال باشد
                  </span>
                </label>

                {formError && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-bold text-red-500">
                    ⚠️ {formError}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 rounded-xl bg-accent py-3 text-xs font-black text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
                  >
                    {saving
                      ? "در حال ذخیره..."
                      : editingId
                      ? "ذخیره تغییرات"
                      : "افزودن برند"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-xl border border-theme bg-theme-card px-6 py-3 text-xs font-bold text-theme-muted transition hover:text-theme"
                  >
                    انصراف
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}