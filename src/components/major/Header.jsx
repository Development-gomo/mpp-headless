import {
  getLanguageLinks,
  getProductCategories,
  getProductsByCategory,
  getThemeOptions,
  getWpmlLanguages,
} from "@/lib/api";
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

  const normalizePathname = (pathname = "/") =>
    pathname
      .replace(/^\/headless-mpp/, "")
      .replace(/^\/([a-z]{2})\/service(?=\/|$)/, "/$1")
      .replace(/^\/service(?=\/|$)/, "");

  try {
    const parsed = new URL(url);
    const pathname = normalizePathname(parsed.pathname).replace(/\/$/, "");

    return localizePath(`${pathname || "/"}${parsed.search}${parsed.hash}`, language);
  } catch {
    return localizePath(normalizePathname(url), language);
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

function getEntityId(entity) {
  if (!entity) return null;
  if (typeof entity === "number" || typeof entity === "string") return entity;

  return entity.term_id || entity.id || entity.ID || null;
}

function getEntityName(entity, fallback = "Category") {
  if (typeof entity === "string") return entity;

  const renderedTitle = entity?.title?.rendered || entity?.name || entity?.title;
  return renderedTitle?.replace(/<[^>]*>/g, "").trim() || fallback;
}

function getCategoryHref(category, language = DEFAULT_LANGUAGE) {
  if (category?.slug) return localizePath(`/product-category/${category.slug}`, language);
  if (category?.link) return normalizeUrl(category.link, language);

  return "#";
}

function getProductHref(product, language = DEFAULT_LANGUAGE) {
  if (product?.slug) return localizePath(`/product/${product.slug}`, language);
  if (product?.link) return normalizeUrl(product.link, language);

  return "#";
}

function getProductImage(product) {
  const embeddedMedia = product?._embedded?.["wp:featuredmedia"]?.[0];
  const yoastImage = product?.yoast_head_json?.og_image?.[0]?.url;
  const acfImage =
    product?.acf?.product_image ||
    product?.acf?.image ||
    product?.acf?.featured_image ||
    product?.acf?.product_featured_image;

  if (typeof acfImage === "string") return acfImage;

  return (
    acfImage?.url ||
    embeddedMedia?.source_url ||
    yoastImage ||
    product?.featured_media_url ||
    product?.featured_image ||
    product?.thumbnail_url ||
    product?.image ||
    product?.thumbnail ||
    product?.images?.[0]?.src ||
    product?.images?.[0]?.url ||
    null
  );
}

function extractSubmenuCategories(submenuLinks = []) {
  if (!Array.isArray(submenuLinks)) return [];

  return submenuLinks
    .flatMap((item) => {
      const category = item?.category;
      return Array.isArray(category) ? category : [category];
    })
    .filter((category) => getEntityId(category));
}

function pickFirstObject(candidates = []) {
  return (
    candidates.find(
      (item) => item && typeof item === "object" && !Array.isArray(item)
    ) || {}
  );
}

function pickLocalizedMenu(options, language = DEFAULT_LANGUAGE) {
  if (!options || typeof options !== "object") return null;

  const languageNames = {
    sv: "swedish",
    en: "english",
    de: "german",
  };
  const languageName = languageNames[language];
  const candidates = [
    options?.[`mega_menu_${language}`],
    options?.[`${language}_mega_menu`],
    languageName && options?.[`mega_menu_${languageName}`],
    languageName && options?.[`${languageName}_mega_menu`],
    options?.mega_menus?.[language],
    options?.menus?.[language],
    options?.mega_menu,
  ];

  return candidates.find(Array.isArray) || null;
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

async function buildThreeLevelCategoriesMenu(row, rowIndex, language) {
  const selectedCategories = extractSubmenuCategories(row?.submenu_links);
  if (selectedCategories.length === 0) return [];

  const allCategories = await getProductCategories({ language });
  const categoryMap = new Map();

  allCategories.forEach((category) => {
    const id = getEntityId(category);
    if (id) categoryMap.set(String(id), category);
  });

  return Promise.all(
    selectedCategories.map(async (selectedCategory, categoryIndex) => {
      const categoryId = getEntityId(selectedCategory);
      const category = categoryMap.get(String(categoryId)) || selectedCategory;
      if (!category) return null;

      const children = allCategories
        .filter((child) => Number(child?.parent || child?.parent_id || 0) === Number(categoryId))
        .map((child) => ({
          ...child,
          products: [],
        }));

      const childrenWithProducts = await Promise.all(
        children.map(async (child, childIndex) => {
          const childId = getEntityId(child);
          const products = childId
            ? await getProductsByCategory(childId, { language })
            : [];

          return {
            key: `${rowIndex}-category-${categoryId}-child-${childId || childIndex}`,
            id: childId,
            label: getEntityName(child, `Category ${childIndex + 1}`),
            href: getCategoryHref(child, language),
            products: products.map((product, productIndex) => ({
              key: `${rowIndex}-category-${categoryId}-child-${childId || childIndex}-product-${
                product?.id || productIndex
              }`,
              id: product?.id || null,
              label: getEntityName(product, `Product ${productIndex + 1}`),
              href: getProductHref(product, language),
              image: getProductImage(product),
            })),
          };
        })
      );

      return {
        key: `${rowIndex}-category-${categoryId}`,
        id: getEntityId(category),
        label: getEntityName(category, `Category ${categoryIndex + 1}`),
        href: getCategoryHref(category, language),
        children: childrenWithProducts,
      };
    })
  ).then((items) => items.filter(Boolean));
}

async function normalizeMegaMenuRows(rawRows = [], language = DEFAULT_LANGUAGE) {
  if (!Array.isArray(rawRows)) return [];

  const rows = await Promise.all(
    rawRows.map(async (row, rowIndex) => {
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

      const categoryColumns =
        layoutType === "three_level_categories"
          ? await buildThreeLevelCategoriesMenu(row, rowIndex, language)
          : [];

      return {
        key: `${menuTitle}-${rowIndex}`,
        title: menuTitle,
        titleLink,
        layoutType,
        sideImage,
        columns,
        categoryColumns,
      };
    })
  );

  return rows.filter((row) => row.title);
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

  const megaMenuRows = await normalizeMegaMenuRows(
    pickLocalizedMenu(headerOptions, language) ||
      pickLocalizedMenu(optionsRoot, language) ||
      pickLocalizedMenu(optionsRoot?.global, language) ||
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
