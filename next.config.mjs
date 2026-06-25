/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export so it can be hosted on 9pm.ai (no Node backend, no SSR, no
  // runtime API routes). Everything runs in the browser.
  output: 'export',
  // next/image optimization requires a server; disable it for static export.
  images: { unoptimized: true },
  // Emit each route as a directory with an index.html for clean static hosting.
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
