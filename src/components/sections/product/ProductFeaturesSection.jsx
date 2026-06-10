"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useQuoteCart } from "@/components/quote/QuoteCartProvider";
import { DEFAULT_LANGUAGE, localizePath } from "@/lib/i18n";
import { getProductGallery, getRendered, stripHtml } from "./productUtils";

const FILTERS = ["All", "Lid", "Flowmeter", "Elevation skids", "Refueling hose", "Hose holder"];

const STATIC_ACCESSORIES = [
  {
    category: "Hose items",
    title: "Pump Package For PTA",
    meta: "PPA12-36 | 12V for 36L/min",
    filter: "Refueling hose",
    active: true,
  },
  {
    category: "Additional connections",
    title: "Refueling hose by meter",
    meta: "101183 | 3/4\"",
    filter: "Refueling hose",
  },
  {
    category: "Lifting, tools",
    title: "Elevation Skids",
    meta: "103768 | 150 L",
    filter: "Elevation skids",
  },
  {
    category: "Lifting, tools",
    title: "Flowmeter",
    meta: "100351 | K24 Diesel",
    filter: "Flowmeter",
  },
  {
    category: "Lids",
    title: "Lid",
    meta: "103705 | PTA15",
    filter: "Lid",
  },
  {
    category: "Additional connections",
    title: "Hose Reel",
    meta: "102333 | 8m 1\"",
    filter: "Hose holder",
  },
];

function AccessoryCard({ accessory, image, onAdd }) {
  return (
    <article
      className={`relative grid min-h-[114px] grid-cols-[120px_1fr] gap-4 overflow-hidden rounded-[8px] p-2 ${
        accessory.active
          ? "bg-[var(--color-accent)] text-white"
          : "bg-[#F3F4FB] text-black"
      }`}
    >
      <div className="relative overflow-hidden rounded-[6px] bg-white">
        {image && (
          <Image
            src={image}
            alt={accessory.title}
            fill
            sizes="120px"
            className="object-contain p-2"
          />
        )}
      </div>

      <div className="flex min-w-0 flex-col justify-center py-2 pr-2">
        <p
          className={`mb-1 font-body text-[10px] font-bold uppercase leading-[14px] ${
            accessory.active ? "text-white/80" : "text-[#007DA5]"
          }`}
        >
          {accessory.category}
        </p>
        <h3 className="font-heading text-[20px] font-normal leading-[26px] tracking-[-0.4px]">
          {accessory.title}
        </h3>
        <p className="mt-1 font-body text-[14px] leading-[20px]">
          {accessory.meta}
        </p>
        <button
          type="button"
          onClick={onAdd}
          className={`mt-3 w-fit border-b font-heading text-[13px] font-normal uppercase leading-[18px] tracking-[-0.26px] ${
            accessory.active
              ? "border-[var(--color-yellow)] text-[var(--color-yellow)]"
              : "border-[var(--color-yellow)] text-[#D79B00]"
          }`}
        >
          Add to cart +
        </button>
      </div>

      {accessory.active && (
        <span className="absolute right-3 top-3 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[var(--color-yellow)] text-[12px] font-bold leading-none text-white">
          ✓
        </span>
      )}
    </article>
  );
}

export default function ProductFeaturesSection({ product, language = DEFAULT_LANGUAGE }) {
  const { addAccessory } = useQuoteCart();
  const router = useRouter();
  const acf = product?.acf || {};
  const [activeFilter, setActiveFilter] = useState("All");
  const gallery = getProductGallery(product);
  const productTitle =
    stripHtml(getRendered(product?.title)) || product?.slug || "Product";
  const title =
    acf.accessories_section_title ||
    "Select <span>accessories</span> for your tank";
  const description =
    acf.accessories_section_description ||
    "Select the accessories you need and add them to your configuration. You can review and adjust quantities anytime in the quote panel.";

  const accessories = useMemo(() => {
    if (activeFilter === "All") return STATIC_ACCESSORIES;
    return STATIC_ACCESSORIES.filter((item) => item.filter === activeFilter);
  }, [activeFilter]);

  const productPayload = {
    productId: product?.id,
    slug: product?.slug,
    name: productTitle,
    sku: product?.sku || acf.article_number || acf.product_article_number,
    image: gallery[0],
  };

  return (
    <section id="accessories" className="bg-white text-black">
      <div className="web-width px-6 py-20 md:py-[120px]">
        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1fr] lg:items-start lg:gap-20">
          <div>
            <div className="mb-7 flex items-center gap-2">
              <span className="h-[16px] w-[2px] bg-[var(--color-yellow)]" />
              <p className="font-body text-[13px] font-medium uppercase leading-[22px] tracking-[0.52px] text-[#1A1A1A]">
                Accessories
              </p>
            </div>
            <h2
              className="max-w-[560px] font-heading text-[42px] font-normal leading-[50px] tracking-[-0.84px] text-black md:text-[48px] md:leading-[56px] [&_span]:text-[#007DA5]"
              dangerouslySetInnerHTML={{ __html: title }}
            />
          </div>

          {description && (
            <div
              className="max-w-[600px] font-body text-[14px] leading-[22px] text-[#1A1A1A] lg:pt-[54px]"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`h-[40px] min-w-[66px] rounded-sm border px-5 font-body text-[13px] leading-[18px] transition-colors ${
                activeFilter === filter
                  ? "border-[var(--color-yellow)] bg-[var(--color-yellow)] text-black"
                  : "border-[var(--color-yellow)] bg-white text-black hover:bg-[var(--color-yellow)]/10"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {accessories.map((accessory, index) => {
            const image = gallery[index % Math.max(gallery.length, 1)] || gallery[0];

            return (
              <AccessoryCard
                key={`${accessory.title}-${index}`}
                accessory={accessory}
                image={image}
                onAdd={() =>
                  {
                    addAccessory(productPayload, {
                      ...accessory,
                      image,
                    });
                    router.push(localizePath("/rfq", language));
                  }
                }
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
