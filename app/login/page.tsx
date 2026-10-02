"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [otpMode, setOtpMode] = useState(false);

  return (
    <main className="min-h-screen bg-[#F7F1E3]">
      <Header />

      <div className="mx-auto max-w-[1600px] px-6 py-12">
        {/* مسیر ناوبری */}
        <nav className="mb-6 text-sm text-gray-500">
          <a href="/" className="hover:text-amber-600">خانه</a>
          <span className="mx-2">/</span>
          <span className="text-gray-800">ورود / ثبت‌نام</span>
        </nav>

        <div className="mx-auto max-w-md">
          {/* کارت اصلی */}
          <div className="rounded-2xl border border-[#D4C5A0] bg-white p-8 shadow-sm">
            {/* لوگو */}
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {mode === "login" ? "ورود به حساب" : "ایجاد حساب جدید"}
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                {mode === "login"
                  ? "به کو کمپ خوش آمدید"
                  : "به خانواده کو کمپ بپیوندید"}
              </p>
            </div>

            {/* تب‌ها */}
            <div className="mb-6 flex rounded-lg border border-[#D4C5A0] bg-[#F7F1E3]/50 p-1">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setOtpMode(false);
                }}
                className={
                  "flex-1 rounded-md py-2.5 text-sm font-bold transition " +
                  (mode === "login"
                    ? "bg-white text-amber-600 shadow-sm"
                    : "text-gray-600 hover:text-amber-600")
                }
              >
                ورود
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setOtpMode(false);
                }}
                className={
                  "flex-1 rounded-md py-2.5 text-sm font-bold transition " +
                  (mode === "register"
                    ? "bg-white text-amber-600 shadow-sm"
                    : "text-gray-600 hover:text-amber-600")
                }
              >
                ثبت‌نام
              </button>
            </div>

            {/* فرم */}
            <form className="space-y-4">
              {/* نام و نام خانوادگی - فقط در ثبت‌نام */}
              {mode === "register" && (
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    نام و نام خانوادگی
                  </label>
                  <input
                    type="text"
                    placeholder="مثلاً علی محمدی"
                    className="w-full rounded-lg border border-[#D4C5A0] bg-[#F7F1E3]/30 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
                  />
                </div>
              )}

              {/* شماره موبایل */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  شماره موبایل
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  placeholder="09123456789"
                  className="w-full rounded-lg border border-[#D4C5A0] bg-[#F7F1E3]/30 px-4 py-3 text-right text-sm outline-none transition focus:border-amber-500"
                />
              </div>

              {/* رمز عبور */}
              {!otpMode && (
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-700">
                      رمز عبور
                    </label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => setOtpMode(true)}
                        className="text-xs font-semibold text-amber-600 hover:underline"
                      >
                        ورود با کد یکبار مصرف
                      </button>
                    )}
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-[#D4C5A0] bg-[#F7F1E3]/30 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
                  />
                </div>
              )}

              {/* حالت OTP */}
              {otpMode && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm text-amber-700">
                    کد یکبار مصرف به شماره شما پیامک می‌شود
                  </p>
                  <button
                    type="button"
                    onClick={() => setOtpMode(false)}
                    className="mt-2 text-xs font-semibold text-amber-600 hover:underline"
                  >
                    بازگشت به ورود با رمز
                  </button>
                </div>
              )}

              {/* ثبت‌نام با موبایل - تیک قوانین */}
              {mode === "register" && (
                <label className="flex items-start gap-2 text-xs text-gray-600">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 accent-amber-500"
                  />
                  <span>
                    <a href="/rules" className="font-semibold text-amber-600 hover:underline">
                      قوانین و مقررات
                    </a>{" "}
                    کو کمپ را خوانده‌ام و می‌پذیرم
                  </span>
                </label>
              )}

              {/* دکمه اصلی */}
              <button
                type="submit"
                className="w-full rounded-lg bg-amber-500 py-3 text-base font-bold text-white transition hover:bg-amber-600"
              >
                {otpMode
                  ? "دریافت کد یکبار مصرف"
                  : mode === "login"
                  ? "ورود به حساب"
                  : "ایجاد حساب"}
              </button>
            </form>

            {/* جداکننده */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 border-t border-[#D4C5A0]"></div>
              <span className="text-xs text-gray-500">یا</span>
              <div className="flex-1 border-t border-[#D4C5A0]"></div>
            </div>

            {/* دکمه‌های شبکه اجتماعی */}
            <div className="space-y-2">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#D4C5A0] bg-white py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>ورود با گوگل</span>
              </button>
            </div>

            {/* تغییر حالت */}
            <p className="mt-6 text-center text-sm text-gray-600">
              {mode === "login" ? (
                <>
                  حساب کاربری ندارید؟{" "}
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="font-bold text-amber-600 hover:underline"
                  >
                    ثبت‌نام کنید
                  </button>
                </>
              ) : (
                <>
                  قبلاً ثبت‌نام کرده‌اید؟{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="font-bold text-amber-600 hover:underline"
                  >
                    وارد شوید
                  </button>
                </>
              )}
            </p>
          </div>

          {/* مزیت‌ها */}
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border border-[#D4C5A0] bg-white p-3">
              <span className="text-2xl">🎁</span>
              <p className="mt-2 text-xs font-semibold text-gray-700">
                تخفیف ویژه اعضا
              </p>
            </div>
            <div className="rounded-lg border border-[#D4C5A0] bg-white p-3">
              <span className="text-2xl">🚚</span>
              <p className="mt-2 text-xs font-semibold text-gray-700">
                ارسال سریع
              </p>
            </div>
            <div className="rounded-lg border border-[#D4C5A0] bg-white p-3">
              <span className="text-2xl">💬</span>
              <p className="mt-2 text-xs font-semibold text-gray-700">
                پشتیبانی ۲۴/۷
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}