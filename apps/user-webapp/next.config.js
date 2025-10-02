/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@gym/ui", "@gym/database", "@gym/auth", "@gym/config"],
  images: {
    domains: [],
  },
};

module.exports = nextConfig;
