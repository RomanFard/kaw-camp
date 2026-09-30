"use client";

import Image from "next/image";
import CategoriesMenu from "./CategoriesMenu";
import CartDropdown from "./CartDropdown";


export default function Header() {


  return (
   <header dir="rtl" className="w-full bg-[#F7F1E3] text-gray-900">
      {/* نوار بالایی */}
      <div className="w-full bg-amber-500 py-2.5 text-sm font-semibold text-white md:text-base">
        <div className="mx-auto max-w-[1600px] px-6">
          <span>تهران - خیابان ولیعصر - فروشگاه کو کمپ</span>
        </div>
      </div>

      {/* نوار اصلی */}
      <div className="border-b border-[#E8DFC8] bg-white">
        <div className="mx-auto grid max-w-[1600px] grid-cols-3 items-center gap-4 px-6 py-4">
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
          <div className="text-center pt-16">
           <h1 className="text-lg font-bold text-gray-900">
              فروشگاه لوازم کمپینگ و کوهنوردی
            </h1>
          </div>

          {/* ستون چپ: آیکون‌ها */}
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

      {/* نوار ناوبری */}
      <nav className="border-b border-[#E8DFC8] bg-[#F7F1E3]">
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