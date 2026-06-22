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
  getAuthorCards,
  getBlogSettings,
  getCaseStudies,
  getCaseStudyBySlug,
  getIndustries,
  getIndustryBySlug,
  getLatestCaseStudies,
  getLatestPosts,
  getPageBySlug,
  getPostBySlug,
  getProductById,
  getProductBySlug,
  getProductCategories,
  getProductCategoriesWithImages,
  getProductCategoryBySlug,
  getProductsByCategory,
  getThemeOptions,
  getTeams,
  getStores,
} from "@/lib/api";
import { getProductCategories as getProductTerms } from "@/components/sections/product/productUtils";
import { resolveParams } from "@/lib/params";
import { buildMetadataFromYoast } from "@/lib/seo";
import { getIndustryRouteSegment } from "@/lib/i18n";

function getCategoryId(category) {
  return category?.term_id || category?.id;
}

function hasPageBuilderSection(page, layoutName) {
  return Array.isArray(page?.acf?.page_builder)
    ? page.acf.page_builder.some((section) => section?.acf_fc_layout === layoutName)
    : false;
}

function getCategoryParentId(category) {
  return category?.parent || category?.parent_id || 0;
}

function getCategoryDepth(category, categoryMap) {
  let depth = 0;
  let currentCategory = category;
  const visitedIds = new Set();

  while (Number(getCategoryParentId(currentCategory)) > 0) {
    const parentId = String(getCategoryParentId(currentCategory));
    if (visitedIds.has(parentId)) break;
    visitedIds.add(parentId);

    const parentCategory = categoryMap.get(parentId);
    if (!parentCategory) break;

    depth += 1;
    currentCategory = parentCategory;
  }

  return depth;
}

function getDeepestProductCategory(product, allCategories = []) {
  const productTerms = getProductTerms(product).filter(
    (category) => category?.slug && category.slug !== "uncategorized"
  );
  const categoryMap = new Map();
  const slugMap = new Map();

  [...productTerms, ...allCategories].forEach((category) => {
    const id = getCategoryId(category);
    if (id) categoryMap.set(String(id), category);
    if (category?.slug) slugMap.set(category.slug, category);
  });

  const resolvedTerms = productTerms
    .map((category) => {
      const id = getCategoryId(category);
      return (
        (id && categoryMap.get(String(id))) ||
        (category?.slug && slugMap.get(category.slug)) ||
        category
      );
    })
    .filter(Boolean);

  return (
    resolvedTerms.sort(
      (a, b) => getCategoryDepth(b, categoryMap) - getCategoryDepth(a, categoryMap)
    )[0] || null
  );
}

export async function generateHomeMetadata(language) {
  const page = await getPageBySlug("frontpage", { language });
  return buildMetadataFromYoast(page, { fallbackTitle: "Home" });
}

export async function renderHomePage(language) {
  const page = await getPageBySlug("frontpage", { language });
  if (!page) notFound();

  const shouldLoadStores = hasPageBuilderSection(page, "find_retailer_section");
  const shouldLoadPartners = hasPageBuilderSection(page, "partner_logo");
  const [categoriesWithImages, latestPosts, latestCaseStudies, teams, stores, themeOptions] =
    await Promise.all([
      getProductCategoriesWithImages({ language }),
      getLatestPosts({ language }),
      getLatestCaseStudies({ language }),
      getTeams({ language }),
      shouldLoadStores ? getStores({ language }) : [],
      shouldLoadPartners ? getThemeOptions({ language }) : {},
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
          teams={teams}
          stores={stores}
          themeOptions={themeOptions}
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
      const relatedProductId =
        caseStudy?.acf?.related_product?.ID ||
        caseStudy?.acf?.related_product?.id ||
        caseStudy?.acf?.related_product;
      const relatedProduct =
        relatedProductId && typeof relatedProductId !== "object"
          ? await getProductById(relatedProductId, { language })
          : caseStudy?.acf?.related_product;

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
              relatedProduct={relatedProduct}
            />
          </main>
          <Footer />
        </>
      );
    }

    const [latestPosts, blogSettings, authorCards] = await Promise.all([
      getLatestPosts({ language }),
      getBlogSettings({ language }),
      getAuthorCards({ language }),
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
            authorCards={authorCards}
          />
        </main>
        <Footer />
      </>
    );
  }

  const shouldLoadStores = hasPageBuilderSection(page, "find_retailer_section");
  const shouldLoadPartners = hasPageBuilderSection(page, "partner_logo");
  const [latestPosts, latestCaseStudies, teams, stores, themeOptions] = await Promise.all([
    getLatestPosts({ language }),
    getLatestCaseStudies({ language }),
    getTeams({ language }),
    shouldLoadStores ? getStores({ language }) : [],
    shouldLoadPartners ? getThemeOptions({ language }) : {},
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
          teams={teams}
          stores={stores}
          themeOptions={themeOptions}
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

  const [productCategories, themeOptions] = await Promise.all([
    getProductCategories({ language }),
    getThemeOptions({ language }),
  ]);
  const relatedCategory = getDeepestProductCategory(product, productCategories);
  const relatedProducts = relatedCategory
    ? await getProductsByCategory(getCategoryId(relatedCategory), { language })
    : [];

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
          themeOptions={themeOptions}
          relatedCategory={relatedCategory}
          relatedProducts={relatedProducts}
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
  const relatedProductId =
    caseStudy?.acf?.related_product?.ID ||
    caseStudy?.acf?.related_product?.id ||
    caseStudy?.acf?.related_product;
  const relatedProduct =
    relatedProductId && typeof relatedProductId !== "object"
      ? await getProductById(relatedProductId, { language })
      : caseStudy?.acf?.related_product;

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
          relatedProduct={relatedProduct}
        />
      </main>
      <Footer />
    </>
  );
}

export async function generateIndustryStaticParams(language) {
  const industries = await getIndustries({ language });
  return industries.map((industry) => ({ slug: industry.slug }));
}

export async function generateIndustryMetadata(params, language) {
  const { slug } = resolveParams(await params);
  const industry = await getIndustryBySlug(slug, { language });
  return buildMetadataFromYoast(industry, { fallbackTitle: slug });
}

export async function renderIndustryPage(params, language) {
  const { slug } = resolveParams(await params);
  if (!slug) notFound();

  const industry = await getIndustryBySlug(slug, { language });
  if (!industry) notFound();

  const shouldLoadStores = hasPageBuilderSection(
    industry,
    "find_retailer_section"
  );
  const shouldLoadPartners = hasPageBuilderSection(industry, "partner_logo");
  const [latestPosts, latestCaseStudies, teams, stores, themeOptions] =
    await Promise.all([
      getLatestPosts({ language }),
      getLatestCaseStudies({ language }),
      getTeams({ language }),
      shouldLoadStores ? getStores({ language }) : [],
      shouldLoadPartners ? getThemeOptions({ language }) : {},
    ]);

  return (
    <>
      <BodyClass className={slug} />
      <Header
        language={language}
        translationContext={{
          type: "industry",
          id: industry.id,
          slug: industry.slug,
          path: `/${language === "sv" ? "" : `${language}/`}${getIndustryRouteSegment(
            language
          )}/${slug}`,
        }}
      />
      <main>
        <PageBuilder
          sections={industry?.acf?.page_builder}
          posts={latestPosts}
          caseStudies={latestCaseStudies}
          teams={teams}
          stores={stores}
          themeOptions={themeOptions}
          language={language}
        />
      </main>
      <Footer />
    </>
  );
}
