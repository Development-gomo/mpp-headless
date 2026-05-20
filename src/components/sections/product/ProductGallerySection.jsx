import Image from "next/image";
import { getProductGallery, getRendered, stripHtml } from "./productUtils";

export default function ProductGallerySection({ product }) {
  const gallery = getProductGallery(product);
  if (gallery.length <= 1) return null;

  const title = product?.acf?.product_gallery_title || "Discover related fuel storage products";
  const productTitle = stripHtml(getRendered(product?.title));

  return (
    <section id="testimonials" className="bg-white">
      <div className="web-width px-6 py-20 md:py-[120px]">
        <div className="mb-10 flex items-center gap-2">
          <span className="h-[16px] w-[2px] bg-[var(--color-yellow)]" />
          <p className="font-body text-[14px] font-medium uppercase leading-[24px] tracking-[0.56px] text-[#1A1A1A]">
            Inspiration
          </p>
        </div>
        <h2 className="mb-10 max-w-[560px] font-heading text-[42px] leading-[50px] tracking-[-0.84px] text-black md:text-[48px] md:leading-[56px]">
          {title}
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {gallery.slice(1).map((image, index) => (
            <article key={`${image}-${index}`} className="overflow-hidden rounded-[8px] bg-[#F3F4FB]">
              <div className="relative min-h-[230px]">
                <Image
                  src={image}
                  alt={`${productTitle} gallery ${index + 1}`}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-contain p-8"
                />
              </div>
              <div className="border-t border-white p-5">
                <h3 className="font-body text-[16px] font-bold leading-[22px] text-[var(--color-accent)]">
                  {productTitle}
                </h3>
                <p className="mt-2 font-body text-[14px] leading-[22px] text-[#1A1A1A]">
                  View another product image and configuration option.
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
