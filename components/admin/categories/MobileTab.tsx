"use client";

import { useEffect, useState } from "react";
import { getAppContent, setAppContent } from "@/lib/supabase/appContent";
import type { MobileMenuCategory } from "@/lib/contentTypes";
import { megaMenu as defaultMenu } from "@/lib/megaMenu";
import { useToast } from "@/components/context/ToastContext";

const EMPTY_CAT: MobileMenuCategory = {
  key: "",
  label: "",
  icon: "",
  photo: "",
  groups: [],
};

export default function MobileTab() {
  const toast = useToast();
  const [items, setItems] = useState<MobileMenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState<number | null>(0);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    setLoading(true);
    const data = await getAppContent<MobileMenuCategory[]>("mobile_menu");
    setItems(
      data && data.length > 0 ? data : (defaultMenu as MobileMenuCategory[])
    );
    setLoading(false);
  }

  function updateCat(i: number, field: keyof MobileMenuCategory, value: any) {
    setItems((p) =>
      p.map((c, idx) => (idx === i ? { ...c, [field]: value } : c))
    );
  }

  function addCat() {
    setItems((p) => [...p, { ...EMPTY_CAT, key: `cat-${Date.now()}` }]);
  }

  function removeCat(i: number) {
    if (!confirm("حذف کل این دسته؟")) return;
    setItems((p) => p.filter((_, idx) => idx !== i));
  }

  function moveCat(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    setItems((p) => {
      const c = [...p];
      [c[i], c[j]] = [c[j], c[i]];
      return c;
    });
  }

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
    const { error } = await setAppContent("mobile_menu", items);
    setSaving(false);
    if (error) return toast.error("خطا: " + error.message);
    toast.success("منوی موبایل ذخیره شد");
  }

  async function reset() {
    if (!confirm("بازگشت به مقادیر پیش‌فرض؟")) return;
    setItems(defaultMenu as MobileMenuCategory[]);
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
      {/* هدر */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-theme-muted">
          {items.length.toLocaleString("fa-IR")} دسته در منوی موبایل
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={reset}
            className="rounded-xl border border-theme bg-theme-card px-3 py-2 text-xs font-bold text-theme-muted transition hover:text-theme"
          >
            🔄 ریست
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
            {/* هدر دسته */}
            <div className="flex items-center gap-2 border-b border-theme p-3">
              <button
                type="button"
                onClick={() => setOpen(open === ci ? null : ci)}
                className="flex h-6 w-6 items-center justify-center rounded text-theme-muted transition hover:bg-theme-surface hover:text-theme"
                aria-label="باز کردن"
              >
                {open === ci ? "▼" : "◄"}
              </button>
              <input
                value={cat.label}
                onChange={(e) => updateCat(ci, "label", e.target.value)}
                placeholder="نام دسته"
                className={`${inp} flex-1 font-bold`}
              />
              <input
                value={cat.key}
                onChange={(e) => updateCat(ci, "key", e.target.value)}
                placeholder="key"
                dir="ltr"
                className={`${inp} max-w-[120px] font-mono`}
              />
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

            {/* محتوای باز شده */}
            {open === ci && (
              <div className="space-y-3 p-3">
                {/* Icon + Photo */}
                <div className="grid gap-2 sm:grid-cols-2">
                  <input
                    value={cat.icon}
                    onChange={(e) => updateCat(ci, "icon", e.target.value)}
                    placeholder="آیکون (URL)"
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
                </div>

                {/* Groups */}
                <div className="space-y-2">
                  {cat.groups.map((group, gi) => (
                    <div
                      key={gi}
                      className="rounded-lg border border-theme bg-theme-surface/50 p-2"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <input
                          value={group.title}
                          onChange={(e) => updateGroup(ci, gi, e.target.value)}
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

                      {/* Items */}
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
                                updateItem(ci, gi, ii, "href", e.target.value)
                              }
                              placeholder="/products"
                              dir="ltr"
                              className={`${inp} flex-1 font-mono`}
                            />
                            <button
                              type="button"
                              onClick={() => removeItem(ci, gi, ii)}
                              className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 text-xs font-bold text-red-500 transition hover:bg-red-500/20"
                              aria-label="حذف"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* افزودن گروه */}
                  <button
                    type="button"
                    onClick={() => addGroup(ci)}
                    className="w-full rounded-lg border border-dashed border-theme py-2 text-xs font-bold text-theme-muted transition hover:bg-theme-surface hover:text-theme"
                  >
                    ➕ افزودن گروه
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}