"use client";

import ImageUploader from "./ImageUploader";

type Props = {
  images: string[];
  onChange: (images: string[]) => void;
};

export default function GalleryManager({ images, onChange }: Props) {
  function updateImage(index: number, url: string) {
    const next = [...images];
    next[index] = url;
    onChange(next);
  }

  function addImage() {
    onChange([...images, ""]);
  }

  function removeImage(index: number) {
    const next = images.filter((_, i) => i !== index);
    onChange(next.length > 0 ? next : [""]);
  }

  const safeImages = images.length > 0 ? images : [""];

  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-theme-muted">
        گالری تصاویر
      </label>

      <p className="mb-3 text-[11px] text-theme-muted">
        می‌تونی چند عکس برای محصول آپلود کنی. اولین عکس به‌عنوان عکس اصلی در
        صفحه جزئیات نمایش داده میشه.
      </p>

      <div className="space-y-3">
        {safeImages.map((img, index) => (
          <div
            key={index}
            className="relative rounded-xl border border-theme bg-theme-surface/50 p-3"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-theme-muted">
                عکس #{index + 1}
                {index === 0 && (
                  <span className="mr-1 text-accent">(عکس اصلی)</span>
                )}
              </span>
              {safeImages.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-[11px] font-bold text-red-500 transition hover:bg-red-500/20"
                >
                  🗑️ حذف
                </button>
              )}
            </div>

            <ImageUploader
              value={img}
              onChange={(url) => updateImage(index, url)}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addImage}
        className="mt-3 w-full rounded-xl border-2 border-dashed border-theme bg-theme-card py-3 text-xs font-bold text-theme-muted transition hover:border-accent hover:bg-accent/10 hover:text-accent"
      >
        ➕ افزودن عکس جدید
      </button>
    </div>
  );
}