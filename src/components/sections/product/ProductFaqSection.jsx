"use client";

import { useState } from "react";

export default function ProductFaqSection({ product }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const faqs = Array.isArray(product?.acf?.product_faqs) ? product.acf.product_faqs : [];

  if (faqs.length === 0) return null;

  return (
    <section id="faqs" className="bg-white">
      <div className="web-width px-6 py-20 md:py-[120px]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <div className="mb-6 flex items-center gap-2">
              <span className="h-[16px] w-[2px] bg-[var(--color-yellow)]" />
              <p className="font-body text-[14px] font-medium uppercase leading-[24px] tracking-[0.56px] text-[#1A1A1A]">
                FAQ
              </p>
            </div>
            <h2 className="max-w-[560px] font-heading text-[42px] leading-[50px] tracking-[-0.84px] text-black md:text-[48px] md:leading-[56px]">
              Common questions about our <span>fuel tanks</span>
            </h2>
            <p className="mt-8 max-w-[420px] font-body text-[20px] leading-[28px] text-black">
              Can&apos;t find what you are looking for? Then contact us here.
            </p>
          </div>

          <div className="border-t border-[var(--color-yellow)]">
            {faqs.map((faq, index) => {
              const isActive = activeIndex === index;

              return (
                <div key={index} className="border-b border-black/20">
                  <button
                    type="button"
                    onClick={() => setActiveIndex(isActive ? -1 : index)}
                    className="flex w-full items-start justify-between gap-6 py-5 text-left"
                    aria-expanded={isActive}
                  >
                    <span className={`${isActive ? "font-bold" : "font-normal"} font-body text-[18px] leading-[26px] text-black md:text-[20px] md:leading-[28px]`}>
                      {faq.faq_title}
                    </span>
                    <span className="shrink-0 font-body text-[24px] leading-[28px] text-black">
                      {isActive ? "-" : "+"}
                    </span>
                  </button>

                  {isActive && faq.faq_content && (
                    <div
                      className="max-w-[720px] pb-6 font-body text-[16px] leading-[24px] text-[#1A1A1A]"
                      dangerouslySetInnerHTML={{ __html: faq.faq_content }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
