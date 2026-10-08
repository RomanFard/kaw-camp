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
                className="rounded-lg bg-accent px-8 py-3 text-base font-bold text-white transition hover:bg-accent-hover"
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
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent text-xl text-white">
                  📍
                </span>
                <div>
                  <h3 className="text-base font-bold text-theme">آدرس</h3>
                  <p className="mt-2 text-sm leading-7 text-theme-muted">
                    کردستان - بانه - کوچه پاساژ نور - پاساژ ارغوانی - بلوک ۲
                  </p>
                </div>
              </div>
            </div>

            {/* تلفن */}
            <div className="rounded-xl border border-theme bg-theme-card p-5">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent text-xl text-white">
                  📞
                </span>
                <div>
                  <h3 className="text-base font-bold text-theme">تلفن</h3>
                  <a
                    href="tel:09180540019"
                    dir="ltr"
                    className="mt-2 block text-sm font-bold text-accent transition hover:text-accent-hover"
                  >
                    ۰۹۱۸-۰۵۴-۰۰۱۹
                  </a>
                </div>
              </div>
            </div>

            {/* ایمیل */}
            <div className="rounded-xl border border-theme bg-theme-card p-5">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent text-xl text-white">
                  ✉️
                </span>
                <div>
                  <h3 className="text-base font-bold text-theme">ایمیل</h3>
                  <a
                    href="mailto:mohamadxanzadeh@gmail.com"
                    dir="ltr"
                    className="mt-2 block text-sm font-bold text-accent transition hover:text-accent-hover"
                  >
                    mohamadxanzadeh@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* ساعات کاری */}
            <div className="rounded-xl border border-theme bg-theme-card p-5">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent text-xl text-white">
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
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://www.instagram.com/kawcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-theme bg-theme-surface px-4 py-2.5 text-sm font-bold text-theme-muted transition hover:border-accent hover:text-accent"
                >
                  Instagram
                </a>
                <a
                  href="https://t.me/kawcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-theme bg-theme-surface px-4 py-2.5 text-sm font-bold text-theme-muted transition hover:border-accent hover:text-accent"
                >
                  Telegram
                </a>
                <a
                  href="https://wa.me/message/MCT6GUT5QAVCE1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-theme bg-theme-surface px-4 py-2.5 text-sm font-bold text-theme-muted transition hover:border-accent hover:text-accent"
                >
                  WhatsApp
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