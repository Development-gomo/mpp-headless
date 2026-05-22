import { GERMAN_LANGUAGE } from "@/lib/i18n";
import { generateHomeMetadata, renderHomePage } from "@/app/_localizedRoutes";

export const revalidate = 60;

export function generateMetadata() {
  return generateHomeMetadata(GERMAN_LANGUAGE);
}

export default function GermanHomePage() {
  return renderHomePage(GERMAN_LANGUAGE);
}
