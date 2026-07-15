"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getButtonHref, getButtonTarget, stripHtml } from "./productUtils";

export default function ProductFaqSection({ product }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const acf = product?.acf || {};
  const eyebrow = stripHtml(
    acf.faq_section_eyebrow ||
      acf.faq_section_label ||
      acf.faq_text_over_title ||
      "FAQS"
  );
  const title = acf.faq_section_title;
  const description = acf.faq_section_description;
  const ctaText = acf.faq_cta_text;
  const ctaHref = getButtonHref(acf.faq_cta_link, "#");
  const ctaTarget = getButtonTarget(acf.faq_cta_link);
  const faqs = Array.isArray(acf.product_faqs) ? acf.product_faqs : [];

  if (!title && !description && !ctaText && faqs.length === 0) return null;

  return (
    <section id="faqs" className="bg-white">
      <div className="web-width px-6 py-20 md:py-[112px]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-[84px]">
          <div className="max-w-[430px]">
            {eyebrow && (
              <div className="mb-7 flex items-center gap-2">
                <span className="h-4 w-0.5 bg-[var(--color-yellow)]" />
                <p className="font-body text-[13px] font-medium uppercase leading-5.5 tracking-[0.52px] text-[#1A1A1A]">
                  {eyebrow}
              </p>
              </div>
            )}
            {title && (
              <h2
                className="font-heading text-[40px] font-normal leading-12 text-black md:text-[44px] md:leading-[54px] [&_span]:text-[#007DA5]"
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}
            {description && (
              <div
                className="mt-7 max-w-[360px] font-body text-[17px] font-normal leading-[25px] text-[#1A1A1A]"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}
            {ctaText && (
              <Link
                href={ctaHref}
                target={ctaTarget}
                className="group mt-7 inline-flex h-10 items-center gap-4 rounded-sm bg-[image:var(--mpp-gradient)] py-[4px] pr-[4px] pl-5 font-heading text-[13px] font-normal tracking-[-0.26px] text-white transition-opacity hover:opacity-90"
              >
                <span>{ctaText}</span>
                <Image
                  src="/black-white-arrow.svg"
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain transition-transform"
                />
              </Link>
            )}
          </div>

          {faqs.length > 0 && <div className="border-t border-[var(--color-yellow)] lg:mt-2">
            {faqs.map((faq, index) => {
              const isActive = activeIndex === index;

              return (
                <div key={index} className="border-b border-[#D7D7D7]">
                  <button
                    type="button"
                    onClick={() => setActiveIndex(isActive ? -1 : index)}
                    className="flex w-full items-start justify-between gap-6 py-[21px] text-left"
                    aria-expanded={isActive}
                  >
                    <span className={`${isActive ? "font-bold" : "font-normal"} font-body text-[18px] leading-[26px] text-black md:text-[19px] md:leading-[28px]`}>
                      {faq.faq_title}
                    </span>
                    <span className="shrink-0 font-body text-[32px] font-normal leading-[28px] text-black">
                      {isActive ? "-" : "+"}
                    </span>
                  </button>

                  {isActive && faq.faq_content && (
                    <div
                      className="max-w-162.5 pb-6 font-body text-[15px] font-normal leading-[23px] text-[#1A1A1A]"
                      dangerouslySetInnerHTML={{ __html: faq.faq_content }}
                    />
                  )}
                </div>
              );
            })}
          </div>}
        </div>
      </div>
    </section>
  );
}
