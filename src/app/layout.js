import "./globals.css";
import { Nunito_Sans } from "next/font/google";
import localFont from "next/font/local";

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

export const metadata = {
  title: "Components Library",
  description: "Headless WordPress + Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="sv">
      <body className={` ${nunitoSans.variable} ${miranda.variable}`}>
        {children}
      </body>
    </html>
  );
}
