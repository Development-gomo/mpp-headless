// Layout: homepage_banner_with_features
// Fields: hero_title, hero_description, button_row, features, background_image, background_color, background_video_url, custom_class, custom_id

import Image from "next/image";
import Link from "next/link";

function getImageUrl(image) {
  if (!image) return null;
  if (typeof image === "string") return image;
  return image.url || image.source_url || image.sizes?.large || image.sizes?.full || null;
}

export default function HeroBannerWithFeatures({ data }) {
  if (!data) return null;

  const {
    hero_title,
    hero_description,
    features = [],
    button_row = [],
    background_image,
    background_color,
    background_video_url,
    custom_class,
    custom_id,
  } = data;

  const bgImg = getImageUrl(background_image);

  return (
    <section
      id={custom_id || undefined}
      className={`relative min-h-screen flex items-center overflow-hidden${
        custom_class ? ` ${custom_class}` : ""
      }`}
      style={
        background_color && !bgImg && !background_video_url
          ? { backgroundColor: background_color }
          : {}
      }
    >
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

      {(bgImg || background_video_url) && (
        <div className="absolute inset-0 bg-black/45 -z-10" />
      )}

      {/* Main Content */}
      <div className="relative web-width px-6 py-24 pb-48 w-full">
        <div className="max-w-4xl flex flex-col gap-8">
          {hero_title && (
            <h1 className="text-5xl lg:text-7xl font-normal font-heading text-white ">
              {hero_title}
            </h1>
          )}

          {hero_description && (
            <div
              className="text-white text-lg max-w-xl font-body" 
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
                      ? "inline-flex justify-end items-center gap-4 py-[6px] pr-[6px] pl-6 rounded-[4px] bg-[image:var(--mpp-gradient)] text-white font-heading text-[14px] font-normal leading-[normal] tracking-[-0.28px] hover:opacity-90 transition-opacity group"
                      : "inline-flex justify-end items-center gap-4 py-[6px] pr-[6px] pl-6 rounded-[4px] border border-white text-white font-heading text-[14px] font-normal leading-[normal] tracking-[-0.28px] hover:bg-white/10 transition-colors group"
                  }
                >
                  <span>{btn.button_label}</span>

                  <Image
                    src="/black-white-arrow.svg"
                    alt=""
                    width={36}
                    height={36}
                    className="w-[36px] h-autoobject-contain transition-transform group-hover:translate-x-1"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Features Bottom Bar */}
      {features?.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 bg-black/25 backdrop-blur-[2px]">
          <div className="web-width px-6 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {features.map((feature, index) => {
                const iconUrl = getImageUrl(feature.feature_icon);

                return (
                  <div key={index} className="flex flex-col items-start gap-2">
                    {iconUrl ? (
                      <Image
                        src={iconUrl}
                        alt=""
                        height={22}
                        width={22}
                        className="mt-1 min-h-[22px] max-h-[22px]"
                      />
                    ) : (
                      <span className="mt-1 text-[22px] leading-none text-(--color-accent)">
                        {feature.feature_icon}
                      </span>
                    )}

                    {feature.feature_text && (
                      <div
                        className="text-white text-sm leading-relaxed max-w-[180px]"
                        dangerouslySetInnerHTML={{
                          __html: feature.feature_text,
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}