"use client";

import { useEffect, useState } from "react";
import { getAppContent, setAppContent } from "@/lib/supabase/appContent";
import type {
  UnifiedCategory,
  CategoryShowIn,
  MobileMenuCategory,
  PopularCategory,
  SpecialCategory,
} from "@/lib/contentTypes";
import {
  CATEGORIES_KEY,
  DEFAULT_SHOW_IN,
  toMobileMenuCategory,
  toPopularCategory,
  toSpecialCategory,
  toCategoryPhoto,
} from "@/lib/contentTypes";
import { megaMenu as defaultMenu } from "@/lib/megaMenu";
import { useToast } from "@/components/context/ToastContext";

// ─────────────────────────────────────────────
// 🎯 Migration — ادغام ۴ منبع قدیمی به ۱ منبع واحد
// ─────────────────────────────────────────────
async function migrateFromOldSources(): Promise<UnifiedCategory[]> {
  const [mobile, popular, special, photos] = await Promise.all([
    getAppContent<MobileMenuCategory[]>("mobile_menu"),
    getAppContent<PopularCategory[]>("popular_categories"),
    getAppContent<SpecialCategory[]>("special_categories"),
    getAppContent<{ name: string; url: string }[]>("category_photos"),
  ]);

  const base = mobile && mobile.length > 0
    ? mobile
    : (defaultMenu as MobileMenuCategory[]);

  const popularMap = new Map((popular ?? []).map((p) => [p.key, p]));
  const specialMap = new Map((special ?? []).map((s) => [s.key, s]));
  const photoMap = new Map((photos ?? []).map((p) => [p.name, p.url]));

  return base.map((cat, idx) => {
    const isPopular = popularMap.has(cat.key);
    const isSpecial = specialMap.has(cat.key);

    return {
      key: cat.key,
      label: cat.label,
      icon: cat.icon,
      photo: photoMap.get(cat.key) ?? cat.photo,
      emoji: popularMap.get(cat.key)?.emoji ?? "📦",
      subtitle: specialMap.get(cat.key)?.subtitle ?? "",
      iconKey: specialMap.get(cat.key)?.iconKey ?? "tent",
      sortOrder: idx,
      isActive: true,
      showIn: {
        megaMenu: true,
        mobileMenu: true,
        popular: isPopular,
        special: isSpecial,
        grid: photoMap.has(cat.key),
        showcase: photoMap.has(cat.key),
      },
      groups: cat.groups ?? [],
    };
  });
}

const SHOW_IN_LABELS: { key: keyof CategoryShowIn; label: string }[] = [
  { key: "megaMenu", label: "🎛️ مگا منو (دسکتاپ)" },
  { key: "mobileMenu", label: "📱 منوی موبایل" },
  { key: "popular", label: "🔥 محبوب‌ها" },
  { key: "special", label: "✨ ویژه‌ها" },
  { key: "grid", label: "🖼️ گرید عکس" },
  { key: "showcase", label: "🐕 ویترین بلک داگ" },
];

