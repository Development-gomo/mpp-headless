import Image from "next/image";
import { DEFAULT_LANGUAGE } from "@/lib/i18n";
import {
  getProductImage,
  getRendered,
  getRepeaterValues,
  stripHtml,
} from "./productUtils";
import { getProductLabels } from "./productLabels";

function SpecTile({ icon, label, value }) {
  if (!value) return null;

  return (
    <div className="flex min-h-[58px] min-w-0 items-center gap-3 rounded-sm bg-[#A8D4E4] px-3 py-1.5">
      <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center">
        <Image src={icon} alt="" width={32} height={32} className="h-8 w-8 object-contain" />
      </span>
      <span>
        <span className="block font-body text-[9px] leading-[12px] text-black">
          {label}
        </span>
        <strong className="block font-body text-[16px] font-normal leading-5 text-black">
          {value}
        </strong>
      </span>
    </div>
  );
}

export default function ProductAccessoryOverview({
  product,
  language = DEFAULT_LANGUAGE,
}) {
  const acf = product?.acf || {};
  const fields = acf.accessory_type_product_fields || {};
  const labels = getProductLabels(language);

  const title = stripHtml(getRendered(product?.title)) || "Product";
  const image = getProductImage(product);
  const articleNumber = stripHtml(
    fields.artical_number ||
      fields.article_number ||
      product?.sku ||
      acf.article_number ||
      ""
  );
  const dimensions = stripHtml(
    fields.dimention || fields.dimension || acf.dimention || acf.dimension || ""
  );
  const weight = stripHtml(fields.weight || fields.net_weight || acf.net_weight || "");
  const applicationAreas = getRepeaterValues(
    fields.application_areas,
    "application_area"
  );
  const specs = Array.isArray(acf.product_specs) ? acf.product_specs : [];

  return (
    <section className="bg-white text-black">
      <div className="web-width px-6 pb-20 pt-2 md:pb-30">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,610px)_minmax(0,1fr)] xl:gap-5">
          <div className="relative flex min-h-75 items-center justify-center overflow-hidden rounded-lg border border-[#DDD8CE] bg-white md:min-h-[392px]">
            {image ? (
              <Image
                src={image}
                alt={title}
                fill
                priority
                sizes="(min-width: 1024px) 610px, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="flex min-h-75 items-center justify-center font-body text-[14px] text-black/50 md:min-h-[392px]">
                {labels.imageMissing}
              </div>
            )}
          </div>

          <div className="rounded-lg bg-[#E5F2F7] p-6 md:p-8">
            <h1 className="max-w-155 font-heading text-[36px] font-normal leading-[46px] tracking-[-0.84px] text-black md:text-[48px] md:leading-14.5">
              {title}
            </h1>

            {articleNumber && (
              <div className="mt-3 font-heading text-[24px] font-normal leading-8 text-black">
                {articleNumber}
              </div>
            )}

            {(dimensions || weight) && (
              <div className="mt-7 flex flex-wrap gap-3 md:gap-4">
                <SpecTile
                  icon="/dimention-ico.svg"
                  label={labels.hero.dimensions}
                  value={dimensions}
                />
                <SpecTile
                  icon="/weight-ico.svg"
                  label={labels.hero.netWeight}
                  value={weight}
                />
              </div>
            )}

            {applicationAreas.length > 0 && (
              <div className="mt-6 border-y border-black/15 py-5 font-body text-[15px] leading-6 text-black">
                <div className="grid gap-2 sm:grid-cols-[140px_1fr]">
                  <strong className="font-semibold">
                    {labels.hero.applicationAreas}:
                  </strong>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {applicationAreas.map((item) => (
                      <span
                        key={item}
                        className="before:mr-2 before:text-[var(--color-yellow)] before:content-['•']"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {specs.length > 0 && (
              <div className="mt-6">
                <h2 className="font-heading text-[18px] leading-6 tracking-[-0.36px] text-black">
                  {labels.accessoryOverview.specifications}
                </h2>
                <div className="mt-4 flex gap-x-4">
                  {specs.map((spec, index) => (
                    <div
                      key={`${spec.spec_label}-${index}`}
                      className="border-b border-black/10 pb-2"
                    >
                      <p className="font-body text-[12px] uppercase tracking-[0.4px] text-black/60">
                        {spec.spec_label}
                      </p>
                      <p
                        className="font-body text-[15px] font-medium text-black"
                        dangerouslySetInnerHTML={{ __html: spec.spec_value }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
