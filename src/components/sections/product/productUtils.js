export function stripHtml(value = "") {
  return String(value).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
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
  const wooImages = product?.images || product?.gallery_images;
  if (Array.isArray(wooImages) && wooImages.length > 0) {
    return wooImages.map(getImageUrl).filter(Boolean);
  }

  const acfGallery = product?.acf?.product_gallery;
  const gallery = Array.isArray(acfGallery)
    ? acfGallery.map(getImageUrl).filter(Boolean)
    : [];
  const featured = getProductImage(product);

  return featured ? [featured, ...gallery.filter((image) => image !== featured)] : gallery;
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
