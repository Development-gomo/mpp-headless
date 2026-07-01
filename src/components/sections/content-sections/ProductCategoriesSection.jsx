import Image from "next/image";
import Link from "next/link";
import { DEFAULT_LANGUAGE, localizePath } from "@/lib/i18n";

function getCategoryImage(cat) {
  const image =
    cat?.acf?.category_image ||
    cat?.category_image ||
    cat?.image ||
    cat?.acf?.image ||
    cat?.acf?.thumbnail;

  if (!image || typeof image === "number") return "";
  if (typeof image === "string") return image;

  return (
    image.url ||
    image.src ||
    image.source_url ||
    image.sizes?.large ||
    image.sizes?.medium_large ||
    image.sizes?.full ||
    image.media_details?.sizes?.large?.source_url ||
    image.media_details?.sizes?.medium_large?.source_url ||
    image.media_details?.sizes?.full?.source_url ||
    ""
  );
}

function getCategoryLink(cat, language = DEFAULT_LANGUAGE) {
  if (cat?.slug) return localizePath(`/product-category/${cat.slug}`, language);

  const categoryPath = cat?.link?.match(/\/product-category\/([^/?#]+)\/?/i)?.[1];

  return categoryPath
    ? localizePath(`/product-category/${categoryPath}`, language)
    : "#";
}

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") return Object.values(value);
  return [];
}

export default function ProductCategoriesSection({
  data,
  categoriesWithImages = [],
  language = DEFAULT_LANGUAGE,
}) {
  if (!data) return null;

  const {
    text_above_title,
    hero_title,
    hero_description,
    button_row,
    select_product_categories,
    number_of_categories_to_show = 2,
    background_color,
    custom_class,
    custom_id,
  } = data;

  const buttonRow = toArray(button_row);
  const productCategories = toArray(select_product_categories);
  const categoryImageItems = toArray(categoriesWithImages);

  const columnCount = Number(number_of_categories_to_show) || 2;

  const gridCols = {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
  };

  const mergedCategories = productCategories
    .filter((cat) => Number(cat?.term_id || cat?.id) !== 15)
    .map((cat) => {
      const catId = Number(cat?.term_id || cat?.id);

      const matched = categoryImageItems.find(
        (item) => Number(item?.term_id || item?.id) === catId
      );

      return {
        ...cat,
        ...matched,
        acf: matched?.acf || cat?.acf || {},
        link: getCategoryLink(matched || cat, language),
      };
    });

  return (
    <section
      id={custom_id || undefined}
      className={`relative bg-white ${custom_class || ""}`}
      style={background_color ? { backgroundColor: background_color } : {}}
    >
      <div className="web-width px-6 md:px-0 py-20 md:py-[120px]">
        {/* Header */}
        <div className="mb-14 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-20">
          <div>
            {text_above_title && (
              <div className="mb-6 flex items-center gap-2">
                <span className="h-4 w-0.5 bg-[var(--color-yellow)]" />

                <p className="text-[#1A1A1A] text-[14px] leading-6 font-medium tracking-[0.56px] uppercase font-body">
                  {text_above_title}
                </p>
              </div>
            )}

            {hero_title && (
              <h2
                className="font-heading max-w-[560px] text-[36px] font-normal leading-11 tracking-[-0.72px] text-black md:text-[48px] md:leading-14 md:tracking-[-0.96px]"
                dangerouslySetInnerHTML={{ __html: hero_title }}
              />
            )}
          </div>

          <div className="flex flex-col items-start lg:pt-[54px]">
            {hero_description && (
              <div
                className="max-w-[628px] text-[#1A1A1A] text-[16px] leading-6 font-normal font-body"
                dangerouslySetInnerHTML={{ __html: hero_description }}
              />
            )}

            {buttonRow.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-4">
                {buttonRow.map((btn, i) => (
                  <Link
                    key={i}
                    href={btn.button_link || "#"}
                    target={btn.button_target || undefined}
                    className={
                      i === 0
                        ? "group inline-flex items-center gap-4 rounded-sm bg-[#445641] py-1.5 pr-1.5 pl-6 text-white font-heading text-[14px] font-normal tracking-[-0.28px] hover:opacity-90 transition-opacity"
                        : "group inline-flex items-center gap-4 rounded-sm bg-[image:var(--mpp-gradient)] py-1.5 pr-1.5 pl-6 text-white font-heading text-[14px] font-normal tracking-[-0.28px] hover:opacity-90 transition-opacity"
                    }
                  >
                    <span>{btn.button_label}</span>

                    <Image
                      src="/black-white-arrow.svg"
                      alt=""
                      width={40}
                      height={40}
                      className="h-auto w-[40px] object-contain transition-transform"
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Categories */}
        {mergedCategories.length > 0 && (
          <>
            {mergedCategories.length === 1 ? (
              <div className="relative h-[360px] overflow-hidden rounded-lg bg-black md:h-[526px]">
                {(() => {
                  const cat = mergedCategories[0];
                  const title = cat?.name || cat?.title;
                  const image = getCategoryImage(cat);

                  return (
                    <>
                      {image && (
                        <Image
                          src={image}
                          alt={title || "Product category"}
                          fill
                          sizes="100vw"
                          className="object-cover"
                        />
                      )}
                    </>
                  );
                })()}
              </div>
            ) : (
              <div
                className={`grid grid-cols-1 ${
                  gridCols[columnCount] || "lg:grid-cols-2"
                } gap-6`}
              >
                {mergedCategories.map((cat, index) => {
                  const title = cat?.name || cat?.title;
                  const image = getCategoryImage(cat);

                  return (
                    <Link
                      key={cat?.term_id || cat?.id || index}
                      href={cat?.link || "#"}
                      className="group relative h-[360px] overflow-hidden rounded-lg bg-black md:h-[405px]"
                    >
                      {image && (
                        <Image
                          src={image}
                          alt={title || "Product category"}
                          fill
                          sizes="(min-width: 1024px) 50vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}

                      <div className="absolute inset-0 bg-black/10" />

                      <div className="absolute inset-x-2 bottom-2 z-10 rounded-sm bg-[rgba(58,58,58,0.45)] px-6 py-7 backdrop-blur-[6px] md:inset-x-2 md:bottom-2">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                          <h3 className="text-white text-[24px] leading-[32px] font-medium tracking-[-0.48px] font-heading">
                            {title}
                          </h3>

                          <span className="inline-flex w-fit items-center gap-4 rounded-sm bg-[image:var(--mpp-gradient)] py-1.5 pr-1.5 pl-6 text-white font-heading text-[14px] font-normal tracking-[-0.28px]">
                            <span>View products</span>

                            <Image
                              src="/black-white-arrow.svg"
                              alt=""
                              width={40}
                              height={40}
                              className="h-auto w-[40px] object-contain transition-transform"
                            />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
