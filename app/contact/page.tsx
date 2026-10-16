import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const inputCls =
    "w-full rounded-lg border border-theme bg-theme-surface px-4 py-2.5 text-sm outline-none transition focus:border-accent";

  return (
    <main className="min-h-screen bg-theme">
      <Header />

      <div className="mx-auto max-w-[1600px] px-6 py-8">
        {/* مسیر ناوبری */}
        <nav className="mb-6 text-sm text-theme-muted">
          <a href="/" className="transition hover:text-accent">
            خانه
          </a>
          <span className="mx-2">/</span>
          <span className="text-theme">تماس با ما</span>
        </nav>

        <h1 className="mb-8 text-2xl font-bold text-theme">تماس با ما</h1>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* فرم تماس */}
          <div className="rounded-xl border border-theme bg-theme-card p-6 md:p-8">
            <h2 className="mb-2 text-lg font-bold text-theme">فرم تماس</h2>
            <p className="mb-6 text-sm text-theme-muted">
              سوال یا پیشنهادی دارید؟ خوشحال می‌شویم بشنویم.
            </p>

            <form className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-theme-muted">
                    نام و نام خانوادگی
                  </label>
                  <input type="text" className={inputCls} />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-theme-muted">
                    شماره تماس
                  </label>
                  <input
                    type="tel"
                    dir="ltr"
                    className={`${inputCls} text-right`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-theme-muted">
                    ایمیل
                  </label>
                  <input
                    type="email"
                    dir="ltr"
                    className={`${inputCls} text-right`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-theme-muted">
                    موضوع
                  </label>
                  <input type="text" className={inputCls} />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-theme-muted">
                    پیام
                  </label>
                  <textarea rows={6} className={`${inputCls} resize-none`} />
                </div>
              </div>

              <button
                type="submit"
                className="rounded-lg bg-zinc-900 px-8 py-3 text-base font-bold text-white transition hover:bg-zinc-800"
              >
                ارسال پیام
              </button>
            </form>
          </div>

          {/* اطلاعات تماس */}
          <aside className="space-y-4">
            {/* آدرس */}
            <div className="rounded-xl border border-theme bg-theme-card p-5">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xl text-white">
                  📍
                </span>
                <div>
                  <h3 className="text-base font-bold text-theme">آدرس</h3>
                  <p className="mt-2 text-sm leading-7 text-theme-muted">
                   کردستان ، بانه ، کوچه پاساژ نور ، بلوک ۲
                  </p>
                </div>
              </div>
            </div>

            {/* تلفن */}
            <div className="rounded-xl border border-theme bg-theme-card p-5">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xl text-white">
                  📞
                </span>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-theme">تلفن</h3>
                  <a
                    href="tel:09307582003"
                    dir="ltr"
                    className="mt-2 block text-sm font-bold text-theme transition hover:text-accent"
                  >
                    ۰۹۳۰-۷۵۸-۲۰۰۳
                  </a>
                  <a
                    href="tel:09180540019"
                    dir="ltr"
                    className="mt-1.5 block text-sm font-bold text-theme transition hover:text-accent"
                  >
                    ۰۹۱۸-۰۵۴-۰۰۱۹
                  </a>
                </div>
              </div>
            </div>

            {/* ایمیل */}
            <div className="rounded-xl border border-theme bg-theme-card p-5">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xl text-white">
                  ✉️
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-theme">ایمیل</h3>
                  <a
                    href="mailto:kawcamp@outlook.com"
                    dir="ltr"
                    className="mt-2 block truncate text-sm font-bold text-theme transition hover:text-accent"
                  >
                    kawcamp@outlook.com
                  </a>
                  <a
                    href="mailto:mohamadxanzadeh@gmail.com"
                    dir="ltr"
                    className="mt-1.5 block truncate text-sm font-bold text-theme transition hover:text-accent"
                  >
                    mohamadxanzadeh@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* ساعات کاری */}
            <div className="rounded-xl border border-theme bg-theme-card p-5">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xl text-white">
                  🕐
                </span>
                <div>
                  <h3 className="text-base font-bold text-theme">ساعات کاری</h3>
                  <p className="mt-2 text-sm leading-7 text-theme-muted">
                    شنبه تا پنجشنبه: ۹ صبح تا ۶ عصر
                    <br />
                    جمعه: تعطیل
                  </p>
                </div>
              </div>
            </div>

            {/* شبکه‌های اجتماعی */}
            <div className="rounded-xl border border-theme bg-theme-card p-5">
              <h3 className="mb-4 text-base font-bold text-theme">
                ما را دنبال کنید
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <a
                  href="https://www.instagram.com/kawcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="اینستاگرام"
                  className="flex h-12 items-center justify-center rounded-lg border border-theme bg-theme-surface text-theme-muted transition hover:border-accent hover:bg-accent/10 hover:text-accent"
                >
                  <svg fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
                    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 01-1.38-.9 3.7 3.7 0 01-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38A5.9 5.9 0 00.63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13a5.9 5.9 0 002.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 002.13-1.38 5.9 5.9 0 001.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 00-1.38-2.13A5.9 5.9 0 0019.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zM12 16a4 4 0 110-8 4 4 0 010 8zm6.41-10.85a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
                  </svg>
                </a>
                <a
                  href="https://t.me/kawcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="تلگرام"
                  className="flex h-12 items-center justify-center rounded-lg border border-theme bg-theme-surface text-theme-muted transition hover:border-accent hover:bg-accent/10 hover:text-accent"
                >
                  <svg fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.21-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.96 13.79l-2.955-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.832.769z" />
                  </svg>
                </a>
                <a
                  href="https://wa.me/message/MCT6GUT5QAVCE1"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="واتساپ"
                  className="flex h-12 items-center justify-center rounded-lg border border-theme bg-theme-surface text-theme-muted transition hover:border-accent hover:bg-accent/10 hover:text-accent"
                >
                  <svg fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </main>
  );
}