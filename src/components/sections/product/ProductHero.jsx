import Image from "next/image";
import Link from "next/link";
import {
  getButtonHref,
  getButtonTarget,
  getProductGallery,
  getRendered,
  stripHtml,
} from "./productUtils";

export default function ProductHero({ product }) {
  const acf = product?.acf || {};
  const title = getRendered(product?.title);
  const eyebrow = acf.product_eyebrow || "Fuel tank";
  const intro = getRendered(product?.excerpt);
  const gallery = getProductGallery(product);
  const categories = Array.isArray(product?.categories) ? product.categories : [];
  const capacity = acf.capacity || acf.product_capacity || acf.product_specs?.find?.((item) => /capacity/i.test(item?.spec_label || ""))?.spec_value || "150 Liters";
  const productCode = product?.sku || acf.product_code || acf.article_number || "103768";
  const categoryLabel = categories[0]?.name || "Mobile fuel tanks";
  const primaryText = acf.product_primary_cta_text || "Find a dealer";
  const primaryHref = getButtonHref(acf.product_primary_cta_link, "#");
  const primaryTarget = getButtonTarget(acf.product_primary_cta_link);
  const secondaryText = acf.product_secondary_cta_text || "Download datasheet";
  const secondaryHref = getButtonHref(acf.product_secondary_cta_link, "#downloads");
  const secondaryTarget = getButtonTarget(acf.product_secondary_cta_link);
  const productTitle = stripHtml(title) || "Product";
  const bullets = [
    "Safe for transport and mobile refuelling",
    "Compact footprint for pickup beds",
    "Available with diesel and petrol configurations",
  ];

  return (
    <section className="bg-white text-black">
      <div className="web-width px-6 pb-20 pt-2 md:pb-[120px]">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[600px_1fr] xl:gap-12">
          <div>
            <div className="relative min-h-[300px] overflow-hidden rounded-[8px] border border-[#DDD8CE] bg-white md:min-h-[390px]">
              {gallery[0] ? (
                <Image
                  src={gallery[0]}
                  alt={productTitle}
                  fill
                  priority
                  sizes="(min-width: 1024px) 600px, 100vw"
                  className="object-contain p-8"
                />
              ) : (
                <div className="flex min-h-[300px] items-center justify-center font-body text-[14px] text-black/50 md:min-h-[390px]">
                  Product image missing
                </div>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="mt-4 grid grid-cols-3 gap-4 md:flex">
                {gallery.slice(0, 3).map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className={`relative aspect-square w-full overflow-hidden rounded-[8px] border bg-white md:w-[108px] ${
                      index === 0 ? "border-[var(--color-yellow)]" : "border-[#DDD8CE]"
                    }`}
                  >
                    <Image src={image} alt={`${productTitle} view ${index + 1}`} fill sizes="108px" className="object-contain p-2" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[8px] bg-[rgba(0,112,158,0.1)] p-6 md:p-8">
            {eyebrow && (
              <div className="mb-4 flex items-center gap-2">
                <span className="h-[16px] w-[2px] bg-[var(--color-yellow)]" />
                <p className="font-body text-[14px] font-medium uppercase leading-[24px] tracking-[0.56px] text-[#1A1A1A]">
                  {eyebrow}
                </p>
              </div>
            )}

            <p className="mb-3 font-body text-[14px] leading-[22px] text-[#8C8984]">{categoryLabel}</p>
            <h1
              className="max-w-[600px] font-heading text-[40px] font-normal leading-[48px] tracking-[-0.8px] text-black md:text-[56px] md:leading-[64px]"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            <p className="mt-2 font-body text-[20px] font-semibold leading-[28px] text-[var(--color-accent)]">
              {stripHtml(String(productCode))} {stripHtml(String(capacity)) ? `| ${stripHtml(String(capacity))}` : ""}
            </p>

            <div className="mt-8">
              <p className="mb-3 font-heading text-[20px] leading-[28px] tracking-[-0.4px]">Capacity:</p>
              <div className="flex h-[56px] items-center justify-between rounded-[4px] bg-[var(--color-accent)] px-4 font-body text-[16px] font-bold text-white">
                <span dangerouslySetInnerHTML={{ __html: capacity }} />
                <Image src="/down-arrow.svg" alt="" width={14} height={8} className="brightness-0 invert" />
              </div>
            </div>

            {intro && (
              <div
                className="mt-8 border-t border-black/15 pt-6 font-body text-[16px] leading-[24px] text-[#1A1A1A]"
                dangerouslySetInnerHTML={{ __html: intro }}
              />
            )}

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {bullets.map((bullet) => (
                <div key={bullet} className="flex gap-3 font-body text-[14px] leading-[20px] text-[#1A1A1A]">
                  <span className="mt-1 h-[10px] w-[10px] shrink-0 rounded-full bg-[var(--color-yellow)]" />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              {primaryText && (
                <Link
                  href={primaryHref}
                  target={primaryTarget}
                  className="group inline-flex h-[48px] items-center gap-4 rounded-[4px] bg-[image:var(--mpp-gradient)] py-[6px] pr-[6px] pl-6 font-heading text-[14px] tracking-[-0.28px] text-white transition-opacity hover:opacity-90"
                >
                  <span>{primaryText}</span>
                  <Image src="/black-white-arrow.svg" alt="" width={36} height={36} className="h-[36px] w-[36px] transition-transform group-hover:translate-x-1" />
                </Link>
              )}

              {secondaryText && (
                <Link
                  href={secondaryHref}
                  target={secondaryTarget}
                  className="group inline-flex h-[48px] items-center gap-4 rounded-[4px] bg-[var(--color-yellow)] py-[6px] pr-[6px] pl-6 font-heading text-[14px] tracking-[-0.28px] text-black transition-opacity hover:opacity-90"
                >
                  <span>{secondaryText}</span>
                  <Image src="/black-white-arrow.svg" alt="" width={36} height={36} className="h-[36px] w-[36px] transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
