import { DEFAULT_LANGUAGE } from "@/lib/i18n";
import {
  generateIndustryMetadata,
  generateIndustryStaticParams,
  renderIndustryPage,
} from "@/app/_localizedRoutes";

export const revalidate = 60;

export function generateStaticParams() {
  return generateIndustryStaticParams(DEFAULT_LANGUAGE);
}

export function generateMetadata({ params }) {
  return generateIndustryMetadata(params, DEFAULT_LANGUAGE);
}

export default function IndustrySinglePage({ params }) {
  return renderIndustryPage(params, DEFAULT_LANGUAGE);
}
