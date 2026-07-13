"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DEFAULT_LANGUAGE, localizePath } from "@/lib/i18n";
import {
  getProductVariations,
  getVariationCapacity,
  getVariationTextValues,
} from "@/components/sections/product/productUtils";

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
  return product?.title?.rendered || product?.title || "";
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
  return String(value)
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
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

export default function ProductCategoryProductSections({
  currentCategory,
  childCategories = [],
  language = DEFAULT_LANGUAGE,
}) {
  if (!currentCategory || childCategories.length === 0) return null;

  return (
    <section data-category-products className="scroll-mt-[144px] bg-white">
      <div className="web-width px-6 py-20 md:py-30">
        {childCategories.map((childCategory, sectionIndex) => (
          <ProductSubcategoryBlock
            key={childCategory.term_id || sectionIndex}
            currentCategory={currentCategory}
            childCategory={childCategory}
            language={language}
          />
        ))}
      </div>
    </section>
  );
}

function ProductSubcategoryBlock({ currentCategory, childCategory, language }) {
  const products = (childCategory?.products || []).slice(0, 3);
  const [activeIndex, setActiveIndex] = useState(0);

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

          <h2 className="max-w-155 font-heading text-[42px] font-normal leading-12.5 tracking-[-0.84px] text-black md:text-[48px] md:leading-[58px] md:tracking-[-1.04px]">
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
                      Capacity
                    </div>

                    <div className="font-body text-[14px] leading-5.5 text-black">
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
                <span>Find a dealer</span>

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
                <span>View product</span>

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
                  Product image missing
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
