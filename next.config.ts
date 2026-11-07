import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // תמונות נשלחות כ-data URL עד שיחובר Supabase Storage
    serverActions: { bodySizeLimit: "6mb" },
  },
  /* config options here */
};

export default nextConfig;
