"use client";

import Image from "next/image";
import Link from "next/link";
import {
  getButtonHref,
  getButtonTarget,
  getProductGallery,
  getProductVariations,
  stripHtml,
} from "./productUtils";

function getOverviewRows(product, variations) {
  const acf = product?.acf || {};
  const variationRows = Array.isArray(variations)
    ? variations
    : getProductVariations(product);

  if (variationRows.length > 0) {
    return variationRows.map((variation, index) => ({
      index,
      article: stripHtml(variation?.variation_sku || ""),
      name: stripHtml(variation?.variation_title || ""),
      dimensions: stripHtml(variation?.dimensions || ""),
      volume: stripHtml(variation?.volume || ""),
      weight: stripHtml(variation?.net_weight || ""),
    }));
  }

  return [
    {
      index: 0,
      article: stripHtml(
        product?.sku || acf.article_number || acf.product_article_number || ""
      ),
      name: stripHtml(product?.title?.rendered || product?.title || ""),
      dimensions: stripHtml(acf.dimention || acf.dimension || ""),
      volume: stripHtml(acf.volume || ""),
      weight: stripHtml(acf.net_weight || ""),
    },
  ].filter((row) =>
    [row.article, row.name, row.dimensions, row.volume, row.weight].some(Boolean)
  );
}

export default function ProductOverviewSection({
  product,
  variations,
  selectedVariationIndex = 0,
  onVariationChange,
}) {
  const acf = product?.acf || {};
  const title = acf.tank_section_title || "See which tank <span>fits your needs</span>";
  const description =
    acf.tank_section_description ||
    "Review the key specifications of each tank to choose the size that best fits your application.";
  const gallery = getProductGallery(product);
  const rowImage = gallery[0] || "";
  const primaryText = acf.product_primary_cta_text || "Request a quote";
  const primaryHref = getButtonHref(acf.product_primary_cta_link, "#");
  const primaryTarget = getButtonTarget(acf.product_primary_cta_link);
  const rows = getOverviewRows(product, variations);

  if (!title && !description) return null;
  if (rows.length === 0) return null;

  return (
    <section id="find-your-tank" className="bg-white">
      <div className="web-width px-6 pb-0 md:pb-0">
        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1fr] lg:items-start lg:gap-20">
          <div>
            <div className="mb-7 flex items-center gap-2">
              <span className="h-4 w-0.5 bg-[var(--color-yellow)]" />
              <p className="font-body text-[13px] font-medium uppercase leading-5.5 tracking-[0.52px] text-[#1A1A1A]">
                Your ideal tank
              </p>
            </div>

            <h2
              className="max-w-[520px] font-heading text-[34px] font-normal leading-[46px] tracking-[-0.84px] text-black md:text-[48px] md:leading-14 [&_span]:text-[#007DA5]"
              dangerouslySetInnerHTML={{ __html: title }}
            />
          </div>

          <div className="lg:pt-[54px]">
            {description && (
              <div
                className="max-w-[560px] font-body text-[14px] leading-5.5 text-[#1A1A1A]"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}

            {primaryText && (
              <Link
                href={primaryHref}
                target={primaryTarget}
                className="group mt-8 inline-flex h-12 items-center gap-4 rounded-sm bg-[image:var(--mpp-gradient)] py-1.5 pr-1.5 pl-6 font-heading text-[14px] font-normal tracking-[-0.28px] text-white transition-opacity hover:opacity-90"
              >
                <span>{primaryText}</span>
                <Image
                  src="/black-white-arrow.svg"
                  alt=""
                  width={36}
                  height={36}
                  className="h-9 w-9 transition-transform"
                />
              </Link>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[900px] overflow-hidden rounded-md">
            <div className="grid grid-cols-[1.7fr_0.6fr_0.6fr_0.6fr] rounded-md bg-[image:var(--mpp-gradient)] font-body text-[14px] font-normal uppercase leading-[20px] text-white">
              <div className="flex min-h-[54px] items-center justify-center px-5">
                Description and article number
              </div>
              <div className="flex min-h-[54px] items-center justify-center border-l border-white/80 px-5 text-center">
                Dimensions (cm)
                <br />
                L x W x H
              </div>
              <div className="flex min-h-[54px] items-center justify-center border-l border-white/80 px-5 text-center">
                Volume (L)
              </div>
              <div className="flex min-h-[54px] items-center justify-center border-l border-white/80 px-5 text-center">
                Weight (kg)
              </div>
            </div>

            <div className="mt-2 space-y-2">
              {rows.map((row) => {
                const isCurrent = row.index === selectedVariationIndex;

                return (
                  <div
                    key={`${row.article || row.name}-${row.index}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => onVariationChange?.(row.index)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onVariationChange?.(row.index);
                      }
                    }}
                    className={`grid min-h-[94px] cursor-pointer grid-cols-[1.7fr_0.6fr_0.6fr_0.6fr] overflow-hidden rounded-md font-body ${
                      isCurrent
                        ? "bg-[var(--color-accent)] text-white"
                        : "bg-[#E5F2F7] text-black"
                    }`}
                  >
                    <div className="flex items-center gap-5 px-2 py-2">
                      <div className="relative h-[76px] w-[108px] shrink-0 overflow-hidden rounded-sm bg-white">
                        {rowImage && (
                          <Image
                            src={rowImage}
                            alt={row.name}
                            fill
                            sizes="108px"
                            className="object-contain p-2"
                          />
                        )}
                      </div>
                      <div>
                        {isCurrent && (
                          <p className="mb-1 text-[11px] leading-[14px] text-white before:mr-1 before:text-[var(--color-yellow)] before:content-['•']">
                            Current product
                          </p>
                        )}
                        <p className="font-body text-[20px] leading-[26px]">
                          {row.article}
                        </p>
                        <p className="font-body text-[18px] leading-[26px]">
                          {row.name}
                        </p>
                      </div>
                    </div>

                    {[row.dimensions, row.volume, row.weight].map((value, valueIndex) => (
                      <div
                        key={`${row.article}-${valueIndex}`}
                        className="flex items-center justify-center border-l border-white/70 px-5 text-center text-[18px] leading-[26px]"
                      >
                        {value}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
