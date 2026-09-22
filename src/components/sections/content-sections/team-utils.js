// Shared helpers for team/employee sections (TeamSection, TeamGroupedSection)

export const DEPARTMENT_LABELS = {
  management: "Management",
  finance: "Finance",
  purchasing: "Purchasing",
  "design-engineering": "Design & Engineering",
  "operations-production-support": "Operations & Production Support",
  "technical-support": "Technical Support",
  sales: "Sales",
};

export const DEPARTMENT_ORDER = Object.keys(DEPARTMENT_LABELS);

export const TRANSLATIONS = {
  sv: {
    departments: {
      management: "Ledning",
      finance: "Ekonomi",
      purchasing: "Inköp",
      "design-engineering": "Konstruktion",
      "operations-production-support": "Drift och produktionssupport",
      "technical-support": "Teknisk support",
      sales: "Försäljning",
    },
    allDepartments: "Alla avdelningar",
    filterLabel: "Filtrera team efter avdelning",
    emptyMessage: "Inga teammedlemmar hittades för denna avdelning.",
  },
  de: {
    departments: {
      management: "Geschäftsführung",
      finance: "Finanzen",
      purchasing: "Einkauf",
      "design-engineering": "Konstruktion und Entwicklung",
      "operations-production-support": "Betrieb und Produktionsunterstützung",
      "technical-support": "Technischer Support",
      sales: "Vertrieb",
    },
    allDepartments: "Alle Abteilungen",
    filterLabel: "Team nach Abteilung filtern",
    emptyMessage: "Keine Teammitglieder für diese Abteilung gefunden.",
  },
  en: {
    departments: DEPARTMENT_LABELS,
    allDepartments: "All departments",
    filterLabel: "Filter team by department",
    emptyMessage: "No team members found for this department.",
  },
};

const DEPARTMENT_VALUES = Object.entries(DEPARTMENT_LABELS).reduce(
  (acc, [value, label]) => ({
    ...acc,
    [label.toLowerCase()]: value,
  }),
  {}
);

export function stripHtml(value = "") {
  return String(value).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export function normalizeDepartmentKey(value = "") {
  const normalized = String(value).trim();
  const lower = normalized.toLowerCase();

  return DEPARTMENT_VALUES[lower] || lower.replace(/&/g, "and").replace(/\s+/g, "-");
}

export function normalizeList(value) {
  if (!value) return [];
  const list = Array.isArray(value) ? value : [value];

  return list
    .map((item) => {
      if (typeof item === "string") return item;
      return item?.value || item?.slug || item?.name || item?.label || "";
    })
    .map(normalizeDepartmentKey)
    .filter(Boolean);
}

export function getSelectedDepartments(data = {}) {
  return normalizeList(
    data.selected_core_departments ||
      data.select_core_departments ||
      data.core_departments ||
      data.departments ||
      data.department_filter
  );
}

export function getImageUrl(item) {
  return (
    item?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    item?.featured_image ||
    item?.featured_image_url ||
    ""
  );
}

export function getButtonHref(button = {}) {
  if (typeof button.button_link === "string") return button.button_link;
  return button.button_link?.url || button.link?.url || "#";
}

export function getButtonLabel(button = {}) {
  return button.button_label || button.button_link?.title || button.link?.title || "";
}

export function getTranslation(language) {
  return TRANSLATIONS[language] || TRANSLATIONS.sv;
}
