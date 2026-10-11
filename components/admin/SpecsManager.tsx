"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Sparkles,
} from "lucide-react";

export type ProductSpec = {
  label: string;
  value: string;
};

type Props = {
  specs: ProductSpec[];
  onChange: (specs: ProductSpec[]) => void;
  disabled?: boolean;
};

const PRESET_LABELS = [
  "وزن",
  "ابعاد",
  "جنس",
  "رنگ",
  "ظرفیت",
  "گارانتی",
  "ضدآب",
  "تعداد نفرات",
  "فصل مناسب",
  "کشور سازنده",
  "مدل",
  "نوع",
  "باتری",
  "ولتاژ",
];

export default function SpecsManager({ specs, onChange, disabled }: Props) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const update = (i: number, patch: Partial<ProductSpec>) => {
    const next = specs.map((s, idx) => (idx === i ? { ...s, ...patch } : s));
    onChange(next);
  };

  const addRow = (preset?: string) => {
    onChange([...specs, { label: preset ?? "", value: "" }]);
  };

  const removeRow = (i: number) => {
    onChange(specs.filter((_, idx) => idx !== i));
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= specs.length) return;
    const next = [...specs];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  const onDrop = (target: number) => {
    if (dragIndex === null || dragIndex === target) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }
    const next = [...specs];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(target, 0, moved);
    onChange(next);
    setDragIndex(null);
    setOverIndex(null);
  };

  const usedLabels = new Set(specs.map((s) => s.label.trim()));
  const availablePresets = PRESET_LABELS.filter((l) => !usedLabels.has(l));

  return (
    <div className="space-y-4" dir="rtl">
      {/* هدر */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-[var(--text)]">
            مشخصات فنی
          </h3>
          <p className="mt-0.5 text-xs text-[var(--text-muted)]">
            این آیتم‌ها در تب «مشخصات فنی» صفحه محصول نمایش داده می‌شوند.
          </p>
        </div>
        <span className="shrink-0 rounded-lg bg-[var(--card-hover)] px-2 py-1 text-xs text-[var(--text-muted)]">
          {specs.length} آیتم
        </span>
      </div>

      {/* پیشنهاد سریع */}
      {availablePresets.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <span className="mr-1 inline-flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
            <Sparkles size={12} />
            افزودن سریع:
          </span>
          {availablePresets.slice(0, 8).map((p) => (
            <button
              key={p}
              type="button"
              disabled={disabled}
              onClick={() => addRow(p)}
              className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[11px] text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-50"
            >
              + {p}
            </button>
          ))}
        </div>
      )}

      {/* لیست */}
      {specs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] py-8 text-center">
          <p className="text-sm text-[var(--text-muted)]">
            هنوز مشخصاتی اضافه نشده
          </p>
          <button
            type="button"
            disabled={disabled}
            onClick={() => addRow()}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Plus size={14} />
            افزودن اولین مشخصه
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {specs.map((spec, i) => (
            <div
              key={i}
              draggable={!disabled}
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => {
                e.preventDefault();
                setOverIndex(i);
              }}
              onDragLeave={() => setOverIndex((v) => (v === i ? null : v))}
              onDrop={() => onDrop(i)}
              onDragEnd={() => {
                setDragIndex(null);
                setOverIndex(null);
              }}
              className={`rounded-xl border bg-[var(--card)] p-2 transition-all ${
                overIndex === i
                  ? "border-[var(--accent)]"
                  : "border-[var(--border)]"
              } ${dragIndex === i ? "opacity-40" : "opacity-100"}`}
            >
              {/* موبایل: ۳ ردیف — دسکتاپ: ۱ ردیف */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                {/* ردیف بالا (موبایل): دستگیره + دکمه‌های اکشن */}
                <div className="flex items-center justify-between sm:justify-start sm:gap-1">
                  {/* دستگیره */}
                  <span className="cursor-grab px-1 text-[var(--text-muted)] active:cursor-grabbing">
                    <GripVertical size={16} />
                  </span>

                  {/* دکمه‌های بالا/پایین/حذف — توی موبایل سمت راست ردیف */}
                  <div className="flex items-center gap-0.5 sm:order-last">
                    <button
                      type="button"
                      disabled={disabled || i === 0}
                      onClick={() => move(i, -1)}
                      className="rounded-lg p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--card-hover)] hover:text-[var(--accent)] disabled:opacity-30"
                      title="بالا"
                    >
                      <ChevronUp size={15} />
                    </button>
                    <button
                      type="button"
                      disabled={disabled || i === specs.length - 1}
                      onClick={() => move(i, 1)}
                      className="rounded-lg p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--card-hover)] hover:text-[var(--accent)] disabled:opacity-30"
                      title="پایین"
                    >
                      <ChevronDown size={15} />
                    </button>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => removeRow(i)}
                      className="rounded-lg p-1.5 text-[var(--text-muted)] transition-colors hover:bg-red-500/10 hover:text-red-500 disabled:opacity-30"
                      title="حذف"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* inputها — توی موبایل زیر هم، دسکتاپ کنار هم */}
                <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                  <input
                    type="text"
                    value={spec.label}
                    disabled={disabled}
                    onChange={(e) => update(i, { label: e.target.value })}
                    placeholder="عنوان (مثلاً وزن)"
                    className="w-full min-w-0 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] transition-colors focus:border-[var(--accent)] focus:outline-none sm:w-[34%]"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    disabled={disabled}
                    onChange={(e) => update(i, { value: e.target.value })}
                    placeholder="مقدار (مثلاً ۲.۵ کیلوگرم)"
                    className="w-full min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] transition-colors focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            disabled={disabled}
            onClick={() => addRow()}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-[var(--border)] py-2.5 text-sm text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-50"
          >
            <Plus size={15} />
            افزودن مشخصه
          </button>
        </div>
      )}
    </div>
  );
}