import Footer from "@/components/major/Footer";
import Header from "@/components/major/Header";
import QuoteCartPageContent from "@/components/quote/QuoteCartPageContent";
import { DEFAULT_LANGUAGE } from "@/lib/i18n";

export const metadata = {
  title: "Request a quote",
};

export default function RfqPage() {
  return (
    <>
      <Header
        variant="dark"
        language={DEFAULT_LANGUAGE}
        translationContext={{ path: "/rfq" }}
      />
      <main>
        <QuoteCartPageContent />
      </main>
      <Footer />
    </>
  );
}
