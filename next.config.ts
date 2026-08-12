import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: isGithubPages ? "/oly-drugstore-online-store" : "",
  assetPrefix: isGithubPages ? "/oly-drugstore-online-store/" : "",
};

export default nextConfig;
