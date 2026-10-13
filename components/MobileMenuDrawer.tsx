"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/context/CartContext";
import { useWishlist } from "@/components/context/WishlistContext";
import { getAppContent } from "@/lib/supabase/appContent";
import { megaMenu as defaultMenu } from "@/lib/megaMenu";
import type { MobileMenuCategory } from "@/lib/contentTypes";
import SearchPanel from "./SearchPanel";

type View = { type: "main" } | { type: "category"; key: string };

type MegaMenuCategory = {
  key: string;
  label: string;
  icon?: string;
  photo?: string;
  groups: { title: string; items: { label: string; href: string }[] }[];
};

const CHEVRON_PATH = "M15.75 19.5L8.25 12l7.5-7.5";
const HEART_PATH =
  "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z";
const SEARCH_PATH = "M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z";
const CLOSE_PATH = "M6 18L18 6M6 6l12 12";

function Icon({
  d,
  className,
  strokeWidth = 2,
}: {
  d: string;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

function getVisibleGroups(category: MegaMenuCategory) {
  return category.groups
    .filter((g) => !g.title.includes("برند") && !g.title.includes("ظرفیت"))
    .sort((a, b) => {
      const aUse = a.title.includes("استفاده") ? 0 : 1;
      const bUse = b.title.includes("استفاده") ? 0 : 1;
      return aUse - bUse;
    });
}

export default function MobileMenuDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [view, setView] = useState<View>({ type: "main" });
  const [menuItems, setMenuItems] = useState<MobileMenuCategory[]>(
    defaultMenu as MobileMenuCategory[]
  );
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();

  // body scroll lock
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // load menu
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await getAppContent<MobileMenuCategory[]>("mobile_menu");
      if (!cancelled && data && data.length > 0) setMenuItems(data);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const currentCategory =
    view.type === "category"
      ? (menuItems.find((c) => c.key === view.key) as
          | MegaMenuCategory
          | undefined) || null
      : null;

  function closeAll() {
    onClose();
    window.setTimeout(() => {
      setView({ type: "main" });
    }, 300);
  }

  function goToCategory(key: string) {
    setView({ type: "category", key });
  }

  function backToMain() {
    setView({ type: "main" });
  }

  const isCategoryView = view.type === "category";

  return (
    <>
      {/* overlay */}
      <div
        onClick={closeAll}
        aria-hidden="true"
        className={
          "fixed inset-0 z-[205] bg-black/50 backdrop-blur-sm transition-opacity duration-300 " +
          (isOpen ? "visible opacity-100" : "invisible opacity-0")
        }
      />

      <aside
        dir="rtl"
        className={
          "fixed inset-y-0 right-0 z-[210] flex h-[100dvh] w-full max-w-full flex-col bg-theme shadow-2xl transition-transform duration-300 md:max-w-[420px] " +
          (isOpen ? "visible translate-x-0" : "invisible translate-x-full")
        }
      >
        {/* ═══ بالای drawer: X + قلب ═══ */}
        <div className="flex flex-shrink-0 items-center justify-between px-5 py-3">
          <button
            type="button"
            onClick={closeAll}
            aria-label="بستن"
            className="flex h-9 w-9 items-center justify-center text-theme transition hover:opacity-60"
          >
            <Icon d={CLOSE_PATH} className="h-6 w-6" strokeWidth={1.8} />
          </button>

          <Link
            href="/wishlist"
            onClick={closeAll}
            aria-label="علاقه‌مندی"
            className="relative flex h-9 w-9 items-center justify-center text-theme transition hover:opacity-60"
          >
            <Icon d={HEART_PATH} className="h-6 w-6" strokeWidth={1.8} />
            {wishlistCount > 0 && (
              <span className="absolute -left-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-600 px-1 text-[9px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>
        </div>

        {/* ═══ فیلد جستجو ═══ */}
        <div className="flex-shrink-0 px-5 pb-3">
          <button
            type="button"
            onClick={() => {
              closeAll();
              window.setTimeout(() => setSearchOpen(true), 350);
            }}
            className="flex h-12 w-full items-center gap-3 bg-theme-surface px-4 text-[14px] text-theme-muted transition hover:opacity-80"
          >
            <Icon
              d={SEARCH_PATH}
              className="h-[18px] w-[18px] flex-shrink-0 text-theme"
              strokeWidth={2}
            />
            <span className="flex-1 truncate text-right">
              دنبال چی می‌گردی؟
            </span>
          </button>
        </div>

        {/* ═══ بدنه با اسلاید نرم ═══ */}
        <div className="relative flex-1 overflow-hidden">
          {/* ─── نمای اصلی ─── */}
          <div
            className={
              "absolute inset-0 overflow-y-auto transition-transform duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform " +
              (isCategoryView ? "translate-x-full" : "translate-x-0")
            }
          >
            <MainView
              menuItems={menuItems}
              onCategory={goToCategory}
              onClose={closeAll}
            />
          </div>

          {/* ─── نمای دسته ─── */}
          <div
            className={
              "absolute inset-0 overflow-y-auto transition-transform duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform " +
              (isCategoryView ? "translate-x-0" : "-translate-x-full")
            }
          >
            {currentCategory && (
              <CategoryView
                category={currentCategory}
                onBack={backToMain}
                onClose={closeAll}
              />
            )}
          </div>
        </div>
      </aside>

      {searchOpen && (
        <SearchPanel
          forceOpen={true}
          onClose={() => setSearchOpen(false)}
        />
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Main View
   ═══════════════════════════════════════════════════════════════ */
function MainView({
  menuItems,
  onCategory,
  onClose,
}: {
  menuItems: MobileMenuCategory[];
  onCategory: (key: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="pb-8 pt-1">
      <ul>
        {menuItems.map((cat) => (
          <li key={cat.key}>
            <button
              type="button"
              onClick={() => onCategory(cat.key)}
              className="group flex w-full items-center justify-between px-5 py-[16px] text-[15px] font-semibold text-theme"
            >
              <span className="relative inline-block pb-1">
                {cat.label}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-0.5 origin-right scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100"
                />
              </span>
              <Icon d={CHEVRON_PATH} strokeWidth={2.2} className="h-4 w-4" />
            </button>
          </li>
        ))}

        {/* 🆕 «همه محصولات» → «سایر» */}
        <li>
          <Link
            href="/products?cat=other"
            onClick={onClose}
            className="group flex items-center justify-between px-5 py-[16px] text-[15px] font-semibold text-theme"
          >
            <span className="relative inline-block pb-1">
              سایر
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-0.5 origin-right scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100"
              />
            </span>
            <Icon d={CHEVRON_PATH} strokeWidth={2.2} className="h-4 w-4" />
          </Link>
        </li>
      </ul>

      <div className="mt-6 flex flex-col gap-3 px-5">
        <Link
          href="/products"
          onClick={onClose}
          className="flex items-center justify-center rounded border-2 border-accent bg-accent/10 px-4 py-3 text-[14px] font-extrabold text-accent transition hover:bg-accent hover:text-white"
        >
          مشاهده همه محصولات
        </Link>
        <Link
          href="/brands"
          onClick={onClose}
          className="flex items-center justify-center rounded border-2 border-theme px-4 py-3 text-[14px] font-extrabold text-theme transition hover:border-accent hover:text-accent"
        >
          برندها
        </Link>
      </div>

      <div className="mt-8 border-t border-theme/40 px-5 pt-6">
        <h4 className="mb-3 text-[11px] font-black tracking-widest text-theme-muted">
          پشتیبانی
        </h4>
        <div className="space-y-3">
          <a
            href="mailto:mohamadxanzadeh@gmail.com"
            className="flex items-center gap-2 text-[13px] text-theme-muted transition hover:text-theme"
          >
            <Icon
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              strokeWidth={1.8}
              className="h-4 w-4"
            />
            mohamadxanzadeh@gmail.com
          </a>
          <a
            href="tel:09180540019"
            className="flex items-center gap-2 text-[13px] text-theme-muted transition hover:text-theme"
          >
            <Icon
              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
              strokeWidth={1.8}
              className="h-4 w-4"
            />
            ۰۹۱۸ ۰۵۴ ۰۰۱۹
          </a>
        </div>
      </div>

      <div className="mt-6 border-t border-theme/40 px-5 pb-6 pt-5">
        <h4 className="mb-3 text-[11px] font-black tracking-widest text-theme-muted">
          ما را دنبال کنید
        </h4>
        <div className="flex gap-3">
          <a
            href="https://www.instagram.com/kawcamp"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="اینستاگرام"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-theme text-theme transition hover:border-accent hover:text-accent"
          >
            <svg fill="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
              <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 01-1.38-.9 3.7 3.7 0 01-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38A5.9 5.9 0 00.63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13a5.9 5.9 0 002.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 002.13-1.38 5.9 5.9 0 001.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 00-1.38-2.13A5.9 5.9 0 0019.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zM12 16a4 4 0 110-8 4 4 0 010 8zm6.41-10.85a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
            </svg>
          </a>
          <a
            href="https://t.me/kawcamp"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="تلگرام"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-theme text-theme transition hover:border-accent hover:text-accent"
          >
            <svg fill="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.21-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.96 13.79l-2.955-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.832.769z" />
            </svg>
          </a>
          <a
            href="https://wa.me/message/MCT6GUT5QAVCE1"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="واتساپ"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-theme text-theme transition hover:border-accent hover:text-accent"
          >
            <svg fill="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Category View
   ═══════════════════════════════════════════════════════════════ */
function CategoryView({
  category,
  onBack,
  onClose,
}: {
  category: MegaMenuCategory;
  onBack: () => void;
  onClose: () => void;
}) {
  return (
    <div className="pb-10">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 border-b border-theme px-5 py-3.5 text-[14px] font-bold text-theme transition hover:opacity-60"
      >
        <Icon d="M8.25 4.5l7.5 7.5-7.5 7.5" strokeWidth={2.2} className="h-4 w-4" />
        <span>بازگشت</span>
      </button>

      <div className="px-5 pt-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8">
          {getVisibleGroups(category).map((group) => (
            <div key={group.title}>
              <h4 className="mb-4 inline-block pb-1 text-[14px] font-extrabold text-theme">
                <span className="relative inline-block">
                  {group.title}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1 right-0 h-[2px] w-8 bg-accent"
                  />
                </span>
              </h4>

              <ul className="mt-3 space-y-2.5">
                {group.items.map((it) => (
                  <li key={it.label}>
                    <Link
                      href={it.href}
                      onClick={onClose}
                      className="group/item text-[13px] text-theme-muted transition hover:text-theme"
                    >
                      <span className="relative inline-block pb-0.5">
                        {it.label}
                        <span
                          aria-hidden="true"
                          className="absolute inset-x-0 bottom-0 h-px origin-right scale-x-0 bg-current transition-transform duration-300 ease-out group-hover/item:scale-x-100"
                        />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Link
          href={`/products?cat=${category.key}`}
          onClick={onClose}
          className="mt-8 flex items-center justify-between rounded border-2 border-accent bg-accent/10 px-4 py-3 text-[14px] font-extrabold text-accent transition hover:bg-accent hover:text-white"
        >
          <span>مشاهده همه {category.label}</span>
          <Icon d={CHEVRON_PATH} strokeWidth={2.2} className="h-4 w-4" />
        </Link>

        {category.photo && (
          <Link
            href={`/products?cat=${category.key}`}
            onClick={onClose}
            aria-label={category.label}
            style={{ backgroundImage: `url(${category.photo})` }}
            className="mt-4 block h-[190px] rounded bg-neutral-900 bg-cover bg-center"
          />
        )}
      </div>
    </div>
  );
}