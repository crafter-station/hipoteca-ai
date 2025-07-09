import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@lmnr-ai/lmnr"],
  async redirects() {
    return [
      {
        source: "/",
        destination: "/checkr/new",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
