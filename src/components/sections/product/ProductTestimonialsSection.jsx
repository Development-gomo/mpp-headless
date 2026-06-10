import Image from "next/image";
import Link from "next/link";
import { DEFAULT_LANGUAGE, localizePath } from "@/lib/i18n";
import { getButtonHref, getImageUrl, stripHtml } from "./productUtils";

function pickFirstObject(candidates = []) {
  return (
    candidates.find(
      (item) => item && typeof item === "object" && !Array.isArray(item)
    ) || {}
  );
}

function resolveThemeOptions(data) {
  return pickFirstObject([
    data?.options?.acf,
    data?.options,
    data?.data?.acf,
    data?.data,
    data?.acf,
    data,
  ]);
}

function getTestimonials(themeOptions) {
  const options = resolveThemeOptions(themeOptions);
  const testimonials =
    options?.testimonials ||
    options?.global?.testimonials ||
    options?.theme_options?.testimonials ||
    [];

  return Array.isArray(testimonials)
    ? testimonials.filter((item) => item?.testimonial_text || item?.person_name)
    : [];
}

function TestimonialCard({ testimonial }) {
  const imageUrl = getImageUrl(testimonial?.person_image);
  const name = stripHtml(testimonial?.person_name || "");
  const designation = stripHtml(testimonial?.person_designation || "");
  const text = stripHtml(testimonial?.testimonial_text || "");

  return (
    <article className="rounded-[8px] bg-white px-5 py-6">
      <Image
        src="/testimonial-ico.svg"
        alt=""
        width={60}
        height={42}
        className="h-auto w-[60px]"
      />

      {text && (
        <p className="mt-7 min-h-[110px] font-body text-[15px] leading-[23px] text-black">
          {text}
        </p>
      )}

      <div className="mt-6 border-t border-[#98C8DA] pt-4">
        <div className="flex items-center gap-3">
          <div className="relative h-[32px] w-[32px] shrink-0 overflow-hidden rounded-full bg-[#E5F2F7]">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={name || "Testimonial author"}
                fill
                sizes="32px"
                className="object-cover"
              />
            )}
          </div>
          <div className="min-w-0">
            {name && (
              <h3 className="font-body text-[14px] font-bold leading-[18px] text-black">
                {name}
              </h3>
            )}
            {designation && (
              <p className="font-body text-[12px] leading-[16px] text-[#1A1A1A]">
                {designation}
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ProductTestimonialsSection({
  themeOptions,
  product,
  language = DEFAULT_LANGUAGE,
}) {
  const testimonials = getTestimonials(themeOptions);
  if (testimonials.length === 0) return null;

  const ctaText =
    product?.acf?.testimonial_cta_text ||
    product?.acf?.product_primary_cta_text ||
    "Talk to our experts";
  const ctaHref = getButtonHref(
    product?.acf?.testimonial_cta_link || product?.acf?.product_primary_cta_link,
    localizePath("/rfq", language)
  );

  return (
    <section id="testimonials" className="bg-[#F3F4FB] text-black">
      <div className="web-width px-6 py-20 md:py-[120px]">
        <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <div className="mb-7 flex items-center gap-2">
              <span className="h-[16px] w-[2px] bg-[var(--color-yellow)]" />
              <p className="font-body text-[13px] font-medium uppercase leading-[22px] tracking-[0.52px] text-[#1A1A1A]">
                Testimonials
              </p>
            </div>
            <h2 className="font-heading text-[42px] font-normal leading-[50px] tracking-[-0.84px] md:text-[48px] md:leading-[56px]">
              What our <span>customers say</span>
            </h2>
          </div>

          <Link
            href={ctaHref}
            className="group inline-flex h-[48px] w-fit items-center gap-4 rounded-sm bg-[var(--color-accent)] py-1.5 pr-1.5 pl-6 font-heading text-[14px] tracking-[-0.28px] text-white transition-opacity hover:opacity-90"
          >
            <span>{ctaText}</span>
            <Image
              src="/black-white-arrow.svg"
              alt=""
              width={36}
              height={36}
              className="h-[36px] w-9 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {testimonials.slice(0, 4).map((testimonial, index) => (
            <TestimonialCard
              key={`${testimonial?.person_name || "testimonial"}-${index}`}
              testimonial={testimonial}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
