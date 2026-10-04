"use client";

import { useToast, type Toast, type ToastType } from "./context/ToastContext";

const TOAST_STYLES: Record<
  ToastType,
  { bg: string; border: string; icon: string; text: string }
> = {
  success: {
    bg: "bg-green-50",
    border: "border-green-300",
    icon: "✅",
    text: "text-green-800",
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-300",
    icon: "❌",
    text: "text-red-800",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-300",
    icon: "ℹ️",
    text: "text-blue-800",
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-300",
    icon: "⚠️",
    text: "text-amber-800",
  },
};

export default function ToastContainer() {
  const { toasts, dismiss } = useToast();

  return (
    <div
      dir="rtl"
      className="pointer-events-none fixed left-1/2 top-4 z-[9999] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  const style = TOAST_STYLES[toast.type];

  return (
    <div
      className={`pointer-events-auto animate-[slideDown_0.3s_ease-out] rounded-xl border ${style.border} ${style.bg} p-4 shadow-lg backdrop-blur-sm`}
      style={{
        animation: "slideDown 0.3s ease-out",
      }}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl">{style.icon}</span>
        <p className={`flex-1 text-sm font-bold ${style.text}`}>
          {toast.message}
        </p>
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          aria-label="بستن"
          className={`flex h-6 w-6 items-center justify-center rounded-full text-sm ${style.text} opacity-60 transition hover:bg-white hover:opacity-100`}
        >
          ✕
        </button>
      </div>
    </div>
  );
}