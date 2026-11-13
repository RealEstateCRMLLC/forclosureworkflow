import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output enables clean tarball deploys to Hetzner (same as main CRM)
  output: 'standalone',
  // Mounted under /foreclosure/ on the production domain (nginx reverse
  // proxy). basePath makes Next emit prefix-correct asset URLs, Link/router
  // paths, and auth redirects; without it /_next assets and the /login
  // redirect resolve to the domain root (the main CRM) and 404.
  basePath: '/foreclosure',
  // Pin Turbopack root to this repo: without it Next walks up past the
  // submodule boundary and infers C:\Users\hyper (parent lockfile) as root.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
