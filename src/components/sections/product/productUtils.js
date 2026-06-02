export function stripHtml(value = "") {
  return String(value).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export function getRepeaterValues(rows, key) {
  if (!Array.isArray(rows)) return [];
  return rows.map((row) => stripHtml(row?.[key] || "")).filter(Boolean);
}

export function getProductVariations(product) {
  const variations = product?.acf?.product_variations;
  if (!Array.isArray(variations)) return [];

  return variations.filter(
    (variation) => variation && typeof variation === "object" && !Array.isArray(variation)
  );
}

export function getVariationCapacity(variation) {
  return stripHtml(variation?.variation_capacity || variation?.capacity || "");
}

export function getVariationTextValues(value, key) {
  if (Array.isArray(value)) return getRepeaterValues(value, key);

  const textValue = stripHtml(value || "");
  return textValue ? [textValue] : [];
}

export function getRendered(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.rendered || "";
}

export function getImageUrl(image) {
  if (!image) return "";
  if (typeof image === "string") return image;

  return (
    image.url ||
    image.src ||
    image.source_url ||
    image.sizes?.full ||
    image.sizes?.large ||
    image.sizes?.medium_large ||
    image.media_details?.sizes?.full?.source_url ||
    image.media_details?.sizes?.large?.source_url ||
    image.media_details?.sizes?.woocommerce_single?.source_url ||
    ""
  );
}

function isImageMedia(item) {
  if (!item) return false;
  if (typeof item === "string") return /\.(avif|gif|jpe?g|png|webp|svg)(\?.*)?$/i.test(item);
  if (item.media_type) return item.media_type === "image";
  if (item.mime_type) return item.mime_type.startsWith("image/");
  return Boolean(item.media_details?.width || item.source_url || item.url || item.src);
}

function getImageIdentity(imageUrl) {
  const rawUrl = String(imageUrl || "").trim();
  if (!rawUrl) return "";

  try {
    const url = new URL(rawUrl);
    return decodeURIComponent(url.pathname)
      .toLowerCase()
      .replace(/-\d+x\d+(?=\.(avif|gif|jpe?g|png|webp|svg)$)/i, "");
  } catch {
    return rawUrl
      .split("?")[0]
      .toLowerCase()
      .replace(/-\d+x\d+(?=\.(avif|gif|jpe?g|png|webp|svg)$)/i, "");
  }
}

function uniqueImageUrls(images) {
  const seen = new Set();

  return images.filter((image) => {
    const identity = getImageIdentity(image);
    if (!identity || seen.has(identity)) return false;
    seen.add(identity);
    return true;
  });
}

export function getProductImage(product) {
  const embeddedMedia = product?._embedded?.["wp:featuredmedia"]?.[0];

  return (
    getImageUrl(product?.images?.[0]) ||
    getImageUrl(product?.image) ||
    getImageUrl(product?.featured_image) ||
    getImageUrl(product?.featured_media_url) ||
    getImageUrl(embeddedMedia) ||
    getImageUrl(product?.acf?.product_image) ||
    getImageUrl(product?.acf?.featured_image) ||
    product?.yoast_head_json?.og_image?.[0]?.url ||
    ""
  );
}

export function getProductGallery(product) {
  const featured = getProductImage(product);
  const wooImages = [
    ...(Array.isArray(product?.images) ? product.images : []),
    ...(Array.isArray(product?.gallery_images) ? product.gallery_images : []),
    ...(Array.isArray(product?.gallery) ? product.gallery : []),
    ...(Array.isArray(product?.product_gallery) ? product.product_gallery : []),
  ];
  const acfGallery = Array.isArray(product?.acf?.product_gallery)
    ? product.acf.product_gallery
    : [];
  const filteredGallery = [...wooImages, ...acfGallery]
    .filter(isImageMedia)
    .map(getImageUrl)
    .filter(Boolean);
  const merged = featured ? [featured, ...filteredGallery] : filteredGallery;

  return uniqueImageUrls(merged);
}

export function getProductCategories(product) {
  const embeddedTerms = product?._embedded?.["wp:term"];
  const flattenedTerms = Array.isArray(embeddedTerms) ? embeddedTerms.flat() : [];
  const wpTerms = flattenedTerms.filter(
    (term) => term?.taxonomy === "product_cat" || term?.rest_base === "product_cat"
  );
  const wooCategories = Array.isArray(product?.categories) ? product.categories : [];

  return [...wpTerms, ...wooCategories].filter((term, index, terms) => {
    const key = term?.slug || term?.id || term?.term_id || term?.name;
    return key && terms.findIndex((item) => (item?.slug || item?.id || item?.term_id || item?.name) === key) === index;
  });
}

export function getButtonHref(link, fallback = "#") {
  if (!link) return fallback;
  if (typeof link === "string") return link || fallback;
  return link.url || fallback;
}

export function getButtonTarget(link) {
  if (!link || typeof link === "string") return undefined;
  return link.target || undefined;
}
