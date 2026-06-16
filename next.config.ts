import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 720p frame JPGs are served straight from /public — no extra config needed.
  reactStrictMode: true,
  // Pin the workspace root to this project (a stray lockfile in the home dir
  // otherwise makes Next infer the wrong root).
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
