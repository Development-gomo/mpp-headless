// src/components/sections/content-sections/service/ServiceWhyChooseSection.jsx

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
    ""
  );
}

export default function ServiceWhyChooseSection({ data }) {
  if (!data) return null;

  const {
    text_above_title,
    hero_title,
    hero_description,
    why_choose_pointers = [],
    button_row = [],
    background_image,
    background_color,
    background_video_url,
    custom_class,
    custom_id,
  } = data;

  const bgImg = getImageUrl(background_image);

  return (
    <section
      id={custom_id || undefined}
      className={`relative overflow-hidden bg-[image:var(--mpp-gradient)] text-white ${custom_class || ""}`}
      style={
        background_color && !bgImg && !background_video_url
          ? { backgroundColor: background_color }
          : {}
      }
    >
      {/* Background video */}
      {background_video_url && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 z-0 h-full w-full object-cover"
        >
          <source src={background_video_url} />
        </video>
      )}

      {/* Background image */}
        {bgImg && !background_video_url && (
        <div className="absolute inset-y-0 right-0 z-0 hidden lg:flex lg:justify-end">
            <Image
            src={bgImg}
            alt=""
            sizes="100%"
            width={0} // width auto handled by style
            height={100} // height auto handled by style
            style={{
                width: "auto",
                height: "100%",
            }}
            className="z-0 object-contain"
            />
        </div>
        )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-[1] bg-black/0" />

      {/* Product image / visual overlay is expected from background image */}
      <div className="relative z-10 web-width px-6 py-20 md:py-[120px]">
        {/* Heading */}
        <div className="mb-16 max-w-[560px]">
          {text_above_title && (
            <div className="mb-6 flex items-center gap-2">
              <span className="h-4 w-0.5 bg-[var(--color-yellow)]" />

              <p className="font-body text-[14px] font-medium uppercase leading-6 tracking-[0.56px] text-white">
                {text_above_title}
              </p>
            </div>
          )}

          {hero_title && (
            <h2
              className="font-heading text-[34px] font-normal leading-[46px] tracking-[-0.84px] text-white md:text-[56px] md:leading-[64px] md:tracking-[-1.12px]"
              dangerouslySetInnerHTML={{ __html: hero_title }}
            />
          )}

          {hero_description && (
            <div
              className="mt-6 max-w-[540px] font-body text-[16px] font-normal leading-6 text-white"
              dangerouslySetInnerHTML={{ __html: hero_description }}
            />
          )}

          {button_row?.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-4">
              {button_row.map((btn, index) => (
                <Link
                  key={index}
                  href={btn.button_link || "#"}
                  target={btn.button_target || undefined}
                  className={
                    index === 0
                      ? "group inline-flex items-center gap-4 rounded-sm bg-[var(--color-yellow)] py-1.5 pr-1.5 pl-6 font-heading text-[14px] font-normal tracking-[-0.28px] text-black transition-opacity hover:opacity-90"
                      : "group inline-flex items-center gap-4 rounded-sm bg-white/10 py-1.5 pr-1.5 pl-6 font-heading text-[14px] font-normal tracking-[-0.28px] text-white transition-opacity hover:opacity-90"
                  }
                >
                  <span>{btn.button_label}</span>

                  <Image
                    src="/black-white-arrow.svg"
                    alt=""
                    width={40}
                    height={40}
                    className="h-auto w-10 object-contain transition-transform"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Cards */}
        {why_choose_pointers?.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {why_choose_pointers.map((item, index) => {
              const icon = getImageUrl(item?.pointer_icon);

              return (
                <article
                  key={index}
                  className="relative min-h-[320px] rounded-lg bg-white/15 p-6 text-white backdrop-blur-[3px] md:p-7"
                >
                  {icon && (
                    <div className="mb-16 flex h-12 w-[48px] items-center justify-center rounded-xs bg-[var(--color-yellow)]">
                      <Image
                        src={icon}
                        alt=""
                        width={28}
                        height={28}
                        className="h-auto w-[28px] object-contain"
                      />
                    </div>
                  )}

                  {item?.pointer_title && (
                    <h3
                      className="mb-6 min-h-[72px] font-heading text-[24px] font-medium leading-[36px] tracking-[-0.52px] text-white"
                      dangerouslySetInnerHTML={{ __html: item.pointer_title }}
                    />
                  )}

                  <div className="mb-6 h-px w-full bg-white/70" />

                  {item?.pointer_description && (
                    <div
                      className="font-body text-[16px] font-normal leading-6 text-white"
                      dangerouslySetInnerHTML={{
                        __html: item.pointer_description,
                      }}
                    />
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