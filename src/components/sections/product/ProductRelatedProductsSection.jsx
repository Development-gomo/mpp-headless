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
  getVariationCapacity,
  getVariationTextValues,
} from "./productUtils";

const RELATED_PRODUCTS_LABELS = {
  [DEFAULT_LANGUAGE]: {
    findDealer: "Hitta återförsäljare",
    viewAllProducts: "Visa alla produkter",
    viewProduct: "Visa produkt",
  },
  [ENGLISH_LANGUAGE]: {
    findDealer: "Find a dealer",
    viewAllProducts: "View all products",
    viewProduct: "View product",
  },
  [GERMAN_LANGUAGE]: {
    findDealer: "Händler finden",
    viewAllProducts: "Alle Produkte anzeigen",
    viewProduct: "Produkt ansehen",
  },
};

function getRelatedProductsLabels(language) {
  return (
    RELATED_PRODUCTS_LABELS[normalizeLanguage(language)] ||
    RELATED_PRODUCTS_LABELS[DEFAULT_LANGUAGE]
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
      (item) => item?.["@type"] === "ImageObject"
    )?.url ||
    product?.yoast_head_json?.schema?.["@graph"]?.find(
      (item) => item?.thumbnailUrl
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

  return embeddedImage || yoastImage || getImageUrl(directImage) || getImageUrl(acfImage);
}

function stripHtml(value = "") {
  return String(value).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function getRepeaterValues(rows, key) {
  if (!Array.isArray(rows)) return [];

  return rows
    .map((row) => stripHtml(row?.[key] || ""))
    .filter(Boolean);
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
    getProductVariations(product).map(getVariationCapacity)
  );

  if (variationCapacities.length > 0) return variationCapacities.join(" | ");

  const capacityOptions = getRepeaterValues(
    product?.acf?.capacity_options,
    "capacity_value"
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
    ])
  );

  if (variationFuelTypes.length > 0) return variationFuelTypes.join(" | ");

  const fuelCompatibility = getRepeaterValues(
    product?.acf?.fuel_compatibility,
    "compatibility"
  );

  return fuelCompatibility.length > 0
    ? uniqueValues(fuelCompatibility).join(" | ")
    : stripHtml(product?.acf?.fuel_type || product?.acf?.product_fuel_type || "");
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

