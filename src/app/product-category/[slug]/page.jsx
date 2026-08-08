import { DEFAULT_LANGUAGE } from "@/lib/i18n";
import {
  generateProductCategoryMetadata,
  generateProductCategoryStaticParams,
  renderProductCategoryPage,
} from "@/app/_localizedRoutes";

export const revalidate = 60;

export function generateStaticParams() {
  return generateProductCategoryStaticParams(DEFAULT_LANGUAGE);
}

export function generateMetadata({ params }) {
  return generateProductCategoryMetadata(params, DEFAULT_LANGUAGE);
}

export default function ProductCategoryPage({ params }) {
  return renderProductCategoryPage(params, DEFAULT_LANGUAGE);
}
