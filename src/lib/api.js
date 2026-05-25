import { cache } from "react";
import { getWPBaseUrl } from "@/config";
import {
  DEFAULT_LANGUAGE,
  FALLBACK_LANGUAGES,
  localizePath,
} from "@/lib/i18n";

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
  {
    revalidate = 10,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    language,
    logErrors = true,
  } = {}
) {
  try {
    const wpBaseUrl = getWPBaseUrl();
    const localizedEndpoint = withLanguage(endpoint, language);
    const url = `${wpBaseUrl}/wp-json${
      localizedEndpoint.startsWith("/") ? "" : "/"
    }${localizedEndpoint}`;

    const res = await fetch(url, {
      next: { revalidate },
      signal: timeoutSignal(timeoutMs),
    });

    if (!res.ok) {
      if (logErrors) console.log("WP fetch failed:", res.status, url);
      return null;
    }

    return await res.json();
  } catch (error) {
    if (logErrors) console.log("WP fetch error:", error);
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

function withLanguage(endpoint, language) {
  if (!language || language === DEFAULT_LANGUAGE) return endpoint;

  return withParams(endpoint, { lang: language });
}

function normalizeWpmlLanguage(language) {
  if (!language || typeof language !== "object") return null;

  const code =
    language.code ||
    language.language_code ||
    language.slug ||
    language.locale?.split("_")?.[0];

  if (!code) return null;

  return {
    code,
    name: language.name || language.english_name || code.toUpperCase(),
    native_name:
      language.native_name ||
      language.translated_name ||
      language.display_name ||
      language.name ||
      code.toUpperCase(),
  };
}

function normalizeWpmlLanguages(data) {
  const rawLanguages = Array.isArray(data)
    ? data
    : Array.isArray(data?.languages)
    ? data.languages
    : data && typeof data === "object"
    ? Object.values(data)
    : [];

  return rawLanguages.map(normalizeWpmlLanguage).filter(Boolean);
}

export const getWpmlLanguages = cache(async function getWpmlLanguages() {
  const endpoints = [
    "/wpml/v1/languages",
    "/wpml/v1/active-languages",
    "/headless/v1/languages",
    "/headless/v1/wpml/languages",
  ];

  for (const endpoint of endpoints) {
    const data = await fetchWP(endpoint, { revalidate: 60, logErrors: false });
    const languages = normalizeWpmlLanguages(data);

    if (languages.length > 0) return languages;
  }

  return FALLBACK_LANGUAGES;
});

function getContentEndpoint(type) {
  const endpoints = {
    page: "pages",
    post: "posts",
    product: "product",
    "case-study": "case-study",
    product_cat: "product_cat",
    "product-category": "product_cat",
  };

  return endpoints[type] || null;
}

function normalizeWordPressPath(url = "#", language = DEFAULT_LANGUAGE) {
  if (!url || url === "#") return localizePath("/", language);

  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname
      .replace(/^\/headless-mpp/, "")
      .replace(/^\/produkt-kategori(?=\/|$)/, "/product-category")
      .replace(/^\/produkt(?=\/|$)/, "/product")
      .replace(/\/$/, "");

    return localizePath(`${pathname || "/"}${parsed.search}${parsed.hash}`, language);
  } catch {
    return localizePath(url, language);
  }
}

async function getTranslatedContent(type, id, slug, language) {
  const endpoint = getContentEndpoint(type);
  if (!endpoint) return null;

  const baseParams = {
    _fields: "id,slug,link",
    per_page: 1,
  };

  const candidates = [
    id && {
      endpoint: withParams(`/wp/v2/${endpoint}`, {
        ...baseParams,
        include: id,
      }),
      options: { language, logErrors: false },
    },
    id && {
      endpoint: withParams(`/wp/v2/${endpoint}`, {
        ...baseParams,
        include: id,
        wpml_language: language,
      }),
      options: { logErrors: false },
    },
    slug && {
      endpoint: withParams(`/wp/v2/${endpoint}`, {
        ...baseParams,
        slug,
      }),
      options: { language, logErrors: false },
    },
    slug && {
      endpoint: withParams(`/wp/v2/${endpoint}`, {
        ...baseParams,
        slug,
        wpml_language: language,
      }),
      options: { logErrors: false },
    },
  ].filter(Boolean);

  for (const candidate of candidates) {
    const data = await fetchWP(candidate.endpoint, candidate.options);
    const item = Array.isArray(data) ? data[0] : null;

    if (!item) continue;
    if (id && String(item.id) === String(id)) continue;

    return item;
  }

  return null;
}

export const getLanguageLinks = cache(async function getLanguageLinks(
  context = {},
  languages = FALLBACK_LANGUAGES
) {
  const languageCodes = (Array.isArray(languages) && languages.length > 0
    ? languages
    : FALLBACK_LANGUAGES
  )
    .map((item) => item?.code)
    .filter(Boolean);

  const links = {};
  const currentPath = context?.path || localizePath("/", context?.language);

  await Promise.all(
    languageCodes.map(async (targetLanguage) => {
      if (targetLanguage === context?.language) {
        links[targetLanguage] = currentPath;
        return;
      }

      const translated = await getTranslatedContent(
        context?.type,
        context?.id,
        context?.slug,
        targetLanguage
      );

      if (translated?.link) {
        links[targetLanguage] = normalizeWordPressPath(
          translated.link,
          targetLanguage
        );
      }
    })
  );

  return links;
});

// ─── Generic helpers ────────────────────────────────────────────────────────

async function getSingleEntry(endpoint, slug, { language } = {}) {
  if (!slug) return null;

  try {
    const entries = await fetchWP(
      withParams(`/wp/v2/${endpoint}`, {
        slug: encodeURIComponent(slug),
        _embed: "1",
        acf_format: "standard",
      }),
      { language }
    );

    if (!Array.isArray(entries) || entries.length === 0) return null;

    return entries.find((e) => e.slug === slug) || entries[0];
  } catch {
    return null;
  }
}

async function getEntryById(endpoint, id, { language } = {}) {
  if (!id) return null;

  try {
    return await fetchWP(
      withParams(`/wp/v2/${endpoint}/${id}`, {
        _embed: "1",
        acf_format: "standard",
      }),
      { language }
    );
  } catch {
    return null;
  }
}

// ─── Pages ──────────────────────────────────────────────────────────────────

export async function getPageBySlug(slug, { language } = {}) {
  return getSingleEntry("pages", slug, { language });
}

export async function getPageById(id, { language } = {}) {
  return getEntryById("pages", id, { language });
}

export async function getAllPages({ language } = {}) {
  return fetchWP(
    withParams(`/wp/v2/pages`, {
      per_page: 100,
      _embed: "1",
      acf_format: "standard",
    }),
    { language }
  );
}

// ─── Posts ──────────────────────────────────────────────────────────────────

export async function getPostBySlug(slug, { language } = {}) {
  return getSingleEntry("posts", slug, { language });
}

export async function getAllPosts({ language } = {}) {
  return fetchWP(
    withParams(`/wp/v2/posts`, {
      per_page: 100,
      _embed: "1",
      acf_format: "standard",
    }),
    { language }
  );
}

// ─── Case studies ───────────────────────────────────────────────────────────

export async function getCaseStudyBySlug(slug, { language } = {}) {
  return getSingleEntry("case-study", slug, { language });
}

export async function getCaseStudies({ language } = {}) {
  const data = await fetchWP(
    withParams(`/wp/v2/case-study`, {
      per_page: 100,
      _embed: "1",
      acf_format: "standard",
    }),
    { language }
  );

  return Array.isArray(data) ? data : [];
}

// ─── Media ──────────────────────────────────────────────────────────────────

export async function getMediaById(id) {
  if (!id) return null;

  return fetchWP(`/wp/v2/media/${id}`);
}

async function getMediaByParent(parentId, { language } = {}) {
  if (!parentId) return [];

  const media = await fetchWP(
    withParams(`/wp/v2/media`, {
      parent: parentId,
      per_page: 100,
      _fields: "id,source_url,media_type,mime_type,media_details,alt_text",
    }),
    { language, logErrors: false }
  );

  return Array.isArray(media) ? media : [];
}

async function getWooStoreProductBySlug(slug, { language } = {}) {
  if (!slug) return null;

  const products = await fetchWP(
    withParams(`/wc/store/v1/products`, {
      slug,
      per_page: 1,
    }),
    { language, logErrors: false }
  );

  return Array.isArray(products) ? products[0] || null : null;
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

export async function getThemeOptions({ language } = {}) {
  const endpoints = [
    `/headless/v1/theme-options`,
    `/wp/v2/acf/options?acf_format=standard`,
    `/acf/v3/options/options`,
  ];

  for (const endpoint of endpoints) {
    try {
      const data = await fetchWP(endpoint, { language });
      if (data && !data.code) return data;
    } catch {}
  }

  return {};
}

function pickFirstObject(candidates = []) {
  return (
    candidates.find(
      (item) => item && typeof item === "object" && !Array.isArray(item)
    ) || {}
  );
}

function resolveOptionsData(data) {
  return pickFirstObject([
    data?.options?.acf,
    data?.options,
    data?.data?.acf,
    data?.data,
    data?.acf,
    data,
  ]);
}

function resolveBlogSettingsData(data) {
  const options = resolveOptionsData(data);

  return pickFirstObject([
    options?.blog_settings,
    options?.blog_setting,
    options?.global?.blog_settings,
    options?.global?.blog_setting,
    options?.global,
    options,
  ]);
}

export async function getBlogSettings({ language } = {}) {
  const endpoints = [
    `/headless/v1/blog-settings`,
    `/headless/v1/blog-setting`,
    `/headless/v1/theme-options`,
    `/wp/v2/acf/options/blog-setting?acf_format=standard`,
    `/wp/v2/acf/options/blog-settings?acf_format=standard`,
    `/wp/v2/acf/options?acf_format=standard`,
    `/acf/v3/options/blog-setting`,
    `/acf/v3/options/blog-settings`,
    `/acf/v3/options/options`,
  ];

  for (const endpoint of endpoints) {
    try {
      const data = await fetchWP(endpoint, { language });
      const options = resolveBlogSettingsData(data);
      if (options && !options.code && Object.keys(options).length > 0) {
        return options;
      }
    } catch {}
  }

  return {};
}

// ─── Product categories ─────────────────────────────────────────────────────

export async function getProductCategoriesWithImages({ language } = {}) {
  const [headlessCategories, taxonomyCategories] = await Promise.all([
    fetchWP(`/headless/v1/product-categories`, { language }),
    fetchWP(
      withParams(`/wp/v2/product_cat`, {
        per_page: 100,
        hide_empty: false,
        acf_format: "standard",
      }),
      { language }
    ),
  ]);

  return mergeProductCategories(
    Array.isArray(headlessCategories) ? headlessCategories : [],
    Array.isArray(taxonomyCategories) ? taxonomyCategories : []
  );
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

export async function getProductCategories({ language } = {}) {
  const [headlessCategories, taxonomyCategories] = await Promise.all([
    fetchWP(`/headless/v1/product-categories`, { language }),
    fetchWP(
      withParams(`/wp/v2/product_cat`, {
        per_page: 100,
        hide_empty: false,
        acf_format: "standard",
      }),
      { language }
    ),
  ]);

  return mergeProductCategories(
    Array.isArray(headlessCategories) ? headlessCategories : [],
    Array.isArray(taxonomyCategories) ? taxonomyCategories : []
  );
}

export async function getProductCategoryBySlug(slug, { language } = {}) {
  const categories = await getProductCategories({ language });

  return categories.find((cat) => cat.slug === slug) || null;
}

// ─── Products ───────────────────────────────────────────────────────────────

export async function getProductsByCategory(categoryId, { language } = {}) {
  if (!categoryId) return [];

  const data = await fetchWP(
    withParams(`/wp/v2/product`, {
      product_cat: categoryId,
      per_page: 100,
      _embed: "1",
      acf_format: "standard",
    }),
    { language }
  );

  return Array.isArray(data) ? data : [];
}

export async function getProductBySlug(slug, { language } = {}) {
  const product = await getSingleEntry("product", slug, { language });
  if (!product?.id) return product;

  const wooProduct = await getWooStoreProductBySlug(slug, { language });
  const galleryImages = Array.isArray(wooProduct?.images)
    ? wooProduct.images
    : [];

  return {
    ...product,
    gallery_images: galleryImages,
  };
}

export async function getAllProducts({ language } = {}) {
  const data = await fetchWP(
    withParams(`/wp/v2/product`, {
      per_page: 100,
      _embed: "1",
      acf_format: "standard",
    }),
    { language }
  );

  return Array.isArray(data) ? data : [];
}

// ─── Latest posts ───────────────────────────────────────────────────────────

export async function getLatestPosts({ language } = {}) {
  const data = await fetchWP(
    withParams(`/wp/v2/posts`, {
      per_page: 3,
      _embed: "1",
      acf_format: "standard",
    }),
    { language }
  );

  return Array.isArray(data) ? data : [];
}

// ─── Latest case studies ────────────────────────────────────────────────────

export async function getLatestCaseStudies({ language } = {}) {
  const data = await fetchWP(
    withParams(`/wp/v2/case-study`, {
      per_page: 2,
      _embed: "1",
      acf_format: "standard",
    }),
    { language }
  );

  return Array.isArray(data) ? data : [];
}
