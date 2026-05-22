import Header from "@/components/major/Header";
import PageBuilder from "@/components/major/PageBuilder";
import Footer from "@/components/major/Footer";
import BodyClass from "@/components/BodyClass";
import { getPageBySlug, getProductCategoriesWithImages, getLatestPosts, getLatestCaseStudies } from "@/lib/api";
import { buildMetadataFromYoast } from "@/lib/seo";
import { DEFAULT_LANGUAGE } from "@/lib/i18n";
import { notFound } from "next/navigation";


export const revalidate = 60;

// async function getPage() {
//   return getPageBySlug("frontpage");
// } 
async function getPage() {
  const page = await getPageBySlug("frontpage", { language: DEFAULT_LANGUAGE });
  //console.log("HOME PAGE:", page);
  return page;
}

export async function generateMetadata() {
  const page = await getPage();
  return buildMetadataFromYoast(page, { fallbackTitle: "Home" });
}

export default async function HomePage() {
  const page = await getPage();
  if (!page) notFound();

  const categoriesWithImages = await getProductCategoriesWithImages({
    language: DEFAULT_LANGUAGE,
  });
  const latestPosts = await getLatestPosts({ language: DEFAULT_LANGUAGE });
  const latestCaseStudies = await getLatestCaseStudies({
    language: DEFAULT_LANGUAGE,
  });
  return (
    <>
      <BodyClass className={page.slug} />
      <Header
        translationContext={{
          type: "page",
          id: page.id,
          slug: page.slug,
          path: "/",
        }}
      />
      <main id="home">
        <PageBuilder
          sections={page?.acf?.page_builder}
          categoriesWithImages={categoriesWithImages}
          posts={latestPosts}
          caseStudies={latestCaseStudies}
          language={DEFAULT_LANGUAGE}
        />
      </main>
      <Footer />
    </>
  );
}
