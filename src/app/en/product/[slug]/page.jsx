import { ENGLISH_LANGUAGE } from "@/lib/i18n";
import {
  generateProductMetadata,
  generateProductStaticParams,
  renderProductPage,
} from "@/app/_localizedRoutes";

export const revalidate = 60;

export function generateStaticParams() {
  return generateProductStaticParams(ENGLISH_LANGUAGE);
}

export function generateMetadata({ params }) {
  return generateProductMetadata(params, ENGLISH_LANGUAGE);
}

export default function EnglishProductSinglePage({ params }) {
  return renderProductPage(params, ENGLISH_LANGUAGE);
}
