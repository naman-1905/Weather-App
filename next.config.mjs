/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: false, // Disable Turbopack to fix font error
  },
  output: "standalone", // ✅ This is what makes .next/standalone appear
};

export default nextConfig;
