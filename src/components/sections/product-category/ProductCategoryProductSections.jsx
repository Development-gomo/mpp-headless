"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  DEFAULT_LANGUAGE,
  ENGLISH_LANGUAGE,
  GERMAN_LANGUAGE,
  localizePath,
  normalizeLanguage,
} from "@/lib/i18n";
import {
  getProductVariations,
  stripHtml as stripAndDecodeHtml,
  getVariationCapacity,
  getVariationTextValues,
} from "@/components/sections/product/productUtils";

const PRODUCT_CATEGORY_SECTION_LABELS = {
  [DEFAULT_LANGUAGE]: {
    findDealer: "Hitta återförsäljare",
    viewProduct: "Visa produkt",
  },
  [ENGLISH_LANGUAGE]: {
    findDealer: "Find a dealer",
    viewProduct: "View product",
  },
  [GERMAN_LANGUAGE]: {
    findDealer: "Händler finden",
    viewProduct: "Produkt ansehen",
  },
};

function getProductCategorySectionLabels(language) {
  return (
    PRODUCT_CATEGORY_SECTION_LABELS[normalizeLanguage(language)] ||
    PRODUCT_CATEGORY_SECTION_LABELS[DEFAULT_LANGUAGE]
  );
}

const PRODUCT_CATEGORY_VERTICAL_LABELS = {
  [DEFAULT_LANGUAGE]: {
    filters: "Filter",
    subcategories: "Underkategorier",
    requestQuote: "Beg\u00e4r offert",
    capacity: "Kapacitet",
    fuelType: "Br\u00e4nsletyp",
    newProduct: "Ny",
    productImageMissing: "Produktbild saknas",
    viewProduct: "Visa produkt",
  },
  [ENGLISH_LANGUAGE]: {
    filters: "Filters",
    subcategories: "Subcategories",
    requestQuote: "Request a quote",
    capacity: "Capacity",
    fuelType: "Fuel type",
    newProduct: "New",
    productImageMissing: "Product image missing",
    viewProduct: "View product",
  },
  [GERMAN_LANGUAGE]: {
    filters: "Filter",
    subcategories: "Unterkategorien",
    requestQuote: "Angebot anfordern",
    capacity: "Kapazit\u00e4t",
    fuelType: "Kraftstoffart",
    newProduct: "Neu",
    productImageMissing: "Produktbild fehlt",
    viewProduct: "Produkt ansehen",
  },
};

function getProductCategoryVerticalLabels(language) {
  return (
    PRODUCT_CATEGORY_VERTICAL_LABELS[normalizeLanguage(language)] ||
    PRODUCT_CATEGORY_VERTICAL_LABELS[DEFAULT_LANGUAGE]
  );
}

function getImageUrl(image) {
  if (!image) return "";

  if (typeof image === "string") return image;

  return (
    image?.url ||
    image?.src ||
    image?.source_url ||
    image?.sizes?.large ||
    image?.sizes?.medium_large ||
    image?.sizes?.full ||
    ""
  );
}

function getProductImage(product) {
  const embeddedMedia = product?._embedded?.["wp:featuredmedia"]?.[0];

  const embeddedImage =
    embeddedMedia?.source_url ||
    embeddedMedia?.media_details?.sizes?.large?.source_url ||
    embeddedMedia?.media_details?.sizes?.medium_large?.source_url ||
    embeddedMedia?.media_details?.sizes?.full?.source_url ||
    embeddedMedia?.media_details?.sizes?.woocommerce_single?.source_url ||
    embeddedMedia?.media_details?.sizes?.woocommerce_thumbnail?.source_url;

  const yoastImage =
    product?.yoast_head_json?.og_image?.[0]?.url ||
    product?.yoast_head_json?.schema?.["@graph"]?.find(
      (item) => item?.["@type"] === "ImageObject",
    )?.url ||
    product?.yoast_head_json?.schema?.["@graph"]?.find(
      (item) => item?.thumbnailUrl,
    )?.thumbnailUrl;

  const directImage =
    product?.featured_media_url ||
    product?.featured_image ||
    product?.thumbnail_url ||
    product?.image ||
    product?.thumbnail ||
    product?.images?.[0]?.src ||
    product?.images?.[0]?.url;

  const acfImage =
    product?.acf?.product_image ||
    product?.acf?.image ||
    product?.acf?.featured_image ||
    product?.acf?.product_featured_image;

  return (
    embeddedImage ||
    yoastImage ||
    getImageUrl(directImage) ||
    getImageUrl(acfImage)
  );
}

function getProductTitle(product) {
  return stripHtml(product?.title?.rendered || product?.title || "");
}

