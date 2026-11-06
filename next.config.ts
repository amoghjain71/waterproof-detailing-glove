import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disabled: Cache Components were in scope for 2026 Next.js RCE advisories.
  // Re-enable only if the site needs them and Next is at or above the patched floor.
  cacheComponents: false,
  partialPrefetching: false,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [64, 96, 128, 256, 384],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
