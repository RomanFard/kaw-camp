import Link from "next/link";

export default function Footer() {
  return (
    <footer
      dir="rtl"
      className="relative overflow-hidden border-t border-zinc-800 bg-[#050505]"
    >
      {/* تزئینات نارنجی */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute -right-40 top-10 h-64 w-64 rounded-full bg-[#FF6B4A]/20 blur-[100px]" />
        <div className="absolute -left-40 bottom-10 h-64 w-64 rounded-full bg-[#FF6B4A]/10 blur-[100px]" />
      </div>

      {/* ═══ کادر اصلی — هم‌عرض با هدر ═══ */}
      <div className="relative mx-auto w-full max-w-[1600px] px-6 py-12 md:px-12 md:py-16 lg:px-20">
        {/* گرید اصلی */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* ─── ستون ۱: برند + درباره ─── */}
          <div className="lg:col-span-1">
            <h3 className="mb-3 text-xl font-black text-white">
              کو کمپ <span className="text-[#FF6B4A]">KAW CAMP</span>
            </h3>
            <p className="text-xs leading-6 text-zinc-400 md:text-sm md:leading-7">
              کو کمپ مرجع تخصصی تجهیزات کمپینگ، طبیعت‌گردی و کوهنوردی است. تلاش
              می‌کنیم انتخاب و خرید تجهیزات را برای شما سریع‌تر، مطمئن‌تر و
              حرفه‌ای‌تر کنیم.
            </p>

            {/* آدرس + ساعت کاری */}
            <div className="mt-5 space-y-2 text-[11px] text-zinc-400 md:text-xs">
              <div className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#FF6B4A]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                <span>
                  کردستان — بانه — کوچه پاساژ نور — پاساژ ارغوانی — بلوک ۲
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="h-3.5 w-3.5 flex-shrink-0 text-[#FF6B4A]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>شنبه تا پنج‌شنبه — ۸ صبح تا ۸ شب</span>
              </div>
            </div>
          </div>

          {/* ─── ستون ۲: دسترسی سریع ─── */}
          <div>
            <h4 className="relative mb-5 inline-block text-sm font-black text-white md:text-base">
              دسترسی سریع
              <span className="absolute -bottom-2 right-0 h-[2px] w-8 bg-[#FF6B4A]" />
            </h4>
            <ul className="space-y-2.5 text-xs md:text-sm">
              {[
                { label: "صفحه اصلی", href: "/" },
                { label: "تمامی محصولات", href: "/products" },
                { label: "درباره ما", href: "/about" },
                { label: "حساب کاربری", href: "/account" },
                { label: "سبد خرید", href: "/cart" },
                { label: "مقالات", href: "/blog" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-2 text-zinc-400 transition hover:text-[#FF6B4A]"
                  >
                    <span className="h-1 w-1 rounded-full bg-zinc-600 transition group-hover:bg-[#FF6B4A]" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ─── ستون ۳: خدمات مشتریان ─── */}
          <div>
            <h4 className="relative mb-5 inline-block text-sm font-black text-white md:text-base">
              خدمات مشتریان
              <span className="absolute -bottom-2 right-0 h-[2px] w-8 bg-[#FF6B4A]" />
            </h4>
            <ul className="space-y-2.5 text-xs md:text-sm">
              {[
                { label: "سوالات متداول", href: "/faq" },
                { label: "تماس با ما", href: "/contact" },
                { label: "رویه ارسال", href: "/shipping" },
                { label: "بازگشت کالا", href: "/returns" },
                { label: "گارانتی", href: "/warranty" },
                { label: "قوانین و مقررات", href: "/rules" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-2 text-zinc-400 transition hover:text-[#FF6B4A]"
                  >
                    <span className="h-1 w-1 rounded-full bg-zinc-600 transition group-hover:bg-[#FF6B4A]" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ─── ستون ۴: ارتباط با ما ─── */}
          <div>
            <h4 className="relative mb-5 inline-block text-sm font-black text-white md:text-base">
              ارتباط با ما
              <span className="absolute -bottom-2 right-0 h-[2px] w-8 bg-[#FF6B4A]" />
            </h4>

            <ul className="space-y-2.5 text-xs md:text-sm">
              <li>
                <a
                  href="tel:09180540019"
                  className="flex items-center gap-2 text-zinc-400 transition hover:text-[#FF6B4A]"
                  dir="ltr"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    className="h-3.5 w-3.5 flex-shrink-0 text-[#FF6B4A]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                    />
                  </svg>
                  <span>+98 918 054 0019</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@kawcamp.com"
                  className="flex items-center gap-2 text-zinc-400 transition hover:text-[#FF6B4A]"
                  dir="ltr"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    className="h-3.5 w-3.5 flex-shrink-0 text-[#FF6B4A]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                  <span>info@kawcamp.com</span>
                </a>
              </li>
            </ul>

            {/* شبکه‌های اجتماعی */}
            <div className="mt-5">
              <p className="mb-3 text-[11px] font-bold text-zinc-500 md:text-xs">
                ما را در شبکه‌های اجتماعی دنبال کنید
              </p>
              <div className="flex flex-wrap gap-2">
                {/* اینستاگرام */}
                <a
                  href="https://www.instagram.com/kawcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="اینستاگرام"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400 transition hover:border-[#FF6B4A] hover:bg-[#FF6B4A] hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>

                {/* یوتیوب */}
                <a
                  href="https://youtube.com/@kawcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="یوتیوب"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400 transition hover:border-red-500 hover:bg-red-600 hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>

                {/* واتساپ */}
                <a
                  href="https://wa.me/989180540019"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="واتساپ"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400 transition hover:border-green-500 hover:bg-green-600 hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </a>

                {/* تلگرام */}
                <a
                  href="https://t.me/kawcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="تلگرام"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400 transition hover:border-sky-500 hover:bg-sky-500 hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                  >
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ نوار پایین — داخل همون کادر ═══ */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-6 md:flex-row">
          <p className="text-[11px] text-zinc-500 md:text-xs">
            تمامی حقوق برای{" "}
            <span className="font-bold text-[#FF6B4A]">KAW CAMP</span> محفوظ
            است © ۱۴۰۴
          </p>

          <div className="flex items-center gap-5 text-[11px] text-zinc-400 md:text-xs">
            <Link href="/rules" className="transition hover:text-[#FF6B4A]">
              قوانین و مقررات
            </Link>
            <Link href="/returns" className="transition hover:text-[#FF6B4A]">
              بازگشت کالا
            </Link>
            <Link href="/warranty" className="transition hover:text-[#FF6B4A]">
              گارانتی
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}