export default function UnifiedTab() {
  const toast = useToast();
  const [items, setItems] = useState<UnifiedCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const [migrated, setMigrated] = useState(false);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    setLoading(true);
    const existing = await getAppContent<UnifiedCategory[]>(CATEGORIES_KEY);
    if (existing && existing.length > 0) {
      setItems(existing);
    } else {
      const merged = await migrateFromOldSources();
      setItems(merged);
      setMigrated(true);
    }
    setLoading(false);
  }

  function updateCat(i: number, field: keyof UnifiedCategory, value: any) {
    setItems((p) =>
      p.map((c, idx) => (idx === i ? { ...c, [field]: value } : c))
    );
  }

  function updateShowIn(i: number, key: keyof CategoryShowIn, value: boolean) {
    setItems((p) =>
      p.map((c, idx) =>
        idx === i ? { ...c, showIn: { ...c.showIn, [key]: value } } : c
      )
    );
  }

  function addCat() {
    const newCat: UnifiedCategory = {
      key: `cat-${Date.now()}`,
      label: "دسته جدید",
      icon: "",
      photo: "",
      emoji: "📦",
      subtitle: "",
      iconKey: "tent",
      sortOrder: items.length,
      isActive: true,
      showIn: { ...DEFAULT_SHOW_IN },
      groups: [],
    };
    setItems((p) => [...p, newCat]);
    setOpen(items.length);
  }

  function removeCat(i: number) {
    if (!confirm("حذف کل این دسته؟")) return;
    setItems((p) => p.filter((_, idx) => idx !== i));
    if (open === i) setOpen(null);
  }

  function moveCat(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    setItems((p) => {
      const c = [...p];
      [c[i], c[j]] = [c[j], c[i]];
      return c.map((cat, idx) => ({ ...cat, sortOrder: idx }));
    });
  }

  // گروه‌ها
  function addGroup(ci: number) {
    setItems((p) =>
      p.map((c, idx) =>
        idx === ci
          ? { ...c, groups: [...c.groups, { title: "گروه جدید", items: [] }] }
          : c
      )
    );
  }

  function removeGroup(ci: number, gi: number) {
    setItems((p) =>
      p.map((c, idx) =>
        idx === ci ? { ...c, groups: c.groups.filter((_, i) => i !== gi) } : c
      )
    );
  }

  function updateGroup(ci: number, gi: number, title: string) {
    setItems((p) =>
      p.map((c, idx) =>
        idx === ci
          ? {
              ...c,
              groups: c.groups.map((g, i) =>
                i === gi ? { ...g, title } : g
              ),
            }
          : c
      )
    );
  }

  function addItem(ci: number, gi: number) {
    setItems((p) =>
      p.map((c, idx) =>
        idx === ci
          ? {
              ...c,
              groups: c.groups.map((g, i) =>
                i === gi
                  ? {
                      ...g,
                      items: [
                        ...g.items,
                        { label: "آیتم جدید", href: "/products" },
                      ],
                    }
                  : g
              ),
            }
          : c
      )
    );
  }

  function removeItem(ci: number, gi: number, ii: number) {
    setItems((p) =>
      p.map((c, idx) =>
        idx === ci
          ? {
              ...c,
              groups: c.groups.map((g, i) =>
                i === gi
                  ? { ...g, items: g.items.filter((_, j) => j !== ii) }
                  : g
              ),
            }
          : c
      )
    );
  }

  function updateItem(
    ci: number,
    gi: number,
    ii: number,
    field: "label" | "href",
    value: string
  ) {
    setItems((p) =>
      p.map((c, idx) =>
        idx === ci
          ? {
              ...c,
              groups: c.groups.map((g, i) =>
                i === gi
                  ? {
                      ...g,
                      items: g.items.map((it, j) =>
                        j === ii ? { ...it, [field]: value } : it
                      ),
                    }
                  : g
              ),
            }
          : c
      )
    );
  }

  async function save() {
    setSaving(true);
    const { error } = await setAppContent(CATEGORIES_KEY, items);
    setSaving(false);
    if (error) return toast.error("خطا: " + error.message);
    toast.success("✅ دسته‌بندی‌های یکپارچه ذخیره شد");
    setMigrated(false);
  }

  async function resetToOldSources() {
    if (!confirm("همه‌چیز از ۴ منبع قدیمی دوباره merge بشه؟")) return;
    setLoading(true);
    const merged = await migrateFromOldSources();
    setItems(merged);
    setMigrated(true);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-theme-muted">
        در حال بارگذاری...
      </div>
    );
  }

  const inp =
    "w-full rounded-lg border border-theme bg-theme-surface px-2 py-1.5 text-xs text-theme outline-none transition placeholder:text-theme-muted focus:border-accent";

  return (
    <div className="space-y-4">
      {/* 🆕 هشدار migration */}
      {migrated && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-600">
          <p className="mb-1 font-bold">⚠️ حالت Migration</p>
          <p>
            داده‌ها از ۴ منبع قدیمی (mobile_menu، popular_categories،
            special_categories، category_photos) ادغام شدن.
            <br />
            <strong>هنوز ذخیره نشده!</strong> بعد از بررسی، دکمه‌ی 💾 ذخیره رو بزن.
          </p>
        </div>
      )}

      {/* هدر */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-theme-muted">
            {items.length.toLocaleString("fa-IR")} دسته — منبع واحد همه‌ی بخش‌های سایت
          </p>
          <p className="mt-0.5 text-[10px] text-theme-muted">
            💡 با toggle های showIn مشخص کن هر دسته کجا نمایش داده بشه
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={resetToOldSources}
            className="rounded-xl border border-theme bg-theme-card px-3 py-2 text-xs font-bold text-theme-muted transition hover:text-theme"
          >
            🔄 Merge از منابع قدیمی
          </button>
          <button
            type="button"
            onClick={addCat}
            className="rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90"
          >
            ➕ دسته
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {saving ? "..." : "💾 ذخیره"}
          </button>
        </div>
      </div>

      {/* لیست دسته‌ها */}
      <div className="space-y-2">
        {items.map((cat, ci) => (
          <div
            key={ci}
            className="rounded-xl border border-theme bg-theme-card shadow-sm"
          >
            {/* هدر کارت */}
            <div className="flex flex-wrap items-center gap-2 border-b border-theme p-3">
              <button
                type="button"
                onClick={() => setOpen(open === ci ? null : ci)}
                className="flex h-6 w-6 items-center justify-center rounded text-theme-muted transition hover:bg-theme-surface hover:text-theme"
                aria-label="باز کردن"
              >
                {open === ci ? "▼" : "◄"}
              </button>

              {/* Thumbnail */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-theme-surface">
                {cat.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cat.photo}
                    alt={cat.label}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xl">{cat.emoji || "📦"}</span>
                )}
              </div>

              {/* Label + Key */}
              <input
                value={cat.label}
                onChange={(e) => updateCat(ci, "label", e.target.value)}
                placeholder="نام"
                className={`${inp} flex-1 min-w-[120px] font-bold`}
              />
              <input
                value={cat.key}
                onChange={(e) => updateCat(ci, "key", e.target.value)}
                placeholder="key"
                dir="ltr"
                className={`${inp} max-w-[120px] font-mono`}
              />

              {/* showIn badges (خلاصه) */}
              <div className="flex gap-1">
                {SHOW_IN_LABELS.map(({ key }) => (
                  <span
                    key={key}
                    title={key}
                    className={
                      "h-2 w-2 rounded-full " +
                      (cat.showIn[key] ? "bg-emerald-500" : "bg-theme-muted/30")
                    }
                  />
                ))}
              </div>

              {/* اکشن‌ها */}
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => moveCat(ci, -1)}
                  disabled={ci === 0}
                  className="rounded p-1 text-xs text-theme-muted transition hover:bg-theme-surface hover:text-theme disabled:opacity-30"
                  aria-label="بالا"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveCat(ci, 1)}
                  disabled={ci === items.length - 1}
                  className="rounded p-1 text-xs text-theme-muted transition hover:bg-theme-surface hover:text-theme disabled:opacity-30"
                  aria-label="پایین"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeCat(ci)}
                  className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs font-bold text-red-500 transition hover:bg-red-500/20"
                  aria-label="حذف"
                >
                  🗑
                </button>
              </div>
            </div>

            {/* محتوای باز شده */}
            {open === ci && (
              <div className="space-y-4 p-4">
                {/* ─── فیلدهای اصلی ─── */}
                <div className="grid gap-2 sm:grid-cols-2">
                  <input
                    value={cat.icon}
                    onChange={(e) => updateCat(ci, "icon", e.target.value)}
                    placeholder="آیکون SVG (URL)"
                    dir="ltr"
                    className={inp}
                  />
                  <input
                    value={cat.photo}
                    onChange={(e) => updateCat(ci, "photo", e.target.value)}
                    placeholder="عکس (URL)"
                    dir="ltr"
                    className={inp}
                  />
                  <input
                    value={cat.emoji}
                    onChange={(e) => updateCat(ci, "emoji", e.target.value)}
                    placeholder="ایموجی"
                    className={`${inp} text-center text-lg`}
                  />
                  <input
                    value={cat.subtitle}
                    onChange={(e) => updateCat(ci, "subtitle", e.target.value)}
                    placeholder="زیرعنوان (برای ویژه‌ها)"
                    className={inp}
                  />
                  <input
                    value={cat.iconKey}
                    onChange={(e) => updateCat(ci, "iconKey", e.target.value)}
                    placeholder="iconKey (tent, sleepingBag, ...)"
                    dir="ltr"
                    className={inp}
                  />
                  <label className="flex items-center gap-2 rounded-lg border border-theme bg-theme-surface px-3 py-1.5 text-xs">
                    <input
                      type="checkbox"
                      checked={cat.isActive}
                      onChange={(e) =>
                        updateCat(ci, "isActive", e.target.checked)
                      }
                      className="accent-accent"
                    />
                    <span className="text-theme">فعال</span>
                  </label>
                </div>

                {/* ─── showIn toggles ─── */}
                <div>
                  <p className="mb-2 text-xs font-bold text-theme">
                    نمایش در بخش‌ها:
                  </p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {SHOW_IN_LABELS.map(({ key, label }) => (
                      <label
                        key={key}
                        className={
                          "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-[11px] transition " +
                          (cat.showIn[key]
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-theme bg-theme-surface text-theme-muted")
                        }
                      >
                        <input
                          type="checkbox"
                          checked={cat.showIn[key]}
                          onChange={(e) =>
                            updateShowIn(ci, key, e.target.checked)
                          }
                          className="accent-accent"
                        />
                        <span className="font-bold">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* ─── Groups ─── */}
                {cat.showIn.megaMenu || cat.showIn.mobileMenu ? (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-theme">
                      زیرگروه‌ها (برای مگا منو / منوی موبایل):
                    </p>
                    {cat.groups.map((group, gi) => (
                      <div
                        key={gi}
                        className="rounded-lg border border-theme bg-theme-surface/50 p-2"
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <input
                            value={group.title}
                            onChange={(e) =>
                              updateGroup(ci, gi, e.target.value)
                            }
                            placeholder="عنوان گروه"
                            className={`${inp} flex-1 font-bold`}
                          />
                          <button
                            type="button"
                            onClick={() => addItem(ci, gi)}
                            className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs font-bold text-emerald-500 transition hover:bg-emerald-500/20"
                          >
                            ➕ آیتم
                          </button>
                          <button
                            type="button"
                            onClick={() => removeGroup(ci, gi)}
                            className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs font-bold text-red-500 transition hover:bg-red-500/20"
                          >
                            🗑
                          </button>
                        </div>
                        <div className="space-y-1">
                          {group.items.map((item, ii) => (
                            <div key={ii} className="flex gap-1">
                              <input
                                value={item.label}
                                onChange={(e) =>
                                  updateItem(
                                    ci,
                                    gi,
                                    ii,
                                    "label",
                                    e.target.value
                                  )
                                }
                                placeholder="عنوان"
                                className={`${inp} flex-1`}
                              />
                              <input
                                value={item.href}
                                onChange={(e) =>
                                  updateItem(
                                    ci,
                                    gi,
                                    ii,
                                    "href",
                                    e.target.value
                                  )
                                }
                                placeholder="/products"
                                dir="ltr"
                                className={`${inp} flex-1 font-mono`}
                              />
                              <button
                                type="button"
                                onClick={() => removeItem(ci, gi, ii)}
                                className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 text-xs font-bold text-red-500 transition hover:bg-red-500/20"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addGroup(ci)}
                      className="w-full rounded-lg border border-dashed border-theme py-2 text-xs font-bold text-theme-muted transition hover:bg-theme-surface hover:text-theme"
                    >
                      ➕ افزودن گروه
                    </button>
                  </div>
                ) : (
                  <p className="rounded-lg border border-dashed border-theme bg-theme-surface/30 p-3 text-center text-[11px] text-theme-muted">
                    زیرگروه‌ها فقط برای مگا منو و منوی موبایل کاربرد دارن.
                    <br />
                    اگه می‌خوای این دسته زیرگروه داشته باشه، «مگا منو» یا «منوی
                    موبایل» رو روشن کن.
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}