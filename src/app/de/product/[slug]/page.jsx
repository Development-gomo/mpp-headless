import { GERMAN_LANGUAGE } from "@/lib/i18n";
import {
  generateProductMetadata,
  generateProductStaticParams,
  renderProductPage,
} from "@/app/_localizedRoutes";

export const revalidate = 60;

export function generateStaticParams() {
  return generateProductStaticParams(GERMAN_LANGUAGE);
}

export function generateMetadata({ params }) {
  return generateProductMetadata(params, GERMAN_LANGUAGE);
}

export default function GermanProductSinglePage({ params }) {
  return renderProductPage(params, GERMAN_LANGUAGE);
}
