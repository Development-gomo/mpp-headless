import { ENGLISH_LANGUAGE } from "@/lib/i18n";
import {
  generateIndustryMetadata,
  generateIndustryStaticParams,
  renderIndustryPage,
} from "@/app/_localizedRoutes";

export const revalidate = 60;

export function generateStaticParams() {
  return generateIndustryStaticParams(ENGLISH_LANGUAGE);
}

export function generateMetadata({ params }) {
  return generateIndustryMetadata(params, ENGLISH_LANGUAGE);
}

export default function EnglishIndustrySinglePage({ params }) {
  return renderIndustryPage(params, ENGLISH_LANGUAGE);
}
