import Image from "next/image";
import Link from "next/link";
import { getServiceById } from "@/lib/api";
import {
  DEFAULT_LANGUAGE,
  ENGLISH_LANGUAGE,
  GERMAN_LANGUAGE,
  getServiceRouteSegment,
  localizePath,
} from "@/lib/i18n";
import {
  getButtonHref,
  getButtonTarget,
  getImageUrl,
  getRendered,
  stripHtml,
} from "@/components/sections/product/productUtils";

function getServiceId(service) {
  if (typeof service === "number" || typeof service === "string") return service;
  return service?.ID || service?.id || null;
}

function getServiceSlug(service) {
  return service?.slug || service?.post_name || "";
}

function getServiceTitle(service) {
  return stripHtml(
    getRendered(service?.title) || service?.post_title || service?.name || ""
  );
}

function getServiceDescription(service) {
  return stripHtml(
    getRendered(service?.excerpt) ||
      service?.excerpt?.raw ||
      service?.short_description ||
      service?.acf?.short_description ||
      service?.acf?.service_short_description ||
      service?.acf?.hero_description ||
      service?.acf?.service_description ||
      getRendered(service?.content)
  );
}

function getServiceImage(service) {
  const embeddedMedia = service?._embedded?.["wp:featuredmedia"]?.[0];
  const image =
    embeddedMedia ||
    service?.featured_image ||
    service?.featured_image_url ||
    service?.featured_media_url ||
    service?.acf?.service_image ||
    service?.acf?.hero_image ||
    service?.acf?.banner_image ||
    service?.acf?.image ||
    service?.acf?.featured_image ||
    service?.yoast_head_json?.og_image?.[0]?.url;

  const src = getImageUrl(image);
  if (!src) return null;

  return {
    src,
    alt: image?.alt || image?.alt_text || "",
    width: image?.width || image?.media_details?.width || 640,
    height: image?.height || image?.media_details?.height || 360,
  };
}

async function resolveSelectedServices(selectedServices, language) {
  const selections = Array.isArray(selectedServices)
    ? selectedServices
    : selectedServices
    ? [selectedServices]
    : [];

  const services = await Promise.all(
    selections.map(async (selection) => {
      const id = getServiceId(selection);
      const fullService = id ? await getServiceById(id, { language }) : null;
      return fullService || (typeof selection === "object" ? selection : null);
    })
  );

  const seen = new Set();

  return services.filter((service) => {
    const identity = getServiceId(service) || getServiceSlug(service);
    if (!service || !identity || seen.has(String(identity))) return false;
    seen.add(String(identity));
    return true;
  });
}

function getButtonLabel(button) {
  return button?.button_label || button?.button_link?.title || "View services";
}

function getServiceCtaLabel(language) {
  if (language === GERMAN_LANGUAGE) return "Dienst ansehen";
  if (language === ENGLISH_LANGUAGE) return "View service";
  return "Visa tjänst";
}

function ServiceCard({ service, language }) {
  const title = getServiceTitle(service);
  const description = getServiceDescription(service);
  const image = getServiceImage(service);
  const slug = getServiceSlug(service);
  const serviceSegment = getServiceRouteSegment(language);
  const href = slug ? localizePath(`/${serviceSegment}/${slug}`, language) : "#";
  const ctaLabel = getServiceCtaLabel(language);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[var(--color-accent)] bg-[var(--color-accent)]">
      <div className="relative h-[190px] overflow-hidden bg-[#F7F6F2]">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt || title || "Service image"}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <span className="flex h-full items-center justify-center font-body text-[14px] text-black/45">
            Service image missing
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
          <p className="font-body mt-5 text-[16px] leading-7 text-white/95">
            {description}
          </p>
        )}

        <div className="mt-auto pt-8">
          <Link
            href={href}
            aria-label={`${ctaLabel}: ${title}`}
            className="inline-flex w-fit items-center gap-5 rounded-[5px] bg-[var(--color-yellow)] py-1.5 pl-7 pr-1.5 font-heading text-[16px] font-normal tracking-[-0.32px] text-black transition-opacity hover:opacity-90"
          >
            <span>{ctaLabel}</span>
            <span className="flex h-11 w-11 items-center justify-center rounded-[4px] bg-white text-[22px] leading-none transition-transform group-hover:translate-x-0.5">
              {"\u2197"}
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default async function ServicesSection({
  data,
  language = DEFAULT_LANGUAGE,
}) {
  if (!data) return null;

  const {
    text_above_title,
    hero_title,
    hero_description,
    button_row = [],
    select_services,
    background_color,
    custom_class,
    custom_id,
  } = data;

  const services = await resolveSelectedServices(select_services, language);
  if (services.length === 0) return null;

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
                  className="font-heading max-w-155 text-[42px] font-normal leading-[50px] tracking-[-0.84px] text-black md:text-[52px] md:leading-[60px] md:tracking-[-1.04px]"
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
          {services.map((service) => (
            <ServiceCard
              key={getServiceId(service) || getServiceSlug(service)}
              service={service}
              language={language}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
