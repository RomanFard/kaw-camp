"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/context/ToastContext";
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
    <main className="min-h-screen bg-theme">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <a
              href="/admin"
              className="text-sm text-zinc-500 hover:text-[#E84C4C]"
            >
              ← بازگشت به داشبورد
            </a>
            <h1 className="mt-2 text-3xl font-black text-white">
              🏷️ مدیریت برندها
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              {brands.length.toLocaleString("fa-IR")} برند
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="rounded-lg bg-[#E84C4C] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#D63F3F]"
          >
            ➕ برند جدید
          </button>
        </div>

        {/* List */}
        {loading ? (
          <div className="rounded-2xl border border-zinc-800 bg-[#0A0A0A] p-12 text-center text-zinc-500">
            در حال بارگذاری...
          </div>
        ) : brands.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-[#0A0A0A] p-12 text-center text-zinc-500">
            هنوز برندی ثبت نشده
          </div>
        ) : (
          <div className="space-y-3">
            {brands.map((brand, idx) => (
              <div
                key={brand.id}
                className="flex flex-wrap items-center gap-4 rounded-2xl border border-zinc-800 bg-[#0A0A0A] p-4"
              >
                {/* Logo */}
                <div className="flex h-16 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-full w-full object-contain"
                  />
                </div>

                {/* Info */}
                <div className="min-w-[200px] flex-1">
                  <span className="text-[10px] font-black text-zinc-600">
                    #{idx + 1}
                  </span>
                  <p className="mt-0.5 text-sm font-black text-white">
                    {brand.name}
                  </p>
                  {brand.href && (
                    <p className="mt-0.5 text-[10px] text-zinc-500" dir="ltr">
                      {brand.href}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-shrink-0 items-center gap-2">
                  <div className="flex flex-col">
                    <button
                      onClick={() => moveUp(brand, idx)}
                      disabled={idx === 0}
                      className="text-xs text-zinc-500 hover:text-white disabled:opacity-30"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveDown(brand, idx)}
                      disabled={idx === brands.length - 1}
                      className="text-xs text-zinc-500 hover:text-white disabled:opacity-30"
                    >
                      ▼
                    </button>
                  </div>

                  <button
                    onClick={() => handleToggle(brand)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      brand.is_active ? "bg-green-500" : "bg-zinc-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                        brand.is_active ? "translate-x-1" : "translate-x-6"
                      }`}
                    />
                  </button>

                  <button
                    onClick={() => openEditModal(brand)}
                    className="rounded-lg border border-[#E84C4C]/40 bg-[#E84C4C]/10 px-3 py-1.5 text-xs font-bold text-[#E84C4C] transition hover:bg-[#E84C4C] hover:text-white"
                  >
                    ✏️ ویرایش
                  </button>
                  <button
                    onClick={() => handleDelete(brand.id, brand.name)}
                    className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-500 transition hover:bg-red-500 hover:text-white"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-zinc-800 bg-[#0A0A0A] p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-black text-white">
                {editingId ? "✏️ ویرایش برند" : "➕ برند جدید"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-zinc-400">
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
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2.5 text-sm text-white outline-none focus:border-[#E84C4C]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-zinc-400">
                    ترتیب
                  </label>
                  <input
                    type="number"
                    value={form.order_index}
                    onChange={(e) =>
                      setForm({ ...form, order_index: e.target.value })
                    }
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2.5 text-sm text-white outline-none focus:border-[#E84C4C]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-zinc-400">
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
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2.5 text-left font-mono text-sm text-white outline-none focus:border-[#E84C4C]"
                />
              </div>

              <ImageUploader
                value={form.logo}
                onChange={(url) => setForm({ ...form, logo: url })}
                label="لوگوی برند *"
              />

              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-800 p-3">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) =>
                    setForm({ ...form, is_active: e.target.checked })
                  }
                  className="h-4 w-4 accent-[#E84C4C]"
                />
                <span className="text-sm font-bold text-white">
                  برند فعال باشد
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
                  {saving ? "در حال ذخیره..." : editingId ? "ذخیره تغییرات" : "افزودن برند"}
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

