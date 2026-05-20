// src/components/sections/content-sections/service/ServiceProcessSection.jsx

import Image from "next/image";
import Link from "next/link";

export default function ServiceProcessSection({ data }) {
  if (!data) return null;

  const {
    text_above_title,
    hero_title,
    hero_description,
    process_pointers = [],
    button_row = [],
    background_color,
    custom_class,
    custom_id,
  } = data;

  return (
    <section
      id={custom_id || undefined}
      className={`relative bg-white ${custom_class || ""}`}
      style={background_color ? { backgroundColor: background_color } : {}}
    >
      <div className="web-width px-6 py-20 md:py-[120px]">
        {/* Header */}
        <div className="mb-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[680px]">
            {text_above_title && (
              <div className="mb-6 flex items-center gap-2">
                <span className="h-[16px] w-[2px] bg-[var(--color-yellow)]" />

                <p className="font-body text-[14px] font-medium uppercase leading-[24px] tracking-[0.56px] text-[#1A1A1A]">
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
                className="mt-6 max-w-[620px] font-body text-[16px] font-normal leading-[24px] text-[#1A1A1A]"
                dangerouslySetInnerHTML={{ __html: hero_description }}
              />
            )}
          </div>

          {button_row?.length > 0 && (
            <div className="flex flex-wrap gap-4 lg:pb-2">
              {button_row.map((btn, index) => (
                <Link
                  key={index}
                  href={btn.button_link || "#"}
                  target={btn.button_target || undefined}
                  className={
                    index === 0
                      ? "group inline-flex items-center gap-4 rounded-[4px] bg-[image:var(--mpp-gradient)] py-[6px] pr-[6px] pl-6 font-heading text-[14px] font-normal tracking-[-0.28px] text-white transition-opacity hover:opacity-90"
                      : "group inline-flex items-center gap-4 rounded-[4px] bg-[var(--color-yellow)] py-[6px] pr-[6px] pl-6 font-heading text-[14px] font-normal tracking-[-0.28px] text-black transition-opacity hover:opacity-90"
                  }
                >
                  <span>{btn.button_label}</span>

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

        {/* Timeline line */}
        {process_pointers?.length > 0 && (
          <div className="relative mb-8 hidden lg:block">
            <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-black/25" />

            <div
              className="relative grid"
              style={{
                gridTemplateColumns: `repeat(${process_pointers.length}, minmax(0, 1fr))`,
              }}
            >
              {process_pointers.map((_, index) => (
                <div key={index} className="flex justify-start">
                  <span className="process-dot relative z-10 h-[14px] w-[14px] rounded-full border-[3px] border-[var(--color-yellow)] bg-white opacity-0" style={{ animationDelay: `${index * 140}ms` }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cards */}
        {process_pointers?.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {process_pointers.map((item, index) => {
            const number = String(index + 1).padStart(2, "0");

            return (
                <article
                key={index}
                className="process-card relative min-h-[260px] rounded-[4px] bg-[var(--color-accent)] px-6 py-7 text-white opacity-0"
                style={{
                    animationDelay: `${index * 140}ms`,
                }}
                >
                <span className="absolute left-6 top-0 block h-[14px] w-[14px] -translate-y-1/2 rounded-full border-[3px] border-[var(--color-yellow)] bg-white lg:hidden" />

                <span className="mb-8 block font-heading text-[56px] font-medium leading-[60px] tracking-[-1.12px] text-white/20 md:text-[64px] md:leading-[68px]">
                    {number}.
                </span>

                {item?.process_title && (
                    <h3 className="mb-12 font-heading text-[24px] font-medium leading-[32px] tracking-[-0.48px] text-white">
                    {item.process_title}
                    </h3>
                )}

                {item?.process_description && (
                    <p className="font-body text-[16px] font-normal leading-[24px] text-white">
                    {item.process_description}
                    </p>
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