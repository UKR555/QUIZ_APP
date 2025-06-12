/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['*'],
  },
  // Disable SWC since it's causing issues
  swcMinify: false,
};

module.exports = nextConfig; 