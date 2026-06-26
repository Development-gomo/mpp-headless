import Header from "@/components/major/Header";
import PageBuilder from "@/components/major/PageBuilder";
import Footer from "@/components/major/Footer";
import BodyClass from "@/components/BodyClass";
import { getPageBySlug, getProductCategoriesWithImages, getLatestPosts, getLatestCaseStudies, getIndustries, getTeams, getThemeOptions } from "@/lib/api";
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

  const hasPartners = page?.acf?.page_builder?.some(
    (section) => section?.acf_fc_layout === "partner_logo"
  );
  const hasIndustryListing = page?.acf?.page_builder?.some((section) =>
    ["inner_industry", "inner_industries", "industry_listing"].includes(
      section?.acf_fc_layout
    )
  );
  const [
    categoriesWithImages,
    latestPosts,
    latestCaseStudies,
    industries,
    teams,
    themeOptions,
  ] =
    await Promise.all([
      getProductCategoriesWithImages({ language: DEFAULT_LANGUAGE }),
      getLatestPosts({ language: DEFAULT_LANGUAGE }),
      getLatestCaseStudies({ language: DEFAULT_LANGUAGE }),
      hasIndustryListing ? getIndustries({ language: DEFAULT_LANGUAGE }) : [],
      getTeams({ language: DEFAULT_LANGUAGE }),
      hasPartners ? getThemeOptions({ language: DEFAULT_LANGUAGE }) : {},
    ]);
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
          industries={industries}
          teams={teams}
          themeOptions={themeOptions}
          language={DEFAULT_LANGUAGE}
        />
      </main>
      <Footer />
    </>
  );
}
