"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import CartDropdown from "./CartDropdown";
import SearchPanel from "./SearchPanel";
import MobileMenuDrawer from "./MobileMenuDrawer";
import { useWishlist } from "@/components/context/WishlistContext";
import { getAppContent } from "@/lib/supabase/appContent";
import { megaMenu as defaultMenu } from "@/lib/megaMenu";
import type {
  UnifiedCategory,
  AnnouncementBar,
  AnnouncementMessage,
} from "@/lib/contentTypes";
import {
  DEFAULT_ANNOUNCEMENT_BAR,
  CATEGORIES_KEY,
} from "@/lib/contentTypes";

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
  mega?: boolean;
  children?: { label: string; href: string; highlight?: boolean }[];
  promos?: { label: string; href: string; image: string }[];
};

type Row = { label: string; href: string; catKey: string | null };

const menuItems: MenuItem[] = [
  { label: "صفحه اصلی", href: "/" },
  { label: "محصولات", href: "/products", mega: true },
  { label: "آفرود و تور (به زودی)", href: "#" },
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
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [announcementPaused, setAnnouncementPaused] = useState(false);
  const [megaCats, setMegaCats] = useState<MegaMenuCategory[]>(
    defaultMenu as unknown as MegaMenuCategory[]
  );

  // 📢 نوار اعلان از Supabase
  const [announcementData, setAnnouncementData] = useState<AnnouncementBar>(
    DEFAULT_ANNOUNCEMENT_BAR
  );

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const desktopRef = useRef<HTMLDivElement | null>(null);
  const mobileHeaderRef = useRef<HTMLDivElement>(null);

  const { totalItems: wishlistCount } = useWishlist();

  const menuOpen = openDropdown !== null;

  // پیام فعال (اگه نوار غیرفعال باشه یا پیامی نباشه، null)
  const announcements = announcementData.enabled
    ? announcementData.messages
    : [];
  const currentAnnouncement: AnnouncementMessage | null =
    announcements.length > 0
      ? announcements[announcementIndex % announcements.length]
      : null;

  // 🆕 اندازه‌گیری خودکار ارتفاع هدر موبایل
  useEffect(() => {
    const el = mobileHeaderRef.current;
    if (!el) return;

    const updateHeight = () => {
      document.documentElement.style.setProperty(
        "--mobile-header-h",
        `${el.offsetHeight}px`
      );
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(el);
    window.addEventListener("resize", updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  // چرخش پیام‌های نوار اعلان
  useEffect(() => {
    if (
      announcementPaused ||
      !announcementData.enabled ||
      announcementData.messages.length < 2
    )
      return;
    const id = setInterval(() => {
      setAnnouncementIndex(
        (i) => (i + 1) % announcementData.messages.length
      );
    }, announcementData.rotateInterval || 5000);
    return () => clearInterval(id);
  }, [announcementPaused, announcementData]);

  // 🎯 دسته‌های محصولات از منبع واحد categories
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await getAppContent<UnifiedCategory[]>(CATEGORIES_KEY);
      if (!cancelled && data && data.length > 0) {
        const filtered = data
          .filter((c) => c.isActive && c.showIn?.megaMenu)
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          .map((c) => ({
            key: c.key,
            label: c.label,
            icon: c.icon,
            photo: c.photo,
            groups: c.groups ?? [],
          }));
        setMegaCats(filtered);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 📢 خوندن نوار اعلان از Supabase
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await getAppContent<AnnouncementBar>("announcement_bar");
      if (!cancelled && stored) {
        setAnnouncementData({ ...DEFAULT_ANNOUNCEMENT_BAR, ...stored });
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

  const renderAnnouncement = (heightClass: string) => {
    // اگه نوار غیرفعاله یا پیامی نیست، هیچی نشون نده
    if (!announcementData.enabled || !currentAnnouncement) return null;

    const hasMultiple = announcements.length > 1;

    return (
      <div className="bg-theme-surface text-theme">
        <div
          className={
            "relative mx-auto flex items-center justify-center px-10 md:px-24 " +
            heightClass
          }
        >
          {currentAnnouncement.href ? (
            <a
              href={currentAnnouncement.href}
              className="text-center text-[12px] font-medium underline underline-offset-2"
            >
              {currentAnnouncement.text}
            </a>
          ) : (
            <span className="text-center text-[12px] font-medium">
              {currentAnnouncement.text}
            </span>
          )}
          {hasMultiple && (
            <button
              type="button"
              onClick={() => setAnnouncementPaused((p) => !p)}
              aria-label={
                announcementPaused
                  ? "پخش پیام‌های اعلان"
                  : "توقف پیام‌های اعلان"
              }
              className="absolute end-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center text-theme transition hover:opacity-60 md:end-14"
            >
              {announcementPaused ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-3 w-3"
                  aria-hidden="true"
                >
                  <path d="M7 4.5v15a1 1 0 001.5.86l12.5-7.5a1 1 0 000-1.72L8.5 3.64A1 1 0 007 4.5z" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-3 w-3"
                  aria-hidden="true"
                >
                  <rect x="4" y="3" width="6" height="18" rx="1" />
                  <rect x="14" y="3" width="6" height="18" rx="1" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <header dir="rtl" className="w-full">
        {/* ═══ نوار اعلان (دسکتاپ) ═══ */}
        <div className="hidden md:block">{renderAnnouncement("h-[50px]")}</div>

        {/* ═══ موبایل ═══ */}
        <div
          ref={mobileHeaderRef}
          className="fixed left-0 right-0 top-0 z-[100] bg-theme md:hidden"
        >
          {renderAnnouncement("h-10")}
          <div className="grid h-[56px] grid-cols-[1fr_auto_1fr] items-center px-3">
            <div className="flex items-center justify-start">
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="منوی دسته‌بندی‌ها"
                className="flex h-10 w-10 items-center justify-center text-theme transition hover:opacity-60"
              >
                <Icon d={MENU_PATH} strokeWidth={2.2} className="h-6 w-6" />
              </button>
              <SearchButton />
            </div>

            <a href="/" className="flex items-center justify-center">
              <LogoName className="h-[37px] w-[88px] translate-y-[7px]" />
            </a>

            <div className="flex items-center justify-end">
              <a
                href="/login"
                aria-label="حساب کاربری"
                className="flex h-10 w-10 items-center justify-center text-theme transition hover:opacity-60"
              >
                <Icon d={USER_PATH} className="h-6 w-6" />
              </a>
              <div className="[&_button]:h-10 [&_button]:w-10">
                <CartDropdown />
              </div>
            </div>
          </div>
        </div>

        {/* ═══ دسکتاپ ═══ */}
        <div ref={desktopRef} className="relative hidden bg-theme md:block">
          <div className="grid h-[76px] grid-cols-[1fr_auto_1fr] items-center gap-6 px-[34px]">
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
                        {
                          label: "سایر",
                          href: "/products?cat=other",
                          catKey: null,
                        },
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
                        className="block text-[14px] font-medium text-theme"
                      >
                        <span className="relative inline-block pb-1">
                          {item.label}
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
                          {/* ═══ پنل اول ═══ */}
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
                            <ul className="pb-4 pt-5">
                              {rows.map((row) => {
                                const isActiveRow =
                                  row.catKey !== null &&
                                  row.catKey === activeCat;
                                return (
                               <li key={row.catKey ?? `other-${row.label}`}>
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

                            {/* 🆕 دکمه‌های میانبر (مثل موبایل) */}
                            <div className="mt-2 flex flex-col gap-2 border-t border-theme/40 px-4 py-4">
                              <a
                                href="/products"
                                onClick={closeNow}
                                className="flex items-center justify-center rounded border-2 border-accent bg-accent/10 px-4 py-2.5 text-[13px] font-extrabold text-accent transition hover:bg-accent hover:text-white"
                              >
                                مشاهده همه محصولات
                              </a>
                              <a
                                href="/brands"
                                onClick={closeNow}
                                className="flex items-center justify-center rounded border-2 border-theme px-4 py-2.5 text-[13px] font-extrabold text-theme transition hover:border-accent hover:text-accent"
                              >
                                برندها
                              </a>
                            </div>

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

                          {/* ═══ پنل دوم ═══ */}
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
              <LogoName
                className="h-[46px] w-[110px] translate-y-[9px]"
                priority
              />
            </a>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="me-4 flex h-11 w-[250px] items-center gap-3 border border-transparent bg-theme-surface px-4 text-[14px] text-theme-muted transition-colors hover:border-neutral-900 dark:hover:border-neutral-300"
              >
                <Icon
                  d={SEARCH_PATH}
                  className="h-[18px] w-[18px] flex-shrink-0 text-theme"
                />
                <span className="flex-1 truncate text-start">
                  دنبال چی می‌گردی؟
                </span>
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

        {/* ═══ لایه تیره و مات پشت منو ═══ */}
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

function LogoName({
  className,
  priority,
}: {
  className: string;
  priority?: boolean;
}) {
  return (
    <span className={"relative block overflow-hidden " + className}>
      <Image
        src="/images/logo.png"
        alt="کاو کمپ"
        width={300}
        height={300}
        priority={priority}
        className="absolute inset-x-0 bottom-0 h-auto w-full dark:brightness-0 dark:invert"
      />
    </span>
  );
}

function SearchButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="جستجو"
        className="flex h-10 w-10 items-center justify-center text-theme transition hover:opacity-60"
      >
        <Icon d={SEARCH_PATH} className="h-6 w-6" />
      </button>

      {open && <SearchPanel onClose={() => setOpen(false)} forceOpen={true} />}
    </>
  );
}