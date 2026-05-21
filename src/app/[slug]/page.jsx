import Header from "@/components/major/Header";
import PageBuilder from "@/components/major/PageBuilder";
import Footer from "@/components/major/Footer";
import BodyClass from "@/components/BodyClass";
import SinglePostTemplate from "@/components/sections/blog/SinglePostTemplate";
import {
  getPageBySlug,
  getAllPages,
  getPostBySlug,
  getAllPosts,
  getLatestPosts,
  getLatestCaseStudies,
  getBlogSettings,
} from "@/lib/api";
import { buildMetadataFromYoast } from "@/lib/seo";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateStaticParams() {
  const [pages, posts] = await Promise.all([getAllPages(), getAllPosts()]);
  const pageParams = (Array.isArray(pages) ? pages : [])
    .filter((p) => !["frontpage", "home"].includes(p.slug))
    .map((p) => ({ slug: p.slug }));
  const pageSlugs = new Set(pageParams.map((item) => item.slug));
  const postParams = (Array.isArray(posts) ? posts : [])
    .filter((post) => post?.slug && !pageSlugs.has(post.slug))
    .map((post) => ({ slug: post.slug }));

  return [...pageParams, ...postParams];
}

export default async function DynamicPage({ params }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    const post = await getPostBySlug(slug);
    if (!post) notFound();
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
  return buildMetadataFromYoast(post, { fallbackTitle: slug });
}
