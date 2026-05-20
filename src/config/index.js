// src/config/index.js
export const WP_BASE =
  process.env.WP_BASE || process.env.NEXT_PUBLIC_WP_BASE || "";

export function getWPBaseUrl() {
  if (!WP_BASE) {
    throw new Error(
      "Missing WordPress base URL. Set WP_BASE or NEXT_PUBLIC_WP_BASE in the deployment environment."
    );
  }

  try {
    const url = new URL(WP_BASE);
    return url.origin + url.pathname.replace(/\/$/, "");
  } catch {
    throw new Error(
      `Invalid WordPress base URL "${WP_BASE}". It must be an absolute URL, for example https://example.com.`
    );
  }
}
