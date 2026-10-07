/** @type {import('next').NextConfig} */

const wpBase = process.env.WP_BASE || process.env.NEXT_PUBLIC_WP_BASE;

const wpHostname = wpBase
  ? new URL(wpBase).hostname
  : "localhost";

// Optional extra image hosts (comma-separated), e.g. a legacy media domain.
const extraImageHostnames = (process.env.IMAGE_EXTRA_HOSTNAMES || "")
  .split(",")
  .map((h) => h.trim())
  .filter(Boolean);

const imageHostnames = Array.from(
  new Set([
    wpHostname,
    wpHostname.replace(/^www\./, ""),
    `www.${wpHostname.replace(/^www\./, "")}`,
    ...extraImageHostnames,
  ])
);

const nextConfig = {
  reactStrictMode: true,
  distDir: process.env.NEXT_DIST_DIR || ".next",

  // The WordPress backend can't absorb 30+ parallel build workers
  // (503/timeouts). Keep static generation gentle and give pages longer.
  staticPageGenerationTimeout: 180,
  experimental: {
    cpus: 3,
    staticGenerationMaxConcurrency: 4,
    staticGenerationRetryCount: 3,
  },

  images: {
    remotePatterns: [
      ...imageHostnames.flatMap((hostname) => [
        { protocol: "https", hostname, pathname: "/**" },
        { protocol: "http", hostname, pathname: "/**" },
      ]),
    ], 
  },
};

export default nextConfig;
