import { DEFAULT_LANGUAGE } from "@/lib/i18n";
import {
  generateServiceMetadata,
  generateServiceStaticParams,
  renderServicePage,
} from "@/app/_localizedRoutes";

export const revalidate = 60;

export function generateStaticParams() {
  return generateServiceStaticParams(DEFAULT_LANGUAGE);
}

export function generateMetadata({ params }) {
  return generateServiceMetadata(params, DEFAULT_LANGUAGE);
}

export default function ServiceSinglePage({ params }) {
  return renderServicePage(params, DEFAULT_LANGUAGE);
}
