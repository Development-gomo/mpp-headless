// src/components/sections/content-sections/service/ServiceMaintenanceGuideSection.jsx

import Image from "next/image";

function getImageUrl(image) {
  if (!image) return "";
  if (typeof image === "string") return image;
  return image?.url || image?.source_url || image?.sizes?.large || "";
}

export default function ServiceMaintenanceGuideSection({ data }) {
  if (!data) return null;

  const maintenance_guide_pointers =
    data.maintenance_guide_pointers ||
    data.maintenence_guide_pointers || // fallback for typo
    [];

  const {
    text_above_title,
    hero_title,
    hero_description,
    button_row = [],
    maintenance_section_note,
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
      className={`relative overflow-hidden ${custom_class || ""}`}
      style={
        background_color && !bgImg && !background_video_url
          ? { backgroundColor: background_color }
          : {}
      }
    >
      {/* Background video */}
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

      {/* Background image */}
      {bgImg && !background_video_url && (
        <Image
          src={bgImg}
          alt=""
          fill
          sizes="100vw"
          className="z-0 object-cover"
        />
      )}

      {/* Overlay */}
      {(bgImg || background_video_url) && (
        <div className="absolute inset-0 z-10 bg-black/20" />
      )}

      <div className="relative z-20 web-width px-6 pt-28 pb-16 md:pt-32 md:pb-24">
        {/* Header */}
        <div className="mb-16">
          {text_above_title && (
            <div className="mb-6 flex items-center gap-2">
              <span className="h-4 w-0.5 bg-[var(--color-yellow)]" />
              <p className="font-body text-[14px] font-medium uppercase leading-6 tracking-[0.56px] text-[#1A1A1A]">
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
              className="mt-6 font-body text-[16px] font-normal leading-6 text-[#1A1A1A]"
              dangerouslySetInnerHTML={{ __html: hero_description }}
            />
          )}
        </div>

        {/* Cards */}
        {maintenance_guide_pointers?.length > 0 && (
            <>
                {/* Spacer for negative top margin of images */}
                <div className="md:h-20" />
                <div className="flex flex-wrap gap-4 md:gap-6">
                    {maintenance_guide_pointers.map((item, index) => {
                    const pointerImage = getImageUrl(item?.pointer_image);

                    return (
                        <div
                        key={index}
                        className="relative flex flex-col items-center text-center rounded-lg bg-[#D9EEF7] px-4 py-6 w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[180px]"
                        >
                        {pointerImage && (
                            <div className="relative mb-4 h-[120px] w-full md:-mt-20">
                            <Image
                                src={pointerImage}
                                alt={item?.pointer_title || `Pointer ${index + 1}`}
                                fill
                                className="object-contain"
                            />
                            </div>
                        )}

                        {item?.pointer_above_title && (
                            <p
                            className="mb-1 font-heading text-[24px] font-medium leading-[36px] tracking-[-0.48px] text-black"
                            >
                            {item.pointer_above_title}
                            </p>
                        )}

                        {item?.pointer_title && (
                            <h3
                            className="mb-1 font-body text-[56px] font-bold leading-[64px] uppercase text-[var(--color-accent)]"
                            >
                            {item.pointer_title}
                            </h3>
                        )}

                        {item?.pointer_below_title && (
                            <p className="font-body text-[16px] font-normal leading-6 text-black">
                            {item.pointer_below_title}
                            </p>
                        )}
                        </div>
                    );
                    })}
                </div>
            </>
          
        )}

        {/* Section note */}
        {maintenance_section_note && (
          <p className="mt-6 font-body text-[16px] font-normal leading-6 text-black">
            {maintenance_section_note}
          </p>
        )}
      </div>
    </section>
  );
}