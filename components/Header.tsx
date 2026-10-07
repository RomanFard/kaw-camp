"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import CartDropdown from "./CartDropdown";
import SearchPanel from "./SearchPanel";
import MobileMenuDrawer from "./MobileMenuDrawer";
import TopBar from "./TopBar";
import { useWishlist } from "@/components/context/WishlistContext";
import ThemeToggle from "./ThemeToggle";

type MenuItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; highlight?: boolean }[];
};

const menuItems: MenuItem[] = [
  { label: "صفحه اصلی", href: "/" },
  {
    label: "محصولات",
    href: "/products",
    children: [
      { label: "همه محصولات", href: "/products" },
      { label: "چادر و کمپینگ", href: "/products?cat=tent" },
      { label: "کوله پشتی", href: "/products?cat=backpack" },
      { label: "کیسه خواب", href: "/products?cat=sleep" },
      { label: "لباس کوهنوردی", href: "/products?cat=clothing" },
      { label: "کفش کوهنوردی", href: "/products?cat=shoes" },
      { label: "لوازم پخت و پز", href: "/products?cat=cooking" },
      { label: "لامپ و چراغ", href: "/products?cat=lighting" },
    ],
  },
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
  { label: "مقالات", href: "/blog" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { totalItems: wishlistCount } = useWishlist();

  function handleMouseEnter(label: string, hasChildren: boolean) {
    if (!hasChildren) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
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

  return (
    <>
      <header dir="rtl" className="w-full">
        <TopBar />

        {/* ═══ موبایل ═══ */}
        <div className="fixed top-0 left-0 right-0 z-[100] border-b border-theme bg-theme md:hidden">
          <div className="mx-auto max-w-[1400px] px-3 py-2.5 sm:px-6">
            <div className="flex items-center gap-1">
              <button
  type="button"
 onClick={() => setMobileOpen(!mobileOpen)}
  aria-label="منوی دسته‌بندی‌ها"
  className="flex h-11 w-16 items-center justify-center rounded-lg border border-accent bg-accent text-white shadow-lg shadow-accent/20 transition hover:bg-accent-hover"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.2}
    stroke="currentColor"
    className="h-5 w-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
    />
  </svg>
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
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-theme-surface text-theme transition hover:bg-accent hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </a>

              <div className="flex-shrink-0 [&_button]:h-9 [&_button]:w-9">
                <ThemeToggle />
              </div>

              <a
                href="/wishlist"
                aria-label="علاقه‌مندی"
                data-wishlist-icon-mobile
                className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-theme-surface text-theme transition hover:bg-red-500 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute -left-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white shadow">
                    {wishlistCount}
                  </span>
                )}
              </a>
            </div>
          </div>
        </div>

        {/* ═══ دسکتاپ ═══ */}
        <div className="relative hidden border-b border-theme bg-theme md:block">
          <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-16">
            <div className="flex items-center justify-between gap-8 py-4">
              <div className="flex flex-shrink-0 items-center gap-6">
  <a href="/" className="flex flex-shrink-0 items-center">
    <Image
      src="/images/logo.png"
      alt="کاو کمپ"
      width={300}
      height={300}
      priority
      className="h-16 w-auto dark:brightness-0 dark:invert md:h-20"
    />
  </a>

  {/* دکمه منوی کناری — نسخه دسکتاپ */}
  <button
  type="button"
  onClick={() => setMobileOpen(true)}
  aria-label="منوی دسته‌بندی‌ها"
  className="flex h-11 w-16 items-center justify-center rounded-lg border border-accent bg-accent text-white shadow-lg shadow-accent/20 transition hover:bg-accent-hover"
>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
      />
    </svg>
  </button>
</div>

              <nav className="flex flex-1 items-center justify-center">
                <ul className="flex items-center gap-1">
                  {menuItems.map((item) => {
                    const hasChildren = !!item.children?.length;
                    const isOpen = openDropdown === item.label;

                    return (
                      <li
                        key={item.label}
                        className="relative"
                        onMouseEnter={() =>
                          handleMouseEnter(item.label, hasChildren)
                        }
                        onMouseLeave={handleMouseLeave}
                      >
                        <a
                          href={item.href}
                          className={
                            "group relative flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-bold transition lg:text-[15px] " +
                            (isOpen
                              ? "text-accent"
                              : "text-theme-muted hover:text-theme")
                          }
                        >
                          <span>{item.label}</span>
                          {hasChildren && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2.5}
                              stroke="currentColor"
                              className={
                                "h-3.5 w-3.5 transition-transform duration-200 " +
                                (isOpen ? "rotate-180 text-accent" : "")
                              }
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                              />
                            </svg>
                          )}
                          <span
                            className={
                              "absolute bottom-1 right-1/2 h-[2px] translate-x-1/2 bg-accent transition-all duration-300 " +
                              (isOpen ? "w-8" : "w-0 group-hover:w-8")
                            }
                          />
                        </a>

                        {hasChildren && (
                          <div
                            className={
                              "absolute right-0 top-full z-50 pt-2 transition-all duration-200 " +
                              (isOpen
                                ? "visible translate-y-0 opacity-100"
                                : "invisible -translate-y-2 opacity-0")
                            }
                          >
                            <div className="min-w-[220px] overflow-hidden rounded-xl border border-theme bg-theme-card py-2 shadow-2xl shadow-black/20">
                              {item.children!.map((child) => (
                                <a
                                  key={child.label}
                                  href={child.href}
                                  className="block border-r-2 border-transparent px-4 py-2.5 text-sm text-theme-muted transition hover:border-accent hover:bg-theme-surface hover:text-accent"
                                >
                                  {child.label}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="flex flex-shrink-0 items-center gap-6">
                <SearchPanel />

                <a
                  href="/wishlist"
                  aria-label="علاقه‌مندی"
                  data-wishlist-icon
                  className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-theme text-theme-muted transition hover:border-accent hover:bg-accent hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                  {wishlistCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow">
                      {wishlistCount}
                    </span>
                  )}
                </a>

                <CartDropdown />

                <ThemeToggle />

                <a
                  href="/contact"
                  className="ml-2 hidden items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-accent/20 transition hover:bg-accent-hover lg:flex"
                >
                  <span>💬</span>
                  <span>مشاوره رایگان</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <MobileMenuDrawer
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
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
        className="flex w-full items-center gap-1.5 rounded-full border border-theme bg-theme-surface px-3 py-2 text-xs text-theme-muted transition hover:border-accent"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-4 w-4 flex-shrink-0 text-accent"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
          />
        </svg>
        <span className="flex-1 truncate text-right text-xs">جستجو...</span>
      </button>

      {open && <SearchPanel onClose={() => setOpen(false)} forceOpen={true} />}
    </>
  );
}