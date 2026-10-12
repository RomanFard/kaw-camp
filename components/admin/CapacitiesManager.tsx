"use client";

import { useState } from "react";

export type CapacityItem = {
  label: string;
  value: string;
  priceDelta?: number; // 🆕 مبلغ اضافه (تومان)
};

type Props = {
  capacities: CapacityItem[];
  onChange: (capacities: CapacityItem[]) => void;
};

const PRESET_CAPACITIES = [
  { label: "۱ نفر", value: "1" },
  { label: "۲ نفر", value: "2" },
  { label: "۳ نفر", value: "3" },
  { label: "۴ نفر", value: "4" },
  { label: "۵ نفر", value: "5" },
  { label: "۶ نفر", value: "6" },
  { label: "۷ نفر", value: "7" },
  { label: "۸ نفر", value: "8" },
  { label: "۹ نفر", value: "9" },
  { label: "۱۰ نفر و بالاتر", value: "10+" },
];

export default function CapacitiesManager({ capacities, onChange }: Props) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(
    capacities.length > 0 ? 0 : null
  );

  function addCapacity() {
    const next = [...capacities, { label: "", value: "", priceDelta: 0 }];
    onChange(next);
    setExpandedIndex(next.length - 1);
  }

  function removeCapacity(index: number) {
    const next = capacities.filter((_, i) => i !== index);
    onChange(next);
    if (expandedIndex === index) {
      setExpandedIndex(next.length > 0 ? 0 : null);
    } else if (expandedIndex !== null && expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
  }

  function updateCapacity(index: number, patch: Partial<CapacityItem>) {
    const next = capacities.map((c, i) =>
      i === index ? { ...c, ...patch } : c
    );
    onChange(next);
  }

  function applyPreset(
    index: number,
    preset: { label: string; value: string }
  ) {
    updateCapacity(index, { label: preset.label, value: preset.value });
  }

  function formatPriceDisplay(value: number | undefined): string {
    if (!value || value === 0) return "بدون تغییر";
    return `+ ${value.toLocaleString("fa-IR")} تومان`;
  }

  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-theme-muted">
        ظرفیت‌های محصول
      </label>

      <p className="mb-3 text-[11px] text-theme-muted">
        اگه محصول در ظرفیت‌های مختلف موجوده، این‌جا اضافه کن. برای هر ظرفیت
        می‌تونی یه مبلغ اضافه (بالاتر از قیمت پایه) تعیین کنی.
      </p>

      {capacities.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-theme bg-theme-surface/50 p-6 text-center">
          <p className="text-xs text-theme-muted">هنوز ظرفیتی اضافه نشده</p>
        </div>
      ) : (
        <div className="space-y-3">
          {capacities.map((cap, index) => {
            const isExpanded = expandedIndex === index;
            const delta = cap.priceDelta ?? 0;
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
                      <div className="flex h-8 w-8 items-center justify-center rounded border border-theme bg-theme-card text-sm">
                        📐
                      </div>
                      <span className="text-xs font-bold text-theme">
                        {cap.label || "(بدون نام)"}
                      </span>
                      {cap.value && (
                        <span
                          className="text-[11px] text-theme-muted"
                          dir="ltr"
                        >
                          {cap.value}
                        </span>
                      )}
                      {delta > 0 && (
                        <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent">
                          {formatPriceDisplay(delta)}
                        </span>
                      )}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => removeCapacity(index)}
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
                        {PRESET_CAPACITIES.map((preset) => (
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
                          نام ظرفیت (فارسی) *
                        </label>
                        <input
                          type="text"
                          value={cap.label}
                          onChange={(e) =>
                            updateCapacity(index, { label: e.target.value })
                          }
                          placeholder="۴ نفر"
                          className="w-full rounded-lg border border-theme bg-theme-surface px-3 py-2 text-xs text-theme outline-none transition placeholder:text-theme-muted focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-bold text-theme-muted">
                          کد ظرفیت (انگلیسی)
                        </label>
                        <input
                          type="text"
                          dir="ltr"
                          value={cap.value}
                          onChange={(e) =>
                            updateCapacity(index, {
                              value: e.target.value
                                .toLowerCase()
                                .replace(/\s+/g, "-"),
                            })
                          }
                          placeholder="4"
                          className="w-full rounded-lg border border-theme bg-theme-surface px-3 py-2 text-left font-mono text-xs text-theme outline-none transition placeholder:text-theme-muted focus:border-accent"
                        />
                      </div>
                    </div>

                    {/* 🆕 مبلغ اضافه */}
                    <div>
                      <label className="mb-1 block text-[11px] font-bold text-theme-muted">
                        مبلغ اضافه (تومان)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="10000"
                        value={cap.priceDelta ?? 0}
                        onChange={(e) =>
                          updateCapacity(index, {
                            priceDelta: Number(e.target.value) || 0,
                          })
                        }
                        placeholder="0"
                        className="w-full rounded-lg border border-theme bg-theme-surface px-3 py-2 text-xs text-theme outline-none transition placeholder:text-theme-muted focus:border-accent"
                      />
                      <p className="mt-1 text-[10px] text-theme-muted">
                        💡 اگه این ظرفیت گرون‌تر از قیمت پایه‌ست، مبلغ اضافه رو
                        وارد کن. اگه همون قیمت پایه‌ست → ۰ بذار.
                      </p>
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
        onClick={addCapacity}
        className="mt-3 w-full rounded-xl border-2 border-dashed border-theme bg-theme-card py-3 text-xs font-bold text-theme-muted transition hover:border-accent hover:bg-accent/10 hover:text-accent"
      >
        ➕ افزودن ظرفیت جدید
      </button>
    </div>
  );
}