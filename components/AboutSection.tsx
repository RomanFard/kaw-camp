"use client";

export default function AboutSection() {
  const stats = [
    { value: "۱۵", suffix: "+", label: "سال تجربه" },
    { value: "۳۲۰۰", suffix: "+", label: "مشتری راضی" },
    { value: "۵۰۰", suffix: "+", label: "محصول متنوع" },
  ];

  return (
    <section dir="rtl" className="relative overflow-hidden py-12 md:py-16">
      {/* تزئینات نارنجی */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -right-40 top-10 h-64 w-64 rounded-full bg-[#FF6B4A]/20 blur-[100px]" />
        <div className="absolute -left-40 bottom-10 h-64 w-64 rounded-full bg-[#FF6B4A]/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto w-full max-w-[1300px] px-6 md:px-10">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* ستون راست: متن */}
          <div className="flex flex-col justify-center">
            <div className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-[#FF6B4A]/30 bg-[#FF6B4A]/5 px-3.5 py-1.5 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF6B4A]" />
              <span className="text-[11px] font-bold tracking-wider text-[#FF6B4A] md:text-xs">
                از سال ۱۳۸۹
              </span>
            </div>

            <h2 className="mb-4 text-2xl font-black leading-tight text-white md:text-3xl lg:text-4xl">
              ساخته شده با
              <br />
              <span className="text-[#FF6B4A]">عشق به طبیعت</span>
            </h2>

            <div className="mb-5 h-[3px] w-14 rounded-full bg-[#FF6B4A]" />

            <div className="space-y-3 text-xs leading-6 text-zinc-400 md:text-sm md:leading-7">
              <p>
                بیش از یک دهه است که KAW CAMP مقصد اصلی کوهنوردان،
                طبیعت‌گردان و ماجراجویان ایران است. از تجهیزات ساده کمپینگ تا
                صعودهای حرفه‌ای، هر محصول را با دقت انتخاب می‌کنیم.
              </p>
              <p>
                تیم ما متشکل از کوهنوردان و طبیعت‌دوستان واقعی است که خودشان
                هر محصول را تست می‌کنند.
              </p>
            </div>

            {/* آمار */}
            <div className="mt-6 grid grid-cols-3 gap-2.5 md:gap-3.5">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 text-center backdrop-blur-sm transition hover:border-[#FF6B4A]/50 hover:bg-zinc-900 md:p-4"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-[#FF6B4A]/0 to-[#FF6B4A]/5 opacity-0 transition group-hover:opacity-100" />
                  <div className="relative flex items-baseline justify-center gap-0.5">
                    <span className="text-xl font-black text-[#FF6B4A] md:text-2xl lg:text-3xl">
                      {stat.value}
                    </span>
                    <span className="text-sm font-black text-[#FF6B4A] md:text-base">
                      {stat.suffix}
                    </span>
                  </div>
                  <div className="relative mt-1 text-[10px] font-bold text-zinc-400 md:text-xs">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* دکمه‌ها */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              <a
                href="/about"
                className="group inline-flex items-center gap-1.5 rounded-lg bg-[#FF6B4A] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-[#FF6B4A]/20 transition hover:bg-[#E55A3A] md:text-sm"
              >
                <span>درباره ما</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="h-3.5 w-3.5 transition group-hover:-translate-x-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                  />
                </svg>
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-4 py-2 text-xs font-bold text-white transition hover:border-[#FF6B4A] hover:text-[#FF6B4A] md:text-sm"
              >
                تماس با ما
              </a>
            </div>
          </div>

          {/* ستون چپ: عکس */}
          <div className="relative h-full min-h-[400px]">
            <div className="absolute inset-0 overflow-hidden rounded-xl shadow-2xl shadow-black/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://picsum.photos/seed/kawcamp-about/700/800"
                alt="KAW CAMP"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}