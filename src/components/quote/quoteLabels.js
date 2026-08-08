import { DEFAULT_LANGUAGE } from "@/lib/i18n";

export const QUOTE_LABELS = {
  sv: {
    eyebrow: "RFQ",
    title: "Begär en <span>offert</span>",
    cart: {
      heading: "Offertkorg",
      clearCart: "Töm varukorgen",
      emptyText: "Lägg till en produkt eller ett tillbehör för att starta din offertförfrågan.",
      exploreProducts: "Utforska produkter",
      capacity: "Kapacitet",
      article: "Artikel",
      remove: "Ta bort",
      removeItem: (name) => `Ta bort ${name}`,
      quantity: "Antal",
      accessories: "Tillbehör",
    },
    confirmation: {
      heading: "Offertförfrågan skickad",
      thankYou: "Tack. Din beställning har skapats",
      withOrderNumber: (orderNumber) => ` med ordernummer ${orderNumber}`,
    },
    form: {
      heading: "Kontaktuppgifter",
      description:
        "Skicka dina valda produkter och kontaktuppgifter till oss. Vi granskar förfrågan och återkommer till dig.",
      name: "Namn",
      email: "E-post",
      phone: "Telefon",
      company: "Företag",
      message: "Meddelande",
      submitting: "Skickar...",
      submit: "Skicka offertförfrågan",
    },
    errors: {
      items: "Lägg till minst en produkt för att begära en offert.",
      name: "Namn krävs.",
      email: "E-post krävs.",
      emailInvalid: "Ange en giltig e-postadress.",
      phone: "Telefonnummer krävs.",
    },
  },
  en: {
    eyebrow: "RFQ",
    title: "Request a <span>quote</span>",
    cart: {
      heading: "Quotation cart",
      clearCart: "Clear cart",
      emptyText: "Add a product or accessory to start your quote request.",
      exploreProducts: "Explore products",
      capacity: "Capacity",
      article: "Article",
      remove: "Remove",
      removeItem: (name) => `Remove ${name}`,
      quantity: "Quantity",
      accessories: "Accessories",
    },
    confirmation: {
      heading: "Quote request sent",
      thankYou: "Thank you. Your order has been created",
      withOrderNumber: (orderNumber) => ` with order number ${orderNumber}`,
    },
    form: {
      heading: "Contact details",
      description:
        "Send us your selected products and contact details. We will review the request and get back to you.",
      name: "Name",
      email: "Email",
      phone: "Phone",
      company: "Company",
      message: "Message",
      submitting: "Submitting...",
      submit: "Submit quote request",
    },
    errors: {
      items: "Add at least one product to request a quote.",
      name: "Name is required.",
      email: "Email is required.",
      emailInvalid: "Enter a valid email address.",
      phone: "Phone number is required.",
    },
  },
  de: {
    eyebrow: "RFQ",
    title: "Angebot <span>anfordern</span>",
    cart: {
      heading: "Angebotswarenkorb",
      clearCart: "Warenkorb leeren",
      emptyText: "Fügen Sie ein Produkt oder Zubehör hinzu, um Ihre Angebotsanfrage zu starten.",
      exploreProducts: "Produkte entdecken",
      capacity: "Kapazität",
      article: "Artikel",
      remove: "Entfernen",
      removeItem: (name) => `${name} entfernen`,
      quantity: "Menge",
      accessories: "Zubehör",
    },
    confirmation: {
      heading: "Angebotsanfrage gesendet",
      thankYou: "Vielen Dank. Ihre Bestellung wurde erstellt",
      withOrderNumber: (orderNumber) => ` mit der Bestellnummer ${orderNumber}`,
    },
    form: {
      heading: "Kontaktdaten",
      description:
        "Senden Sie uns Ihre ausgewählten Produkte und Kontaktdaten. Wir prüfen die Anfrage und melden uns bei Ihnen.",
      name: "Name",
      email: "E-Mail",
      phone: "Telefon",
      company: "Unternehmen",
      message: "Nachricht",
      submitting: "Wird gesendet...",
      submit: "Angebotsanfrage senden",
    },
    errors: {
      items: "Fügen Sie mindestens ein Produkt hinzu, um ein Angebot anzufordern.",
      name: "Name ist erforderlich.",
      email: "E-Mail ist erforderlich.",
      emailInvalid: "Geben Sie eine gültige E-Mail-Adresse ein.",
      phone: "Telefonnummer ist erforderlich.",
    },
  },
};

export function getQuoteLabels(language = DEFAULT_LANGUAGE) {
  return QUOTE_LABELS[language] || QUOTE_LABELS[DEFAULT_LANGUAGE];
}
