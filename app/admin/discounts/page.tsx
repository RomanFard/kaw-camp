"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// ─── تایپ ───
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
  expires_at: "",
};

export default function DiscountsPage() {
  const supabase = createClient();

  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  // مودال
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // ─── لود دیتا ───
  async function loadCodes() {
    setLoading(true);
    const { data, error } = await supabase
      .from("discount_codes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError("خطا در بارگذاری کدها: " + error.message);
    } else {
      setCodes(data ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadCodes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── فیلتر جستجو ───
  const filtered = codes.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  // ─── باز کردن مودال افزودن ───
  function openAddModal() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  }

  // ─── باز کردن مودال ویرایش ───
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
      expires_at: code.expires_at
        ? new Date(code.expires_at).toISOString().split("T")[0]
        : "",
    });
    setFormError("");
    setModalOpen(true);
  }

  // ─── ذخیره (افزودن یا ویرایش) ───
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    // اعتبارسنجی
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
      setFormError("درصد تخفیف نمیتواند بیشتر از ۱۰۰ باشد");
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
      expires_at: form.expires_at
        ? new Date(form.expires_at).toISOString()
        : null,
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
    loadCodes();
  }

  // ─── حذف ───
  async function handleDelete(id: string, code: string) {
    if (!confirm(`آیا مطمئنی میخوای کد "${code}" رو حذف کنی؟`)) return;

    const { error } = await supabase
      .from("discount_codes")
      .delete()
      .eq("id", id);

    if (error) {
      alert("خطا در حذف: " + error.message);
      return;
    }
    loadCodes();
  }

  // ─── Toggle فعال/غیرفعال ───
  async function handleToggle(id: string, current: boolean) {
    const { error } = await supabase
      .from("discount_codes")
      .update({ is_active: !current })
      .eq("id", id);

    if (error) {
      alert("خطا: " + error.message);
      return;
    }
    setCodes((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_active: !current } : c))
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F1E3]">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <a
              href="/admin"
              className="text-sm text-gray-500 hover:text-amber-600"
            >
              ← بازگشت به داشبورد
            </a>
            <h1 className="mt-2 text-3xl font-black text-gray-900">
              🎟️ مدیریت کدهای تخفیف
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {codes.length.toLocaleString("fa-IR")} کد ثبت شده
            </p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="rounded-lg bg-[#F59E0B] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#D97706]"
          >
            ➕ کد جدید
          </button>
        </div>

        {/* جستجو */}
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 جستجو در کدها..."
            className="w-full max-w-md rounded-lg border border-[#D4C5A0] bg-white px-4 py-2.5 text-sm outline-none focus:border-amber-500"
          />
        </div>

        {/* خطا */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">
            ⚠️ {error}
          </div>
        )}

        {/* جدول */}
        <div className="overflow-hidden rounded-2xl border border-[#D4C5A0] bg-white">
          {loading ? (
            <div className="p-12 text-center text-gray-500">
              در حال بارگذاری...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              {search ? "کدی با این عبارت پیدا نشد" : "هنوز کدی ثبت نشده"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="border-b border-[#EDE4CE] bg-[#F7F1E3]/50">
                  <tr className="text-xs font-bold text-gray-600">
                    <th className="px-4 py-3">کد</th>
                    <th className="px-4 py-3">نوع</th>
                    <th className="px-4 py-3">مقدار</th>
                    <th className="px-4 py-3">حداقل خرید</th>
                    <th className="px-4 py-3">سقف تخفیف</th>
                    <th className="px-4 py-3">استفاده</th>
                    <th className="px-4 py-3">وضعیت</th>
                    <th className="px-4 py-3 text-left">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((code) => (
                    <tr
                      key={code.id}
                      className="border-b border-[#EDE4CE] last:border-0 transition hover:bg-[#F7F1E3]/30"
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono font-bold text-gray-900">
                          {code.code}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {code.type === "percent" ? "درصدی" : "مبلغ ثابت"}
                      </td>
                      <td className="px-4 py-3 font-bold">
                        {code.type === "percent"
                          ? `${code.value.toLocaleString("fa-IR")}٪`
                          : `${code.value.toLocaleString("fa-IR")} تومان`}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {code.min_purchase
                          ? code.min_purchase.toLocaleString("fa-IR")
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {code.max_discount
                          ? code.max_discount.toLocaleString("fa-IR")
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {code.used_count.toLocaleString("fa-IR")}
                        {code.usage_limit && (
                          <span className="text-xs text-gray-400">
                            {" "}
                            / {code.usage_limit.toLocaleString("fa-IR")}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => handleToggle(code.id, code.is_active)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                            code.is_active ? "bg-green-500" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                              code.is_active
                                ? "translate-x-1"
                                : "translate-x-6"
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-4 py-3 text-left">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(code)}
                            className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 transition hover:bg-amber-100"
                          >
                            ✏️ ویرایش
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(code.id, code.code)}
                            className="rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-100"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ─── مودال افزودن/ویرایش ─── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-black text-gray-900">
                {editingId ? "✏️ ویرایش کد" : "➕ کد تخفیف جدید"}
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
              {/* کد */}
              <div>
                <label className="mb-1.5 block text-sm font-bold text-gray-700">
                  کد تخفیف *
                </label>
                <input
                  type="text"
                  required
                  dir="ltr"
                  value={form.code}
                  onChange={(e) =>
                    setForm({ ...form, code: e.target.value.toUpperCase() })
                  }
                  placeholder="KAW10"
                  className="w-full rounded-lg border border-[#D4C5A0] px-4 py-2.5 text-left font-mono text-sm outline-none focus:border-amber-500"
                />
              </div>

              {/* نوع + مقدار */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-700">
                    نوع *
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        type: e.target.value as "percent" | "fixed",
                      })
                    }
                    className="w-full rounded-lg border border-[#D4C5A0] bg-white px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                  >
                    <option value="percent">درصدی (٪)</option>
                    <option value="fixed">مبلغ ثابت (تومان)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-700">
                    مقدار * {form.type === "percent" ? "(٪)" : "(تومان)"}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    placeholder="10"
                    className="w-full rounded-lg border border-[#D4C5A0] px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* حداقل خرید + سقف */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-700">
                    حداقل خرید (تومان)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.min_purchase}
                    onChange={(e) =>
                      setForm({ ...form, min_purchase: e.target.value })
                    }
                    placeholder="0"
                    className="w-full rounded-lg border border-[#D4C5A0] px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-700">
                    سقف تخفیف (تومان)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.max_discount}
                    onChange={(e) =>
                      setForm({ ...form, max_discount: e.target.value })
                    }
                    placeholder="اختیاری"
                    className="w-full rounded-lg border border-[#D4C5A0] px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* توضیحات */}
              <div>
                <label className="mb-1.5 block text-sm font-bold text-gray-700">
                  توضیحات
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="مثلاً: ۱۰٪ تخفیف روی کل سبد خرید"
                  className="w-full resize-none rounded-lg border border-[#D4C5A0] px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                />
              </div>

              {/* سقف استفاده + انقضا */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-700">
                    محدودیت تعداد استفاده
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.usage_limit}
                    onChange={(e) =>
                      setForm({ ...form, usage_limit: e.target.value })
                    }
                    placeholder="اختیاری"
                    className="w-full rounded-lg border border-[#D4C5A0] px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-700">
                    تاریخ انقضا
                  </label>
                  <input
                    type="date"
                    value={form.expires_at}
                    onChange={(e) =>
                      setForm({ ...form, expires_at: e.target.value })
                    }
                    className="w-full rounded-lg border border-[#D4C5A0] px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* فعال */}
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#D4C5A0] p-3">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) =>
                    setForm({ ...form, is_active: e.target.checked })
                  }
                  className="h-4 w-4 accent-amber-500"
                />
                <span className="text-sm font-bold text-gray-700">
                  کد فعال باشد
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
                  className="flex-1 rounded-lg bg-[#F59E0B] py-3 text-sm font-bold text-white transition hover:bg-[#D97706] disabled:opacity-50"
                >
                  {saving ? "در حال ذخیره..." : editingId ? "ذخیره تغییرات" : "افزودن کد"}
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