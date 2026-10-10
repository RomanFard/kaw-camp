"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/context/ToastContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                  📄 مدیریت بخش «درباره ما»
                </h1>
                <p className="mt-1 text-xs text-theme-muted">
                  این بخش در صفحه اصلی بین بنر و برندها نمایش داده می‌شود
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || loading || !data}
              className="rounded-xl bg-accent px-6 py-2.5 text-xs font-black text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "در حال ذخیره..." : "💾 ذخیره تغییرات"}
            </button>
          </div>

          {/* لودینگ */}
          {loading ? (
            <div className="rounded-2xl border border-theme bg-theme-card p-12 text-center text-xs text-theme-muted">
              در حال بارگذاری...
            </div>
          ) : !data ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
              <p className="text-sm font-bold text-red-500">
                ⚠️ بخش «درباره ما» پیدا نشد. اول SQL رو اجرا کن.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-5">
              {/* ═══ بخش متن ═══ */}
              <div className="rounded-2xl border border-theme bg-theme-card p-5 shadow-sm md:p-6">
                <h2 className="mb-4 text-sm font-black text-theme md:text-base">
                  📝 متن‌ها
                </h2>

                <div className="space-y-4">
                  {/* Badge */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                      بج بالا (Badge)
                    </label>
                    <input
                      type="text"
                      value={data.badge}
                      onChange={(e) => update("badge", e.target.value)}
                      placeholder="از سال ۱۳۸۹"
                      className="w-full rounded-xl border border-theme bg-theme-surface px-4 py-2.5 text-xs text-theme outline-none transition placeholder:text-theme-muted focus:border-accent"
                    />
                  </div>

                  {/* عنوان */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                        عنوان خط اول *
                      </label>
                      <input
                        type="text"
                        required
                        value={data.title_line1}
                        onChange={(e) => update("title_line1", e.target.value)}
                        placeholder="ساخته شده با"
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
                        value={data.title_line2}
                        onChange={(e) => update("title_line2", e.target.value)}
                        placeholder="عشق به طبیعت"
                        className="w-full rounded-xl border border-theme bg-theme-surface px-4 py-2.5 text-xs text-theme outline-none transition placeholder:text-theme-muted focus:border-accent"
                      />
                    </div>
                  </div>

                  {/* پاراگراف ۱ */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                      پاراگراف اول
                    </label>
                    <textarea
                      rows={3}
                      value={data.paragraph_1}
                      onChange={(e) => update("paragraph_1", e.target.value)}
                      className="w-full resize-none rounded-xl border border-theme bg-theme-surface px-4 py-2.5 text-xs leading-7 text-theme outline-none transition focus:border-accent"
                    />
                  </div>

                  {/* پاراگراف ۲ */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-theme-muted">
                      پاراگراف دوم
                    </label>
                    <textarea
                      rows={2}
                      value={data.paragraph_2}
                      onChange={(e) => update("paragraph_2", e.target.value)}
                      className="w-full resize-none rounded-xl border border-theme bg-theme-surface px-4 py-2.5 text-xs leading-7 text-theme outline-none transition focus:border-accent"
                    />
                  </div>
                </div>
              </div>

              {/* ═══ بخش تصویر ═══ */}
              <div className="rounded-2xl border border-theme bg-theme-card p-5 shadow-sm md:p-6">
                <h2 className="mb-4 text-sm font-black text-theme md:text-base">
                  🖼️ تصویر
                </h2>
                <ImageUploader
                  value={data.image}
                  onChange={(url) => update("image", url)}
                  label="تصویر بخش درباره ما *"
                />
              </div>

              {/* ═══ آمار (۳ کارت) ═══ */}
              <div className="rounded-2xl border border-theme bg-theme-card p-5 shadow-sm md:p-6">
                <h2 className="mb-4 text-sm font-black text-theme md:text-base">
                  📊 آمار (۳ کارت)
                </h2>

                <div className="grid gap-4 md:grid-cols-3">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="space-y-3 rounded-xl border border-theme bg-theme-surface/50 p-4"
                    >
                      <p className="text-[10px] font-black uppercase text-theme-muted">
                        کارت {n.toLocaleString("fa-IR")}
                      </p>
                      <div>
                        <label className="mb-1 block text-[10px] font-bold text-theme-muted">
                          مقدار
                        </label>
                        <input
                          type="text"
                          value={
                            data[`stat_${n}_value` as keyof AboutSection]
                          }
                          onChange={(e) =>
                            update(
                              `stat_${n}_value` as keyof AboutSection,
                              e.target.value
                            )
                          }
                          placeholder="۱۵"
                          className="w-full rounded-lg border border-theme bg-theme-card px-3 py-2 text-center text-lg font-black text-accent outline-none transition focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-bold text-theme-muted">
                          برچسب
                        </label>
                        <input
                          type="text"
                          value={
                            data[`stat_${n}_label` as keyof AboutSection]
                          }
                          onChange={(e) =>
                            update(
                              `stat_${n}_label` as keyof AboutSection,
                              e.target.value
                            )
                          }
                          placeholder="سال تجربه"
                          className="w-full rounded-lg border border-theme bg-theme-card px-3 py-2 text-center text-xs text-theme outline-none transition focus:border-accent"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ═══ دکمه‌های CTA ═══ */}
              <div className="rounded-2xl border border-theme bg-theme-card p-5 shadow-sm md:p-6">
                <h2 className="mb-4 text-sm font-black text-theme md:text-base">
                  🎯 دکمه‌ها
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3 rounded-xl border border-theme bg-theme-surface/50 p-4">
                    <p className="text-[10px] font-black uppercase text-accent">
                      دکمه اصلی
                    </p>
                    <div>
                      <label className="mb-1 block text-[10px] font-bold text-theme-muted">
                        متن
                      </label>
                      <input
                        type="text"
                        value={data.primary_label}
                        onChange={(e) =>
                          update("primary_label", e.target.value)
                        }
                        placeholder="درباره ما"
                        className="w-full rounded-lg border border-theme bg-theme-card px-3 py-2 text-xs text-theme outline-none transition focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-bold text-theme-muted">
                        لینک
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={data.primary_href}
                        onChange={(e) =>
                          update("primary_href", e.target.value)
                        }
                        placeholder="/about"
                        className="w-full rounded-lg border border-theme bg-theme-card px-3 py-2 text-left font-mono text-xs text-theme outline-none transition focus:border-accent"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 rounded-xl border border-theme bg-theme-surface/50 p-4">
                    <p className="text-[10px] font-black uppercase text-theme-muted">
                      دکمه دوم
                    </p>
                    <div>
                      <label className="mb-1 block text-[10px] font-bold text-theme-muted">
                        متن
                      </label>
                      <input
                        type="text"
                        value={data.secondary_label}
                        onChange={(e) =>
                          update("secondary_label", e.target.value)
                        }
                        placeholder="تماس با ما"
                        className="w-full rounded-lg border border-theme bg-theme-card px-3 py-2 text-xs text-theme outline-none transition focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-bold text-theme-muted">
                        لینک
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={data.secondary_href}
                        onChange={(e) =>
                          update("secondary_href", e.target.value)
                        }
                        placeholder="/contact"
                        className="w-full rounded-lg border border-theme bg-theme-card px-3 py-2 text-left font-mono text-xs text-theme outline-none transition focus:border-accent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* خطا */}
              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-bold text-red-500">
                  ⚠️ {error}
                </div>
              )}

              {/* دکمه ذخیره پایین */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-accent px-8 py-3 text-xs font-black text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? "در حال ذخیره..." : "💾 ذخیره تغییرات"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}