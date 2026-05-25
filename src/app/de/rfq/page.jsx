import Footer from "@/components/major/Footer";
import Header from "@/components/major/Header";
import QuoteCartPageContent from "@/components/quote/QuoteCartPageContent";

export const metadata = {
  title: "Request a quote",
};

export default function RfqPage() {
  return (
    <>
      <Header
        variant="dark"
        language="de"
        translationContext={{ path: "/de/rfq" }}
      />
      <main>
        <QuoteCartPageContent />
      </main>
      <Footer />
    </>
  );
}
