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

  // اگه خالی بود، یه خونه خالی پیشفرض
  const safeImages = images.length > 0 ? images : [""];

  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold text-gray-700">
        گالری تصاویر
      </label>

      <p className="mb-3 text-xs text-gray-500">
        می‌تونی چند عکس برای محصول آپلود کنی. اولین عکس به‌عنوان عکس اصلی در
        صفحه جزئیات نمایش داده میشه.
      </p>

      <div className="space-y-3">
        {safeImages.map((img, index) => (
          <div
            key={index}
            className="relative rounded-lg border border-[#EDE4CE] bg-[#F7F1E3]/30 p-3"
          >
            {/* شماره عکس */}
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500">
                عکس #{index + 1}
                {index === 0 && (
                  <span className="mr-1 text-amber-600">(عکس اصلی)</span>
                )}
              </span>
              {safeImages.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="rounded-lg border border-red-300 bg-red-50 px-2 py-1 text-[11px] font-bold text-red-700 transition hover:bg-red-100"
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
        className="mt-3 w-full rounded-lg border-2 border-dashed border-[#D4C5A0] bg-white py-3 text-sm font-bold text-gray-600 transition hover:border-amber-500 hover:bg-amber-50 hover:text-amber-700"
      >
        ➕ افزودن عکس جدید
      </button>
    </div>
  );
}