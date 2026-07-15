import Image from "next/image";
import Link from "next/link";
import { getButtonHref, getButtonTarget } from "./productUtils";

export default function ProductCtaSection({ product }) {
  const acf = product?.acf || {};
  const title = acf.product_cta_title || "Ready to find the right fuel solution?";
  const text = acf.product_cta_text;
  const buttonText = acf.product_cta_button_text || "Get in touch with us";
  const buttonHref = getButtonHref(acf.product_cta_button_link, "#");
  const buttonTarget = getButtonTarget(acf.product_cta_button_link);

  if (!title && !buttonText) return null;

  return (
    <section className="bg-white">
      <div className="web-width px-6 pb-20 md:pb-30">
        <div className="relative overflow-hidden rounded-lg bg-[#18201F] px-8 py-10 text-white md:px-12 md:py-12">
          <div className="relative z-10 max-w-[720px]">
            <div className="mb-5 flex items-center gap-2">
              <span className="h-[12px] w-0.5 bg-[var(--color-yellow)]" />
              <p className="font-body text-[14px] font-medium uppercase leading-6 tracking-[0.56px] text-white">
                Get started
              </p>
            </div>
            <h2
              className="font-heading text-[36px] leading-11 tracking-[-0.72px] text-white md:text-[48px] md:leading-14"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            {text && (
              <div
                className="mt-5 max-w-[520px] font-body text-[16px] leading-6 text-white/85"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            )}
          </div>

          {buttonText && (
            <Link
              href={buttonHref}
              target={buttonTarget}
              className="group relative z-10 mt-8 inline-flex items-center gap-4 rounded-sm bg-[var(--color-yellow)] py-1.5 pr-1.5 pl-6 font-heading text-[14px] tracking-[-0.28px] text-black transition-opacity hover:opacity-90 md:absolute md:right-12 md:top-1/2 md:mt-0 md:-translate-y-1/2"
            >
              <span>{buttonText}</span>
              <Image src="/black-white-arrow.svg" alt="" width={40} height={40} className="h-auto w-10 transition-transform" />
            </Link>
          )}

          <div
            className="pointer-events-none absolute right-0 top-0 h-full w-[420px] opacity-30"
            style={{
              backgroundImage: "url('/mpp-pattern.svg')",
              backgroundPosition: "-40% center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "105%",
            }}
          />
        </div>
      </div>
    </section>
  );
}
