import { notFound } from "next/navigation";
import BodyClass from "@/components/BodyClass";
import Footer from "@/components/major/Footer";
import Header from "@/components/major/Header";
import PageBuilder from "@/components/major/PageBuilder";
import SinglePostTemplate from "@/components/sections/blog/SinglePostTemplate";
import SingleCaseStudyTemplate from "@/components/sections/case-study/SingleCaseStudyTemplate";
import ProductPageTemplate from "@/components/sections/product/ProductPageTemplate";
import ProductCategoryBanner from "@/components/sections/product-category/ProductCategoryBanner";
import ProductCategoryProductSections from "@/components/sections/product-category/ProductCategoryProductSections";
import ProductCategorySeoSection from "@/components/sections/product-category/ProductCategorySeoSection";
import ProductCategoryFaqSection from "@/components/sections/product-category/ProductCategoryFaqSection";
import {
  getAllPages,
  getAllPosts,
  getAllProducts,
  getBlogSettings,
  getCaseStudies,
  getCaseStudyBySlug,
  getLatestCaseStudies,
  getLatestPosts,
  getPageBySlug,
  getPostBySlug,
  getProductBySlug,
  getProductCategories,
  getProductCategoriesWithImages,
  getProductCategoryBySlug,
  getProductsByCategory,
} from "@/lib/api";
import { resolveParams } from "@/lib/params";
import { buildMetadataFromYoast } from "@/lib/seo";

export async function generateHomeMetadata(language) {
  const page = await getPageBySlug("frontpage", { language });
  return buildMetadataFromYoast(page, { fallbackTitle: "Home" });
}

export async function renderHomePage(language) {
  const page = await getPageBySlug("frontpage", { language });
  if (!page) notFound();

  const [categoriesWithImages, latestPosts, latestCaseStudies] =
    await Promise.all([
      getProductCategoriesWithImages({ language }),
      getLatestPosts({ language }),
      getLatestCaseStudies({ language }),
    ]);

  return (
    <>
      <BodyClass className={page.slug} />
      <Header
        language={language}
        translationContext={{ type: "page", id: page.id, slug: page.slug, path: "/" }}
      />
      <main id="home">
        <PageBuilder
          sections={page?.acf?.page_builder}
          categoriesWithImages={categoriesWithImages}
          posts={latestPosts}
          caseStudies={latestCaseStudies}
          language={language}
        />
      </main>
      <Footer />
    </>
  );
}

