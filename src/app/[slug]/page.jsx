import Header from "@/components/major/Header";
import PageBuilder from "@/components/major/PageBuilder";
import Footer from "@/components/major/Footer";
import BodyClass from "@/components/BodyClass";
import { getPageBySlug, getAllPages, getLatestCaseStudies } from "@/lib/api";
import { buildMetadataFromYoast } from "@/lib/seo";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateStaticParams() {
  const pages = await getAllPages();
  return (Array.isArray(pages) ? pages : [])
    .filter((p) => !["frontpage", "home"].includes(p.slug))
    .map((p) => ({ slug: p.slug }));
}

export default async function DynamicPage({ params }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) notFound();
  const latestCaseStudies = await getLatestCaseStudies();

  return (
    <>
      <BodyClass className={slug} />
      <Header />
      <main>
        <PageBuilder
          sections={page?.acf?.page_builder}
          caseStudies={latestCaseStudies}
        />
      </main>
      <Footer />
    </>
  );
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  return buildMetadataFromYoast(page, { fallbackTitle: slug });
}