function getProductExcerpt(product) {
  return (
    product?.acf?.short_description ||
    product?.excerpt?.rendered ||
    product?.content?.rendered ||
    ""
  );
}

function stripHtml(value = "") {
  return stripAndDecodeHtml(value);
}

function getRepeaterValues(rows, key) {
  if (!Array.isArray(rows)) return [];

  return rows.map((row) => stripHtml(row?.[key] || "")).filter(Boolean);
}

function uniqueValues(values) {
  const seen = new Set();

  return values.filter((value) => {
    const cleanValue = stripHtml(value);
    const key = cleanValue.toLowerCase();
    if (!cleanValue || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getProductCapacityMeta(product) {
  const variationCapacities = uniqueValues(
    getProductVariations(product).map(getVariationCapacity),
  );

  if (variationCapacities.length > 0) return variationCapacities.join(" | ");

  const capacityOptions = getRepeaterValues(
    product?.acf?.capacity_options,
    "capacity_value",
  );

  return capacityOptions.length > 0
    ? uniqueValues(capacityOptions).join(" | ")
    : stripHtml(product?.acf?.capacity || product?.acf?.product_capacity || "");
}

function getProductFuelTypeMeta(product) {
  const variationFuelTypes = uniqueValues(
    getProductVariations(product).flatMap((variation) => [
      ...getVariationTextValues(variation?.fuel_compatibility, "compatibility"),
      ...getVariationTextValues(variation?.variation_fuel_type, "fuel_type"),
      ...getVariationTextValues(variation?.fuel_type, "fuel_type"),
    ]),
  );

  if (variationFuelTypes.length > 0) return variationFuelTypes.join(" | ");

  const fuelCompatibility = getRepeaterValues(
    product?.acf?.fuel_compatibility,
    "compatibility",
  );

  return fuelCompatibility.length > 0
    ? uniqueValues(fuelCompatibility).join(" | ")
    : stripHtml(product?.acf?.fuel_type || product?.acf?.product_fuel_type || "");
}

function getProductLink(product, language = DEFAULT_LANGUAGE) {
  if (product?.slug) return localizePath(`/product/${product.slug}`, language);

  const productPath = product?.link?.match(/\/product\/([^/?#]+)\/?/i)?.[1];

  return productPath ? localizePath(`/product/${productPath}`, language) : "#";
}

function getCategoryLayout(category) {
  return String(category?.acf?.category_layout || "").toLowerCase();
}

function getCategoryId(category) {
  return category?.term_id || category?.id || category?.ID || null;
}

function getCategoryParentId(category) {
  return category?.parent || category?.parent_id || 0;
}

function getCategoryLink(category, language = DEFAULT_LANGUAGE) {
  return category?.slug
    ? localizePath(`/product-category/${category.slug}`, language)
    : "#";
}

function getProductKey(product) {
  return String(product?.id || product?.ID || product?.slug || getProductTitle(product));
}

function buildCategoryTree(categories, parentCategory) {
  const parentId = getCategoryId(parentCategory);
  if (!parentId) return [];

  const categoriesByParent = new Map();

  categories.forEach((category) => {
    const categoryId = getCategoryId(category);
    if (!categoryId) return;

    const parentKey = String(getCategoryParentId(category));
    const siblings = categoriesByParent.get(parentKey) || [];
    siblings.push(category);
    categoriesByParent.set(parentKey, siblings);
  });

  const buildNodes = (parentKey, visitedIds = new Set()) =>
    (categoriesByParent.get(parentKey) || []).map((category) => {
      const categoryId = String(getCategoryId(category));
      if (visitedIds.has(categoryId)) {
        return {
          category,
          children: [],
        };
      }

      const nextVisitedIds = new Set(visitedIds);
      nextVisitedIds.add(categoryId);

      return {
        category,
        children: buildNodes(categoryId, nextVisitedIds),
      };
    });

  return buildNodes(String(parentId));
}

function getVerticalProducts(childCategories) {
  const seenKeys = new Set();

  return childCategories
    .flatMap((childCategory) => childCategory?.products || [])
    .filter((product) => {
      const key = getProductKey(product);
      if (!key || seenKeys.has(key)) return false;
      seenKeys.add(key);
      return true;
    });
}

function getProductBadge(product, labels) {
  const acf = product?.acf || {};
  const badge =
    acf.product_badge ||
    acf.badge_label ||
    acf.product_label ||
    acf.new_label ||
    "";

  if (badge) return stripHtml(badge);

  return acf.is_new || acf.new_product || acf.show_new_badge
    ? labels.newProduct
    : "";
}

export default function ProductCategoryProductSections({
  currentCategory,
  childCategories = [],
  language = DEFAULT_LANGUAGE,
}) {
  if (!currentCategory || childCategories.length === 0) return null;

  const isVerticalLayout = getCategoryLayout(currentCategory) === "vertical";
  const verticalProducts = isVerticalLayout
    ? getVerticalProducts(childCategories)
    : [];

  return (
    <section data-category-products className="scroll-mt-[144px] bg-white">
      <div className="web-width px-6 py-20 md:py-30">
        {isVerticalLayout ? (
          <ProductVerticalLayout
            currentCategory={currentCategory}
            categories={childCategories}
            products={verticalProducts}
            language={language}
          />
        ) : (
          childCategories.map((childCategory, sectionIndex) => (
            <ProductSubcategoryBlock
              key={childCategory.term_id || sectionIndex}
              currentCategory={currentCategory}
              childCategory={childCategory}
              language={language}
            />
          ))
        )}
      </div>
    </section>
  );
}

function ProductVerticalLayout({
  currentCategory,
  categories,
  products,
  language,
}) {
  if (products.length === 0) return null;

  const labels = getProductCategoryVerticalLabels(language);
  const categoryTree = buildCategoryTree(categories, currentCategory);
  const hasSidebar = categoryTree.length > 0;

  return (
    <div
      className={`grid grid-cols-1 gap-8 ${
        hasSidebar
          ? "lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr]"
          : ""
      }`}
    >
      {hasSidebar && (
        <aside className="lg:sticky lg:top-30 lg:self-start">
          <h2 className="mb-6 font-heading text-[32px] font-normal leading-9 tracking-[-0.64px] text-black">
            {labels.filters}
          </h2>

          <div className="rounded-lg bg-[rgba(0,112,158,0.1)] px-6 py-7">
            <div className="flex items-center justify-between gap-4 border-b border-black/25 pb-4">
              <h3 className="font-heading text-[20px] font-medium leading-7 tracking-[-0.4px] text-black">
                {labels.subcategories}
              </h3>

              <Image
                src="/down-arrow-black.svg"
                alt=""
                width={12}
                height={7}
                className="h-auto w-3"
              />
            </div>

            <nav className="pt-4" aria-label={labels.subcategories}>
              <CategorySidebarList items={categoryTree} language={language} />
            </nav>
          </div>
        </aside>
      )}

      <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product, index) => (
          <ProductVerticalCard
            key={`${getProductKey(product)}-${index}`}
            product={product}
            language={language}
          />
        ))}
      </div>
    </div>
  );
}

function CategorySidebarList({ items, language, level = 0 }) {
  if (items.length === 0) return null;

  return (
    <ul className={level > 0 ? "mt-1 space-y-1 pl-5" : "space-y-2"}>
      {items.map((item) => {
        const category = item.category;
        const categoryId = getCategoryId(category);

        return (
          <li key={categoryId || category?.slug}>
            <Link
              href={getCategoryLink(category, language)}
              className={`group flex items-center gap-3 rounded-sm py-1.5 font-body text-[15px] leading-5.5 tracking-[-0.3px] transition-colors hover:text-[var(--color-accent)] ${
                level === 0
                  ? "font-semibold text-[var(--color-accent)]"
                  : "font-normal text-black"
              }`}
            >
              <span
                className={`h-4 w-4 shrink-0 rounded-[2px] border transition-colors ${
                  level === 0
                    ? "border-[var(--color-yellow)] bg-[var(--color-yellow)]"
                    : "border-black group-hover:border-[var(--color-accent)]"
                }`}
                aria-hidden="true"
              />
              <span>{stripHtml(category?.name)}</span>
            </Link>

            <CategorySidebarList
              items={item.children}
              language={language}
              level={level + 1}
            />
          </li>
        );
      })}
    </ul>
  );
}

function ProductVerticalCard({ product, language }) {
  const labels = getProductCategoryVerticalLabels(language);
  const title = stripHtml(getProductTitle(product));
  const excerpt = stripHtml(getProductExcerpt(product));
  const image = getProductImage(product);
  const productLink = getProductLink(product, language);
  const quoteLink = localizePath("/rfq", language);
  const capacity = getProductCapacityMeta(product);
  const fuelType = getProductFuelTypeMeta(product);
  const badge = getProductBadge(product, labels);

  return (
    <article className="flex h-full flex-col rounded-lg bg-[#F3F4FB] p-3 text-black">
      <div className="relative flex aspect-[1.42/1] items-center justify-center overflow-hidden rounded-lg bg-white p-8">
        {badge && (
          <span className="absolute left-3 top-0 z-10 rounded-b-sm bg-[var(--color-accent)] px-4 py-1.5 font-body text-[14px] leading-5 text-white">
            {badge}
          </span>
        )}

        {image ? (
          <Image
            src={image}
            alt={title || "Product image"}
            fill
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-contain p-8"
          />
        ) : (
          <span className="font-body text-[14px] text-black/45">
            {labels.productImageMissing}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-7">
        {title && (
          <h3 className="font-heading text-[24px] font-medium leading-8 tracking-[-0.48px] text-black">
            {title}
          </h3>
        )}

        {excerpt && (
          <p className="mt-3 font-body text-[16px] font-normal leading-7 text-[#1A1A1A]">
            {excerpt}
          </p>
        )}

        {(capacity || fuelType) && (
          <div className="mt-6 border-y border-black/20">
            {capacity && (
              <div className="grid grid-cols-[128px_1fr] gap-3 border-b border-black/20 py-3">
                <div className="flex items-center gap-2 font-body text-[14px] font-bold leading-5.5 text-[var(--color-accent)]">
                  <Image
                    src="/capacity-icon.svg"
                    alt=""
                    width={16}
                    height={16}
                    className="h-4 w-4 object-contain"
                  />
                  {labels.capacity}
                </div>

                <div className="text-right font-body text-[14px] leading-5.5 text-black">
                  {capacity}
                </div>
              </div>
            )}

            {fuelType && (
              <div className="grid grid-cols-[128px_1fr] gap-3 py-3">
                <div className="flex items-center gap-2 font-body text-[14px] font-bold leading-5.5 text-[var(--color-accent)]">
                  <Image
                    src="/fuel-type-icon.svg"
                    alt=""
                    width={16}
                    height={16}
                    className="h-4 w-4 object-contain"
                  />
                  {labels.fuelType}
                </div>

                <div className="text-right font-body text-[14px] leading-5.5 text-black">
                  {fuelType}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-auto flex gap-2 pt-7">
          <Link
            href={quoteLink}
            className="group inline-flex min-h-15 flex-1 items-center justify-center gap-4 rounded-sm bg-[image:var(--mpp-gradient)] py-1.5 pl-5 pr-1.5 font-heading text-[16px] font-normal tracking-[-0.32px] text-white transition-opacity hover:opacity-90"
          >
            <span>{labels.requestQuote}</span>
            <span className="ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-white text-[22px] leading-none text-black">
              {"\u2197"}
            </span>
          </Link>

          <Link
            href={productLink}
            aria-label={`${labels.viewProduct}: ${title}`}
            className="inline-flex min-h-15 w-15 shrink-0 items-center justify-center rounded-sm bg-[var(--color-yellow)] transition-opacity hover:opacity-90"
          >
            <Image
              src="/black-arrow.svg"
              alt=""
              width={22}
              height={22}
              className="h-5.5 w-5.5 object-contain"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}

function ProductSubcategoryBlock({ currentCategory, childCategory, language }) {
  const products = (childCategory?.products || []).slice(0, 3);
  const [activeIndex, setActiveIndex] = useState(0);
  const labels = getProductCategorySectionLabels(language);
  const metaLabels = getProductCategoryVerticalLabels(language);

  if (products.length === 0) return null;

  const activeProduct = products[activeIndex] || products[0];

  const activeTitle = getProductTitle(activeProduct);
  const activeExcerpt = getProductExcerpt(activeProduct);
  const activeImage = getProductImage(activeProduct);
  const activeLink = getProductLink(activeProduct, language);

  const capacity = getProductCapacityMeta(activeProduct);
  const fuelType = getProductFuelTypeMeta(activeProduct);

  return (
    <div className="mb-20 last:mb-0">
      {/* Section Heading */}
      <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-20">
        <div>
          <div className="mb-6 flex items-center gap-2">
            <span className="h-4 w-0.5 bg-[var(--color-yellow)]" />

            <p className="font-body text-[14px] font-medium uppercase leading-6 tracking-[0.56px] text-[#1A1A1A]">
              {currentCategory.name}
            </p>
          </div>

          <h2 className="max-w-155 font-heading text-[42px] font-normal leading-12.5 tracking-[-0.84px] text-black md:text-[48px] md:leading-14.5 md:tracking-[-1.04px]">
            {childCategory.name}
          </h2>
        </div>

        {childCategory?.description && (
          <div className="flex items-start lg:pt-13.5">
            <div
              className="max-w-[628px] font-body text-4 font-normal leading-6 text-[#1A1A1A]"
              dangerouslySetInnerHTML={{ __html: childCategory.description }}
            />
          </div>
        )}
      </div>

      {/* Product Card */}
      <div className="relative overflow-hidden rounded-lg bg-[linear-gradient(180deg,#F3F4FB_0%,#D0D3E3_100%)] px-6 py-8 md:px-12 md:py-12">
        {/* Pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "url('/mpp-pattern.svg')",
            backgroundSize: "50%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "82% 50%",
          }}
        />

        <div className="relative z-10 grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] ">
          {/* Left content */}
          <div>
            <h3 className="mb-6 font-heading text-[32px] font-medium leading-10 tracking-[-0.64px] text-black md:text-10 md:leading-12">
              {activeTitle}
            </h3>

            {activeExcerpt && (
              <div
                className="mb-8 max-w-105 font-body text-4 font-normal leading-6 text-[#1A1A1A]"
                dangerouslySetInnerHTML={{ __html: activeExcerpt }}
              />
            )}

            {(capacity || fuelType) && (
              <div className="mb-8 max-w-105 border-y border-black/15">
                {capacity && (
                  <div className="grid grid-cols-[130px_1fr] gap-4 border-b border-black/15 py-3">
                    <div className="flex items-center gap-2 font-body text-[14px] font-bold leading-5.5 text-[var(--color-accent)]">
                      <Image
                        src="/capacity-icon.svg"
                        alt=""
                        width={16}
                        height={16}
                        className="h-4 w-4 object-contain"
                      />
                      {metaLabels.capacity}
                    </div>

                    <div className="font-body text-[14px] leading-5.5 text-black">
                      {capacity} L
                    </div>
                  </div>
                )}

                {fuelType && (
                  <div className="grid grid-cols-[130px_1fr] gap-4 py-3">
                    <div className="flex items-center gap-2 font-body text-[14px] font-bold leading-5.5 text-[var(--color-accent)]">
                      <Image
                        src="/fuel-type-icon.svg"
                        alt=""
                        width={16}
                        height={16}
                        className="h-4 w-4 object-contain"
                      />
                      {metaLabels.fuelType}
                    </div>

                    <div className="font-body text-[14px] leading-5.5 text-black">
                      {fuelType}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-4">
              <Link
                href="#"
                className="group inline-flex items-center gap-4 rounded-sm bg-[image:var(--mpp-gradient)] py-1.5 pr-1.5 pl-6 font-heading text-[14px] font-normal tracking-[-0.28px] text-white transition-opacity hover:opacity-90"
              >
                <span>{labels.findDealer}</span>

                <Image
                  src="/black-white-arrow.svg"
                  alt=""
                  width={36}
                  height={36}
                  className="h-auto w-9 object-contain transition-transform"
                />
              </Link>

              <Link
                href={activeLink}
                className="group inline-flex items-center gap-4 rounded-sm bg-[var(--color-yellow)] py-1.5 pr-1.5 pl-6 font-heading text-[14px] font-normal tracking-[-0.28px] text-black transition-opacity hover:opacity-90"
              >
                <span>{labels.viewProduct}</span>

                <Image
                  src="/black-white-arrow.svg"
                  alt=""
                  width={36}
                  height={36}
                  className="h-auto w-9 object-contain transition-transform"
                />
              </Link>
            </div>

            {/* Arrows */}
            {products.length > 1 && (
              <div className="mt-16 flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex((prev) =>
                      prev === 0 ? products.length - 1 : prev - 1,
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-sm bg-white text-black transition-opacity hover:opacity-80 cursor-pointer" aria-label="Previous product">
                  <Image
                    src="/slider-arrow.svg"
                    alt=""
                    width={40}
                    height={40}
                    className="h-auto w-10 rotate-180 object-contain transition-transform"
                  />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex((prev) =>
                      prev === products.length - 1 ? 0 : prev + 1,
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-sm bg-white text-black transition-opacity hover:opacity-80 cursor-pointer" aria-label="Next product">
                  <Image
                    src="/slider-arrow.svg"
                    alt=""
                    width={40}
                    height={40}
                    className="h-auto w-10 object-contain transition-transform"
                  />
                </button>
              </div>
            )}
          </div>

          {/* Right product image */}
          <div>
            <div className="relative flex min-h-70 items-center justify-center md:min-h-90">
              {activeImage ? (
                <Image
                  src={activeImage}
                  alt={activeTitle || "Product image"}
                  width={760}
                  height={520}
                  className="h-auto w-full max-w-180 absolute -bottom-12 object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.25)]"
                />
              ) : (
                <div className="flex min-h-65 w-full items-center justify-center rounded-lg border border-black/10 bg-white/30 font-body text-[14px] text-black/50">
                  {metaLabels.productImageMissing}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
