"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { DEFAULT_LANGUAGE, localizePath } from "@/lib/i18n";

const POSTS_PER_PAGE = 6;

const DEFAULT_READ_MORE_LABELS = {
  sv: "Läs mer",
  en: "Read more",
  de: "Mehr erfahren",
};

const DEFAULT_LOAD_MORE_LABELS = {
  sv: "Ladda fler",
  en: "Load more",
  de: "Mehr laden",
};

export default function LatestBlogsSection({
  data,
  posts = [],
  language = DEFAULT_LANGUAGE,
}) {
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

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
    load_more_button_text,
  } = data;

  const readMoreText =
    read_more_button_text || DEFAULT_READ_MORE_LABELS[language] || "Read more";
  const loadMoreText =
    load_more_button_text || DEFAULT_LOAD_MORE_LABELS[language] || "Load more";
  const visiblePosts = posts.slice(0, visibleCount);
  const hasMore = visibleCount < posts.length;

  return (
    <section
      id={custom_id || undefined}
      className={`relative bg-[#F1F1F3] ${custom_class || ""}`}
      style={background_color ? { backgroundColor: background_color } : {}}
    >
      <div className="web-width px-6 md:px-0 py-20">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between mb-10">
          <div className="max-w-[560px]">
            {text_above_title && (
              <div className="flex items-center gap-2 mb-5">
                <span className="w-[2px] h-[10px] bg-[var(--color-yellow)]" />
                <p className="text-[#1A1A1A] text-[14px] leading-6 font-medium tracking-[0.56px] uppercase font-body">
                    {text_above_title}
                </p>
              </div>
            )}

            {hero_title && (
              <h2
                className="font-heading text-[36px] font-normal leading-[44px] tracking-[-0.72px] text-black md:text-[48px] md:leading-[56px] md:tracking-[-0.96px]"
                dangerouslySetInnerHTML={{ __html: hero_title }}
              />
            )}

            {hero_description && (
              <div
                className="mt-5 text-black/70 text-base max-w-xl"
                dangerouslySetInnerHTML={{ __html: hero_description }}
              />
            )}
          </div>

          {button_row?.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {button_row.map((btn, i) => (
                <Link
                  key={i}
                  href={btn.button_link || "#"}
                  className={
                    i === 0
                      ? "inline-flex justify-end items-center gap-4 py-1.5 pr-1.5 pl-6 rounded-sm bg-[image:var(--mpp-gradient)] text-white font-heading text-[14px] font-normal leading-[normal] tracking-[-0.28px] hover:opacity-90 transition-opacity group"
                      : "inline-flex justify-end items-center gap-4 py-1.5 pr-1.5 pl-6 rounded-sm border border-white text-white font-heading text-[14px] font-normal leading-[normal] tracking-[-0.28px] hover:bg-white/10 transition-colors group"
                  }
                >
                  <span>{btn.button_label}</span>

                  <Image
                    src="/black-white-arrow.svg"
                    alt=""
                    width={36}
                    height={36}
                    className="w-9 h-auto object-contain transition-transform"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>

        {visiblePosts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visiblePosts.map((post, index) => {
              const title = post?.title?.rendered || post?.title || "";
              const excerpt = post?.excerpt?.rendered || post?.excerpt || "";
              const link = post?.slug ? localizePath(`/${post.slug}`, language) : "#";

              const image =
                post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                post?.featured_image ||
                post?.image ||
                "";

              const category =
                post?._embedded?.["wp:term"]?.[0]?.[0]?.name || "News";

              const date = post?.date
                ? new Date(post.date).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })
                : "";

              return (
                <Link
                    key={post?.id || index}
                    href={link}
                    className="group flex h-full flex-col overflow-hidden rounded-sm bg-white"
                    >
                    <div className="flex min-h-[245px] flex-1 flex-col p-6 pb-5">
                        <div className="mb-6 flex items-center gap-3">
                        <span className="inline-flex h-[22px] items-center rounded-[2px] bg-[var(--color-accent)] px-[13px] text-[12px] font-normal tracking-[-0.24px] text-white [font-family:var(--font-heading)]">
                            {category}
                        </span>

                        {date && (
                            <span className="text-[#1A1A1A] text-[12px] leading-6 font-normal [font-family:var(--font-nunito-sans)]">
                            {date}
                            </span>
                        )}
                        </div>

                        {title && (
                        <h3
                        className="mb-5 min-h-[84px] text-[28px] font-medium leading-[36px] tracking-[-0.56px] text-black capitalize [font-family:var(--font-heading)] line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: title }}
                        />
                        )}

                        {excerpt && (
                        <div
                        className="mb-6 text-[16px] leading-6 text-[#1A1A1A] font-normal [font-family:var(--font-nunito-sans)] line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: excerpt }}
                        />
                        )}

                        <span className="mt-auto inline-flex w-fit items-center gap-4 rounded-sm bg-[var(--color-yellow)] py-1.5 pr-1.5 pl-6 font-heading text-[14px] tracking-[-0.28px] text-black">
                          <span>{readMoreText}</span>
                          <Image
                            src="/black-white-arrow.svg"
                            alt=""
                            width={36}
                            height={36}
                            className="h-auto w-9 object-contain transition-transform group-hover:translate-x-1"
                          />
                        </span>
                    </div>

                    <div className="relative h-[210px] overflow-hidden">
                        {image && (
                        <Image
                            src={image}
                            alt={title || "Blog image"}
                            fill
                            sizes="(min-width: 1024px) 33vw, 100vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        )}

                        <Image
                        src="/orange-black-arrow.svg"
                        alt=""
                        width={36}
                        height={36}
                        className="absolute right-5 bottom-5 h-auto w-9 object-contain transition-transform"
                        />
                    </div>
                </Link>
              );
            })}
          </div>
        )}

        {hasMore && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() =>
                setVisibleCount((count) =>
                  Math.min(count + POSTS_PER_PAGE, posts.length)
                )
              }
              className="group inline-flex items-center gap-4 rounded-sm bg-[image:var(--mpp-gradient)] py-1.5 pr-1.5 pl-6 font-heading text-[14px] tracking-[-0.28px] text-white transition-opacity hover:opacity-90"
            >
              <span>{loadMoreText}</span>
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
