/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname, // این خط ریشه پروژه را به Turbopack معرفی می‌کند
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;