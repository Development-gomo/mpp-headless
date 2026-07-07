import Image from "next/image";
import Link from "next/link";
import {
  FaEnvelope,
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import AuthorCardSection from "./AuthorCardSection";
import CopyLinkButton from "./CopyLinkButton";

function stripHtml(value = "") {
  return String(value).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function cleanExcerpt(value = "") {
  const excerpt = String(value)
    .replace(/<a\b[^>]*class=(["'])[^"']*more-link[^"']*\1[^>]*>.*?<\/a>/gims, "")
    .replace(/<a\b[^>]*>\s*\[?\s*(?:&hellip;|&#8230;|&#x2026;|…|\.\.\.)\s*\]?\s*<\/a>/gims, "")
    .replace(/<a\b[^>]*>\s*(?:read\s+more|continue\s+reading).*?<\/a>/gims, "")
    .replace(/\s*\[?\s*(?:&hellip;|&#8230;|&#x2026;|…|\.\.\.)\s*\]?\s*(?=<\/p>)/gim, "")
    .replace(/\s*\[?\s*(?:&hellip;|&#8230;|&#x2026;|…|\.\.\.)\s*\]?\s*$/im, "")
    .trim();

  return excerpt
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

function formatDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function formatFullDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getFeaturedImage(post) {
  return (
    post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    post?.featured_image ||
    post?.image ||
    ""
  );
}

function getCategory(post) {
  return post?._embedded?.["wp:term"]?.[0]?.[0]?.name || "News";
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

      toc.push({ id, level: Number(level), label: heading });

      const cleanAttrs = attrs.replace(/\sid=(["']).*?\1/i, "");
      return `<h${level}${cleanAttrs} id="${id}">${headingHtml}</h${level}>`;
    }
  );

  return { html, toc };
}

function getPostUrl(post) {
  return post?.slug ? `/${post.slug}` : "#";
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

function isHidden(value) {
  return value === false || value === "0" || value === 0;
}

function optionValue(options, postAcf, name, fallback) {
  return options?.[name] ?? postAcf?.[name] ?? fallback;
}

function getLinkUrl(link, fallback = "#") {
  if (!link) return fallback;
  if (typeof link === "string") return link || fallback;
  return link.url || fallback;
}

function getLinkTarget(link) {
  if (!link || typeof link === "string") return undefined;
  return link.target || undefined;
}

function RelatedPostCard({ post }) {
  const title = post?.title?.rendered || post?.title || "";
  const excerpt = cleanExcerpt(post?.excerpt?.rendered || post?.excerpt || "");
  const image = getFeaturedImage(post);
  const category = getCategory(post);
  const date = formatDate(post?.date);

  return (
    <Link
      href={getPostUrl(post)}
      className="group flex h-full flex-col overflow-hidden rounded-sm bg-white"
    >
      <div className="flex min-h-[245px] flex-1 flex-col p-6 pb-5">
        <div className="mb-6 flex items-center gap-3">
          <span className="inline-flex h-[22px] items-center rounded-xs bg-[var(--color-accent)] px-[13px] text-[12px] font-normal tracking-[-0.24px] text-white [font-family:var(--font-heading)]">
            {category}
          </span>
          {date && (
            <span className="text-[#1A1A1A] text-[12px] leading-6 font-normal [font-family:var(--font-nunito-sans)]">
              {date}
            </span>
          )}
        </div>

        <h3 className="font-heading mb-5 min-h-[84px] text-[28px] font-medium leading-[36px] tracking-[-0.56px] text-black capitalize [font-family:var(--font-heading)] line-clamp-3"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        {excerpt && (
          <div className="mt-auto text-[16px] leading-6 text-[#1A1A1A] font-normal [font-family:var(--font-nunito-sans)] line-clamp-2"
            dangerouslySetInnerHTML={{ __html: excerpt }}
          />
        )}
      </div>

      <div className="relative h-[210px] overflow-hidden">
        {image && (
          <Image
            src={image}
            alt={title || "Blog image"}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        <Image
          src="/orange-black-arrow.svg"
          alt=""
          width={36}
          height={36}
          className="absolute right-5 bottom-5 h-auto w-9 object-contain transition-transform"
        />
      </div>
    </Link>
  );
}

function normalizeShareIcons(value) {
  if (Array.isArray(value) && value.length > 0) {
    return value.map((item) => String(item).toLowerCase());
  }
  if (typeof value === "string" && value) return [value.toLowerCase()];
  return ["facebook", "linkedin", "email"];
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
      className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-yellow)] text-black transition-opacity hover:opacity-85"
      aria-label={`Share on ${type}`}
    >
      {iconByType[type]}
    </a>
  );
}

export default function SinglePostTemplate({
  post,
  relatedPosts = [],
  blogSettings = {},
  authorCards = [],
}) {
  const postAcf = post?.acf || {};
  const title = post?.title?.rendered || "";
  const content = post?.content?.rendered || "";
  const excerpt =
    cleanExcerpt(
      optionValue(blogSettings, postAcf, "single_post_intro_text") ||
        optionValue(blogSettings, postAcf, "blog_intro_text") ||
        post?.excerpt?.rendered ||
        ""
    );
  const featuredImage =
    getAcfImageUrl(optionValue(blogSettings, postAcf, "single_post_featured_image")) ||
    getFeaturedImage(post);
  const category = getCategory(post);
  const date = formatDate(post?.date);
  const fullDate = formatFullDate(post?.date);
  const readingTime = getReadingTime(content || excerpt);
  const { html, toc } = withHeadingAnchors(content);
  const shareUrl = `${process.env.SITE_URL || ""}${getPostUrl(post)}`;
  const tocTitle =
    optionValue(blogSettings, postAcf, "table_of_contents_heading") ||
    optionValue(blogSettings, postAcf, "table_of_content_heading") ||
    "Table of contents";
  const showToc = !isHidden(
    optionValue(blogSettings, postAcf, "show_table_of_contents", true)
  );
  const showShareBox = !isHidden(
    optionValue(blogSettings, postAcf, "show_share_box", true)
  );
  const shareBoxText =
    optionValue(blogSettings, postAcf, "share_box_text") ||
    "Like what you see? Share this article";
  const shareIcons = normalizeShareIcons(
    optionValue(blogSettings, postAcf, "share_icons")
  );
  const relatedHeading =
    optionValue(blogSettings, postAcf, "related_posts_heading") ||
    "Don't miss out on these";
  const showRelatedPosts = !isHidden(
    optionValue(blogSettings, postAcf, "show_related_posts", true)
  );
  const ctaTitle =
    optionValue(blogSettings, postAcf, "sidebar_cta_title") ||
    "Need help with your next project?";
  const ctaText =
    optionValue(blogSettings, postAcf, "sidebar_cta_text") ||
    "Talk to our team about the right fuel solution for your operation.";
  const ctaButtonText =
    optionValue(blogSettings, postAcf, "sidebar_cta_button_text") ||
    "Contact us";
  const ctaButtonLink = optionValue(
    blogSettings,
    postAcf,
    "sidebar_cta_button_link"
  );
  const ctaBackgroundColor =
    optionValue(blogSettings, postAcf, "sidebar_cta_background_color") ||
    "#DDE6F3";
  const showSidebarCta = !isHidden(
    optionValue(blogSettings, postAcf, "show_sidebar_cta", true)
  );
  const related = relatedPosts
    .filter((item) => item?.slug && item.slug !== post?.slug)
    .slice(0, 3);
  const selectedAuthor =
    postAcf.select_author ||
    postAcf.select_author_card ||
    postAcf.author_card ||
    postAcf.author_section;

  return (
    <>
      <section className="bg-white px-6 pb-14 pt-37.5 md:pt-42.5">
        <div className="web-width">
          <p className="mb-6 text-[13px] font-medium uppercase leading-5.5 tracking-[2px] text-[#1A1A1A]">
            {category} | Reading time: {readingTime} minutes
            {fullDate ? ` | ${fullDate}` : ""}
          </p>
          <h1
            className="font-heading max-w-300 text-[42px] font-medium leading-[50px] tracking-[-0.84px] text-[#071838] md:text-[56px] md:leading-[64px]"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          {excerpt && (
            <div
              className="mt-7 max-w-300 text-[16px] leading-6 text-[#1A1A1A]"
              dangerouslySetInnerHTML={{ __html: excerpt }}
            />
          )}
        </div>
      </section>

      {featuredImage && (
        <div className="bg-white px-6">
          <div className="web-width">
            <div className="relative min-h-[320px] overflow-hidden rounded-[10px] md:min-h-[520px]">
              <Image
                src={featuredImage}
                alt={stripHtml(title) || "Post image"}
                fill
                priority
                sizes="(min-width: 1280px) 1250px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      )}

      <section className="bg-white px-6 py-14 md:py-20">
        <div className="web-width grid grid-cols-1 gap-12 lg:grid-cols-[300px_1fr] lg:gap-20">
          <aside className="lg:sticky lg:top-32 lg:self-start">
            {showToc && toc.length > 0 && (
              <div>
                <h2 className="font-heading mb-5 text-[20px] font-bold leading-[28px] text-black">
                  {tocTitle}
                </h2>
                <nav className="space-y-3">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block text-[14px] leading-[20px] text-[var(--color-accent)] transition-opacity hover:opacity-70"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {showSidebarCta && (
            <div
              className="mt-10 hidden rounded-sm p-7 lg:block"
              style={{ backgroundColor: ctaBackgroundColor }}
            >
              <h3 className="font-heading text-[22px] font-bold leading-[30px] text-white">
                {ctaTitle}
              </h3>
              {ctaText && (
                <div
                  className="mt-4 text-[14px] leading-5.5 text-white"
                  dangerouslySetInnerHTML={{ __html: ctaText }}
                />
              )}
              <Link
                href={getLinkUrl(ctaButtonLink, "/contact")}
                target={getLinkTarget(ctaButtonLink)}
                className="mt-6 inline-flex items-center gap-4 rounded-sm bg-[var(--color-yellow)] py-1.5 pr-1.5 pl-6 text-[14px] tracking-[-0.28px] text-black transition-opacity hover:opacity-90"
              >
                <span>{ctaButtonText}</span>
                <Image
                  src="/black-white-arrow.svg"
                  alt=""
                  width={36}
                  height={36}
                  className="h-auto w-9"
                />
              </Link>
            </div>
            )}
          </aside>

          <article
            className="max-w-[870px] text-[16px] leading-[26px] text-black [&_a]:text-[var(--color-accent)] [&_blockquote]:relative [&_blockquote]:my-10 [&_blockquote]:overflow-hidden [&_blockquote]:rounded-md [&_blockquote]:border-l-[6px] [&_blockquote]:border-[var(--color-accent)] [&_blockquote]:bg-[#EAF1FA] [&_blockquote]:py-8 [&_blockquote]:pl-7 [&_blockquote]:pr-20 [&_blockquote]:text-[16px] [&_blockquote]:italic [&_blockquote]:font-normal [&_blockquote]:leading-[28px] [&_blockquote]:text-[#071838] [&_blockquote]:shadow-[0_18px_45px_rgba(7,24,56,0.08)] [&_blockquote:before]:pointer-events-none [&_blockquote:before]:absolute [&_blockquote:before]:right-6 [&_blockquote:before]:top-5 [&_blockquote:before]:content-['\201C'] [&_blockquote:before]:text-[70px] [&_blockquote:before]:font-bold [&_blockquote:before]:leading-none [&_blockquote:before]:text-[rgba(0,112,158,0.14)] [&_blockquote_cite]:mt-5 [&_blockquote_cite]:block [&_blockquote_cite]:text-[14px] [&_blockquote_cite]:font-bold [&_blockquote_cite]:not-italic [&_blockquote_cite]:leading-5.5 [&_blockquote_cite]:text-[var(--color-accent)] [&_blockquote_p:last-child]:mb-0 [&_h2]:mb-5 [&_h2]:mt-10 [&_h2]:font-heading [&_h3]:font-heading [&_h2]:text-[34px] [&_h2]:font-normal [&_h2]:leading-[42px] [&_h3]:mb-4 [&_h3]:mt-8 [&_h3]:text-[26px] [&_h3]:font-normal [&_h3]:leading-[34px] [&_li]:mb-2 [&_p]:mb-5 [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </section>

      <AuthorCardSection
        selectedAuthor={selectedAuthor}
        authorCards={authorCards}
      />

      {(showShareBox || showSidebarCta) && (
      <section className="bg-white px-6 pb-16">
        <div className="web-width">
          {showShareBox && (
            <div className="ml-auto flex max-w-[870px] flex-col gap-4 rounded-sm bg-[#EAF1FA] px-6 py-5 md:flex-row md:items-center md:justify-between">
              <p className="text-[14px] font-bold leading-5.5 text-black">
                {shareBoxText}
              </p>
              <div className="flex gap-3">
                {shareIcons.map((type) => (
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
          )}
          {showSidebarCta && (
            <div
              className="mt-8 rounded-sm p-7 lg:hidden"
              style={{ backgroundColor: ctaBackgroundColor }}
            >
              <h3 className="font-heading text-[22px] font-bold leading-[30px] text-white">
                {ctaTitle}
              </h3>
              {ctaText && (
                <div
                  className="mt-4 text-[14px] leading-5.5 text-white"
                  dangerouslySetInnerHTML={{ __html: ctaText }}
                />
              )}
              <Link
                href={getLinkUrl(ctaButtonLink, "/contact")}
                target={getLinkTarget(ctaButtonLink)}
                className="mt-6 inline-flex items-center gap-4 rounded-sm bg-[var(--color-yellow)] py-1.5 pr-1.5 pl-6 text-[14px] tracking-[-0.28px] text-black transition-opacity hover:opacity-90"
              >
                <span>{ctaButtonText}</span>
                <Image
                  src="/black-white-arrow.svg"
                  alt=""
                  width={36}
                  height={36}
                  className="h-auto w-9"
                />
              </Link>
            </div>
          )}
        </div>
      </section>
      )}

      {showRelatedPosts && related.length > 0 && (
        <section className="relative bg-[#F1F1F3]">
          <div className="web-width px-6 py-20">
            <h2 className="font-heading mb-10 text-black text-[52px] leading-[1.05] font-normal tracking-[-1px]">
              {relatedHeading}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((item) => (
                <RelatedPostCard key={item.id || item.slug} post={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
