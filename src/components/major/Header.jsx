import { getThemeOptions } from "@/lib/api";
import HeaderComponent from "./HeaderComponent";

function extractLinksFromHtml(html) {
  if (!html) return [];
  const matches = Array.from(
    html.matchAll(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gim)
  );

  return matches
    .map((m) => ({
      href: m[1] || "#",
      label: m[2]?.replace(/<[^>]*>/g, "").trim() || "Link",
    }))
    .filter((item) => item.label);
}

function normalizeLink(link, fallbackLabel = "Link") {
  if (!link) {
    return {
      href: "#",
      label: fallbackLabel,
      target: "_self",
    };
  }

  if (typeof link === "string") {
    return {
      href: link || "#",
      label: fallbackLabel,
      target: "_self",
    };
  }

  return {
    href: link.url || "#",
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

function normalizeMegaMenuRows(rawRows = []) {
  if (!Array.isArray(rawRows)) return [];

  return rawRows
    .map((row, rowIndex) => {
      const menuTitle = row?.menu_title?.trim() || `Menu ${rowIndex + 1}`;
      const titleLink = normalizeLink(row?.menu_title_link, menuTitle);
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
                      item?.label || `Submenu ${linkIndex + 1}`
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
              "Read more"
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

export default async function Header({ variant = "light" }) {
  const themeOptions = await getThemeOptions();
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

  const navHtml =
    headerOptions?.nav ||
    headerOptions?.navigation ||
    optionsRoot?.nav ||
    null;

  const megaMenuRows = normalizeMegaMenuRows(
    headerOptions?.mega_menu ||
      optionsRoot?.mega_menu ||
      optionsRoot?.global?.mega_menu ||
      []
  );

  const navLinks = extractLinksFromHtml(navHtml);

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
    "Call"
  );

  const cta1Link = normalizeLink(
    headerOptions?.cta1_link ||
      optionsRoot?.cta1_link ||
      optionsRoot?.global?.cta1_link,
    headerOptions?.cta1_text ||
      optionsRoot?.cta1_text ||
      optionsRoot?.global?.cta1_text ||
      "Defence"
  );

  const cta2Link = normalizeLink(
    headerOptions?.cta2_link ||
      optionsRoot?.cta2_link ||
      optionsRoot?.global?.cta2_link,
    headerOptions?.cta2_text ||
      optionsRoot?.cta2_text ||
      optionsRoot?.global?.cta2_text ||
      "Reseller"
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
    />
  );
}
