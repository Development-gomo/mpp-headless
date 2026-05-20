export default function ProductFeaturesSection({ product }) {
  const acf = product?.acf || {};
  const features = Array.isArray(acf.product_features) && acf.product_features.length > 0
    ? acf.product_features
    : [
        { feature_title: "Pump kit", feature_text: "Ready-to-fit pump and hose equipment for mobile refuelling." },
        { feature_title: "Filter kit", feature_text: "Add filtration for cleaner fuel handling in the field." },
        { feature_title: "Mounting brackets", feature_text: "Flatbed brackets and protective feet for secure transport." },
      ];

  if (features.length === 0) return null;

  return (
    <section id="accessories" className="bg-[#F3F4FB] text-black">
      <div className="web-width px-6 py-20 md:py-[120px]">
        <div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <div className="mb-6 flex items-center gap-2">
              <span className="h-[16px] w-[2px] bg-[var(--color-yellow)]" />
              <p className="font-body text-[14px] font-medium uppercase leading-[24px] tracking-[0.56px] text-[#1A1A1A]">
                {acf.product_features_eyebrow || "Accessories"}
              </p>
            </div>
            <h2
              className="max-w-[520px] font-heading text-[42px] leading-[50px] tracking-[-0.84px] text-black md:text-[48px] md:leading-[56px]"
              dangerouslySetInnerHTML={{
                __html: acf.product_features_title || "Select accessories for your tank",
              }}
            />
          </div>
          <p className="max-w-[460px] font-body text-[14px] leading-[22px] text-[#1A1A1A]">
            Add equipment that supports refuelling, mounting, and daily operation.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {features.map((feature, index) => (
            <article key={index} className="rounded-[4px] border border-[#DADDE8] bg-white p-3">
              <div className="mb-4 flex h-[112px] items-center justify-center rounded-[4px] bg-[#F3F4FB]">
                <span className="font-heading text-[40px] leading-none text-[var(--color-accent)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              {feature.feature_title && (
                <h3 className="mb-2 font-body text-[16px] font-bold leading-[22px] text-[var(--color-accent)]">
                  {feature.feature_title}
                </h3>
              )}
              {feature.feature_text && (
                <div
                  className="font-body text-[14px] leading-[22px] text-[#1A1A1A]"
                  dangerouslySetInnerHTML={{ __html: feature.feature_text }}
                />
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
