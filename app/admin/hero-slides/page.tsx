"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/context/ToastContext";
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
  const supabase = createClient();
  const toast = useToast();

  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

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
    <main className="min-h-screen bg-[#050505]">
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
              🎬 مدیریت بنر اصلی
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              {slides.length.toLocaleString("fa-IR")} اسلاید
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="rounded-lg bg-[#E84C4C] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#D63F3F]"
          >
            ➕ اسلاید جدید
          </button>
        </div>

        {/* List */}
        {loading ? (
          <div className="rounded-2xl border border-zinc-800 bg-[#0A0A0A] p-12 text-center text-zinc-500">
            در حال بارگذاری...
          </div>
        ) : slides.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-[#0A0A0A] p-12 text-center text-zinc-500">
            هنوز اسلایدی ثبت نشده
          </div>
        ) : (
          <div className="space-y-3">
            {slides.map((slide, idx) => (
              <div
                key={slide.id}
                className="flex flex-wrap items-center gap-4 rounded-2xl border border-zinc-800 bg-[#0A0A0A] p-4"
              >
                {/* Thumb */}
                <div className="h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slide.poster}
                    alt={slide.title_line1}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="min-w-[200px] flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-zinc-600">
                      #{idx + 1}
                    </span>
                    <span className="text-[10px] font-bold text-[#E84C4C]">
                      {slide.eyebrow}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-black text-white">
                    {slide.title_line1} {slide.title_line2}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-zinc-500">
                    {slide.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-shrink-0 items-center gap-2">
                  {/* Move up/down */}
                  <div className="flex flex-col">
                    <button
                      onClick={() => moveUp(slide, idx)}
                      disabled={idx === 0}
                      className="text-xs text-zinc-500 hover:text-white disabled:opacity-30"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveDown(slide, idx)}
                      disabled={idx === slides.length - 1}
                      className="text-xs text-zinc-500 hover:text-white disabled:opacity-30"
                    >
                      ▼
                    </button>
                  </div>

                  {/* Toggle active */}
                  <button
                    onClick={() => handleToggleActive(slide)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      slide.is_active ? "bg-green-500" : "bg-zinc-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                        slide.is_active ? "translate-x-1" : "translate-x-6"
                      }`}
                    />
                  </button>

                  <button
                    onClick={() => openEditModal(slide)}
                    className="rounded-lg border border-[#E84C4C]/40 bg-[#E84C4C]/10 px-3 py-1.5 text-xs font-bold text-[#E84C4C] transition hover:bg-[#E84C4C] hover:text-white"
                  >
                    ✏️ ویرایش
                  </button>
                  <button
                    onClick={() => handleDelete(slide.id, slide.title_line1)}
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

      {/* ═══════ مودال ═══════ */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-zinc-800 bg-[#0A0A0A] p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-black text-white">
                {editingId ? "✏️ ویرایش اسلاید" : "➕ اسلاید جدید"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Eyebrow + Order */}
              <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-zinc-400">
                    متن بالای عنوان (Eyebrow)
                  </label>
                  <input
                    type="text"
                    value={form.eyebrow}
                    onChange={(e) =>
                      setForm({ ...form, eyebrow: e.target.value })
                    }
                    placeholder="KAW CAMP — فروشگاه تخصصی"
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

              {/* Title lines */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-zinc-400">
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
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2.5 text-sm text-white outline-none focus:border-[#E84C4C]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-zinc-400">
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
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2.5 text-sm text-white outline-none focus:border-[#E84C4C]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-zinc-400">
                  توضیحات
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2.5 text-sm text-white outline-none focus:border-[#E84C4C]"
                />
              </div>

              {/* Primary CTA */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-zinc-400">
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
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2.5 text-sm text-white outline-none focus:border-[#E84C4C]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-zinc-400">
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
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2.5 text-left font-mono text-sm text-white outline-none focus:border-[#E84C4C]"
                  />
                </div>
              </div>

              {/* Secondary CTA */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-zinc-400">
                    متن دکمه دوم
                  </label>
                  <input
                    type="text"
                    value={form.secondary_label}
                    onChange={(e) =>
                      setForm({ ...form, secondary_label: e.target.value })
                    }
                    placeholder="آفرود و تور"
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2.5 text-sm text-white outline-none focus:border-[#E84C4C]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-zinc-400">
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
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2.5 text-left font-mono text-sm text-white outline-none focus:border-[#E84C4C]"
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
                <label className="mb-1.5 block text-xs font-bold text-zinc-400">
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
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2.5 text-left font-mono text-xs text-white outline-none focus:border-[#E84C4C]"
                />
              </div>

              {/* Active */}
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
                  اسلاید فعال باشد
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
                  {saving ? "در حال ذخیره..." : editingId ? "ذخیره تغییرات" : "افزودن اسلاید"}
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

