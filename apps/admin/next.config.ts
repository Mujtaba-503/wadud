import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@wadud/ui", "@wadud/types", "@wadud/mocks"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.dicebear.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "recharts"],
  },
};

export default nextConfig;
