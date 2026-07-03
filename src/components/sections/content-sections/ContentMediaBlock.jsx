// Layout: content_media_block
// Fields: text_above_title, title, content, image, button_row, image_position, background_color, custom_class, custom_id

import Image from "next/image";
import Link from "next/link";

function getButtonDetails(button = {}) {
  const link = button.button_link;

  if (typeof link === "string") {
    return {
      href: link || "#",
      label: button.button_label || "",
      target: button.button_target || undefined,
    };
  }

  return {
    href: link?.url || "#",
    label: button.button_label || link?.title || "",
    target: button.button_target || link?.target || undefined,
  };
}

export default function ContentMediaBlock({ data }) {
  if (!data) return null;

  const {
    text_above_title,
    title,
    content,
    image,
    button_row = [],
    image_position = "left",
    background_color,
    custom_class,
    custom_id,
  } = data;

  const imgUrl = image?.url || image?.sizes?.large;

  // On desktop: flex-row for left, flex-row-reverse for right
  // On mobile: image always on top (flex-col)
  const rowDirection =
    image_position === "right" ? "md:flex-row-reverse" : "md:flex-row";

  return (
    <section
      id={custom_id || undefined}
      className={`web-width px-6 py-16 md:py-24${custom_class ? ` ${custom_class}` : ""}`}
      style={background_color ? { backgroundColor: background_color } : {}}
    >
      <div className={`flex flex-col ${rowDirection} items-center gap-10 md:gap-16`}>
        {/* Image */}
        {imgUrl && (
          <div className="w-full md:w-1/2 relative aspect-[4/3] rounded-md overflow-hidden">
            <Image
              src={imgUrl}
              alt={image?.alt || title || ""}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* Text content */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          {text_above_title && (
            <div className="flex items-center gap-2">
              <span className="h-4 w-0.5 bg-[var(--color-yellow)]" />
              <p className="font-body text-[14px] font-medium uppercase leading-6 tracking-[0.56px] text-[#1A1A1A]">
                {text_above_title}
              </p>
            </div>
          )}

          {title && (
            <h2
              className="font-heading text-[36px] font-normal leading-11 tracking-[-0.72px] text-black md:text-[48px] md:leading-14 md:tracking-[-0.96px]"
              dangerouslySetInnerHTML={{ __html: title }}
            />
          )}

          {content && (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}

          {button_row?.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {button_row.map((button, index) => {
                const { href, label, target } = getButtonDetails(button);
                if (!label) return null;

                return (
                  <Link
                    key={index}
                    href={href}
                    target={target}
                    className="group inline-flex items-center gap-4 rounded-sm bg-[image:var(--mpp-gradient)] py-1.5 pr-1.5 pl-6 font-heading text-[14px] font-normal tracking-[-0.28px] text-white transition-opacity hover:opacity-90"
                  >
                    <span>{label}</span>

                    <Image
                      src="/black-white-arrow.svg"
                      alt=""
                      width={40}
                      height={40}
                      className="h-auto w-10 object-contain transition-transform"
                    />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
