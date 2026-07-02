"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useQuoteCart } from "@/components/quote/QuoteCartProvider";
import { DEFAULT_LANGUAGE, localizePath } from "@/lib/i18n";
import {
  getButtonHref,
  getButtonTarget,
  getProductVariations,
  getProductCategories,
  getProductGallery,
  getRepeaterValues,
  getRendered,
  getVariationCapacity,
  getVariationTextValues,
  stripHtml,
} from "./productUtils";

const VISIBLE_THUMBNAILS = 5;

function getFileHref(file, fallback = "#") {
  if (!file) return fallback;
  if (typeof file === "string") return file || fallback;
  return file.url || file.link || file.source_url || fallback;
}

function appendUnit(value, unit) {
  const cleanValue = stripHtml(value || "");
  if (!cleanValue) return "";
  if (new RegExp(`\\b${unit}\\b`, "i").test(cleanValue)) return cleanValue;

  return `${cleanValue} ${unit}`;
}

function SpecTile({ icon, label, value }) {
  if (!value) return null;

  return (
    <div className="inline-flex min-h-[45px] items-center gap-2 rounded-sm border border-[#98C8DA] bg-[#CFE8F1] px-2 py-1">
      <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center">
        <Image src={icon} alt="" width={30} height={30} className="h-[30px] w-[30px] object-contain" />
      </span>
      <span>
        <span className="block font-body text-[8px] leading-[10px] text-[#4B626A]">
          {label}
        </span>
        <strong className="block font-body text-[14px] font-bold leading-[18px] text-black">
          {value}
        </strong>
      </span>
    </div>
  );
}

