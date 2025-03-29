/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic configuration
  reactStrictMode: true,

  // Skip type checking during builds
  typescript: {
    ignoreBuildErrors: true,
  },

  // Skip ESLint checking during builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Use standalone mode instead of export as it's more compatible
  output: "standalone",

  // Disable image optimization to improve compatibility
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
