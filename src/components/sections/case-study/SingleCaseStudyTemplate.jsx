import Image from "next/image";
import Link from "next/link";
import {
  FaEnvelope,
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import CopyLinkButton from "../blog/CopyLinkButton";
import { DEFAULT_LANGUAGE } from "@/lib/i18n";

const MORE_CASE_STUDIES_LABELS = {
  sv: "Fler kundcase",
  en: "More case studies",
  de: "Weitere Fallstudien",
};

const TABLE_OF_CONTENTS_LABELS = {
  sv: "Innehållsförteckning",
  en: "Table of contents",
  de: "Inhaltsverzeichnis",
};

function stripHtml(value = "") {
  return String(value).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function cleanExcerpt(value = "") {
  return String(value)
    .replace(/<a\b[^>]*class=(["'])[^"']*more-link[^"']*\1[^>]*>.*?<\/a>/gims, "")
    .replace(/<a\b[^>]*>\s*\[?\s*(?:&hellip;|&#8230;|&#x2026;|\.\.\.)\s*\]?\s*<\/a>/gims, "")
    .replace(/\s*\[?\s*(?:&hellip;|&#8230;|&#x2026;|\.\.\.)\s*\]?\s*$/im, "")
    .replace(/<p>\s*<\/p>/gim, "")
    .trim();
}

function slugify(value = "") {
  return stripHtml(value)
    .toLowerCase()
    .replace(/&[a-z]+;/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatFullDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getImageUrl(item) {
  return (
    item?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    item?.featured_image ||
    item?.acf?.case_study_image?.url ||
    item?.acf?.image?.url ||
    item?.image ||
    ""
  );
}

function getAcfImageUrl(image) {
  if (!image) return "";
  if (typeof image === "string") return image;

  return (
    image.url ||
    image.source_url ||
    image.sizes?.full ||
    image.sizes?.large ||
    ""
  );
}

function getProductTitle(product) {
  return (
    product?.title?.rendered ||
    product?.title ||
    product?.post_title ||
    product?.name ||
    ""
  );
}

function getProductImage(product) {
  return (
    product?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    product?.featured_image ||
    product?.featured_image_url ||
    getAcfImageUrl(product?.acf?.product_image) ||
    getAcfImageUrl(product?.acf?.featured_image) ||
    getAcfImageUrl(product?.acf?.image) ||
    product?.yoast_head_json?.og_image?.[0]?.url ||
    ""
  );
}

function getProductLink(product) {
  if (product?.slug) return `/product/${product.slug}`;
  if (product?.post_name) return `/product/${product.post_name}`;
  return "#";
}

function RelatedProductCard({ product }) {
  if (!product || product === false) return null;

  const title = getProductTitle(product);
  const image = getProductImage(product);
  const description = cleanExcerpt(
    product?.acf?.short_description ||
      product?.acf?.product_short_description ||
      product?.excerpt?.rendered ||
      product?.description ||
      ""
  );

  return (
    <div className="overflow-hidden rounded-[10px] border border-black/10 bg-[var(--color-accent)] text-white">
      {image && (
        <Link href={getProductLink(product)} className="group block rounded-t-[10px] bg-[#F7F6F2] p-5">
          <div className="relative mx-auto h-[150px] max-w-[210px] rounded-[10px]">
            <Image
              src={image}
              alt={stripHtml(title) || "Related product"}
              fill
              sizes="300px"
              className="object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </Link>
      )}

      <div className="p-6">
        {title && (
          <h3
            className="text-[24px] font-medium leading-[30px] tracking-[-0.48px] text-white [font-family:var(--font-heading)]"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        )}

        {description && (
          <div
            className="mt-4 line-clamp-2 text-[14px] leading-5.5 text-white/85"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}

        <Link
          href={getProductLink(product)}
          className="group mt-6 inline-flex w-fit items-center gap-4 rounded-sm bg-[var(--color-yellow)] py-1.5 pr-1.5 pl-6 text-black [font-family:var(--font-heading)] text-[14px] tracking-[-0.28px]"
        >
          <span>View product</span>
          <Image
            src="/black-white-arrow.svg"
            alt=""
            width={36}
            height={36}
            className="h-auto w-9 object-contain transition-transform"
          />
        </Link>
      </div>
    </div>
  );
}

function getReadingTime(content = "") {
  const words = stripHtml(content).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

function withHeadingAnchors(content = "") {
  const toc = [];
  const usedIds = new Map();

  const html = content.replace(
    /<h(2)([^>]*)>(.*?)<\/h\1>/gims,
    (match, level, attrs, headingHtml) => {
      const heading = stripHtml(headingHtml);
      if (!heading) return match;

      const baseId = slugify(heading) || `section-${toc.length + 1}`;
      const count = usedIds.get(baseId) || 0;
      usedIds.set(baseId, count + 1);
      const id = count > 0 ? `${baseId}-${count + 1}` : baseId;

      toc.push({ id, label: heading });

      const cleanAttrs = attrs.replace(/\sid=(["']).*?\1/i, "");
      return `<h${level}${cleanAttrs} id="${id}">${headingHtml}</h${level}>`;
    }
  );

  return { html, toc };
}

function ShareIcon({ type, shareUrl, title }) {
  const iconByType = {
    facebook: <FaFacebookF aria-hidden="true" className="h-[13px] w-[13px]" />,
    linkedin: <FaLinkedinIn aria-hidden="true" className="h-[13px] w-[13px]" />,
    twitter: <FaXTwitter aria-hidden="true" className="h-[14px] w-[14px]" />,
    email: <FaEnvelope aria-hidden="true" className="h-[13px] w-[13px]" />,
    whatsapp: <FaWhatsapp aria-hidden="true" className="h-[14px] w-[14px]" />,
  };

  const hrefByType = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(stripHtml(title))}`,
    email: `mailto:?subject=${encodeURIComponent(stripHtml(title))}&body=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${stripHtml(title)} ${shareUrl}`)}`,
  };

  if (!hrefByType[type]) return null;

  return (
    <a
      href={hrefByType[type]}
      target={type === "email" ? undefined : "_blank"}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-accent)] text-white transition-opacity hover:opacity-85"
      aria-label={`Share on ${type}`}
    >
      {iconByType[type]}
    </a>
  );
}

function RelatedCaseStudyCard({ item }) {
  const title = item?.title?.rendered || item?.title || "";
  const excerpt = cleanExcerpt(
    item?.excerpt?.rendered ||
      item?.acf?.case_study_description ||
      item?.acf?.description ||
      ""
  );
  const image = getImageUrl(item);

  return (
    <article className="flex min-h-full flex-col overflow-hidden rounded-sm bg-[var(--color-accent)] text-white">
      <div className="relative min-h-[220px] bg-black/15 md:min-h-[245px]">
        {image ? (
          <Image
            src={image}
            alt={stripHtml(title) || "Case study image"}
            fill
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full min-h-[220px] items-center justify-center bg-white/10 px-6 text-center text-[14px] text-white/70 md:min-h-[245px]">
            Case study image missing
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-7">
        {title && (
          <h3
            className="mb-5 text-[28px] font-medium leading-[36px] tracking-[-0.56px] text-white [font-family:var(--font-heading)]"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        )}

        {excerpt && (
          <div
            className="mb-8 line-clamp-4 text-[16px] font-normal leading-6 text-white [font-family:var(--font-nunito-sans)]"
            dangerouslySetInnerHTML={{ __html: excerpt }}
          />
        )}

        <div className="mt-auto">
          <Link
            href={item?.slug ? `/${item.slug}` : "#"}
            className="group inline-flex w-fit items-center gap-4 rounded-sm bg-[var(--color-yellow)] py-1.5 pr-1.5 pl-6 text-black [font-family:var(--font-heading)] text-[14px] tracking-[-0.28px]"
          >
            <span>Read client case</span>
            <Image
              src="/black-white-arrow.svg"
              alt=""
              width={40}
              height={40}
              className="h-auto w-[40px] object-contain transition-transform"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function SingleCaseStudyTemplate({
  caseStudy,
  relatedCaseStudies = [],
  relatedProduct,
  language = DEFAULT_LANGUAGE,
}) {
  const moreCaseStudiesLabel =
    MORE_CASE_STUDIES_LABELS[language] || MORE_CASE_STUDIES_LABELS.en;
  const tableOfContentsLabel =
    TABLE_OF_CONTENTS_LABELS[language] || TABLE_OF_CONTENTS_LABELS.en;
  const acf = caseStudy?.acf || {};
  const title = caseStudy?.title?.rendered || "";
  const content = caseStudy?.content?.rendered || "";
  const intro = cleanExcerpt(
    acf?.case_study_description ||
      acf?.description ||
      caseStudy?.excerpt?.rendered ||
      ""
  );
  const featuredImage =
    getAcfImageUrl(acf?.single_case_study_featured_image) ||
    getImageUrl(caseStudy);
  const logo = getAcfImageUrl(acf?.logo || acf?.client_logo);
  const fullDate = formatFullDate(caseStudy?.date);
  const readingTime = getReadingTime(content || intro);
  const { html, toc } = withHeadingAnchors(content);
  const shareUrl = `${process.env.SITE_URL || ""}${
    caseStudy?.slug ? `/${caseStudy.slug}` : ""
  }`;
  const related = relatedCaseStudies
    .filter((item) => item?.slug && item.slug !== caseStudy?.slug)
    .slice(0, 3);
  const selectedRelatedProduct = relatedProduct || acf?.related_product;

  return (
    <>
      <section className="bg-white px-6 pb-14 pt-37.5 md:pt-42.5">
        <div className="web-width">
          <p className="mb-6 text-[13px] font-medium uppercase leading-5.5 tracking-[2px] text-[#1A1A1A]">
            Case study | Reading time: {readingTime} minutes
            {fullDate ? ` | ${fullDate}` : ""}
          </p>
          <h1
            className="font-heading max-w-300 text-[36px] font-medium leading-[46px] tracking-[-0.84px] text-[#071838] md:text-[48px] md:leading-[58px]"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          {intro && (
            <div className="mt-6 max-w-300 text-[16px] leading-6 text-[#1A1A1A]" dangerouslySetInnerHTML={{ __html: intro }} />
          )}
        </div>
      </section>

      {featuredImage && (
        <div className="bg-white px-6">
          <div className="web-width">
            <div className="relative min-h-80 overflow-hidden rounded-[10px] md:min-h-130">
              <Image
                src={featuredImage}
                alt={stripHtml(title) || "Case study image"}
                fill
                priority
                sizes="(min-width: 1280px) 1250px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      )}

      <section className="single-case-study bg-white px-6 py-14 md:py-20">
        <div className="web-width grid grid-cols-1 gap-12 lg:grid-cols-[300px_1fr] lg:gap-20">
          <aside className="lg:sticky lg:top-32 lg:self-start">
            {toc.length > 0 && (
              <div>
                <h2 className="mb-5 text-[20px] font-bold leading-7 text-black">
                  {tableOfContentsLabel}
                </h2>
                <nav className="space-y-3">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block text-[14px] leading-5 text-[var(--color-accent)] transition-opacity hover:opacity-70"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {logo && (
              <div className="mt-10 rounded-sm bg-[var(--color-accent)] p-7 text-white">
                {logo && (
                  <div className="w-fit rounded-[3px] bg-white px-4 py-3">
                    <Image
                      src={logo}
                      alt=""
                      width={120}
                      height={56}
                      className="h-auto w-[120px] object-contain"
                    />
                  </div>
                )}
              </div>
            )}

            {selectedRelatedProduct && selectedRelatedProduct !== false && (
              <div className="mt-10 hidden lg:block">
                <h2 className="mb-5 text-[20px] font-bold leading-[28px] text-black">
                  Related product
                </h2>
                <RelatedProductCard product={selectedRelatedProduct} />
              </div>
            )}
          </aside>

          <article
            className="max-w-217.5 text-[16px] leading-6.5 text-black [&_a]:text-[var(--color-accent)] [&_blockquote]:relative [&_blockquote]:my-10 [&_blockquote]:overflow-hidden [&_blockquote]:rounded-md [&_blockquote]:border-l-[6px] [&_blockquote]:border-[var(--color-accent)] [&_blockquote]:bg-[#EAF1FA] [&_blockquote]:py-8 [&_blockquote]:pl-7 [&_blockquote]:pr-20 [&_blockquote]:text-[16px] [&_blockquote]:italic [&_blockquote]:font-normal [&_blockquote]:leading-7 [&_blockquote]:text-[#071838] [&_blockquote]:shadow-[0_18px_45px_rgba(7,24,56,0.08)] [&_blockquote:before]:pointer-events-none [&_blockquote:before]:absolute [&_blockquote:before]:right-6 [&_blockquote:before]:top-5 [&_blockquote:before]:content-['\201C'] [&_blockquote:before]:text-[70px] [&_blockquote:before]:font-bold [&_blockquote:before]:leading-none [&_blockquote:before]:text-[rgba(0,112,158,0.14)] [&_blockquote_cite]:mt-5 [&_blockquote_cite]:block [&_blockquote_cite]:text-[14px] [&_blockquote_cite]:font-bold [&_blockquote_cite]:not-italic [&_blockquote_cite]:leading-5.5 [&_blockquote_cite]:text-[var(--color-accent)] [&_blockquote_p:last-child]:mb-0 [&_h2]:mb-5 [&_h2]:mt-10 [&_h2]:text-[34px] [&_h2]:font-normal [&_h2]:leading-10.5 [&_h3]:mb-4 [&_h3]:mt-8 [&_h3]:text-[26px] [&_h3]:font-bold [&_h3]:leading-8.5 [&_li]:mb-2 [&_p]:mb-5 [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </section>

      <section className="bg-white px-6 pb-16">
        <div className="web-width">
          <div className="ml-auto flex max-w-225 flex-col gap-4 rounded-sm bg-[#EAF1FA] px-6 py-5 md:flex-row md:items-center md:justify-between">
            <p className="text-[14px] font-bold leading-5.5 text-black">
              Like what you see? Share this case study
            </p>
            <div className="flex gap-3">
              {["facebook", "linkedin", "email"].map((type) => (
                <ShareIcon
                  key={type}
                  type={type}
                  shareUrl={shareUrl}
                  title={title}
                />
              ))}
              <CopyLinkButton shareUrl={shareUrl} />
            </div>
          </div>
          {selectedRelatedProduct && selectedRelatedProduct !== false && (
            <div className="mt-8 lg:hidden">
              <h2 className="mb-5 text-[20px] font-bold leading-[28px] text-black">
                Related product
              </h2>
              <RelatedProductCard product={selectedRelatedProduct} />
            </div>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="relative bg-[#F1F1F3]">
          <div className="web-width px-6 py-20">
            <h2 className="font-heading mb-10 text-[48px] font-normal leading-[1.05] tracking-[-1px] text-black">
              {moreCaseStudiesLabel}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <RelatedCaseStudyCard key={item.id || item.slug} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
