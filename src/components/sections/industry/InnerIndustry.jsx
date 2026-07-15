"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import {
  DEFAULT_LANGUAGE,
  ENGLISH_LANGUAGE,
  GERMAN_LANGUAGE,
  getIndustryRouteSegment,
  localizePath,
  normalizeLanguage,
} from "@/lib/i18n";

const INDUSTRIES_PER_PAGE = 6;

const DEFAULT_LOAD_MORE_LABELS = {
  sv: "Ladda fler",
  en: "Load more",
  de: "Mehr laden",
};

const INDUSTRY_LABELS = {
  [DEFAULT_LANGUAGE]: {
    readMore: "Läs mer",
    viewAll: "Visa alla användningsområden",
    loadMore: "Ladda fler",
    imageAlt: "Användningsområdesbild",
    imageMissing: "Användningsområdesbild saknas",
    previous: "Föregående användningsområde",
    next: "Nästa användningsområde",
  },
  [ENGLISH_LANGUAGE]: {
    readMore: "Read more",
    viewAll: "View all industries",
    loadMore: "Load more",
    imageAlt: "Industry image",
    imageMissing: "Industry image missing",
    previous: "Previous industry",
    next: "Next industry",
  },
  [GERMAN_LANGUAGE]: {
    readMore: "Mehr erfahren",
    viewAll: "Alle Anwendungsbereiche anzeigen",
    loadMore: "Mehr laden",
    imageAlt: "Anwendungsbereichsbild",
    imageMissing: "Anwendungsbereichsbild fehlt",
    previous: "Vorheriger Anwendungsbereich",
    next: "Nächster Anwendungsbereich",
  },
};

function getLabels(language) {
  return INDUSTRY_LABELS[normalizeLanguage(language)] || INDUSTRY_LABELS[DEFAULT_LANGUAGE];
}

