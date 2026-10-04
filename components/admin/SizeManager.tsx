"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";

export type SizeItem = {
  label: string;
  value: string;
  image?: string;
};

type Props = {
  sizes: SizeItem[];
  onChange: (sizes: SizeItem[]) => void;
};

// ─── سایزهای پیشنهادی ───
const PRESET_SIZES = [
  // پوشاک
  { label: "S", value: "s" },
  { label: "M", value: "m" },
  { label: "L", value: "l" },
  { label: "XL", value: "xl" },
  { label: "XXL", value: "xxl" },
  // کفش
  { label: "۳۸", value: "38" },
  { label: "۳۹", value: "39" },
  { label: "۴۰", value: "40" },
  { label: "۴۱", value: "41" },
  { label: "۴۲", value: "42" },
  { label: "۴۳", value: "43" },
  { label: "۴۴", value: "44" },
  // عمومی
  { label: "کوچک", value: "small" },
  { label: "متوسط", value: "medium" },
  { label: "بزرگ", value: "large" },
  // چادر
  { label: "۱ نفره", value: "1-person" },
  { label: "۲ نفره", value: "2-person" },
  { label: "۳ نفره", value: "3-person" },
  { label: "۴ نفره", value: "4-person" },
];

export default function SizeManager({ sizes, onChange }: Props) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(
    sizes.length > 0 ? 0 : null
  );

  function addSize() {
    const next = [...sizes, { label: "", value: "" }];
    onChange(next);
    setExpandedIndex(next.length - 1);
  }

  function removeSize(index: number) {
    const next = sizes.filter((_, i) => i !== index);
    onChange(next);
    if (expandedIndex === index) {
      setExpandedIndex(next.length > 0 ? 0 : null);
    } else if (expandedIndex !== null && expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
  }

  function updateSize(index: number, patch: Partial<SizeItem>) {
    const next = sizes.map((s, i) => (i === index ? { ...s, ...patch } : s));
    onChange(next);
  }

  function applyPreset(index: number, preset: { label: string; value: string }) {
    updateSize(index, { label: preset.label, value: preset.value });
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold text-gray-700">
        سایز‌بندی محصول
      </label>

      <p className="mb-3 text-xs text-gray-500">
        اگه محصولت سایز یا ظرفیت مختلف داره (مثل پوشاک، کفش، چادر)، اینجا
        اضافه کن. برای هر سایز می‌تونی یه عکس اختصاصی هم آپلود کنی.
      </p>

      {sizes.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-[#D4C5A0] bg-[#F7F1E3]/30 p-6 text-center">
          <p className="text-sm text-gray-500">هنوز سایزی اضافه نشده</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sizes.map((size, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div
                key={index}
                className="rounded-lg border border-[#EDE4CE] bg-[#F7F1E3]/30"
              >
                {/* هدر سایز */}
                <div className="flex items-center justify-between gap-2 border-b border-[#EDE4CE] p-3">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedIndex(isExpanded ? null : index)
                    }
                    className="flex flex-1 items-center gap-3 text-right"
                  >
                    <span className="text-lg">
                      {isExpanded ? "▼" : "▶"}
                    </span>
                    <div className="flex items-center gap-2">
                      {size.image ? (
                        <div className="h-8 w-8 overflow-hidden rounded border border-[#D4C5A0] bg-white">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={size.image}
                            alt={size.label}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded border border-dashed border-[#D4C5A0] bg-white text-xs text-gray-400">
                          —
                        </div>
                      )}
                      <span className="text-sm font-bold text-gray-800">
                        {size.label || "(بدون نام)"}
                      </span>
                      {size.value && (
                        <span className="text-xs text-gray-400" dir="ltr">
                          {size.value}
                        </span>
                      )}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => removeSize(index)}
                    className="rounded-lg border border-red-300 bg-red-50 px-2 py-1 text-[11px] font-bold text-red-700 transition hover:bg-red-100"
                  >
                    🗑️
                  </button>
                </div>

                {/* محتوای گسترده */}
                {isExpanded && (
                  <div className="space-y-3 p-3">
                    {/* پیشنهادها */}
                    <div>
                      <label className="mb-1 block text-[11px] font-bold text-gray-500">
                        پیشنهاد سریع:
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {PRESET_SIZES.map((preset) => (
                          <button
                            key={preset.value}
                            type="button"
                            onClick={() => applyPreset(index, preset)}
                            className="rounded-full border border-[#D4C5A0] bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-700 transition hover:border-amber-500 hover:bg-amber-50 hover:text-amber-700"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* نام + مقدار */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-bold text-gray-600">
                          نام سایز (نمایش) *
                        </label>
                        <input
                          type="text"
                          value={size.label}
                          onChange={(e) =>
                            updateSize(index, { label: e.target.value })
                          }
                          placeholder="XL یا ۴۲"
                          className="w-full rounded-lg border border-[#D4C5A0] bg-white px-3 py-2 text-sm outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-bold text-gray-600">
                          کد سایز
                        </label>
                        <input
                          type="text"
                          dir="ltr"
                          value={size.value}
                          onChange={(e) =>
                            updateSize(index, {
                              value: e.target.value
                                .toLowerCase()
                                .replace(/\s+/g, "-"),
                            })
                          }
                          placeholder="xl"
                          className="w-full rounded-lg border border-[#D4C5A0] bg-white px-3 py-2 font-mono text-left text-sm outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    {/* عکس سایز */}
                    <div>
                      <ImageUploader
                        value={size.image ?? ""}
                        onChange={(url) =>
                          updateSize(index, { image: url || undefined })
                        }
                        label="عکس مخصوص این سایز (اختیاری)"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={addSize}
        className="mt-3 w-full rounded-lg border-2 border-dashed border-[#D4C5A0] bg-white py-3 text-sm font-bold text-gray-600 transition hover:border-amber-500 hover:bg-amber-50 hover:text-amber-700"
      >
        ➕ افزودن سایز جدید
      </button>
    </div>
  );
}