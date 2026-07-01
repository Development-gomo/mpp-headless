import { ENGLISH_LANGUAGE } from "@/lib/i18n";
import {
  generateServiceMetadata,
  generateServiceStaticParams,
  renderServicePage,
} from "@/app/_localizedRoutes";

export const revalidate = 60;

export function generateStaticParams() {
  return generateServiceStaticParams(ENGLISH_LANGUAGE);
}

export function generateMetadata({ params }) {
  return generateServiceMetadata(params, ENGLISH_LANGUAGE);
}

export default function EnglishServiceSinglePage({ params }) {
  return renderServicePage(params, ENGLISH_LANGUAGE);
}
