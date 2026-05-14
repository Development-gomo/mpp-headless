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
    select_product_categories = [],
    number_of_categories_to_show = 3,
    background_color,
    custom_class,
    custom_id,
  } = data;

  const columnCount = Number(number_of_categories_to_show) || 3;

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
      <div className="web-width px-6 py-20">
        <div className="max-w-[520px] mb-10">
          {text_above_title && (
            <div className="flex items-center gap-2 mb-5">
              <span className="w-[2px] h-[10px] bg-[var(--color-yellow)]" />
              <p className="text-[#1A1A1A] text-[14px] leading-[24px] font-medium tracking-[0.56px] uppercase font-body">
                  {text_above_title}
              </p>
            </div>
          )}

          {hero_title && (
            <h2
              className="text-black text-[52px] leading-[1.05] font-normal tracking-[-1px]"
              dangerouslySetInnerHTML={{ __html: hero_title }}
            />
          )}

          {hero_description && (
            <div
              className="mt-5 text-black/70 text-base max-w-xl"
              dangerouslySetInnerHTML={{ __html: hero_description }}
            />
          )}
        </div>

        {mergedCategories.length > 0 && (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 ${
              gridCols[columnCount] || "lg:grid-cols-3"
            } gap-6`}
          >
            {mergedCategories.map((cat, index) => {
              const title = cat?.name || cat?.title;
              const image =
                typeof cat?.image === "string"
                  ? cat.image
                  : cat?.image?.src || cat?.image?.url || "";
              
              return (
                <Link
                  key={cat?.term_id || cat?.id || index}
                  href={cat?.link || "#"}
                  className="group relative h-[460px] overflow-hidden rounded-[4px] bg-black"
                >
                  {image && (
                    <Image
                      src={image}
                      alt={title || "Product category"}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-5">
                    <h3 className="text-white text-[19px] leading-[1.15] font-normal max-w-[180px]">
                      {title}
                    </h3>

                    <Image
                      src="/orange-black-arrow.svg"
                      alt=""
                      width={36}
                      height={36}
                      className="w-[36px] h-auto object-contain transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}