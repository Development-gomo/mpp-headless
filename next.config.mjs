/** @type {import('next').NextConfig} */

const wpBase = process.env.WP_BASE || process.env.NEXT_PUBLIC_WP_BASE;

const wpHostname = wpBase
  ? new URL(wpBase).hostname
  : "localhost";

const imageHostnames = Array.from(
  new Set([
    wpHostname,
    wpHostname.replace(/^www\./, ""),
    `www.${wpHostname.replace(/^www\./, "")}`,
    "gomowebb.com",
    "www.gomowebb.com",
  ])
);

const nextConfig = {
  reactStrictMode: true,

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
