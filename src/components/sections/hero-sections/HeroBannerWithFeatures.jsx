"use client";

// Layout: homepage_banner_with_features
// Fields: hero_title, hero_description, button_row, features, background_image, background_color, background_video_url, custom_class, custom_id

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

function getImageUrl(image) {
  if (!image) return null;
  if (typeof image === "string") return image;
  return (
    image.url ||
    image.source_url ||
    image.sizes?.large ||
    image.sizes?.full ||
    null
  );
}

export default function HeroBannerWithFeatures({ data }) {
  const [activeFeature, setActiveFeature] = useState(0);

  const {
    hero_title,
    hero_description,
    features = [],
    button_row = [],
    background_image,
    background_color,
    background_video_url,
    banner_height,
    custom_class,
    custom_id,
  } = data || {};

  const bgImg = getImageUrl(background_image);

  useEffect(() => {
    if (!features?.length) return;

    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [features.length]);

  if (!data) return null;

  return (
    <section
      id={custom_id || undefined}
      className={`relative min-h-[720px] lg:min-h-screen flex flex-col md:flex-row md:items-center overflow-hidden ${
        custom_class ? ` ${custom_class}` : ""
      }`}
      style={
        background_color && !bgImg && !background_video_url
          ? { backgroundColor: background_color }
          : {}
      }
    >
      {background_video_url && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover -z-10"
        >
          <source src={background_video_url} />
        </video>
      )}

      {bgImg && !background_video_url && (
        <Image
          src={bgImg}
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover -z-10"
        />
      )}

      {(bgImg || background_video_url) && (
        <div className="absolute inset-0 bg-black/45 -z-10" />
      )}

      {/* Main Content */}
      <div
        className={`relative web-width px-6 pt-28 pb-16 md:pt-24 w-full ${
          features?.length > 0 ? "md:pb-48" : "md:pb-24"
        }`}
      >
        <div className="max-w-4xl flex flex-col gap-6 md:gap-8">
          {hero_title && (
            <h1 className="text-[42px] leading-[1.05] tracking-[-1px] sm:text-[56px] lg:text-[84px] font-normal font-heading text-white max-w-[900px]">
              {hero_title}
            </h1>
          )}

          {hero_description && (
            <div
              className="text-white text-[16px] leading-[24px] md:text-[18px] md:leading-[30px] max-w-[620px] font-body"
              dangerouslySetInnerHTML={{ __html: hero_description }}
            />
          )}

          {button_row?.length > 0 && (
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              {button_row.map((btn, i) => (
                <Link
                  key={i}
                  href={typeof btn.button_link === "string" ? btn.button_link : btn.button_link?.url || "#"}
                  target={typeof btn.button_link === "object" ? btn.button_link?.target : undefined}
                  className={
                    i === 0
                      ? "inline-flex w-fit justify-end items-center gap-4 py-[6px] pr-[6px] pl-6 rounded-[4px] bg-[image:var(--mpp-gradient)] text-white font-heading text-[14px] font-normal leading-[normal] tracking-[-0.28px] hover:opacity-90 transition-opacity group"
                      : "inline-flex w-fit justify-end items-center gap-4 py-[6px] pr-[6px] pl-6 rounded-[4px] bg-[#445641] text-white font-heading text-[14px] font-normal leading-[normal] tracking-[-0.28px] hover:opacity-90 transition-opacity group"
                  }
                >
                  <span>{btn.button_label}</span>

                  <Image
                    src="/black-white-arrow.svg"
                    alt=""
                    width={36}
                    height={36}
                    className="w-[36px] h-auto object-contain transition-transform group-hover:translate-x-1"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Features Bottom Bar */}
      {features?.length > 0 && (
        <div className="relative md:absolute md:bottom-0 md:left-0 md:right-0 z-10 w-full">
          <div className="web-width px-6">
            <div className="border-t border-white/20">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-0">
                {features.map((feature, index) => {
                  const iconUrl = getImageUrl(feature.feature_icon);
                  const isActive = activeFeature === index;

                  return (
                    <button
                      type="button"
                      key={index}
                      onClick={() => setActiveFeature(index)}
                      className={`group relative text-left flex items-start gap-4 py-6 min-h-[128px] lg:flex-col lg:gap-3 lg:px-0
                        ${index !== features.length - 1 ? "border-b border-white/10 lg:border-b-0" : ""}
                      `}
                    >
                      {/* Active border:
                          Mobile = left border
                          Desktop = top border
                      */}
                      <span
                        className={`absolute bg-[var(--color-yellow)] transition-all duration-500 ease-out
                          ${
                            isActive
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-60"
                          }
                          left-0 top-6 h-[calc(100%-48px)] w-[3px]
                          lg:top-0 lg:h-[1.5px] lg:w-full
                        `}
                      />

                      <div className="pl-5 lg:pl-0 flex items-start gap-4 lg:flex-col lg:gap-3">
                        {iconUrl ? (
                          <Image
                            src={iconUrl}
                            alt=""
                            height={28}
                            width={28}
                            className="mt-1 h-[28px] w-[28px] object-contain"
                          />
                        ) : (
                          <span className="mt-1 text-[28px] leading-none text-[var(--color-yellow)]">
                            {feature.feature_icon}
                          </span>
                        )}

                        {feature.feature_text && (
                          <div
                            className="text-white text-[16px] leading-[24px] font-normal max-w-[220px] font-body"
                            dangerouslySetInnerHTML={{
                              __html: feature.feature_text,
                            }}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
