"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";

export type ColorItem = {
  label: string;
  value: string;
  image?: string;
};

type Props = {
  colors: ColorItem[];
  onChange: (colors: ColorItem[]) => void;
};

// ─── رنگ‌های پیشنهادی (برای autocomplete) ───
const PRESET_COLORS = [
  { label: "مشکی", value: "black" },
  { label: "سفید", value: "white" },
  { label: "قرمز", value: "red" },
  { label: "آبی", value: "blue" },
  { label: "سبز", value: "green" },
  { label: "زرد", value: "yellow" },
  { label: "خاکی", value: "khaki" },
  { label: "بژ", value: "beige" },
  { label: "نارنجی", value: "orange" },
  { label: "قهوه‌ای", value: "brown" },
  { label: "طوسی", value: "gray" },
  { label: "صورتی", value: "pink" },
  { label: "بنفش", value: "purple" },
  { label: "سرمه‌ای", value: "navy" },
];

export default function ColorManager({ colors, onChange }: Props) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(
    colors.length > 0 ? 0 : null
  );

  function addColor() {
    const next = [...colors, { label: "", value: "" }];
    onChange(next);
    setExpandedIndex(next.length - 1);
  }

  function removeColor(index: number) {
    const next = colors.filter((_, i) => i !== index);
    onChange(next);
    if (expandedIndex === index) {
      setExpandedIndex(next.length > 0 ? 0 : null);
    } else if (expandedIndex !== null && expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
  }

  function updateColor(index: number, patch: Partial<ColorItem>) {
    const next = colors.map((c, i) => (i === index ? { ...c, ...patch } : c));
    onChange(next);
  }

  // انتخاب از پیشنهادها
  function applyPreset(index: number, preset: { label: string; value: string }) {
    updateColor(index, { label: preset.label, value: preset.value });
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold text-gray-700">
        رنگ‌بندی محصول
      </label>

      <p className="mb-3 text-xs text-gray-500">
        می‌تونی چند رنگ اضافه کنی. برای هر رنگ می‌تونی یه عکس اختصاصی آپلود
        کنی که توی صفحه محصول با انتخاب اون رنگ نمایش داده بشه.
      </p>

      {colors.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-[#D4C5A0] bg-[#F7F1E3]/30 p-6 text-center">
          <p className="text-sm text-gray-500">
            هنوز رنگی اضافه نشده
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {colors.map((color, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div
                key={index}
                className="rounded-lg border border-[#EDE4CE] bg-[#F7F1E3]/30"
              >
                {/* هدر رنگ */}
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
                      {color.image ? (
                        <div className="h-8 w-8 overflow-hidden rounded border border-[#D4C5A0] bg-white">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={color.image}
                            alt={color.label}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded border border-dashed border-[#D4C5A0] bg-white text-xs text-gray-400">
                          —
                        </div>
                      )}
                      <span className="text-sm font-bold text-gray-800">
                        {color.label || "(بدون نام)"}
                      </span>
                      {color.value && (
                        <span
                          className="text-xs text-gray-400"
                          dir="ltr"
                        >
                          {color.value}
                        </span>
                      )}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => removeColor(index)}
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
                        {PRESET_COLORS.map((preset) => (
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
                          نام رنگ (فارسی) *
                        </label>
                        <input
                          type="text"
                          value={color.label}
                          onChange={(e) =>
                            updateColor(index, { label: e.target.value })
                          }
                          placeholder="مشکی"
                          className="w-full rounded-lg border border-[#D4C5A0] bg-white px-3 py-2 text-sm outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-bold text-gray-600">
                          کد رنگ (انگلیسی)
                        </label>
                        <input
                          type="text"
                          dir="ltr"
                          value={color.value}
                          onChange={(e) =>
                            updateColor(index, {
                              value: e.target.value
                                .toLowerCase()
                                .replace(/\s+/g, "-"),
                            })
                          }
                          placeholder="black"
                          className="w-full rounded-lg border border-[#D4C5A0] bg-white px-3 py-2 font-mono text-left text-sm outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    {/* عکس رنگ */}
                    <div>
                      <ImageUploader
                        value={color.image ?? ""}
                        onChange={(url) =>
                          updateColor(index, { image: url || undefined })
                        }
                        label="عکس مخصوص این رنگ (اختیاری)"
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
        onClick={addColor}
        className="mt-3 w-full rounded-lg border-2 border-dashed border-[#D4C5A0] bg-white py-3 text-sm font-bold text-gray-600 transition hover:border-amber-500 hover:bg-amber-50 hover:text-amber-700"
      >
        ➕ افزودن رنگ جدید
      </button>
    </div>
  );
}