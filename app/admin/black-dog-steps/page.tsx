"use client";

import { useEffect, useRef, useState } from "react";
import BlackDogSteps, {
  BlackDogStepsData,
  DEFAULT_BLACK_DOG_STEPS,
} from "@/components/BlackDogSteps";
import { getAppContent, setAppContent } from "@/lib/supabase/appContent";
import { createClient } from "@/lib/supabase/client";

const KEY = "black_dog_steps";
const BUCKET = "products";
const FOLDER = "black-dog-steps";

export default function AdminBlackDogStepsPage() {
  const [data, setData] = useState<BlackDogStepsData>(DEFAULT_BLACK_DOG_STEPS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
        در حال بارگذاری…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* ─── Admin bar ─── */}
      <div className="sticky top-0 z-50 flex items-center justify-between gap-3 border-b border-white/10 bg-black/80 px-4 py-3 backdrop-blur">
        <h1 className="text-xs font-bold text-white md:text-sm">
          ویرایش «چقدر سریع برپاش می‌کنی؟»
        </h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              if (confirm("بازگردانی به حالت پیش‌فرض؟")) {
                setData(DEFAULT_BLACK_DOG_STEPS);
              }
            }}
            className="rounded-lg border border-white/20 px-3 py-1.5 text-xs text-white/80 transition hover:bg-white/10"
          >
            بازگردانی
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-bold text-black transition hover:bg-amber-400 disabled:opacity-50"
          >
            {saving ? "در حال ذخیره…" : "ذخیره"}
          </button>
        </div>
      </div>

      {/* ─── Hint ─── */}
      <p className="border-b border-white/5 bg-amber-500/10 px-4 py-2 text-center text-[11px] text-amber-200">
        روی متن‌ها کلیک کن و ویرایش کن · برای تغییر عکس، روی تصویر هاور کن
      </p>

      {/* ─── Live preview (exactly like the public page) ─── */}
      <BlackDogSteps
        data={data}
        editable
        onChange={setData}
        onImagePick={handleImagePick}
      />

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