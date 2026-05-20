import Image from "next/image";
import { getImageUrl } from "./productUtils";

function normalizeSpecs(product) {
  const acf = product?.acf || {};
  const specs = Array.isArray(acf.product_specs) ? acf.product_specs : [];
  const fallbackSpecs = [
    { spec_label: "Capacity", spec_value: acf.capacity || acf.product_capacity, spec_icon: "/capacity-icon.svg" },
    { spec_label: "Fuel type", spec_value: acf.fuel_type || acf.product_fuel_type, spec_icon: "/fuel-type-icon.svg" },
    { spec_label: "Material", spec_value: acf.product_material },
    { spec_label: "Dimensions", spec_value: acf.product_dimensions },
  ].filter((item) => item.spec_value);

  return specs.length > 0 ? specs : fallbackSpecs;
}

export default function ProductSpecsSection({ product }) {
  const specs = normalizeSpecs(product);
  if (specs.length === 0) return null;

  return (
    <section id="technical-data" className="bg-white">
      <div className="web-width px-6 py-20 md:py-[120px]">
        <div className="mb-12">
          <div className="mb-6 flex items-center gap-2">
            <span className="h-[16px] w-[2px] bg-[var(--color-yellow)]" />
            <p className="font-body text-[14px] font-medium uppercase leading-[24px] tracking-[0.56px] text-[#1A1A1A]">
              Technical data
            </p>
          </div>
          <h2 className="max-w-[620px] font-heading text-[42px] font-normal leading-[50px] tracking-[-0.84px] text-black md:text-[48px] md:leading-[56px]">
            Explore the <span>product specifications</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {specs.map((spec, index) => (
            <div
              key={`${spec.spec_label}-${index}`}
              className="border border-[#DEDEDE] bg-white p-2"
            >
              <div className="min-h-[114px] bg-[#F3F4FB] p-5">
                <div className="mb-1 flex items-center gap-2 font-body text-[12px] leading-[22px] text-black">
                  {getImageUrl(spec.spec_icon) ? (
                    <Image src={getImageUrl(spec.spec_icon)} alt="" width={14} height={14} className="h-[14px] w-[14px] object-contain" />
                  ) : (
                    <span className="h-[4px] w-[4px] rounded-full bg-[var(--color-yellow)]" />
                  )}
                  {spec.spec_label}
                </div>
                <div
                  className="font-body text-[20px] font-semibold leading-[28px] text-[var(--color-accent)]"
                  dangerouslySetInnerHTML={{ __html: spec.spec_value }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
