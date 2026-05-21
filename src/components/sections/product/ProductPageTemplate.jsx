import ProductHero from "./ProductHero";
import ProductBreadcrumbs from "./ProductBreadcrumbs";
import ProductSpecsSection from "./ProductSpecsSection";
import ProductOverviewSection from "./ProductOverviewSection";
import ProductFeaturesSection from "./ProductFeaturesSection";
import ProductGallerySection from "./ProductGallerySection";
import ProductDownloadsSection from "./ProductDownloadsSection";
import ProductFaqSection from "./ProductFaqSection";
import ProductCtaSection from "./ProductCtaSection";

function ProductAnchorNav() {
  const links = [
    { href: "#technical-data", label: "Technical data" },
    { href: "#find-your-tank", label: "Find your tank" },
    { href: "#accessories", label: "Accessories" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#faqs", label: "FAQs" },
  ];

  return (
    <nav className="sticky top-0 z-30 bg-[var(--color-accent)] text-white shadow-sm" aria-label="Product sections">
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

export default function ProductPageTemplate({ product, productCategories = [] }) {
  return (
    <>
      <ProductBreadcrumbs
        product={product}
        productCategories={productCategories}
      />
      <ProductHero product={product} />
      <ProductAnchorNav />
      <ProductSpecsSection product={product} />
      <ProductOverviewSection product={product} />
      <ProductFeaturesSection product={product} />
      <ProductGallerySection product={product} />
      <ProductDownloadsSection product={product} />
      <ProductFaqSection product={product} />
      <ProductCtaSection product={product} />
    </>
  );
}
