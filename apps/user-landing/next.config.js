/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@gym/ui", "@gym/config"],
  images: {
    domains: [],
  },
};

module.exports = nextConfig;
