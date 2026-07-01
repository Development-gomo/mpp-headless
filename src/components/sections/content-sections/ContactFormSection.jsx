"use client";

import ContactForm from "../contact-form/ContactForm";

export default function ContactFormSection({ data, language }) {
  if (!data) return null;

  const {
    text_above_title,
    hero_title,
    hero_description,
    background_color,
    location,
    custom_class,
    custom_id,
  } = data;

  const selectedForm = data.select_form;
  const formId =
    typeof selectedForm === "object"
      ? (selectedForm?.ID ?? selectedForm?.id ?? selectedForm?.value)
      : selectedForm;

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
                <span className="w-0.5 h-[10px] bg-[var(--color-yellow)]" />
                <p className="text-[#1A1A1A] text-[14px] leading-6 font-medium tracking-[0.56px] uppercase font-body">
                  {text_above_title}
                </p>
              </div>
            )}

            {hero_title && (
              <h2
                className="font-heading mb-6 text-[36px] font-normal leading-11 tracking-[-0.72px] text-black md:text-[48px] md:leading-14 md:tracking-[-0.96px]"
                dangerouslySetInnerHTML={{ __html: hero_title }}
              />
            )}

            {hero_description && (
              <div
                className="text-[#1A1A1A] text-[16px] leading-6 font-body mb-6"
                dangerouslySetInnerHTML={{ __html: hero_description }}
              />
            )}
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 mb-10">
          <ContactForm formId={formId} language={language} />
          {location && (
            <div
              className="mb-6"
              dangerouslySetInnerHTML={{ __html: location }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
