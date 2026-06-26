import Image from "next/image";
import Link from "next/link";

export default function LatestCaseStudiesSection({ data, caseStudies = [] }) {
  if (!data) return null;

  const {
    text_above_title,
    hero_title,
    hero_description,
    button_row = [],
    background_color,
    custom_class,
    custom_id,
  } = data;

  const latestCaseStudies = caseStudies.slice(0, 2);

  return (
    <section
      id={custom_id || undefined}
      className={`relative bg-white ${custom_class || ""}`}
      style={background_color ? { backgroundColor: background_color } : {}}
    >
      <div className="web-width px-6 md:px-0 py-20">
        <div className="mb-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[620px]">
            {text_above_title && (
              <div className="mb-5 flex items-center gap-2">
                <span className="h-[10px] w-[2px] bg-[var(--color-yellow)]" />
                <p className="text-[#1A1A1A] text-[14px] leading-6 font-medium tracking-[0.56px] uppercase font-body">
                  {text_above_title}
                </p>
              </div>
            )}

            {hero_title && (
              <h2
                className="font-heading text-[36px] font-normal leading-[44px] tracking-[-0.72px] text-black md:text-[48px] md:leading-[56px] md:tracking-[-0.96px]"
                dangerouslySetInnerHTML={{ __html: hero_title }}
              />
            )}

            {hero_description && (
              <div
                className="mt-5 max-w-xl text-base text-black/70"
                dangerouslySetInnerHTML={{ __html: hero_description }}
              />
            )}
          </div>

          {button_row?.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {button_row.map((btn, i) => (
                <Link
                  key={i}
                  href={btn.button_link || "#"}
                  className="group inline-flex items-center gap-4 rounded-sm bg-[image:var(--mpp-gradient)] py-1.5 pr-1.5 pl-6 text-white font-heading text-[14px] font-normal tracking-[-0.28px] hover:opacity-90 transition-opacity"
                >
                  <span>{btn.button_label || "View all cases"}</span>

                  <Image
                    src="/black-white-arrow.svg"
                    alt=""
                    width={36}
                    height={36}
                    className="h-auto w-9 object-contain transition-transform"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>

        {latestCaseStudies.length > 0 && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {latestCaseStudies.map((item, index) => {
              const title = item?.title?.rendered || item?.title || "";
              const link = item?.slug ? `/${item.slug}` : item?.link || "#";

              const image =
                item?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                item?.featured_image ||
                item?.acf?.image?.url ||
                item?.image ||
                "";

              const logo =
                item?.acf?.logo?.url ||
                item?.acf?.client_logo?.url ||
                "";

              const feature1 = item?.acf?.feature_1;
              const feature2 = item?.acf?.feature_2;
                
              return (
                <div
                  key={item?.id || index}
                  className="grid overflow-hidden rounded-sm bg-[var(--color-accent)] p-6 md:grid-cols-[1fr_220px] gap-6"
                >
                  <div className="flex flex-col justify-between">
                    <div>
                      {title && (
                        <h3
                          className="mb-6 text-white text-[28px] font-medium leading-[34px] tracking-[-0.56px] [font-family:var(--font-heading)]"
                          dangerouslySetInnerHTML={{ __html: title }}
                        />
                      )}

                      <div className="flex flex-col gap-3">
                        {feature1 && (
                          <span className="inline-flex items-center gap-2 rounded-sm bg-white/10 px-3 py-[6px] text-white text-[12px] font-normal tracking-[-0.24px] font-heading w-fit">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/25">
                              ✓
                            </span>
                            {feature1}
                          </span>
                        )}

                        {feature2 && (
                          <span className="inline-flex items-center gap-2 rounded-sm bg-white/10 px-3 py-[6px] text-white text-[12px] font-normal tracking-[-0.24px] font-heading w-fit">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/25">
                              ✓
                            </span>
                            {feature2}
                          </span>
                        )}
                      </div>
                    </div>

                    <Link
                      href={link}
                      className="group mt-8 inline-flex w-fit items-center gap-4 rounded-sm bg-[var(--color-yellow)] py-1.5 pr-1.5 pl-6 text-black font-heading text-[14px] tracking-[-0.28px]"
                    >
                      <span>Read full case</span>

                      <Image
                            src="/black-white-arrow.svg"
                            alt=""
                            width={36}
                            height={36}
                            className="object-contain transition-transform"
                        />
                    </Link>
                  </div>

                  <div className="relative min-h-[260px] overflow-hidden rounded-sm">
                    {image && (
                      <Image
                        src={image}
                        alt={title || "Case study image"}
                        fill
                        sizes="(min-width: 1024px) 25vw, 100vw"
                        className="object-cover"
                      />
                    )}

                    {logo && (
                      <div className="absolute right-3 top-3 rounded-[3px] bg-white px-3 py-2">
                        <Image
                          src={logo}
                          alt=""
                          width={90}
                          height={40}
                          className="h-auto w-[90px] object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
