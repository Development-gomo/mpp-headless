import Header from "@/components/major/Header";
import Footer from "@/components/major/Footer";
import ProductPageTemplate from "@/components/sections/product/ProductPageTemplate";
import { getAllProducts, getProductBySlug } from "@/lib/api";
import { resolveParams } from "@/lib/params";
import { buildMetadataFromYoast } from "@/lib/seo";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getAllProducts();
  return (Array.isArray(products) ? products : []).map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = resolveParams(await params);
  const product = await getProductBySlug(slug);
  return buildMetadataFromYoast(product, { fallbackTitle: slug });
}

export default async function ProductSinglePage({ params }) {
  const { slug } = resolveParams(await params);
  if (!slug) notFound();

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <>
      <Header variant="dark" />
      <main>
        <ProductPageTemplate product={product} />
      </main>
      <Footer />
    </>
  );
}
