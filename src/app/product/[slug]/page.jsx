import Header from "@/components/major/Header";
import Footer from "@/components/major/Footer";
import ProductPageTemplate from "@/components/sections/product/ProductPageTemplate";
import { getAllProducts, getProductBySlug, getProductCategories } from "@/lib/api";
import { resolveParams } from "@/lib/params";
import { buildMetadataFromYoast } from "@/lib/seo";
import { DEFAULT_LANGUAGE } from "@/lib/i18n";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getAllProducts({ language: DEFAULT_LANGUAGE });
  return (Array.isArray(products) ? products : []).map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = resolveParams(await params);
  const product = await getProductBySlug(slug, { language: DEFAULT_LANGUAGE });
  return buildMetadataFromYoast(product, { fallbackTitle: slug });
}

export default async function ProductSinglePage({ params }) {
  const { slug } = resolveParams(await params);
  if (!slug) notFound();

  const product = await getProductBySlug(slug, { language: DEFAULT_LANGUAGE });
  if (!product) notFound();
  const productCategories = await getProductCategories({
    language: DEFAULT_LANGUAGE,
  });

  return (
    <>
      <Header
        variant="dark"
        language={DEFAULT_LANGUAGE}
        translationContext={{
          type: "product",
          id: product.id,
          slug: product.slug,
          path: `/product/${slug}`,
        }}
      />
      <main>
        <ProductPageTemplate
          product={product}
          productCategories={productCategories}
          language={DEFAULT_LANGUAGE}
        />
      </main>
      <Footer />
    </>
  );
}
