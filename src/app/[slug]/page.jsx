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
} from "@/lib/api";
import { buildMetadataFromYoast } from "@/lib/seo";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateStaticParams() {
  const [pages, posts, caseStudies] = await Promise.all([
    getAllPages(),
    getAllPosts(),
    getCaseStudies(),
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
  const page = await getPageBySlug(slug);

  if (!page) {
    const post = await getPostBySlug(slug);
    if (!post) {
      const caseStudy = await getCaseStudyBySlug(slug);
      if (!caseStudy) notFound();

      const caseStudies = await getCaseStudies();

      return (
        <>
          <BodyClass className={slug} />
          <Header />
          <main>
            <SingleCaseStudyTemplate
              caseStudy={caseStudy}
              relatedCaseStudies={caseStudies}
            />
          </main>
          <Footer />
        </>
      );
    }

    const [latestPosts, blogSettings] = await Promise.all([
      getLatestPosts(),
      getBlogSettings(),
    ]);

    return (
      <>
        <BodyClass className={slug} />
        <Header />
        <main>
          <SinglePostTemplate
            post={post}
            relatedPosts={latestPosts}
            blogSettings={blogSettings}
          />
        </main>
        <Footer />
      </>
    );
  }

  const [latestPosts, latestCaseStudies] = await Promise.all([
    getLatestPosts(),
    getLatestCaseStudies(),
  ]);

  return (
    <>
      <BodyClass className={slug} />
      <Header />
      <main>
        <PageBuilder
          sections={page?.acf?.page_builder}
          posts={latestPosts}
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
  if (page) return buildMetadataFromYoast(page, { fallbackTitle: slug });

  const post = await getPostBySlug(slug);
  if (post) return buildMetadataFromYoast(post, { fallbackTitle: slug });

  const caseStudy = await getCaseStudyBySlug(slug);
  return buildMetadataFromYoast(caseStudy, { fallbackTitle: slug });
}
