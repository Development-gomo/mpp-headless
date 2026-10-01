import { GERMAN_LANGUAGE } from "@/lib/i18n";
import {
  generateFindYourTankMetadata,
  renderFindYourTankPage,
} from "@/app/_findYourTank";

export const revalidate = 60;

export function generateMetadata() {
  return generateFindYourTankMetadata(GERMAN_LANGUAGE);
}

export default function GermanFindYourTankPage() {
  return renderFindYourTankPage(GERMAN_LANGUAGE);
}
