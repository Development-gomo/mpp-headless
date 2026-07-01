import { DEFAULT_LANGUAGE } from "@/lib/i18n";
import {
  generateDynamicMetadata,
  generateDynamicStaticParams,
  renderDynamicPage,
} from "@/app/_localizedRoutes";

export const revalidate = 60;

export function generateStaticParams() {
  return generateDynamicStaticParams(DEFAULT_LANGUAGE);
}

export function generateMetadata({ params }) {
  return generateDynamicMetadata(params, DEFAULT_LANGUAGE);
}

export default function DynamicPage({ params }) {
  return renderDynamicPage(params, DEFAULT_LANGUAGE);
}
