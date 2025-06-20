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
};

module.exports = nextConfig; 