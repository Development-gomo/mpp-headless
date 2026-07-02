import Image from "next/image";
import Link from "next/link";

function getImageUrl(image) {
  if (!image) return "";

  if (typeof image === "string") return image;
    
  return (
    image?.url ||
    image?.source_url ||
    image?.sizes?.full ||
    image?.sizes?.large ||
    image?.sizes?.medium_large ||
    image?.sizes?.medium ||
    image?.media_details?.sizes?.large?.source_url ||
    image?.media_details?.sizes?.full?.source_url ||
    ""
  );
}

export default function ServiceOverviewSection({ data }) {
  if (!data) return null;

  const {
    text_above_title,
    hero_title,
    hero_description,
    overview_pointers_title,
    overview_pointers = [],
    button_row = [],
    hero_image,
    custom_class,
    custom_id,
  } = data;

  const heroImg = getImageUrl(hero_image);
  return (
    <section
      id={custom_id || undefined}
      className={`relative bg-white ${custom_class || ""}`}
    >
      <div className="web-width px-6 py-20 md:py-[120px]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20 lg:items-center">
          {/* LEFT CONTENT */}
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
                className="max-w-155 font-heading text-[42px] font-normal leading-[50px] tracking-[-0.84px] text-black md:text-[52px] md:leading-[60px] md:tracking-[-1.04px]"
                dangerouslySetInnerHTML={{ __html: hero_title }}
              />
            )}

            {hero_description && (
              <div
                className="mt-8 max-w-155 font-body text-[16px] font-normal leading-6 text-[#1A1A1A]"
                dangerouslySetInnerHTML={{ __html: hero_description }}
              />
            )}

            {overview_pointers_title && (
              <h3 className="mt-10 mb-6 font-heading text-[28px] font-medium leading-[36px] tracking-[-0.56px] text-black">
                {overview_pointers_title}
              </h3>
            )}

            {overview_pointers?.length > 0 && (
              <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                {overview_pointers.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xs bg-[var(--color-yellow)]">
                      <Image
                        src="/energy-orange-white-ico.svg"
                        alt=""
                        width={22}
                        height={22}
                        className="h-auto w-[22px] object-contain"
                      />
                    </span>

                    <p className="font-body text-[16px] font-normal leading-6 text-[#1A1A1A]">
                      {item?.list_title || item?.overview_pointer || item?.text}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {button_row?.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-4">
                {button_row.map((btn, index) => (
                  <Link
                    key={index}
                    href={btn.button_link || "#"}
                    target={btn.button_target || undefined}
                    className={
                      index === 0
                        ? "group inline-flex items-center gap-4 rounded-sm bg-[image:var(--mpp-gradient)] py-1.5 pr-1.5 pl-6 font-heading text-[14px] font-normal tracking-[-0.28px] text-white transition-opacity hover:opacity-90"
                        : "group inline-flex items-center gap-4 rounded-sm bg-[var(--color-yellow)] py-1.5 pr-1.5 pl-6 font-heading text-[14px] font-normal tracking-[-0.28px] text-black transition-opacity hover:opacity-90"
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

          {/* RIGHT IMAGE */}
          {heroImg && (
            <div className="relative h-[320px] overflow-hidden rounded-sm md:h-[460px] lg:h-[520px]">
              <Image
                src={heroImg}
                alt={hero_title || "Service overview image"}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}