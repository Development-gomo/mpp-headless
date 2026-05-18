import Image from "next/image";
import Link from "next/link";

function getImageUrl(image) {
  if (!image) return "";

  if (typeof image === "string") return image;

  return (
    image?.url ||
    image?.sizes?.full ||
    image?.sizes?.large ||
    image?.sizes?.medium_large ||
    ""
  );
}

function getButtonLink(link) {
  if (!link) return "#";
  if (typeof link === "string") return link;

  return link?.url || "#";
}

function getButtonTarget(link) {
  if (!link || typeof link === "string") return undefined;

  return link?.target || undefined;
}

export default function ProductCategoryBanner({ category, categories = [] }) {
  if (!category) return null;

  const acf = category?.acf || {};

  const bannerImage = getImageUrl(acf.banner_image);
  const bannerTitle = acf.banner_title || category.name;
  const bannerText = acf.banner_text || category.description;
  const ctaText = acf.banner_cta_text || "Explore Products";
  const ctaLink = getButtonLink(acf.banner_cta_link);
  const ctaTarget = getButtonTarget(acf.banner_cta_link);

  const mainCategories = categories.filter(
    (cat) =>
      cat?.slug !== "uncategorized" &&
      Number(cat?.term_id || cat?.id) !== 15 &&
      Number(cat?.parent || 0) === 0
  );

  return (
    <section className="relative overflow-hidden bg-black text-white">
      {/* Banner Background */}
      <div className="absolute inset-0">
        {bannerImage && (
          <Image
            src={bannerImage}
            alt={bannerTitle || category.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}

        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,112,158,0.35),rgba(122,30,153,0.25))]" />
      </div>

      {/* Content */}
      <div className="relative z-10 web-width px-6 pt-[170px] pb-[120px] md:pt-[210px] md:pb-[150px]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[60fr_40fr] lg:items-center">
          <div>
            <h1
              className="max-w-[720px] text-white font-heading text-[48px] leading-[56px] tracking-[-0.96px] md:text-[80px] md:leading-[88px] md:tracking-[-1.6px]"
              dangerouslySetInnerHTML={{ __html: bannerTitle }}
            />
          </div>

          <div className="flex flex-col items-start lg:pl-10">
            {bannerText && (
              <div
                className="max-w-[560px] text-white font-body text-[18px] leading-[28px] md:text-[20px]"
                dangerouslySetInnerHTML={{ __html: bannerText }}
              />
            )}

            {ctaText && (
              <Link
                href={ctaLink}
                target={ctaTarget}
                className="group mt-8 inline-flex items-center gap-4 rounded-[4px] bg-[image:var(--mpp-gradient)] py-[6px] pr-[6px] pl-6 text-white font-heading text-[14px] font-normal tracking-[-0.28px] hover:opacity-90 transition-opacity"
              >
                <span>{ctaText}</span>

                <Image
                  src="/black-white-arrow.svg"
                  alt=""
                  width={40}
                  height={40}
                  className="h-auto w-[40px] object-contain transition-transform group-hover:translate-x-1"
                />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Category Tabs */}
      {mainCategories.length > 0 && (
        <div className="sticky top-[104px] z-40 bg-white">
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 ${
              mainCategories.length >= 4
                ? "lg:grid-cols-4"
                : mainCategories.length === 3
                ? "lg:grid-cols-3"
                : mainCategories.length === 2
                ? "lg:grid-cols-2"
                : "lg:grid-cols-1"
            }`}
          >
            {mainCategories.map((cat) => {
              const isActive = cat.slug === category.slug;

              return (
                <Link
                  key={cat.term_id || cat.id}
                  href={cat.link || `/product-category/${cat.slug}`}
                  className={`flex min-h-[72px] items-center justify-center border-r border-[#D9D9D9] px-6 text-center font-heading text-[20px] leading-[28px] tracking-[-0.4px] transition-colors last:border-r-0 ${
                    isActive
                      ? "bg-[var(--color-accent)] text-white shadow-[inset_0_-3px_0_var(--color-yellow)]"
                      : "bg-white text-black hover:bg-[#F3F4FB]"
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}