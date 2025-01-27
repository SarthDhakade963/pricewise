/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["mongoose"],
  images: {
    domains : ['m.media-amazon.com']
  }
};

module.exports = nextConfig;
