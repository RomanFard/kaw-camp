"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-theme p-6 text-center">
      <h2 className="text-2xl font-black text-theme">
        😕 خطایی رخ داد
      </h2>
      <p className="max-w-md text-sm text-theme-muted">
        {error.message || "مشکلی پیش آمده"}
      </p>
      <button
        onClick={reset}
        className="rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white"
      >
        تلاش دوباره
      </button>
    </div>
  );
}