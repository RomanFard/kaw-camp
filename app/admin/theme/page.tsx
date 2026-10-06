"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/context/ToastContext";
import { useSiteSettings } from "@/components/context/SiteSettingsContext";
import {
  getSiteSettings,
  updateSiteSettings,
  type SiteSettings,
} from "@/lib/supabase/siteSettings";

const COLOR_PRESETS = [
  { name: "قرمز کورال", value: "#E84C4C", hover: "#D63F3F" },
  { name: "نارنجی TorqueX", value: "#F97316", hover: "#EA580C" },
  { name: "سبز نعنایی", value: "#6ECB9E", hover: "#5AB88A" },
  { name: "آبی حرفه‌ای", value: "#3B82F6", hover: "#2563EB" },
  { name: "بنفش مدرن", value: "#8B5CF6", hover: "#7C3AED" },
  { name: "زرد کهربایی", value: "#F59E0B", hover: "#D97706" },
  { name: "صورتی", value: "#EC4899", hover: "#DB2777" },
  { name: "طلایی", value: "#C9A961", hover: "#A88840" },
];

export default function ThemeAdminPage() {
  const toast = useToast();
  const { refresh } = useSiteSettings();
  const [data, setData] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const result = await getSiteSettings();
    setData(result);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function update<K extends keyof SiteSettings>(
    key: K,
    value: SiteSettings[K]
  ) {
    setData((prev) => (prev ? { ...prev, [key]: value } : prev));
  }
    // ─── پیش‌نمایش زنده رنگ ───
  useEffect(() => {
    if (!data) return;
    const root = document.documentElement;
    root.style.setProperty("--accent", data.accent_color);
    root.style.setProperty("--accent-hover", data.accent_hover);
  }, [data?.accent_color, data?.accent_hover]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!data) return;
    setError("");
    setSaving(true);

    const { id, ...rest } = data;
    const { error: updateError } = await updateSiteSettings(id, rest);

    if (updateError) {
      setError("خطا: " + updateError.message);
      setSaving(false);
      return;
    }

    await refresh();
    setSaving(false);
    toast.success("تنظیمات تم ذخیره شد");
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
        <p className="text-red-500">تنظیمات پیدا نشد. اول SQL رو اجرا کن.</p>
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
              🎨 تنظیمات تم
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              رنگ اصلی سایت و بک‌گراند لایو رو از اینجا تنظیم کن
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-[#E84C4C] px-6 py-2.5 text-sm font-black text-white transition hover:bg-[#D63F3F] disabled:opacity-50"
          >
            {saving ? "در حال ذخیره..." : "💾 ذخیره تغییرات"}
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* ═══ پالت آماده ═══ */}
          <div className="rounded-2xl border border-zinc-800 bg-[#0A0A0A] p-5 md:p-6">
            <h2 className="mb-4 text-sm font-black text-white md:text-base">
              🎯 پالت‌های آماده
            </h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {COLOR_PRESETS.map((preset) => {
                const isActive =
                  data.accent_color.toLowerCase() ===
                  preset.value.toLowerCase();
                return (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => {
                      update("accent_color", preset.value);
                      update("accent_hover", preset.hover);
                    }}
                    className={`group rounded-xl border p-4 text-center transition ${
                      isActive
                        ? "border-white/40 bg-white/5"
                        : "border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    <div
                      className="mx-auto h-12 w-12 rounded-full shadow-lg transition group-hover:scale-110"
                      style={{
                        backgroundColor: preset.value,
                        boxShadow: `0 0 20px ${preset.value}40`,
                      }}
                    />
                    <p className="mt-3 text-xs font-bold text-white">
                      {preset.name}
                    </p>
                    <p className="mt-1 font-mono text-[10px] text-zinc-500">
                      {preset.value}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ═══ رنگ سفارشی ═══ */}
          <div className="rounded-2xl border border-zinc-800 bg-[#0A0A0A] p-5 md:p-6">
            <h2 className="mb-4 text-sm font-black text-white md:text-base">
              🎨 رنگ سفارشی
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold text-zinc-400">
                  رنگ اصلی
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={data.accent_color}
                    onChange={(e) => {
                      const val = e.target.value;
                      update("accent_color", val);
                      const hover = shadeColor(val, -12);
                      update("accent_hover", hover);
                    }}
                    className="h-11 w-16 cursor-pointer rounded-lg border border-zinc-800 bg-zinc-950"
                  />
                  <input
                    type="text"
                    value={data.accent_color}
                    onChange={(e) => update("accent_color", e.target.value)}
                    dir="ltr"
                    className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2.5 font-mono text-sm text-white outline-none focus:border-[#E84C4C]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-zinc-400">
                  رنگ Hover
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={data.accent_hover}
                    onChange={(e) => update("accent_hover", e.target.value)}
                    className="h-11 w-16 cursor-pointer rounded-lg border border-zinc-800 bg-zinc-950"
                  />
                  <input
                    type="text"
                    value={data.accent_hover}
                    onChange={(e) => update("accent_hover", e.target.value)}
                    dir="ltr"
                    className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2.5 font-mono text-sm text-white outline-none focus:border-[#E84C4C]"
                  />
                </div>
              </div>
            </div>

            {/* پیش‌نمایش */}
            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
              <span className="text-xs text-zinc-500">پیش‌نمایش:</span>
              <button
                type="button"
                style={{ backgroundColor: data.accent_color }}
                className="rounded-lg px-4 py-2 text-xs font-bold text-white"
              >
                دکمه نمونه
              </button>
              <button
                type="button"
                style={{ backgroundColor: data.accent_hover }}
                className="rounded-lg px-4 py-2 text-xs font-bold text-white"
              >
                دکمه Hover
              </button>
              <span
                className="text-sm font-black"
                style={{ color: data.accent_color }}
              >
                متن رنگی
              </span>
            </div>
          </div>

          {/* ═══ بک‌گراند لایو ═══ */}
          <div className="rounded-2xl border border-zinc-800 bg-[#0A0A0A] p-5 md:p-6">
            <h2 className="mb-4 text-sm font-black text-white md:text-base">
              ✨ بک‌گراند لایو
            </h2>

            <div className="space-y-5">
              {/* نوع */}
              <div>
                <label className="mb-2 block text-xs font-bold text-zinc-400">
                  نوع انیمیشن
                </label>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                  {[
                    {
                      value: "sparks",
                      title: "🔥 جرقه‌های آتش",
                      desc: "جرقه‌های رنگی که به بالا می‌رن",
                    },
                    {
                      value: "night",
                      title: "🌌 آسمان شب",
                      desc: "راه شیری + ستاره‌ها + شهاب",
                    },
                    {
                      value: "snow",
                      title: "❄️ بارش برف",
                      desc: "دانه‌های برف که آرام می‌بارند",
                    },
                    {
                      value: "none",
                      title: "⛔ بدون انیمیشن",
                      desc: "بک‌گراند ساده و تمیز",
                    },
                  ].map((opt) => {
                    const isActive = data.bg_variant === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          update(
                            "bg_variant",
                            opt.value as SiteSettings["bg_variant"]
                          )
                        }
                        className={`rounded-xl border p-4 text-right transition ${
                          isActive
                            ? "border-[#E84C4C] bg-[#E84C4C]/10"
                            : "border-zinc-800 hover:border-zinc-700"
                        }`}
                      >
                        <p className="text-sm font-black text-white">
                          {opt.title}
                        </p>
                        <p className="mt-1 text-[11px] text-zinc-500">
                          {opt.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* رنگ ذرات */}
              {(data.bg_variant === "sparks" || data.bg_variant === "snow") && (
                <div>
                  <label className="mb-2 block text-xs font-bold text-zinc-400">
                    رنگ ذرات
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={data.bg_color}
                      onChange={(e) => update("bg_color", e.target.value)}
                      className="h-11 w-16 cursor-pointer rounded-lg border border-zinc-800 bg-zinc-950"
                    />
                    <input
                      type="text"
                      value={data.bg_color}
                      onChange={(e) => update("bg_color", e.target.value)}
                      dir="ltr"
                      className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2.5 font-mono text-sm text-white outline-none focus:border-[#E84C4C]"
                    />
                    <button
                      type="button"
                      onClick={() => update("bg_color", data.accent_color)}
                      className="rounded-lg border border-zinc-800 px-3 py-2 text-[11px] font-bold text-zinc-400 transition hover:border-[#E84C4C] hover:text-[#E84C4C]"
                    >
                      = رنگ اصلی
                    </button>
                  </div>
                </div>
              )}

              {/* تعداد ذرات */}
              <div>
                <label className="mb-2 flex items-center justify-between text-xs font-bold text-zinc-400">
                  <span>تعداد ذرات</span>
                  <span className="font-mono text-[#E84C4C]">
                    {data.bg_particle_count.toLocaleString("fa-IR")}
                  </span>
                </label>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={data.bg_particle_count}
                  onChange={(e) =>
                    update("bg_particle_count", Number(e.target.value))
                  }
                  className="w-full accent-[#E84C4C]"
                />
                <div className="mt-1 flex justify-between text-[10px] text-zinc-600">
                  <span>۱۰ (سبک)</span>
                  <span>۱۰۰ (سنگین)</span>
                </div>
              </div>

              {/* شدت باد — فقط در حالت برف */}
              {data.bg_variant === "snow" && (
                <div>
                  <label className="mb-2 flex items-center justify-between text-xs font-bold text-zinc-400">
                    <span>❄️ شدت باد</span>
                    <span className="font-mono text-[#E84C4C]">
                      {Number(data.snow_wind_strength || 1).toFixed(1)}
                    </span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={3}
                    step={0.1}
                    value={data.snow_wind_strength || 1}
                    onChange={(e) =>
                      update("snow_wind_strength", Number(e.target.value))
                    }
                    className="w-full accent-[#E84C4C]"
                  />
                  <div className="mt-1 flex justify-between text-[10px] text-zinc-600">
                    <span>۰ (آرام)</span>
                    <span>۳ (طوفانی)</span>
                  </div>
                </div>
              )}

              {/* کیفیت */}
              <div>
                <label className="mb-2 block text-xs font-bold text-zinc-400">
                  کیفیت گرافیک
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "auto", label: "🎯 خودکار" },
                    { value: "high", label: "⭐ بالا" },
                    { value: "medium", label: "⚡ متوسط" },
                    { value: "low", label: "🐢 پایین" },
                  ].map((q) => (
                    <button
                      key={q.value}
                      type="button"
                      onClick={() =>
                        update(
                          "bg_quality",
                          q.value as SiteSettings["bg_quality"]
                        )
                      }
                      className={`rounded-full border px-4 py-1.5 text-[11px] font-bold transition ${
                        data.bg_quality === q.value
                          ? "border-[#E84C4C] bg-[#E84C4C] text-white"
                          : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-[10px] text-zinc-600">
                  خودکار: بر اساس قدرت دستگاه کاربر تنظیم می‌شود
                </p>
              </div>

              {/* فقط در حالت تاریک */}
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
                <input
                  type="checkbox"
                  checked={data.bg_only_dark}
                  onChange={(e) => update("bg_only_dark", e.target.checked)}
                  className="h-4 w-4 accent-[#E84C4C]"
                />
                <div>
                  <p className="text-sm font-bold text-white">
                    فقط در حالت تاریک نمایش بده
                  </p>
                  <p className="mt-0.5 text-[11px] text-zinc-500">
                    در حالت روشن، بک‌گراند ساده و تمیز بمونه
                  </p>
                </div>
              </label>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm font-bold text-red-500">
              ⚠️ {error}
            </div>
          )}

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

function shadeColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
  return (
    "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)
  );
}