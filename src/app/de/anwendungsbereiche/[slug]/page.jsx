import { GERMAN_LANGUAGE } from "@/lib/i18n";
import {
  generateIndustryMetadata,
  generateIndustryStaticParams,
  renderIndustryPage,
} from "@/app/_localizedRoutes";

export const revalidate = 60;

export function generateStaticParams() {
  return generateIndustryStaticParams(GERMAN_LANGUAGE);
}

export function generateMetadata({ params }) {
  return generateIndustryMetadata(params, GERMAN_LANGUAGE);
}

export default function GermanIndustrySinglePage({ params }) {
  return renderIndustryPage(params, GERMAN_LANGUAGE);
}
