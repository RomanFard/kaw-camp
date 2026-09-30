import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F7F1E3]">
      <Header />

      <div className="mx-auto max-w-[1600px] px-6 py-8">
        {/* مسیر ناوبری */}
        <nav className="mb-6 text-sm text-gray-500">
          <a href="/" className="hover:text-amber-600">خانه</a>
          <span className="mx-2">/</span>
          <span className="text-gray-800">تماس با ما</span>
        </nav>

        <h1 className="mb-8 text-2xl font-bold text-gray-900">
          تماس با ما
        </h1>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* فرم تماس - سمت راست */}
          <div className="rounded-xl border border-[#E8DFC8] bg-white p-6 md:p-8">
            <h2 className="mb-2 text-lg font-bold text-gray-800">
              فرم تماس
            </h2>
            <p className="mb-6 text-sm text-gray-500">
              سوال یا پیشنهادی دارید؟ خوشحال می‌شویم بشنویم.
            </p>

            <form className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    نام و نام خانوادگی
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-[#E8DFC8] bg-[#F7F1E3]/30 px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    شماره تماس
                  </label>
                  <input
                    type="tel"
                    dir="ltr"
                    className="w-full rounded-lg border border-[#E8DFC8] bg-[#F7F1E3]/30 px-4 py-2.5 text-right text-sm outline-none focus:border-amber-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    ایمیل
                  </label>
                  <input
                    type="email"
                    dir="ltr"
                    className="w-full rounded-lg border border-[#E8DFC8] bg-[#F7F1E3]/30 px-4 py-2.5 text-right text-sm outline-none focus:border-amber-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    موضوع
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-[#E8DFC8] bg-[#F7F1E3]/30 px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    پیام
                  </label>
                  <textarea
                    rows={6}
                    className="w-full resize-none rounded-lg border border-[#E8DFC8] bg-[#F7F1E3]/30 px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="rounded-lg bg-amber-500 px-8 py-3 text-base font-bold text-white transition hover:bg-amber-600"
              >
                ارسال پیام
              </button>
            </form>
          </div>

          {/* اطلاعات تماس - سمت چپ */}
          <aside className="space-y-4">
            {/* آدرس */}
            <div className="rounded-xl border border-[#E8DFC8] bg-white p-5">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-500 text-xl text-white">
                  📍
                </span>
                <div>
                  <h3 className="text-base font-bold text-gray-800">آدرس</h3>
                  <p className="mt-2 text-sm leading-7 text-gray-600">
                    کردستان - بانه - کوچه پاساژ نور - پاساژ ارغوانی - بلوک ۲
                  </p>
                </div>
              </div>
            </div>

            {/* تلفن */}
            <div className="rounded-xl border border-[#E8DFC8] bg-white p-5">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-500 text-xl text-white">
                  📞
                </span>
                <div>
                  <h3 className="text-base font-bold text-gray-800">تلفن</h3>
                  <a
                    href="tel:09180540019"
                    dir="ltr"
                    className="mt-2 block text-sm font-bold text-amber-600 hover:text-amber-700"
                  >
                    ۰۹۱۸-۰۵۴-۰۰۱۹
                  </a>
                </div>
              </div>
            </div>

            {/* ایمیل */}
            <div className="rounded-xl border border-[#E8DFC8] bg-white p-5">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-500 text-xl text-white">
                  ✉️
                </span>
                <div>
                  <h3 className="text-base font-bold text-gray-800">ایمیل</h3>
                  <a
                    href="mailto:info@kawcamp.ir"
                    dir="ltr"
                    className="mt-2 block text-sm font-bold text-amber-600 hover:text-amber-700"
                  >
                    info@kawcamp.ir
                  </a>
                </div>
              </div>
            </div>

            {/* ساعات کاری */}
            <div className="rounded-xl border border-[#E8DFC8] bg-white p-5">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-500 text-xl text-white">
                  🕐
                </span>
                <div>
                  <h3 className="text-base font-bold text-gray-800">
                    ساعات کاری
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-gray-600">
                    شنبه تا پنجشنبه: ۹ صبح تا ۶ عصر
                    <br />
                    جمعه: تعطیل
                  </p>
                </div>
              </div>
            </div>

            {/* شبکه‌های اجتماعی */}
            <div className="rounded-xl border border-[#E8DFC8] bg-white p-5">
              <h3 className="mb-4 text-base font-bold text-gray-800">
                ما را دنبال کنید
              </h3>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://www.instagram.com/kawcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-pink-50 px-4 py-2.5 text-sm font-bold text-pink-600 transition hover:bg-pink-100"
                >
                  Instagram
                </a>
                <a
                  href="https://t.me/kawcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-sky-50 px-4 py-2.5 text-sm font-bold text-sky-600 transition hover:bg-sky-100"
                >
                  Telegram
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