/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use basePath in production (for GitHub Pages)
  ...(process.env.NODE_ENV === 'production' && {
    basePath: "/open-brewery",
  }),
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Ensure environment variables are properly handled
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
};

module.exports = nextConfig; 