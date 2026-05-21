import { getWPBaseUrl } from "@/config";

const DEFAULT_TIMEOUT_MS = 15000;

function timeoutSignal(timeoutMs) {
  if (
    typeof AbortSignal !== "undefined" &&
    typeof AbortSignal.timeout === "function"
  ) {
    return AbortSignal.timeout(timeoutMs);
  }

  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller.signal;
}

// Generic fetch helper with ISR revalidation.
export async function fetchWP(
  endpoint,
  { revalidate = 10, timeoutMs = DEFAULT_TIMEOUT_MS } = {}
) {
  try {
    const wpBaseUrl = getWPBaseUrl();
    const url = `${wpBaseUrl}/wp-json${
      endpoint.startsWith("/") ? "" : "/"
    }${endpoint}`;

    const res = await fetch(url, {
      next: { revalidate },
      signal: timeoutSignal(timeoutMs),
    });

    if (!res.ok) {
      console.log("WP fetch failed:", res.status, url);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.log("WP fetch error:", error);
    return null;
  }
}

// Helper to safely add query params
function withParams(endpoint, params = {}) {
  const [path, queryString = ""] = endpoint.split("?");
  const searchParams = new URLSearchParams(queryString);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, value);
    }
  });

  const finalQuery = searchParams.toString();
  return finalQuery ? `${path}?${finalQuery}` : path;
}

// ─── Generic helpers ────────────────────────────────────────────────────────

async function getSingleEntry(endpoint, slug) {
  if (!slug) return null;

  try {
    const entries = await fetchWP(
      withParams(`/wp/v2/${endpoint}`, {
        slug: encodeURIComponent(slug),
        _embed: "1",
        acf_format: "standard",
      })
    );

    if (!Array.isArray(entries) || entries.length === 0) return null;

    return entries.find((e) => e.slug === slug) || entries[0];
  } catch {
    return null;
  }
}

async function getEntryById(endpoint, id) {
  if (!id) return null;

  try {
    return await fetchWP(
      withParams(`/wp/v2/${endpoint}/${id}`, {
        _embed: "1",
        acf_format: "standard",
      })
    );
  } catch {
    return null;
  }
}

// ─── Pages ──────────────────────────────────────────────────────────────────

export async function getPageBySlug(slug) {
  return getSingleEntry("pages", slug);
}

export async function getPageById(id) {
  return getEntryById("pages", id);
}

export async function getAllPages() {
  return fetchWP(
    withParams(`/wp/v2/pages`, {
      per_page: 100,
      _embed: "1",
      acf_format: "standard",
    })
  );
}

// ─── Posts ──────────────────────────────────────────────────────────────────

export async function getPostBySlug(slug) {
  return getSingleEntry("posts", slug);
}

export async function getAllPosts() {
  return fetchWP(
    withParams(`/wp/v2/posts`, {
      per_page: 100,
      _embed: "1",
      acf_format: "standard",
    })
  );
}

// ─── Case studies ───────────────────────────────────────────────────────────

export async function getCaseStudyBySlug(slug) {
  return getSingleEntry("case-study", slug);
}

export async function getCaseStudies() {
  const data = await fetchWP(
    withParams(`/wp/v2/case-study`, {
      per_page: 100,
      _embed: "1",
      acf_format: "standard",
    })
  );

  return Array.isArray(data) ? data : [];
}

// ─── Media ──────────────────────────────────────────────────────────────────

export async function getMediaById(id) {
  if (!id) return null;

  return fetchWP(`/wp/v2/media/${id}`);
}

// ─── Menu ───────────────────────────────────────────────────────────────────

export async function getMenu(location = "primary") {
  try {
    const data = await fetchWP(`/headless/v1/menu/${location}`);
    return Array.isArray(data?.items) ? data.items : [];
  } catch {
    return [];
  }
}

// ─── Theme options ──────────────────────────────────────────────────────────

export async function getThemeOptions() {
  const endpoints = [
    `/headless/v1/theme-options`,
    `/wp/v2/acf/options?acf_format=standard`,
    `/acf/v3/options/options`,
  ];

  for (const endpoint of endpoints) {
    try {
      const data = await fetchWP(endpoint);
      if (data && !data.code) return data;
    } catch {}
  }

  return {};
}

// ─── Product categories ─────────────────────────────────────────────────────

export async function getProductCategoriesWithImages() {
  const data = await fetchWP(`/headless/v1/product-categories`);

  return Array.isArray(data) ? data : [];
}

function normalizeProductCategory(category) {
  if (!category || typeof category !== "object") return null;

  return {
    ...category,
    term_id: category.term_id || category.id,
  };
}

function mergeProductCategories(primary = [], fallback = []) {
  const merged = new Map();

  [...fallback, ...primary].forEach((category) => {
    const normalized = normalizeProductCategory(category);
    const key = normalized?.term_id || normalized?.slug;

    if (key) {
      const existing = merged.get(String(key)) || {};
      const existingParent = Number(existing.parent || existing.parent_id || 0);
      const nextParent = Number(normalized.parent || normalized.parent_id || 0);

      merged.set(String(key), {
        ...existing,
        ...normalized,
        parent: nextParent || existingParent,
      });
    }
  });

  return Array.from(merged.values());
}

export async function getProductCategories() {
  const [headlessCategories, taxonomyCategories] = await Promise.all([
    fetchWP(`/headless/v1/product-categories`),
    fetchWP(
      withParams(`/wp/v2/product_cat`, {
        per_page: 100,
        hide_empty: false,
        acf_format: "standard",
      })
    ),
  ]);

  return mergeProductCategories(
    Array.isArray(headlessCategories) ? headlessCategories : [],
    Array.isArray(taxonomyCategories) ? taxonomyCategories : []
  );
}

export async function getProductCategoryBySlug(slug) {
  const categories = await getProductCategories();

  return categories.find((cat) => cat.slug === slug) || null;
}

// ─── Products ───────────────────────────────────────────────────────────────

export async function getProductsByCategory(categoryId) {
  if (!categoryId) return [];

  const data = await fetchWP(
    withParams(`/wp/v2/product`, {
      product_cat: categoryId,
      per_page: 100,
      _embed: "1",
      acf_format: "standard",
    })
  );

  return Array.isArray(data) ? data : [];
}

export async function getProductBySlug(slug) {
  return getSingleEntry("product", slug);
}

export async function getAllProducts() {
  const data = await fetchWP(
    withParams(`/wp/v2/product`, {
      per_page: 100,
      _embed: "1",
      acf_format: "standard",
    })
  );

  return Array.isArray(data) ? data : [];
}

// ─── Latest posts ───────────────────────────────────────────────────────────

export async function getLatestPosts() {
  const data = await fetchWP(
    withParams(`/wp/v2/posts`, {
      per_page: 3,
      _embed: "1",
      acf_format: "standard",
    })
  );

  return Array.isArray(data) ? data : [];
}

// ─── Latest case studies ────────────────────────────────────────────────────

export async function getLatestCaseStudies() {
  const data = await fetchWP(
    withParams(`/wp/v2/case-study`, {
      per_page: 2,
      _embed: "1",
      acf_format: "standard",
    })
  );

  return Array.isArray(data) ? data : [];
}
