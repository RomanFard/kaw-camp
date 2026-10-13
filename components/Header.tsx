"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import CartDropdown from "./CartDropdown";
import SearchPanel from "./SearchPanel";
import MobileMenuDrawer from "./MobileMenuDrawer";
import ThemeToggle from "./ThemeToggle";
import { useWishlist } from "@/components/context/WishlistContext";
import { getAppContent } from "@/lib/supabase/appContent";
import { megaMenu as defaultMenu } from "@/lib/megaMenu";
import type { MobileMenuCategory } from "@/lib/contentTypes";

type MegaMenuCategory = {
  key: string;
  label: string;
  icon?: string;
  photo?: string;
  groups: { title: string; items: { label: string; href: string }[] }[];
};

type MenuItem = {
  label: string;
  href: string;
  /** اگر true باشد، ردیف‌ها از دسته‌های مگامنو (همان داده‌ی منوی موبایل) ساخته می‌شوند */
  mega?: boolean;
  children?: { label: string; href: string; highlight?: boolean }[];
  promos?: { label: string; href: string; image: string }[];
};

type Row = { label: string; href: string; catKey: string | null };

const menuItems: MenuItem[] = [
  { label: "صفحه اصلی", href: "/" },
  { label: "محصولات", href: "/products", mega: true },
  {
    label: "آفرود و تور",
    href: "/explore",
    children: [
      { label: "همه تورها", href: "/explore" },
      { label: "تورهای آفرود", href: "/explore?type=off-road" },
      { label: "کوهنوردی", href: "/explore?type=hiking" },
      { label: "کمپینگ", href: "/explore?type=camping" },
      { label: "نقشه و آب‌وهوا", href: "/explore#map" },
    ],
    promos: [
      {
        label: "تورهای آفرود",
        href: "/explore?type=off-road",
        image: "/images/menu/tour-1.jpg",
      },
      {
        label: "کوهنوردی",
        href: "/explore?type=hiking",
        image: "/images/menu/tour-2.jpg",
      },
    ],
  },
  {
    label: "صفحات",
    href: "#",
    children: [
      { label: "درباره ما", href: "/about" },
      { label: "تماس با ما", href: "/contact" },
      { label: "قوانین سایت", href: "/rules" },
      { label: "سوالات متداول", href: "/faq" },
      { label: "رویه ارسال", href: "/shipping" },
      { label: "بازگشت کالا", href: "/returns" },
      { label: "گارانتی", href: "/warranty" },
      { label: "حساب کاربری", href: "/account" },
    ],
  },
];

const ANNOUNCEMENT_TEXT = "۱۵٪ تخفیف برای عضویت در خبرنامه — همین حالا عضو شو";
const ANNOUNCEMENT_HREF = "/#newsletter";

const HEART_PATH =
  "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z";
const USER_PATH =
  "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z";
const SEARCH_PATH = "M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z";
const MENU_PATH = "M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5";
const CHEVRON_PATH = "M15.75 19.5L8.25 12l7.5-7.5";

const FIRST_PANEL_WIDTH = 288;

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

