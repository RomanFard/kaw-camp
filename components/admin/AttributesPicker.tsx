"use client";

import type { Attribute } from "@/lib/actions/attributes";
import type { ProductSpec } from "./SpecsManager";

type Props = {
  attributes: Attribute[];
  specs: ProductSpec[];
  onChange: (specs: ProductSpec[]) => void;
  category: string;
  disabled?: boolean;
};

export default function AttributesPicker({
  attributes,
  specs,
  onChange,
  category,
  disabled,
}: Props) {
  // فیلتر بر اساس category_scope
  const available = attributes.filter(
    (a) =>
      a.is_active &&
      (a.category_scope.length === 0 || a.category_scope.includes(category))
  );

  function getValueForAttribute(a: Attribute): string {
    const existing = specs.find((s) => s.label.trim() === a.label.trim());
    return existing?.value ?? "";
  }

  function setValue(a: Attribute, value: string) {
    const trimmed = value.trim();
    const existingIndex = specs.findIndex(
      (s) => s.label.trim() === a.label.trim()
    );

    if (trimmed === "") {
      // حذف
      if (existingIndex >= 0) {
        onChange(specs.filter((_, i) => i !== existingIndex));
      }
      return;
    }

    if (existingIndex >= 0) {
      // آپدیت
      onChange(
        specs.map((s, i) => (i === existingIndex ? { ...s, value: trimmed } : s))
      );
    } else {
      // اضافه
      onChange([...specs, { label: a.label, value: trimmed }]);
    }
  }

  if (available.length === 0) return null;

  return (
    <div className="space-y-3 rounded-xl border border-accent/30 bg-accent/5 p-3 sm:p-4">
      {/* هدر */}
      <div className="flex items-center gap-2">
        <span className="text-base">⚡</span>
        <h4 className="text-xs font-black text-theme">
          افزودن سریع ویژگی‌ها
        </h4>
        <span className="text-[10px] text-theme-muted">
          ({available.length.toLocaleString("fa-IR")} ویژگی آماده)
        </span>
      </div>

      <p className="text-[10px] leading-5 text-theme-muted">
        💡 یه مقدار انتخاب کن — خودکار به لیست پایین اضافه می‌شه. می‌تونی بعدش
        دستی هم ویرایشش کنی.
      </p>

      {/* Dropdownها */}
      <div className="grid gap-3 sm:grid-cols-2">
        {available.map((a) => {
          const currentValue = getValueForAttribute(a);
          const hasValue = currentValue !== "";

          return (
            <div key={a.id}>
              <label className="mb-1 flex items-center gap-1.5 text-[11px] font-bold text-theme-muted">
                <span>{a.label}</span>
                {a.unit && (
                  <span className="text-[9px] font-normal opacity-70">
                    ({a.unit})
                  </span>
                )}
                {hasValue && (
                  <span className="text-[9px] text-accent">✓</span>
                )}
              </label>

              {a.type === "select" ? (
                <select
                  value={currentValue}
                  onChange={(e) => setValue(a, e.target.value)}
                  disabled={disabled}
                  className={`w-full rounded-lg border bg-theme-card px-3 py-2 text-xs text-theme outline-none transition focus:border-accent disabled:opacity-50 ${
                    hasValue ? "border-accent/50" : "border-theme"
                  }`}
                >
                  <option value="">— انتخاب کنید —</option>
                  {a.values.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={a.type === "number" ? "number" : "text"}
                  value={currentValue}
                  onChange={(e) => setValue(a, e.target.value)}
                  disabled={disabled}
                  placeholder={
                    a.unit ? `مثلاً به ${a.unit}` : "مقدار را وارد کنید"
                  }
                  className={`w-full rounded-lg border bg-theme-card px-3 py-2 text-xs text-theme outline-none transition placeholder:text-theme-muted focus:border-accent disabled:opacity-50 ${
                    hasValue ? "border-accent/50" : "border-theme"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* راهنما */}
      {specs.length > 0 && (
        <div className="border-t border-accent/20 pt-2 text-[10px] text-theme-muted">
          {specs.length.toLocaleString("fa-IR")} مشخصه در لیست پایین ثبت شده
        </div>
      )}
    </div>
  );
}