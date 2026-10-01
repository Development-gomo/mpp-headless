"use client";

import { useMemo, useState } from "react";
import { ProductVerticalCard } from "@/components/sections/product-category/ProductCategoryProductSections";
import { DEFAULT_LANGUAGE, normalizeLanguage } from "@/lib/i18n";

const LABELS = {
  sv: {
    eyebrow: "Produktguide",
    title: "Hitta din <span>tank</span>",
    intro: "Välj kapacitet, tanktyp och bränsle så visar vi de produkter som passar.",
    capacity: "Kapacitet",
    type: "Typ",
    fuel: "Bränsletyp",
    any: "Alla",
    submit: "Visa produkter",
    reset: "Återställ",
    results: (n) => `${n} ${n === 1 ? "produkt hittades" : "produkter hittades"}`,
    empty: "Inga produkter matchar ditt val. Prova en annan kombination.",
    types: { adr: "ADR", cistern: "Cistern", tank: "Tank" },
  },
  en: {
    eyebrow: "Product finder",
    title: "Find your <span>tank</span>",
    intro: "Choose a capacity, tank type and fuel and we will list the products that fit.",
    capacity: "Capacity",
    type: "Type",
    fuel: "Fuel type",
    any: "Any",
    submit: "Show products",
    reset: "Reset",
    results: (n) => `${n} ${n === 1 ? "product found" : "products found"}`,
    empty: "No products match your selection. Try a different combination.",
    types: { adr: "ADR", cistern: "Cistern", tank: "Tank" },
  },
  de: {
    eyebrow: "Produktfinder",
    title: "Finden Sie Ihren <span>Tank</span>",
    intro: "Wählen Sie Kapazität, Tankart und Kraftstoff und wir zeigen die passenden Produkte.",
    capacity: "Kapazität",
    type: "Typ",
    fuel: "Kraftstoffart",
    any: "Alle",
    submit: "Produkte anzeigen",
    reset: "Zurücksetzen",
    results: (n) => `${n} ${n === 1 ? "Produkt gefunden" : "Produkte gefunden"}`,
    empty: "Keine Produkte entsprechen Ihrer Auswahl. Versuchen Sie eine andere Kombination.",
    types: { adr: "ADR", cistern: "Zisterne", tank: "Tank" },
  },
};

const TYPE_ORDER = ["adr", "cistern", "tank"];

const formatLitres = (value) =>
  `${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} L`;

const selectClassName =
  "h-12 w-full cursor-pointer rounded-sm border border-[#D7E4EA] bg-white px-4 font-body text-[15px] normal-case tracking-normal text-black outline-none focus:border-[var(--color-accent)]";

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-2 font-body text-[13px] font-medium uppercase tracking-[0.52px]">
      {label}
      {children}
    </label>
  );
}

export default function FindYourTankSection({
  tanks = [],
  fuelLabels = {},
  language = DEFAULT_LANGUAGE,
}) {
  const labels = LABELS[normalizeLanguage(language)] || LABELS[DEFAULT_LANGUAGE];
  const [values, setValues] = useState({ capacity: "", type: "", fuel: "" });
  const [submitted, setSubmitted] = useState(null);

  const capacities = useMemo(
    () =>
      [...new Set(tanks.flatMap((tank) => tank.variations.map((v) => v.capacity)))].sort(
        (a, b) => a - b
      ),
    [tanks]
  );
  const types = useMemo(
    () => TYPE_ORDER.filter((type) => tanks.some((tank) => tank.type === type)),
    [tanks]
  );
  const fuels = useMemo(
    () =>
      Object.entries(fuelLabels)
        .filter(([key]) =>
          tanks.some((tank) => tank.variations.some((v) => v.fuels.includes(key)))
        )
        .sort((a, b) => a[1].localeCompare(b[1])),
    [tanks, fuelLabels]
  );

  const results = useMemo(() => {
    if (!submitted) return [];
    const capacity = submitted.capacity ? Number(submitted.capacity) : null;

    return tanks.filter(
      (tank) =>
        (!submitted.type || tank.type === submitted.type) &&
        // capacity and fuel must be met by the same variation
        tank.variations.some(
          (v) =>
            (capacity === null || v.capacity === capacity) &&
            (!submitted.fuel || v.fuels.includes(submitted.fuel))
        )
    );
  }, [tanks, submitted]);

  const update = (key) => (event) =>
    setValues((current) => ({ ...current, [key]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted({ ...values });
  };

  const handleReset = () => {
    setValues({ capacity: "", type: "", fuel: "" });
    setSubmitted(null);
  };

  return (
    <section className="bg-white pb-20 pt-30 text-black md:pb-30 md:pt-37.5">
      <div className="web-width px-6">
        <div className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-4 w-0.5 bg-[var(--color-yellow)]" />
            <p className="font-body text-[13px] font-medium uppercase leading-5.5 tracking-[0.52px]">
              {labels.eyebrow}
            </p>
          </div>
          <h1
            className="max-w-155 font-heading text-[48px] font-normal leading-14 tracking-[-0.96px] md:text-[64px] md:leading-[70px] [&_span]:text-[#007DA5]"
            dangerouslySetInnerHTML={{ __html: labels.title }}
          />
          <p className="mt-4 max-w-155 font-body text-[16px] leading-6 text-[#1A1A1A]">
            {labels.intro}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 rounded-lg bg-[#F3F4FB] p-5 md:grid-cols-2 md:p-8 lg:grid-cols-[1fr_1fr_1fr_auto]"
        >
          <Field label={labels.capacity}>
            <select className={selectClassName} value={values.capacity} onChange={update("capacity")}>
              <option value="">{labels.any}</option>
              {capacities.map((capacity) => (
                <option key={capacity} value={capacity}>
                  {formatLitres(capacity)}
                </option>
              ))}
            </select>
          </Field>

          <Field label={labels.type}>
            <select className={selectClassName} value={values.type} onChange={update("type")}>
              <option value="">{labels.any}</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {labels.types[type]}
                </option>
              ))}
            </select>
          </Field>

          <Field label={labels.fuel}>
            <select className={selectClassName} value={values.fuel} onChange={update("fuel")}>
              <option value="">{labels.any}</option>
              {fuels.map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </Field>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="inline-flex h-12 flex-1 cursor-pointer items-center justify-center rounded-sm bg-[var(--color-yellow)] px-6 font-heading text-[14px] text-black transition-opacity hover:opacity-90"
            >
              {labels.submit}
            </button>
            {submitted && (
              <button
                type="button"
                onClick={handleReset}
                className="h-12 cursor-pointer px-3 font-body text-[13px] text-black/60 underline hover:text-black"
              >
                {labels.reset}
              </button>
            )}
          </div>
        </form>

        {submitted && (
          <div className="mt-10" aria-live="polite">
            <p className="mb-5 font-heading text-[24px] tracking-[-0.48px]">
              {labels.results(results.length)}
            </p>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {results.map((tank) => (
                  <ProductVerticalCard key={tank.card.id} product={tank.card} language={language} />
                ))}
              </div>
            ) : (
              <p className="rounded-lg border border-dashed border-black/20 bg-[#F8FAFC] p-8 text-center font-body text-[15px] text-black/60">
                {labels.empty}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
