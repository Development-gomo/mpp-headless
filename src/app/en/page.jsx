import { ENGLISH_LANGUAGE } from "@/lib/i18n";
import { generateHomeMetadata, renderHomePage } from "@/app/_localizedRoutes";

export const revalidate = 60;

export function generateMetadata() {
  return generateHomeMetadata(ENGLISH_LANGUAGE);
}

export default function EnglishHomePage() {
  return renderHomePage(ENGLISH_LANGUAGE);
}
