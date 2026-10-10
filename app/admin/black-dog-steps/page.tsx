"use client";

import { useEffect, useRef, useState } from "react";
import BlackDogSteps, {
  BlackDogStepsData,
  DEFAULT_BLACK_DOG_STEPS,
} from "@/components/BlackDogSteps";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { getAppContent, setAppContent } from "@/lib/supabase/appContent";
import { createClient } from "@/lib/supabase/client";

const KEY = "black_dog_steps";
const BUCKET = "products";
const FOLDER = "black-dog-steps";

export default function AdminBlackDogStepsPage() {
  const [data, setData] = useState<BlackDogStepsData>(DEFAULT_BLACK_DOG_STEPS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const stepIndexRef = useRef<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const saved = await getAppContent<BlackDogStepsData>(KEY);
        if (saved) setData(saved);
      } catch (e) {
        console.error("load error", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleImagePick = (i: number) => {
    stepIndexRef.current = i;
    fileRef.current?.click();
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const idx = stepIndexRef.current;
    if (!file || idx === null) return;

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${FOLDER}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: true, cacheControl: "3600" });
      if (error) throw error;

      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
      const steps = data.steps.map((s, i) =>
        i === idx ? { ...s, image: pub.publicUrl } : s
      );
      setData({ ...data, steps });
    } catch (err: any) {
      alert("خطا در آپلود: " + (err?.message ?? err));
    } finally {
      if (fileRef.current) fileRef.current.value = "";
      stepIndexRef.current = null;
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setAppContent(KEY, data);
      alert("ذخیره شد ✅");
    } catch (err: any) {
      alert("خطا: " + (err?.message ?? err));
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm("بازگردانی به حالت پیش‌فرض؟")) {
      setData(DEFAULT_BLACK_DOG_STEPS);
    }
  };

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
      <main className="flex-1 overflow-x-hidden">
        {/* Admin bar - sticky */}
        <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-theme bg-theme-card/80 px-4 py-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {/* دکمه منو موبایل */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-theme bg-theme-card text-theme transition hover:bg-theme-surface md:hidden"
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

            <h1 className="text-xs font-bold text-theme md:text-sm">
              🏕️ ویرایش «چقدر سریع برپاش می‌کنی؟»
            </h1>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg border border-theme bg-theme-card px-3 py-1.5 text-xs font-bold text-theme-muted transition hover:text-theme"
            >
              بازگردانی
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-accent px-4 py-1.5 text-xs font-bold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "در حال ذخیره…" : "💾 ذخیره"}
            </button>
          </div>
        </div>

        {/* راهنما */}
        <p className="border-b border-theme bg-accent/10 px-4 py-2 text-center text-[11px] text-accent">
          روی متن‌ها کلیک کن و ویرایش کن · برای تغییر عکس، روی تصویر هاور کن
        </p>

        {/* لودینگ */}
        {loading ? (
          <div className="flex min-h-[60vh] items-center justify-center text-xs text-theme-muted">
            در حال بارگذاری…
          </div>
        ) : (
          <BlackDogSteps
            data={data}
            editable
            onChange={setData}
            onImagePick={handleImagePick}
          />
        )}
      </main>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}