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
      <header dir="rtl" className="w-full bg-[#F7F1E3] text-gray-900">
        {/* ─────── نوار بالایی (دسکتاپ) ─────── */}
        <div className="hidden w-full bg-amber-500 py-2.5 text-base font-semibold text-white md:block">
          <div className="mx-auto max-w-[1600px] px-6">
            <span>کردستان - بانه - کوچه پاساژ نور - پاساژ ارغوانی - بلوک ۲</span>
          </div>
        </div>

        {/* ─────── نوار اصلی ─────── */}
        <div className="border-b border-[#E8DFC8]">
          <div className="mx-auto max-w-[1600px] px-4 md:px-6">
            {/* ═══ موبایل: چیدمان جدید ═══ */}
            <div className="py-3 md:hidden">
              {/* ردیف بالا: منو + لوگو + سبد */}
              <div className="flex items-center justify-between gap-3">
                {/* دکمه منو (راست) */}
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  aria-label="منو"
                  className="flex items-center gap-1.5 text-gray-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                    />
                  </svg>
                  <span className="text-sm font-bold">منو</span>
                </button>

                {/* لوگو (وسط) */}
                <a href="/" className="flex-shrink-0">
                  <Image
                    src="/images/logo.png"
                    alt="کو کمپ"
                    width={200}
                    height={200}
                    priority
                    className="h-12 w-auto"
                  />
                </a>

                {/* سبد خرید (چپ) */}
                <div className="flex items-center gap-1">
                  <CartDropdown />
                </div>
              </div>

              {/* ردیف پایین: نوار جستجو */}
              <div className="mt-3">
                <SearchButton />
              </div>
            </div>

            {/* ═══ دسکتاپ: ۳ ستونه ═══ */}
            <div className="hidden grid-cols-3 items-center gap-4 py-4 md:grid">
              {/* ستون راست: لوگو */}
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

              {/* ستون وسط: متن */}
              <div className="pt-16 text-center">
                <h1 className="text-lg font-semibold text-gray-900">
                  فروشگاه لوازم کمپینگ و کوهنوردی
                </h1>
              </div>

              {/* ستون چپ: آیکون‌ها */}
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

        {/* ─────── منوی ناوبری دسکتاپ ─────── */}
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

      {/* ─────── دراور منوی موبایل ─────── */}
      <MobileMenuDrawer
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}

/* ─────── دکمه جستجوی موبایل ─────── */
function SearchButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-lg border border-[#E8DFC8] bg-white px-4 py-2.5 text-sm text-gray-400 transition hover:border-amber-500"
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
            d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
          />
        </svg>
        <span>جستجو در کو کمپ...</span>
      </button>

      {open && (
        <SearchPanel
          onClose={() => setOpen(false)}
          forceOpen={true}
        />
      )}
    </>
  );
}