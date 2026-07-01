import { GERMAN_LANGUAGE } from "@/lib/i18n";
import {
  generateServiceMetadata,
  generateServiceStaticParams,
  renderServicePage,
} from "@/app/_localizedRoutes";

export const revalidate = 60;

export function generateStaticParams() {
  return generateServiceStaticParams(GERMAN_LANGUAGE);
}

export function generateMetadata({ params }) {
  return generateServiceMetadata(params, GERMAN_LANGUAGE);
}

export default function GermanServiceSinglePage({ params }) {
  return renderServicePage(params, GERMAN_LANGUAGE);
}
