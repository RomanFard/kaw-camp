"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/components/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/context/ToastContext";

export default function CheckoutPage() {
  const {
    items,
    totalPrice,
    totalItems,
    appliedCode,
    discountAmount,
    totalAfterDiscount,
    applyCode,
    removeCode,
    clearCart,
  } = useCart();

  const supabase = createClient();
  const toast = useToast();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    province: "",
    city: "",
    address: "",
    postalCode: "",
    note: "",
  });
  const [shipping, setShipping] = useState("post");
  const [payment, setPayment] = useState("online");

  // ─── کد تخفیف ───
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState("");
  const [codeSuccess, setCodeSuccess] = useState("");

  // ─── ثبت سفارش ───
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const shippingCost = shipping === "post" ? 80000 : 0;
  const finalPrice = totalAfterDiscount + shippingCost;

  const codeInvalid =
    appliedCode !== null &&
    discountAmount === 0 &&
    appliedCode.minPurchase !== undefined &&
    totalPrice < appliedCode.minPurchase;

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleApplyCode(e: React.FormEvent) {
    e.preventDefault();
    setCodeError("");
    setCodeSuccess("");

    const result = await applyCode(codeInput);
    if (result.success) {
      toast.success("کد تخفیف با موفقیت اعمال شد 🎉");
      setCodeInput("");
    } else {
      toast.error(result.error);
    }
  }

  function handleRemoveCode() {
    removeCode();
    toast.info("کد تخفیف حذف شد");
    setCodeError("");
    setCodeSuccess("");
  }

  // ─── ثبت نهایی سفارش ───
  async function handleSubmitOrder() {
    setSubmitError("");

    // اعتبارسنجی
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error("نام و نام خانوادگی الزامی است");
      return;
    }
    if (!form.phone.trim()) {
      toast.error("شماره تماس الزامی است");
      return;
    }
    if (shipping === "post") {
      if (!form.province.trim() || !form.city.trim() || !form.address.trim()) {
        toast.error("برای ارسال پستی، استان، شهر و آدرس الزامی است");
        return;
      }
    }

    setSubmitting(true);

    // اطلاعات سبد برای ذخیره
    const orderItems = items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }));

    // دریافت شماره پیگیری از تابع Supabase
    const { data: numData, error: numError } = await supabase.rpc(
      "generate_order_number"
    );

    if (numError || !numData) {
      toast.error("خطا در تولید شماره پیگیری. لطفاً دوباره تلاش کنید.");
      setSubmitting(false);
      return;
    }

    // ثبت سفارش
    const { error: insertError } = await supabase.from("orders").insert({
      order_number: numData,
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      province: form.province.trim() || null,
      city: form.city.trim() || null,
      address: form.address.trim() || null,
      postal_code: form.postalCode.trim() || null,
      items: orderItems,
      subtotal: totalPrice,
      discount_amount: discountAmount,
      discount_code: appliedCode?.code ?? null,
      shipping_cost: shippingCost,
      total: finalPrice,
      shipping_method: shipping,
      payment_method: payment,
      status: "pending",
      note: form.note.trim() || null,
    });

    if (insertError) {
      console.error(insertError);
      toast.error("خطا در ثبت سفارش: " + insertError.message);
      setSubmitting(false);
      return;
    }

    // موفقیت
    toast.success(`سفارش ${numData} با موفقیت ثبت شد!`);
    setOrderNumber(numData);
    clearCart();
    setSubmitting(false);
  }

  // ─── صفحه موفقیت ───
  if (orderNumber) {
    return (
      <main className="min-h-screen bg-[#F7F1E3]">
        <Header />
        <div className="mx-auto max-w-2xl px-6 py-16">
          <div className="rounded-3xl border border-[#D4C5A0] bg-white p-8 text-center shadow-lg">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-5xl">
              ✅
            </div>
            <h1 className="text-2xl font-black text-gray-900">
              سفارش شما با موفقیت ثبت شد!
            </h1>
            <p className="mt-3 text-sm text-gray-600">
              به‌زودی با شما تماس می‌گیریم تا سفارش را تأیید کنیم.
            </p>

            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p className="text-xs font-bold text-amber-700">
                شماره پیگیری سفارش
              </p>
              <p className="mt-2 font-mono text-2xl font-black text-amber-800">
                {orderNumber}
              </p>
              <p className="mt-2 text-xs text-amber-600">
                این شماره را برای پیگیری سفارش نزد خود نگه دارید.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="/products"
                className="flex-1 rounded-lg bg-[#FF6B4A] py-3 text-sm font-bold text-white transition hover:bg-[#E55A3A]"
              >
                بازگشت به فروشگاه
              </a>
              <a
                href="/"
                className="flex-1 rounded-lg border border-[#D4C5A0] py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
              >
                صفحه اصلی
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F1E3]">
      <Header />

      <div className="mx-auto max-w-[1600px] px-6 py-8">
        {/* مسیر ناوبری */}
        <nav className="mb-6 text-sm text-gray-500">
          <a href="/" className="hover:text-amber-600">خانه</a>
          <span className="mx-2">/</span>
          <a href="/cart" className="hover:text-amber-600">سبد خرید</a>
          <span className="mx-2">/</span>
          <span className="text-gray-800">تسویه حساب</span>
        </nav>

        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          تسویه حساب
        </h1>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-[#D4C5A0] bg-white p-12 text-center">
            <p className="text-6xl">🛒</p>
            <p className="mt-4 text-lg font-bold text-gray-800">
              سبد خرید شما خالی است
            </p>
            <p className="mt-2 text-sm text-gray-500">
              برای تسویه حساب ابتدا محصولی به سبد اضافه کنید.
            </p>
            <a
              href="/products"
              className="mt-6 inline-block rounded-lg bg-amber-500 px-6 py-3 text-base font-bold text-white transition hover:bg-amber-600"
            >
              مشاهده محصولات
            </a>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            {/* فرم */}
            <div className="space-y-4">
              {/* اطلاعات گیرنده */}
              <div className="rounded-xl border border-[#D4C5A0] bg-white p-6">
                <h2 className="mb-5 text-lg font-bold text-gray-800">
                  اطلاعات گیرنده
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      نام
                    </label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      className="w-full rounded-lg border border-[#D4C5A0] bg-[#F7F1E3]/30 px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      نام خانوادگی
                    </label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      className="w-full rounded-lg border border-[#D4C5A0] bg-[#F7F1E3]/30 px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      شماره تماس
                    </label>
                    <input
                      type="tel"
                      dir="ltr"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="w-full rounded-lg border border-[#D4C5A0] bg-[#F7F1E3]/30 px-4 py-2.5 text-right text-sm outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      ایمیل (اختیاری)
                    </label>
                    <input
                      type="email"
                      dir="ltr"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="w-full rounded-lg border border-[#D4C5A0] bg-[#F7F1E3]/30 px-4 py-2.5 text-right text-sm outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* آدرس */}
              <div className="rounded-xl border border-[#D4C5A0] bg-white p-6">
                <h2 className="mb-5 text-lg font-bold text-gray-800">
                  آدرس تحویل
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      استان
                    </label>
                    <input
                      type="text"
                      value={form.province}
                      onChange={(e) => updateField("province", e.target.value)}
                      className="w-full rounded-lg border border-[#D4C5A0] bg-[#F7F1E3]/30 px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      شهر
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      className="w-full rounded-lg border border-[#D4C5A0] bg-[#F7F1E3]/30 px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      آدرس کامل
                    </label>
                    <textarea
                      rows={3}
                      value={form.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      className="w-full resize-none rounded-lg border border-[#D4C5A0] bg-[#F7F1E3]/30 px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      کد پستی
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={form.postalCode}
                      onChange={(e) => updateField("postalCode", e.target.value)}
                      className="w-full rounded-lg border border-[#D4C5A0] bg-[#F7F1E3]/30 px-4 py-2.5 text-right text-sm outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* روش ارسال */}
              <div className="rounded-xl border border-[#D4C5A0] bg-white p-6">
                <h2 className="mb-5 text-lg font-bold text-gray-800">
                  روش ارسال
                </h2>

                <div className="space-y-3">
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#D4C5A0] p-4 transition hover:bg-[#F7F1E3]/30">
                    <input
                      type="radio"
                      name="shipping"
                      value="post"
                      checked={shipping === "post"}
                      onChange={() => setShipping("post")}
                      className="h-4 w-4 accent-amber-500"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-bold text-gray-800">
                        پست پیشتاز
                      </div>
                      <div className="text-xs text-gray-500">
                        ۳ تا ۵ روز کاری
                      </div>
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      ۸۰,۰۰۰ تومان
                    </div>
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#D4C5A0] p-4 transition hover:bg-[#F7F1E3]/30">
                    <input
                      type="radio"
                      name="shipping"
                      value="pickup"
                      checked={shipping === "pickup"}
                      onChange={() => setShipping("pickup")}
                      className="h-4 w-4 accent-amber-500"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-bold text-gray-800">
                        تحویل حضوری
                      </div>
                      <div className="text-xs text-gray-500">
                        مراجعه به فروشگاه در بانه
                      </div>
                    </div>
                    <div className="text-sm font-bold text-green-600">
                      رایگان
                    </div>
                  </label>
                </div>
              </div>

              {/* روش پرداخت */}
              <div className="rounded-xl border border-[#D4C5A0] bg-white p-6">
                <h2 className="mb-5 text-lg font-bold text-gray-800">
                  روش پرداخت
                </h2>

                <div className="space-y-3">
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#D4C5A0] p-4 transition hover:bg-[#F7F1E3]/30">
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={payment === "online"}
                      onChange={() => setPayment("online")}
                      className="h-4 w-4 accent-amber-500"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-bold text-gray-800">
                        پرداخت آنلاین
                      </div>
                      <div className="text-xs text-gray-500">
                        درگاه پرداخت امن
                      </div>
                    </div>
                    <span className="text-xl">💳</span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#D4C5A0] p-4 transition hover:bg-[#F7F1E3]/30">
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked={payment === "cash"}
                      onChange={() => setPayment("cash")}
                      className="h-4 w-4 accent-amber-500"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-bold text-gray-800">
                        پرداخت در محل
                      </div>
                      <div className="text-xs text-gray-500">
                        هنگام تحویل کالا
                      </div>
                    </div>
                    <span className="text-xl">💵</span>
                  </label>
                </div>
              </div>

              {/* توضیحات */}
              <div className="rounded-xl border border-[#D4C5A0] bg-white p-6">
                <h2 className="mb-3 text-lg font-bold text-gray-800">
                  توضیحات سفارش (اختیاری)
                </h2>
                <textarea
                  rows={3}
                  value={form.note}
                  onChange={(e) => updateField("note", e.target.value)}
                  placeholder="مثلاً: لطفاً قبل از ارسال تماس بگیرید"
                  className="w-full resize-none rounded-lg border border-[#D4C5A0] bg-[#F7F1E3]/30 px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* خلاصه سفارش */}
            <aside className="sticky top-4 h-fit space-y-4">
              {/* لیست محصولات */}
              <div className="rounded-xl border border-[#D4C5A0] bg-white p-5">
                <h2 className="mb-4 border-b border-[#EDE4CE] pb-3 text-lg font-bold text-gray-800">
                  سفارش شما ({totalItems} کالا)
                </h2>

                <div className="max-h-[280px] space-y-3 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-[#EDE4CE] bg-gray-50">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="line-clamp-1 text-xs font-semibold text-gray-800">
                          {item.name}
                        </div>
                        <div className="mt-1 flex items-center justify-between text-xs">
                          <span className="text-gray-500">
                            {item.quantity} عدد
                          </span>
                          <span className="font-bold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* کد تخفیف */}
              <div className="rounded-xl border border-[#D4C5A0] bg-white p-5">
                <h2 className="mb-3 text-sm font-bold text-gray-800">
                  🎟️ کد تخفیف
                </h2>

                {appliedCode ? (
                  <div
                    className={`rounded-lg border p-3 ${
                      codeInvalid
                        ? "border-amber-300 bg-amber-50"
                        : "border-green-300 bg-green-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🎟️</span>
                          <span
                            className={`font-bold ${
                              codeInvalid ? "text-amber-800" : "text-green-800"
                            }`}
                          >
                            {appliedCode.code}
                          </span>
                        </div>
                        <p
                          className={`mt-1 text-xs ${
                            codeInvalid ? "text-amber-700" : "text-green-700"
                          }`}
                        >
                          {codeInvalid
                            ? `شرط این کد برقرار نیست (حداقل خرید ${appliedCode.minPurchase?.toLocaleString(
                                "fa-IR"
                              )} تومان)`
                            : appliedCode.description}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCode}
                        aria-label="حذف کد"
                        className="flex h-6 w-6 items-center justify-center rounded-full text-gray-400 transition hover:bg-white hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCode}>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={codeInput}
                        onChange={(e) => {
                          setCodeInput(e.target.value);
                          setCodeError("");
                          setCodeSuccess("");
                        }}
                        placeholder="مثلاً KAW10"
                        className="min-w-0 flex-1 rounded-lg border border-[#D4C5A0] bg-white px-3 py-2 text-sm outline-none transition focus:border-amber-500"
                        dir="ltr"
                      />
                      <button
                        type="submit"
                        className="shrink-0 rounded-lg bg-[#1E40AF] px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-900"
                      >
                        اعمال
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* جمع کل */}
              <div className="rounded-xl border border-[#D4C5A0] bg-white p-5">
                <div className="space-y-3 border-b border-[#EDE4CE] pb-4 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>جمع کالاها</span>
                    <span className="font-bold text-gray-800">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-700">
                      <span>تخفیف ({appliedCode?.code})</span>
                      <span className="font-bold">
                        − {formatPrice(discountAmount)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>هزینه ارسال</span>
                    <span
                      className={
                        shippingCost === 0
                          ? "font-bold text-green-600"
                          : "font-bold text-gray-800"
                      }
                    >
                      {shippingCost === 0 ? "رایگان" : formatPrice(shippingCost)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-base font-bold text-gray-800">
                    مبلغ قابل پرداخت
                  </span>
                  <span className="text-lg font-black text-gray-900">
                    {formatPrice(finalPrice)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleSubmitOrder}
                  disabled={submitting}
                  className="mt-5 w-full rounded-lg bg-green-700 py-3 text-base font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "در حال ثبت سفارش..." : "ثبت نهایی سفارش"}
                </button>

                <p className="mt-3 text-center text-xs text-gray-500">
                  با ثبت سفارش،{" "}
                  <a href="/rules" className="text-amber-600 hover:underline">
                    قوانین و مقررات
                  </a>{" "}
                  را می‌پذیرید.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}