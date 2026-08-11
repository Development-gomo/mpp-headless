"use client";

import Image from "next/image";
import { useState } from "react";
import { getProductKey, useQuoteCart } from "@/components/quote/QuoteCartProvider";
import { DEFAULT_LANGUAGE } from "@/lib/i18n";
import {
  getProductGallery,
  getProductCategories as getProductTerms,
  getProductImage,
  getRendered,
  stripHtml,
} from "./productUtils";
import { getProductLabels } from "./productLabels";

function getAccessoryTitle(accessory) {
  return (
    stripHtml(getRendered(accessory?.title)) ||
    accessory?.name ||
    accessory?.slug ||
    "Accessory"
  );
}

function getAccessoryArticleNumber(accessory) {
  const fields = accessory?.acf?.accessory_type_product_fields || {};

  return stripHtml(
    fields.artical_number ||
      fields.article_number ||
      accessory?.acf?.artical_number ||
      accessory?.acf?.article_number ||
      ""
  );
}

function getAccessoryKey(accessory) {
  return String(
    accessory?.id || accessory?.ID || accessory?.slug || getAccessoryTitle(accessory)
  );
}

function getCategoryId(category) {
  return category?.term_id || category?.id || category?.ID || null;
}

function getCategoryParentId(category) {
  return category?.parent || category?.parent_id || 0;
}

function buildCategoryMap(categories = []) {
  const categoryMap = new Map();

  categories.forEach((category) => {
    const categoryId = getCategoryId(category);
    if (categoryId) categoryMap.set(String(categoryId), category);
  });

  return categoryMap;
}

function resolveCategory(category, categoryMap) {
  const categoryId = getCategoryId(category);
  return (categoryId && categoryMap.get(String(categoryId))) || category;
}

function getCategoryDepth(category, categoryMap) {
  let depth = 0;
  let currentCategory = category;
  const visitedIds = new Set();

  while (Number(getCategoryParentId(currentCategory)) > 0) {
    const parentId = String(getCategoryParentId(currentCategory));
    if (visitedIds.has(parentId)) break;
    visitedIds.add(parentId);

    const parentCategory = categoryMap.get(parentId);
    if (!parentCategory) break;

    depth += 1;
    currentCategory = parentCategory;
  }

  return depth;
}

function getAccessoryCategories(accessory, categoryMap) {
  return getProductTerms(accessory)
    .map((category) => resolveCategory(category, categoryMap))
    .filter(Boolean);
}

// Prefers the most specific (deepest) category attached to the accessory,
// but falls back to a top-level category rather than showing nothing.
function getAccessoryDisplayCategory(accessory, categoryMap) {
  const categories = getAccessoryCategories(accessory, categoryMap);
  if (categories.length === 0) return null;

  const childCategory = categories
    .filter((category) => Number(getCategoryParentId(category)) > 0)
    .sort(
      (a, b) => getCategoryDepth(b, categoryMap) - getCategoryDepth(a, categoryMap)
    )[0];

  return childCategory || categories[0];
}

// Filters use the same category resolution as the per-card label, so the
// filter a user picks always matches what's displayed above each card.
function buildCategoryFilters(accessories, categoryMap) {
  const filters = [];
  const seenIds = new Set();

  accessories.forEach((accessory) => {
    const category = getAccessoryDisplayCategory(accessory, categoryMap);
    const categoryId = category && getCategoryId(category);
    if (!categoryId || seenIds.has(String(categoryId))) return;

    seenIds.add(String(categoryId));
    filters.push(category);
  });

  return filters;
}

function getAccessoryProductFromRow(accessoryRow) {
  if (
    accessoryRow &&
    typeof accessoryRow === "object" &&
    !Array.isArray(accessoryRow) &&
    "accessory_product" in accessoryRow
  ) {
    return accessoryRow.accessory_product;
  }

  return accessoryRow;
}

function getFallbackAccessories(product) {
  const rows = Array.isArray(product?.acf?.accessories)
    ? product.acf.accessories
    : [];

  return rows
    .flatMap((row) => {
      const accessoryProduct = getAccessoryProductFromRow(row);
      return Array.isArray(accessoryProduct) ? accessoryProduct : [accessoryProduct];
    })
    .filter(
      (accessory) =>
        accessory &&
        typeof accessory === "object" &&
        !Array.isArray(accessory)
    );
}

function AccessoryCard({
  accessory,
  image,
  isAdded,
  childCategory,
  onAdd,
  labels,
}) {
  const title = getAccessoryTitle(accessory);
  const articleNumber = getAccessoryArticleNumber(accessory);

  return (
    <article
      className={`relative grid min-h-[114px] grid-cols-[120px_1fr] gap-4 overflow-hidden rounded-lg p-2 transition-colors ${
        isAdded
          ? "bg-[var(--color-accent)] text-white"
          : "bg-[#F3F4FB] text-black"
      }`}
    >
      <div className="relative overflow-hidden rounded-md bg-white">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="120px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full min-h-[110px] w-full items-center justify-center px-2 text-center font-body text-[10px] leading-[14px] text-black/40">
            {labels.imageMissing}
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-col justify-center py-2 pr-2">
        {childCategory?.name && (
          <p
            className={`mb-1 font-body text-[10px] font-bold uppercase leading-[14px] ${
              isAdded ? "text-white/80" : "text-[#007DA5]"
            }`}
          >
            {stripHtml(childCategory.name)}
          </p>
        )}
        <h3 className="font-heading text-[20px] font-normal leading-[26px] tracking-[-0.4px]">
          {title}
        </h3>
        {articleNumber && (
          <p className="mt-1 font-body text-[14px] leading-[20px]">
            {articleNumber}
          </p>
        )}
        <button
          type="button"
          onClick={onAdd}
          className={`mt-3 w-fit cursor-pointer border-b font-heading text-[13px] font-normal uppercase leading-[18px] tracking-[-0.26px] ${
            isAdded
              ? "border-[var(--color-yellow)] text-[var(--color-yellow)]"
              : "border-[var(--color-yellow)] text-[#D79B00]"
          }`}
        >
          {isAdded ? labels.added : labels.addToCart}
        </button>
      </div>

      {isAdded && (
        <span className="absolute right-3 top-3 flex h-[18px] w-4.5 items-center justify-center rounded-full bg-[var(--color-yellow)] text-[12px] font-bold leading-none text-white">
          &#10003;
        </span>
      )}
    </article>
  );
}

