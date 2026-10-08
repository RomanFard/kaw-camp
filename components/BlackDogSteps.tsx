"use client";

import { Anton, Lalezar, Vazirmatn } from "next/font/google";

const anton = Anton({ subsets: ["latin"], weight: "400", display: "swap" });
const lalezar = Lalezar({ subsets: ["arabic", "latin"], weight: "400", display: "swap" });
const vazir = Vazirmatn({ subsets: ["arabic", "latin"], weight: ["500", "700"], display: "swap" });

export type BlackDogStep = {
  num: string;
  image: string;
  alt: string;
};

export type BlackDogStepsData = {
  headingLine1: string;
  headingLine2: string;
  description: string;
  steps: BlackDogStep[];
};

export const DEFAULT_BLACK_DOG_STEPS: BlackDogStepsData = {
  headingLine1: "چقدر سریع",
  headingLine2: "برپاش می‌کنی؟",
  description:
    "از کوله تا کمپ در چند دقیقه\n— طراحی ساده و سریع ما یعنی بدون ابزار، بدون استرس، فقط وقت بیشتر برای لذت بردن از طبیعت.",
  steps: [
    { num: "01", image: "/images/categories/photos/tent.jpg", alt: "برپا کردن چادر" },
    { num: "02", image: "/images/categories/photos/cooking.jpg", alt: "آماده‌سازی کمپ" },
    { num: "03", image: "/images/categories/photos/sleep.jpg", alt: "لذت از طبیعت" },
  ],
};

type Props = {
  data?: BlackDogStepsData;
  editable?: boolean;
  onChange?: (data: BlackDogStepsData) => void;
  onImagePick?: (stepIndex: number) => void;
};

export default function BlackDogSteps({
  data = DEFAULT_BLACK_DOG_STEPS,
  editable = false,
  onChange,
  onImagePick,
}: Props) {
  const update = (patch: Partial<BlackDogStepsData>) => {
    if (editable && onChange) onChange({ ...data, ...patch });
  };

  const updateStep = (i: number, patch: Partial<BlackDogStep>) => {
    if (!editable || !onChange) return;
    onChange({
      ...data,
      steps: data.steps.map((s, idx) => (idx === i ? { ...s, ...patch } : s)),
    });
  };

  const editCls = editable
    ? "rounded-md outline-none transition focus:bg-white/10 focus:ring-2 focus:ring-dashed focus:ring-amber-400/60 dark:focus:bg-black/5"
    : "";

  return (
    <section
      dir="ltr"
      className="overflow-hidden bg-[#141414]/80 py-12 dark:bg-[#f8f3e8]/75 md:py-20"
    >
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <div className="mb-10 flex flex-col items-end gap-6 md:mb-14 md:flex-row-reverse md:items-start md:justify-between md:gap-12">
          <h2
            className={`${lalezar.className} text-[clamp(3.5rem,10vw,8.5rem)] leading-[1.05]`}
          >
            <span
              contentEditable={editable}
              suppressContentEditableWarning
              onBlur={(e) => update({ headingLine1: e.currentTarget.textContent ?? "" })}
              className={`block text-[#f8f3e8] dark:text-[#222222] ${editCls}`}
            >
              {data.headingLine1}
            </span>
            <span
              contentEditable={editable}
              suppressContentEditableWarning
              onBlur={(e) => update({ headingLine2: e.currentTarget.textContent ?? "" })}
              className={`block text-[#ffb36b] dark:text-[#5b0000] ${editCls}`}
            >
              {data.headingLine2}
            </span>
          </h2>

          <p
            dir="rtl"
            contentEditable={editable}
            suppressContentEditableWarning
            onBlur={(e) => update({ description: e.currentTarget.innerText ?? "" })}
            className={`${vazir.className} max-w-[19rem] whitespace-pre-line text-sm font-medium leading-7 text-[#f8f3e8]/80 dark:text-[#5b0000] md:mt-1 ${editCls}`}
          >
            {data.description}
          </p>
        </div>

        <div className="flex [direction:rtl] snap-x snap-mandatory gap-4 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:[direction:ltr] md:grid-cols-3 md:gap-6 md:overflow-visible md:py-0">
          {data.steps.map((step, i) => (
            <div
              key={i}
              className="group relative flex w-[72%] shrink-0 snap-start flex-col gap-3 hover:z-10 md:w-auto md:gap-4"
            >
              <div className="relative aspect-[9/10] overflow-hidden rounded-2xl bg-black/5 transition duration-500 ease-out group-hover:scale-110 group-hover:shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={step.image}
                  alt={step.alt}
                  loading="lazy"
                  draggable={false}
                  className="h-full w-full object-cover"
                />

                {editable && (
                  <button
                    type="button"
                    onClick={() => onImagePick?.(i)}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100"
                  >
                    <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur">
                      📷 تغییر تصویر
                    </span>
                  </button>
                )}
              </div>

              <span
                contentEditable={editable}
                suppressContentEditableWarning
                onBlur={(e) => updateStep(i, { num: e.currentTarget.textContent ?? "" })}
                className={`${anton.className} text-4xl leading-none text-[#f8f3e8] dark:text-[#1a1a1a] md:text-5xl ${editCls}`}
              >
                {step.num}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}