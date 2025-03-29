/** @type {import('next').NextConfig} */
const nextConfig = {
  // Bare minimum configuration
  reactStrictMode: true,

  // Skip type checking during builds
  typescript: {
    ignoreBuildErrors: true,
  },

  // Skip ESLint checking during builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Output static files as well
  output: "standalone",
};

export default nextConfig;
