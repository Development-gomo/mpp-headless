import Image from "next/image";
import Link from "next/link";

function formatTitle(title = "") {
  return title
    .replaceAll("\u2028", "<br />")
    .replaceAll("\u00e2\u20ac\u00a8", "<br />");
}

function isDarkCard(color = "") {
  const normalized = color.trim().toLowerCase();

  return normalized === "#00709e" || normalized === "rgb(0,112,158)";
}

export default function HomeExpertAdviceSection({ data }) {
  if (!data) return null;

  const {
    text_above_title,
    hero_title,
    hero_description,
    cards = [],
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
      <div className="web-width px-6 md:px-0 py-20 md:py-28">
        <div className="mb-14 md:mb-18.5">
          {text_above_title && (
            <div className="mb-6 flex items-center gap-3">
              <span className="h-4 w-0.5 bg-[var(--color-yellow)]" />
              <p className="font-body text-[14px] font-medium uppercase leading-6 tracking-[0.56px] text-[#1A1A1A]">
                {text_above_title}
              </p>
            </div>
          )}

          {hero_title && (
            <h2 className="font-heading max-w-190 text-[36px] font-normal leading-11 tracking-[-0.72px] text-black md:text-[48px] md:leading-14 md:tracking-[-0.96px]"
              dangerouslySetInnerHTML={{ __html: formatTitle(hero_title) }}
            />
          )}

          {hero_description && (
            <div className="mt-6 max-w-162.5 font-body text-[16px] leading-6 text-[#1A1A1A]"
              dangerouslySetInnerHTML={{ __html: hero_description }}
            />
          )}
        </div>

        {cards?.length > 0 && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {cards.map((card, index) => {
              const darkCard = isDarkCard(card.background_color);

              return (
                <article
                  key={`${card.card_title || "expert-card"}-${index}`}
                  className={`relative min-h-[335px] overflow-hidden rounded-md p-8 md:p-10 ${
                    darkCard ? "text-white" : "text-black"
                  }`}
                  style={{
                    backgroundColor:
                      card.background_color ||
                      (darkCard ? "#00709E" : "#F3F4FB"),
                  }}
                >
                  <div
                    aria-hidden="true"
                    className={`absolute inset-0 bg-[url('/mpp-pattern.svg')] bg-size-[auto_425px] bg-right  bg-no-repeat ${
                      darkCard
                        ? "opacity-20 mix-blend-screen"
                        : "opacity-[0.08]"
                    }`}
                  />

                  <div className="relative z-10 flex min-h-[255px] flex-col items-start">
                    {card.card_title && (
                      <h3 className="mb-7 text-[38px] font-normal leading-[1.08] tracking-[-0.6px] md:text-[40px]">
                        {card.card_title}
                      </h3>
                    )}

                    {card.card_description && (
                      <p
                        className={`max-w-[590px] font-body text-[16px] font-normal leading-6 ${
                          darkCard ? "text-white" : "text-[#1A1A1A]"
                        }`}
                      >
                        {card.card_description}
                      </p>
                    )}

                    {card.card_cta_text && (
                      <Link
                        href={card.card_cta_link || "#"}
                        className={`group mt-auto inline-flex h-13 items-center gap-4 rounded-sm py-1.5 pr-1.5 pl-6 font-heading text-[14px] font-normal tracking-[-0.28px] transition-opacity hover:opacity-90 ${
                          darkCard
                            ? "bg-[var(--color-yellow)] text-black"
                            : "bg-[image:var(--mpp-gradient)] text-white"
                        }`}
                      >
                        <span>{card.card_cta_text}</span>

                        <Image
                          src="/black-white-arrow.svg"
                          alt=""
                          width={41}
                          height={40}
                          className="h-10 w-[41px] transition-transform"
                        />
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
