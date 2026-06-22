"use client";

import dynamic from "next/dynamic";

const CatalogPdfViewer = dynamic(() => import("./CatalogPdfViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[520px] items-center justify-center rounded-2xl bg-[#F5F5F5] font-body text-[#6B7280]">
      Loading catalog...
    </div>
  ),
});

export default function CatalogViewerClient(props) {
  return <CatalogPdfViewer {...props} />;
}