function getProductLink(product, language = DEFAULT_LANGUAGE) {
  if (product?.slug) return localizePath(`/product/${product.slug}`, language);

  const productPath = product?.link?.match(/\/product\/([^/?#]+)\/?/i)?.[1];

  return productPath ? localizePath(`/product/${productPath}`, language) : "#";
}

export default function ProductRelatedProductsSection({
  currentProduct,
  relatedCategory,
  products = [],
  language = DEFAULT_LANGUAGE,
}) {
  const usableProducts = Array.isArray(products) ? products : [];
  const initialIndex = Math.max(
    usableProducts.findIndex(
      (product) =>
        product?.id === currentProduct?.id || product?.slug === currentProduct?.slug
    ),
    0
  );
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  if (usableProducts.length === 0) return null;

  const activeProduct = usableProducts[activeIndex] || usableProducts[0];
  const activeTitle = getProductTitle(activeProduct);
  const activeExcerpt = getProductExcerpt(activeProduct);
  const activeImage = getProductImage(activeProduct);
  const activeLink = getProductLink(activeProduct, language);
  const labels = getRelatedProductsLabels(language);
  const capacity = getProductCapacityMeta(activeProduct);
  const fuelType = getProductFuelTypeMeta(activeProduct);
  const viewAllHref = relatedCategory?.slug
    ? localizePath(`/product-category/${relatedCategory.slug}`, language)
    : localizePath("/product-category/mobila-bransletankar", language);

  return (
    <section id="related-products" className="bg-white text-black">
      <div className="web-width px-6 pt-20 md:pt-[120px]">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <div className="mb-7 flex items-center gap-2">
              <span className="h-4 w-0.5 bg-[var(--color-yellow)]" />
              <p className="font-body text-[13px] font-medium uppercase leading-5.5 tracking-[0.52px]">
                Related products
              </p>
            </div>
            <h2 className="max-w-[580px] font-heading text-[34px] font-normal leading-[46px] tracking-[-0.84px] md:text-[48px] md:leading-14">
              Discover related fuel storage <span>products</span>
            </h2>
          </div>

          <Link
            href={viewAllHref}
            className="group inline-flex h-12 w-fit items-center gap-4 rounded-sm bg-[image:var(--mpp-gradient)] py-1.5 pr-1.5 pl-6 font-heading text-[14px] tracking-[-0.28px] text-white transition-opacity hover:opacity-90"
          >
            <span>{labels.viewAllProducts}</span>
            <Image
              src="/black-white-arrow.svg"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 transition-transform"
            />
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-lg bg-[linear-gradient(180deg,#F3F4FB_0%,#D0D3E3_100%)] px-6 py-8 md:px-12 md:py-12">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: "url('/mpp-pattern.svg')",
              backgroundSize: "70%",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          />

          <div className="relative z-10 grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <h3 className="mb-6 font-heading text-[32px] font-medium leading-[40px] tracking-[-0.64px] md:text-[40px] md:leading-12">
                {activeTitle}
              </h3>

              {activeExcerpt && (
                <div
                  className="mb-8 max-w-[420px] font-body text-[16px] leading-6 text-[#1A1A1A]"
                  dangerouslySetInnerHTML={{ __html: activeExcerpt }}
                />
              )}

              {(capacity || fuelType) && (
                <div className="mb-8 max-w-[420px] border-y border-black/15">
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
                        Capacity
                      </div>
                      <div className="font-body text-[14px] leading-5.5">
                        {capacity}
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
                        Fuel type
                      </div>
                      <div className="font-body text-[14px] leading-5.5">
                        {fuelType}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                <Link
                  href="#"
                  className="group inline-flex items-center gap-4 rounded-sm bg-[image:var(--mpp-gradient)] py-1.5 pr-1.5 pl-6 font-heading text-[14px] tracking-[-0.28px] text-white transition-opacity hover:opacity-90"
                >
                  <span>{labels.findDealer}</span>
                  <Image
                    src="/black-white-arrow.svg"
                    alt=""
                    width={40}
                    height={40}
                    className="h-auto w-10 object-contain transition-transform"
                  />
                </Link>

                <Link
                  href={activeLink}
                  className="group inline-flex items-center gap-4 rounded-sm bg-[var(--color-yellow)] py-1.5 pr-1.5 pl-6 font-heading text-[14px] tracking-[-0.28px] text-black transition-opacity hover:opacity-90"
                >
                  <span>{labels.viewProduct}</span>
                  <Image
                    src="/black-white-arrow.svg"
                    alt=""
                    width={40}
                    height={40}
                    className="h-auto w-10 object-contain transition-transform"
                  />
                </Link>
              </div>

              {usableProducts.length > 1 && (
                <div className="mt-16 flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveIndex((prev) =>
                        prev === 0 ? usableProducts.length - 1 : prev - 1
                      )
                    }
                    className="flex h-11 w-[44px] items-center justify-center rounded-sm bg-white transition-opacity hover:opacity-80"
                    aria-label="Previous product"
                  >
                    <Image
                      src="/slider-arrow.svg"
                      alt=""
                      width={40}
                      height={40}
                      className="h-auto w-10 rotate-180 object-contain"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveIndex((prev) =>
                        prev === usableProducts.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="flex h-11 w-[44px] items-center justify-center rounded-sm bg-white transition-opacity hover:opacity-80"
                    aria-label="Next product"
                  >
                    <Image
                      src="/slider-arrow.svg"
                      alt=""
                      width={40}
                      height={40}
                      className="h-auto w-10 object-contain"
                    />
                  </button>
                </div>
              )}
            </div>

            <div>
              <div className="relative flex min-h-70 items-center justify-center md:min-h-[360px]">
                {activeImage ? (
                  <Image
                    src={activeImage}
                    alt={activeTitle || "Product image"}
                    width={760}
                    height={520}
                    className="h-auto w-full max-w-[720px] object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.25)]"
                  />
                ) : (
                  <div className="flex min-h-[260px] w-full items-center justify-center rounded-lg border border-black/10 bg-white/30 font-body text-[14px] text-black/50">
                    Product image missing
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
