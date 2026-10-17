import Header from "@/components/Header";
import Footer from "@/components/Footer";

const sections = [
  {
    num: "۱",
    title: "حساب کاربری",
    content: (
      <p>
        کاربران موظف‌اند اطلاعات صحیح، کامل و به‌روز هنگام ثبت‌نام وارد کنند.
        مسئولیت حفظ اطلاعات حساب کاربری و رمز عبور بر عهده کاربر است. فروشگاه
        می‌تواند در صورت مشاهده اطلاعات نادرست یا سوءاستفاده، حساب کاربری را
        محدود یا مسدود کند.
      </p>
    ),
  },
  {
    num: "۲",
    title: "ثبت سفارش",
    content: (
      <p>
        ثبت سفارش به معنای رزرو قطعی کالا نیست و نهایی شدن سفارش منوط به تأیید
        پرداخت و موجودی کالا خواهد بود. در صورت اتمام موجودی یا بروز خطای
        قیمتی، فروشگاه حق لغو سفارش و بازگشت وجه را خواهد داشت. کاربران
        موظف‌اند پیش از ثبت سفارش، مشخصات کالا را به‌دقت مطالعه کنند.
      </p>
    ),
  },
  {
    num: "۳",
    title: "قیمت‌گذاری و پرداخت",
    content: (
      <p>
        تمامی قیمت‌ها به تومان و به‌روز هستند. هزینه ارسال بسته به مقصد، وزن
        و حجم سفارش محاسبه می‌شود. پرداخت سفارش‌ها از طریق درگاه‌های امن
        بانکی انجام می‌شود. در صورت بروز خطا در پرداخت، مبلغ کسرشده طبق
        قوانین بانکی به حساب خریدار بازخواهد گشت.
      </p>
    ),
  },
  {
    num: "۴",
    title: "ارسال و تحویل سفارش",
    content: (
      <p>
        سفارش‌ها در روزهای کاری پردازش و ارسال می‌شوند. زمان تقریبی تحویل
        بسته به شهر مقصد و شرکت حمل‌ونقل متفاوت است. مسئولیت تأخیر ناشی از
        شرایط جوی، اختلالات حمل‌ونقل یا حوادث خارج از کنترل فروشگاه بر عهده
        فروشگاه نخواهد بود. مشتری موظف است هنگام تحویل کالا، سلامت کالا را
        بررسی کند.
      </p>
    ),
  },
  {
    num: "۵",
    title: "شرایط بازگشت کالا",
    content: (
      <p>
        درخواست مرجوعی فقط در صورت وجود ایراد فنی، آسیب‌دیدگی یا مغایرت کالا
        با سفارش قابل بررسی است. کالا باید در شرایط اولیه، بدون استفاده و
        همراه با بسته‌بندی کامل بازگردانده شود. کالاهای مصرفی، بهداشتی یا
        سفارشی‌شده شامل مرجوعی نخواهند بود مگر در صورت ایراد فنی. هزینه
        بازگشت کالا در صورت تأیید ایراد بر عهده فروشگاه خواهد بود.
      </p>
    ),
  },
  {
    num: "۶",
    title: "ضمانت اصالت کالا",
    content: (
      <p>
        فروشگاه متعهد به ارائه کالاهای اصل و مطابق مشخصات درج‌شده است. در
        صورت اثبات عدم اصالت کالا، مبلغ پرداختی به‌طور کامل عودت داده خواهد
        شد.
      </p>
    ),
  },
  {
    num: "۷",
    title: "مسئولیت استفاده از محصولات",
    content: (
      <p>
        استفاده صحیح و ایمن از تجهیزات کمپینگ، سفر و طبیعت‌گردی بر عهده خریدار
        است. فروشگاه مسئول خسارات ناشی از استفاده نادرست، نصب غیراصولی یا
        نگهداری نامناسب محصولات نخواهد بود.
      </p>
    ),
  },
  {
    num: "۸",
    title: "حریم خصوصی کاربران",
    content: (
      <p>
        اطلاعات شخصی کاربران نزد فروشگاه محفوظ بوده و بدون رضایت کاربر در
        اختیار شخص یا سازمان ثالث قرار نخواهد گرفت؛ مگر در موارد الزام قانونی.
        اطلاعات کاربران فقط برای پردازش سفارش، پشتیبانی و بهبود خدمات استفاده
        می‌شود.
      </p>
    ),
  },
  {
    num: "۹",
    title: "مالکیت محتوا",
    content: (
      <p>
        تمامی تصاویر، متون، طراحی‌ها و محتوای وب‌سایت متعلق به فروشگاه است.
        هرگونه کپی‌برداری یا استفاده تجاری بدون اجازه کتبی ممنوع است.
      </p>
    ),
  },
  {
    num: "۱۰",
    title: "ارتباط با مشتریان",
    content: (
      <>
        <p>
          ارتباط رسمی فروشگاه با کاربران از طریق شماره تماس، ایمیل یا
          شبکه‌های اجتماعی رسمی فروشگاه انجام می‌شود.
        </p>
        <p className="mt-3">
          کاربران موظف‌اند اطلاعات تماس صحیح و در دسترس ثبت کنند.
        </p>
      </>
    ),
  },
  {
    num: "۱۱",
    title: "شرایط فورس ماژور",
    content: (
      <p>
        در شرایطی مانند قطعی گسترده اینترنت، بلایای طبیعی، جنگ، اختلالات
        سراسری حمل‌ونقل یا سایر موارد خارج از کنترل، فروشگاه مسئول تأخیر یا
        عدم امکان ارائه خدمات نخواهد بود.
      </p>
    ),
  },
  {
    num: "۱۲",
    title: "پشتیبانی مشتریان",
    content: (
      <p>
        در صورت وجود هرگونه سؤال، مشکل یا درخواست، کاربران می‌توانند از طریق
        بخش تماس با ما با تیم پشتیبانی ارتباط برقرار کنند.
      </p>
    ),
  },
];

