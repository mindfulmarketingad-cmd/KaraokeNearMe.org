/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produce a fully static site (HTML/CSS/JS) that can be hosted anywhere.
  output: "export",
  // Static export cannot use the on-demand Image Optimization API.
  images: {
    unoptimized: true,
  },
  // Emit clean directory-style URLs (e.g. /about/ -> /about/index.html).
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
