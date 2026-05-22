import { GERMAN_LANGUAGE } from "@/lib/i18n";
import {
  generateDynamicMetadata,
  generateDynamicStaticParams,
  renderDynamicPage,
} from "@/app/_localizedRoutes";

export const revalidate = 60;

export function generateStaticParams() {
  return generateDynamicStaticParams(GERMAN_LANGUAGE);
}

export function generateMetadata({ params }) {
  return generateDynamicMetadata(params, GERMAN_LANGUAGE);
}

export default function GermanDynamicPage({ params }) {
  return renderDynamicPage(params, GERMAN_LANGUAGE);
}
