import Link from "next/link";
import { DEFAULT_LANGUAGE, localizePath } from "@/lib/i18n";
import { getProductCategories, getRendered, stripHtml } from "./productUtils";

function getCategoryId(category) {
  return category?.term_id || category?.id;
}

function getCategoryParentId(category) {
  return category?.parent || category?.parent_id || 0;
}

function getCategoryByIdentity(category, categoryMap, slugMap) {
  const id = getCategoryId(category);

  if (id && categoryMap.has(String(id))) {
    return categoryMap.get(String(id));
  }

  if (category?.slug && slugMap.has(category.slug)) {
    return slugMap.get(category.slug);
  }

  return category;
}

function getMainProductCategory(productCategories, allCategories) {
  const usableProductCategories = productCategories.filter(
    (category) => category?.slug && category.slug !== "uncategorized"
  );

  const categoryMap = new Map();
  const slugMap = new Map();

  [...usableProductCategories, ...allCategories].forEach((category) => {
    const id = getCategoryId(category);

    if (id) categoryMap.set(String(id), category);
    if (category?.slug) slugMap.set(category.slug, category);
  });

  const categoryPaths = usableProductCategories.map((category) => {
    const resolvedCategory = getCategoryByIdentity(category, categoryMap, slugMap);
    const path = [resolvedCategory];
    let currentCategory = resolvedCategory;
    const visitedIds = new Set([String(getCategoryId(category))]);

    while (Number(getCategoryParentId(currentCategory)) > 0) {
      const parentId = String(getCategoryParentId(currentCategory));

      if (visitedIds.has(parentId)) break;
      visitedIds.add(parentId);

      const parentCategory = categoryMap.get(parentId);
      if (!parentCategory) break;

      path.unshift(parentCategory);
      currentCategory = parentCategory;
    }

    return path.filter(
      (item) => item?.slug && item.slug !== "uncategorized"
    );
  });

  const deepestPath = categoryPaths
    .filter((path) => path.length > 0)
    .sort((a, b) => b.length - a.length)[0];

  return deepestPath?.[0] || null;
}

export default function ProductBreadcrumbs({
  product,
  productCategories = [],
  language = DEFAULT_LANGUAGE,
}) {
  const title = stripHtml(getRendered(product?.title));
  const categories = getProductCategories(product);
  const primaryCategory = getMainProductCategory(categories, productCategories);

  return (
    <nav aria-label="Breadcrumb" className="bg-white pt-[126px] md:pt-[136px]">
      <ol className="web-width flex flex-wrap items-center gap-2 px-6 pb-6 font-body text-[14px] leading-[22px] text-black/55">
        <li>
          <Link
            href={localizePath("/", language)}
            className="transition-colors hover:text-black"
          >
            Home
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        {primaryCategory && (
          <>
            <li>
              <Link
                href={localizePath(
                  `/product-category/${primaryCategory.slug}`,
                  language
                )}
                className="transition-colors hover:text-black"
              >
                {primaryCategory.name}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
          </>
        )}
        <li className="text-black" aria-current="page">
          {title}
        </li>
      </ol>
    </nav>
  );
}