export async function generateDynamicStaticParams(language) {
  const [pages, posts, caseStudies] = await Promise.all([
    getAllPages({ language }),
    getAllPosts({ language }),
    getCaseStudies({ language }),
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

export async function renderDynamicPage(params, language) {
  const { slug } = await params;
  const page = await getPageBySlug(slug, { language });

  if (!page) {
    const post = await getPostBySlug(slug, { language });
    if (!post) {
      const caseStudy = await getCaseStudyBySlug(slug, { language });
      if (!caseStudy) notFound();

      const caseStudies = await getCaseStudies({ language });

      return (
        <>
          <BodyClass className={slug} />
          <Header
            variant="dark"
            language={language}
            translationContext={{
              type: "case-study",
              id: caseStudy.id,
              slug: caseStudy.slug,
              path: `/${language === "sv" ? "" : `${language}/`}${slug}`,
            }}
          />
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
      getLatestPosts({ language }),
      getBlogSettings({ language }),
    ]);

    return (
      <>
        <BodyClass className={slug} />
        <Header
          variant="dark"
          language={language}
          translationContext={{
            type: "post",
            id: post.id,
            slug: post.slug,
            path: `/${language === "sv" ? "" : `${language}/`}${slug}`,
          }}
        />
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
    getLatestPosts({ language }),
    getLatestCaseStudies({ language }),
  ]);

  return (
    <>
      <BodyClass className={slug} />
      <Header
        language={language}
        translationContext={{
          type: "page",
          id: page.id,
          slug: page.slug,
          path: `/${language === "sv" ? "" : `${language}/`}${slug}`,
        }}
      />
      <main>
        <PageBuilder
          sections={page?.acf?.page_builder}
          posts={latestPosts}
          caseStudies={latestCaseStudies}
          language={language}
        />
      </main>
      <Footer />
    </>
  );
}

export async function generateDynamicMetadata(params, language) {
  const { slug } = await params;
  const page = await getPageBySlug(slug, { language });
  if (page) return buildMetadataFromYoast(page, { fallbackTitle: slug });

  const post = await getPostBySlug(slug, { language });
  if (post) return buildMetadataFromYoast(post, { fallbackTitle: slug });

  const caseStudy = await getCaseStudyBySlug(slug, { language });
  return buildMetadataFromYoast(caseStudy, { fallbackTitle: slug });
}

export async function generateProductStaticParams(language) {
  const products = await getAllProducts({ language });
  return (Array.isArray(products) ? products : []).map((product) => ({
    slug: product.slug,
  }));
}

export async function generateProductMetadata(params, language) {
  const { slug } = resolveParams(await params);
  const product = await getProductBySlug(slug, { language });
  return buildMetadataFromYoast(product, { fallbackTitle: slug });
}

export async function renderProductPage(params, language) {
  const { slug } = resolveParams(await params);
  if (!slug) notFound();

  const product = await getProductBySlug(slug, { language });
  if (!product) notFound();

  const productCategories = await getProductCategories({ language });

  return (
    <>
      <Header
        variant="dark"
        language={language}
        translationContext={{
          type: "product",
          id: product.id,
          slug: product.slug,
          path: `/${language === "sv" ? "" : `${language}/`}product/${slug}`,
        }}
      />
      <main>
        <ProductPageTemplate
          product={product}
          productCategories={productCategories}
          language={language}
        />
      </main>
      <Footer />
    </>
  );
}

export async function generateProductCategoryStaticParams(language) {
  const categories = await getProductCategories({ language });

  return categories
    .filter((cat) => cat.slug !== "uncategorized" && Number(cat.term_id) !== 15)
    .map((cat) => ({
      slug: cat.slug,
    }));
}

export async function generateProductCategoryMetadata(params, language) {
  const { slug } = await params;
  const category = await getProductCategoryBySlug(slug, { language });

  return {
    title: category?.acf?.banner_title || category?.name || "Product Category",
    description: category?.acf?.banner_text || category?.description || "",
  };
}

export async function renderProductCategoryPage(params, language) {
  const { slug } = await params;

  const categories = await getProductCategories({ language });
  const category = await getProductCategoryBySlug(slug, { language });

  if (!category) notFound();

  const childCategories = categories.filter(
    (cat) => Number(cat.parent) === Number(category.term_id)
  );

  const childCategoriesWithProducts = await Promise.all(
    childCategories.map(async (childCat) => {
      const products = await getProductsByCategory(childCat.term_id, {
        language,
      });

      return {
        ...childCat,
        products,
      };
    })
  );

  const tabCategories = categories.filter(
    (cat) => cat.slug !== "uncategorized" && Number(cat.term_id) !== 15
  );

  return (
    <>
      <Header
        language={language}
        translationContext={{
          type: "product_cat",
          id: category.id || category.term_id,
          slug: category.slug,
          path: `/${language === "sv" ? "" : `${language}/`}product-category/${slug}`,
        }}
      />
      <main>
        <ProductCategoryBanner
          category={category}
          categories={tabCategories}
          language={language}
        />
        <ProductCategoryProductSections
          currentCategory={category}
          childCategories={childCategoriesWithProducts}
          language={language}
        />
        <ProductCategorySeoSection category={category} />
        <ProductCategoryFaqSection category={category} />
      </main>
      <Footer />
    </>
  );
}

export async function generateCaseStudyStaticParams(language) {
  const cases = await getCaseStudies({ language });
  return (Array.isArray(cases) ? cases : []).map((c) => ({ slug: c.slug }));
}

export async function generateCaseStudyMetadata(params, language) {
  const { slug } = resolveParams(await params);
  const caseStudy = await getCaseStudyBySlug(slug, { language });
  return buildMetadataFromYoast(caseStudy, { fallbackTitle: slug });
}

export async function renderCaseStudyPage(params, language) {
  const { slug } = resolveParams(await params);
  if (!slug) notFound();

  const caseStudy = await getCaseStudyBySlug(slug, { language });
  if (!caseStudy) notFound();

  const caseStudies = await getCaseStudies({ language });

  return (
    <>
      <Header
        variant="dark"
        language={language}
        translationContext={{
          type: "case-study",
          id: caseStudy.id,
          slug: caseStudy.slug,
          path: `/${language === "sv" ? "" : `${language}/`}case-study/${slug}`,
        }}
      />
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
