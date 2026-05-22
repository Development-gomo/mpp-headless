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
    
    const childCategories = categories.filter(
        (cat) => Number(cat.parent) === Number(category.term_id)
    );

    const childCategoriesWithProducts = await Promise.all(
        childCategories.map(async (childCat) => {
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
            currentCategory={category}
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
