import Image from "next/image";
import Link from "next/link";

function getMediaUrl(media) {
  if (!media) return "";
  if (typeof media === "string") return media;

  return media.url || media.source_url || media.sizes?.full || media.sizes?.large || "";
}

function getButtonLink(button) {
  const link = button?.button_link;

  if (typeof link === "string") {
    return {
      href: link || "#",
      label: button?.button_label || "",
      target: button?.button_target || undefined,
    };
  }

  return {
    href: link?.url || "#",
    label: button?.button_label || link?.title || "",
    target: button?.button_target || link?.target || undefined,
  };
}

export default function FullWidthContentSection({ data }) {
  if (!data) return null;

  const {
    text_above_title,
    hero_title,
    hero_description,
    button_row = [],
    background_image,
    background_color,
    background_video_url,
    custom_class,
    custom_id,
  } = data;

  const backgroundImageUrl = getMediaUrl(background_image);
  const backgroundVideoUrl = getMediaUrl(background_video_url);
  const hasMediaBackground = Boolean(backgroundImageUrl || backgroundVideoUrl);
  const textColor = hasMediaBackground ? "text-white" : "text-[#1A1A1A]";

  return (
    <section
      id={custom_id || undefined}
      className={`relative overflow-hidden${custom_class ? ` ${custom_class}` : ""}`}
      style={background_color ? { backgroundColor: background_color } : {}}
    >
      {backgroundVideoUrl && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 z-0 h-full w-full object-cover"
        >
          <source src={backgroundVideoUrl} />
        </video>
      )}

      {!backgroundVideoUrl && backgroundImageUrl && (
        <Image
          src={backgroundImageUrl}
          alt=""
          fill
          sizes="100vw"
          className="z-0 object-cover"
        />
      )}

      {hasMediaBackground && <div className="absolute inset-0 z-10 bg-black/40" />}

      <div className="web-width relative z-20 px-6 md:px-0 py-20 md:py-[120px]">
        {text_above_title && (
          <div className="mb-6 flex items-center gap-2">
            <span className="h-4 w-0.5 bg-[var(--color-yellow)]" />
            <p
              className={`font-body text-[14px] font-medium uppercase leading-[24px] tracking-[0.56px] ${textColor}`}
            >
              {text_above_title}
            </p>
          </div>
        )}

        {hero_title && (
          <h2
            className={`font-heading text-[42px] font-normal leading-[50px] tracking-[-0.84px] md:text-[52px] md:leading-[60px] md:tracking-[-1.04px] ${textColor}`}
            dangerouslySetInnerHTML={{ __html: hero_title }}
          />
        )}

        {hero_description && (
          <div
            className={`font-body mt-6 text-[16px] font-normal space-y-4 [&_a]:text-[#00709e] [&_h2]:text-[#000] [&_h2]:text-[22px]  leading-[24px] ${textColor}`}
            dangerouslySetInnerHTML={{ __html: hero_description }}
          />
        )}

        {button_row?.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-4">
            {button_row.map((button, index) => {
              const { href, label, target } = getButtonLink(button);

              return (
                <Link
                  key={index}
                  href={href}
                  target={target}
                  className="group inline-flex items-center gap-4 rounded-[4px] bg-[image:var(--mpp-gradient)] py-[6px] pr-[6px] pl-6 font-heading text-[14px] font-normal tracking-[-0.28px] text-white transition-opacity hover:opacity-90"
                >
                  <span>{label}</span>
                  <Image
                    src="/black-white-arrow.svg"
                    alt=""
                    width={40}
                    height={40}
                    className="h-auto w-[40px] object-contain transition-transform"
                  />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