function stripHtml(value = "") {
  return String(value).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function getMediaUrl(media) {
  if (!media) return "";
  if (typeof media === "string") return media;

  return (
    media.source_url ||
    media.url ||
    media.src ||
    media.media_details?.sizes?.large?.source_url ||
    media.media_details?.sizes?.medium_large?.source_url ||
    media.media_details?.sizes?.full?.source_url ||
    media.sizes?.large ||
    media.sizes?.medium_large ||
    media.sizes?.full ||
    ""
  );
}

function getImageUrl(item) {
  const featuredMedia = item?._embedded?.["wp:featuredmedia"]?.[0];
  const yoastImage = item?.yoast_head_json?.og_image?.[0]?.url;

  return (
    getMediaUrl(featuredMedia) ||
    getMediaUrl(item?.featured_image) ||
    item?.featured_image_url ||
    item?.featured_media_url ||
    yoastImage ||
    getMediaUrl(item?.acf?.image) ||
    getMediaUrl(item?.acf?.industry_image) ||
    getMediaUrl(item?.acf?.background_image) ||
    getMediaUrl(item?.image) ||
    ""
  );
}

function getButtonHref(link, fallback = "#") {
  if (!link) return fallback;
  if (typeof link === "string") return link || fallback;
  return link.url || fallback;
}

function getButtonTarget(link) {
  if (!link || typeof link === "string") return undefined;
  return link.target || undefined;
}

function getIndustryLayout(data) {
  const layout =
    data?.industry_layout ||
    data?.industries_layout ||
    data?.display_type ||
    data?.layout_type ||
    "grid";

  return String(layout).toLowerCase() === "slider" ? "slider" : "grid";
}

function IndustryCard({
  item,
  buttonText,
  language = DEFAULT_LANGUAGE,
  labels,
}) {
  const title = item?.title?.rendered || item?.title || "";
  const link = item?.slug
    ? localizePath(`/${getIndustryRouteSegment(language)}/${item.slug}`, language)
    : getButtonHref(item?.link);
  const image = getImageUrl(item);
  const excerpt =
    item?.excerpt?.rendered ||
    item?.acf?.industry_description ||
    item?.acf?.description ||
    item?.acf?.hero_description ||
    "";

  return (
    <article className="flex min-h-full flex-col overflow-hidden rounded-sm bg-[var(--color-accent)] text-white">
      <div className="relative min-h-[220px] bg-black/15 md:min-h-[245px]">
        {image ? (
          <Image
            src={image}
            alt={stripHtml(title) || labels.imageAlt}
            fill
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full min-h-[220px] items-center justify-center bg-white/10 px-6 text-center font-body text-[14px] text-white/70 md:min-h-[245px]">
            {labels.imageMissing}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-7">
        {title && (
          <h3
            className="mb-5 font-heading text-[28px] font-medium leading-[36px] tracking-[-0.56px] text-white"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        )}

        {excerpt && (
          <div
            className="mb-8 line-clamp-4 font-body text-[16px] font-normal leading-6 text-white"
            dangerouslySetInnerHTML={{ __html: excerpt }}
          />
        )}

        <div className="mt-auto">
          <Link
            href={link}
            className="group inline-flex w-fit items-center gap-4 rounded-sm bg-[var(--color-yellow)] py-1.5 pr-1.5 pl-6 font-heading text-[14px] tracking-[-0.28px] text-black"
          >
            <span>{buttonText}</span>

            <Image
              src="/black-white-arrow.svg"
              alt=""
              width={40}
              height={40}
              className="h-auto w-10 object-contain transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function InnerIndustry({
  data,
  industries = [],
  language = DEFAULT_LANGUAGE,
}) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(INDUSTRIES_PER_PAGE);

  if (!data) return null;

  const {
    text_above_title,
    hero_title,
    hero_description,
    button_row = [],
    background_image,
    background_color,
    custom_class,
    custom_id,
    read_more_button_text,
    load_more_button_text,
  } = data;

  const sectionStyle = {
    ...(background_color ? { backgroundColor: background_color } : {}),
    ...(background_image?.url ? { backgroundImage: `url(${background_image.url})` } : {}),
  };
  const items = industries.slice(0, visibleCount);
  const hasMore = visibleCount < industries.length;
  const layout = getIndustryLayout(data);
  const labels = getLabels(language);
  const readMoreButtonText = read_more_button_text || labels.readMore;
  const loadMoreButtonText =
    load_more_button_text ||
    DEFAULT_LOAD_MORE_LABELS[language] ||
    labels.loadMore;

  return (
    <section
      id={custom_id || undefined}
      className={`relative bg-[#F3F4FB] bg-cover bg-center ${custom_class || ""}`}
      style={Object.keys(sectionStyle).length ? sectionStyle : undefined}
    >
      <div className="web-width px-6 py-20 md:py-[120px]">
        <div className="mb-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-155">
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
                className="font-heading text-[34px] font-normal leading-[46px] tracking-[-0.84px] text-black md:text-[48px] md:leading-14.5 md:tracking-[-1.04px]"
                dangerouslySetInnerHTML={{ __html: hero_title }}
              />
            )}

            {hero_description && (
              <div
                className="mt-5 max-w-xl font-body text-[16px] leading-6 text-[#1A1A1A]"
                dangerouslySetInnerHTML={{ __html: hero_description }}
              />
            )}
          </div>

          {button_row?.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {button_row.map((btn, index) => (
                <Link
                  key={index}
                  href={getButtonHref(btn.button_link)}
                  target={getButtonTarget(btn.button_link)}
                  className="group inline-flex items-center gap-4 rounded-sm bg-[image:var(--mpp-gradient)] py-1.5 pr-1.5 pl-6 font-heading text-[14px] font-normal tracking-[-0.28px] text-white transition-opacity hover:opacity-90"
                >
                  <span>{btn.button_label || labels.viewAll}</span>

                  <Image
                    src="/black-white-arrow.svg"
                    alt=""
                    width={40}
                    height={40}
                    className="h-auto w-10 object-contain transition-transform group-hover:translate-x-1"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && layout === "grid" && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item, index) => (
              <IndustryCard
                key={item?.id || index}
                item={item}
                buttonText={readMoreButtonText}
                language={language}
                labels={labels}
              />
            ))}
          </div>
        )}

        {items.length > 0 && layout === "slider" && (
          <div>
            <Swiper
              modules={[Navigation]}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                768: { slidesPerView: 2 },
                1280: { slidesPerView: 3 },
              }}
              onBeforeInit={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }}
              onSwiper={(swiper) => {
                setTimeout(() => {
                  if (!prevRef.current || !nextRef.current) return;
                  swiper.params.navigation.prevEl = prevRef.current;
                  swiper.params.navigation.nextEl = nextRef.current;
                  swiper.navigation.destroy();
                  swiper.navigation.init();
                  swiper.navigation.update();
                });
              }}
            >
              {items.map((item, index) => (
                <SwiperSlide key={item?.id || index} className="h-auto">
                  <IndustryCard
                    item={item}
                    buttonText={readMoreButtonText}
                    language={language}
                    labels={labels}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {items.length > 1 && (
              <div className="mt-8 flex gap-3">
                <button
                  ref={prevRef}
                  type="button"
                  className="flex h-11 w-[44px] items-center justify-center rounded-sm bg-white text-black transition-opacity hover:opacity-80"
                  aria-label={labels.previous}
                >
                  <Image
                    src="/slider-arrow.svg"
                    alt=""
                    width={40}
                    height={40}
                    className="h-auto w-10 rotate-180 object-contain"
                  />
                </button>

                <button
                  ref={nextRef}
                  type="button"
                  className="flex h-11 w-[44px] items-center justify-center rounded-sm bg-white text-black transition-opacity hover:opacity-80"
                  aria-label={labels.next}
                >
                  <Image
                    src="/slider-arrow.svg"
                    alt=""
                    width={40}
                    height={40}
                    className="h-auto w-10 object-contain"
                  />
                </button>
              </div>
            )}
          </div>
        )}

        {hasMore && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() =>
                setVisibleCount((count) =>
                  Math.min(count + INDUSTRIES_PER_PAGE, industries.length)
                )
              }
              className="group inline-flex items-center gap-4 rounded-sm bg-[image:var(--mpp-gradient)] py-1.5 pr-1.5 pl-6 font-heading text-[14px] font-normal tracking-[-0.28px] text-white transition-opacity hover:opacity-90"
            >
              <span>{loadMoreButtonText}</span>
              <Image
                src="/black-white-arrow.svg"
                alt=""
                width={40}
                height={40}
                className="h-auto w-10 rotate-90 object-contain transition-transform"
              />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
