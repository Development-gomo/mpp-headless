import Image from "next/image";
import Link from "next/link";

function getButtonDetails(button = {}) {
  const link = button.button_link;

  if (typeof link === "string") {
    return {
      href: link || "#",
      label: button.button_label || "",
      target: button.button_target || undefined,
    };
  }

  return {
    href: link?.url || "#",
    label: button.button_label || link?.title || "",
    target: button.button_target || link?.target || undefined,
  };
}

function resolveThemeOptions(data) {
  return (
    data?.options?.acf ||
    data?.options ||
    data?.data?.acf ||
    data?.data ||
    data?.acf ||
    data ||
    {}
  );
}

function getPartners(themeOptions) {
  const options = resolveThemeOptions(themeOptions);
  const partners =
    options?.global?.our_partners ||
    options?.our_partners ||
    options?.theme_options?.our_partners ||
    [];

  return Array.isArray(partners)
    ? partners.filter(
        (partner) =>
          partner?.partner_name ||
          partner?.partner_description ||
          partner?.partner_logo
      )
    : [];
}

function getImageUrl(image) {
  if (!image) return "";
  if (typeof image === "string") return image;
  return image.url || image.source_url || image.sizes?.medium || "";
}

export default function PartnerReviewSection({ data, themeOptions }) {
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
  const partners = getPartners(themeOptions);

  return (
    <section
      id={custom_id || undefined}
      className={`relative overflow-hidden ${custom_class || ""}`}
      style={background_color ? { backgroundColor: background_color } : undefined}
    >
      <div className="web-width px-6 md:px-0 py-20 md:py-[120px]">
        <div className="mb-12 grid gap-8 lg:mb-16 lg:grid-cols-[1fr_0.85fr] lg:items-end lg:gap-16">
          <div className="max-w-[720px]">
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
                className="font-heading text-[42px] font-normal leading-[50px] tracking-[-0.84px] text-black md:text-[52px] md:leading-[60px] md:tracking-[-1.04px]"
                dangerouslySetInnerHTML={{ __html: hero_title }}
              />
            )}
          </div>

          <div className="flex flex-col items-start lg:items-end">
            {hero_description && (
              <div
                className="font-body max-w-[560px] text-[16px] font-normal leading-6 text-[#1A1A1A] lg:text-right"
                dangerouslySetInnerHTML={{ __html: hero_description }}
              />
            )}

            {button_row?.length > 0 && (
              <div className="mt-7 flex flex-wrap gap-4">
                {button_row.map((button, index) => {
                  const { href, label, target } = getButtonDetails(button);
                  if (!label) return null;

                  return (
                    <Link
                      key={index}
                      href={href}
                      target={target}
                      className="group inline-flex items-center gap-4 rounded-sm bg-[image:var(--mpp-gradient)] py-1.5 pr-1.5 pl-6 font-heading text-[14px] font-normal tracking-[-0.28px] text-white transition-opacity hover:opacity-90"
                    >
                      <span>{label}</span>
                      <Image
                        src="/black-white-arrow.svg"
                        alt=""
                        width={40}
                        height={40}
                        className="h-auto w-10 object-contain transition-transform"
                      />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {partners.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {partners.map((partner, index) => {
              const name = partner?.partner_name?.trim() || "";
              const description = partner?.partner_description?.trim() || "";
              const logo = getImageUrl(partner?.partner_logo);

              return (
                <article
                  key={`${name || "partner"}-${index}`}
                  className="group relative flex min-h-[330px] flex-col overflow-hidden rounded-lg border border-black/[0.07] bg-white p-7 shadow-[0_12px_36px_rgba(7,24,56,0.05)] transition-transform duration-300 hover:-translate-y-1 md:p-8"
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1 bg-[image:var(--mpp-gradient)]"
                  />

                  <div className="mb-7 flex min-h-[84px] items-center justify-between gap-5 border-b border-black/10 pb-6">
                    <div className="relative flex h-[72px] w-[126px] items-center">
                      {logo && (
                        <Image
                          src={logo}
                          alt={partner?.partner_logo?.alt || name || "Partner logo"}
                          fill
                          sizes="126px"
                          className="object-contain object-left"
                        />
                      )}
                    </div>

                    <span className="font-heading text-[40px] font-medium leading-none text-[var(--color-accent)]/15">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {name && (
                    <h3 className="font-heading text-[26px] font-medium leading-[32px] tracking-[-0.52px] text-black">
                      {name}
                    </h3>
                  )}

                  {description && (
                    <p className="mt-4 font-body text-[15px] font-normal leading-[23px] text-[#1A1A1A]">
                      {description}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
