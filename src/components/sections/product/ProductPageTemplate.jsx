"use client";

import { useEffect, useMemo, useState } from "react";
import ProductBreadcrumbs from "./ProductBreadcrumbs";
import ProductAccessoryOverview from "./ProductAccessoryOverview";
import ProductSpecsSection from "./ProductSpecsSection";
import ProductVariationSections from "./ProductVariationSections";
import ProductFeaturesSection from "./ProductFeaturesSection";
import ProductTestimonialsSection from "./ProductTestimonialsSection";
import ProductDownloadsSection from "./ProductDownloadsSection";
import ProductFaqSection from "./ProductFaqSection";
import ProductRelatedProductsSection from "./ProductRelatedProductsSection";
import ProductCtaSection from "./ProductCtaSection";
import { DEFAULT_LANGUAGE } from "@/lib/i18n";
import { getProductLabels } from "./productLabels";

function getAnchorLinks(labels) {
  return [
    { href: "#technical-data", label: labels.nav.technicalData },
    { href: "#find-your-tank", label: labels.nav.findYourTank },
    { href: "#accessories", label: labels.nav.accessories },
    { href: "#testimonials", label: labels.nav.testimonials },
    { href: "#faqs", label: labels.nav.faqs },
  ];
}

function ProductAnchorNav({ language = DEFAULT_LANGUAGE }) {
  const anchorLinks = useMemo(
    () => getAnchorLinks(getProductLabels(language)),
    [language]
  );
  const [activeHref, setActiveHref] = useState(anchorLinks[0].href);

  useEffect(() => {
    const sectionOffset = 150;

    const updateActiveLink = () => {
      const availableLinks = anchorLinks.filter((link) =>
        document.getElementById(link.href.slice(1))
      );
      const activeLink =
        availableLinks
          .slice()
          .reverse()
          .find((link) => {
            const section = document.getElementById(link.href.slice(1));
            if (!section) return false;

            return section.getBoundingClientRect().top <= sectionOffset;
          }) || availableLinks[0];

      if (activeLink) setActiveHref(activeLink.href);
    };

    updateActiveLink();
    window.addEventListener("scroll", updateActiveLink, { passive: true });
    window.addEventListener("resize", updateActiveLink);

    return () => {
      window.removeEventListener("scroll", updateActiveLink);
      window.removeEventListener("resize", updateActiveLink);
    };
  }, [anchorLinks]);

  return (
    <nav className="sticky top-[72px] z-30 bg-[var(--color-accent)] text-white shadow-sm" aria-label="Product sections">
      <div className="web-width flex gap-8 overflow-x-auto px-6">
        {anchorLinks.map((link) => {
          const isActive = activeHref === link.href;

          return (
            <a
              key={link.href}
              href={link.href}
              aria-current={isActive ? "true" : undefined}
              className={`relative shrink-0 py-7 font-body text-[16px] leading-6 transition-colors hover:text-white/80 md:text-[20px] ${
                isActive
                  ? "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-[var(--color-yellow)]"
                  : ""
              }`}
            >
              {link.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}

export default function ProductPageTemplate({
  product,
  productCategories = [],
  themeOptions = {},
  relatedProducts = [],
  relatedCategory = null,
  accessories = [],
  language,
}) {
  const isMainProduct = product?.acf?.product_type === true;
  const [selectedCapacity, setSelectedCapacity] = useState("");
  const hasAccessories =
    (Array.isArray(accessories) && accessories.length > 0) ||
    (Array.isArray(product?.acf?.accessories) && product.acf.accessories.length > 0);

  if (!isMainProduct) {
    return (
      <>
        <ProductBreadcrumbs
          product={product}
          productCategories={productCategories}
          language={language}
        />
        <ProductAccessoryOverview product={product} language={language} />
        <ProductSpecsSection product={product} language={language} />
      </>
    );
  }

  return (
    <>
      <ProductBreadcrumbs
        product={product}
        productCategories={productCategories}
        language={language}
      />
      <ProductVariationSections
        product={product}
        language={language}
        onCapacityChange={setSelectedCapacity}
        hasAccessories={hasAccessories}
      >
        <ProductAnchorNav language={language} />
      </ProductVariationSections>
      <ProductFeaturesSection
        product={product}
        productCategories={productCategories}
        accessories={accessories}
        language={language}
        selectedCapacity={selectedCapacity}
      />
      <ProductTestimonialsSection
        product={product}
        themeOptions={themeOptions}
        language={language}
      />
      <ProductDownloadsSection product={product} language={language} />
      <ProductRelatedProductsSection
        currentProduct={product}
        relatedCategory={relatedCategory}
        products={relatedProducts}
        language={language}
      />
      <ProductFaqSection product={product} language={language} />
      <ProductCtaSection product={product} language={language} />
    </>
  );
}
