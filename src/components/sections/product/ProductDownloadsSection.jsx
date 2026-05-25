import Image from "next/image";
import Link from "next/link";
import { getButtonHref, getButtonTarget } from "./productUtils";

export default function ProductDownloadsSection({ product }) {
  const downloads = Array.isArray(product?.acf?.product_downloads)
    ? product.acf.product_downloads
    : [];

  if (downloads.length === 0) return null;

  return (
    <section id="downloads" className="bg-white">
      <div className="web-width px-6 py-20 md:py-[120px]">
        <div className="mb-10 flex items-center gap-2">
          <span className="h-[16px] w-[2px] bg-[var(--color-yellow)]" />
          <p className="font-body text-[14px] font-medium uppercase leading-[24px] tracking-[0.56px] text-[#1A1A1A]">
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
                {download.download_label || "Download"}
              </span>
              <Image src="/download-ico.svg" alt="" width={40} height={40} className="h-[40px] w-[40px] transition-transform group-hover:translate-y-0.5" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
