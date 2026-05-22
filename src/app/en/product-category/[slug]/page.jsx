import { ENGLISH_LANGUAGE } from "@/lib/i18n";
import {
  generateProductCategoryMetadata,
  generateProductCategoryStaticParams,
  renderProductCategoryPage,
} from "@/app/_localizedRoutes";

export const revalidate = 60;

export function generateStaticParams() {
  return generateProductCategoryStaticParams(ENGLISH_LANGUAGE);
}

export function generateMetadata({ params }) {
  return generateProductCategoryMetadata(params, ENGLISH_LANGUAGE);
}

export default function EnglishProductCategoryPage({ params }) {
  return renderProductCategoryPage(params, ENGLISH_LANGUAGE);
}
