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

const PRESET_SIZES = [
  { label: "S", value: "s" },
  { label: "M", value: "m" },
  { label: "L", value: "l" },
  { label: "XL", value: "xl" },
  { label: "XXL", value: "xxl" },
  { label: "۳۸", value: "38" },
  { label: "۳۹", value: "39" },
  { label: "۴۰", value: "40" },
  { label: "۴۱", value: "41" },
  { label: "۴۲", value: "42" },
  { label: "۴۳", value: "43" },
  { label: "۴۴", value: "44" },
  { label: "کوچک", value: "small" },
  { label: "متوسط", value: "medium" },
  { label: "بزرگ", value: "large" },
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
      <label className="mb-1.5 block text-xs font-bold text-theme-muted">
        سایز‌بندی محصول
      </label>

      <p className="mb-3 text-[11px] text-theme-muted">
        اگه محصولت سایز یا ظرفیت مختلف داره (مثل پوشاک، کفش، چادر)، اینجا
        اضافه کن. برای هر سایز می‌تونی یه عکس اختصاصی هم آپلود کنی.
      </p>

      {sizes.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-theme bg-theme-surface/50 p-6 text-center">
          <p className="text-xs text-theme-muted">هنوز سایزی اضافه نشده</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sizes.map((size, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-theme bg-theme-surface/50"
              >
                <div className="flex items-center justify-between gap-2 border-b border-theme p-3">
                  <button
                    type="button"
                    onClick={() => setExpandedIndex(isExpanded ? null : index)}
                    className="flex flex-1 items-center gap-3 text-right"
                  >
                    <span className="text-lg text-theme-muted">
                      {isExpanded ? "▼" : "▶"}
                    </span>
                    <div className="flex items-center gap-2">
                      {size.image ? (
                        <div className="h-8 w-8 overflow-hidden rounded border border-theme bg-theme-card">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={size.image}
                            alt={size.label}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded border border-dashed border-theme bg-theme-card text-xs text-theme-muted">
                          —
                        </div>
                      )}
                      <span className="text-xs font-bold text-theme">
                        {size.label || "(بدون نام)"}
                      </span>
                      {size.value && (
                        <span className="text-[11px] text-theme-muted" dir="ltr">
                          {size.value}
                        </span>
                      )}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => removeSize(index)}
                    className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-[11px] font-bold text-red-500 transition hover:bg-red-500/20"
                  >
                    🗑️
                  </button>
                </div>

                {isExpanded && (
                  <div className="space-y-3 p-3">
                    <div>
                      <label className="mb-1 block text-[11px] font-bold text-theme-muted">
                        پیشنهاد سریع:
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {PRESET_SIZES.map((preset) => (
                          <button
                            key={preset.value}
                            type="button"
                            onClick={() => applyPreset(index, preset)}
                            className="rounded-full border border-theme bg-theme-card px-2.5 py-1 text-[11px] font-semibold text-theme transition hover:border-accent hover:bg-accent/10 hover:text-accent"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-[11px] font-bold text-theme-muted">
                          نام سایز (نمایش) *
                        </label>
                        <input
                          type="text"
                          value={size.label}
                          onChange={(e) =>
                            updateSize(index, { label: e.target.value })
                          }
                          placeholder="XL یا ۴۲"
                          className="w-full rounded-lg border border-theme bg-theme-surface px-3 py-2 text-xs text-theme outline-none transition placeholder:text-theme-muted focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-bold text-theme-muted">
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
                          className="w-full rounded-lg border border-theme bg-theme-surface px-3 py-2 text-left font-mono text-xs text-theme outline-none transition placeholder:text-theme-muted focus:border-accent"
                        />
                      </div>
                    </div>

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
        className="mt-3 w-full rounded-xl border-2 border-dashed border-theme bg-theme-card py-3 text-xs font-bold text-theme-muted transition hover:border-accent hover:bg-accent/10 hover:text-accent"
      >
        ➕ افزودن سایز جدید
      </button>
    </div>
  );
}