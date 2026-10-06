"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/context/ToastContext";
import ImageUploader from "@/components/admin/ImageUploader";
import {
  getAboutSection,
  updateAboutSection,
  type AboutSection,
} from "@/lib/supabase/aboutSection";

export default function AboutAdminPage() {
  const toast = useToast();
  const [data, setData] = useState<AboutSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const result = await getAboutSection();
    setData(result);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function update<K extends keyof AboutSection>(
    key: K,
    value: AboutSection[K]
  ) {
    if (!data) return;
    setData({ ...data, [key]: value });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!data) return;
    setError("");

    if (!data.title_line1.trim()) return setError("عنوان خط اول الزامی است");
    if (!data.title_line2.trim()) return setError("عنوان خط دوم الزامی است");
    if (!data.image.trim()) return setError("تصویر الزامی است");

    setSaving(true);
    const { id, ...rest } = data;
    const { error: updateError } = await updateAboutSection(id, rest);

    if (updateError) {
      setError("خطا: " + updateError.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    toast.success("بخش درباره ما ذخیره شد");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] p-12 text-center text-zinc-500">
        در حال بارگذاری...
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[#050505] p-12 text-center">
        <p className="text-red-500">
          بخش «درباره ما» پیدا نشد. اول SQL رو اجرا کن.
        </p>
        <a
          href="/admin"
          className="mt-4 inline-block rounded-lg bg-[#E84C4C] px-5 py-2 text-white"
        >
          بازگشت
        </a>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505]">
      <div className="mx-auto max-w-5xl px-6 py-8">
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
              📄 مدیریت بخش «درباره ما»
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              این بخش در صفحه اصلی بین بنر و برندها نمایش داده می‌شود
            </p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-[#E84C4C] px-6 py-2.5 text-sm font-black text-white transition hover:bg-[#D63F3F] disabled:opacity-50"
          >
            {saving ? "در حال ذخیره..." : "💾 ذخیره تغییرات"}
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* ═══ بخش متن ═══ */}
          <div className="rounded-2xl border border-zinc-800 bg-[#0A0A0A] p-5 md:p-6">
            <h2 className="mb-4 text-sm font-black text-white md:text-base">
              📝 متن‌ها
            </h2>

            <div className="space-y-4">
              {/* Badge */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-zinc-400">
                  بج بالا (Badge)
                </label>
                <input
                  type="text"
                  value={data.badge}
                  onChange={(e) => update("badge", e.target.value)}
                  placeholder="از سال ۱۳۸۹"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2.5 text-sm text-white outline-none focus:border-[#E84C4C]"
                />
              </div>

              {/* عنوان */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-zinc-400">
                    عنوان خط اول *
                  </label>
                  <input
                    type="text"
                    required
                    value={data.title_line1}
                    onChange={(e) => update("title_line1", e.target.value)}
                    placeholder="ساخته شده با"
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
                    value={data.title_line2}
                    onChange={(e) => update("title_line2", e.target.value)}
                    placeholder="عشق به طبیعت"
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2.5 text-sm text-white outline-none focus:border-[#E84C4C]"
                  />
                </div>
              </div>

              {/* پاراگراف ۱ */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-zinc-400">
                  پاراگراف اول
                </label>
                <textarea
                  rows={3}
                  value={data.paragraph_1}
                  onChange={(e) => update("paragraph_1", e.target.value)}
                  className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2.5 text-sm leading-7 text-white outline-none focus:border-[#E84C4C]"
                />
              </div>

              {/* پاراگراف ۲ */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-zinc-400">
                  پاراگراف دوم
                </label>
                <textarea
                  rows={2}
                  value={data.paragraph_2}
                  onChange={(e) => update("paragraph_2", e.target.value)}
                  className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2.5 text-sm leading-7 text-white outline-none focus:border-[#E84C4C]"
                />
              </div>
            </div>
          </div>

          {/* ═══ بخش تصویر ═══ */}
          <div className="rounded-2xl border border-zinc-800 bg-[#0A0A0A] p-5 md:p-6">
            <h2 className="mb-4 text-sm font-black text-white md:text-base">
              🖼️ تصویر
            </h2>
            <ImageUploader
              value={data.image}
              onChange={(url) => update("image", url)}
              label="تصویر بخش درباره ما *"
            />
          </div>

          {/* ═══ آمار (۳ کارت) ═══ */}
          <div className="rounded-2xl border border-zinc-800 bg-[#0A0A0A] p-5 md:p-6">
            <h2 className="mb-4 text-sm font-black text-white md:text-base">
              📊 آمار (۳ کارت)
            </h2>

            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4"
                >
                  <p className="text-[10px] font-black uppercase text-zinc-500">
                    کارت {n.toLocaleString("fa-IR")}
                  </p>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold text-zinc-500">
                      مقدار
                    </label>
                    <input
                      type="text"
                      value={data[`stat_${n}_value` as keyof AboutSection]}
                      onChange={(e) =>
                        update(
                          `stat_${n}_value` as keyof AboutSection,
                          e.target.value
                        )
                      }
                      placeholder="۱۵"
                      className="w-full rounded-lg border border-zinc-800 bg-[#0A0A0A] px-3 py-2 text-center text-lg font-black text-[#E84C4C] outline-none focus:border-[#E84C4C]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold text-zinc-500">
                      برچسب
                    </label>
                    <input
                      type="text"
                      value={data[`stat_${n}_label` as keyof AboutSection]}
                      onChange={(e) =>
                        update(
                          `stat_${n}_label` as keyof AboutSection,
                          e.target.value
                        )
                      }
                      placeholder="سال تجربه"
                      className="w-full rounded-lg border border-zinc-800 bg-[#0A0A0A] px-3 py-2 text-center text-xs text-white outline-none focus:border-[#E84C4C]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ═══ دکمه‌های CTA ═══ */}
          <div className="rounded-2xl border border-zinc-800 bg-[#0A0A0A] p-5 md:p-6">
            <h2 className="mb-4 text-sm font-black text-white md:text-base">
              🎯 دکمه‌ها
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
                <p className="text-[10px] font-black uppercase text-[#E84C4C]">
                  دکمه اصلی
                </p>
                <div>
                  <label className="mb-1 block text-[10px] font-bold text-zinc-500">
                    متن
                  </label>
                  <input
                    type="text"
                    value={data.primary_label}
                    onChange={(e) => update("primary_label", e.target.value)}
                    placeholder="درباره ما"
                    className="w-full rounded-lg border border-zinc-800 bg-[#0A0A0A] px-3 py-2 text-sm text-white outline-none focus:border-[#E84C4C]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold text-zinc-500">
                    لینک
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={data.primary_href}
                    onChange={(e) => update("primary_href", e.target.value)}
                    placeholder="/about"
                    className="w-full rounded-lg border border-zinc-800 bg-[#0A0A0A] px-3 py-2 text-left font-mono text-xs text-white outline-none focus:border-[#E84C4C]"
                  />
                </div>
              </div>

              <div className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
                <p className="text-[10px] font-black uppercase text-zinc-500">
                  دکمه دوم
                </p>
                <div>
                  <label className="mb-1 block text-[10px] font-bold text-zinc-500">
                    متن
                  </label>
                  <input
                    type="text"
                    value={data.secondary_label}
                    onChange={(e) => update("secondary_label", e.target.value)}
                    placeholder="تماس با ما"
                    className="w-full rounded-lg border border-zinc-800 bg-[#0A0A0A] px-3 py-2 text-sm text-white outline-none focus:border-[#E84C4C]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold text-zinc-500">
                    لینک
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={data.secondary_href}
                    onChange={(e) => update("secondary_href", e.target.value)}
                    placeholder="/contact"
                    className="w-full rounded-lg border border-zinc-800 bg-[#0A0A0A] px-3 py-2 text-left font-mono text-xs text-white outline-none focus:border-[#E84C4C]"
                  />
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm font-bold text-red-500">
              ⚠️ {error}
            </div>
          )}

          {/* Save Button پایین */}
          <div className="flex justify-end gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#E84C4C] px-8 py-3 text-sm font-black text-white transition hover:bg-[#D63F3F] disabled:opacity-50"
            >
              {saving ? "در حال ذخیره..." : "💾 ذخیره تغییرات"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

