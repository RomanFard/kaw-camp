"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/context/ToastContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ImageUploader from "@/components/admin/ImageUploader";
import {
  getAllHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  type HeroSlide,
} from "@/lib/supabase/heroSlides";

type FormData = {
  order_index: string;
  eyebrow: string;
  title_line1: string;
  title_line2: string;
  description: string;
  primary_label: string;
  primary_href: string;
  secondary_label: string;
  secondary_href: string;
  video: string;
  poster: string;
  is_active: boolean;
};

const EMPTY_FORM: FormData = {
  order_index: "0",
  eyebrow: "",
  title_line1: "",
  title_line2: "",
  description: "",
  primary_label: "",
  primary_href: "",
  secondary_label: "",
  secondary_href: "",
  video: "",
  poster: "",
  is_active: true,
};

export default function HeroSlidesPage() {
  const toast = useToast();

  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  async function load() {
    setLoading(true);
    const data = await getAllHeroSlides();
    setSlides(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openAddModal() {
    const nextOrder =
      slides.length > 0
        ? Math.max(...slides.map((s) => s.order_index)) + 1
        : 0;
    setEditingId(null);
    setForm({ ...EMPTY_FORM, order_index: String(nextOrder) });
    setFormError("");
    setModalOpen(true);
  }

  function openEditModal(slide: HeroSlide) {
    setEditingId(slide.id);
    setForm({
      order_index: String(slide.order_index),
      eyebrow: slide.eyebrow,
      title_line1: slide.title_line1,
      title_line2: slide.title_line2,
      description: slide.description,
      primary_label: slide.primary_label,
      primary_href: slide.primary_href,
      secondary_label: slide.secondary_label,
      secondary_href: slide.secondary_href,
      video: slide.video,
      poster: slide.poster,
      is_active: slide.is_active,
    });
    setFormError("");
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!form.title_line1.trim()) return setFormError("عنوان خط اول الزامی است");
    if (!form.title_line2.trim()) return setFormError("عنوان خط دوم الزامی است");
    if (!form.poster.trim()) return setFormError("تصویر بنر الزامی است");
    if (!form.primary_label.trim()) return setFormError("متن دکمه اصلی الزامی است");
    if (!form.primary_href.trim()) return setFormError("لینک دکمه اصلی الزامی است");

    setSaving(true);

    const payload: Omit<HeroSlide, "id"> = {
      order_index: Number(form.order_index) || 0,
      eyebrow: form.eyebrow.trim(),
      title_line1: form.title_line1.trim(),
      title_line2: form.title_line2.trim(),
      description: form.description.trim(),
      primary_label: form.primary_label.trim(),
      primary_href: form.primary_href.trim(),
      secondary_label: form.secondary_label.trim(),
      secondary_href: form.secondary_href.trim(),
      video: form.video.trim(),
      poster: form.poster.trim(),
      is_active: form.is_active,
    };

    let result;
    if (editingId) {
      result = await updateHeroSlide(editingId, payload);
    } else {
      result = await createHeroSlide(payload);
    }

    if (result.error) {
      setFormError("خطا: " + result.error.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    setModalOpen(false);
    toast.success(editingId ? "اسلاید ویرایش شد" : "اسلاید جدید اضافه شد");
    load();
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`آیا از حذف اسلاید "${title}" مطمئنی؟`)) return;
    const { error } = await deleteHeroSlide(id);
    if (error) {
      toast.error("خطا: " + error.message);
      return;
    }
    toast.success("اسلاید حذف شد");
    load();
  }

  async function handleToggleActive(slide: HeroSlide) {
    const { error } = await updateHeroSlide(slide.id, {
      ...slide,
      is_active: !slide.is_active,
    });
    if (error) {
      toast.error("خطا: " + error.message);
      return;
    }
    setSlides((prev) =>
      prev.map((s) =>
        s.id === slide.id ? { ...s, is_active: !slide.is_active } : s
      )
    );
    toast.success(slide.is_active ? "اسلاید غیرفعال شد" : "اسلاید فعال شد");
  }

  async function moveUp(slide: HeroSlide, idx: number) {
    if (idx === 0) return;
    const prev = slides[idx - 1];
    await Promise.all([
      updateHeroSlide(slide.id, { ...slide, order_index: prev.order_index }),
      updateHeroSlide(prev.id, { ...prev, order_index: slide.order_index }),
    ]);
    load();
  }

  async function moveDown(slide: HeroSlide, idx: number) {
    if (idx === slides.length - 1) return;
    const next = slides[idx + 1];
    await Promise.all([
      updateHeroSlide(slide.id, { ...slide, order_index: next.order_index }),
      updateHeroSlide(next.id, { ...next, order_index: slide.order_index }),
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
                  🎬 مدیریت بنر اصلی
                </h1>
                <p className="mt-1 text-xs text-theme-muted">
                  {slides.length.toLocaleString("fa-IR")} اسلاید ثبت شده
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="rounded-xl bg-accent px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:opacity-90"
            >
              ➕ اسلاید جدید
            </button>
          </div>

          {/* لیست اسلایدها */}
          {loading ? (
            <div className="rounded-2xl border border-theme bg-theme-card p-12 text-center text-xs text-theme-muted">
              در حال بارگذاری...
            </div>
          ) : slides.length === 0 ? (
            <div className="rounded-2xl border border-theme bg-theme-card p-12 text-center text-xs text-theme-muted">
              هنوز اسلایدی ثبت نشده
            </div>
          ) : (
            <div className="space-y-3">
              {slides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className="flex flex-wrap items-center gap-4 rounded-2xl border border-theme bg-theme-card p-4 shadow-sm transition hover:border-accent/50"
                >
                  {/* Thumb */}
                  <div className="h-20 w-32 flex-shrink-0 overflow-hidden rounded-xl border border-theme bg-theme-surface">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slide.poster}
                      alt={slide.title_line1}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="min-w-[180px] flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-theme-muted">
                        #{idx + 1}
                      </span>
                      <span className="text-[10px] font-bold text-accent">
                        {slide.eyebrow}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-black text-theme">
                      {slide.title_line1} {slide.title_line2}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-[11px] text-theme-muted">
                      {slide.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-shrink-0 items-center gap-2">
                    {/* Move up/down */}
                    <div className="flex flex-col">
                      <button
                        type="button"
                        onClick={() => moveUp(slide, idx)}
                        disabled={idx === 0}
                        className="text-xs text-theme-muted transition hover:text-theme disabled:opacity-30"
                        aria-label="بالا"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => moveDown(slide, idx)}
                        disabled={idx === slides.length - 1}
                        className="text-xs text-theme-muted transition hover:text-theme disabled:opacity-30"
                        aria-label="پایین"
                      >
                        ▼
                      </button>
                    </div>

                    {/* Toggle active */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(slide)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
                        slide.is_active
                          ? "bg-green-500"
                          : "border border-theme bg-theme-surface"
                      }`}
                      aria-label="فعال/غیرفعال"
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${
                          slide.is_active
                            ? "translate-x-0.5"
                            : "translate-x-5"
                        }`}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditModal(slide)}
                      className="rounded-lg border border-theme bg-theme-surface px-2.5 py-1.5 font-bold text-theme transition hover:border-accent"
                      title="ویرایش"
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(slide.id, slide.title_line1)}
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

        {/* ═══════ مودال ═══════ */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-theme bg-theme-card p-6 shadow-2xl">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-black text-theme">
                  {editingId ? "✏️ ویرایش اسلاید" : "➕ اسلاید جدید"}
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
                {/* Eyebrow + Order */}
                <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                      متن بالای عنوان (Eyebrow)
                    </label>
                    <input
                      type="text"
                      value={form.eyebrow}
                      onChange={(e) =>
                        setForm({ ...form, eyebrow: e.target.value })
                      }
                      placeholder="KAW CAMP — فروشگاه تخصصی"
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

                {/* Title lines */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                      عنوان خط اول *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.title_line1}
                      onChange={(e) =>
                        setForm({ ...form, title_line1: e.target.value })
                      }
                      placeholder="تجهیزات"
                      className="w-full rounded-xl border border-theme bg-theme-surface px-4 py-2.5 text-xs text-theme outline-none transition placeholder:text-theme-muted focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                      عنوان خط دوم * (کورال)
                    </label>
                    <input
                      type="text"
                      required
                      value={form.title_line2}
                      onChange={(e) =>
                        setForm({ ...form, title_line2: e.target.value })
                      }
                      placeholder="کوهنوردی حرفه‌ای"
                      className="w-full rounded-xl border border-theme bg-theme-surface px-4 py-2.5 text-xs text-theme outline-none transition placeholder:text-theme-muted focus:border-accent"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                    توضیحات
                  </label>
                  <textarea
                    rows={2}
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="w-full resize-none rounded-xl border border-theme bg-theme-surface px-4 py-2.5 text-xs text-theme outline-none transition focus:border-accent"
                  />
                </div>

                {/* Primary CTA */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                      متن دکمه اصلی *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.primary_label}
                      onChange={(e) =>
                        setForm({ ...form, primary_label: e.target.value })
                      }
                      placeholder="شروع خرید"
                      className="w-full rounded-xl border border-theme bg-theme-surface px-4 py-2.5 text-xs text-theme outline-none transition placeholder:text-theme-muted focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                      لینک دکمه اصلی *
                    </label>
                    <input
                      type="text"
                      required
                      dir="ltr"
                      value={form.primary_href}
                      onChange={(e) =>
                        setForm({ ...form, primary_href: e.target.value })
                      }
                      placeholder="/products"
                      className="w-full rounded-xl border border-theme bg-theme-surface px-4 py-2.5 text-left font-mono text-xs text-theme outline-none transition placeholder:text-theme-muted focus:border-accent"
                    />
                  </div>
                </div>

                {/* Secondary CTA */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                      متن دکمه دوم
                    </label>
                    <input
                      type="text"
                      value={form.secondary_label}
                      onChange={(e) =>
                        setForm({ ...form, secondary_label: e.target.value })
                      }
                      placeholder="آفرود و تور"
                      className="w-full rounded-xl border border-theme bg-theme-surface px-4 py-2.5 text-xs text-theme outline-none transition placeholder:text-theme-muted focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                      لینک دکمه دوم
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={form.secondary_href}
                      onChange={(e) =>
                        setForm({ ...form, secondary_href: e.target.value })
                      }
                      placeholder="/explore"
                      className="w-full rounded-xl border border-theme bg-theme-surface px-4 py-2.5 text-left font-mono text-xs text-theme outline-none transition placeholder:text-theme-muted focus:border-accent"
                    />
                  </div>
                </div>

                {/* Poster */}
                <ImageUploader
                  value={form.poster}
                  onChange={(url) => setForm({ ...form, poster: url })}
                  label="تصویر بنر *"
                  aspect={16 / 9}
                />

                {/* Video URL */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                    آدرس ویدیو (اختیاری - mp4)
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={form.video}
                    onChange={(e) =>
                      setForm({ ...form, video: e.target.value })
                    }
                    placeholder="/videos/hero.mp4"
                    className="w-full rounded-xl border border-theme bg-theme-surface px-4 py-2.5 text-left font-mono text-xs text-theme outline-none transition placeholder:text-theme-muted focus:border-accent"
                  />
                </div>

                {/* Active */}
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
                    اسلاید فعال باشد
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
                      : "افزودن اسلاید"}
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