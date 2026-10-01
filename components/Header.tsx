"use client";

import { useState } from "react";
import Image from "next/image";
import CategoriesMenu from "./CategoriesMenu";
import CartDropdown from "./CartDropdown";
import SearchPanel from "./SearchPanel";
import MobileMenuDrawer from "./MobileMenuDrawer";

const menuItems = [
  { label: "صفحه اصلی", href: "/" },
  { label: "تمامی محصولات", href: "/products" },
  { label: "اکسپلور", href: "/explore" },
  { label: "قوانین سایت", href: "/rules" },
  { label: "مقالات", href: "/blog" },
  { label: "درباره ما", href: "/about" },
  { label: "تماس با ما", href: "/contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header dir="rtl" className="w-full bg-white text-gray-900">
        {/* نوار بالایی نارنجی */}
        <div className="w-full bg-amber-500 py-2 text-[11px] font-semibold text-white md:py-2.5 md:text-base">
          <div className="mx-auto max-w-[1600px] px-4 text-center md:px-6 md:text-right">
            <span>کردستان - بانه - کوچه پاساژ نور - پاساژ ارغوانی - بلوک ۲</span>
          </div>
        </div>

        {/* نوار اصلی */}
        <div className="border-b border-[#E8DFC8]">
          <div className="mx-auto max-w-[1600px] px-4 md:px-6">
{/* ═══ موبایل ═══ */}
<div className="py-3 md:hidden">
  <div className="flex items-center gap-2">
    {/* دکمه منو (راست) */}
    <button
      type="button"
      onClick={() => setMobileOpen(true)}
      aria-label="منو"
      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#F7F1E3] text-gray-700 transition hover:bg-amber-100"
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
    </button>

    {/* نوار جستجو (پهن، وسط) */}
    <div className="flex-1">
      <SearchButton />
    </div>

    {/* دکمه پروفایل (چپ) */}
    <a
      href="/login"
      aria-label="حساب کاربری"
      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#F7F1E3] text-gray-700 transition hover:bg-amber-100"
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
  </div>
</div>

            {/* ═══ دسکتاپ ═══ */}
            <div className="hidden grid-cols-3 items-center gap-4 py-4 md:grid">
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
                  className="text-gray-700 transition hover:text-amber-600"
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
                </a>

                <CartDropdown />
              </div>
            </div>
          </div>
        </div>

        {/* منوی دسکتاپ */}
        <nav className="hidden border-b border-[#E8DFC8] bg-[#F7F1E3] md:block">
          <div className="mx-auto flex max-w-[1600px] items-center gap-10 px-6">
            <CategoriesMenu />

            <ul className="flex flex-wrap items-center gap-x-10 gap-y-2 py-5 text-lg font-semibold">
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
          </div>
        </nav>
      </header>

      {/* دراور موبایل */}
      <MobileMenuDrawer
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}

/* دکمه جستجوی موبایل */
function SearchButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-full border border-[#E8DFC8] bg-[#F7F1E3]/40 px-4 py-2.5 text-sm text-gray-400 transition hover:border-amber-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-5 w-5 text-amber-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
          />
        </svg>
        <span>جستجو در کو کمپ...</span>
      </button>

      {open && (
        <SearchPanel onClose={() => setOpen(false)} forceOpen={true} />
      )}
    </>
  );
}