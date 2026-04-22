import { env } from "@/libs/env";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  logging: {
    browserToTerminal: false,
  },

  async rewrites() {
    return [
      {
        source: "/api/serve/pfp/:path*",
        destination: `${env.BACKEND_API_URL}/api/serve/pfp/:path*`,
      },
    ];
  },
};

export default nextConfig;
