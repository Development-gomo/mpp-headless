import { GERMAN_LANGUAGE } from "@/lib/i18n";
import {
  generateProductCategoryMetadata,
  generateProductCategoryStaticParams,
  renderProductCategoryPage,
} from "@/app/_localizedRoutes";

export const revalidate = 60;

export function generateStaticParams() {
  return generateProductCategoryStaticParams(GERMAN_LANGUAGE);
}

export function generateMetadata({ params }) {
  return generateProductCategoryMetadata(params, GERMAN_LANGUAGE);
}

export default function GermanProductCategoryPage({ params }) {
  return renderProductCategoryPage(params, GERMAN_LANGUAGE);
}
