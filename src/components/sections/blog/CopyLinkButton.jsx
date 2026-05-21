"use client";

import { useState } from "react";
import { FaLink } from "react-icons/fa";

export default function CopyLinkButton({ shareUrl }) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={copyLink}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[var(--color-yellow)] text-black transition-opacity hover:opacity-85"
        aria-label="Copy article link"
        title={copied ? "Copied" : "Copy link"}
      >
        <FaLink aria-hidden="true" className="h-[13px] w-[13px]" />
      </button>

      {copied && (
        <span className="absolute right-0 top-[calc(100%+8px)] z-10 whitespace-nowrap rounded-[4px] bg-black px-3 py-1 text-[12px] leading-[18px] text-white shadow-sm">
          Link copied
        </span>
      )}
    </div>
  );
}
