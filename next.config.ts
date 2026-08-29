import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.DOCKER ? "standalone" : undefined,
  cacheComponents: true,
};

export default nextConfig;
