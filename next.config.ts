import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Permite rodar um build/serve de verificação sem brigar pelo `.next` com um
  // `next dev` já aberto: NEXT_DIST_DIR=.next-verify npm run build && npm start.
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
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
};

export default nextConfig;
