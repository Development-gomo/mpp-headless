import Image from "next/image";
import Link from "next/link";
import { getThemeOptions } from "@/lib/api";

const DEFAULT_FOOTER = {
  cta: {
    eyebrow: "Get Started",
    heading: "Ready to find the right fuel solution for your operation?",
    buttonText: "Get in touch with us",
    buttonLink: { url: "/contact", target: "" },
  },
  productLinks: [
    { label: "Mobila br\u00e4nsletankar", url: "/product-category/mobila-bransletankar" },
    { label: "Station\u00e4ra br\u00e4nsletankar", url: "/product-category/stationara-bransletankar" },
  ],
  quickLinks: [
    { label: "Services", url: "/services" },
    { label: "Industries", url: "/industries" },
    { label: "About us", url: "/about-us" },
    { label: "Customer cases", url: "/case-study" },
    { label: "News & Blogs", url: "/post" },
  ],
  supportLinks: [
    { label: "FAQ mobile tanks", url: "/faq-mobile-tanks" },
    { label: "FAQ cisterns", url: "/faq-cisterns" },
    { label: "Certifications", url: "/certifications" },
  ],
  contact: {
    address: "Fj\u00e4r\u00e5s industrial road 17, 439 74 Fj\u00e4r\u00e5s, Sweden",
    mapUrl: "https://goo.gl/maps/GiUoAHLm7gjy2Xfm7",
    phone: "+46 300 521 930",
    email: "kontakt@mpp.se",
  },
  socialLinks: [
    { name: "LinkedIn", url: "#", icon: "/linkedin.svg" },
    { name: "Instagram", url: "#", icon: "/instagram.svg" },
    { name: "Facebook", url: "#", icon: "/facebook.svg" },
    { name: "YouTube", url: "#", icon: "/youtube.svg" },
  ],
  legalLinks: [
    { label: "Terms & Conditions", url: "/terms-and-conditions" },
    { label: "Privacy policy", url: "/privacy-policy" },
    { label: "Cookie policy", url: "/cookie-policy" },
  ],
  copyright: "Copyright 2026 \u00a9 MPP. All Rights Reserved.",
};

const SOCIAL_ICON_BY_NAME = {
  linkedin: "/linkedin.svg",
  instagram: "/instagram.svg",
  facebook: "/facebook.svg",
  youtube: "/youtube.svg",
};

function pickFirstObject(candidates = []) {
  return candidates.find((item) => item && typeof item === "object" && !Array.isArray(item)) || {};
}

function resolveThemeOptions(data) {
  return pickFirstObject([
    data?.options?.acf,
    data?.options,
    data?.data?.acf,
    data?.data,
    data?.acf,
    data,
  ]);
}

function normalizeLink(link, fallback = "#") {
  if (!link) return { url: fallback, target: "" };
  if (typeof link === "string") return { url: link || fallback, target: "" };

  return {
    url: link.url || fallback,
    target: link.target || "",
    title: link.title || "",
  };
}

function normalizeList(items, fallback = []) {
  if (!Array.isArray(items) || items.length === 0) return fallback;

  return items
    .map((item) => {
      const link = normalizeLink(item.link || item.url || item.page_link, item.url || "#");
      return {
        label: item.label || item.title || link.title || "",
        url: link.url,
        target: link.target,
      };
    })
    .filter((item) => item.label);
}

