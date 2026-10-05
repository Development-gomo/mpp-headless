import { DEFAULT_LANGUAGE } from "@/lib/i18n";
import {
  generateFindYourTankMetadata,
  renderFindYourTankPage,
} from "@/app/_findYourTank";

export const revalidate = 60;

export function generateMetadata() {
  return generateFindYourTankMetadata(DEFAULT_LANGUAGE);
}

export default function FindYourTankPage() {
  return renderFindYourTankPage(DEFAULT_LANGUAGE);
}
