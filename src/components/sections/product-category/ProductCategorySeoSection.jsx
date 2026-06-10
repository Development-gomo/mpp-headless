// src/components/ProductCategorySeoSection.jsx

import Image from "next/image";

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

export default function ProductCategorySeoSection({ category }) {
  if (!category?.acf) return null;

  const acf = category.acf;

  const aboveTitle = acf?.seo_text_section_above_title;
  const title = acf?.seo_section_title;
  const content = acf?.seo_section_content;
  const backgroundImage = getImageUrl(acf?.seo_section_background);
  const features = Array.isArray(acf?.seo_section_features)
    ? acf.seo_section_features
    : [];

  if (!title && !content && features.length === 0) return null;

  return (
    <section className="relative overflow-hidden text-white">
      {/* Background image */}
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      )}

      <div className="relative z-10 web-width px-6 py-20 md:py-[120px]">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          {/* Left content */}
          <div className="max-w-[680px]">
            {aboveTitle && (
              <div className="mb-6 flex items-center gap-2">
                <span className="h-[16px] w-[2px] bg-[var(--color-yellow)]" />

                <p className="font-body text-[14px] font-medium uppercase leading-6 tracking-[0.56px] text-white">
                  {aboveTitle}
                </p>
              </div>
            )}

            {title && (
              <h2
                className="max-w-[720px] font-heading text-[42px] font-normal leading-[50px] tracking-[-0.84px] text-white md:text-[56px] md:leading-[64px] md:tracking-[-1.12px]"
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}

            {content && (
              <div
                className="mt-8 max-w-[620px] font-body text-[16px] font-normal leading-6 text-white"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </div>

          {/* Right image space / optional visual balance */}
          <div className="hidden lg:block" />
        </div>

        {/* Features */}
        {features.length > 0 && (
          <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
            {features.map((feature, index) => {
              const number = String(index + 1).padStart(2, "0");

              return (
                <div key={index} className="border-t border-white/20 pt-6">
                  <span className="mb-6 block font-body text-[14px] leading-6 text-white">
                    [{number}]
                  </span>

                  {feature?.feature_title && (
                    <h3 className="mb-3 font-heading text-[24px] font-medium leading-[32px] tracking-[-0.48px] text-white">
                      {feature.feature_title}
                    </h3>
                  )}

                  {feature?.feature_text && (
                    <div
                      className="max-w-[360px] font-body text-[16px] font-normal leading-6 text-white"
                      dangerouslySetInnerHTML={{
                        __html: feature.feature_text,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}