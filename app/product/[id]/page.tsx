import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AddToCartSection from "@/components/AddToCartSection";
import { getProductById, categories } from "@/data/products";

const tabs = ["معرفی", "مشخصات", "پیشنهاد ما", "دیدگاه‌ها"];

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const brand = product.brand || "KAW CAMP";
  const englishName =
    product.englishName || product.slug.replace(/-/g, " ").toUpperCase();
  const colors = product.colors || [];
  const categoryLabel =
    categories.find((c) => c.key === product.category)?.label || product.category;

  return (
    <main className="min-h-screen bg-[#F7F1E3]">
      <Header />

      <div className="mx-auto max-w-[1600px] px-6 py-5">
        {/* مسیر ناوبری */}
        <nav className="mb-5 text-sm text-gray-500">
          <a href="/" className="hover:text-amber-600">خانه</a>
          <span className="mx-2">/</span>
          <a href="/products" className="hover:text-amber-600">محصولات</a>
          <span className="mx-2">/</span>
          <a
            href={"/products?cat=" + product.category}
            className="hover:text-amber-600"
          >
            {categoryLabel}
          </a>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{product.name}</span>
        </nav>

        {/* گرید اصلی: سایدبار چپ + محتوا راست */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* محتوای اصلی - سمت راست */}
          <div className="space-y-6">
            {/* بخش بالای محصول */}
            <div className="grid gap-6 rounded-xl border border-[#E8DFC8] bg-white p-6 md:grid-cols-2">
              {/* اطلاعات - سمت راست (اول در RTL) */}
              <div>
                {/* نام محصول */}
                <h1 className="text-lg font-bold leading-8 text-gray-900 md:text-xl">
                  {product.name}
                </h1>

                {/* نام انگلیسی */}
                <p className="mt-1 text-sm text-gray-400">{englishName}</p>

                {/* برند */}
                <div className="mt-5 flex items-center gap-3 border-b border-[#EDE4CE] pb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <img
                      src={
                        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/120px-Google_2015_logo.svg.png"
                      }
                      alt={brand}
                      className="h-6 w-6 object-contain opacity-50"
                    />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">برند</div>
                    <div className="text-sm font-bold text-gray-800">
                      {brand}
                    </div>
                  </div>
                </div>

                {/* ویژگی‌ها */}
                <div className="mt-4 text-sm font-bold text-gray-800">
                  ویژگی‌ها
                </div>

                {/* کارت‌های ویژگی */}
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {colors.length > 0 ? (
                    colors.slice(0, 3).map((c) => (
                      <div
                        key={c.label}
                        className="rounded-lg border border-[#E8DFC8] bg-[#F7F1E3] p-3 text-center"
                      >
                        <div className="text-[10px] text-gray-500">رنگ</div>
                        <div className="mt-1 text-xs font-bold text-gray-800">
                          {c.label}
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="rounded-lg border border-[#E8DFC8] bg-[#F7F1E3] p-3 text-center">
                        <div className="text-[10px] text-gray-500">رنگ</div>
                        <div className="mt-1 text-xs font-bold text-gray-800">
                          مشکی
                        </div>
                      </div>
                      <div className="rounded-lg border border-[#E8DFC8] bg-[#F7F1E3] p-3 text-center">
                        <div className="text-[10px] text-gray-500">رنگ</div>
                        <div className="mt-1 text-xs font-bold text-gray-800">
                          سبز
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* مشاهده همه ویژگی‌ها */}
                <button
                  type="button"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-[#E8DFC8] py-2 text-sm font-semibold text-gray-700 hover:bg-[#F7F1E3]"
                >
                  <span>مشاهده همه ویژگی‌ها</span>
                  <span>‹</span>
                </button>

                {/* توضیح کوتاه */}
                <p className="mt-5 text-sm leading-7 text-gray-700">
                  {product.shortDesc}
                </p>
              </div>

              {/* تصویر - سمت چپ */}
              <div>
                <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* گالری تصاویر */}
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="aspect-square overflow-hidden rounded-lg border border-[#E8DFC8] bg-gray-100"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover opacity-70"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* بخش توضیحات و تب‌ها */}
            <div className="rounded-xl border border-[#E8DFC8] bg-white">
              {/* نوار تب‌ها */}
              <div className="flex border-b border-[#E8DFC8]">
                {tabs.map((t, i) => (
                  <button
                    key={t}
                    type="button"
                    className={
                      "flex items-center gap-2 px-6 py-4 text-sm font-bold transition " +
                      (i === 0
                        ? "border-b-2 border-amber-500 text-amber-600"
                        : "border-b-2 border-transparent text-gray-600 hover:text-amber-600")
                    }
                  >
                    <span>{["📝", "📋", "🎯", "💬"][i]}</span>
                    <span>{t}</span>
                  </button>
                ))}
              </div>

              {/* محتوای توضیحات */}
              <div className="p-6">
                <h2 className="mb-2 text-base font-bold text-gray-800">
                  توضیحات محصول
                </h2>
                <p className="mb-4 text-sm text-gray-400">{englishName}</p>
                <p className="leading-8 text-gray-700">{product.description}</p>

                <h3 className="mt-8 mb-4 text-base font-bold text-gray-800">
                  ویژگی‌های کلیدی
                </h3>
                <ul className="space-y-3">
                  {product.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <span className="mt-0.5 text-amber-500">◆</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* سایدبار - سمت چپ */}
          <div>
            <AddToCartSection product={product} />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}