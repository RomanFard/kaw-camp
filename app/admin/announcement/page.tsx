"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { getAppContent } from "@/lib/actions/appContent";
import { createClient } from "@/lib/supabase/client";
import {
  type AnnouncementBar,
  type AnnouncementMessage,
  DEFAULT_ANNOUNCEMENT_BAR,
} from "@/lib/contentTypes";

const CONTENT_KEY = "announcement_bar";

export default function AnnouncementAdminPage() {
  const supabase = createClient();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [data, setData] = useState<AnnouncementBar>(DEFAULT_ANNOUNCEMENT_BAR);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // ─── بارگذاری ───
  useEffect(() => {
    (async () => {
      const stored = await getAppContent<AnnouncementBar>(CONTENT_KEY);
      if (stored) setData({ ...DEFAULT_ANNOUNCEMENT_BAR, ...stored });
      setLoading(false);
    })();
  }, []);

  // ─── ذخیره ───
  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const { error } = await supabase
        .from("app_content")
        .upsert(
          { key: CONTENT_KEY, data: data },
          { onConflict: "key" }
        );
      if (error) throw error;
      setMessage({ type: "ok", text: "✅ با موفقیت ذخیره شد" });
      setTimeout(() => setMessage(null), 3000);
    } catch (e: any) {
      console.error("Supabase error:", {
        message: e?.message,
        details: e?.details,
        hint: e?.hint,
        code: e?.code,
        full: JSON.stringify(e, null, 2),
      });
      setMessage({
        type: "err",
        text: `❌ خطا: ${e?.message || "نامشخص"} ${e?.hint ? `(${e.hint})` : ""}`,
      });
    } finally {
      setSaving(false);
    }
  }

  // ─── پیام‌ها ───
  function addMessage() {
    setData((d) => ({
      ...d,
      messages: [...d.messages, { text: "", href: "" }],
    }));
  }

  function removeMessage(i: number) {
    setData((d) => ({
      ...d,
      messages: d.messages.filter((_, idx) => idx !== i),
    }));
  }

  function updateMessage(i: number, patch: Partial<AnnouncementMessage>) {
    setData((d) => ({
      ...d,
      messages: d.messages.map((m, idx) => (idx === i ? { ...m, ...patch } : m)),
    }));
  }

  function moveMessage(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= data.messages.length) return;
    setData((d) => {
      const copy = [...d.messages];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return { ...d, messages: copy };
    });
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-theme" dir="rtl">
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
        <main className="flex-1 p-6 md:p-10">
          <p className="text-theme-muted">در حال بارگذاری...</p>
        </main>
      </div>
    );
  }

  const firstMsg = data.messages[0];

  return (
    <div className="flex min-h-screen bg-theme" dir="rtl">
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

      <main className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-4xl">
          {/* ═══ هدر ═══ */}
          <div className="mb-8 flex items-center gap-3">
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
              <h1 className="text-2xl font-extrabold text-theme md:text-3xl">
                📢 نوار اعلان
              </h1>
              <p className="mt-1 text-sm text-theme-muted">
                متن نوار بالای سایت رو مدیریت کن
              </p>
            </div>
          </div>

          {/* ═══ پیش‌نمایش زنده ═══ */}
          <div className="mb-8 overflow-hidden rounded-2xl border border-theme bg-theme-card">
            <div className="border-b border-theme px-5 py-3">
              <h2 className="text-sm font-bold text-theme-muted">پیش‌نمایش</h2>
            </div>
            <div className="bg-theme-surface py-3">
              {data.enabled && firstMsg ? (
                <div className="flex items-center justify-center px-6">
                  {firstMsg.href ? (
                    <a
                      href={firstMsg.href}
                      className="text-center text-[13px] font-medium text-theme underline underline-offset-2"
                    >
                      {firstMsg.text || "(متن خالی)"}
                    </a>
                  ) : (
                    <span className="text-center text-[13px] font-medium text-theme">
                      {firstMsg.text || "(متن خالی)"}
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-center text-xs text-theme-muted">
                  {data.enabled ? "پیامی وجود ندارد" : "نوار اعلان غیرفعال است"}
                </p>
              )}
            </div>
          </div>

          {/* ═══ تنظیمات ═══ */}
          <div className="space-y-6">
            {/* فعال/غیرفعال */}
            <div className="rounded-2xl border border-theme bg-theme-card p-5">
              <label className="flex cursor-pointer items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-theme">فعال باشد</p>
                  <p className="mt-0.5 text-xs text-theme-muted">
                    اگه غیرفعال کنی، نوار بالای سایت نمایش داده نمی‌شه
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setData((d) => ({ ...d, enabled: !d.enabled }))}
                  className={
                    "relative h-6 w-11 rounded-full transition " +
                    (data.enabled ? "bg-accent" : "bg-theme-surface border border-theme")
                  }
                >
                  <span
                    className={
                      "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all " +
                      (data.enabled ? "left-0.5" : "right-0.5")
                    }
                  />
                </button>
              </label>
            </div>

            {/* لیست پیام‌ها */}
            <div className="rounded-2xl border border-theme bg-theme-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-theme">پیام‌ها</p>
                  <p className="mt-0.5 text-xs text-theme-muted">
                    می‌تونی چند تا پیام داشته باشی، به‌ترتیب چرخش نمایش داده می‌شن
                  </p>
                </div>
                <span className="rounded-full bg-theme-surface px-3 py-1 text-xs font-bold text-theme-muted">
                  {data.messages.length} پیام
                </span>
              </div>

              {data.messages.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-theme bg-theme-surface/50 p-8 text-center">
                  <p className="text-xs text-theme-muted">هنوز پیامی اضافه نشده</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.messages.map((msg, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-theme bg-theme-surface/40 p-3"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-theme-muted">
                          پیام {i + 1}
                        </span>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => moveMessage(i, -1)}
                            disabled={i === 0}
                            className="rounded-md border border-theme bg-theme-card px-2 py-1 text-xs text-theme-muted transition hover:border-accent disabled:opacity-30"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moveMessage(i, 1)}
                            disabled={i === data.messages.length - 1}
                            className="rounded-md border border-theme bg-theme-card px-2 py-1 text-xs text-theme-muted transition hover:border-accent disabled:opacity-30"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => removeMessage(i)}
                            className="rounded-md border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs font-bold text-red-500 transition hover:bg-red-500/20"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      <input
                        type="text"
                        value={msg.text}
                        onChange={(e) => updateMessage(i, { text: e.target.value })}
                        placeholder="متن پیام (مثلاً: ۱۵٪ تخفیف...)"
                        className="mb-2 w-full rounded-lg border border-theme bg-theme-card px-3 py-2 text-xs text-theme outline-none focus:border-accent"
                      />

                      <input
                        type="text"
                        value={msg.href ?? ""}
                        onChange={(e) => updateMessage(i, { href: e.target.value })}
                        placeholder="لینک (اختیاری، مثلاً /#newsletter)"
                        className="w-full rounded-lg border border-theme bg-theme-card px-3 py-2 text-xs text-theme-muted outline-none focus:border-accent"
                        dir="ltr"
                      />
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={addMessage}
                className="mt-3 w-full rounded-lg border-2 border-dashed border-theme bg-theme-card py-2 text-xs font-bold text-theme-muted transition hover:border-accent hover:bg-accent/10 hover:text-accent"
              >
                ➕ افزودن پیام
              </button>
            </div>

            {/* سرعت چرخش */}
            <div className="rounded-2xl border border-theme bg-theme-card p-5">
              <p className="mb-3 text-sm font-bold text-theme">
                سرعت چرخش بین پیام‌ها
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "۳ ثانیه", value: 3000 },
                  { label: "۵ ثانیه", value: 5000 },
                  { label: "۸ ثانیه", value: 8000 },
                  { label: "۱۰ ثانیه", value: 10000 },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setData((d) => ({ ...d, rotateInterval: opt.value }))}
                    className={
                      "rounded-lg border px-4 py-2 text-xs font-bold transition " +
                      (data.rotateInterval === opt.value
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-theme bg-theme-surface text-theme-muted hover:border-accent")
                    }
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* پیام وضعیت */}
            {message && (
              <div
                className={
                  "rounded-xl border p-4 text-sm font-bold " +
                  (message.type === "ok"
                    ? "border-green-500/30 bg-green-500/10 text-green-600"
                    : "border-red-500/30 bg-red-500/10 text-red-500")
                }
              >
                {message.text}
              </div>
            )}

            {/* دکمه ذخیره */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setData(DEFAULT_ANNOUNCEMENT_BAR)}
                className="rounded-xl border border-theme bg-theme-card px-5 py-3 text-sm font-bold text-theme-muted transition hover:border-accent hover:text-accent"
              >
                بازنشانی به پیش‌فرض
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-50"
              >
                {saving ? "در حال ذخیره..." : "💾 ذخیره تغییرات"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}