import Link from "next/link";
import Image from "next/image";
import Header from "@/components/major/Header";
import Footer from "@/components/major/Footer";
import {
  DEFAULT_LANGUAGE,
  ENGLISH_LANGUAGE,
  GERMAN_LANGUAGE,
} from "@/lib/i18n";
import ArrowSvg from "../../public/right-arrow.svg";

const NOT_FOUND_LABELS = {
  [DEFAULT_LANGUAGE]: {
    homepage: "Gå till startsidan",
  },
  [ENGLISH_LANGUAGE]: {
    homepage: "Go to Homepage",
  },
  [GERMAN_LANGUAGE]: {
    homepage: "Zur Startseite",
  },
};

export default async function NotFound() {
  const labels = NOT_FOUND_LABELS[DEFAULT_LANGUAGE];

  return (
    <>
      <Header />
      <div className="h-28 w-full bg-black"></div>
      <main className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 py-16 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-gray-500">404</p>
        <h1 className="text-4xl font-semibold">The page you&apos;re looking for doesn&apos;t exist.</h1>
        <p className="text-gray-600 max-w-xl">
          It might have been removed, renamed, or is temporarily unavailable. Please double-check the URL or head back to the homepage.
        </p>
        <Link
          href="/"
          className="gap-3 group relative inline-flex items-center rounded-sm bg-(--color-brand) px-6 py-4 text-white transition-all duration-300 w-[195px] overflow-hidden select-none"
        >
          <span className="relative w-6 flex items-center justify-center">
            <span className="absolute h-2 w-2 rounded-full bg-[#27E0C0] transition-all duration-300 ease-out group-hover:opacity-0 group-hover:-translate-x-1"></span>
          </span>
          <span className="flex-1 text-[16px] leading-none whitespace-nowrap transition-all duration-300 ease-out group-hover:-translate-x-3">
            {labels.homepage}
          </span>
          <span className="relative w-4 flex items-center justify-center">
            <span className="w-4 absolute opacity-0 -translate-x-4 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:-translate-x-1">
              <Image src={ArrowSvg} width={13} height={13} alt="arrow" />
            </span>
          </span>
        </Link>
      </main>
      <Footer />
    </>
  );
}