export default function ProductHero({
  product,
  language = DEFAULT_LANGUAGE,
  variations,
  selectedVariation,
  selectedVariationIndex = 0,
  onVariationChange,
}) {
  const { addProduct } = useQuoteCart();
  const router = useRouter();
  const acf = product?.acf || {};
  const variationOptions = Array.isArray(variations)
    ? variations
    : getProductVariations(product);
  const activeVariation =
    selectedVariation || variationOptions[selectedVariationIndex] || null;
  const title = activeVariation?.variation_title || getRendered(product?.title);
  const variationSku = stripHtml(activeVariation?.variation_sku || "");
  const productTitle = stripHtml(title) || "Product";
  const textBelowTitle = acf.text_under_title;
  const eyebrow = acf.text_over_title;
  const intro = getRendered(product?.excerpt);
  const gallery = useMemo(() => getProductGallery(product), [product]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [thumbnailStart, setThumbnailStart] = useState(0);

  const categories = getProductCategories(product);
  const categoryLabel = categories[0]?.name || "Mobile fuel tanks";
  const variationCapacityOptions = variationOptions
    .map((variation, index) => ({
      label: getVariationCapacity(variation),
      value: String(index),
    }))
    .filter((option) => option.label);
  const legacyCapacities = getRepeaterValues(
    acf.capacity_options,
    "capacity_value"
  );
  const fallbackCapacity =
    acf.capacity ||
    acf.product_capacity ||
    acf.product_specs?.find?.((item) => /capacity/i.test(item?.spec_label || ""))
      ?.spec_value;
  const capacityOptions =
    variationCapacityOptions.length > 0
      ? variationCapacityOptions
      : legacyCapacities.length > 0
      ? legacyCapacities.map((capacity) => ({
          label: capacity,
          value: capacity,
        }))
      : fallbackCapacity
      ? [{ label: stripHtml(fallbackCapacity), value: stripHtml(fallbackCapacity) }]
      : [];
  const [localSelectedCapacity, setLocalSelectedCapacity] = useState(
    capacityOptions[0]?.value || ""
  );
  const selectedCapacity = activeVariation
    ? getVariationCapacity(activeVariation)
    : localSelectedCapacity;
  const fuelCompatibility = activeVariation
    ? getVariationTextValues(activeVariation.fuel_compatibility, "compatibility")
    : getRepeaterValues(acf.fuel_compatibility, "compatibility");
  const applicationAreas = activeVariation
    ? getVariationTextValues(activeVariation.application_areas, "area")
    : getRepeaterValues(acf.application_areas, "area");
  const keyFeatures = getRepeaterValues(acf.key_features, "feature");
  const volume = activeVariation?.volume || acf.volume;
  const dimensions =
    activeVariation?.dimensions || acf.dimention || acf.dimension;
  const netWeight = activeVariation?.net_weight || acf.net_weight;
  const displayVolume = appendUnit(volume, "L");
  const displayNetWeight = appendUnit(netWeight, "Kg");
  const primaryText = acf.product_primary_cta_text || "Request a quote";
  const secondaryText =
    acf.product_secondary_cta_text || "Download Product Sheet";
  const secondaryHref = getFileHref(
    acf.product_sheet,
    getButtonHref(acf.product_secondary_cta_link, "#downloads")
  );
  const secondaryTarget =
    getButtonTarget(acf.product_secondary_cta_link) ||
    (secondaryHref !== "#" ? "_blank" : undefined);
  const activeImage = gallery[activeImageIndex];
  const maxThumbnailStart = Math.max(gallery.length - VISIBLE_THUMBNAILS, 0);
  const visibleThumbnails = gallery.slice(
    thumbnailStart,
    thumbnailStart + VISIBLE_THUMBNAILS
  );

  const selectImage = (index) => {
    setActiveImageIndex(index);

    if (index < thumbnailStart) {
      setThumbnailStart(index);
    } else if (index >= thumbnailStart + VISIBLE_THUMBNAILS) {
      setThumbnailStart(Math.min(index - VISIBLE_THUMBNAILS + 1, maxThumbnailStart));
    }
  };

  const showPreviousImage = () => {
    if (gallery.length < 2) return;
    const nextIndex =
      activeImageIndex === 0 ? gallery.length - 1 : activeImageIndex - 1;
    selectImage(nextIndex);
  };

  const showNextImage = () => {
    if (gallery.length < 2) return;
    selectImage((activeImageIndex + 1) % gallery.length);
  };

  const showPreviousThumbnails = () => {
    const nextStart =
      thumbnailStart === 0 ? maxThumbnailStart : thumbnailStart - 1;
    setThumbnailStart(nextStart);
  };

  const showNextThumbnails = () => {
    const nextStart =
      thumbnailStart >= maxThumbnailStart ? 0 : thumbnailStart + 1;
    setThumbnailStart(nextStart);
  };

  const handleRequestQuote = () => {
    addProduct({
      productId: product?.id,
      slug: product?.slug,
      name: productTitle,
      sku:
        variationSku ||
        product?.sku ||
        acf.article_number ||
        acf.product_article_number,
      capacity: selectedCapacity,
      image: activeImage || gallery[0],
    });
    router.push(localizePath("/rfq", language));
  };

  const handleCapacityChange = (event) => {
    if (variationCapacityOptions.length > 0) {
      onVariationChange?.(Number(event.target.value));
      return;
    }

    setLocalSelectedCapacity(event.target.value);
  };

  return (
    <section className="bg-white text-black">
      <div className="web-width px-6 pb-20 pt-2 md:pb-30">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,610px)_minmax(0,1fr)] xl:gap-5">
          <div>
            <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-lg border border-[#DDD8CE] bg-white md:min-h-[392px]">
              {activeImage ? (
                <Image
                  key={activeImage}
                  src={activeImage}
                  alt={productTitle}
                  fill
                  priority
                  sizes="(min-width: 1024px) 610px, 100vw"
                  className="product-gallery-main-image object-contain p-10 md:p-12"
                />
              ) : (
                <div className="flex min-h-[300px] items-center justify-center font-body text-[14px] text-black/50 md:min-h-[392px]">
                  Product image missing
                </div>
              )}

              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPreviousImage}
                    className="absolute left-4 top-1/2 z-10 flex h-10 w-[40px] -translate-y-1/2 items-center justify-center rounded-sm bg-[var(--color-accent)] text-white transition-opacity hover:opacity-90"
                    aria-label="Previous product image"
                  >
                    <span className="text-[28px] leading-none">‹</span>
                  </button>
                  <button
                    type="button"
                    onClick={showNextImage}
                    className="absolute right-4 top-1/2 z-10 flex h-10 w-[40px] -translate-y-1/2 items-center justify-center rounded-sm bg-[var(--color-accent)] text-white transition-opacity hover:opacity-90"
                    aria-label="Next product image"
                  >
                    <span className="text-[28px] leading-none">›</span>
                  </button>
                </>
              )}
            </div>

            {gallery.length > 0 && (
              <div className="mt-4 flex items-center gap-3">
                {gallery.length > VISIBLE_THUMBNAILS && (
                  <button
                    type="button"
                    onClick={showPreviousThumbnails}
                    className="flex h-11 w-9 shrink-0 items-center justify-center rounded-sm border border-[#DDD8CE] bg-white font-heading text-[22px] leading-none text-black transition-colors hover:border-[var(--color-yellow)]"
                    aria-label="Show previous gallery thumbnails"
                  >
                    &lt;
                  </button>
                )}

                <div className="flex min-w-0 flex-wrap gap-4">
                  {visibleThumbnails.map((image, visibleIndex) => {
                    const imageIndex = thumbnailStart + visibleIndex;

                    return (
                      <button
                        type="button"
                        key={`${image}-${imageIndex}`}
                        onClick={() => selectImage(imageIndex)}
                        className={`relative h-[98px] w-[98px] overflow-hidden rounded-lg border bg-white transition-colors ${
                          imageIndex === activeImageIndex
                            ? "border-[var(--color-yellow)]"
                            : "border-[#DDD8CE] hover:border-[var(--color-yellow)]/70"
                        }`}
                        aria-label={`Show product image ${imageIndex + 1}`}
                      >
                        <Image
                          src={image}
                          alt={`${productTitle} view ${imageIndex + 1}`}
                          fill
                          sizes="98px"
                          className="object-contain p-2"
                        />
                      </button>
                    );
                  })}
                </div>

                {gallery.length > VISIBLE_THUMBNAILS && (
                  <button
                    type="button"
                    onClick={showNextThumbnails}
                    className="flex h-11 w-9 shrink-0 items-center justify-center rounded-sm border border-[#DDD8CE] bg-white font-heading text-[22px] leading-none text-black transition-colors hover:border-[var(--color-yellow)]"
                    aria-label="Show next gallery thumbnails"
                  >
                    &gt;
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="rounded-lg bg-[#E5F2F7] p-6 md:p-8">
            {eyebrow && (
              <div className="mb-4 flex items-center gap-2">
                <span className="h-4 w-0.5 bg-[var(--color-yellow)]" />
                <p className="font-body text-[14px] font-medium uppercase leading-6 tracking-[0.56px] text-[#1A1A1A]">
                  {eyebrow}
                </p>
              </div>
            )}

            {!eyebrow && categoryLabel && (
              <p className="mb-3 font-body text-[14px] uppercase leading-5.5 text-[#1A1A1A]">
                {categoryLabel}
              </p>
            )}

            <h1
              className="max-w-155 font-heading text-[42px] font-normal leading-[48px] tracking-[-0.84px] text-black md:text-[52px] md:leading-[58px]"
              dangerouslySetInnerHTML={{ __html: title }}
            />

            {variationSku && (
              <div className="max-w-155 font-heading text-[42px] font-normal leading-[48px] tracking-[-0.84px] text-black md:text-[52px] md:leading-[58px]">
                {variationSku}
              </div>
            )}

            {textBelowTitle && (
              <div
                className="mt-5 border-b border-black/15 pb-5 font-body text-[15px] leading-[23px] text-[#1A1A1A]"
                dangerouslySetInnerHTML={{ __html: textBelowTitle }}
              />
            )}

            {capacityOptions.length > 0 && (
              <div className="mt-4">
                <label
                  htmlFor="product-capacity"
                  className="mb-2 block font-heading text-[18px] leading-6 tracking-[-0.36px] text-black"
                >
                  Capacity:
                </label>
                <select
                  id="product-capacity"
                  value={
                    variationCapacityOptions.length > 0
                      ? String(selectedVariationIndex)
                      : selectedCapacity
                  }
                  onChange={handleCapacityChange}
                  className="h-[56px] w-full appearance-none rounded-sm border-0 bg-[var(--color-accent)] bg-[url('/down-arrow.svg')] bg-[length:13px_8px] bg-[right_18px_center] bg-no-repeat px-4 pr-12 font-body text-[16px] font-bold text-white outline-none"
                >
                  {capacityOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="text-black"
                    >
                      {appendUnit(option.label, "Liters")}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mt-7 flex flex-wrap gap-6">
              <SpecTile icon="/volume-ico.svg" label="Volume" value={displayVolume} />
              <SpecTile icon="/dimention-ico.svg" label="Dimensions" value={dimensions} />
              <SpecTile icon="/weight-ico.svg" label="Net Weight" value={displayNetWeight} />
            </div>

            {(fuelCompatibility.length > 0 || applicationAreas.length > 0) && (
              <div className="mt-6 border-y border-black/15 py-5 font-body text-[15px] leading-6 text-black">
                {fuelCompatibility.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <strong className="mr-2 font-semibold">Fuel compatibility:</strong>
                    {fuelCompatibility.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-[var(--color-yellow)] px-4 py-1 text-[13px] leading-[18px]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}

                {applicationAreas.length > 0 && (
                  <div className="mt-4 grid gap-2 sm:grid-cols-[140px_1fr]">
                    <strong className="font-semibold">Application areas:</strong>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {applicationAreas.map((item) => (
                        <span
                          key={item}
                          className="before:mr-2 before:text-[var(--color-yellow)] before:content-['•']"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {intro && (
              <div
                className="mt-5 border-b border-black/15 pb-5 font-body text-[15px] leading-[23px] text-[#1A1A1A]"
                dangerouslySetInnerHTML={{ __html: intro }}
              />
            )}

            {keyFeatures.length > 0 && (
              <div className="mt-5">
                <h2 className="font-heading text-[18px] leading-6 tracking-[-0.36px] text-black">
                  Key features:
                </h2>
                <div className="mt-4 grid gap-x-8 gap-y-3 md:grid-cols-2">
                  {keyFeatures.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-3 font-body text-[14px] leading-[20px] text-[#1A1A1A]"
                    >
                      <span className="mt-[2px] flex h-[18px] w-4.5 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-[11px] font-bold leading-none text-white">
                        ✓
                      </span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-4">
              {primaryText && (
                <button
                  type="button"
                  onClick={handleRequestQuote}
                  className="group inline-flex h-12 items-center gap-4 rounded-sm bg-[var(--color-yellow)] py-1.5 pr-1.5 pl-6 font-heading text-[14px] tracking-[-0.28px] text-black transition-opacity hover:opacity-90"
                >
                  <span>{primaryText}</span>
                  <Image
                    src="/black-white-arrow.svg"
                    alt=""
                    width={36}
                    height={36}
                    className="h-9 w-9 transition-transform"
                  />
                </button>
              )}

              {secondaryText && (
                <Link
                  href={secondaryHref}
                  target={secondaryTarget}
                  className="group inline-flex h-12 items-center gap-4 rounded-sm bg-[var(--color-yellow)] py-1.5 pr-1.5 pl-6 font-heading text-[14px] tracking-[-0.28px] text-black transition-opacity hover:opacity-90"
                >
                  <span>{secondaryText}</span>
                  <Image
                    src="/download-ico.svg"
                    alt=""
                    width={36}
                    height={36}
                    className="h-9 w-9 transition-transform group-hover:translate-y-0.5"
                  />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
