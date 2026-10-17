"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useToast } from "@/components/context/ToastContext";
import {
  getAllAttributes,
  createAttribute,
  updateAttribute,
  deleteAttribute,
  generateAttributeKey,
  type Attribute,
  type AttributeType,
  type AttributeInput,
} from "@/lib/actions/attributes";
import { categories } from "@/data/products";

type FormData = {
  key: string;
  label: string;
  type: AttributeType;
  values: string[];      // برای type=select
  valuesInput: string;   // برای تایپ مقادیر (هر خط یکی)
  unit: string;
  category_scope: string[];
  order_index: string;
  is_active: boolean;
};

const EMPTY_FORM: FormData = {
  key: "",
  label: "",
  type: "select",
  values: [],
  valuesInput: "",
  unit: "",
  category_scope: [],
  order_index: "0",
  is_active: true,
};

export default function AttributesAdminPage() {
  const toast = useToast();
  const [items, setItems] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  async function load() {
    setLoading(true);
    const data = await getAllAttributes();
    setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openAddModal() {
    const next =
      items.length > 0
        ? Math.max(...items.map((a) => a.order_index)) + 1
        : 0;
    setEditingId(null);
    setForm({ ...EMPTY_FORM, order_index: String(next) });
    setFormError("");
    setModalOpen(true);
  }

  function openEditModal(a: Attribute) {
    setEditingId(a.id);
    setForm({
      key: a.key,
      label: a.label,
      type: a.type,
      values: a.values,
      valuesInput: a.values.join("\n"),
      unit: a.unit,
      category_scope: a.category_scope,
      order_index: String(a.order_index),
      is_active: a.is_active,
    });
    setFormError("");
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!form.label.trim()) return setFormError("نام نمایشی (label) الزامی است");

    // ساخت key خودکار اگه خالی بود
    let finalKey = form.key.trim();
    if (!finalKey) {
      finalKey = generateAttributeKey(form.label.trim());
    }
    if (!finalKey) return setFormError("key معتبر نیست — دستی واردش کن");

    // برای type=select، مقادیر الزامی
    const values = form.valuesInput
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    if (form.type === "select" && values.length === 0) {
      return setFormError("برای نوع «انتخابی» حداقل یک مقدار لازم است");
    }

    setSaving(true);

    const payload: AttributeInput = {
      key: finalKey,
      label: form.label.trim(),
      type: form.type,
      values: form.type === "select" ? values : [],
      unit: form.unit.trim(),
      category_scope: form.category_scope,
      order_index: Number(form.order_index) || 0,
      is_active: form.is_active,
    };

    const result = editingId
      ? await updateAttribute(editingId, payload)
      : await createAttribute(payload);

    if (result.error) {
      setFormError("خطا: " + result.error.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    setModalOpen(false);
    toast.success(editingId ? "ویژگی ویرایش شد" : "ویژگی اضافه شد");
    load();
  }

  async function handleDelete(id: string, label: string) {
    if (!confirm(`حذف ویژگی "${label}"؟`)) return;
    const { error } = await deleteAttribute(id);
    if (error) return toast.error("خطا: " + error.message);
    toast.success("ویژگی حذف شد");
    load();
  }

  async function handleToggle(a: Attribute) {
    const { error } = await updateAttribute(a.id, {
      is_active: !a.is_active,
    });
    if (error) return toast.error("خطا: " + error.message);
    setItems((prev) =>
      prev.map((x) =>
        x.id === a.id ? { ...x, is_active: !a.is_active } : x
      )
    );
    toast.success(a.is_active ? "غیرفعال شد" : "فعال شد");
  }

  function toggleScope(catKey: string) {
    setForm((f) => ({
      ...f,
      category_scope: f.category_scope.includes(catKey)
        ? f.category_scope.filter((c) => c !== catKey)
        : [...f.category_scope, catKey],
    }));
  }

  const inputCls =
    "w-full rounded-xl border border-theme bg-theme-surface px-3.5 py-2.5 text-xs text-theme placeholder:text-theme-muted outline-none focus:border-accent transition";

  const TYPE_LABELS: Record<AttributeType, string> = {
    select: "🎯 انتخابی (لیست)",
    text: "✍️ متن آزاد",
    number: "🔢 عددی",
  };

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
        <div className="mx-auto max-w-5xl">
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
                  🎛️ مدیریت ویژگی‌ها
                </h1>
                <p className="mt-1 text-xs text-theme-muted">
                  {items.length.toLocaleString("fa-IR")} ویژگی ثبت شده
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="rounded-xl bg-accent px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:opacity-90"
            >
              ➕ ویژگی جدید
            </button>
          </div>

          {/* توضیح */}
          <div className="mb-5 rounded-2xl border border-theme bg-theme-surface/40 p-4 text-xs text-theme-muted">
            <p className="font-bold text-theme">💡 این ویژگی‌ها چطور کار می‌کنن؟</p>
            <p className="mt-1.5 leading-6">
              ویژگی‌هایی که این‌جا می‌سازی، توی فرم ویرایش محصول (تب «مشخصات فنی») به شکل dropdown نمایش داده می‌شن. این‌طوری دیگه لازم نیست هر بار دستی تایپ کنی و همه‌چیز یکدست می‌مونه.
            </p>
          </div>

          {/* لیست */}
          {loading ? (
            <div className="rounded-2xl border border-theme bg-theme-card p-12 text-center text-xs text-theme-muted">
              در حال بارگذاری...
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-theme bg-theme-card p-12 text-center text-xs text-theme-muted">
              هنوز ویژگی‌ای ثبت نشده
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((a) => (
                <div
                  key={a.id}
                  className="flex flex-wrap items-center gap-4 rounded-2xl border border-theme bg-theme-card p-4 shadow-sm transition hover:border-accent/50"
                >
                  {/* آیکون نوع */}
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-theme bg-theme-surface text-lg">
                    {a.type === "select" ? "🎯" : a.type === "number" ? "🔢" : "✍️"}
                  </div>

                  {/* Info */}
                  <div className="min-w-[180px] flex-1">
                    <p className="text-sm font-black text-theme">{a.label}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-theme-muted" dir="ltr">
                      {a.key}
                    </p>
                    {a.unit && (
                      <p className="mt-0.5 text-[10px] text-theme-muted">
                        واحد: {a.unit}
                      </p>
                    )}
                  </div>

                  {/* مقادیر */}
                  <div className="min-w-[180px] flex-1">
                    {a.type === "select" ? (
                      <div className="flex flex-wrap gap-1">
                        {a.values.slice(0, 4).map((v, i) => (
                          <span
                            key={i}
                            className="rounded-md bg-theme-surface px-2 py-0.5 text-[10px] text-theme-muted"
                          >
                            {v}
                          </span>
                        ))}
                        {a.values.length > 4 && (
                          <span className="text-[10px] text-theme-muted">
                            +{(a.values.length - 4).toLocaleString("fa-IR")} بیشتر
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[10px] text-theme-muted">
                        {a.type === "text" ? "متن آزاد" : "عدد"}
                      </span>
                    )}
                  </div>

                  {/* Scope */}
                  <div className="min-w-[100px]">
                    {a.category_scope.length === 0 ? (
                      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] text-accent">
                        همه دسته‌ها
                      </span>
                    ) : (
                      <span className="rounded-full bg-theme-surface px-2 py-0.5 text-[10px] text-theme-muted">
                        {a.category_scope.length.toLocaleString("fa-IR")} دسته
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggle(a)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
                        a.is_active
                          ? "bg-green-500"
                          : "border border-theme bg-theme-surface"
                      }`}
                      aria-label="فعال/غیرفعال"
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${
                          a.is_active ? "translate-x-0.5" : "translate-x-5"
                        }`}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditModal(a)}
                      className="rounded-lg border border-theme bg-theme-surface px-2.5 py-1.5 font-bold text-theme transition hover:border-accent"
                      title="ویرایش"
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(a.id, a.label)}
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
                  {editingId ? "✏️ ویرایش ویژگی" : "➕ ویژگی جدید"}
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
                {/* نام نمایشی */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                    نام نمایشی *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.label}
                    onChange={(e) =>
                      setForm({ ...form, label: e.target.value })
                    }
                    placeholder="ظرفیت"
                    className={inputCls}
                  />
                  <p className="mt-1 text-[10px] text-theme-muted">
                    این اسم توی فرم محصول نمایش داده می‌شه
                  </p>
                </div>

                {/* key (اختیاری) */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                    شناسه (key) — اختیاری
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={form.key}
                    onChange={(e) => setForm({ ...form, key: e.target.value })}
                    placeholder="capacity — اگه خالی بمونه، خودکار ساخته می‌شه"
                    className={`${inputCls} font-mono`}
                  />
                  <p className="mt-1 text-[10px] text-theme-muted">
                    برای فیلتر در URL استفاده می‌شه — مثلاً /products?capacity=2
                  </p>
                </div>

                {/* نوع */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                    نوع ویژگی *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["select", "text", "number"] as AttributeType[]).map(
                      (t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setForm({ ...form, type: t })}
                          className={`rounded-xl border px-3 py-2.5 text-xs font-bold transition ${
                            form.type === t
                              ? "border-accent bg-accent/10 text-accent"
                              : "border-theme bg-theme-surface text-theme-muted hover:border-theme-muted"
                          }`}
                        >
                          {TYPE_LABELS[t]}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* مقادیر برای select */}
                {form.type === "select" && (
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                      مقادیر مجاز * — هر خط یکی
                    </label>
                    <textarea
                      rows={5}
                      value={form.valuesInput}
                      onChange={(e) =>
                        setForm({ ...form, valuesInput: e.target.value })
                      }
                      placeholder={"۱ نفر\n۲ نفر\n۳ نفر\n۴ نفر"}
                      className={`${inputCls} resize-none font-mono`}
                    />
                    <p className="mt-1 text-[10px] text-theme-muted">
                      هر خط = یک گزینه در dropdown
                    </p>
                  </div>
                )}

                {/* واحد */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                    واحد (اختیاری)
                  </label>
                  <input
                    type="text"
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    placeholder="نفر، کیلوگرم، ماه"
                    className={inputCls}
                  />
                </div>

                {/* دسته‌بندی‌های مربوطه */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                    محدود به دسته‌بندی‌ها (اختیاری)
                  </label>
                  <p className="mb-2 text-[10px] text-theme-muted">
                    اگه هیچی انتخاب نکنی، این ویژگی برای همه دسته‌ها نمایش داده می‌شه
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((c) => {
                      const active = form.category_scope.includes(c.key);
                      return (
                        <button
                          key={c.key}
                          type="button"
                          onClick={() => toggleScope(c.key)}
                          className={`rounded-full border px-3 py-1 text-[11px] transition ${
                            active
                              ? "border-accent bg-accent/10 text-accent"
                              : "border-theme bg-theme-surface text-theme-muted hover:border-theme-muted"
                          }`}
                        >
                          {c.emoji} {c.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ترتیب */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                      ترتیب نمایش
                    </label>
                    <input
                      type="number"
                      value={form.order_index}
                      onChange={(e) =>
                        setForm({ ...form, order_index: e.target.value })
                      }
                      className={inputCls}
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl border border-theme bg-theme-surface p-3 transition hover:border-accent">
                      <input
                        type="checkbox"
                        checked={form.is_active}
                        onChange={(e) =>
                          setForm({ ...form, is_active: e.target.checked })
                        }
                        className="h-4 w-4 accent-accent"
                      />
                      <span className="text-xs font-bold text-theme">
                        فعال باشد
                      </span>
                    </label>
                  </div>
                </div>

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
                      : "افزودن ویژگی"}
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