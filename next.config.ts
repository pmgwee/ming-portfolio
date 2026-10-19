import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 720p frame JPGs are served straight from /public — no extra config needed.
  reactStrictMode: true,
  // Pin the workspace root to this project (a stray lockfile in the home dir
  // otherwise makes Next infer the wrong root).
  turbopack: {
    root: process.cwd(),
  },
  // The 10年倒推表 tool is a self-contained static page in /public; serve it at
  // a clean product URL.
  async rewrites() {
    return [{ source: "/product/career-plan", destination: "/product/career-plan/index.html" }];
  },
};

export default nextConfig;
