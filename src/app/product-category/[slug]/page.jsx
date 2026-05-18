import { notFound } from "next/navigation";
import Header from "@/components/major/Header";
import Footer from "@/components/major/Footer";
import ProductCategoryBanner from "@/components/sections/product/ProductCategoryBanner";
import ProductCategoryProductSections from "@/components/sections/product/ProductCategoryProductSections";
import ProductCategorySeoSection from "@/components/sections/product/ProductCategorySeoSection";
import ProductCategoryFaqSection from "@/components/sections/product/ProductCategoryFaqSection";
import { getProductsByCategory } from "@/lib/api";

import {
  getProductCategories,
  getProductCategoryBySlug,
} from "@/lib/api";

export const revalidate = 60;

export async function generateStaticParams() {
  const categories = await getProductCategories();

  return categories
    .filter((cat) => cat.slug !== "uncategorized" && Number(cat.term_id) !== 15)
    .map((cat) => ({
      slug: cat.slug,
    }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const category = await getProductCategoryBySlug(slug);

  return {
    title: category?.acf?.banner_title || category?.name || "Product Category",
    description: category?.acf?.banner_text || category?.description || "",
  };
}

export default async function ProductCategoryPage({ params }) {
    const { slug } = await params;

    const categories = await getProductCategories();
    const category = await getProductCategoryBySlug(slug);
    
    
    if (!category) notFound();
    
    const childCategories = categories.filter(
        (cat) => Number(cat.parent) === Number(category.term_id)
    );

    const childCategoriesWithProducts = await Promise.all(
        childCategories.map(async (childCat) => {
            const products = await getProductsByCategory(childCat.term_id);

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
      <Header />

      <main>
        <ProductCategoryBanner
          category={category}
          categories={tabCategories}
        />

        <ProductCategoryProductSections
            currentCategory={category}
            childCategories={childCategoriesWithProducts}
        />

        <ProductCategorySeoSection category={category} />
        <ProductCategoryFaqSection category={category} />
        
      </main>

      <Footer />
    </>
  );
}