function stripHtml(value = "") {
  return String(value).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function resolveFooterData(optionsRoot) {
  const global = optionsRoot?.global || optionsRoot;
  const footer = pickFirstObject([global?.footer, optionsRoot?.footer]);
  const cta = pickFirstObject([footer?.footer_cta, footer?.cta, global?.footer_cta]);
  const contact = pickFirstObject([footer?.contact, global?.contact]);

  const socialSource = footer?.social_links || global?.social_links;
  const socialLinks = Array.isArray(socialSource)
    ? socialSource
        .map((item) => {
          const name = item.name || item.social_media_name || item.label || "";
          const key = name.toLowerCase();
          const link = normalizeLink(item.link || item.social_media_link || item.url);
          const uploadedIcon = item.icon?.url || item.logo?.url || item.icon || item.logo;

          return {
            name,
            url: link.url,
            target: link.target || "_blank",
            icon: uploadedIcon || SOCIAL_ICON_BY_NAME[key] || "",
          };
        })
        .filter((item) => item.name && item.url)
    : DEFAULT_FOOTER.socialLinks;

  return {
    cta: {
      eyebrow: cta.cta_eyebrow || cta.eyebrow || DEFAULT_FOOTER.cta.eyebrow,
      heading: cta.cta_heading || cta.heading || DEFAULT_FOOTER.cta.heading,
      buttonText: cta.cta_button_text || cta.button_text || DEFAULT_FOOTER.cta.buttonText,
      buttonLink: normalizeLink(cta.cta_button_link || cta.button_link, DEFAULT_FOOTER.cta.buttonLink.url),
    },
    productLinks: normalizeList(
      footer?.product_links || global?.footer_product_links,
      DEFAULT_FOOTER.productLinks
    ),
    quickLinks: normalizeList(
      footer?.quick_links || global?.quick_links_group?.quick_links,
      DEFAULT_FOOTER.quickLinks
    ),
    supportLinks: normalizeList(
      footer?.support_links || global?.support_links_group?.support_links || global?.resources?.resource_links,
      DEFAULT_FOOTER.supportLinks
    ),
    contact: {
      address: stripHtml(contact.address) || DEFAULT_FOOTER.contact.address,
      mapUrl: contact.map_url || contact.address_link || DEFAULT_FOOTER.contact.mapUrl,
      phone: contact.phone || DEFAULT_FOOTER.contact.phone,
      email: contact.email || DEFAULT_FOOTER.contact.email,
    },
    socialLinks: socialLinks.length > 0 ? socialLinks : DEFAULT_FOOTER.socialLinks,
    legalLinks: normalizeList(footer?.legal_links || global?.legal_links, DEFAULT_FOOTER.legalLinks),
    copyright:
      stripHtml(footer?.copyright_text || global?.copyrights_left || global?.copyright_text) ||
      DEFAULT_FOOTER.copyright,
  };
}

export default async function Footer() {
  const themeOptions = await getThemeOptions();
  const footer = resolveFooterData(resolveThemeOptions(themeOptions));

  return (
    <footer className="bg-[#18201F] text-white">
      <div className="web-width px-6 pb-14 pt-12">
        <div className="relative mb-12 overflow-hidden rounded-[8px] bg-[#303736] px-8 py-10 md:px-12 md:py-12">
          <div className="relative z-10 max-w-[680px]">
            <FooterHeading>{footer.cta.eyebrow}</FooterHeading>
            <h2 className="mt-5 max-w-[680px] font-heading text-[36px] font-normal leading-[44px] tracking-[-0.72px] text-white md:text-[48px] md:leading-[56px]">
              {footer.cta.heading}
            </h2>
          </div>

          {footer.cta.buttonText && (
            <Link
              href={footer.cta.buttonLink.url}
              target={footer.cta.buttonLink.target}
              className="group relative z-10 mt-8 inline-flex h-[52px] items-center gap-4 rounded-[4px] bg-[var(--color-yellow)] py-[6px] pr-[6px] pl-6 font-heading text-[14px] tracking-[-0.28px] text-black transition-opacity hover:opacity-90 md:absolute md:right-12 md:top-1/2 md:mt-0 md:-translate-y-1/2"
            >
              <span>{footer.cta.buttonText}</span>
              <Image src="/black-white-arrow.svg" alt="" width={40} height={40} className="h-[40px] w-[40px] transition-transform group-hover:translate-x-1" />
            </Link>
          )}

          <div
            className="pointer-events-none absolute right-0 top-0 h-full w-[420px] opacity-30"
            style={{
              backgroundImage: "url('/mpp-pattern.svg')",
              backgroundPosition: "-40% center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "105%",
            }}
          />
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[2.1fr_1fr_1fr_1.35fr_0.85fr] lg:gap-14">
          <div>
            <ul>
              {footer.productLinks.map((item) => (
                <li key={`${item.label}-${item.url}`} className="border-b border-white/10">
                  <Link href={item.url} target={item.target} className="group flex items-center justify-between gap-6 py-3">
                    <span className="font-heading text-[30px] leading-[42px] tracking-[-0.6px] text-white md:text-[32px] md:leading-[48px]">
                      {item.label}
                    </span>
                    <Image src="/orange-arrow.svg" alt="" width={15} height={15} className="h-[15px] w-[15px] transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>

            <Image src="/mpp_logo.svg" alt="MPP" width={193} height={65} className="mt-7 h-auto w-[150px] md:w-[193px]" />
          </div>

          <FooterLinkColumn title="Quick Links" links={footer.quickLinks} />
          <FooterLinkColumn title="Support" links={footer.supportLinks} />

          <div>
            <FooterHeading>Contact</FooterHeading>
            <div className="mt-5 space-y-4 font-body text-[14px] leading-[22px] tracking-[-0.28px] text-white">
              <Link href={footer.contact.mapUrl} target="_blank" className="block transition-opacity hover:opacity-70">
                {footer.contact.address}
              </Link>
              <p>
                <strong className="font-bold">Call:</strong>{" "}
                <Link href={`tel:${footer.contact.phone.replace(/[^\d+]/g, "")}`} className="hover:opacity-70">
                  {footer.contact.phone}
                </Link>
              </p>
              <p>
                <strong className="font-bold">Mail:</strong>{" "}
                <Link href={`mailto:${footer.contact.email}`} className="hover:opacity-70">
                  {footer.contact.email}
                </Link>
              </p>
            </div>
          </div>

          <div>
            <FooterHeading>Follow us</FooterHeading>
            <div className="mt-5 flex gap-[6px]">
              {footer.socialLinks.map((item) => (
                <Link
                  key={`${item.name}-${item.url}`}
                  href={item.url}
                  target={item.target}
                  aria-label={item.name}
                  className="flex h-[24px] w-[25px] items-center justify-center rounded-[2px] bg-white transition-opacity hover:opacity-80"
                >
                  {item.icon && <Image src={item.icon} alt="" width={14} height={14} className="max-h-[14px] w-[14px] object-contain" />}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#303736] py-3">
        <div className="web-width flex flex-col gap-3 px-6 font-body text-[14px] leading-[24px] tracking-[-0.28px] text-white md:flex-row md:items-center md:justify-between">
          <p>{footer.copyright}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {footer.legalLinks.map((item, index) => (
              <span key={`${item.label}-${item.url}`} className="flex items-center gap-4">
                {index > 0 && <span className="h-[9px] w-px bg-white/60" aria-hidden="true" />}
                <Link href={item.url} target={item.target} className="hover:opacity-70">
                  {item.label}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkColumn({ title, links }) {
  return (
    <div>
      <FooterHeading>{title}</FooterHeading>
      <ul className="mt-5 space-y-3">
        {links.map((item) => (
          <li key={`${item.label}-${item.url}`}>
            <Link href={item.url} target={item.target} className="font-body text-[14px] leading-[22px] tracking-[-0.28px] text-white transition-opacity hover:opacity-70">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterHeading({ children }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-[16px] w-[2px] bg-[var(--color-yellow)]" />
      <p className="font-body text-[14px] font-medium uppercase leading-[24px] tracking-[0.56px] text-white">
        {children}
      </p>
    </div>
  );
}
