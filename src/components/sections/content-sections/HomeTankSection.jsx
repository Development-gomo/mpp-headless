// Layout: homepage_tank_section
// Fields: hero_title, hero_description, button_row, hero_image, rotating_text, background_image, background_color, background_video_url, custom_class, custom_id

import Image from "next/image";
import Link from "next/link";

export default function HomeTankSection({ data }) {
  if (!data) return null;

  const {
    hero_title,
    text_above_title,
    hero_description,
    button_row = [],
    hero_image,
    rotating_text = [],
    background_image,
    background_color,
    background_video_url,
    custom_class,
    custom_id,
  } = data;

  const bgImg = background_image?.url || background_image?.sizes?.large;
  const heroImg = hero_image?.url || hero_image?.sizes?.large;

  return (
    <section
      id={custom_id || undefined}
      className={`relative flex min-h-[620px] items-center overflow-hidden bg-[var(--color-accent)] ${
        custom_class ? ` ${custom_class}` : ""
      }`}
      style={
        background_color && !bgImg && !background_video_url
          ? { backgroundColor: background_color }
          : {}
      }
    >
      {/* Background Video */}
      {background_video_url && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 z-0 h-full w-full object-cover"
        >
          <source src={background_video_url} />
        </video>
      )}

      {/* Background Image */}
      {bgImg && !background_video_url && (
        <Image
          src={bgImg}
          alt=""
          fill
          sizes="100vw"
          priority
          className="z-0 object-cover"
        />
      )}

      {/* Overlay */}
      {(bgImg || background_video_url) && (
        <div className="absolute inset-0 z-[1] bg-black/20" />
      )}

      {/* Right-side pattern */}
      <div
        className="pointer-events-none absolute right-0 top-0 z-[2] hidden h-full w-[52%] bg-no-repeat opacity-20 lg:block"
        style={{
          backgroundImage: "url('/mpp-pattern.svg')",
          backgroundSize: "90%",
          backgroundPosition: "right -120px top -80px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 web-width grid w-full grid-cols-1 items-center gap-10 px-6 pb-[130px] pt-28 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:pb-[150px] lg:pt-32">
        {/* LEFT — Text */}
        <div className="flex max-w-[560px] flex-col items-start">
          {text_above_title && (
            <div className="mb-6 flex items-center gap-3">
              <span className="h-[16px] w-[2px] bg-[var(--color-yellow)]" />

              <p className="font-body text-[14px] font-medium uppercase leading-6 tracking-[0.56px] text-white">
                {text_above_title}
              </p>
            </div>
          )}

          {hero_title && (
            <h1
              className="font-heading max-w-[620px] text-[40px] font-normal leading-[48px] tracking-[-0.8px] text-white md:text-[56px] md:leading-[64px] md:tracking-[-1.12px] lg:text-[64px] lg:leading-[72px] lg:tracking-[-1.28px]"
              dangerouslySetInnerHTML={{ __html: hero_title }}
            />
          )}

          {hero_description && (
            <div
              className="mt-6 max-w-[520px] font-body text-[16px] font-normal leading-6 text-white"
              dangerouslySetInnerHTML={{ __html: hero_description }}
            />
          )}

          {button_row?.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-4">
              {button_row.map((btn, i) => (
                <Link
                  key={i}
                  href={btn.button_link || "#"}
                  target={btn.button_target || undefined}
                  className={
                    i === 0
                      ? "group inline-flex items-center gap-4 rounded-sm bg-[var(--color-yellow)] py-1.5 pr-1.5 pl-6 font-heading text-[14px] font-normal tracking-[-0.28px] text-black transition-opacity hover:opacity-90"
                      : "group inline-flex items-center gap-4 rounded-sm bg-[#445641] py-1.5 pr-1.5 pl-6 font-heading text-[14px] font-normal tracking-[-0.28px] text-white transition-opacity hover:opacity-90"
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

        {/* RIGHT — Hero Image */}
        {heroImg && (
          <div className="relative z-10 flex w-full items-center justify-center lg:justify-end">
            <Image
              src={heroImg}
              alt={hero_title || "Hero image"}
              width={900}
              height={600}
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="h-auto w-full max-w-[760px] object-contain"
            />
          </div>
        )}
      </div>

      {/* Static Text Marquee */}
      {rotating_text?.length > 0 && (
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[3] overflow-hidden py-6">
            <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap">
            {[...rotating_text, ...rotating_text, ...rotating_text].map(
                (item, index) => (
                <div key={index} className="flex items-center gap-8">
                    <span className="font-heading text-[52px] leading-[48px] font-bold uppercase tracking-[2.8px] text-white/15 md:text-[80px] md:leading-[72px] md:tracking-[4.8px]">
                    {item?.rotating_word}
                    </span>

                    <span className="h-[8px] w-[8px] shrink-0 rounded-full bg-[var(--color-yellow)]" />
                </div>
                )
            )}
            </div>
        </div>
        )}
    </section>
  );
}
