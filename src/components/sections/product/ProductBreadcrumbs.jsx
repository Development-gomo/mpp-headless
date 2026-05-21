import Link from "next/link";
import { getProductCategories, getRendered, stripHtml } from "./productUtils";

function getCategoryId(category) {
  return category?.term_id || category?.id;
}

function getCategoryParentId(category) {
  return category?.parent || category?.parent_id || 0;
}

function getMainProductCategory(productCategories, allCategories) {
  const usableProductCategories = productCategories.filter(
    (category) => category?.slug && category.slug !== "uncategorized"
  );

  const categoryMap = new Map(
    [...allCategories, ...usableProductCategories]
      .map((category) => [String(getCategoryId(category)), category])
      .filter(([id]) => id && id !== "undefined")
  );

  const topLevelProductCategory = usableProductCategories.find(
    (category) => Number(getCategoryParentId(category)) === 0
  );

  if (topLevelProductCategory) return topLevelProductCategory;

  const firstCategory = usableProductCategories[0];
  if (!firstCategory) return null;

  let currentCategory = firstCategory;
  const visitedIds = new Set();

  while (Number(getCategoryParentId(currentCategory)) > 0) {
    const parentId = String(getCategoryParentId(currentCategory));

    if (visitedIds.has(parentId)) break;
    visitedIds.add(parentId);

    const parentCategory = categoryMap.get(parentId);
    if (!parentCategory) break;

    currentCategory = parentCategory;
  }

  return currentCategory;
}

export default function ProductBreadcrumbs({ product, productCategories = [] }) {
  const title = stripHtml(getRendered(product?.title));
  const categories = getProductCategories(product);
  const primaryCategory = getMainProductCategory(categories, productCategories);

  return (
    <nav aria-label="Breadcrumb" className="bg-white pt-[126px] md:pt-[136px]">
      <ol className="web-width flex flex-wrap items-center gap-2 px-6 pb-6 font-body text-[14px] leading-[22px] text-black/55">
        <li>
          <Link href="/" className="transition-colors hover:text-black">
            Home
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        {primaryCategory && (
          <>
            <li>
              <Link
                href={`/product-category/${primaryCategory.slug}`}
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
