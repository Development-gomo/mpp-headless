import "./globals.css";
import { Nunito_Sans } from "next/font/google";
import localFont from "next/font/local";
import QuoteCartProvider from "@/components/quote/QuoteCartProvider";
import { getThemeOptions } from "@/lib/api";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
  display: "swap",
});

const miranda = localFont({
  src: [
    {
      path: "../fonts/MirandaSans-VariableFont_wght.ttf",
      weight: "100 400 500 700", // 👈 variable range
      style: "normal",
    },
  ],
  variable: "--font-miranda-sans",
  display: "swap",
});

function pickFirstObject(candidates = []) {
  return (
    candidates.find(
      (item) => item && typeof item === "object" && !Array.isArray(item)
    ) || {}
  );
}

function getImageUrl(image) {
  if (!image || typeof image === "number") return "";
  if (typeof image === "string") return image;

  return image.url || image.source_url || image.sizes?.full || "";
}

function getThemeFavicon(themeOptions) {
  const options = pickFirstObject([
    themeOptions?.options?.acf,
    themeOptions?.options,
    themeOptions?.data?.acf,
    themeOptions?.data,
    themeOptions?.acf,
    themeOptions,
  ]);
  const header = pickFirstObject([
    options?.header,
    options?.header_options,
    options?.global,
    options,
  ]);

  return getImageUrl(
    header?.favicon ||
      header?.header_favicon ||
      header?.site_icon ||
      options?.favicon ||
      options?.global?.favicon
  );
}

export async function generateMetadata() {
  const themeOptions = await getThemeOptions();
  const favicon = getThemeFavicon(themeOptions) || "/favicon-mpp.png";

  return {
    title: "MPP Headless",
    description: "MPP Headless WordPress + Next.js",
    icons: {
      icon: favicon,
      shortcut: favicon,
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="sv">
      <body className={` ${nunitoSans.variable} ${miranda.variable}`}>
        <QuoteCartProvider>{children}</QuoteCartProvider>
      </body>
    </html>
  );
}
