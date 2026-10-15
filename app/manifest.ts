import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "کاو کمپ | فروشگاه تخصصی لوازم کمپینگ و کوهنوردی",
    short_name: "KAW CAMP",
    description: "فروشگاه تخصصی لوازم کمپینگ و کوهنوردی",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#E84C4C",
    orientation: "portrait",
    lang: "fa",
    dir: "rtl",
    icons: [
      {
        src: "/images/logo2.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/images/logo2.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/images/logo2.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/images/logo2.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}