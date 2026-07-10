import Image from "next/image";
import Link from "next/link";
import { getProductById } from "@/lib/api";
import { DEFAULT_LANGUAGE, localizePath } from "@/lib/i18n";
import {
  getButtonHref,
  getButtonTarget,
  getProductImage,
  getRendered,
  stripHtml,
} from "@/components/sections/product/productUtils";

function getProductId(product) {
  if (typeof product === "number" || typeof product === "string") return product;
  return product?.ID || product?.id || null;
}

function getProductSlug(product) {
  return product?.slug || product?.post_name || "";
}

function getProductTitle(product) {
  return stripHtml(
    getRendered(product?.title) || product?.post_title || product?.name || ""
  );
}

function getProductDescription(product) {
  return stripHtml(
    product?.acf?.short_description ||
      getRendered(product?.excerpt) ||
      product?.short_description ||
      getRendered(product?.content)
  );
}

async function resolveSelectedProducts(selectedProducts, language) {
  const selections = Array.isArray(selectedProducts)
    ? selectedProducts
    : selectedProducts
    ? [selectedProducts]
    : [];

  const products = await Promise.all(
    selections.map(async (selection) => {
      const id = getProductId(selection);
      const fullProduct = id ? await getProductById(id, { language }) : null;
      return fullProduct || (typeof selection === "object" ? selection : null);
    })
  );

  const seen = new Set();

  return products.filter((product) => {
    const identity = getProductId(product) || getProductSlug(product);
    if (!product || !identity || seen.has(String(identity))) return false;
    seen.add(String(identity));
    return true;
  });
}

function getButtonLabel(button) {
  return button?.button_label || button?.button_link?.title || "View products";
}

function ProductCard({ product, language }) {
  const title = getProductTitle(product);
  const description = getProductDescription(product);
  const image = getProductImage(product);
  const slug = getProductSlug(product);
  const href = slug ? localizePath(`/product/${slug}`, language) : "#";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[var(--color-accent)] bg-[var(--color-accent)]">
      <div className="relative flex aspect-[1.38/1] items-center justify-center bg-[#F7F6F2] p-7">
        {image ? (
          <Image
            src={image}
            alt={title || "Product image"}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-7 transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <span className="font-body text-[14px] text-black/45">
            Product image missing
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-7 pb-8 pt-7 text-white md:px-8">
        {title && (
          <h3 className="font-heading text-[28px] font-normal leading-[36px] tracking-[-0.56px] md:text-[30px] md:leading-[38px]">
            {title}
          </h3>
        )}

        {description && (
          <p className="font-body mt-5 line-clamp-2 text-[16px] leading-7 text-white/95">
            {description}
          </p>
        )}

        <Link
          href={href}
          aria-label={`View product: ${title}`}
          className="mt-8 inline-flex w-fit items-center gap-5 rounded-[5px] bg-[var(--color-yellow)] py-1.5 pl-7 pr-1.5 font-heading text-[16px] font-normal tracking-[-0.32px] text-black transition-opacity hover:opacity-90"
        >
          <span>View product</span>
          <span className="flex h-11 w-11 items-center justify-center rounded-[4px] bg-white text-[22px] leading-none transition-transform group-hover:translate-x-0.5">
            {"\u2197"}
          </span>
        </Link>
      </div>
    </article>
  );
}

export default async function ProductSection({
  data,
  language = DEFAULT_LANGUAGE,
}) {
  if (!data) return null;

  const {
    text_above_title,
    hero_title,
    hero_description,
    button_row = [],
    select_products,
    background_color,
    custom_class,
    custom_id,
  } = data;

  const products = await resolveSelectedProducts(select_products, language);
  if (products.length === 0) return null;

  return (
    <section
      id={custom_id || undefined}
      className={`relative bg-white ${custom_class || ""}`}
      style={background_color ? { backgroundColor: background_color } : undefined}
    >
      <div className="web-width px-6 py-20 md:py-[120px]">
        {(text_above_title ||
          hero_title ||
          hero_description ||
          button_row.length > 0) && (
          <div className="mb-14 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-20">
            <div>
              {text_above_title && (
                <div className="mb-6 flex items-center gap-2">
                  <span className="h-4 w-0.5 bg-[var(--color-yellow)]" />
                  <p className="font-body text-[14px] font-medium uppercase leading-6 tracking-[0.56px] text-[#1A1A1A]">
                    {text_above_title}
                  </p>
                </div>
              )}

              {hero_title && (
                <h2
                  className="font-heading max-w-155 text-[34px] font-normal leading-[46px] tracking-[-0.84px] text-black md:text-[48px] md:leading-[58px] md:tracking-[-1.04px]"
                  dangerouslySetInnerHTML={{ __html: hero_title }}
                />
              )}
            </div>

            {(hero_description || button_row.length > 0) && (
              <div className="flex flex-col items-start lg:pt-[54px]">
                {hero_description && (
                  <div
                    className="font-body max-w-[628px] text-[16px] leading-6 text-[#1A1A1A]"
                    dangerouslySetInnerHTML={{ __html: hero_description }}
                  />
                )}

                {button_row.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-4">
                    {button_row.map((button, index) => (
                      <Link
                        key={index}
                        href={getButtonHref(button?.button_link)}
                        target={
                          button?.button_target ||
                          getButtonTarget(button?.button_link)
                        }
                        className="group inline-flex items-center gap-4 rounded-sm bg-[image:var(--mpp-gradient)] py-1.5 pl-6 pr-1.5 font-heading text-[14px] tracking-[-0.28px] text-white transition-opacity hover:opacity-90"
                      >
                        <span>{getButtonLabel(button)}</span>
                        <Image
                          src="/black-white-arrow.svg"
                          alt=""
                          width={40}
                          height={40}
                          className="h-10 w-10 object-contain transition-transform group-hover:translate-x-1"
                        />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={getProductId(product) || getProductSlug(product)}
              product={product}
              language={language}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
