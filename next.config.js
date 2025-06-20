/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/open-brewery",
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig; 