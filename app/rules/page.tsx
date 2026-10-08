import Header from "@/components/Header";
import Footer from "@/components/Footer";

const sections = [
  {
    num: "۱",
    title: "معرفی کاو کمپ",
    content: (
      <>
        <p>
          وب‌سایت کاو کمپ به آدرس اینترنتی kaw-camp.vercel.app، به فروش
          کالاهای مرتبط با طبیعت‌گردی و کمپینگ می‌پردازد. هدف اصلی ما ارائه
          محصولات باکیفیت و کاربردی برای علاقه‌مندان به طبیعت‌گردی و کمپینگ
          است. تمامی کالاهای موجود در سایت به‌صورت دقیق و مطابق با نیازهای
          مشتریان انتخاب می‌شوند.
        </p>
        <p>
          علاوه بر فروش اینترنتی، فروشگاه حضوری ما نیز در استان کردستان،
          شهرستان بانه، کوچه پاساژ نور، پاساژ ارغوانی، بلوک ۲ آماده ارائه
          خدمات به مشتریان عزیز است. فروشگاه حضوری امکان مشاهده و بررسی
          محصولات از نزدیک را برای مشتریان فراهم می‌کند تا با اطمینان بیشتری
          خرید خود را انجام دهند.
        </p>
      </>
    ),
  },
  {
    num: "۲",
    title: "شرایط ثبت‌نام و عضویت",
    content: (
      <>
        <p>
          برای استفاده از خدمات کاو کمپ و ثبت سفارش، لازم است در سایت ثبت‌نام
          کنید. ثبت‌نام در سایت به‌منظور مدیریت بهتر سفارشات و ارائه خدمات
          پشتیبانی انجام می‌شود.
        </p>
        <ul className="mt-3 list-inside list-disc space-y-2 pr-4">
          <li>
            <strong className="text-theme">الزام ثبت‌نام:</strong> ثبت‌نام در
            سایت الزامی است و تنها در صورت ثبت‌نام می‌توانید اقدام به ثبت سفارش
            کنید.
          </li>
          <li>
            <strong className="text-theme">محدودیت سنی:</strong> هیچ محدودیت
            سنی برای ثبت‌نام در سایت وجود ندارد. تمامی افراد، بدون توجه به سن،
            می‌توانند از خدمات ما استفاده کنند.
          </li>
          <li>
            <strong className="text-theme">فرآیند ثبت‌نام:</strong> در فرآیند
            ثبت‌نام، تنها شماره تماس فعال از کاربر دریافت می‌شود. پس از تکمیل
            اطلاعات، یک کد تأیید به شماره موبایل شما پیامک خواهد شد که برای
            تأیید ثبت‌نام ضروری است. این فرآیند به‌منظور افزایش امنیت و اطمینان
            کاربران انجام می‌شود.
          </li>
        </ul>
      </>
    ),
  },
  {
    num: "۳",
    title: "شرایط خرید و پرداخت",
    content: (
      <>
        <p>
          کاو کمپ شرایط پرداخت ساده و امنی را برای مشتریان فراهم کرده است تا
          فرآیند خرید به‌راحتی و با اطمینان انجام شود. روش‌های پرداخت در سایت
          عبارت‌اند از:
        </p>
        <ul className="mt-3 list-inside list-disc space-y-2 pr-4">
          <li>
            <strong className="text-theme">درگاه پرداخت ایمن:</strong> با
            استفاده از درگاه‌های بانکی معتبر، مشتریان می‌توانند به‌صورت آنلاین
            مبلغ سفارش خود را پرداخت کنند. این روش سریع‌ترین و امن‌ترین روش
            برای پرداخت است.
          </li>
          <li>
            <strong className="text-theme">واریز به شماره کارت:</strong> در
            صورت تمایل، مشتریان می‌توانند مبلغ سفارش خود را از طریق انتقال وجه
            به شماره کارت اعلام‌شده واریز کنند. اطلاعات کارت در زمان ثبت سفارش
            ارائه خواهد شد.
          </li>
          <li>
            <strong className="text-theme">خرید حضوری:</strong> علاوه بر خرید
            آنلاین، مشتریان می‌توانند با مراجعه به فروشگاه حضوری ما، محصولات را
            از نزدیک مشاهده و خریداری کنند.
          </li>
          <li>
            <strong className="text-theme">بررسی کالا پیش از ارسال:</strong>{" "}
            تمامی محصولات قبل از ارسال، توسط تیم کاو کمپ بررسی و کنترل کیفیت
            می‌شوند تا محصولی سالم و بدون نقص به دست مشتری برسد.
          </li>
        </ul>
      </>
    ),
  },
  {
    num: "۴",
    title: "شرایط ارسال و ضمانت کالا",
    content: (
      <>
        <p>
          کاو کمپ متعهد است محصولاتی مطابق با توضیحات و تصاویر درج‌شده در سایت
          به مشتریان ارائه دهد. فرآیند ارسال و ضمانت کالا به شرح زیر است:
        </p>
        <ul className="mt-3 list-inside list-disc space-y-2 pr-4">
          <li>
            <strong className="text-theme">تطابق کامل محصول:</strong> تمامی
            محصولات خریداری‌شده دقیقاً مطابق با تصاویر و توضیحات مندرج در سایت
            برای مشتری ارسال می‌شود.
          </li>
          <li>
            <strong className="text-theme">ضمانت اصالت کالا:</strong> تمامی
            محصولات موجود در سایت کاو کمپ دارای ضمانت اصالت کالا هستند.
          </li>
          <li>
            <strong className="text-theme">بررسی قبل از ارسال:</strong> پیش از
            ارسال، تیم کنترل کیفیت کاو کمپ محصول را بررسی می‌کند تا از سلامت
            فیزیکی و کارکرد آن اطمینان حاصل شود.
          </li>
          <li>
            <strong className="text-theme">مهلت تست ۳ روزه:</strong> پس از
            دریافت کالا، مشتریان تا ۳ روز فرصت دارند محصول را بررسی کنند. در
            صورتی که محصول دارای ایراد یا مشکلی باشد و دلیل مشتری منطقی و
            قانع‌کننده باشد، امکان مرجوعی محصول و تعویض آن با محصولی دیگر وجود
            دارد. هزینه‌های بازگشت کالا در این شرایط طبق توافق طرفین محاسبه
            خواهد شد.
          </li>
        </ul>
      </>
    ),
  },
  {
    num: "۵",
    title: "مسئولیت کاربران",
    content: (
      <>
        <p>
          کاو کمپ از تمامی کاربران انتظار دارد در هنگام استفاده از خدمات سایت
          مسئولیت‌پذیر باشند. موارد زیر در این بخش اهمیت دارد:
        </p>
        <ul className="mt-3 list-inside list-disc space-y-2 pr-4">
          <li>
            کاربران موظف هستند اطلاعات صحیح و کامل خود را در هنگام ثبت‌نام و
            ثبت سفارش ارائه دهند. هرگونه نقص در اطلاعات ممکن است باعث تأخیر یا
            بروز مشکل در تحویل کالا شود.
          </li>
          <li>
            استفاده غیرمجاز از سایت، از جمله تلاش برای ایجاد اختلال در سامانه،
            ممنوع است و در صورت مشاهده، کاو کمپ حق پیگیری قانونی را برای خود
            محفوظ می‌دارد.
          </li>
          <li>
            کاربران موظف به رعایت حقوق دیگر کاربران و استفاده صحیح از خدمات
            سایت هستند.
          </li>
        </ul>
      </>
    ),
  },
  {
    num: "۶",
    title: "حریم خصوصی کاربران",
    content: (
      <>
        <p>
          کاو کمپ همواره متعهد به حفظ اطلاعات شخصی کاربران خود است. ما تنها
          اطلاعات ضروری را دریافت و ذخیره می‌کنیم و از این اطلاعات صرفاً در
          جهت ارائه خدمات بهتر استفاده می‌شود:
        </p>
        <ul className="mt-3 list-inside list-disc space-y-2 pr-4">
          <li>
            در فرآیند ثبت‌نام، تنها شماره موبایل کاربر دریافت می‌شود.
          </li>
          <li>
            پس از ثبت سفارش، اطلاعات آدرس مشتری برای ارسال مرسوله ذخیره
            می‌شود. این اطلاعات به هیچ عنوان در اختیار اشخاص ثالث قرار
            نمی‌گیرد.
          </li>
          <li>
            در صورتی که مراجع قانونی یا قضایی درخواست دسترسی به اطلاعات
            کاربران را داشته باشند، کاو کمپ ضمن رعایت قوانین، نهایت تلاش خود
            را در حفظ حریم خصوصی کاربران خواهد کرد.
          </li>
        </ul>
      </>
    ),
  },
  {
    num: "۷",
    title: "مالکیت معنوی",
    content: (
      <>
        <p>
          تمامی محتوای تولیدشده در سایت کاو کمپ، اعم از تصاویر، متون و
          توضیحات محصولات، به‌طور اختصاصی توسط تیم محتوای کاو کمپ تهیه شده‌اند:
        </p>
        <ul className="mt-3 list-inside list-disc space-y-2 pr-4">
          <li>
            <strong className="text-theme">حق کپی‌رایت:</strong> استفاده از
            این محتوا برای دیگر وب‌سایت‌های فروشگاهی بدون کسب مجوز رسمی از کاو
            کمپ، پیگرد قانونی دارد.
          </li>
          <li>
            <strong className="text-theme">استفاده مجاز:</strong> مشتریان و
            کاربران عادی می‌توانند بدون مشکل از محتوای سایت برای اهداف شخصی
            استفاده کنند.
          </li>
        </ul>
        <p className="mt-3">
          محتوای تولیدشده توسط کاو کمپ حاصل تلاش تیم متخصص ما است و هرگونه
          کپی‌برداری غیرمجاز خلاف قوانین کپی‌رایت می‌باشد.
        </p>
      </>
    ),
  },
  {
    num: "۸",
    title: "تغییرات در قوانین و مقررات",
    content: (
      <>
        <p>
          کاو کمپ این حق را برای خود محفوظ می‌دارد که در هر زمان قوانین و
          مقررات سایت را تغییر دهد.
        </p>
        <ul className="mt-3 list-inside list-disc space-y-2 pr-4">
          <li>
            قوانین جدید در همین صفحه منتشر و اطلاع‌رسانی خواهد شد.
          </li>
          <li>
            مسئولیت مطالعه و آگاهی از تغییرات قوانین بر عهده کاربران است.
            استفاده ادامه‌دار از خدمات سایت به معنای پذیرش قوانین جدید خواهد
            بود.
          </li>
        </ul>
      </>
    ),
  },
  {
    num: "۹",
    title: "پشتیبانی و ارتباط با ما",
    content: (
      <>
        <p>
          کاو کمپ همواره در تلاش است خدمات پشتیبانی مطلوبی را به مشتریان ارائه
          دهد. شما می‌توانید از طریق روش‌های زیر با ما در ارتباط باشید:
        </p>
        <ul className="mt-3 list-inside list-disc space-y-2 pr-4">
          <li>
            <strong className="text-theme">سامانه گفتگوی آنلاین:</strong> در
            تمامی صفحات سایت، امکان ارتباط فوری با تیم پشتیبانی وجود دارد.
          </li>
          <li>
            <strong className="text-theme">تماس تلفنی:</strong> شماره‌های تماس
            در انتهای صفحه سایت درج شده و تیم پشتیبانی به‌صورت شبانه‌روزی آماده
            پاسخگویی هستند.
          </li>
          <li>
            <strong className="text-theme">شبکه‌های اجتماعی:</strong> تیم کاو
            کمپ از طریق پیج اینستاگرام، کانال تلگرام و واتس‌اپ نیز در دسترس
            مشتریان عزیز خواهد بود.
          </li>
        </ul>
      </>
    ),
  },
  {
    num: "۱۰",
    title: "ضمانت و مرجوعی کالا",
    content: (
      <>
        <p>
          کاو کمپ با هدف جلب رضایت مشتریان، شرایط مناسبی برای ضمانت و مرجوعی
          کالا در نظر گرفته است:
        </p>
        <ul className="mt-3 list-inside list-disc space-y-2 pr-4">
          <li>
            <strong className="text-theme">ضمانت اصالت کالا:</strong> تمامی
            محصولات دارای ضمانت اصالت و سلامت هستند.
          </li>
          <li>
            در صورتی که محصول ارسالی دارای مشکل یا نقص باشد، مشتری می‌تواند
            ظرف مدت ۳ روز کاری درخواست مرجوعی یا تعویض کالا را ثبت کند.
          </li>
          <li>
            پس از بررسی و تأیید مشکل توسط تیم کاو کمپ، محصول مرجوع‌شده تعویض یا
            مبلغ پرداخت‌شده به مشتری بازگردانده خواهد شد.
          </li>
          <li>
            کاو کمپ متعهد است تمامی فرآیندهای مربوط به مرجوعی کالا را در
            سریع‌ترین زمان ممکن انجام دهد.
          </li>
        </ul>
      </>
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
          <a href="/" className="transition hover:text-accent">
            خانه
          </a>
          <span className="mx-2">/</span>
          <span className="text-theme">قوانین و مقررات</span>
        </nav>

        {/* هدر صفحه */}
        <div className="mb-8 rounded-2xl border border-theme bg-theme-card p-8 text-center md:p-12">
          <span className="inline-block rounded-full border border-accent/30 bg-accent/5 px-5 py-2 text-sm font-semibold text-accent">
            قوانین و مقررات
          </span>
          <h1 className="mt-5 text-2xl font-bold text-theme md:text-3xl">
            قوانین و مقررات کاو کمپ
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-theme-muted">
            لطفاً پیش از استفاده از خدمات کاو کمپ، قوانین و مقررات زیر را
            با دقت مطالعه فرمایید. استفاده از خدمات سایت به معنای پذیرش این
            قوانین است.
          </p>
        </div>

        {/* محتوا */}
        <div className="mx-auto max-w-4xl space-y-6">
          {sections.map((section, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-theme bg-theme-card"
            >
              {/* عنوان بخش */}
              <div className="flex items-center gap-4 border-b border-theme bg-theme-surface px-6 py-4">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent text-lg font-black text-white">
                  {section.num}
                </span>
                <h2 className="text-base font-bold text-theme md:text-lg">
                  {section.title}
                </h2>
              </div>

              {/* محتوا */}
              <div className="px-6 py-5 text-sm leading-8 text-theme-muted md:text-base md:leading-9">
                {section.content}
              </div>
            </div>
          ))}

          {/* پیام پایانی */}
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6 md:p-8">
            <p className="text-sm leading-8 text-theme md:text-base md:leading-9">
              با ثبت‌نام و استفاده از خدمات کاو کمپ، شما تأیید می‌کنید که
              قوانین و مقررات ذکرشده را مطالعه کرده و می‌پذیرید. هدف ما در
              کاو کمپ ارائه بهترین خدمات و محصولات با بالاترین کیفیت به
              مشتریان عزیز است. از همراهی شما سپاسگزاریم.
            </p>
            <p className="mt-4 font-black text-accent">
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
                href="mailto:mohamadxanzadeh@gmail.com"
                className="flex items-center gap-3 rounded-lg border border-theme bg-theme-surface p-4 transition hover:border-accent"
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent text-lg text-white">
                  ✉️
                </span>
                <div>
                  <div className="text-xs font-bold text-theme-muted">
                    ایمیل
                  </div>
                  <div className="mt-0.5 text-sm font-bold text-theme">
                    mohamadxanzadeh@gmail.com
                  </div>
                </div>
              </a>

              <a
                href="tel:09180540019"
                className="flex items-center gap-3 rounded-lg border border-theme bg-theme-surface p-4 transition hover:border-accent"
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent text-lg text-white">
                  📞
                </span>
                <div>
                  <div className="text-xs font-bold text-theme-muted">
                    تلفن
                  </div>
                  <div className="mt-0.5 text-sm font-bold text-theme">
                    ۰۹۱۸-۰۵۴-۰۰۱۹
                  </div>
                </div>
              </a>

              <div className="flex items-start gap-3 rounded-lg border border-theme bg-theme-surface p-4 md:col-span-2">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent text-lg text-white">
                  📍
                </span>
                <div>
                  <div className="text-xs font-bold text-theme-muted">
                    آدرس فروشگاه
                  </div>
                  <div className="mt-0.5 text-sm font-bold text-theme">
                    کردستان - بانه - کوچه پاساژ نور - پاساژ ارغوانی - بلوک ۲
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-2xl bg-accent p-8 text-center text-white">
            <h2 className="text-xl font-bold md:text-2xl">
              سوالی درباره قوانین دارید؟
            </h2>
            <p className="mt-3 text-base text-white/90">
              تیم پشتیبانی ما آماده پاسخگویی به شماست
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href="/contact"
                className="rounded-lg bg-white px-6 py-3 text-sm font-bold text-accent transition hover:bg-white/90"
              >
                تماس با ما
              </a>
              <a
                href="/faq"
                className="rounded-lg border-2 border-white/60 bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/20"
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