// Layout: hero_with_image
// Fields: hero_title, hero_description, button_row, hero_image, background_image, background_color, background_video_url, custom_class, custom_id

import Image from "next/image";
import Link from "next/link";

export default function HeroWithImage({ data }) {
  if (!data) return null;

  const {
    hero_title,
    text_above_title,
    hero_description,
    button_row = [],
    hero_image,
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
      className={`relative flex items-center overflow-hidden ${custom_class ? ` ${custom_class}` : ""}`}
      style={background_color && !bgImg && !background_video_url ? { backgroundColor: background_color } : {}}
    >
      {/* Background Video */}
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

      {/* Background Image */}
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

      {/* Overlay */}
      {(bgImg || background_video_url) && (
        <div className="absolute inset-0 bg-black/40 -z-10" />
      )}

      {/* Right-side pattern */}
      <div
        className="pointer-events-none absolute right-0 top-1/2 z-0 hidden h-full w-[55%] -translate-y-1/2 bg-no-repeat opacity-20 lg:block"
        style={{
          backgroundImage: "url('/mpp-pattern.svg')",
          backgroundSize: "80%",
          backgroundPosition: "right center",
        }}
      />

      {/* Content */}
      <div className="relative z-10 web-width px-6 py-24 w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* LEFT — Text */}
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            {/* Left border */}
            <span className="w-0.5 h-4 bg-[var(--color-yellow)]"></span>

            {/* Text */}
            <p className="text-white text-[14px] font-medium leading-6 tracking-[0.56px] uppercase [font-family:var(--font-nunito-sans)]">
              {text_above_title}
            </p>
          </div>
          {hero_title && (
            <h1 className="text-6xl font-bold text-white max-w-4xl">{hero_title}</h1>
          )}

          {hero_description && (
            <div
              className="text-white text-lg max-w-xl"
              dangerouslySetInnerHTML={{ __html: hero_description }}
            />
          )}

          {button_row?.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {button_row.map((btn, i) => (
                <Link
                  key={i}
                  href={btn.button_link || "#"}
                  className={
                    i === 0
                      ? "inline-flex justify-end items-center gap-4 py-1.5 pr-1.5 pl-6 rounded-sm bg-[var(--color-yellow)] text-black font-[var(--font-heading)] text-[14px] font-normal leading-[normal] tracking-[-0.28px] hover:opacity-90 transition-opacity group"
                      : "inline-flex items-center gap-2 rounded-sm border border-white px-6 py-4 text-white font-medium hover:bg-white/10 transition-colors"
                  }
                >
                  {btn.button_label}

                  <Image
                    src="/black-white-arrow.svg"
                    alt=""
                    width={36}
                    height={36}
                    className="object-contain transition-transform"
                  />

                </Link>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — Hero Image */}
        {heroImg && (
        <div className="flex w-full items-center justify-center lg:justify-end">
          <Image
            src={heroImg}
            alt={hero_title || "Hero image"}
            width={900}
            height={600}
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="h-auto w-full max-w-[560px] object-contain z-10"
          />
        </div>
        )}
      </div>
    </section>
  );
}
