"use client";

import { useState } from "react";
import Image from "next/image";
import CartDropdown from "./CartDropdown";
import SearchPanel from "./SearchPanel";
import MobileMenuDrawer from "./MobileMenuDrawer";
import RightSidebar from "./RightSidebar";
import { useWishlist } from "@/components/context/WishlistContext";

const menuItems = [
  { label: "صفحه اصلی", href: "/" },
  { label: "تمامی محصولات", href: "/products" },
  { label: "آفرود و تور", href: "/explore" },
  { label: "قوانین سایت", href: "/rules" },
  { label: "مقالات", href: "/blog" },
  { label: "درباره ما", href: "/about" },
  { label: "تماس با ما", href: "/contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { totalItems: wishlistCount } = useWishlist();

  return (
    <>
<header dir="rtl" className="w-full bg-white text-gray-900">

        {/* ═══ موبایل ═══ */}
       <div className="fixed top-0 left-0 right-0 z-[100] border-b border-[#E8DFC8] bg-white md:hidden">
          <div className="px-3 py-2.5">
            <div className="flex items-center gap-1.5">
              {/* ۱. دسته‌بندی */}
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="دسته‌بندی محصولات"
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#F7F1E3] text-gray-700 transition hover:bg-amber-100"
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

              {/* ۲. لوگو */}
              <a href="/" className="flex-shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="کو کمپ"
                  width={60}
                  height={60}
                  className="h-8 w-auto"
                />
              </a>

              {/* ۳. جستجو */}
              <div className="min-w-0 flex-1">
                <SearchButton />
              </div>

              {/* ۴. ثبت‌نام */}
              <a
                href="/login"
                aria-label="حساب کاربری"
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#F7F1E3] text-gray-700 transition hover:bg-amber-100"
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

              {/* ۵. علاقه‌مندی */}
              <a
                href="/wishlist"
                aria-label="علاقه‌مندی"
                data-wishlist-icon-mobile
                className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#F7F1E3] text-gray-700 transition hover:bg-amber-100"
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
        <div className="hidden border-b border-[#E8DFC8] md:block">
          <div className="mx-auto max-w-[1600px] px-6">
            <div className="grid grid-cols-3 items-center gap-4 py-4">
              <a href="/" className="flex items-center justify-start">
                <Image
                  src="/images/logo.png"
                  alt="کو کمپ"
                  width={300}
                  height={300}
                  priority
                  className="h-32 w-auto md:h-40"
                />
              </a>

              <div className="pt-16 text-center">
                <h1 className="text-lg font-semibold text-gray-900">
                  فروشگاه لوازم کمپینگ و کوهنوردی
                </h1>
              </div>

              <div className="flex items-center justify-end gap-7 pt-16">
                <a
                  href="/login"
                  className="hidden text-lg font-bold text-gray-700 hover:text-amber-600 lg:inline"
                >
                  ورود / ثبت‌نام
                </a>

                <SearchPanel />

                <a
                  href="/wishlist"
                  aria-label="علاقه‌مندی"
                  data-wishlist-icon
                  className="relative text-gray-700 transition hover:text-amber-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-7 w-7"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>

                  {wishlistCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow">
                      {wishlistCount}
                    </span>
                  )}
                </a>

                <CartDropdown />
              </div>
            </div>
          </div>
        </div>

        {/* منوی دسکتاپ */}
        <nav className="hidden border-b border-[#E8DFC8] bg-[#F7F1E3] md:block">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-6">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              onMouseEnter={() => setSidebarOpen(true)}
              className="flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-bold text-gray-700 transition hover:bg-white hover:text-amber-600 md:text-base"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                />
              </svg>
              <span>دسته‌بندی محصولات</span>
            </button>

            <ul className="flex flex-1 flex-wrap items-center justify-center gap-x-8 gap-y-2 py-5 text-base font-semibold lg:gap-x-10 lg:text-lg">
              {menuItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className={
                      item.href === "/"
                        ? "text-amber-600"
                        : "hover:text-amber-600"
                    }
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="hidden w-[180px] lg:block"></div>
          </div>
        </nav>
      </header>

      <RightSidebar
        forceOpen={sidebarOpen}
        onForceClose={() => setSidebarOpen(false)}
      />

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
        className="flex w-full items-center gap-1.5 rounded-full border border-[#E8DFC8] bg-[#F7F1E3]/40 px-3 py-2 text-xs text-gray-400 transition hover:border-amber-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-4 w-4 flex-shrink-0 text-amber-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
          />
        </svg>
        <span className="flex-1 truncate text-right text-xs">
          جستجو...
        </span>
      </button>

      {open && (
        <SearchPanel onClose={() => setOpen(false)} forceOpen={true} />
      )}
    </>
  );
}