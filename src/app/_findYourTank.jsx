import { notFound } from "next/navigation";
import Footer from "@/components/major/Footer";
import Header from "@/components/major/Header";
import FindYourTankSection from "@/components/sections/find-your-tank/FindYourTankSection";
import {
  getProductVariations,
  getVariationCapacity,
  getVariationTextValues,
  getProductCategories as getProductTerms,
  stripHtml,
} from "@/components/sections/product/productUtils";
import { getAllProducts, getProductCategories } from "@/lib/api";
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  getLanguagePrefix,
  isLanguageEnabled,
  localizePath,
} from "@/lib/i18n";

const STATIC_PATHS = {
  sv: "/hitta-din-tank",
  en: "/find-your-tank",
  de: "/find-your-tank",
};

const PAGE_TITLES = {
  sv: "Hitta din tank",
  en: "Find your tank",
  de: "Finden Sie Ihren Tank",
};

// Root product_cat slugs per language. WPML translates the slugs, so the
// tank type can't be derived from one fixed slug.
const STATIONARY_ROOT_SLUGS = [
  "stationary-fuel-tanks",
  "stationara-bransletankar",
  "stationare-kraftstofftanks",
  "zisternen",
];

function getRootSlugs(product, categoriesById) {
  const slugs = new Set();
  // The list endpoint returns term IDs in product_cat; embedded terms are a fallback.
  const termIds = [
    ...(Array.isArray(product?.product_cat) ? product.product_cat : []),
    ...getProductTerms(product).map((term) => term.id || term.term_id),
  ];

  termIds.forEach((termId) => {
    let current = categoriesById.get(Number(termId));
    const seen = new Set();

    while (current && !seen.has(current.slug)) {
      seen.add(current.slug);
      slugs.add(current.slug);
      current = categoriesById.get(Number(current.parent || current.parent_id));
    }
  });

  return slugs;
}

// An ACF "tank_type" value (adr | cistern | tank) wins when the client sets it
// in WordPress; otherwise the type is derived from the title/slug and the
// category tree.
function getTankType(product, categoriesById) {
  const acfType = stripHtml(product?.acf?.tank_type || "").toLowerCase();
  if (["adr", "cistern", "tank"].includes(acfType)) return acfType;

  const title = stripHtml(product?.title?.rendered || "");
  if (/\badr\b/i.test(`${product?.slug || ""} ${title}`.replace(/-/g, " "))) {
    return "adr";
  }

  const rootSlugs = getRootSlugs(product, categoriesById);
  return STATIONARY_ROOT_SLUGS.some((slug) => rootSlugs.has(slug))
    ? "cistern"
    : "tank";
}

function normalizeFuelKey(fuel) {
  return fuel.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Reduces a WP product to what the card and the filter need, so the client
// bundle doesn't carry the full REST payload.
function toTankProduct(product, categoriesById) {
  const variations = getProductVariations(product)
    .map((variation) => ({
      capacity: Number.parseInt(getVariationCapacity(variation), 10),
      fuels: [
        ...getVariationTextValues(variation?.fuel_compatibility, "compatibility"),
        ...getVariationTextValues(variation?.variation_fuel_type, "fuel_type"),
        ...getVariationTextValues(variation?.fuel_type, "fuel_type"),
      ],
    }))
    .filter((variation) => Number.isFinite(variation.capacity));

  if (variations.length === 0) return null;

  const media = product?._embedded?.["wp:featuredmedia"]?.[0];

  return {
    card: {
      id: product.id,
      slug: product.slug,
      title: { rendered: product.title?.rendered || "" },
      excerpt: { rendered: product.excerpt?.rendered || "" },
      featured_media_url:
        media?.media_details?.sizes?.large?.source_url || media?.source_url || "",
      acf: {
        short_description: product.acf?.short_description || "",
        product_badge: product.acf?.product_badge || "",
        product_variations: getProductVariations(product),
      },
    },
    type: getTankType(product, categoriesById),
    variations: variations.map((variation) => ({
      capacity: variation.capacity,
      fuels: variation.fuels.map(normalizeFuelKey),
    })),
  };
}

export function generateFindYourTankMetadata(language) {
  if (!isLanguageEnabled(language)) notFound();
  return {
    title: PAGE_TITLES[language] || PAGE_TITLES.en,
    alternates: {
      canonical: localizePath(STATIC_PATHS[language], language),
      languages: Object.fromEntries(
        SUPPORTED_LANGUAGES.map((code) => [code, localizePath(STATIC_PATHS[code] || STATIC_PATHS.en, code)])
      ),
    },
  };
}

export async function renderFindYourTankPage(language) {
  if (!isLanguageEnabled(language)) notFound();
  const [products, categories] = await Promise.all([
    getAllProducts({ language }),
    getProductCategories({ language }),
  ]);
  const categoriesById = new Map(
    categories.map((category) => [Number(category.term_id || category.id), category])
  );
  const tanks = products
    .map((product) => toTankProduct(product, categoriesById))
    .filter(Boolean);

  const fuelLabels = {};
  products.forEach((product) =>
    getProductVariations(product).forEach((variation) =>
      [
        ...getVariationTextValues(variation?.fuel_compatibility, "compatibility"),
        ...getVariationTextValues(variation?.variation_fuel_type, "fuel_type"),
        ...getVariationTextValues(variation?.fuel_type, "fuel_type"),
      ].forEach((fuel) => {
        const key = normalizeFuelKey(fuel);
        if (key && !fuelLabels[key]) fuelLabels[key] = fuel;
      })
    )
  );

  const path = `${getLanguagePrefix(language)}${STATIC_PATHS[language]}`;

  return (
    <>
      <Header
        variant="dark"
        language={language}
        translationContext={{ language, path, staticPaths: STATIC_PATHS }}
      />
      <main>
        <FindYourTankSection
          tanks={tanks}
          fuelLabels={fuelLabels}
          language={language || DEFAULT_LANGUAGE}
        />
      </main>
      <Footer language={language} />
    </>
  );
}
