import Header from "@/components/major/Header";
import PageBuilder from "@/components/major/PageBuilder";
import Footer from "@/components/major/Footer";
import BodyClass from "@/components/BodyClass";
import SinglePostTemplate from "@/components/sections/blog/SinglePostTemplate";
import SingleCaseStudyTemplate from "@/components/sections/case-study/SingleCaseStudyTemplate";
import {
  getPageBySlug,
  getAllPages,
  getPostBySlug,
  getAllPosts,
  getCaseStudyBySlug,
  getCaseStudies,
  getLatestPosts,
  getLatestCaseStudies,
  getBlogSettings,
  getTeams,
  getAuthorCards,
  getProductById,
  getThemeOptions,
} from "@/lib/api";
import { buildMetadataFromYoast } from "@/lib/seo";
import { DEFAULT_LANGUAGE } from "@/lib/i18n";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateStaticParams() {
  const [pages, posts, caseStudies] = await Promise.all([
    getAllPages({ language: DEFAULT_LANGUAGE }),
    getAllPosts({ language: DEFAULT_LANGUAGE }),
    getCaseStudies({ language: DEFAULT_LANGUAGE }),
  ]);
  const pageParams = (Array.isArray(pages) ? pages : [])
    .filter((p) => !["frontpage", "home"].includes(p.slug))
    .map((p) => ({ slug: p.slug }));
  const pageSlugs = new Set(pageParams.map((item) => item.slug));
  const postParams = (Array.isArray(posts) ? posts : [])
    .filter((post) => post?.slug && !pageSlugs.has(post.slug))
    .map((post) => ({ slug: post.slug }));
  const postSlugs = new Set(postParams.map((item) => item.slug));
  const caseStudyParams = (Array.isArray(caseStudies) ? caseStudies : [])
    .filter(
      (caseStudy) =>
        caseStudy?.slug &&
        !pageSlugs.has(caseStudy.slug) &&
        !postSlugs.has(caseStudy.slug)
    )
    .map((caseStudy) => ({ slug: caseStudy.slug }));

  return [...pageParams, ...postParams, ...caseStudyParams];
}

export default async function DynamicPage({ params }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug, { language: DEFAULT_LANGUAGE });

  if (!page) {
    const post = await getPostBySlug(slug, { language: DEFAULT_LANGUAGE });
    if (!post) {
      const caseStudy = await getCaseStudyBySlug(slug, {
        language: DEFAULT_LANGUAGE,
      });
      if (!caseStudy) notFound();

      const caseStudies = await getCaseStudies({ language: DEFAULT_LANGUAGE });
      const relatedProductId =
        caseStudy?.acf?.related_product?.ID ||
        caseStudy?.acf?.related_product?.id ||
        caseStudy?.acf?.related_product;
      const relatedProduct =
        relatedProductId && typeof relatedProductId !== "object"
          ? await getProductById(relatedProductId, {
              language: DEFAULT_LANGUAGE,
            })
          : caseStudy?.acf?.related_product;

      return (
        <>
          <BodyClass className={slug} />
          <Header
            variant="dark"
            language={DEFAULT_LANGUAGE}
            translationContext={{
              type: "case-study",
              id: caseStudy.id,
              slug: caseStudy.slug,
              path: `/${slug}`,
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

    const [latestPosts, blogSettings, authorCards] = await Promise.all([
      getLatestPosts({ language: DEFAULT_LANGUAGE }),
      getBlogSettings({ language: DEFAULT_LANGUAGE }),
      getAuthorCards({ language: DEFAULT_LANGUAGE }),
    ]);

    return (
      <>
        <BodyClass className={slug} />
        <Header
          variant="dark"
          language={DEFAULT_LANGUAGE}
          translationContext={{
            type: "post",
            id: post.id,
            slug: post.slug,
            path: `/${slug}`,
          }}
        />
        <main>
          <SinglePostTemplate
            post={post}
            relatedPosts={latestPosts}
            blogSettings={blogSettings}
            authorCards={authorCards}
          />
        </main>
        <Footer />
      </>
    );
  }

  const hasPartners = page?.acf?.page_builder?.some(
    (section) => section?.acf_fc_layout === "partner_logo"
  );
  const [latestPosts, latestCaseStudies, teams, themeOptions] = await Promise.all([
    getLatestPosts({ language: DEFAULT_LANGUAGE }),
    getLatestCaseStudies({ language: DEFAULT_LANGUAGE }),
    getTeams({ language: DEFAULT_LANGUAGE }),
    hasPartners ? getThemeOptions({ language: DEFAULT_LANGUAGE }) : {},
  ]);

  return (
    <>
      <BodyClass className={slug} />
      <Header
        language={DEFAULT_LANGUAGE}
        translationContext={{
          type: "page",
          id: page.id,
          slug: page.slug,
          path: `/${slug}`,
        }}
      />
      <main>
        <PageBuilder
          sections={page?.acf?.page_builder}
          posts={latestPosts}
          caseStudies={latestCaseStudies}
          teams={teams}
          themeOptions={themeOptions}
          language={DEFAULT_LANGUAGE}
        />
      </main>
      <Footer />
    </>
  );
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug, { language: DEFAULT_LANGUAGE });
  if (page) return buildMetadataFromYoast(page, { fallbackTitle: slug });

  const post = await getPostBySlug(slug, { language: DEFAULT_LANGUAGE });
  if (post) return buildMetadataFromYoast(post, { fallbackTitle: slug });

  const caseStudy = await getCaseStudyBySlug(slug, { language: DEFAULT_LANGUAGE });
  return buildMetadataFromYoast(caseStudy, { fallbackTitle: slug });
}
