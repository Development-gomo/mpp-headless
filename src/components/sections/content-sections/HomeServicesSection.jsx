"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function HomeServicesSection({ data }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!data) return null;

  const {
    text_above_title,
    hero_title,
    hero_description,
    button_row = [],
    hero_image,
    services = [],
    background_color,
    custom_class,
    custom_id,
  } = data;

  const heroImg = hero_image?.url || hero_image?.sizes?.large || "";

  return (
    <section
      id={custom_id || undefined}
      className={`relative bg-[#F1F1F3] ${custom_class || ""}`}
      style={background_color ? { backgroundColor: background_color } : {}}
    >
      <div className="web-width px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div>
            {text_above_title && (
              <div className="flex items-center gap-2 mb-5">
                <span className="w-[2px] h-[10px] bg-[var(--color-yellow)]" />
                <p className="text-[#1A1A1A] text-[14px] leading-[24px] font-medium tracking-[0.56px] uppercase font-body">
                  {text_above_title}
                </p>
              </div>
            )}

            {hero_title && (
              <h2
                className="text-black text-[52px] leading-[1.05] font-normal tracking-[-1px] mb-6"
                dangerouslySetInnerHTML={{ __html: hero_title }}
              />
            )}

            {hero_description && (
              <div
                className="text-[#1A1A1A] text-[16px] leading-[24px] font-body mb-6"
                dangerouslySetInnerHTML={{ __html: hero_description }}
              />
            )}

            {button_row?.length > 0 && (
              <div className="flex flex-wrap gap-4 mb-12">
                {button_row.map((btn, i) => (
                  <Link
                    key={i}
                    href={btn.button_link || "#"}
                    className="group inline-flex items-center gap-4 rounded-[4px] bg-[image:var(--mpp-gradient)] py-[6px] pr-[6px] pl-6 text-white font-heading text-[14px] tracking-[-0.28px] hover:opacity-90 transition-opacity"
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

            {services?.length > 0 && (
              <div className="border-t border-black/15">
                {services.map((service, index) => {
                  const isActive = activeIndex === index;

                  return (
                    <div
                      key={index}
                      className="border-b border-black/15 py-6"
                    >
                      <button
                        type="button"
                        onClick={() => setActiveIndex(isActive ? -1 : index)}
                        className="flex w-full items-center justify-between gap-6 text-left"
                      >
                        <h3 className="text-black text-[26px] leading-[34px] font-medium tracking-[-0.52px] font-heading">
                          {service.service_title}
                        </h3>

                        <span className="text-black text-[28px] leading-none">
                          {isActive ? "−" : "+"}
                        </span>
                      </button>

                      {isActive && service.service_description && (
                        <div
                          className="mt-5 max-w-[520px] text-[#1A1A1A] text-[16px] leading-[24px] font-body"
                          dangerouslySetInnerHTML={{
                            __html: service.service_description,
                          }}
                        />
                      )}

                      {isActive && (
                        <Link
                          href="#"
                          className="mt-6 inline-flex"
                          aria-label={service.service_title}
                        >
                          <Image
                            src="/orange-black-arrow.svg"
                            alt=""
                            width={36}
                            height={36}
                            className="w-[36px] h-auto object-contain transition-transform hover:translate-x-1"
                          />
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right */}
          {heroImg && (
            <div className="relative h-[620px] overflow-hidden">
              <Image
                src={heroImg}
                alt={hero_title || "Services image"}
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