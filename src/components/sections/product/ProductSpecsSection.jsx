import Image from "next/image";
import Link from "next/link";
import {
  getButtonHref,
  getButtonTarget,
  getImageUrl,
  getVariationCapacity,
} from "./productUtils";

function normalizeSpecs(product, selectedVariation) {
  const acf = product?.acf || {};
  const variationSpecs = Array.isArray(selectedVariation?.product_specs)
    ? selectedVariation.product_specs
    : [];
  const specs = Array.isArray(acf.product_specs) ? acf.product_specs : [];
  const fallbackSpecs = [
    {
      spec_label: "Capacity",
      spec_value:
        getVariationCapacity(selectedVariation) ||
        acf.capacity ||
        acf.product_capacity,
      spec_icon: "/capacity-icon.svg",
    },
    { spec_label: "Fuel type", spec_value: acf.fuel_type || acf.product_fuel_type, spec_icon: "/fuel-type-icon.svg" },
    { spec_label: "Material", spec_value: acf.product_material },
    {
      spec_label: "Dimensions",
      spec_value:
        selectedVariation?.dimensions ||
        acf.product_dimensions ||
        acf.dimention ||
        acf.dimension,
    },
  ].filter((item) => item.spec_value);

  if (variationSpecs.length > 0) return variationSpecs;

  return specs.length > 0 ? specs : fallbackSpecs;
}

export default function ProductSpecsSection({ product, selectedVariation = null }) {
  const acf = product?.acf || {};
  const specs = normalizeSpecs(product, selectedVariation);
  if (specs.length === 0) return null;
  const productSheetHref = getButtonHref(acf.product_sheet, "#");
  const title = acf.specification_section_title || "Explore the <span>product specifications</span>";
  const productSheetTarget =
    getButtonTarget(acf.product_sheet) ||
    (productSheetHref !== "#" ? "_blank" : undefined);

  return (
    <section id="technical-data" className="bg-white">
      <div className="web-width px-6 py-20 md:py-[120px]">
        <div className="mb-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-8 flex items-center gap-2">
              <span className="h-4 w-0.5 bg-[var(--color-yellow)]" />
              <p className="font-body text-[13px] font-medium uppercase leading-5.5 tracking-[0.52px] text-[#1A1A1A]">
                Technical data
              </p>
            </div>
            <h2 className="max-w-155 font-heading text-[34px] font-normal leading-[46px] tracking-[-0.84px] text-black md:text-[48px] md:leading-[54px] [&_span]:text-[#007DA5]">
              {title}
            </h2>
          </div>

          {productSheetHref !== "#" && (
            <Link
              href={productSheetHref}
              target={productSheetTarget}
              className="group inline-flex h-12 w-fit items-center gap-4 rounded-sm bg-[image:var(--mpp-gradient)] py-1.5 pr-1.5 pl-6 font-heading text-[14px] font-normal tracking-[-0.28px] text-white transition-opacity hover:opacity-90"
            >
              <span>Download Product Sheet</span>
              <Image
                src="/download-ico.svg"
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 transition-transform group-hover:translate-y-0.5"
              />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 border border-[#DEDEDE] bg-white p-2 md:grid-cols-2 lg:grid-cols-4">
          {specs.map((spec, index) => (
            <div
              key={`${spec.spec_label}-${index}`}
              className="border-[5px] border-white bg-[#F3F4FB] px-5 py-6"
            >
              <div className="mb-3 flex items-center gap-2 font-body text-[11px] leading-[18px] text-black">
                {getImageUrl(spec.spec_icon) ? (
                  <Image
                    src={getImageUrl(spec.spec_icon)}
                    alt=""
                    width={10}
                    height={10}
                    className="h-[10px] w-[10px] object-contain"
                  />
                ) : (
                  <span className="h-[4px] w-[4px] shrink-0 rounded-full bg-[var(--color-yellow)]" />
                )}
                {spec.spec_label}
              </div>
              <div
                className="font-body text-[20px] font-semibold leading-[28px] text-[#007DA5]"
                dangerouslySetInnerHTML={{ __html: spec.spec_value }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
