import { getRendered } from "./productUtils";

export default function ProductOverviewSection({ product }) {
  const acf = product?.acf || {};
  const eyebrow = acf.product_overview_eyebrow || "Find your tank";
  const title = acf.product_overview_title || acf.product_subtitle || "See which tank fits your needs";
  const content = acf.product_overview_content || getRendered(product?.content);
  const capacity = acf.capacity || acf.product_capacity || "150 L";
  const fuelType = acf.fuel_type || acf.product_fuel_type || "Petrol | Diesel";
  const rows = [
    { model: "Pickup tank", material: "Aluminium tank", capacity, fuelType },
    { model: "Pickup tank", material: "Steel tank", capacity: "250 L", fuelType },
    { model: "Flaklockstank", material: "Aluminium tank", capacity: "320 L", fuelType },
    { model: "Dubbelmantlad", material: "Steel tank", capacity: "400 L", fuelType: "Diesel" },
  ];

  if (!title && !content) return null;

  return (
    <section id="find-your-tank" className="bg-white">
      <div className="web-width px-6 pb-20 md:pb-[120px]">
        <div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            {eyebrow && (
              <div className="mb-6 flex items-center gap-2">
                <span className="h-[16px] w-[2px] bg-[var(--color-yellow)]" />
                <p className="font-body text-[14px] font-medium uppercase leading-[24px] tracking-[0.56px] text-[#1A1A1A]">
                  {eyebrow}
                </p>
              </div>
            )}

            {title && (
              <h2
                className="max-w-[520px] font-heading text-[42px] font-normal leading-[50px] tracking-[-0.84px] text-black md:text-[48px] md:leading-[56px]"
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}
          </div>

          {content && (
            <div
              className="font-body text-[14px] leading-[22px] text-[#1A1A1A] [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>

        <div className="overflow-hidden rounded-[4px]">
          <div className="hidden grid-cols-[1.1fr_1fr_0.7fr_0.7fr] bg-[var(--color-accent)] px-5 py-4 font-body text-[14px] font-bold uppercase leading-[20px] tracking-[0.3px] text-white md:grid">
            <span>Tank / application</span>
            <span>Material</span>
            <span>Capacity</span>
            <span>Fuel type</span>
          </div>
          <div className="divide-y divide-white">
            {rows.map((row, index) => (
              <div
                key={`${row.model}-${index}`}
                className="grid gap-3 bg-[#F3F4FB] p-5 font-body text-[14px] leading-[22px] text-[#1A1A1A] md:grid-cols-[1.1fr_1fr_0.7fr_0.7fr]"
              >
                <strong className="font-bold text-[var(--color-accent)]">{row.model}</strong>
                <span>{row.material}</span>
                <span dangerouslySetInnerHTML={{ __html: row.capacity }} />
                <span dangerouslySetInnerHTML={{ __html: row.fuelType }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
