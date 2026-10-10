"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useToast } from "@/components/context/ToastContext";
import { getAllProducts } from "@/lib/supabase/products";
import type { Product } from "@/data/products";

// ─── تایپ‌ها ───
type DiscountCode = {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  min_purchase: number | null;
  max_discount: number | null;
  description: string | null;
  is_active: boolean;
  usage_limit: number | null;
  used_count: number;
  per_user_limit: number | null;
  product_id: string | null;
  expires_at: string | null;
  created_at: string;
};

type FormData = {
  code: string;
  type: "percent" | "fixed";
  value: string;
  min_purchase: string;
  max_discount: string;
  description: string;
  is_active: boolean;
  usage_limit: string;
  per_user_limit: string;
  product_id: string;
  expires_at: string;
};

const EMPTY_FORM: FormData = {
  code: "",
  type: "percent",
  value: "",
  min_purchase: "",
  max_discount: "",
  description: "",
  is_active: true,
  usage_limit: "",
  per_user_limit: "1",
  product_id: "",
  expires_at: "",
};

export default function DiscountsPage() {
  const supabase = createClient();
  const toast = useToast();

  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // مودال
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // ─── لود دیتا و محصولات ───
  async function loadData() {
    setLoading(true);
    const [codesRes, prodsData] = await Promise.all([
      supabase.from("discount_codes").select("*").order("created_at", { ascending: false }),
      getAllProducts(),
    ]);

    if (codesRes.error) {
      setError("خطا در بارگذاری کدها: " + codesRes.error.message);
    } else {
      setCodes(codesRes.data ?? []);
    }
    setProducts(prodsData);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = codes.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  function openAddModal() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  }

  function openEditModal(code: DiscountCode) {
    setEditingId(code.id);
    setForm({
      code: code.code,
      type: code.type,
      value: String(code.value),
      min_purchase: code.min_purchase ? String(code.min_purchase) : "",
      max_discount: code.max_discount ? String(code.max_discount) : "",
      description: code.description ?? "",
      is_active: code.is_active,
      usage_limit: code.usage_limit ? String(code.usage_limit) : "",
      per_user_limit: code.per_user_limit ? String(code.per_user_limit) : "1",
      product_id: code.product_id ?? "",
      expires_at: code.expires_at
        ? new Date(code.expires_at).toISOString().split("T")[0]
        : "",
    });
    setFormError("");
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!form.code.trim()) {
      setFormError("کد تخفیف الزامی است");
      return;
    }
    const numValue = Number(form.value);
    if (!numValue || numValue <= 0) {
      setFormError("مقدار باید بزرگتر از صفر باشد");
      return;
    }
    if (form.type === "percent" && numValue > 100) {
      setFormError("درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد");
      return;
    }

    setSaving(true);

    const payload = {
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value: numValue,
      min_purchase: form.min_purchase ? Number(form.min_purchase) : 0,
      max_discount: form.max_discount ? Number(form.max_discount) : null,
      description: form.description.trim() || null,
      is_active: form.is_active,
      usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
      per_user_limit: form.per_user_limit ? Number(form.per_user_limit) : 1,
      product_id: form.product_id || null,
      expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
    };

    let result;
    if (editingId) {
      result = await supabase
        .from("discount_codes")
        .update(payload)
        .eq("id", editingId);
    } else {
      result = await supabase.from("discount_codes").insert(payload);
    }

    if (result.error) {
      if (result.error.message.includes("duplicate")) {
        setFormError("این کد قبلاً ثبت شده است");
      } else {
        setFormError("خطا: " + result.error.message);
      }
      setSaving(false);
      return;
    }

    setSaving(false);
    setModalOpen(false);
    toast.success(editingId ? "کد با موفقیت ویرایش شد" : "کد جدید اضافه شد");
    loadData();
  }

  async function handleDelete(id: string, code: string) {
    if (!confirm(`آیا مطمئنی می‌خوای کد "${code}" رو حذف کنی؟`)) return;

    const { error } = await supabase.from("discount_codes").delete().eq("id", id);
    if (error) {
      toast.error("خطا در حذف: " + error.message);
      return;
    }
    toast.success(`کد «${code}» حذف شد`);
    loadData();
  }

  async function handleToggle(id: string, current: boolean) {
    const { error } = await supabase
      .from("discount_codes")
      .update({ is_active: !current })
      .eq("id", id);

    if (error) {
      toast.error("خطا: " + error.message);
      return;
    }
    setCodes((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_active: !current } : c))
    );
    toast.success(current ? "کد غیرفعال شد" : "کد فعال شد");
  }

  return (
    <div dir="rtl" className="flex min-h-screen bg-theme text-theme">
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
        />
      )}

      <AdminSidebar
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
      />

      <main className="flex-1 overflow-x-hidden p-4 pb-12 sm:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          
          {/* هدر */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-theme bg-theme-card text-theme md:hidden"
              >
                ☰
              </button>
              <div>
                <h1 className="text-xl font-black text-theme">
                  🎟️ مدیریت کدهای تخفیف پیشرفته
                </h1>
                <p className="mt-0.5 text-xs text-theme-muted">
                  {codes.length.toLocaleString("fa-IR")} کد تخفیف ثبت شده
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="rounded-xl bg-accent px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:opacity-90"
            >
              ➕ کد تخفیف جدید
            </button>
          </div>

          {/* جستجو */}
          <div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 جستجو در کدها..."
              className="w-full max-w-md rounded-xl border border-theme bg-theme-card px-4 py-2.5 text-xs text-theme outline-none transition placeholder:text-theme-muted focus:border-accent"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-bold text-red-500">
              ⚠️ {error}
            </div>
          )}

          {/* جدول */}
          <div className="overflow-hidden rounded-2xl border border-theme bg-theme-card shadow-sm">
            {loading ? (
              <div className="p-12 text-center text-xs text-theme-muted">
                در حال بارگذاری کدهای تخفیف...
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-xs text-theme-muted">
                {search ? "کدی با این عبارت پیدا نشد" : "هنوز کدی ثبت نشده است"}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="border-b border-theme bg-theme-surface font-bold text-theme-muted">
                    <tr>
                      <th className="px-4 py-3">کد تخفیف</th>
                      <th className="px-4 py-3">مقدار</th>
                      <th className="px-4 py-3">محدود به محصول</th>
                      <th className="px-4 py-3">مصرف کل / سقف</th>
                      <th className="px-4 py-3">سهم هر کاربر</th>
                      <th className="px-4 py-3">وضعیت</th>
                      <th className="px-4 py-3 text-left">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-theme">
                    {filtered.map((code) => {
                      const targetProduct = products.find((p) => p.id === code.product_id);
                      return (
                        <tr key={code.id} className="transition hover:bg-theme-surface/40">
                          <td className="px-4 py-3 font-mono font-bold text-theme">
                            {code.code}
                          </td>
                          <td className="px-4 py-3 font-bold text-theme">
                            {code.type === "percent"
                              ? `${code.value.toLocaleString("fa-IR")}٪`
                              : `${code.value.toLocaleString("fa-IR")} تومان`}
                          </td>
                          <td className="px-4 py-3 text-theme-muted">
                            {targetProduct ? (
                              <span className="font-bold text-accent">
                                📦 {targetProduct.name}
                              </span>
                            ) : (
                              <span className="text-theme-muted">🌐 کل محصولات (سبد خرید)</span>
                            )}
                          </td>
                          <td className="px-4 py-3 font-mono">
                            {code.used_count.toLocaleString("fa-IR")} /{" "}
                            {code.usage_limit ? code.usage_limit.toLocaleString("fa-IR") : "∞"}
                          </td>
                          <td className="px-4 py-3 font-mono">
                            {code.per_user_limit ? `${code.per_user_limit} بار` : "نامحدود"}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => handleToggle(code.id, code.is_active)}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
                                code.is_active
                                  ? "bg-green-500"
                                  : "border border-theme bg-theme-surface"
                              }`}
                            >
                              <span
                                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${
                                  code.is_active ? "translate-x-0.5" : "translate-x-5"
                                }`}
                              />
                            </button>
                          </td>
                          <td className="px-4 py-3 text-left">
                            <div className="flex justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => openEditModal(code)}
                                className="rounded-lg border border-theme bg-theme-surface px-2.5 py-1.5 font-bold text-theme transition hover:border-accent"
                                title="ویرایش"
                              >
                                ✏️
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(code.id, code.code)}
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

        {/* ─── مودال پیشرفته افزودن/ویرایش ─── */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-theme bg-theme-card p-6 shadow-2xl">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-black text-theme">
                  {editingId ? "✏️ ویرایش کد تخفیف" : "➕ ایجاد کد تخفیف جدید"}
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
                {/* کد */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                    عبارت کد تخفیف *
                  </label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={form.code}
                    onChange={(e) =>
                      setForm({ ...form, code: e.target.value.toUpperCase() })
                    }
                    placeholder="SUMMER1405"
                    className="w-full rounded-xl border border-theme bg-theme-surface px-4 py-2.5 text-left font-mono text-xs text-theme outline-none transition placeholder:text-theme-muted focus:border-accent"
                  />
                </div>

                {/* نوع + مقدار */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                      نوع تخفیف *
                    </label>
                    <select
                      value={form.type}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          type: e.target.value as "percent" | "fixed",
                        })
                      }
                      className="w-full rounded-xl border border-theme bg-theme-surface px-4 py-2.5 text-xs text-theme outline-none transition focus:border-accent"
                    >
                      <option value="percent">درصدی (٪)</option>
                      <option value="fixed">مبلغ ثابت (تومان)</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                      مقدار * {form.type === "percent" ? "(٪)" : "(تومان)"}
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={form.value}
                      onChange={(e) =>
                        setForm({ ...form, value: e.target.value })
                      }
                      placeholder="15"
                      className="w-full rounded-xl border border-theme bg-theme-surface px-4 py-2.5 text-xs text-theme outline-none transition placeholder:text-theme-muted focus:border-accent"
                    />
                  </div>
                </div>

                {/* 🆕 محدودسازی به محصول خاص */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                    محدودسازی به محصول خاص (اختیاری)
                  </label>
                  <select
                    value={form.product_id}
                    onChange={(e) =>
                      setForm({ ...form, product_id: e.target.value })
                    }
                    className="w-full rounded-xl border border-theme bg-theme-surface px-4 py-2.5 text-xs text-theme outline-none transition focus:border-accent"
                  >
                    <option value="">🌐 قابل استفاده روی کل سبد خرید (بدون محدودیت محصول)</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        📦 {p.name} ({p.id})
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-[10px] text-theme-muted">
                    اگر محصولی انتخاب شود، کد فقط در صورتی اعمال می‌شود که آن محصول در سبد خرید باشد.
                  </p>
                </div>

                {/* محدودیت تعداد کل استفاده + سهم هر کاربر */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                      سقف کل استفاده (تعداد کل)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.usage_limit}
                      onChange={(e) =>
                        setForm({ ...form, usage_limit: e.target.value })
                      }
                      placeholder="مثلاً 100 بار (خالی = نامحدود)"
                      className="w-full rounded-xl border border-theme bg-theme-surface px-4 py-2.5 text-xs text-theme outline-none transition placeholder:text-theme-muted focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                      حداکثر استفاده برای هر کاربر
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={form.per_user_limit}
                      onChange={(e) =>
                        setForm({ ...form, per_user_limit: e.target.value })
                      }
                      placeholder="مثلاً 1 بار"
                      className="w-full rounded-xl border border-theme bg-theme-surface px-4 py-2.5 text-xs text-theme outline-none transition placeholder:text-theme-muted focus:border-accent"
                    />
                  </div>
                </div>

                {/* حداقل خرید + تاریخ انقضا */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                      حداقل مبلغ خرید (تومان)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.min_purchase}
                      onChange={(e) =>
                        setForm({ ...form, min_purchase: e.target.value })
                      }
                      placeholder="0"
                      className="w-full rounded-xl border border-theme bg-theme-surface px-4 py-2.5 text-xs text-theme outline-none transition placeholder:text-theme-muted focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                      تاریخ انقضا
                    </label>
                    <input
                      type="date"
                      value={form.expires_at}
                      onChange={(e) =>
                        setForm({ ...form, expires_at: e.target.value })
                      }
                      className="w-full rounded-xl border border-theme bg-theme-surface px-4 py-2.5 text-xs text-theme outline-none transition focus:border-accent"
                    />
                  </div>
                </div>

                {/* فعال */}
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
                    کد تخفیف فعال باشد
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
                    className="flex-1 rounded-xl bg-accent py-3 text-xs font-bold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
                  >
                    {saving
                      ? "در حال ذخیره..."
                      : editingId
                      ? "ذخیره تغییرات"
                      : "افزودن کد تخفیف"}
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