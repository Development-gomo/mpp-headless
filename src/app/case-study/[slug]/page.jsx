import Header from "@/components/major/Header";
import Footer from "@/components/major/Footer";
import SingleCaseStudyTemplate from "@/components/sections/case-study/SingleCaseStudyTemplate";
import { resolveParams } from "@/lib/params";
import { getCaseStudyBySlug, getCaseStudies, getProductById } from "@/lib/api";
import { buildMetadataFromYoast } from "@/lib/seo";
import { DEFAULT_LANGUAGE } from "@/lib/i18n";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateStaticParams() {
  const cases = await getCaseStudies({ language: DEFAULT_LANGUAGE });
  return (Array.isArray(cases) ? cases : []).map((c) => ({ slug: c.slug }));
}

export default async function CaseStudySinglePage({ params }) {
  const { slug } = resolveParams(await params);
  if (!slug) notFound();

  const caseStudy = await getCaseStudyBySlug(slug, { language: DEFAULT_LANGUAGE });
  if (!caseStudy) notFound();

  const caseStudies = await getCaseStudies({ language: DEFAULT_LANGUAGE });
  const relatedProductId =
    caseStudy?.acf?.related_product?.ID ||
    caseStudy?.acf?.related_product?.id ||
    caseStudy?.acf?.related_product;
  const relatedProduct =
    relatedProductId && typeof relatedProductId !== "object"
      ? await getProductById(relatedProductId, { language: DEFAULT_LANGUAGE })
      : caseStudy?.acf?.related_product;

  return (
    <>
      <Header
        variant="dark"
        language={DEFAULT_LANGUAGE}
        translationContext={{
          type: "case-study",
          id: caseStudy.id,
          slug: caseStudy.slug,
          path: `/case-study/${slug}`,
        }}
      />
      <main>
        <SingleCaseStudyTemplate
          caseStudy={caseStudy}
          relatedCaseStudies={caseStudies}
          relatedProduct={relatedProduct}
        />
      </main>
      <Footer />
    </>
  );
}

export async function generateMetadata({ params }) {
  const { slug } = resolveParams(await params);
  const caseStudy = await getCaseStudyBySlug(slug, { language: DEFAULT_LANGUAGE });
  return buildMetadataFromYoast(caseStudy, { fallbackTitle: slug });
}
