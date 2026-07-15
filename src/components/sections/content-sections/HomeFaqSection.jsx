"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

function getMediaUrl(media) {
  if (!media) return "";
  if (typeof media === "string") return media;

  return (
    media.url ||
    media.source_url ||
    media.sizes?.full ||
    media.sizes?.large ||
    media.sizes?.medium_large ||
    media.sizes?.medium ||
    media.media_details?.sizes?.large?.source_url ||
    media.media_details?.sizes?.full?.source_url ||
    ""
  );
}

function getButtonData(button) {
  const link = button?.button_link;

  if (typeof link === "string") {
    return {
      href: link || "#",
      label: button?.button_label || "",
      target: button?.button_target || undefined,
    };
  }

  return {
    href: link?.url || "#",
    label: button?.button_label || link?.title || "",
    target: button?.button_target || link?.target || undefined,
  };
}

export default function HomeFaqSection({ data }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!data) return null;

  const {
    text_above_title,
    hero_title,
    hero_description,
    button_row = [],
    section_type,
    section_layout,
    hero_image,
    faqs = [],
    background_image,
    background_color,
    background_video_url,
    custom_class,
    custom_id,
  } = data;

  const layoutType = String(section_layout || section_type || "half").toLowerCase();
  const isFullLayout = layoutType === "full";
  const isTwoColumnLayout = layoutType === "two_coumn" || layoutType === "two_column";
  const heroImg = getMediaUrl(hero_image);
  const backgroundImageUrl = getMediaUrl(background_image);
  const backgroundVideoUrl = getMediaUrl(background_video_url);
  const hasBackgroundMedia = Boolean(backgroundImageUrl || backgroundVideoUrl);
  const textColor = hasBackgroundMedia ? "text-white" : "text-[#1A1A1A]";
  const headingColor = hasBackgroundMedia ? "text-white" : "text-black";
  const borderColor = hasBackgroundMedia ? "border-white/25" : "border-black/15";
  const normalizedFaqs = Array.isArray(faqs) ? faqs : [];

  if (!hero_title && !hero_description && normalizedFaqs.length === 0) {
    return null;
  }

  if (isTwoColumnLayout) {
    return (
      <section
        id={custom_id || undefined}
        className={`relative overflow-hidden bg-[#1A1A1A] ${custom_class || ""}`}
        style={background_color ? { backgroundColor: background_color } : {}}
      >
        {backgroundVideoUrl && (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 z-0 h-full w-full object-cover"
          >
            <source src={backgroundVideoUrl} />
          </video>
        )}

        {!backgroundVideoUrl && backgroundImageUrl && (
          <Image
            src={backgroundImageUrl}
            alt=""
            fill
            sizes="100vw"
            className="z-0 object-cover"
          />
        )}

        <div className="absolute inset-0 z-10 bg-black/65" />

        <div className="web-width relative z-20 px-6 py-14 md:px-0 md:py-18">
          {(text_above_title || hero_title || hero_description || button_row?.length > 0) && (
            <div className="mb-10 max-w-[760px]">
              {text_above_title && (
                <div className="mb-5 flex items-center gap-2">
                  <span className="h-2.5 w-0.5 bg-[var(--color-yellow)]" />
                  <p className="font-body text-[14px] font-medium uppercase leading-6 tracking-[0.56px] text-white">
                    {text_above_title}
                  </p>
                </div>
              )}

              {hero_title && (
                <h2
                  className="font-heading mb-6 text-[36px] font-normal leading-11 tracking-[-0.72px] text-white md:text-[48px] md:leading-14 md:tracking-[-0.96px]"
                  dangerouslySetInnerHTML={{ __html: hero_title }}
                />
              )}

              {hero_description && (
                <div
                  className="font-body mb-6 text-[16px] leading-6 text-white"
                  dangerouslySetInnerHTML={{ __html: hero_description }}
                />
              )}

              {button_row?.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {button_row.map((button, index) => {
                    const { href, label, target } = getButtonData(button);

                    return (
                      <Link
                        key={index}
                        href={href}
                        target={target}
                        className="group inline-flex items-center gap-4 rounded-sm bg-[image:var(--mpp-gradient)] py-1.5 pr-1.5 pl-6 font-heading text-[14px] tracking-[-0.28px] text-white transition-opacity hover:opacity-90"
                      >
                        <span>{label}</span>

                        <Image
                          src="/black-white-arrow.svg"
                          alt=""
                          width={36}
                          height={36}
                          className="h-auto w-9 object-contain transition-transform"
                        />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {normalizedFaqs.length > 0 && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-4">
              {normalizedFaqs.map((faq, index) => {
                const isActive = activeIndex === index;
                const description = faq?.faq_description || faq?.faq_content;

                return (
                  <div key={index} className="rounded-sm bg-[var(--color-accent)] text-white">
                    <button
                      type="button"
                      onClick={() => setActiveIndex(isActive ? -1 : index)}
                      className="flex min-h-[104px] w-full items-center gap-4 px-5 py-6 text-left md:px-6"
                      aria-expanded={isActive}
                    >
                      <span className="shrink-0 font-body text-[34px] font-bold leading-none">
                        {isActive ? "-" : "+"}
                      </span>

                      <h3 className="font-body text-[18px] font-semibold leading-7 text-white md:text-[20px] md:leading-8">
                        {faq?.faq_title}
                      </h3>
                    </button>

                    {isActive && description && (
                      <div
                        className="px-5 pb-6 pl-[62px] font-body text-[16px] leading-6 text-white md:px-6 md:pl-[68px]"
                        dangerouslySetInnerHTML={{ __html: description }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section
      id={custom_id || undefined}
      className={`relative overflow-hidden bg-[#F1F1F3] ${custom_class || ""}`}
      style={background_color ? { backgroundColor: background_color } : {}}
    >
      {backgroundVideoUrl && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 z-0 h-full w-full object-cover"
        >
          <source src={backgroundVideoUrl} />
        </video>
      )}

      {!backgroundVideoUrl && backgroundImageUrl && (
        <Image
          src={backgroundImageUrl}
          alt=""
          fill
          sizes="100vw"
          className="z-0 object-cover"
        />
      )}

      {hasBackgroundMedia && <div className="absolute inset-0 z-10 bg-black/45" />}

      <div className="web-width relative z-20 px-6 py-20 md:px-0">
        <div
          className={
            isFullLayout || !heroImg
              ? "grid grid-cols-1 gap-12"
              : "grid grid-cols-1 items-start gap-16 lg:grid-cols-2"
          }
        >
          <div className={isFullLayout ? "max-w-none" : undefined}>
            {text_above_title && (
              <div className="mb-5 flex items-center gap-2">
                <span className="h-2.5 w-0.5 bg-[var(--color-yellow)]" />
                <p
                  className={`font-body text-[14px] font-medium uppercase leading-6 tracking-[0.56px] ${textColor}`}
                >
                  {text_above_title}
                </p>
              </div>
            )}

            {hero_title && (
              <h2
                className={`font-heading mb-6 text-[36px] font-normal leading-11 tracking-[-0.72px] md:text-[48px] md:leading-14 md:tracking-[-0.96px] ${headingColor}`}
                dangerouslySetInnerHTML={{ __html: hero_title }}
              />
            )}

            {hero_description && (
              <div
                className={`font-body mb-6 text-[16px] leading-6 ${textColor}`}
                dangerouslySetInnerHTML={{ __html: hero_description }}
              />
            )}

            {button_row?.length > 0 && (
              <div className="mb-12 flex flex-wrap gap-4">
                {button_row.map((button, index) => {
                  const { href, label, target } = getButtonData(button);

                  return (
                    <Link
                      key={index}
                      href={href}
                      target={target}
                      className="group inline-flex items-center gap-4 rounded-sm bg-[image:var(--mpp-gradient)] py-1.5 pr-1.5 pl-6 font-heading text-[14px] tracking-[-0.28px] text-white transition-opacity hover:opacity-90"
                    >
                      <span>{label}</span>

                      <Image
                        src="/black-white-arrow.svg"
                        alt=""
                        width={36}
                        height={36}
                        className="h-auto w-9 object-contain transition-transform"
                      />
                    </Link>
                  );
                })}
              </div>
            )}

            {normalizedFaqs.length > 0 && (
              <div className={`border-t ${borderColor}`}>
                {normalizedFaqs.map((faq, index) => {
                  const isActive = activeIndex === index;
                  const description = faq?.faq_description || faq?.faq_content;

                  return (
                    <div key={index} className={`border-b py-6 ${borderColor}`}>
                      <button
                        type="button"
                        onClick={() => setActiveIndex(isActive ? -1 : index)}
                        className="flex w-full items-center justify-between gap-6 text-left"
                        aria-expanded={isActive}
                      >
                        <h3
                          className={`font-heading text-[26px] font-medium leading-[34px] tracking-[-0.52px] ${headingColor}`}
                        >
                          {faq?.faq_title}
                        </h3>

                        <span
                          className={`shrink-0 text-[28px] leading-none ${headingColor}`}
                        >
                          {isActive ? "-" : "+"}
                        </span>
                      </button>

                      {isActive && description && (
                        <div
                          className={`font-body mt-5 max-w-[720px] text-[16px] leading-6 ${textColor}`}
                          dangerouslySetInnerHTML={{ __html: description }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {!isFullLayout && heroImg && (
            <div className="relative h-[620px] overflow-hidden">
              <Image
                src={heroImg}
                alt={hero_title || "FAQ image"}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
