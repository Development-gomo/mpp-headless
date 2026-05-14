import Header from "@/components/major/Header";
import PageBuilder from "@/components/major/PageBuilder";
import Footer from "@/components/major/Footer";
import BodyClass from "@/components/BodyClass";
import { getPageBySlug, getProductCategoriesWithImages, getLatestPosts, getLatestCaseStudies } from "@/lib/api";
import { buildMetadataFromYoast } from "@/lib/seo";
import { notFound } from "next/navigation";


export const revalidate = 60;

// async function getPage() {
//   return getPageBySlug("frontpage");
// } 
async function getPage() {
  const page = await getPageBySlug("frontpage");
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

  const categoriesWithImages = await getProductCategoriesWithImages();
  const latestPosts = await getLatestPosts();
  const latestCaseStudies = await getLatestCaseStudies();
  return (
    <>
      <BodyClass className={page.slug} />
      <Header />
      <main id="home">
        <PageBuilder
          sections={page?.acf?.page_builder}
          categoriesWithImages={categoriesWithImages}
          posts={latestPosts}
          caseStudies={latestCaseStudies}
        />
      </main>
      <Footer />
    </>
  );
}
