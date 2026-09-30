"use client";

import { useState, useRef, useEffect } from "react";

const menuItems = [
  { label: "لباس کوهنوردی",       href: "/products?cat=clothing#products-list" },
  { label: "کوله پشتی کوهنوردی",  href: "/products?cat=backpack#products-list" },
  { label: "کفش کوهنوردی",        href: "/products?cat=shoes#products-list" },
  { label: "جوراب کوهنوردی",      href: "/products?cat=socks#products-list" },
  { label: "گتر کوهنوردی",        href: "/products?cat=gaiters#products-list" },
  { label: "ابزار فنی",           href: "/products?cat=tools#products-list" },
  { label: "کیسه خواب",           href: "/products?cat=sleep#products-list" },
  { label: "زیرانداز",            href: "/products?cat=mattress#products-list" },
  { label: "لامپ و چراغ",         href: "/products?cat=lighting#products-list" },
  { label: "چادر",                href: "/products?cat=tent#products-list" },
  { label: "لیوان، قمقمه و فلاسک", href: "/products?cat=bottle#products-list" },
  { label: "لوازم پخت و پز",      href: "/products?cat=cooking#products-list" },
  { label: "عینک اسپرت",          href: "/products?cat=sunglasses#products-list" },
  { label: "ساعت ورزشی",          href: "/products?cat=watch#products-list" },
  { label: "دوچرخه",              href: "/products?cat=bicycle#products-list" },
  { label: "تماس با ما",          href: "/contact" },
];

export default function CategoriesMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // بستن با کلیک بیرون (فقط دسکتاپ)
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);



  return (
    <div className="relative" ref={ref}>
      {/* دکمه اصلی */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        onMouseEnter={() => setIsOpen(true)}
        className="flex items-center gap-3 bg-amber-500 px-8 py-5 text-lg font-bold text-white transition hover:bg-amber-600"
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
        <span>مرور دسته‌ها</span>
      </button>

      {/* ─────── Backdrop (فقط موبایل) ─────── */}
      <div
        onClick={() => setIsOpen(false)}
        className={
          "fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden " +
          (isOpen ? "visible opacity-100" : "invisible opacity-0")
        }
      />

      {/* ─────── منوی کشویی ─────── */}
      <div
        onMouseLeave={() => setIsOpen(false)}
        className={
          "absolute right-0 top-full z-50 w-72 origin-top overflow-hidden border border-t-0 border-[#E8DFC8] bg-white shadow-xl transition-all duration-300 ease-out " +
          (isOpen
            ? "visible translate-y-0 scale-y-100 opacity-100"
            : "invisible -translate-y-2 scale-y-95 opacity-0")
        }
      >
        {/* آیتم هدر */}
        <div className="border-b border-[#EDE4CE] bg-[#F7F1E3]/50 px-5 py-3 text-base font-bold text-gray-900">
          لوازم کمپینگ و کوهنوردی
        </div>

        <ul className="max-h-[70vh] overflow-y-auto py-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
               onClick={() => setIsOpen(false)}
                className="block px-5 py-2.5 text-base font-semibold text-gray-700 transition hover:bg-amber-50 hover:text-amber-600"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}