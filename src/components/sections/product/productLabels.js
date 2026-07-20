import { DEFAULT_LANGUAGE } from "@/lib/i18n";

export const PRODUCT_LABELS = {
  sv: {
    requestQuote: "Begär offert",
    downloadProductSheet: "Ladda ner produktblad",
    download: "Ladda ner",
    getInTouch: "Kontakta oss",
    addToCart: "Lägg till i varukorgen +",
    filters: {
      All: "Alla",
      Lid: "Lock",
      Flowmeter: "Flödesmätare",
      "Elevation skids": "Lyftmedar",
      "Refueling hose": "Tankningsslang",
      "Hose holder": "Slanghållare",
    },
  },
  en: {
    requestQuote: "Request a quote",
    downloadProductSheet: "Download Product Sheet",
    download: "Download",
    getInTouch: "Get in touch with us",
    addToCart: "Add to cart +",
    filters: {
      All: "All",
      Lid: "Lid",
      Flowmeter: "Flowmeter",
      "Elevation skids": "Elevation skids",
      "Refueling hose": "Refueling hose",
      "Hose holder": "Hose holder",
    },
  },
  de: {
    requestQuote: "Angebot anfordern",
    downloadProductSheet: "Produktblatt herunterladen",
    download: "Herunterladen",
    getInTouch: "Kontakt aufnehmen",
    addToCart: "In den Warenkorb +",
    filters: {
      All: "Alle",
      Lid: "Deckel",
      Flowmeter: "Durchflussmesser",
      "Elevation skids": "Erhöhungskufen",
      "Refueling hose": "Betankungsschlauch",
      "Hose holder": "Schlauchhalter",
    },
  },
};

export function getProductLabels(language = DEFAULT_LANGUAGE) {
  return PRODUCT_LABELS[language] || PRODUCT_LABELS[DEFAULT_LANGUAGE];
}

export function getLocalizedProductButtonText(value, key, language = DEFAULT_LANGUAGE) {
  const labels = getProductLabels(language);
  const englishText = PRODUCT_LABELS.en[key];
  const cleanValue = typeof value === "string" ? value.trim() : "";

  if (
    !cleanValue ||
    cleanValue.toLowerCase() === String(englishText || "").toLowerCase()
  ) {
    return labels[key] || englishText || cleanValue;
  }

  return cleanValue;
}
