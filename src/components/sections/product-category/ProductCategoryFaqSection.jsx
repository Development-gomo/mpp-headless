// src/components/ProductCategoryFaqSection.jsx

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

function getButtonLink(link) {
  if (!link) return "#";
  if (typeof link === "string") return link;
  return link?.url || "#";
}

function getButtonTarget(link) {
  if (!link || typeof link === "string") return undefined;
  return link?.target || undefined;
}

export default function ProductCategoryFaqSection({ category }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!category?.acf) return null;

  const acf = category.acf;

  const aboveTitle = acf?.faq_section_above_title;
  const title = acf?.faq_section_title;
  const text = acf?.faq_section_text;
  const ctaText = acf?.faq_section_cta_text;
  const ctaLink = getButtonLink(acf?.faq_section_cta_link);
  const ctaTarget = getButtonTarget(acf?.faq_section_cta_link);

  const faqs = Array.isArray(acf?.faqs) ? acf.faqs : [];

  if (!title && !text && faqs.length === 0) return null;

  return (
    <section className="bg-white">
      <div className="web-width px-6 py-20 md:py-[120px]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {/* Left content */}
          <div>
            {aboveTitle && (
              <div className="mb-6 flex items-center gap-2">
                <span className="h-4 w-0.5 bg-[var(--color-yellow)]" />

                <p className="font-body text-[14px] font-medium uppercase leading-6 tracking-[0.56px] text-[#1A1A1A]">
                  {aboveTitle}
                </p>
              </div>
            )}

            {title && (
              <h2
                className="max-w-[560px] font-heading text-[34px] font-normal leading-[46px] tracking-[-0.84px] text-black md:text-[48px] md:leading-[58px] md:tracking-[-1.04px]"
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}

            {text && (
              <div
                className="mt-8 max-w-[420px] font-body text-[18px] font-normal leading-[28px] text-[#1A1A1A]"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            )}

            {ctaText && (
              <Link
                href={ctaLink}
                target={ctaTarget}
                className="group mt-8 inline-flex items-center gap-4 rounded-sm bg-[image:var(--mpp-gradient)] py-1.5 pr-1.5 pl-6 font-heading text-[14px] font-normal tracking-[-0.28px] text-white transition-opacity hover:opacity-90"
              >
                <span>{ctaText}</span>

                <Image
                  src="/black-white-arrow.svg"
                  alt=""
                  width={40}
                  height={40}
                  className="h-auto w-[40px] object-contain transition-transform"
                />
              </Link>
            )}
          </div>

          {/* FAQ accordion */}
          {faqs.length > 0 && (
            <div className="lg:pt-10">
              <div className="border-t border-[var(--color-yellow)]">
                {faqs.map((faq, index) => {
                  const isActive = activeIndex === index;

                  return (
                    <div
                      key={index}
                      className="border-b border-black/20"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setActiveIndex(isActive ? -1 : index)
                        }
                        className="flex w-full items-start justify-between gap-6 py-6 text-left"
                        aria-expanded={isActive}
                      >
                        <span
                          className={`font-heading text-[22px] leading-[30px] tracking-[-0.44px] text-black md:text-[24px] md:leading-[32px] ${
                            isActive ? "font-medium" : "font-normal"
                          }`}
                        >
                          {faq?.faq_title}
                        </span>

                        <span className="shrink-0 font-heading text-[32px] leading-[32px] text-black">
                          {isActive ? "−" : "+"}
                        </span>
                      </button>

                      {isActive && faq?.faq_content && (
                        <div
                          className="max-w-[720px] pb-6 font-body text-[16px] font-normal leading-6 text-[#1A1A1A]"
                          dangerouslySetInnerHTML={{
                            __html: faq.faq_content,
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}