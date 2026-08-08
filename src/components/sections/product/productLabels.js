import { DEFAULT_LANGUAGE } from "@/lib/i18n";

export const PRODUCT_LABELS = {
  sv: {
    requestQuote: "Begär offert",
    downloadProductSheet: "Ladda ner produktblad",
    download: "Ladda ner",
    getInTouch: "Kontakta oss",
    addToCart: "Lägg till i varukorgen +",
    added: "Tillagd",
    home: "Hem",
    downloads: "Nedladdningar",
    filters: {
      All: "Alla",
      Lid: "Lock",
      Flowmeter: "Flödesmätare",
      "Elevation skids": "Lyftmedar",
      "Refueling hose": "Tankningsslang",
      "Hose holder": "Slanghållare",
    },
    nav: {
      technicalData: "Teknisk data",
      findYourTank: "Hitta din tank",
      accessories: "Tillbehör",
      testimonials: "Recensioner",
      faqs: "Vanliga frågor",
    },
    hero: {
      capacity: "Kapacitet",
      volume: "Volym",
      dimensions: "Mått",
      netWeight: "Nettovikt",
      fuelCompatibility: "Bränslekompatibilitet",
      applicationAreas: "Användningsområden",
      keyFeatures: "Nyckelfunktioner",
      liters: "Liter",
      previousImage: "Föregående produktbild",
      nextImage: "Nästa produktbild",
      previousThumbnails: "Visa föregående bildminiatyrer",
      nextThumbnails: "Visa nästa bildminiatyrer",
      showImage: (index) => `Visa produktbild ${index}`,
    },
    overview: {
      eyebrow: "Din idealtank",
      title: "Se vilken tank <span>som passar dina behov</span>",
      description:
        "Granska nyckelspecifikationerna för varje tank för att välja den storlek som passar din applikation bäst.",
      descriptionCol: "Beskrivning och artikelnummer",
      dimensionsCol: "Mått (cm)",
      dimensionsSub: "L x B x H",
      volumeCol: "Volym (L)",
      weightCol: "Vikt (kg)",
      currentProduct: "Nuvarande produkt",
    },
    specs: {
      eyebrow: "Teknisk data",
      title: "Utforska <span>produktspecifikationerna</span>",
      capacity: "Kapacitet",
      fuelType: "Bränsletyp",
      material: "Material",
      dimensions: "Mått",
    },
    accessories: {
      eyebrow: "Tillbehör",
      title: "Välj <span>tillbehör</span> till din tank",
      description:
        "Välj de tillbehör du behöver och lägg till dem i din konfiguration. Du kan granska och justera antal när som helst i offertpanelen.",
    },
    accessoryOverview: {
      specifications: "Specifikationer",
    },
    cta: {
      eyebrow: "Kom igång",
      title: "Redo att hitta rätt bränslelösning för din verksamhet?",
    },
    testimonials: {
      eyebrow: "Recensioner",
      title: "Vad våra <span>kunder säger</span>",
      cta: "Prata med våra experter",
    },
    relatedProducts: {
      eyebrow: "Relaterade produkter",
      title: "Upptäck relaterade <span>bränsleprodukter</span>",
      capacity: "Kapacitet",
      fuelType: "Bränsletyp",
      previousProduct: "Föregående produkt",
      nextProduct: "Nästa produkt",
    },
    imageMissing: "Produktbild saknas",
    defaultCategory: "Mobila bränsletankar",
  },
  en: {
    requestQuote: "Request a quote",
    downloadProductSheet: "Download Product Sheet",
    download: "Download",
    getInTouch: "Get in touch with us",
    addToCart: "Add to cart +",
    added: "Added",
    home: "Home",
    downloads: "Downloads",
    filters: {
      All: "All",
      Lid: "Lid",
      Flowmeter: "Flowmeter",
      "Elevation skids": "Elevation skids",
      "Refueling hose": "Refueling hose",
      "Hose holder": "Hose holder",
    },
    nav: {
      technicalData: "Technical data",
      findYourTank: "Find your tank",
      accessories: "Accessories",
      testimonials: "Testimonials",
      faqs: "FAQs",
    },
    hero: {
      capacity: "Capacity",
      volume: "Volume",
      dimensions: "Dimensions",
      netWeight: "Net Weight",
      fuelCompatibility: "Fuel compatibility",
      applicationAreas: "Application areas",
      keyFeatures: "Key features",
      liters: "Liters",
      previousImage: "Previous product image",
      nextImage: "Next product image",
      previousThumbnails: "Show previous gallery thumbnails",
      nextThumbnails: "Show next gallery thumbnails",
      showImage: (index) => `Show product image ${index}`,
    },
    overview: {
      eyebrow: "Your ideal tank",
      title: "See which tank <span>fits your needs</span>",
      description:
        "Review the key specifications of each tank to choose the size that best fits your application.",
      descriptionCol: "Description and article number",
      dimensionsCol: "Dimensions (cm)",
      dimensionsSub: "L x W x H",
      volumeCol: "Volume (L)",
      weightCol: "Weight (kg)",
      currentProduct: "Current product",
    },
    specs: {
      eyebrow: "Technical data",
      title: "Explore the <span>product specifications</span>",
      capacity: "Capacity",
      fuelType: "Fuel type",
      material: "Material",
      dimensions: "Dimensions",
    },
    accessories: {
      eyebrow: "Accessories",
      title: "Select <span>accessories</span> for your tank",
      description:
        "Select the accessories you need and add them to your configuration. You can review and adjust quantities anytime in the quote panel.",
    },
    accessoryOverview: {
      specifications: "Specifications",
    },
    cta: {
      eyebrow: "Get started",
      title: "Ready to find the right fuel solution for your operation?",
    },
    testimonials: {
      eyebrow: "Testimonials",
      title: "What our <span>customers say</span>",
      cta: "Talk to our experts",
    },
    relatedProducts: {
      eyebrow: "Related products",
      title: "Discover related fuel storage <span>products</span>",
      capacity: "Capacity",
      fuelType: "Fuel type",
      previousProduct: "Previous product",
      nextProduct: "Next product",
    },
    imageMissing: "Product image missing",
    defaultCategory: "Mobile fuel tanks",
  },
  de: {
    requestQuote: "Angebot anfordern",
    downloadProductSheet: "Produktblatt herunterladen",
    download: "Herunterladen",
    getInTouch: "Kontakt aufnehmen",
    addToCart: "In den Warenkorb +",
    added: "Hinzugefügt",
    home: "Startseite",
    downloads: "Downloads",
    filters: {
      All: "Alle",
      Lid: "Deckel",
      Flowmeter: "Durchflussmesser",
      "Elevation skids": "Erhöhungskufen",
      "Refueling hose": "Betankungsschlauch",
      "Hose holder": "Schlauchhalter",
    },
    nav: {
      technicalData: "Technische Daten",
      findYourTank: "Finden Sie Ihren Tank",
      accessories: "Zubehör",
      testimonials: "Referenzen",
      faqs: "FAQ",
    },
    hero: {
      capacity: "Kapazität",
      volume: "Volumen",
      dimensions: "Abmessungen",
      netWeight: "Nettogewicht",
      fuelCompatibility: "Kraftstoffkompatibilität",
      applicationAreas: "Einsatzbereiche",
      keyFeatures: "Hauptmerkmale",
      liters: "Liter",
      previousImage: "Vorheriges Produktbild",
      nextImage: "Nächstes Produktbild",
      previousThumbnails: "Vorherige Bildvorschauen anzeigen",
      nextThumbnails: "Nächste Bildvorschauen anzeigen",
      showImage: (index) => `Produktbild ${index} anzeigen`,
    },
    overview: {
      eyebrow: "Ihr idealer Tank",
      title: "Finden Sie den Tank, <span>der zu Ihren Bedürfnissen passt</span>",
      description:
        "Vergleichen Sie die wichtigsten Spezifikationen jedes Tanks, um die Größe zu wählen, die am besten zu Ihrer Anwendung passt.",
      descriptionCol: "Beschreibung und Artikelnummer",
      dimensionsCol: "Abmessungen (cm)",
      dimensionsSub: "L x B x H",
      volumeCol: "Volumen (L)",
      weightCol: "Gewicht (kg)",
      currentProduct: "Aktuelles Produkt",
    },
    specs: {
      eyebrow: "Technische Daten",
      title: "Entdecken Sie die <span>Produktspezifikationen</span>",
      capacity: "Kapazität",
      fuelType: "Kraftstoffart",
      material: "Material",
      dimensions: "Abmessungen",
    },
    accessories: {
      eyebrow: "Zubehör",
      title: "Wählen Sie <span>Zubehör</span> für Ihren Tank",
      description:
        "Wählen Sie das benötigte Zubehör aus und fügen Sie es Ihrer Konfiguration hinzu. Sie können Mengen jederzeit im Angebotsbereich überprüfen und anpassen.",
    },
    accessoryOverview: {
      specifications: "Spezifikationen",
    },
    cta: {
      eyebrow: "Loslegen",
      title: "Bereit, die richtige Kraftstofflösung für Ihren Betrieb zu finden?",
    },
    testimonials: {
      eyebrow: "Referenzen",
      title: "Was unsere <span>Kunden sagen</span>",
      cta: "Sprechen Sie mit unseren Experten",
    },
    relatedProducts: {
      eyebrow: "Verwandte Produkte",
      title: "Entdecken Sie verwandte <span>Kraftstoffprodukte</span>",
      capacity: "Kapazität",
      fuelType: "Kraftstoffart",
      previousProduct: "Vorheriges Produkt",
      nextProduct: "Nächstes Produkt",
    },
    imageMissing: "Produktbild fehlt",
    defaultCategory: "Mobile Brennstofftanks",
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
