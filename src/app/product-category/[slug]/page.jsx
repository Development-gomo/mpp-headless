import { notFound } from "next/navigation";
import Header from "@/components/major/Header";
import Footer from "@/components/major/Footer";
import ProductCategoryBanner from "@/components/sections/product-category/ProductCategoryBanner";
import ProductCategoryProductSections from "@/components/sections/product-category/ProductCategoryProductSections";
import ProductCategorySeoSection from "@/components/sections/product-category/ProductCategorySeoSection";
import ProductCategoryFaqSection from "@/components/sections/product-category/ProductCategoryFaqSection";
import { getProductsByCategory } from "@/lib/api";

import {
  getProductCategories,
  getProductCategoryBySlug,
} from "@/lib/api";
import { DEFAULT_LANGUAGE } from "@/lib/i18n";

export const revalidate = 60;

function getCategoryId(category) {
  return category?.term_id || category?.id;
}

function getCategoryParentId(category) {
  return category?.parent || category?.parent_id || 0;
}

function getCategoryLayout(category) {
  return String(category?.acf?.category_layout || "").toLowerCase();
}

function categoryHasVerticalLayoutInPath(categories, category) {
  let currentCategory = category;
  const visitedIds = new Set();

  while (currentCategory) {
    if (getCategoryLayout(currentCategory) === "vertical") return true;

    const categoryId = getCategoryId(currentCategory);
    if (!categoryId || visitedIds.has(String(categoryId))) break;
    visitedIds.add(String(categoryId));

    const parentId = getCategoryParentId(currentCategory);
    if (!parentId) break;

    currentCategory = categories.find(
      (cat) => String(getCategoryId(cat)) === String(parentId)
    );
  }

  return false;
}

function getCategoryDescendants(categories, parentCategory) {
  const parentId = getCategoryId(parentCategory);
  if (!parentId) return [];

  const descendants = [];
  const queuedParentIds = [String(parentId)];
  const seenIds = new Set();

  while (queuedParentIds.length > 0) {
    const currentParentId = queuedParentIds.shift();
    const children = categories.filter(
      (cat) => String(getCategoryParentId(cat)) === currentParentId
    );

    children.forEach((child) => {
      const childId = getCategoryId(child);
      if (!childId || seenIds.has(String(childId))) return;

      seenIds.add(String(childId));
      descendants.push(child);
      queuedParentIds.push(String(childId));
    });
  }

  return descendants;
}

function uniqueCategories(categories) {
  const seenIds = new Set();

  return categories.filter((category) => {
    const categoryId = getCategoryId(category);
    if (!categoryId || seenIds.has(String(categoryId))) return false;

    seenIds.add(String(categoryId));
    return true;
  });
}

export async function generateStaticParams() {
  const categories = await getProductCategories({ language: DEFAULT_LANGUAGE });

  return categories
    .filter((cat) => cat.slug !== "uncategorized" && Number(cat.term_id) !== 15)
    .map((cat) => ({
      slug: cat.slug,
    }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const category = await getProductCategoryBySlug(slug, {
    language: DEFAULT_LANGUAGE,
  });

  return {
    title: category?.acf?.banner_title || category?.name || "Product Category",
    description: category?.acf?.banner_text || category?.description || "",
  };
}

export default async function ProductCategoryPage({ params }) {
    const { slug } = await params;

    const categories = await getProductCategories({ language: DEFAULT_LANGUAGE });
    const category = await getProductCategoryBySlug(slug, {
      language: DEFAULT_LANGUAGE,
    });
    
    
    if (!category) notFound();
    
    const isVerticalLayout = categoryHasVerticalLayoutInPath(categories, category);
    const currentCategory =
      isVerticalLayout && getCategoryLayout(category) !== "vertical"
        ? {
            ...category,
            acf: {
              ...(category?.acf || {}),
              category_layout: "vertical",
            },
          }
        : category;
    const childCategories = isVerticalLayout
      ? getCategoryDescendants(categories, category)
      : categories.filter(
          (cat) => Number(getCategoryParentId(cat)) === Number(getCategoryId(category))
        );
    const productSourceCategories =
      isVerticalLayout
        ? [currentCategory, ...childCategories]
        : uniqueCategories(
            childCategories.flatMap((childCategory) =>
              getCategoryLayout(childCategory) === "vertical"
                ? [
                    childCategory,
                    ...getCategoryDescendants(categories, childCategory),
                  ]
                : [childCategory]
            )
          );

    const childCategoriesWithProducts = await Promise.all(
        productSourceCategories.map(async (childCat) => {
            const products = await getProductsByCategory(childCat.term_id, {
              language: DEFAULT_LANGUAGE,
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
        language={DEFAULT_LANGUAGE}
        translationContext={{
          type: "product_cat",
          id: category.id || category.term_id,
          slug: category.slug,
          path: `/product-category/${slug}`,
        }}
      />

      <main>
        <ProductCategoryBanner
          category={category}
          categories={tabCategories}
          language={DEFAULT_LANGUAGE}
        />

        <ProductCategoryProductSections
            currentCategory={currentCategory}
            childCategories={childCategoriesWithProducts}
            language={DEFAULT_LANGUAGE}
        />

        <ProductCategorySeoSection category={category} />
        <ProductCategoryFaqSection category={category} />
        
      </main>

      <Footer />
    </>
  );
}
