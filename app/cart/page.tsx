"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/components/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/components/context/ToastContext";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    appliedCode,
    discountAmount,
    totalAfterDiscount,
    applyCode,
    removeCode,
  } = useCart();

  const toast = useToast();

  const [codeInput, setCodeInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const shipping = totalPrice > 2_000_000 || totalPrice === 0 ? 0 : 80_000;
  const grandTotal = totalAfterDiscount + shipping;

  const codeInvalid =
    appliedCode !== null &&
    discountAmount === 0 &&
    appliedCode.minPurchase !== undefined &&
    totalPrice < appliedCode.minPurchase;

  async function handleApplyCode(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

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
    setErrorMsg("");
    setSuccessMsg("");
  }

  function handleClearCart() {
    if (!confirm("آیا از پاک کردن کل سبد خرید مطمئنی؟")) return;
    clearCart();
    toast.info("سبد خرید پاک شد");
  }

  function handleRemoveItem(id: string, name: string) {
    removeItem(id);
    toast.info(`«${name}» از سبد حذف شد`);
  }

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
          <span className="text-theme">سبد خرید</span>
        </nav>

        <h1 className="mb-6 text-2xl font-bold text-theme">
          سبد خرید
          {totalItems > 0 && (
            <span className="mr-3 text-base font-normal text-theme-muted">
              ({totalItems} کالا)
            </span>
          )}
        </h1>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-theme bg-theme-card p-12 text-center">
            <p className="text-6xl">🛒</p>
            <p className="mt-4 text-lg font-bold text-theme">
              سبد خرید شما خالی است
            </p>
            <p className="mt-2 text-sm text-theme-muted">
              برای شروع خرید، محصولات ما را مرور کنید.
            </p>
            <a
              href="/products"
              className="mt-6 inline-block rounded-lg bg-accent px-6 py-3 text-base font-bold text-white transition hover:bg-accent-hover"
            >
              مشاهده محصولات
            </a>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            {/* لیست آیتم‌ها */}
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-xl border border-theme bg-theme-card p-4"
                >
                  <a
                    href={"/product/" + item.id}
                    className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-theme-surface"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </a>

                  <div className="flex flex-1 flex-col">
                    <a
                      href={"/product/" + item.id}
                      className="text-sm font-bold text-theme transition hover:text-accent md:text-base"
                    >
                      {item.name}
                    </a>

                    <div className="mt-2 text-sm text-theme-muted">
                      قیمت واحد: {formatPrice(item.price)}
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-lg border border-theme px-2 py-1">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded text-lg font-bold text-theme-muted transition hover:bg-theme-surface"
                        >
                          −
                        </button>
                        <span className="min-w-[28px] text-center text-sm font-bold text-theme">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded text-lg font-bold text-theme-muted transition hover:bg-theme-surface"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-sm font-bold text-theme md:text-base">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id, item.name)}
                          aria-label="حذف"
                          className="text-theme-muted transition hover:text-red-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-5 w-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleClearCart}
                className="mt-3 text-sm text-red-500 hover:underline"
              >
                پاک کردن کل سبد
              </button>
            </div>

            {/* سایدبار — خلاصه سفارش */}
            <aside className="sticky top-4 h-fit rounded-xl border border-theme bg-theme-card p-6">
              <h2 className="mb-4 text-lg font-bold text-theme">
                خلاصه سفارش
              </h2>

              {/* کد تخفیف */}
              <div className="mb-4 border-b border-theme pb-4">
                {appliedCode ? (
                  <div
                    className={`rounded-lg border p-3 ${
                      codeInvalid
                        ? "border-accent/40 bg-accent/5"
                        : "border-green-500/40 bg-green-500/10"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🎟️</span>
                          <span
                            className={`font-bold ${
                              codeInvalid ? "text-accent" : "text-green-500"
                            }`}
                          >
                            {appliedCode.code}
                          </span>
                        </div>
                        <p
                          className={`mt-1 text-xs ${
                            codeInvalid ? "text-accent" : "text-green-500"
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
                        className="flex h-6 w-6 items-center justify-center rounded-full text-theme-muted transition hover:bg-theme-surface hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCode}>
                    <label className="mb-2 block text-xs font-bold text-theme-muted">
                      کد تخفیف دارید؟
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={codeInput}
                        onChange={(e) => {
                          setCodeInput(e.target.value);
                          setErrorMsg("");
                          setSuccessMsg("");
                        }}
                        placeholder="مثلاً KAW10"
                        className="min-w-0 flex-1 rounded-lg border border-theme bg-theme-surface px-3 py-2 text-sm outline-none transition focus:border-accent"
                        dir="ltr"
                      />
                      <button
                        type="submit"
                        className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white transition hover:bg-accent-hover"
                      >
                        اعمال
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* خلاصه */}
              <div className="space-y-3 border-b border-theme pb-4 text-sm">
                <div className="flex items-center justify-between text-theme-muted">
                  <span>جمع کالاها</span>
                  <span className="font-bold text-theme">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-green-500">
                    <span>تخفیف ({appliedCode?.code})</span>
                    <span className="font-bold">
                      − {formatPrice(discountAmount)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-theme-muted">
                  <span>هزینه ارسال</span>
                  <span
                    className={
                      shipping === 0
                        ? "font-bold text-green-500"
                        : "font-bold text-theme"
                    }
                  >
                    {shipping === 0 ? "رایگان" : formatPrice(shipping)}
                  </span>
                </div>

                {shipping > 0 && (
                  <div className="rounded-lg border border-accent/30 bg-accent/5 p-2.5 text-xs text-accent">
                    🎁 با {formatPrice(2_000_000 - totalPrice)} خرید بیشتر، ارسال
                    رایگان می‌شود
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-base font-bold text-theme">
                  مبلغ قابل پرداخت
                </span>
                <span className="text-lg font-black text-accent">
                  {formatPrice(grandTotal)}
                </span>
              </div>

              <a
                href="/checkout"
                className="mt-5 block w-full rounded-lg bg-accent py-3 text-center text-base font-bold text-white transition hover:bg-accent-hover"
              >
                ادامه فرآیند خرید
              </a>

              <a
                href="/products"
                className="mt-3 block w-full rounded-lg border-2 border-accent bg-transparent py-3 text-center text-sm font-bold text-accent transition hover:bg-accent/10"
              >
                ← ادامه خرید
              </a>
            </aside>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}