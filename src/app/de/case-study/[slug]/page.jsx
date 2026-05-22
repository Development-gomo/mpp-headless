import { GERMAN_LANGUAGE } from "@/lib/i18n";
import {
  generateCaseStudyMetadata,
  generateCaseStudyStaticParams,
  renderCaseStudyPage,
} from "@/app/_localizedRoutes";

export const revalidate = 60;

export function generateStaticParams() {
  return generateCaseStudyStaticParams(GERMAN_LANGUAGE);
}

export function generateMetadata({ params }) {
  return generateCaseStudyMetadata(params, GERMAN_LANGUAGE);
}

export default function GermanCaseStudySinglePage({ params }) {
  return renderCaseStudyPage(params, GERMAN_LANGUAGE);
}
