import Link from "next/link";
import { getProductCategories, getRendered, stripHtml } from "./productUtils";

export default function ProductBreadcrumbs({ product }) {
  const title = stripHtml(getRendered(product?.title));
  const categories = getProductCategories(product);
  const primaryCategory = categories.find((category) => category?.slug !== "uncategorized");

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
