/** @type {import('next').NextConfig} */

const wpBase = process.env.WP_BASE || process.env.NEXT_PUBLIC_WP_BASE;

const wpHostname = wpBase
  ? new URL(wpBase).hostname
  : "localhost";

const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: wpHostname, pathname: "/**" },
      { protocol: "https", hostname: `www.${wpHostname}`, pathname: "/**" },
      {
        protocol: "http",
        hostname: "gomowebb.com",
        pathname: "/headless-mpp/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "gomowebb.com",
        pathname: "/headless-mpp/wp-content/uploads/**",
      },
    ], 
  },
};

export default nextConfig;
