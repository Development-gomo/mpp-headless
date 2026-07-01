export const DEFAULT_LANGUAGE = "sv";
export const ENGLISH_LANGUAGE = "en";
export const GERMAN_LANGUAGE = "de";

export const FALLBACK_LANGUAGES = [
  { code: DEFAULT_LANGUAGE, name: "Swedish", native_name: "Svenska" },
  { code: ENGLISH_LANGUAGE, name: "English", native_name: "English" },
  { code: GERMAN_LANGUAGE, name: "German", native_name: "Deutsch" },
];

export const SUPPORTED_LANGUAGES = (
  process.env.NEXT_PUBLIC_SITE_LANGUAGES ||
  FALLBACK_LANGUAGES.map((item) => item.code).join(",")
)
  .split(",")
  .map((language) => language.trim())
  .filter(Boolean);

export const TRANSLATED_LANGUAGES = SUPPORTED_LANGUAGES.filter(
  (language) => language !== DEFAULT_LANGUAGE
);

export function normalizeLanguage(language) {
  return SUPPORTED_LANGUAGES.includes(language) ? language : DEFAULT_LANGUAGE;
}

export function isDefaultLanguage(language) {
  return !language || language === DEFAULT_LANGUAGE;
}

export function getLanguagePrefix(language) {
  return isDefaultLanguage(language) ? "" : `/${language}`;
}

export function getIndustryRouteSegment(language = DEFAULT_LANGUAGE) {
  if (language === ENGLISH_LANGUAGE) return "industries";
  if (language === GERMAN_LANGUAGE) return "anwendungsbereiche";
  return "anvandningsomraden";
}

export function getServiceRouteSegment(language = DEFAULT_LANGUAGE) {
  if (language === ENGLISH_LANGUAGE) return "services";
  if (language === GERMAN_LANGUAGE) return "dienstleistungen";
  return "tjanster";
}

export function stripLanguagePrefix(path = "/") {
  const matchedLanguage = TRANSLATED_LANGUAGES.find(
    (language) => path === `/${language}` || path.startsWith(`/${language}/`)
  );

  if (!matchedLanguage) return path || "/";

  return path.slice(matchedLanguage.length + 1) || "/";
}

export function localizePath(path = "#", language = DEFAULT_LANGUAGE) {
  if (!path || path === "#") return "#";
  if (/^(https?:|mailto:|tel:)/i.test(path)) return path;
  if (!path.startsWith("/")) return path;

  const prefix = getLanguagePrefix(language);
  if (!prefix || path === prefix || path.startsWith(`${prefix}/`)) return path;

  return `${prefix}${path}`;
}
