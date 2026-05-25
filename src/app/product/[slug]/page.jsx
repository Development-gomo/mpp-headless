import { DEFAULT_LANGUAGE } from "@/lib/i18n";
import {
  generateProductMetadata,
  generateProductStaticParams,
  renderProductPage,
} from "@/app/_localizedRoutes";

export const revalidate = 60;

export function generateStaticParams() {
  return generateProductStaticParams(DEFAULT_LANGUAGE);
}

export function generateMetadata({ params }) {
  return generateProductMetadata(params, DEFAULT_LANGUAGE);
}

export default function ProductSinglePage({ params }) {
  return renderProductPage(params, DEFAULT_LANGUAGE);
}