export default function RulesPage() {
  return (
    <main className="min-h-screen bg-theme">
      <Header />

      <div className="mx-auto max-w-[1600px] px-6 py-8">
        {/* مسیر ناوبری */}
        <nav className="mb-6 text-sm text-theme-muted">
          <a href="/" className="transition hover:text-theme">
            خانه
          </a>
          <span className="mx-2">/</span>
          <span className="text-theme">قوانین و مقررات</span>
        </nav>

        {/* هدر صفحه */}
        <div className="mb-8 rounded-2xl border border-theme bg-theme-card p-8 text-center md:p-12">
          <span className="inline-block rounded-full border border-theme bg-theme-surface px-5 py-2 text-sm font-semibold text-theme">
            قوانین و مقررات
          </span>
          <h1 className="mt-5 text-2xl font-bold text-theme md:text-3xl">
            شرایط و قوانین فروشگاه کاو کمپ
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-theme-muted">
            به فروشگاه اینترنتی کاو کمپ خوش آمدید. استفاده از خدمات، ثبت سفارش
            و خرید از این وب‌سایت به منزله مطالعه، آگاهی و پذیرش کامل قوانین و
            مقررات زیر توسط کاربر است. این قوانین مطابق با قوانین تجارت
            الکترونیک جمهوری اسلامی ایران تدوین شده‌اند و ممکن است در آینده
            به‌روزرسانی شوند.
          </p>
        </div>

        {/* محتوا */}
        <div className="mx-auto max-w-4xl space-y-6">
          {sections.map((section, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-theme bg-theme-card"
            >
              <div className="flex items-center gap-4 border-b border-theme bg-theme-surface px-6 py-4">
                {/* 🆕 آیکون شماره با پس‌زمینه مشکی */}
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-zinc-900 text-lg font-black text-white">
                  {section.num}
                </span>
                <h2 className="text-base font-bold text-theme md:text-lg">
                  {section.title}
                </h2>
              </div>

              <div className="px-6 py-5 text-sm leading-8 text-theme-muted md:text-base md:leading-9">
                {section.content}
              </div>
            </div>
          ))}

          {/* پیام پایانی */}
          <div className="rounded-2xl border border-theme bg-theme-surface p-6 md:p-8">
            <p className="text-sm leading-8 text-theme md:text-base md:leading-9">
              با ثبت‌نام و استفاده از خدمات کاو کمپ، شما تأیید می‌کنید که
              قوانین و مقررات ذکرشده را مطالعه کرده و می‌پذیرید. هدف ما در
              کاو کمپ ارائه بهترین خدمات و محصولات با بالاترین کیفیت به
              مشتریان عزیز است. از همراهی شما سپاسگزاریم.
            </p>
            <p className="mt-4 font-black text-theme">
              کاو کمپ — تجربه‌ای متفاوت در خرید تجهیزات طبیعت‌گردی و کمپینگ
            </p>
          </div>

          {/* اطلاعات تماس */}
          <div className="rounded-2xl border border-theme bg-theme-card p-6 md:p-8">
            <h2 className="mb-5 text-lg font-bold text-theme">
              اطلاعات تماس
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <a
                href="mailto:kawcamp@outlook.com"
                className="flex items-center gap-3 rounded-lg border border-theme bg-theme-surface p-4 transition hover:border-accent"
              >
                {/* 🆕 آیکون با پس‌زمینه مشکی */}
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-zinc-900 text-lg text-white">
                  ✉️
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-theme-muted">
                    ایمیل
                  </div>
                  <div className="mt-0.5 truncate text-sm font-bold text-theme" dir="ltr">
                    kawcamp@outlook.com
                  </div>
                </div>
              </a>

              <a
                href="tel:09307582003"
                className="flex items-center gap-3 rounded-lg border border-theme bg-theme-surface p-4 transition hover:border-accent"
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-zinc-900 text-lg text-white">
                  📞
                </span>
                <div>
                  <div className="text-xs font-bold text-theme-muted">
                    تلفن
                  </div>
                  <div className="mt-0.5 text-sm font-bold text-theme" dir="ltr">
                    ۰۹۳۰-۷۵۸-۲۰۰۳
                  </div>
                </div>
              </a>

              <div className="flex items-start gap-3 rounded-lg border border-theme bg-theme-surface p-4 md:col-span-2">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-zinc-900 text-lg text-white">
                  📍
                </span>
                <div>
                  <div className="text-xs font-bold text-theme-muted">
                    آدرس فروشگاه
                  </div>
                  <div className="mt-0.5 text-sm font-bold text-theme">
                    کردستان، بانه، کوچه پاساژ نور، بلوک ۲
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-2xl bg-zinc-900 p-8 text-center text-white">
            <h2 className="text-xl font-bold md:text-2xl">
              سوالی درباره قوانین دارید؟
            </h2>
            <p className="mt-3 text-base text-zinc-300">
              تیم پشتیبانی ما آماده پاسخگویی به شماست
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href="/contact"
                className="rounded-lg bg-white px-6 py-3 text-sm font-bold text-zinc-900 transition hover:bg-zinc-100"
              >
                تماس با ما
              </a>
              <a
                href="/faq"
                className="rounded-lg border-2 border-white/40 bg-transparent px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                سوالات متداول
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}