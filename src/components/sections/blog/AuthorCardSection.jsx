import Image from "next/image";
import {
  FaEnvelope,
  FaFacebookF,
  FaGlobe,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

function stripHtml(value = "") {
  return String(value).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
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

function getAuthorImage(author) {
  return (
    author?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    author?.featured_image ||
    author?.featured_image_url ||
    getAcfImageUrl(author?.acf?.image) ||
    ""
  );
}

function normalizeSocialLinks(value) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => ({
      name: item?.name || item?.label || item?.title || "",
      url: item?.url || item?.link || "",
    }))
    .filter((item) => item.name && item.url);
}

function getSelectedAuthorId(selectedAuthor) {
  if (!selectedAuthor) return null;
  if (typeof selectedAuthor === "number" || typeof selectedAuthor === "string") {
    return String(selectedAuthor);
  }

  return String(selectedAuthor.ID || selectedAuthor.id || "");
}

function getSelectedAuthor(selectedAuthor, authorCards = []) {
  const selectedId = getSelectedAuthorId(selectedAuthor);
  if (!selectedId) return null;

  return (
    authorCards.find((author) => String(author?.id) === selectedId) ||
    selectedAuthor
  );
}

function getTitle(author) {
  return (
    author?.title?.rendered ||
    author?.title ||
    author?.post_title ||
    ""
  );
}

function getSocialIcon(name = "") {
  const key = name.toLowerCase();

  if (key.includes("linkedin")) return <FaLinkedinIn aria-hidden="true" />;
  if (key.includes("facebook")) return <FaFacebookF aria-hidden="true" />;
  if (key.includes("twitter") || key === "x") return <FaXTwitter aria-hidden="true" />;
  if (key.includes("instagram")) return <FaInstagram aria-hidden="true" />;
  if (key.includes("email") || key.includes("mail")) return <FaEnvelope aria-hidden="true" />;

  return <FaGlobe aria-hidden="true" />;
}

export default function AuthorCardSection({
  selectedAuthor,
  authorCards = [],
}) {
  const author = getSelectedAuthor(selectedAuthor, authorCards);
  if (!author) return null;

  const acf = author?.acf || {};
  const title = getTitle(author);
  const image = getAuthorImage(author);
  const role = acf?.role_position || "";
  const description = acf?.description || "";
  const socialLinks = normalizeSocialLinks(acf?.social_links);

  return (
    <section className="bg-white px-6 pb-8">
      <div className="web-width">
        <article className="ml-auto grid max-w-[870px] gap-6 rounded-sm bg-[#00709e] p-5 md:grid-cols-[140px_1fr] md:p-6">
          {image && (
            <div className="relative h-[140px] w-[140px] overflow-hidden rounded-sm bg-white">
              <Image
                src={image}
                alt={stripHtml(title) || "Author"}
                fill
                sizes="140px"
                className="object-cover"
              />
            </div>
          )}

          <div className="flex flex-col justify-center">
            {title && (
              <h2
                className="text-[28px] font-medium leading-[34px] tracking-[-0.56px] text-white [font-family:var(--font-heading)]"
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}

            {role && (
              <p className="mt-2 text-[13px] font-medium uppercase leading-[20px] tracking-[0.52px] text-white/75 [font-family:var(--font-nunito-sans)]">
                {role}
              </p>
            )}

            {description && (
              <div
                className="mt-4 text-[15px] font-normal leading-6 text-white/90 [font-family:var(--font-nunito-sans)]"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}

            {socialLinks.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-3">
                {socialLinks.map((item) => (
                  <a
                    key={`${item.name}-${item.url}`}
                    href={item.url}
                    target="_blank"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[14px] text-[#00709e] transition-opacity hover:opacity-80"
                    aria-label={item.name}
                  >
                    {getSocialIcon(item.name)}
                  </a>
                ))}
              </div>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
