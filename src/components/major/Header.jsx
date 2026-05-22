import { getLanguageLinks, getThemeOptions, getWpmlLanguages } from "@/lib/api";
import { DEFAULT_LANGUAGE, localizePath } from "@/lib/i18n";
import HeaderComponent from "./HeaderComponent";

function extractLinksFromHtml(html, language = DEFAULT_LANGUAGE) {
  if (!html) return [];
  const matches = Array.from(
    html.matchAll(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gim)
  );

  return matches
    .map((m) => ({
      href: normalizeUrl(m[1], language),
      label: m[2]?.replace(/<[^>]*>/g, "").trim() || "Link",
    }))
    .filter((item) => item.label);
}

function normalizeUrl(url = "#", language = DEFAULT_LANGUAGE) {
  if (!url || url === "#") return "#";
  if (/^(mailto:|tel:)/i.test(url)) return url;

  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname
      .replace(/^\/headless-mpp/, "")
      .replace(/\/$/, "");

    return localizePath(`${pathname || "/"}${parsed.search}${parsed.hash}`, language);
  } catch {
    return localizePath(url, language);
  }
}

function normalizeLink(link, fallbackLabel = "Link", language = DEFAULT_LANGUAGE) {
  if (!link) {
    return {
      href: "#",
      label: fallbackLabel,
      target: "_self",
    };
  }

  if (typeof link === "string") {
    return {
      href: normalizeUrl(link, language),
      label: fallbackLabel,
      target: "_self",
    };
  }

  return {
    href: normalizeUrl(link.url, language),
    label: link.title || fallbackLabel,
    target: link.target || "_self",
  };
}

function pickFirstObject(candidates = []) {
  return (
    candidates.find(
      (item) => item && typeof item === "object" && !Array.isArray(item)
    ) || {}
  );
}

function resolveThemeOptions(data) {
  const candidates = [
    data?.options?.acf,
    data?.options,
    data?.data?.acf,
    data?.data,
    data?.acf,
    data,
  ];

  return pickFirstObject(candidates);
}

function normalizeMegaMenuRows(rawRows = [], language = DEFAULT_LANGUAGE) {
  if (!Array.isArray(rawRows)) return [];

  return rawRows
    .map((row, rowIndex) => {
      const menuTitle = row?.menu_title?.trim() || `Menu ${rowIndex + 1}`;
      const titleLink = normalizeLink(row?.menu_title_link, menuTitle, language);
      const layoutType = row?.layout_type || "no_column";

      const sideImage =
        row?.side_image && typeof row.side_image === "string"
          ? row.side_image
          : row?.side_image?.url || null;

      const columns = Array.isArray(row?.columns)
        ? row.columns.map((column, colIndex) => {
            const links = Array.isArray(column?.links)
              ? column.links
                  .map((item, linkIndex) => {
                    const normalized = normalizeLink(
                      item?.url,
                      item?.label || `Submenu ${linkIndex + 1}`,
                      language
                    );

                    return {
                      key: `${rowIndex}-${colIndex}-${linkIndex}`,
                      label: item?.label?.trim() || normalized.label,
                      href: normalized.href,
                      target: normalized.target,
                    };
                  })
                  .filter((item) => item.label)
              : [];

            const hasCard = Boolean(
              column?.card?.title ||
                column?.card?.description ||
                column?.card?.button_link
            );

            const cardButton = normalizeLink(
              column?.card?.button_link,
              "Read more",
              language
            );

            return {
              key: `${rowIndex}-${colIndex}`,
              links,
              card: hasCard
                ? {
                    title: column?.card?.title || "",
                    description: column?.card?.description || "",
                    button: cardButton,
                  }
                : null,
            };
          })
        : [];

      return {
        key: `${menuTitle}-${rowIndex}`,
        title: menuTitle,
        titleLink,
        layoutType,
        sideImage,
        columns,
      };
    })
    .filter((row) => row.title);
}

export default async function Header({
  variant = "light",
  language = DEFAULT_LANGUAGE,
  translationContext = {},
}) {
  const [themeOptions, languages] = await Promise.all([
    getThemeOptions({ language }),
    getWpmlLanguages(),
  ]);
  const languageLinks = await getLanguageLinks(
    {
      language,
      ...translationContext,
    },
    languages
  );
  const optionsRoot = resolveThemeOptions(themeOptions);

  const headerOptions = pickFirstObject([
    optionsRoot?.header,
    optionsRoot?.header_options,
    optionsRoot?.global,
    optionsRoot,
  ]);

  const logoUrl =
    typeof headerOptions?.header_logo === "string"
      ? headerOptions.header_logo
      : headerOptions?.header_logo?.url ||
        headerOptions?.logo?.url ||
        optionsRoot?.logo?.url ||
        null;

  const logoDarkUrl =
    typeof headerOptions?.header_logo_dark === "string"
      ? headerOptions.header_logo_dark
      : headerOptions?.header_logo_dark?.url ||
        optionsRoot?.header_logo_dark?.url ||
        optionsRoot?.global?.header_logo_dark?.url ||
        logoUrl;

  const navHtml =
    headerOptions?.nav ||
    headerOptions?.navigation ||
    optionsRoot?.nav ||
    null;

  const megaMenuRows = normalizeMegaMenuRows(
    headerOptions?.mega_menu ||
      optionsRoot?.mega_menu ||
      optionsRoot?.global?.mega_menu ||
      [],
    language
  );

  const navLinks = extractLinksFromHtml(navHtml, language);

  /**
   * New ACF fields:
   * header_telephone_link
   * cta1_text
   * cta1_link
   * cta2_text
   * cta2_link
   */
  const headerTelephoneLink = normalizeLink(
    headerOptions?.header_telephone_link ||
      optionsRoot?.header_telephone_link ||
      optionsRoot?.global?.header_telephone_link,
    "Call",
    language
  );

  const cta1Link = normalizeLink(
    headerOptions?.cta1_link ||
      optionsRoot?.cta1_link ||
      optionsRoot?.global?.cta1_link,
    headerOptions?.cta1_text ||
      optionsRoot?.cta1_text ||
      optionsRoot?.global?.cta1_text ||
    "Defence",
    language
  );

  const cta2Link = normalizeLink(
    headerOptions?.cta2_link ||
      optionsRoot?.cta2_link ||
      optionsRoot?.global?.cta2_link,
    headerOptions?.cta2_text ||
      optionsRoot?.cta2_text ||
      optionsRoot?.global?.cta2_text ||
    "Reseller",
    language
  );

  const cta1Text =
    headerOptions?.cta1_text ||
    optionsRoot?.cta1_text ||
    optionsRoot?.global?.cta1_text ||
    cta1Link.label ||
    "Defence";

  const cta2Text =
    headerOptions?.cta2_text ||
    optionsRoot?.cta2_text ||
    optionsRoot?.global?.cta2_text ||
    cta2Link.label ||
    "Reseller";

  return (
    <HeaderComponent
      logoUrl={logoUrl}
      logoDarkUrl={logoDarkUrl}
      megaMenuRows={megaMenuRows}
      navLinks={navLinks}
      headerTelephoneLink={headerTelephoneLink.href}
      cta1Text={cta1Text}
      cta1Url={cta1Link.href}
      cta1Target={cta1Link.target}
      cta2Text={cta2Text}
      cta2Url={cta2Link.href}
      cta2Target={cta2Link.target}
      variant={variant}
      language={language}
      languages={languages}
      languageLinks={languageLinks}
    />
  );
}
