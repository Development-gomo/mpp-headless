import Image from "next/image";
import Link from "next/link";

export default function ProductCategoriesSection({
  data,
  categoriesWithImages = [],
}) {
  if (!data) return null;

  const {
    text_above_title,
    hero_title,
    hero_description,
    button_row = [],
    select_product_categories = [],
    number_of_categories_to_show = 2,
    background_color,
    custom_class,
    custom_id,
  } = data;

  const columnCount = Number(number_of_categories_to_show) || 2;

  const gridCols = {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
  };

  const mergedCategories = select_product_categories
    .filter((cat) => Number(cat?.term_id || cat?.id) !== 15)
    .map((cat) => {
      const catId = Number(cat?.term_id || cat?.id);

      const matched = categoriesWithImages.find(
        (item) => Number(item?.term_id || item?.id) === catId
      );

      return {
        ...cat,
        image:
          matched?.image ||
          matched?.image?.src ||
          matched?.image?.url ||
          cat?.image ||
          "",
        link:
          matched?.link ||
          cat?.link ||
          cat?.url ||
          `/product-category/${cat?.slug || ""}`,
      };
    });

  return (
    <section
      id={custom_id || undefined}
      className={`relative bg-white ${custom_class || ""}`}
      style={background_color ? { backgroundColor: background_color } : {}}
    >
      <div className="web-width px-6 py-20 md:py-[120px]">
        {/* Header */}
        <div className="mb-14 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-20">
          <div>
            {text_above_title && (
              <div className="mb-6 flex items-center gap-2">
                <span className="h-[16px] w-[2px] bg-[var(--color-yellow)]" />

                <p className="text-[#1A1A1A] text-[14px] leading-[24px] font-medium tracking-[0.56px] uppercase font-body">
                  {text_above_title}
                </p>
              </div>
            )}

            {hero_title && (
              <h2
                className="max-w-[560px] text-black text-[42px] leading-[48px] md:text-[52px] md:leading-[60px] font-normal tracking-[-1.04px] font-heading"
                dangerouslySetInnerHTML={{ __html: hero_title }}
              />
            )}
          </div>

          <div className="flex flex-col items-start lg:pt-[54px]">
            {hero_description && (
              <div
                className="max-w-[628px] text-[#1A1A1A] text-[16px] leading-[24px] font-normal font-body"
                dangerouslySetInnerHTML={{ __html: hero_description }}
              />
            )}

            {button_row?.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-4">
                {button_row.map((btn, i) => (
                  <Link
                    key={i}
                    href={btn.button_link || "#"}
                    target={btn.button_target || undefined}
                    className={
                      i === 0
                        ? "group inline-flex items-center gap-4 rounded-[4px] bg-[#445641] py-[6px] pr-[6px] pl-6 text-white font-heading text-[14px] font-normal tracking-[-0.28px] hover:opacity-90 transition-opacity"
                        : "group inline-flex items-center gap-4 rounded-[4px] bg-[image:var(--mpp-gradient)] py-[6px] pr-[6px] pl-6 text-white font-heading text-[14px] font-normal tracking-[-0.28px] hover:opacity-90 transition-opacity"
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
            <div className="relative h-[360px] overflow-hidden rounded-[8px] bg-black md:h-[526px]">
              {(() => {
                const cat = mergedCategories[0];
                const title = cat?.name || cat?.title;

                const image =
                  cat?.category_image?.url ||
                  cat?.category_image?.sizes?.large ||
                  cat?.category_image?.sizes?.full ||
                  (typeof cat?.image === "string"
                    ? cat.image
                    : cat?.image?.src || cat?.image?.url || "");

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

                const image =
                  cat?.category_image?.url ||
                  cat?.category_image?.sizes?.large ||
                  cat?.category_image?.sizes?.full ||
                  (typeof cat?.image === "string"
                    ? cat.image
                    : cat?.image?.src || cat?.image?.url || "");

                return (
                  <Link
                    key={cat?.term_id || cat?.id || index}
                    href={cat?.link || "#"}
                    className="group relative h-[360px] overflow-hidden rounded-[8px] bg-black md:h-[405px]"
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

                    <div className="absolute inset-x-2 bottom-2 z-10 rounded-[4px] bg-[rgba(58,58,58,0.45)] px-6 py-7 backdrop-blur-[6px] md:inset-x-2 md:bottom-2">
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="text-white text-[24px] leading-[32px] font-medium tracking-[-0.48px] font-heading">
                          {title}
                        </h3>

                        <span className="inline-flex w-fit items-center gap-4 rounded-[4px] bg-[image:var(--mpp-gradient)] py-[6px] pr-[6px] pl-6 text-white font-heading text-[14px] font-normal tracking-[-0.28px]">
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