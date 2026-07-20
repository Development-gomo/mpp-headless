import Image from "next/image";
import Link from "next/link";
import { DEFAULT_LANGUAGE } from "@/lib/i18n";
import { getButtonHref, getButtonTarget } from "./productUtils";
import { getProductLabels } from "./productLabels";

export default function ProductDownloadsSection({
  product,
  language = DEFAULT_LANGUAGE,
}) {
  const downloads = Array.isArray(product?.acf?.product_downloads)
    ? product.acf.product_downloads
    : [];
  const labels = getProductLabels(language);

  if (downloads.length === 0) return null;

  return (
    <section id="downloads" className="bg-white">
      <div className="web-width px-6 py-20 md:py-[120px]">
        <div className="mb-10 flex items-center gap-2">
          <span className="h-4 w-0.5 bg-[var(--color-yellow)]" />
          <p className="font-body text-[14px] font-medium uppercase leading-6 tracking-[0.56px] text-[#1A1A1A]">
            Downloads
          </p>
        </div>

        <div className="divide-y divide-black/15 border-y border-black/15">
          {downloads.map((download, index) => (
            <Link
              key={index}
              href={getButtonHref(download.download_file, "#")}
              target={getButtonTarget(download.download_file) || "_blank"}
              className="group flex items-center justify-between gap-6 py-6"
            >
              <span className="font-heading text-[24px] leading-[32px] tracking-[-0.48px] text-black">
                {download.download_label || labels.download}
              </span>
              <Image src="/download-ico.svg" alt="" width={40} height={40} className="h-10 w-10 transition-transform group-hover:translate-y-0.5" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
