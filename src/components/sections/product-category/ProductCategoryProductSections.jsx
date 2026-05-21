"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

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

function getProductLink(product) {
  if (product?.slug) return `/product/${product.slug}`;

  const productPath = product?.link?.match(/\/product\/([^/?#]+)\/?/i)?.[1];

  return productPath ? `/product/${productPath}` : "#";
}

export default function ProductCategoryProductSections({
  currentCategory,
  childCategories = [],
}) {
  if (!currentCategory || childCategories.length === 0) return null;

  return (
    <section className="bg-white">
      <div className="web-width px-6 py-20 md:py-[120px]">
        {childCategories.map((childCategory, sectionIndex) => (
          <ProductSubcategoryBlock
            key={childCategory.term_id || sectionIndex}
            currentCategory={currentCategory}
            childCategory={childCategory}
          />
        ))}
      </div>
    </section>
  );
}

function ProductSubcategoryBlock({ currentCategory, childCategory }) {
  const products = childCategory?.products || [];
  const [activeIndex, setActiveIndex] = useState(0);

  if (products.length === 0) return null;

  const activeProduct = products[activeIndex] || products[0];

  const activeTitle = getProductTitle(activeProduct);
  const activeExcerpt = getProductExcerpt(activeProduct);
  const activeImage = getProductImage(activeProduct);
  const activeLink = getProductLink(activeProduct);

  const capacity =
    activeProduct?.acf?.capacity ||
    activeProduct?.acf?.product_capacity ||
    "";

  const fuelType =
    activeProduct?.acf?.fuel_type ||
    activeProduct?.acf?.product_fuel_type ||
    "";

  return (
    <div className="mb-20 last:mb-0">
      {/* Section Heading */}
      <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-20">
        <div>
          <div className="mb-6 flex items-center gap-2">
            <span className="h-[16px] w-[2px] bg-[var(--color-yellow)]" />

            <p className="font-body text-[14px] font-medium uppercase leading-[24px] tracking-[0.56px] text-[#1A1A1A]">
              {currentCategory.name}
            </p>
          </div>

          <h2 className="max-w-[620px] font-heading text-[42px] font-normal leading-[50px] tracking-[-0.84px] text-black md:text-[52px] md:leading-[60px] md:tracking-[-1.04px]">
            {childCategory.name}
          </h2>
        </div>
        
        {childCategory?.description && (
          <div className="flex items-start lg:pt-[54px]">
            <div
              className="max-w-[628px] font-body text-[16px] font-normal leading-[24px] text-[#1A1A1A]"
              dangerouslySetInnerHTML={{ __html: childCategory.description }}
            />
          </div>
        )}
      </div>

      {/* Product Card */}
      <div className="relative overflow-hidden rounded-[8px] bg-[linear-gradient(180deg,#F3F4FB_0%,#D0D3E3_100%)] px-6 py-8 md:px-12 md:py-12">
        {/* Pattern */}
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
          {/* Left content */}
          <div>
            <h3 className="mb-6 font-heading text-[32px] font-medium leading-[40px] tracking-[-0.64px] text-black md:text-[40px] md:leading-[48px]">
              {activeTitle}
            </h3>

            {activeExcerpt && (
              <div
                className="mb-8 max-w-[420px] font-body text-[16px] font-normal leading-[24px] text-[#1A1A1A]"
                dangerouslySetInnerHTML={{ __html: activeExcerpt }}
              />
            )}

            {(capacity || fuelType) && (
              <div className="mb-8 max-w-[420px] border-y border-black/15">
                {capacity && (
                  <div className="grid grid-cols-[130px_1fr] gap-4 border-b border-black/15 py-3">
                    <div className="flex items-center gap-2 font-body text-[14px] font-bold leading-[22px] text-[var(--color-accent)]">
                      <Image
                        src="/capacity-icon.svg"
                        alt=""
                        width={16}
                        height={16}
                        className="h-[16px] w-[16px] object-contain"
                      />
                      Capacity
                    </div>

                    <div className="font-body text-[14px] leading-[22px] text-black">
                      {capacity}
                    </div>
                  </div>
                )}

                {fuelType && (
                  <div className="grid grid-cols-[130px_1fr] gap-4 py-3">
                    <div className="flex items-center gap-2 font-body text-[14px] font-bold leading-[22px] text-[var(--color-accent)]">
                      <Image
                        src="/fuel-type-icon.svg"
                        alt=""
                        width={16}
                        height={16}
                        className="h-[16px] w-[16px] object-contain"
                      />
                      Fuel type
                    </div>

                    <div className="font-body text-[14px] leading-[22px] text-black">
                      {fuelType}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-4">
              <Link
                href="#"
                className="group inline-flex items-center gap-4 rounded-[4px] bg-[image:var(--mpp-gradient)] py-[6px] pr-[6px] pl-6 font-heading text-[14px] font-normal tracking-[-0.28px] text-white transition-opacity hover:opacity-90"
              >
                <span>Find a dealer</span>

                <Image
                  src="/black-white-arrow.svg"
                  alt=""
                  width={40}
                  height={40}
                  className="h-auto w-[40px] object-contain transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href={activeLink}
                className="group inline-flex items-center gap-4 rounded-[4px] bg-[var(--color-yellow)] py-[6px] pr-[6px] pl-6 font-heading text-[14px] font-normal tracking-[-0.28px] text-black transition-opacity hover:opacity-90"
              >
                <span>View product</span>

                <Image
                  src="/black-white-arrow.svg"
                  alt=""
                  width={40}
                  height={40}
                  className="h-auto w-[40px] object-contain transition-transform group-hover:translate-x-1"
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
                      prev === 0 ? products.length - 1 : prev - 1
                    )
                  }
                  className="flex h-[44px] w-[44px] items-center justify-center rounded-[4px] bg-white text-black transition-opacity hover:opacity-80"
                  aria-label="Previous product"
                >
                  <Image
                    src="/slider-arrow.svg"
                    alt=""
                    width={40}
                    height={40}
                    className="h-auto w-[40px] rotate-180 object-contain transition-transform"
                  />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex((prev) =>
                      prev === products.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="flex h-[44px] w-[44px] items-center justify-center rounded-[4px] bg-white text-black transition-opacity hover:opacity-80"
                  aria-label="Next product"
                >
                  <Image
                    src="/slider-arrow.svg"
                    alt=""
                    width={40}
                    height={40}
                    className="h-auto w-[40px] object-contain transition-transform"
                  />
                </button>
              </div>
            )}
          </div>

          {/* Right product tabs + image */}
          <div>
            {products.length > 1 && (
              <div className="mb-10 flex flex-wrap justify-start gap-0 rounded-[4px] bg-[#D9DBE7] p-1 lg:ml-auto lg:w-fit">
                {products.map((product, index) => {
                  const isActive = activeIndex === index;

                  return (
                    <button
                      key={product.id || index}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`min-h-[44px] rounded-[3px] px-6 font-heading text-[16px] font-normal tracking-[-0.32px] transition-colors ${
                        isActive
                          ? "bg-white text-black shadow-sm"
                          : "text-black/80 hover:bg-white/40"
                      }`}
                    >
                      {getProductTitle(product)}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="relative flex min-h-[280px] items-center justify-center md:min-h-[360px]">
              {activeImage ? (
                <Image
                  src={activeImage}
                  alt={activeTitle || "Product image"}
                  width={760}
                  height={520}
                  className="h-auto w-full max-w-[720px] object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.25)]"
                />
              ) : (
                <div className="flex min-h-[260px] w-full items-center justify-center rounded-[8px] border border-black/10 bg-white/30 font-body text-[14px] text-black/50">
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
