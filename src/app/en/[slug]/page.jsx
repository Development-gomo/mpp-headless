import { ENGLISH_LANGUAGE } from "@/lib/i18n";
import {
  generateDynamicMetadata,
  generateDynamicStaticParams,
  renderDynamicPage,
} from "@/app/_localizedRoutes";

export const revalidate = 60;

export function generateStaticParams() {
  return generateDynamicStaticParams(ENGLISH_LANGUAGE);
}

export function generateMetadata({ params }) {
  return generateDynamicMetadata(params, ENGLISH_LANGUAGE);
}

export default function EnglishDynamicPage({ params }) {
  return renderDynamicPage(params, ENGLISH_LANGUAGE);
}
