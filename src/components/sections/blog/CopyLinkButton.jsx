"use client";

import { useState } from "react";
import { FaLink } from "react-icons/fa";

export default function CopyLinkButton({ shareUrl }) {
  const [copied, setCopied] = useState(false);

  const getFullShareUrl = () => {
    if (typeof window === "undefined") return shareUrl || "";
    if (!shareUrl) return window.location.href;

    return new URL(shareUrl, window.location.origin).href;
  };

  const copyLink = async () => {
    try {
      const fullShareUrl = getFullShareUrl();

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(fullShareUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = fullShareUrl;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

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
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[var(--color-accent)] text-white transition-opacity hover:opacity-85"
        aria-label="Copy article link"
        title={copied ? "Copied" : "Copy link"}
      >
        <FaLink aria-hidden="true" className="h-3.25 w-3.25" />
      </button>

      {copied && (
        <span className="absolute right-0 top-[calc(100%+8px)] z-10 whitespace-nowrap rounded-sm bg-[var(--color-accent)] px-3 py-1 text-[12px] leading-4.5 text-white shadow-sm">
          Link copied
        </span>
      )}
    </div>
  );
}
