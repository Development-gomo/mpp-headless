"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { DEFAULT_LANGUAGE, localizePath } from "@/lib/i18n";

function stripHtml(value = "") {
  return String(value).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function getImageUrl(item) {
  return (
    item?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    item?.featured_image ||
    item?.acf?.image?.url ||
    item?.acf?.case_study_image?.url ||
    item?.image ||
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

function getCaseStudyLayout(data) {
  const layout =
    data?.case_studies_layout ||
    data?.case_study_layout ||
    data?.case_studies_display_type ||
    data?.display_type ||
    data?.layout_type ||
    "grid";

  return String(layout).toLowerCase() === "slider" ? "slider" : "grid";
}

function CaseStudyCard({
  item,
  buttonText = "Read client case",
  language = DEFAULT_LANGUAGE,
}) {
  const title = item?.title?.rendered || item?.title || "";
  const link = item?.slug
    ? localizePath(`/${item.slug}`, language)
    : getButtonHref(item?.link);
  const image = getImageUrl(item);
  const excerpt =
    item?.excerpt?.rendered ||
    item?.acf?.case_study_description ||
    item?.acf?.description ||
    "";

  return (
    <article className="flex min-h-full flex-col overflow-hidden rounded-sm bg-[var(--color-accent)] text-white">
      <div className="relative min-h-[220px] bg-black/15 md:min-h-[245px]">
        {image ? (
          <Image
            src={image}
            alt={stripHtml(title) || "Case study image"}
            fill
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full min-h-[220px] items-center justify-center bg-white/10 px-6 text-center font-body text-[14px] text-white/70 md:min-h-[245px]">
            Case study image missing
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
            className="group inline-flex w-fit items-center gap-4 rounded-sm bg-[var(--color-yellow)] py-1.5 pr-1.5 pl-6 text-black font-heading text-[14px] tracking-[-0.28px]"
          >
            <span>{buttonText}</span>

            <Image
              src="/black-white-arrow.svg"
              alt=""
              width={40}
              height={40}
              className="h-auto w-[40px] object-contain transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function InnerCaseStudy({
  data,
  caseStudies = [],
  language = DEFAULT_LANGUAGE,
}) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  if (!data) return null;

  const {
    text_above_title,
    hero_title,
    hero_description,
    button_row = [],
    background_color,
    custom_class,
    custom_id,
    read_more_button_text,
  } = data;

  const items = caseStudies.slice(0, 6);
  const layout = getCaseStudyLayout(data);
  const readMoreButtonText = read_more_button_text || "Read client case";

  return (
    <section
      id={custom_id || undefined}
      className={`relative bg-[#F3F4FB] ${custom_class || ""}`}
      style={background_color ? { backgroundColor: background_color } : undefined}
    >
      <div className="web-width px-6 py-20 md:py-[120px]">
        <div className="mb-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[620px]">
            {text_above_title && (
              <div className="mb-6 flex items-center gap-2">
                <span className="h-[16px] w-[2px] bg-[var(--color-yellow)]" />
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
                  <span>{btn.button_label || "View all cases"}</span>

                  <Image
                    src="/black-white-arrow.svg"
                    alt=""
                    width={40}
                    height={40}
                    className="h-auto w-[40px] object-contain transition-transform group-hover:translate-x-1"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && layout === "grid" && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item, index) => (
              <CaseStudyCard
                key={item?.id || index}
                item={item}
                buttonText={readMoreButtonText}
                language={language}
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
                  <CaseStudyCard
                    item={item}
                    buttonText={readMoreButtonText}
                    language={language}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {items.length > 1 && (
              <div className="mt-8 flex gap-3">
                <button
                  ref={prevRef}
                  type="button"
                  className="flex h-[44px] w-[44px] items-center justify-center rounded-sm bg-white text-black transition-opacity hover:opacity-80"
                  aria-label="Previous case study"
                >
                  <Image
                    src="/slider-arrow.svg"
                    alt=""
                    width={40}
                    height={40}
                    className="h-auto w-[40px] rotate-180 object-contain"
                  />
                </button>

                <button
                  ref={nextRef}
                  type="button"
                  className="flex h-[44px] w-[44px] items-center justify-center rounded-sm bg-white text-black transition-opacity hover:opacity-80"
                  aria-label="Next case study"
                >
                  <Image
                    src="/slider-arrow.svg"
                    alt=""
                    width={40}
                    height={40}
                    className="h-auto w-[40px] object-contain"
                  />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
