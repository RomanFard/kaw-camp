"use client";

import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/context/ToastContext";

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
};

type Area = {
  x: number;
  y: number;
  width: number;
  height: number;
};

// ─── بارگذاری عکس ───
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// ─── محاسبه ابعاد بعد از چرخش ───
function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = (rotation * Math.PI) / 180;
  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

// ─── برش و ساخت Blob ───
async function getCroppedBlob(
  imageSrc: string,
  pixelCrop: Area,
  rotation: number
): Promise<Blob> {
  const image = await loadImage(imageSrc);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  const rotRad = (rotation * Math.PI) / 180;
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");
  if (!croppedCtx) throw new Error("Canvas not supported");

  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to create blob"));
      },
      "image/jpeg",
      0.9
    );
  });
}

export default function ImageUploader({ value, onChange, label }: Props) {
  const supabase = createClient();
  const toast = useToast();

  const [srcImage, setSrcImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const onCropComplete = useCallback((_: unknown, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("فقط فایل تصویری مجاز است");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم فایل باید کمتر از ۵ مگابایت باشد");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSrcImage(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
      setModalOpen(true);
    };
    reader.readAsDataURL(file);

    // پاک کردن input
    e.target.value = "";
  }

  async function handleCropSave() {
    if (!srcImage || !croppedAreaPixels) return;

    setUploading(true);
    try {
      const blob = await getCroppedBlob(srcImage, croppedAreaPixels, rotation);

      const fileName = `product-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.jpg`;

      const { error } = await supabase.storage
        .from("products")
        .upload(fileName, blob, {
          contentType: "image/jpeg",
          upsert: false,
        });

      if (error) throw error;

      const { data } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      onChange(data.publicUrl);
      toast.success("عکس با موفقیت آپلود شد");
      setModalOpen(false);
      setSrcImage(null);
    } catch (err) {
      console.error(err);
      toast.error("خطا در آپلود عکس");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-sm font-bold text-gray-700">
          {label}
        </label>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          dir="ltr"
          placeholder="/images/... یا https://..."
          className="min-w-0 flex-1 rounded-lg border border-[#D4C5A0] px-4 py-2.5 font-mono text-left text-xs outline-none focus:border-amber-500"
        />
        <label className="shrink-0 cursor-pointer rounded-lg bg-[#1E40AF] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-900">
          📤 آپلود
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      </div>

      {value && (
        <div className="mt-2 h-24 w-24 overflow-hidden rounded-lg border border-[#EDE4CE] bg-gray-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="preview"
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* ─── Modal کراپ ─── */}
      {modalOpen && srcImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-5">
            <h3 className="mb-3 text-lg font-black text-gray-900">
              ✂️ ویرایش و آپلود عکس
            </h3>

            {/* ناحیه کراپ */}
            <div className="relative h-80 w-full overflow-hidden rounded-xl bg-black">
              <Cropper
                image={srcImage}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
              />
            </div>

            {/* کنترل‌ها */}
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-600">
                  بزرگ‌نمایی ({zoom.toFixed(1)}x)
                </label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-gray-600">
                  چرخش ({rotation}°)
                </label>
                <input
                  type="range"
                  min={0}
                  max={360}
                  step={1}
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="rounded-lg border border-[#D4C5A0] bg-white px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  ↻ چرخش ۹۰°
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r - 90 + 360) % 360)}
                  className="rounded-lg border border-[#D4C5A0] bg-white px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  ↺ چرخش -۹۰°
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setZoom(1);
                    setRotation(0);
                    setCrop({ x: 0, y: 0 });
                  }}
                  className="rounded-lg border border-[#D4C5A0] bg-white px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  🔄 بازنشانی
                </button>
              </div>
            </div>

            {/* دکمه‌ها */}
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={handleCropSave}
                disabled={uploading}
                className="flex-1 rounded-lg bg-[#FF6B4A] py-2.5 text-sm font-bold text-white transition hover:bg-[#E55A3A] disabled:opacity-50"
              >
                {uploading ? "در حال آپلود..." : "✅ تأیید و آپلود"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setModalOpen(false);
                  setSrcImage(null);
                }}
                disabled={uploading}
                className="rounded-lg border border-[#D4C5A0] px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}