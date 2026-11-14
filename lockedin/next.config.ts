import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/commitments", destination: "/plans", permanent: false },
      {
        source: "/commitments/:goalId",
        destination: "/plans/:goalId",
        permanent: false,
      },
      { source: "/goals", destination: "/plans", permanent: false },
      {
        source: "/goals/:goalId",
        destination: "/plans/:goalId",
        permanent: false,
      },
      { source: "/work-items", destination: "/calendar", permanent: false },
      { source: "/focus-items", destination: "/calendar", permanent: false },
      {
        source: "/categories",
        destination: "/settings#categories",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
