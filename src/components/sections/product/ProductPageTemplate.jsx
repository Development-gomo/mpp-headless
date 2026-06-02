import ProductBreadcrumbs from "./ProductBreadcrumbs";
import ProductVariationSections from "./ProductVariationSections";
import ProductFeaturesSection from "./ProductFeaturesSection";
import ProductTestimonialsSection from "./ProductTestimonialsSection";
import ProductDownloadsSection from "./ProductDownloadsSection";
import ProductFaqSection from "./ProductFaqSection";
import ProductRelatedProductsSection from "./ProductRelatedProductsSection";

function ProductAnchorNav() {
  const links = [
    { href: "#technical-data", label: "Technical data" },
    { href: "#find-your-tank", label: "Find your tank" },
    { href: "#accessories", label: "Accessories" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#faqs", label: "FAQs" },
  ];

  return (
    <nav className="sticky top-[72px] z-30 bg-[var(--color-accent)] text-white shadow-sm" aria-label="Product sections">
      <div className="web-width flex gap-8 overflow-x-auto px-6">
        {links.map((link, index) => (
          <a
            key={link.href}
            href={link.href}
            className={`relative shrink-0 py-7 font-body text-[16px] leading-[24px] transition-colors hover:text-white/80 md:text-[20px] ${
              index === 0 ? "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-[var(--color-yellow)]" : ""
            }`}
          >
            {link.label}
          </a>
        ))}
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
  language,
}) {
  return (
    <>
      <ProductBreadcrumbs
        product={product}
        productCategories={productCategories}
        language={language}
      />
      <ProductVariationSections product={product} language={language}>
        <ProductAnchorNav />
      </ProductVariationSections>
      <ProductFeaturesSection product={product} language={language} />
      <ProductTestimonialsSection
        product={product}
        themeOptions={themeOptions}
        language={language}
      />
      <ProductDownloadsSection product={product} />
      <ProductRelatedProductsSection
        currentProduct={product}
        relatedCategory={relatedCategory}
        products={relatedProducts}
        language={language}
      />
      <ProductFaqSection product={product} />
    </>
  );
}
