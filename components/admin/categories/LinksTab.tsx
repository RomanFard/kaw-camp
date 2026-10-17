"use client";

import { useEffect, useState } from "react";
import { getAppContent, setAppContent } from "@/lib/actions/appContent";
import {
  type CategoryLinkGroup,
  type CategoryLink,
  CATEGORY_LINKS_KEY,
  DEFAULT_CATEGORY_LINKS,
} from "@/lib/contentTypes";
import { useToast } from "@/components/context/ToastContext";

export default function LinksTab() {
  const toast = useToast();
  const [groups, setGroups] =
    useState<CategoryLinkGroup[]>(DEFAULT_CATEGORY_LINKS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getAppContent<CategoryLinkGroup[]>(
        CATEGORY_LINKS_KEY
      );
      if (data && data.length > 0) setGroups(data);
      setLoading(false);
    })();
  }, []);

  function updateGroupTitle(gi: number, title: string) {
    setGroups((p) =>
      p.map((g, idx) => (idx === gi ? { ...g, title } : g))
    );
  }

  function addGroup() {
    setGroups((p) => [...p, { title: "گروه جدید", links: [] }]);
  }

  function removeGroup(gi: number) {
    if (!confirm("حذف کل این گروه؟")) return;
    setGroups((p) => p.filter((_, idx) => idx !== gi));
  }

  function moveGroup(gi: number, dir: -1 | 1) {
    const j = gi + dir;
    if (j < 0 || j >= groups.length) return;
    setGroups((p) => {
      const c = [...p];
      [c[gi], c[j]] = [c[j], c[gi]];
      return c;
    });
  }

  function updateLink(
    gi: number,
    li: number,
    field: keyof CategoryLink,
    value: string
  ) {
    setGroups((p) =>
      p.map((g, idx) =>
        idx === gi
          ? {
              ...g,
              links: g.links.map((l, j) =>
                j === li ? { ...l, [field]: value } : l
              ),
            }
          : g
      )
    );
  }

  function addLink(gi: number) {
    setGroups((p) =>
      p.map((g, idx) =>
        idx === gi
          ? {
              ...g,
              links: [
                ...g.links,
                { label: "لینک جدید", href: "/products" },
              ],
            }
          : g
      )
    );
  }

  function removeLink(gi: number, li: number) {
    setGroups((p) =>
      p.map((g, idx) =>
        idx === gi
          ? { ...g, links: g.links.filter((_, j) => j !== li) }
          : g
      )
    );
  }

  function moveLink(gi: number, li: number, dir: -1 | 1) {
    const j = li + dir;
    if (j < 0 || j >= groups[gi].links.length) return;
    setGroups((p) =>
      p.map((g, idx) => {
        if (idx !== gi) return g;
        const c = [...g.links];
        [c[li], c[j]] = [c[j], c[li]];
        return { ...g, links: c };
      })
    );
  }

  async function save() {
    setSaving(true);
    const { error } = await setAppContent(CATEGORY_LINKS_KEY, groups);
    setSaving(false);
    if (error) return toast.error("خطا: " + error.message);
    toast.success("✅ لینک‌های دسته‌بندی ذخیره شد");
  }

  async function reset() {
    if (!confirm("بازگشت به پیش‌فرض؟")) return;
    setGroups(DEFAULT_CATEGORY_LINKS);
  }

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-theme-muted">
        در حال بارگذاری...
      </div>
    );
  }

  const inp =
    "w-full rounded-lg border border-theme bg-theme-surface px-3 py-2 text-xs text-theme outline-none transition placeholder:text-theme-muted focus:border-accent";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-theme-muted">
            {groups.length.toLocaleString("fa-IR")} گروه — اینا توی بخش
            «لینک‌های دسته‌بندی» پایین صفحه اصلی نمایش داده می‌شن
          </p>
          <p className="mt-0.5 text-[10px] text-theme-muted">
            💡 روی دسکتاپ ۴ ستون، روی موبایل ۲ ستون
          </p>
        </div>
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
            onClick={addGroup}
            className="rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90"
          >
            ➕ گروه جدید
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

      <div className="space-y-3">
        {groups.map((group, gi) => (
          <div
            key={gi}
            className="rounded-xl border border-theme bg-theme-card p-4"
          >
            <div className="mb-3 flex items-center gap-2">
              <input
                value={group.title}
                onChange={(e) => updateGroupTitle(gi, e.target.value)}
                placeholder="عنوان گروه"
                className={`${inp} flex-1 font-bold`}
              />
              <button
                type="button"
                onClick={() => moveGroup(gi, -1)}
                disabled={gi === 0}
                className="rounded p-1.5 text-xs text-theme-muted transition hover:bg-theme-surface hover:text-theme disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveGroup(gi, 1)}
                disabled={gi === groups.length - 1}
                className="rounded p-1.5 text-xs text-theme-muted transition hover:bg-theme-surface hover:text-theme disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => removeGroup(gi)}
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs font-bold text-red-500 transition hover:bg-red-500/20"
              >
                🗑
              </button>
            </div>

            <div className="space-y-2">
              {group.links.map((link, li) => (
                <div key={li} className="flex gap-1">
                  <input
                    value={link.label}
                    onChange={(e) =>
                      updateLink(gi, li, "label", e.target.value)
                    }
                    placeholder="عنوان"
                    className={`${inp} flex-1`}
                  />
                  <input
                    value={link.href}
                    onChange={(e) =>
                      updateLink(gi, li, "href", e.target.value)
                    }
                    placeholder="/products?cat=tent"
                    dir="ltr"
                    className={`${inp} flex-1 font-mono`}
                  />
                  <button
                    type="button"
                    onClick={() => moveLink(gi, li, -1)}
                    disabled={li === 0}
                    className="rounded p-1 text-xs text-theme-muted transition hover:bg-theme-surface hover:text-theme disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveLink(gi, li, 1)}
                    disabled={li === group.links.length - 1}
                    className="rounded p-1 text-xs text-theme-muted transition hover:bg-theme-surface hover:text-theme disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeLink(gi, li)}
                    className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 text-xs font-bold text-red-500 transition hover:bg-red-500/20"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addLink(gi)}
                className="w-full rounded-lg border-2 border-dashed border-theme bg-theme-surface/50 py-2 text-[11px] font-bold text-theme-muted transition hover:border-accent hover:text-accent"
              >
                ➕ افزودن لینک
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}