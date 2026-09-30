"use client";

import { useState } from "react";
import Image from "next/image";
import CategoriesMenu from "./CategoriesMenu";
import CartDropdown from "./CartDropdown";

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
    <header dir="rtl" className="w-full bg-[#F7F1E3] text-gray-900">
      {/* ─────── نوار بالایی ─────── */}
     <div className="hidden w-full bg-amber-500 py-2 text-xs font-semibold text-white md:block md:py-2.5 md:text-base">
        <div className="mx-auto max-w-[1600px] px-4 md:px-6">
          <span>کردستان - بانه - کوچه پاساژ نور - پاساژ ارغوانی - بلوک ۲</span>
        </div>
      </div>

      {/* ─────── نوار اصلی ─────── */}
      <div className="border-b border-[#E8DFC8]">
        <div className="mx-auto max-w-[1600px] px-4 md:px-6">
          {/* ─── موبایل: ردیف بالا ─── */}
          <div className="flex items-center justify-between gap-2 py-3 md:hidden">
            {/* منوی همبرگری */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="منو"
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-[#E8DFC8] bg-white text-gray-700"
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
            </button>

            {/* لوگو */}
            <a href="/" className="flex-shrink-0">
              <Image
                src="/images/logo.png"
                alt="کو کمپ"
                width={200}
                height={200}
                priority
                className="h-14 w-auto"
              />
            </a>

            {/* آیکون‌ها */}
            <div className="flex items-center gap-2">
              <a
                href="/login"
                aria-label="ورود"
                className="text-gray-700 hover:text-amber-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </a>
              <button
                aria-label="جستجو"
                className="text-gray-700 hover:text-amber-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                  />
                </svg>
              </button>
              <CartDropdown />
            </div>
          </div>

          {/* ─── دسکتاپ: ۳ ستونه ─── */}
          <div className="hidden grid-cols-3 items-center gap-4 py-4 md:grid">
            {/* لوگو */}
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

            {/* متن */}
            <div className="pt-16 text-center">
              <h1 className="text-lg font-semibold text-gray-900">
                فروشگاه لوازم کمپینگ و کوهنوردی
              </h1>
            </div>

            {/* آیکون‌ها */}
            <div className="flex items-center justify-end gap-7 pt-16">
              <a
                href="/login"
                className="hidden text-lg font-bold text-gray-700 hover:text-amber-600 sm:inline"
              >
                ورود / ثبت‌نام
              </a>

              <button
                aria-label="جستجو"
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
                    d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                  />
                </svg>
              </button>

              <button
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
              </button>

              <CartDropdown />
            </div>
          </div>
        </div>
      </div>

      {/* ─────── منوی موبایل (کشویی) ─────── */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
          />

          {/* پنل منو */}
          <div className="relative z-50 border-b border-[#E8DFC8] bg-white shadow-lg md:hidden">
            {/* دکمه مرور دسته‌ها */}
            <div className="border-b border-[#EDE4CE] p-3">
              <CategoriesMenu />
            </div>

            {/* لینک‌های منو */}
            <ul className="px-4 py-2">
              {menuItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block border-b border-[#EDE4CE] py-3 text-sm font-semibold text-gray-700 last:border-0 hover:text-amber-600"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* ─────── منوی ناوبری دسکتاپ ─────── */}
      <nav className="hidden border-b border-[#E8DFC8] bg-[#F7F1E3] md:block">
        <div className="mx-auto flex max-w-[1600px] items-center gap-10 px-6">
          <CategoriesMenu />

          <ul className="flex flex-wrap items-center gap-x-10 gap-y-2 py-5 text-lg font-semibold">
            <li><a href="/" className="text-amber-600">صفحه اصلی</a></li>
            <li><a href="/products" className="hover:text-amber-600">تمامی محصولات</a></li>
            <li><a href="/explore" className="hover:text-amber-600">اکسپلور</a></li>
            <li><a href="/rules" className="hover:text-amber-600">قوانین سایت</a></li>
            <li><a href="/blog" className="hover:text-amber-600">مقالات</a></li>
            <li><a href="/about" className="hover:text-amber-600">درباره ما</a></li>
            <li><a href="/contact" className="hover:text-amber-600">تماس با ما</a></li>
          </ul>
        </div>
      </nav>
    </header>
  );
}