import Image from "next/image";
import Link from "next/link";
import CatalogViewerClient from "./CatalogViewerClient";

function getFileUrl(file) {
  if (!file) return "";
  if (typeof file === "string") return file;
  return file.url || file.source_url || "";
}

function normalizeLink(link) {
  if (!link) return { href: "#", target: "_self" };
  if (typeof link === "string") return { href: link || "#", target: "_self" };

  return {
    href: link.url || "#",
    target: link.target || "_self",
  };
}

export default function CatalogSection({ data }) {
  if (!data) return null;

  const {
    text_above_title,
    hero_title,
    hero_description,
    button_row = [],
    catalog_pdf,
    viewer_min_height,
    background_color,
    custom_id,
    custom_class,
  } = data;
  const pdfUrl = getFileUrl(catalog_pdf);

  return (
    <section
      id={custom_id || undefined}
      className={`relative ${custom_class || ""}`}
      style={background_color ? { backgroundColor: background_color } : undefined}
    >
      <div className="web-width px-6 py-20 md:py-[120px]">
        <div className="mb-12 grid gap-8 lg:mb-16 lg:grid-cols-2 lg:gap-16">
          <div>
            {text_above_title && (
              <div className="mb-7 flex items-center gap-2">
                <span className="h-5 w-0.5 bg-[var(--color-yellow)]" />
                <p className="font-body text-[14px] font-medium uppercase leading-6 tracking-[0.56px] text-[#1A1A1A]">
                  {text_above_title}
                </p>
              </div>
            )}

            {hero_title && (
              <h2
                className="max-w-[650px] font-heading text-[34px] font-normal leading-[46px] tracking-[-0.84px] text-black md:text-[58px] md:leading-[68px] md:tracking-[-1.16px]"
                dangerouslySetInnerHTML={{ __html: hero_title }}
              />
            )}
          </div>

          <div className="self-end">
            {hero_description && (
              <div
                className="font-body text-[17px] leading-7 text-[#1A1A1A] [&_a]:underline [&_p+p]:mt-4"
                dangerouslySetInnerHTML={{ __html: hero_description }}
              />
            )}

            {button_row.length > 0 && (
              <div className="mt-7 flex flex-wrap gap-4">
                {button_row.map((button, index) => {
                  const link = normalizeLink(button?.button_link);

                  return (
                    <Link
                      key={`${button?.button_label || "button"}-${index}`}
                      href={link.href}
                      target={link.target}
                      className="group inline-flex items-center gap-4 rounded-sm bg-[image:var(--mpp-gradient)] py-1.5 pr-1.5 pl-6 font-heading text-[14px] tracking-[-0.28px] text-white transition-opacity hover:opacity-90"
                    >
                      <span>{button?.button_label || "View catalog"}</span>
                      <Image
                        src="/black-white-arrow.svg"
                        alt=""
                        width={40}
                        height={40}
                        className="h-auto w-10 object-contain transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {pdfUrl ? (
          <CatalogViewerClient
            pdfUrl={pdfUrl}
            viewerUrl={`/api/catalog-pdf?url=${encodeURIComponent(pdfUrl)}`}
            title={catalog_pdf?.title || text_above_title || "Catalog"}
            minHeight={viewer_min_height}
          />
        ) : (
          <div className="rounded-2xl bg-[#F3F4F6] px-6 py-16 text-center font-body text-[#50545B]">
            Upload a PDF in the Catalog section to display the viewer.
          </div>
        )}
      </div>
    </section>
  );
}
