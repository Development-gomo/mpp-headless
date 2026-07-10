"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const RetailerMap = dynamic(() => import("./RetailerMap"), { ssr: false });

export default function FindRetailerSection({ data = {}, stores = [] }) {
  const [fetchedStores, setFetchedStores] = useState([]);

  const {
    text_above_title,
    hero_title,
    hero_description,
    custom_id,
    custom_class,
  } = data;

  const hasHeader = text_above_title || hero_title || hero_description;
  const effectiveStores = stores?.length ? stores : fetchedStores;

  useEffect(() => {
    if (stores?.length || fetchedStores.length) return;

    let ignore = false;

    async function fetchStores() {
      try {
        const response = await fetch("/api/stores");
        if (!response.ok) return;

        const data = await response.json();
        if (!ignore && Array.isArray(data)) {
          setFetchedStores(data);
        }
      } catch {}
    }

    fetchStores();

    return () => {
      ignore = true;
    };
  }, [fetchedStores.length, stores]);

  return (
    <section
      id={custom_id || undefined}
      className={`relative overflow-hidden ${custom_class || ""}`}
    >
      {hasHeader && (
        <div className="web-width px-6 pb-10 pt-16">
          {text_above_title && (
            <div className="mb-4 flex items-center gap-2">
              <span className="h-4 w-0.5 bg-[var(--color-yellow)]" />
              <p className="text-[14px] font-medium uppercase leading-6 tracking-[0.56px] text-[#1A1A1A] [font-family:var(--font-body)]">
                {text_above_title}
              </p>
            </div>
          )}

          {hero_title && (
            <h2
              className="max-w-155 text-[42px] font-normal leading-[48px] tracking-[-1.04px] text-black [font-family:var(--font-heading)] md:text-[48px] md:leading-[58px]"
              dangerouslySetInnerHTML={{ __html: hero_title }}
            />
          )}

          {hero_description && (
            <div
              className="mt-4 max-w-155 text-[16px] font-normal leading-6 text-[#1A1A1A] [font-family:var(--font-body)]"
              dangerouslySetInnerHTML={{ __html: hero_description }}
            />
          )}
        </div>
      )}

      <RetailerMap stores={effectiveStores} />
    </section>
  );
}
