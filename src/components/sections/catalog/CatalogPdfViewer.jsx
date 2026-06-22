"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const ZOOM_STEP = 0.15;
const MIN_ZOOM = 0.6;
const MAX_ZOOM = 2;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function ControlButton({ label, onClick, disabled, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-9 w-9 items-center justify-center rounded-md text-[#606770] transition-colors hover:bg-[#EEF0F3] hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function ArrowIcon({ direction = "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`h-5 w-5 ${direction === "left" ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}

export default function CatalogPdfViewer({
  pdfUrl,
  viewerUrl,
  title = "Catalog",
  minHeight: configuredMinHeight,
}) {
  const viewerRef = useRef(null);
  const pageContainerRef = useRef(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [containerSize, setContainerSize] = useState({ width: 900, height: 620 });
  const [pageAspectRatio, setPageAspectRatio] = useState(0.707);
  const [error, setError] = useState("");

  const viewerHeight = clamp(Number(configuredMinHeight) || 720, 420, 1200);
  const maxPageWidth = 900;
  const availablePageWidth = Math.min(
    Math.max(containerSize.width - 96, 280),
    maxPageWidth
  );
  const availablePageHeight = Math.max(containerSize.height - 96, 260);
  const fittedPageWidth = Math.min(
    availablePageWidth,
    availablePageHeight * pageAspectRatio
  );

  useEffect(() => {
    const node = pageContainerRef.current;
    if (!node) return undefined;

    const updateSize = () =>
      setContainerSize({ width: node.clientWidth, height: node.clientHeight });
    const observer = new ResizeObserver(updateSize);
    updateSize();
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const goToPage = (nextPage) => {
    setPageNumber(clamp(nextPage, 1, numPages || 1));
  };

  const shareCatalog = async () => {
    if (navigator.share) {
      await navigator.share({ title, url: pdfUrl }).catch(() => {});
      return;
    }

    await navigator.clipboard?.writeText(pdfUrl).catch(() => {});
  };

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await viewerRef.current?.requestFullscreen();
    }
  };

  return (
    <div
      ref={viewerRef}
      className="relative flex w-full flex-col overflow-hidden rounded-2xl bg-[#F5F5F5] shadow-[0_16px_50px_rgba(15,23,42,0.08)] fullscreen:!h-screen fullscreen:rounded-none"
      style={{ height: viewerHeight }}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") goToPage(pageNumber - 1);
        if (event.key === "ArrowRight") goToPage(pageNumber + 1);
      }}
    >
      <div
        ref={pageContainerRef}
        className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-8 md:px-12 md:py-12"
      >
        {pageNumber > 1 && (
          <button
            type="button"
            aria-label="Previous page"
            onClick={() => goToPage(pageNumber - 1)}
            className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#69717A] shadow-lg transition-transform hover:scale-105 md:left-6"
          >
            <ArrowIcon direction="left" />
          </button>
        )}

        <Document
          file={viewerUrl || pdfUrl}
          onLoadSuccess={({ numPages: loadedPages }) => {
            setNumPages(loadedPages);
            setPageNumber((current) => clamp(current, 1, loadedPages));
            setError("");
          }}
          onLoadError={() => setError("The catalog could not be loaded.")}
          loading={
            <div className="font-body text-[#6B7280]">Loading PDF...</div>
          }
          error={
            <div className="font-body text-red-700">
              {error || "The catalog could not be loaded."}
            </div>
          }
          className="flex justify-center"
        >
          <Page
            pageNumber={pageNumber}
            width={fittedPageWidth * zoom}
            onLoadSuccess={(page) => {
              const viewport = page.getViewport({ scale: 1 });
              setPageAspectRatio(viewport.width / viewport.height);
            }}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            loading=""
            className="overflow-hidden bg-white shadow-[0_8px_24px_rgba(15,23,42,0.18)]"
          />
        </Document>

        {pageNumber < numPages && (
          <button
            type="button"
            aria-label="Next page"
            onClick={() => goToPage(pageNumber + 1)}
            className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#69717A] shadow-lg transition-transform hover:scale-105 md:right-6"
          >
            <ArrowIcon />
          </button>
        )}
      </div>

      <div className="mx-auto mb-3 flex min-h-12 max-w-[calc(100%-1.5rem)] flex-wrap items-center justify-center gap-1 rounded-lg bg-white px-3 py-1.5 shadow-[0_2px_10px_rgba(15,23,42,0.18)]">
        <span className="mr-1 min-w-[68px] font-body text-[13px] text-[#8A9098]">
          {pageNumber}/{numPages || "-"}
        </span>

        <ControlButton
          label="Previous page"
          onClick={() => goToPage(pageNumber - 1)}
          disabled={pageNumber <= 1}
        >
          <ArrowIcon direction="left" />
        </ControlButton>
        <ControlButton
          label="Next page"
          onClick={() => goToPage(pageNumber + 1)}
          disabled={!numPages || pageNumber >= numPages}
        >
          <ArrowIcon />
        </ControlButton>

        <ControlButton
          label="Zoom in"
          onClick={() => setZoom((value) => clamp(value + ZOOM_STEP, MIN_ZOOM, MAX_ZOOM))}
          disabled={zoom >= MAX_ZOOM}
        >
          <span className="text-[24px] leading-none">+</span>
        </ControlButton>
        <ControlButton
          label="Zoom out"
          onClick={() => setZoom((value) => clamp(value - ZOOM_STEP, MIN_ZOOM, MAX_ZOOM))}
          disabled={zoom <= MIN_ZOOM}
        >
          <span className="text-[26px] leading-none">-</span>
        </ControlButton>

        <ControlButton label="Toggle fullscreen" onClick={toggleFullscreen}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" />
          </svg>
        </ControlButton>

        <ControlButton label="Share catalog" onClick={shareCatalog}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="2" /><circle cx="6" cy="12" r="2" /><circle cx="18" cy="19" r="2" />
            <path d="m8 11 8-5M8 13l8 5" />
          </svg>
        </ControlButton>

        <a
          href={pdfUrl}
          download
          aria-label="Download catalog"
          title="Download catalog"
          className="flex h-9 w-9 items-center justify-center rounded-md text-[#606770] transition-colors hover:bg-[#EEF0F3] hover:text-black"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" />
          </svg>
        </a>

      </div>
    </div>
  );
}
