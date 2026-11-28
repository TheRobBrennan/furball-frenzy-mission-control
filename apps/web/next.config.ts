import type { NextConfig } from "next";

// Where the browser's /api/* calls are forwarded. In Docker Compose this is the
// api service, natively it is the FastAPI dev server on localhost.
const apiUrl = process.env.API_URL ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Next serves public/storybook/index.html only by its full name, so send /storybook (and /storybook/,
  // which Next first trims to /storybook) there. A redirect, not a rewrite: Storybook's relative asset
  // paths need the URL to end in /storybook/.
  async redirects() {
    return [
      { source: "/storybook", destination: "/storybook/index.html", permanent: false },
      // The short address always leads to the newest parade, so it is not permanent.
      { source: "/parade", destination: "/parade/thanksgiving-2026", permanent: false },
    ];
  },
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${apiUrl}/:path*` }];
  },
};

export default nextConfig;