export default function ProductFeaturesSection({
  product,
  productCategories = [],
  accessories = [],
  language = DEFAULT_LANGUAGE,
  selectedCapacity = "",
}) {
  const { items, addAccessory } = useQuoteCart();
  const acf = product?.acf || {};
  const [activeFilter, setActiveFilter] = useState("All");
  const labels = getProductLabels(language);
  const gallery = getProductGallery(product);
  const productTitle =
    stripHtml(getRendered(product?.title)) || product?.slug || "Product";
  const title = acf.accessories_section_title || labels.accessories.title;
  const description =
    acf.accessories_section_description || labels.accessories.description;

  const productPayload = {
    productId: product?.id,
    slug: product?.slug,
    name: productTitle,
    sku: product?.sku || acf.article_number || acf.product_article_number,
    image: gallery[0],
    capacity: selectedCapacity,
  };
  const cartProductKey = getProductKey(productPayload);
  const cartProduct = items.find((item) => item.key === cartProductKey);
  const addedAccessoryKeys = new Set(
    (cartProduct?.accessories || []).map((accessory) => accessory.key)
  );
  const visibleAccessories =
    Array.isArray(accessories) && accessories.length > 0
      ? accessories
      : getFallbackAccessories(product);
  const categoryMap = buildCategoryMap(productCategories);
  const categoryFilters = buildCategoryFilters(visibleAccessories, categoryMap);
  const filteredAccessories =
    activeFilter === "All"
      ? visibleAccessories
      : visibleAccessories.filter((accessory) => {
          const category = getAccessoryDisplayCategory(accessory, categoryMap);
          return category && String(getCategoryId(category)) === activeFilter;
        });

  if (visibleAccessories.length === 0) return null;

  return (
    <section id="accessories" className="bg-white text-black">
      <div className="web-width px-6 py-20 md:py-[120px]">
        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1fr] lg:items-start lg:gap-20">
          <div>
            <div className="mb-7 flex items-center gap-2">
              <span className="h-4 w-0.5 bg-[var(--color-yellow)]" />
              <p className="font-body text-[13px] font-medium uppercase leading-5.5 tracking-[0.52px] text-[#1A1A1A]">
                {labels.accessories.eyebrow}
              </p>
            </div>
            <h2
              className="max-w-[560px] font-heading text-[34px] font-normal leading-[46px] tracking-[-0.84px] text-black md:text-[48px] md:leading-14 [&_span]:text-[#007DA5]"
              dangerouslySetInnerHTML={{ __html: title }}
            />
          </div>

          {description && (
            <div
              className="max-w-[600px] font-body text-[14px] leading-5.5 text-[#1A1A1A] lg:pt-[54px]"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActiveFilter("All")}
            className={`h-10 min-w-[66px] rounded-sm border px-5 font-body text-[13px] leading-[18px] transition-colors ${
              activeFilter === "All"
                ? "border-[var(--color-yellow)] bg-[var(--color-yellow)] text-black"
                : "border-[var(--color-yellow)] bg-white text-black hover:bg-[var(--color-yellow)]/10"
            }`}
          >
            {labels.filters.All || "All"}
          </button>
          {categoryFilters.map((category) => {
            const categoryId = String(getCategoryId(category));

            return (
              <button
                key={categoryId}
                type="button"
                onClick={() => setActiveFilter(categoryId)}
                className={`h-10 min-w-[66px] rounded-sm border px-5 font-body text-[13px] leading-[18px] transition-colors ${
                  activeFilter === categoryId
                    ? "border-[var(--color-yellow)] bg-[var(--color-yellow)] text-black"
                    : "border-[var(--color-yellow)] bg-white text-black hover:bg-[var(--color-yellow)]/10"
                }`}
              >
                {stripHtml(category.name)}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {filteredAccessories.map((accessory, index) => {
            const accessoryKey = getAccessoryKey(accessory);
            const image = getProductImage(accessory);
            const childCategory = getAccessoryDisplayCategory(accessory, categoryMap);

            return (
              <AccessoryCard
                key={`${accessoryKey}-${index}`}
                accessory={accessory}
                image={image}
                isAdded={addedAccessoryKeys.has(accessoryKey)}
                childCategory={childCategory}
                labels={labels}
                onAdd={() => {
                  const articleNumber = getAccessoryArticleNumber(accessory);

                  addAccessory(productPayload, {
                    key: accessoryKey,
                    name: getAccessoryTitle(accessory),
                    meta: articleNumber,
                    image,
                  });
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