// همان منطق منوی موبایل: گروه‌های «برند» و «ظرفیت» حذف می‌شوند و «استفاده» اول می‌آید
function getVisibleGroups(category: MegaMenuCategory) {
  return category.groups
    .filter((g) => !g.title.includes("برند") && !g.title.includes("ظرفیت"))
    .sort((a, b) => {
      const aUse = a.title.includes("استفاده") ? 0 : 1;
      const bUse = b.title.includes("استفاده") ? 0 : 1;
      return aUse - bUse;
    });
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [panelTop, setPanelTop] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [announcementClosed, setAnnouncementClosed] = useState(false);
  const [megaCats, setMegaCats] = useState<MegaMenuCategory[]>(
    defaultMenu as unknown as MegaMenuCategory[]
  );
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const desktopRef = useRef<HTMLDivElement | null>(null);
  const { totalItems: wishlistCount } = useWishlist();

  const menuOpen = openDropdown !== null;

  // دسته‌های محصولات از همان منبع منوی موبایل خوانده می‌شوند
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await getAppContent<MobileMenuCategory[]>("mobile_menu");
      if (!cancelled && data && data.length > 0) {
        setMegaCats(data as unknown as MegaMenuCategory[]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const closeNow = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(null);
  }, []);

  // وقتی منو بسته شد یا به آیتم دیگری رفتیم، زیرمنوی دسته را هم ببند
  useEffect(() => {
    if (openDropdown === null) setActiveCat(null);
  }, [openDropdown]);

  function handleMouseEnter(label: string, hasChildren: boolean) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (!hasChildren) {
      setOpenDropdown(null);
      return;
    }
    const rect = desktopRef.current?.getBoundingClientRect();
    setPanelTop(Math.max(rect?.bottom ?? 0, 0));
    setOpenDropdown(label);
  }

  function handleMouseLeave() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // بستن با Escape و با اسکرول
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeNow();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", closeNow, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", closeNow);
    };
  }, [menuOpen, closeNow]);

  return (
    <>
      <header dir="rtl" className="w-full">
        {/* ═══ نوار اعلان ═══ */}
        {!announcementClosed && (
          <div className="hidden bg-theme-surface text-theme md:block">
            <div className="relative mx-auto flex h-12 items-center justify-center px-14">
              <a
                href={ANNOUNCEMENT_HREF}
                className="text-center text-[12px] font-medium underline underline-offset-2"
              >
                {ANNOUNCEMENT_TEXT}
              </a>
              <button
                type="button"
                onClick={() => setAnnouncementClosed(true)}
                aria-label="بستن نوار اعلان"
                className="absolute end-7 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center text-theme transition hover:opacity-60"
              >
                <Icon d="M6 18L18 6M6 6l12 12" className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ═══ موبایل ═══ */}
        <div className="fixed left-0 right-0 top-0 z-[100] bg-theme md:hidden">
          <div className="mx-auto max-w-[1400px] px-3 py-2.5 sm:px-6">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="منوی دسته‌بندی‌ها"
                className="flex h-10 w-10 items-center justify-center text-theme transition hover:opacity-60"
              >
                <Icon d={MENU_PATH} strokeWidth={2.2} className="h-6 w-6" />
              </button>

              <a href="/" className="flex-shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="کاو کمپ"
                  width={60}
                  height={60}
                  className="h-8 w-auto dark:brightness-0 dark:invert"
                />
              </a>

              <div className="min-w-0 flex-1">
                <SearchButton />
              </div>

              <a
                href="/login"
                aria-label="حساب کاربری"
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center text-theme transition hover:opacity-60"
              >
                <Icon d={USER_PATH} className="h-5 w-5" />
              </a>

              <div className="flex-shrink-0 [&_button]:h-9 [&_button]:w-9">
                <ThemeToggle />
              </div>

              <div className="flex-shrink-0 [&_button]:h-9 [&_button]:w-9">
                <CartDropdown />
              </div>
            </div>
          </div>
        </div>

        {/* ═══ دسکتاپ ═══ */}
        <div ref={desktopRef} className="relative hidden bg-theme md:block">
          <div className="grid h-[76px] grid-cols-[1fr_auto_1fr] items-center gap-6 px-7">
            <nav className="flex items-center">
              <ul className="flex items-center gap-8">
                {menuItems.map((item) => {
                  const isMega = !!item.mega;
                  const rows: Row[] = isMega
                    ? [
                        ...megaCats.map((c) => ({
                          label: c.label,
                          href: `/products?cat=${c.key}`,
                          catKey: c.key,
                        })),
                        { label: "همه محصولات", href: "/products", catKey: null },
                      ]
                    : (item.children ?? []).map((c) => ({
                        label: c.label,
                        href: c.href,
                        catKey: null,
                      }));
                  const hasChildren = rows.length > 0;
                  const isOpen = openDropdown === item.label;
                  const activeCategory =
                    isMega && activeCat
                      ? megaCats.find((c) => c.key === activeCat) ?? null
                      : null;

                  return (
                    <li
                      key={item.label}
                      className="group flex h-[76px] items-center"
                      onMouseEnter={() =>
                        handleMouseEnter(item.label, hasChildren)
                      }
                      onMouseLeave={handleMouseLeave}
                    >
                      <a
                        href={item.href}
                        className="block text-[14px] font-semibold text-theme"
                      >
                        <span className="relative inline-block pb-1">
                          {item.label}
                          {/* خط زیرین: آرام از چپ به راست پر می‌شود */}
                          <span
                            aria-hidden="true"
                            className={
                              "absolute inset-x-0 bottom-0 h-0.5 origin-right bg-current transition-transform duration-300 ease-out " +
                              (isOpen
                                ? "scale-x-100"
                                : "scale-x-0 group-hover:scale-x-100")
                            }
                          />
                        </span>
                      </a>

                      {hasChildren && (
                        <>
                          {/* ─── پنل اول ─── */}
                          <div
                            style={{
                              top: panelTop,
                              height: `calc(100vh - ${panelTop}px)`,
                              width: FIRST_PANEL_WIDTH,
                            }}
                            className={
                              "fixed start-0 z-50 flex flex-col overflow-y-auto border-t border-theme bg-theme transition-opacity duration-200 " +
                              (isOpen
                                ? "visible opacity-100"
                                : "invisible opacity-0")
                            }
                          >
                            <ul className="pb-8 pt-5">
                              {rows.map((row) => {
                                const isActiveRow =
                                  row.catKey !== null &&
                                  row.catKey === activeCat;
                                return (
                                  <li key={row.label}>
                                    <a
                                      href={row.href}
                                      onClick={closeNow}
                                      onMouseEnter={() =>
                                        isMega && setActiveCat(row.catKey)
                                      }
                                      className={
                                        "group/row flex items-center justify-between px-7 py-[12px] text-[14px] font-semibold text-theme transition " +
                                        (isActiveRow ? "bg-theme-surface" : "")
                                      }
                                    >
                                      <span className="relative inline-block pb-1">
                                        {row.label}
                                        <span
                                          aria-hidden="true"
                                          className={
                                            "absolute inset-x-0 bottom-0 h-0.5 origin-right bg-current transition-transform duration-300 ease-out " +
                                            (isActiveRow
                                              ? "scale-x-100"
                                              : "scale-x-0 group-hover/row:scale-x-100")
                                          }
                                        />
                                      </span>
                                      <Icon
                                        d={CHEVRON_PATH}
                                        strokeWidth={2.2}
                                        className="h-4 w-4"
                                      />
                                    </a>
                                  </li>
                                );
                              })}
                            </ul>

                            {item.promos && (
                              <div className="mt-auto flex flex-col gap-2 pe-2">
                                {item.promos.map((promo) => (
                                  <a
                                    key={promo.label}
                                    href={promo.href}
                                    onClick={closeNow}
                                    style={{
                                      backgroundImage: `url(${promo.image})`,
                                    }}
                                    className="relative flex h-[190px] flex-shrink-0 items-end bg-neutral-900 bg-cover bg-center p-4"
                                  >
                                    <span className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />
                                    <span className="relative text-[18px] font-extrabold text-white">
                                      {promo.label}
                                    </span>
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* ─── پنل دوم: گروه‌ها و آیتم‌های دسته‌ی انتخاب‌شده ─── */}
                          {activeCategory && (
                            <div
                              style={{
                                top: panelTop,
                                height: `calc(100vh - ${panelTop}px)`,
                                insetInlineStart: FIRST_PANEL_WIDTH,
                              }}
                              className={
                                "fixed z-50 w-[520px] overflow-y-auto border-s border-t border-theme bg-theme transition-opacity duration-200 " +
                                (isOpen
                                  ? "visible opacity-100"
                                  : "invisible opacity-0")
                              }
                            >
                              <div className="px-8 pb-10 pt-6">
                                <a
                                  href={`/products?cat=${activeCategory.key}`}
                                  onClick={closeNow}
                                  className="mb-7 flex items-center justify-between rounded border-2 border-accent bg-accent/10 px-4 py-2.5 text-[14px] font-extrabold text-accent transition hover:bg-accent hover:text-white"
                                >
                                  <span>مشاهده همه {activeCategory.label}</span>
                                  <Icon
                                    d={CHEVRON_PATH}
                                    strokeWidth={2.2}
                                    className="h-4 w-4"
                                  />
                                </a>

                                <div className="grid grid-cols-2 gap-x-8 gap-y-8">
                                  {getVisibleGroups(activeCategory).map(
                                    (group) => (
                                      <div key={group.title}>
                                        <h4 className="mb-3 text-[14px] font-extrabold text-theme">
                                          {group.title}
                                        </h4>
                                        <ul className="space-y-2.5">
                                          {group.items.map((it) => (
                                            <li key={it.label}>
                                              <a
                                                href={it.href}
                                                onClick={closeNow}
                                                className="group/item text-[13px] text-theme-muted transition hover:text-theme"
                                              >
                                                <span className="relative inline-block pb-0.5">
                                                  {it.label}
                                                  <span
                                                    aria-hidden="true"
                                                    className="absolute inset-x-0 bottom-0 h-px origin-right scale-x-0 bg-current transition-transform duration-300 ease-out group-hover/item:scale-x-100"
                                                  />
                                                </span>
                                              </a>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )
                                  )}
                                </div>

                                {activeCategory.photo && (
                                  <a
                                    href={`/products?cat=${activeCategory.key}`}
                                    onClick={closeNow}
                                    aria-label={activeCategory.label}
                                    style={{
                                      backgroundImage: `url(${activeCategory.photo})`,
                                    }}
                                    className="mt-9 block h-[190px] bg-neutral-900 bg-cover bg-center"
                                  />
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <a href="/" className="flex items-center justify-center">
              <Image
                src="/images/logo.png"
                alt="کاو کمپ"
                width={300}
                height={300}
                priority
                className="h-[52px] w-auto dark:brightness-0 dark:invert"
              />
            </a>

            <div className="flex items-center justify-end gap-2 lg:gap-3">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex h-11 w-[250px] items-center gap-3 rounded bg-theme-surface px-4 text-[14px] text-theme-muted transition hover:opacity-80"
              >
                <Icon
                  d={SEARCH_PATH}
                  className="h-[18px] w-[18px] flex-shrink-0 text-theme"
                />
                <span className="flex-1 truncate text-right">
                  دنبال چی می‌گردی؟
                </span>
              </button>

              <div className="flex-shrink-0 [&_button]:h-11 [&_button]:w-11">
                <ThemeToggle />
              </div>

              <button
                type="button"
                className="flex h-11 items-center gap-1 rounded px-3 text-[13px] font-semibold text-theme transition hover:opacity-60"
                aria-label="واحد پول"
              >
                <span>۰</span>
                <span className="text-theme-muted">تومان</span>
              </button>

              <a
                href="/wishlist"
                aria-label="علاقه‌مندی"
                data-wishlist-icon
                className="relative flex h-11 w-11 items-center justify-center text-theme transition hover:opacity-60"
              >
                <Icon d={HEART_PATH} className="h-6 w-6" />
                {wishlistCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </a>

              <a
                href="/login"
                aria-label="حساب کاربری"
                className="flex h-11 w-11 items-center justify-center text-theme transition hover:opacity-60"
              >
                <Icon d={USER_PATH} className="h-6 w-6" />
              </a>

              <CartDropdown />
            </div>
          </div>
        </div>

        {/* ═══ لایه تیره و مات پشت منو (فقط دسکتاپ) ═══ */}
        <div
          aria-hidden="true"
          style={{ top: panelTop }}
          onMouseEnter={handleMouseLeave}
          onClick={closeNow}
          className={
            "fixed inset-x-0 bottom-0 z-40 hidden bg-black/50 backdrop-blur-[6px] transition-opacity duration-200 md:block " +
            (menuOpen ? "opacity-100" : "pointer-events-none opacity-0")
          }
        />
      </header>

      <MobileMenuDrawer
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {searchOpen && (
        <SearchPanel forceOpen onClose={() => setSearchOpen(false)} />
      )}
    </>
  );
}

function SearchButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded bg-theme-surface px-3 py-2 text-xs text-theme-muted transition"
      >
        <Icon d={SEARCH_PATH} className="h-4 w-4 flex-shrink-0 text-theme" />
        <span className="flex-1 truncate text-right text-xs">جستجو...</span>
      </button>

      {open && <SearchPanel onClose={() => setOpen(false)} forceOpen={true} />}
    </>
  );
}