import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // אתר סטטי לפריסה ב-GitHub Pages: אין שרת, כל הנתונים נקראים בדפדפן
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
