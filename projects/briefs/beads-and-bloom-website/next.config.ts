import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Provide fallback env vars for build time when .env.local is not available
  // This prevents Cloudinary and other services from failing static generation
  env: {
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "placeholder",
  },
};

export default nextConfig;
