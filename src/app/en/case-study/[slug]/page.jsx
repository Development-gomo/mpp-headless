import { ENGLISH_LANGUAGE } from "@/lib/i18n";
import {
  generateCaseStudyMetadata,
  generateCaseStudyStaticParams,
  renderCaseStudyPage,
} from "@/app/_localizedRoutes";

export const revalidate = 60;

export function generateStaticParams() {
  return generateCaseStudyStaticParams(ENGLISH_LANGUAGE);
}

export function generateMetadata({ params }) {
  return generateCaseStudyMetadata(params, ENGLISH_LANGUAGE);
}

export default function EnglishCaseStudySinglePage({ params }) {
  return renderCaseStudyPage(params, ENGLISH_LANGUAGE);
}
