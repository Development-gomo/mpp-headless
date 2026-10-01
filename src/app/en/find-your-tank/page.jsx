import { ENGLISH_LANGUAGE } from "@/lib/i18n";
import {
  generateFindYourTankMetadata,
  renderFindYourTankPage,
} from "@/app/_findYourTank";

export const revalidate = 60;

export function generateMetadata() {
  return generateFindYourTankMetadata(ENGLISH_LANGUAGE);
}

export default function EnglishFindYourTankPage() {
  return renderFindYourTankPage(ENGLISH_LANGUAGE);
}
