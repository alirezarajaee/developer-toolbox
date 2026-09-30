import type { NextConfig } from "next";

// GitHub Pages project sites are served from a repository subpath, e.g.
// https://<owner>.github.io/developer-toolbox/.
// Override with NEXT_PUBLIC_BASE_PATH if you rename the repository.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/developer-toolbox";

const nextConfig: NextConfig = {
  // Fully static export: no server runtime, no API routes, no middleware.
  output: "export",

  // Keep asset URLs working under the repository subpath on GitHub Pages.
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,

  images: {
    // No image optimization server exists in a static export.
    unoptimized: true,
  },
};

export default nextConfig;
