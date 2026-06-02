"use client";

import { useMemo, useState } from "react";
import ProductHero from "./ProductHero";
import ProductSpecsSection from "./ProductSpecsSection";
import ProductOverviewSection from "./ProductOverviewSection";
import { getProductVariations } from "./productUtils";

export default function ProductVariationSections({ product, language, children }) {
  const variations = useMemo(() => getProductVariations(product), [product]);
  const [selectedVariationIndex, setSelectedVariationIndex] = useState(0);
  const selectedVariation = variations[selectedVariationIndex] || null;

  return (
    <>
      <ProductHero
        product={product}
        language={language}
        variations={variations}
        selectedVariation={selectedVariation}
        selectedVariationIndex={selectedVariationIndex}
        onVariationChange={setSelectedVariationIndex}
      />
      {children}
      <ProductSpecsSection
        product={product}
        selectedVariation={selectedVariation}
      />
      <ProductOverviewSection
        product={product}
        variations={variations}
        selectedVariationIndex={selectedVariationIndex}
        onVariationChange={setSelectedVariationIndex}
      />
    </>
  );
}
