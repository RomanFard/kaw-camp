export default function Footer() {
  return (
    <footer dir="rtl" className="mt-16 bg-[#EFE7D2]">
      {/* ۴ کارت ویژگی */}
      <div className="mx-auto max-w-[1600px] px-6 pt-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="flex items-center justify-between rounded-2xl border border-[#D4C5A0] bg-white px-5 py-5 shadow-sm">
            <span className="text-base font-semibold text-gray-800">خرید آسان</span>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-[#D4C5A0] bg-white px-5 py-5 shadow-sm">
            <span className="text-base font-semibold text-gray-800">پشتیبانی سریع</span>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
            </span>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-[#D4C5A0] bg-white px-5 py-5 shadow-sm">
            <span className="text-base font-semibold text-gray-800">ضمانت اصالت</span>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6M9 8h6m2-4H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2V6a2 2 0 00-2-2z" />
              </svg>
            </span>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-[#D4C5A0] bg-white px-5 py-5 shadow-sm">
            <span className="text-base font-semibold text-gray-800">ارسال سریع</span>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      {/* بخش اصلی فوتر */}
      <div className="mx-auto mt-8 max-w-[1600px] px-6">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
            {/* ستون ۱: برند (سمت راست) */}
            <div>
             {/* نام فروشگاه */}
{/* نام فروشگاه */}
<h3 className="text-xl font-black leading-10 text-gray-900 md:text-1xl">
  فروشگاه لوازم کمپینگ و کوهنوردی کو کمپ
</h3>

              <p className="mt-5 text-base font-semibold leading-8 text-gray-600">
                کو کمپ مرجع تخصصی تجهیزات کمپینگ، طبیعت‌گردی و کوهنوردی است. ما
                تلاش می‌کنیم انتخاب و خرید تجهیزات را برای شما سریع‌تر، مطمئن‌تر و
                حرفه‌ای‌تر کنیم.
              </p>

              <p className="mt-4 text-base font-semibold leading-8 text-gray-600">
                کردستان - بانه - کوچه پاساژ نور - پاساژ ارغوانی - بلوک ۲
              </p>

              <a
                href="tel:09180540019"
                dir="ltr"
                className="mt-3 block text-right text-lg font-semibold text-amber-600 hover:text-amber-700"
              >
                ۰۹۱۸-۰۵۴-۰۰۱۹
              </a>

              <p className="mt-5 text-base font-semibold text-gray-800">
                برای اطلاع از جدیدترین تخفیف‌ها، ما را در شبکه‌های اجتماعی دنبال کنید
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <a href="https://www.instagram.com/kawcamp" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-full bg-pink-50 px-5 py-2 text-base font-semibold text-pink-600 transition hover:bg-pink-100">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  <span>Instagram</span>
                </a>

                <a href="https://t.me/kawcamp" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-full bg-sky-50 px-5 py-2 text-base font-semibold text-sky-600 transition hover:bg-sky-100">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                  <span>Telegram</span>
                </a>
              </div>

              <p className="mt-4 text-base font-semibold text-gray-800">
                ما را در شبکه‌های اجتماعی داخلی دنبال کنید
              </p>

              <div className="mt-3 flex items-center gap-3">
                <a href="https://youtube.com/@kawcamp" target="_blank" rel="noopener noreferrer" className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#D4C5A0] bg-white shadow-sm transition hover:shadow-md" aria-label="یوتیوب">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-8 w-8 text-red-600">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>

                <a href="#" aria-label="بله" className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#D4C5A0] bg-white shadow-sm transition hover:shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-10 w-10">
                    <circle cx="24" cy="24" r="22" fill="#1E88E5" />
                    <path d="M34 14L14 22l6 2.5L22 34l4-6 8-14z" fill="#ffffff" />
                  </svg>
                </a>

                <a href="#" aria-label="روبیکا" className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#D4C5A0] bg-white shadow-sm transition hover:shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-10 w-10">
                    <path d="M24 4L42 14v20L24 44 6 34V14L24 4z" fill="#E53935" />
                    <path d="M24 4L42 14L24 24L6 14L24 4z" fill="#FFB300" />
                    <path d="M6 14L24 24v20L6 34V14z" fill="#43A047" />
                    <path d="M42 14v20L24 44V24L42 14z" fill="#1E88E5" />
                  </svg>
                </a>
              </div>
            </div>

            {/* ستون ۲: خدمات مشتریان */}
            <div>
              <h4 className="relative inline-block pb-2 text-lg font-semibold text-gray-800">
                خدمات مشتریان
                <span className="absolute bottom-0 right-0 h-0.5 w-12 bg-amber-500"></span>
              </h4>
              <ul className="mt-5 space-y-3 text-base font-semibold text-gray-600">
                <li>
                  <a href="/faq" className="flex items-center gap-2 hover:text-amber-600">
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                    <span>سوالات متداول</span>
                  </a>
                </li>
                <li>
                  <a href="/contact" className="flex items-center gap-2 hover:text-amber-600">
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                    <span>تماس با ما</span>
                  </a>
                </li>
                <li>
                  <a href="/shipping" className="flex items-center gap-2 hover:text-amber-600">
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                    <span>رویه ارسال</span>
                  </a>
                </li>
                <li>
                  <a href="/returns" className="flex items-center gap-2 hover:text-amber-600">
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                    <span>بازگشت کالا</span>
                  </a>
                </li>
                <li>
                  <a href="/warranty" className="flex items-center gap-2 hover:text-amber-600">
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                    <span>گارانتی</span>
                  </a>
                </li>
                <li>
                  <a href="/rules" className="flex items-center gap-2 hover:text-amber-600">
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                    <span>قوانین و مقررات</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* ستون ۳: دسترسی سریع */}
            <div>
              <h4 className="relative inline-block pb-2 text-lg font-semibold text-gray-800">
                دسترسی سریع
                <span className="absolute bottom-0 right-0 h-0.5 w-12 bg-amber-500"></span>
              </h4>
              <ul className="mt-5 space-y-3 text-base font-semibold text-gray-600">
                <li>
                  <a href="/about" className="flex items-center gap-2 hover:text-amber-600">
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                    <span>درباره ما</span>
                  </a>
                </li>
                <li>
                  <a href="/account" className="flex items-center gap-2 hover:text-amber-600">
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                    <span>حساب کاربری</span>
                  </a>
                </li>
                <li>
                  <a href="/products" className="flex items-center gap-2 hover:text-amber-600">
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                    <span>فروشگاه</span>
                  </a>
                </li>
                <li>
                  <a href="/blog" className="flex items-center gap-2 hover:text-amber-600">
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                    <span>مقالات</span>
                  </a>
                </li>
                <li>
                  <a href="/contact" className="flex items-center gap-2 hover:text-amber-600">
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                    <span>تماس با ما</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* ستون ۴: لینک‌های مفید */}
            <div>
              <h4 className="relative inline-block pb-2 text-lg font-semibold text-gray-800">
                لینک‌های مفید
                <span className="absolute bottom-0 right-0 h-0.5 w-12 bg-amber-500"></span>
              </h4>
              <ul className="mt-5 space-y-3 text-base font-semibold text-gray-600">
                <li>
                  <a href="/products?cat=shoes" className="flex items-center gap-2 hover:text-amber-600">
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                    <span>راهنمای خرید کفش کوهنوردی</span>
                  </a>
                </li>
                <li>
                  <a href="/products?cat=tools" className="flex items-center gap-2 hover:text-amber-600">
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                    <span>تجهیزات اقتصادی</span>
                  </a>
                </li>
                <li>
                  <a href="/products?cat=mattress" className="flex items-center gap-2 hover:text-amber-600">
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                    <span>زیرانداز کمپینگ</span>
                  </a>
                </li>
                <li>
                  <a href="/products?cat=tent" className="flex items-center gap-2 hover:text-amber-600">
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                    <span>چادر مسافرتی</span>
                  </a>
                </li>
                <li>
                  <a href="/products?cat=sleep" className="flex items-center gap-2 hover:text-amber-600">
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                    <span>کیسه خواب</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* کپی رایت */}
      <div className="mt-8 border-t border-[#D4C5A0] bg-white py-5">
        <div className="mx-auto max-w-[1600px] px-6 text-center text-base font-semibold text-gray-600">
          © ۱۴۰۴ کو کمپ — تمامی حقوق محفوظ است.
        </div>
      </div>
    </footer>
  );
}