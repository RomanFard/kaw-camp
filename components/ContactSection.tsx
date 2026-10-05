"use client";

import { useState } from "react";

export default function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", phone: "", email: "", service: "", message: "" });
    }, 3000);
  }

  const contactInfo = [
    {
      label: "آدرس",
      value: "کردستان، بانه — پاساژ ارغوانی، بلوک ۲",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
          />
        </svg>
      ),
      href: "https://maps.google.com/?q=Baneh,Kurdistan",
    },
    {
      label: "تلفن",
      value: "۰۹۱۸ ۰۵۴ ۰۰۱۹",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
          />
        </svg>
      ),
      href: "tel:09180540019",
    },
    {
      label: "ایمیل",
      value: "info@kawcamp.com",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
          />
        </svg>
      ),
      href: "mailto:info@kawcamp.com",
    },
  ];

  const services = [
    "مشاوره خرید تجهیزات",
    "رزرو تور آفرود",
    "رزرو تور کوهنوردی",
    "خدمات پس از فروش",
    "سایر موارد",
  ];

  return (
    <section className="relative py-12 md:py-16">
      {/* ═══ کادر هم‌عرض AboutSection و CategoryGrid ═══ */}
            <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-16">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E89070]/30 bg-[#E89070]/5 px-3.5 py-1.5 backdrop-blur-sm">
            <span className="text-[11px] font-bold tracking-[0.15em] text-[#E89070] md:text-xs">
              CONTACT
            </span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white md:text-3xl lg:text-4xl">
            درخواست <span className="text-[#E89070]">مشاوره</span>
          </h2>

          <div className="mx-auto mt-4 h-[3px] w-14 rounded-full bg-[#E89070]" />
        </div>

        <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 backdrop-blur-sm md:p-6">
            <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3237.8847837777436!2d45.88517831526225!3d35.998384980118556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDU5JzU0LjIiTiA0NcKwNTMnMTQuNSJF!5e0!3m2!1sen!2s!4v1234567890"
                width="100%"
                height="260"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale-[30%]"
                title="KAW CAMP Location"
              />
            </div>

            <div className="mt-5 space-y-4">
              {contactInfo.map((info, idx) => (
                <a
                  key={idx}
                  href={info.href}
                  target={info.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    info.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="group flex items-center gap-4"
                >
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[#E89070]/30 bg-[#E89070]/10 text-[#E89070] transition group-hover:border-[#E89070] group-hover:bg-[#E89070] group-hover:text-white">
                    {info.icon}
                  </span>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-zinc-500 md:text-xs">
                      {info.label}
                    </p>
                    <p className="mt-0.5 text-xs font-bold text-white transition group-hover:text-[#E89070] md:text-sm">
                      {info.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 backdrop-blur-sm md:p-6">
            <h3 className="mb-5 text-center text-base font-black text-white md:text-lg">
              فرم درخواست
            </h3>

            {submitted ? (
              <div className="flex h-full min-h-[360px] flex-col items-center justify-center gap-3 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-3xl">
                  ✅
                </div>
                <p className="text-base font-black text-white">
                  درخواست شما ثبت شد!
                </p>
                <p className="text-xs text-zinc-400">
                  به‌زودی با شما تماس می‌گیریم
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="نام و نام خانوادگی"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-[#E89070]"
                />

                <input
                  type="tel"
                  required
                  dir="ltr"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="شماره تماس"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2.5 text-right text-sm text-white outline-none transition placeholder:text-right placeholder:text-zinc-600 focus:border-[#E89070]"
                />

                <input
                  type="email"
                  dir="ltr"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="ایمیل (اختیاری)"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2.5 text-right text-sm text-white outline-none transition placeholder:text-right placeholder:text-zinc-600 focus:border-[#E89070]"
                />

                <select
                  required
                  value={form.service}
                  onChange={(e) =>
                    setForm({ ...form, service: e.target.value })
                  }
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2.5 text-sm text-white outline-none transition focus:border-[#E89070]"
                >
                  <option value="" className="bg-zinc-900">
                    انتخاب خدمت
                  </option>
                  {services.map((s) => (
                    <option key={s} value={s} className="bg-zinc-900">
                      {s}
                    </option>
                  ))}
                </select>

                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  placeholder="توضیحات..."
                  className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-[#E89070]"
                />

                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#E89070] py-3 text-sm font-black uppercase tracking-widest text-white transition hover:bg-[#D77E5E]"
                >
                  ارسال درخواست
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}