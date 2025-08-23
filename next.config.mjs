/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: false, // Disable Turbopack to fix font error
  },
};

export default nextConfig;
