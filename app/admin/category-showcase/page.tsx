"use client";

import { useEffect, useRef, useState } from "react";
import CategoryShowcase, {
  CategoryShowcaseData,
  DEFAULT_CATEGORY_SHOWCASE,
} from "@/components/CategoryShowcase";
import { getAppContent, setAppContent } from "@/lib/supabase/appContent";
import { createClient } from "@/lib/supabase/client";

const KEY = "category_showcase";
const BUCKET = "products";
const FOLDER = "category-showcase";

export default function AdminCategoryShowcasePage() {
  const [data, setData] = useState<CategoryShowcaseData>(
    DEFAULT_CATEGORY_SHOWCASE
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const itemKeyRef = useRef<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const saved = await getAppContent<CategoryShowcaseData>(KEY);
        if (saved) setData(saved);
      } catch (e) {
        console.error("load error", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleImagePick = (key: string) => {
    itemKeyRef.current = key;
    fileRef.current?.click();
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const key = itemKeyRef.current;
    if (!file || !key) return;

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${FOLDER}/${key}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: true, cacheControl: "3600" });
      if (error) throw error;

      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
      const next = data.items.map((it) =>
        it.key === key ? { ...it, image: pub.publicUrl } : it
      );
      setData({ items: next });
    } catch (err: any) {
      alert("خطا در آپلود: " + (err?.message ?? err));
    } finally {
      if (fileRef.current) fileRef.current.value = "";
      itemKeyRef.current = null;
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
      <div className="sticky top-0 z-50 flex items-center justify-between gap-3 border-b border-white/10 bg-black/80 px-4 py-3 backdrop-blur">
        <h1 className="text-xs font-bold text-white md:text-sm">
          ویرایش «بلک داگ» — CategoryShowcase
        </h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              if (confirm("بازگردانی به حالت پیش‌فرض؟")) {
                setData(DEFAULT_CATEGORY_SHOWCASE);
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

      <p className="border-b border-white/5 bg-amber-500/10 px-4 py-2 text-center text-[11px] text-amber-200">
        پیش‌نمایش زنده بالا · پنل ویرایش پایین (نام، زیرنویس، تصویر)
      </p>

      <CategoryShowcase
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