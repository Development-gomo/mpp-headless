"use client";

import { useState } from "react";
import { FaLink } from "react-icons/fa";
import { DEFAULT_LANGUAGE, ENGLISH_LANGUAGE, GERMAN_LANGUAGE, normalizeLanguage } from "@/lib/i18n";

const COPY_LINK_LABELS = {
  [DEFAULT_LANGUAGE]: {
    aria: "Kopiera artikellänk",
    copy: "Kopiera länk",
    copied: "Kopierad",
    copiedMessage: "Länk kopierad",
  },
  [ENGLISH_LANGUAGE]: {
    aria: "Copy article link",
    copy: "Copy link",
    copied: "Copied",
    copiedMessage: "Link copied",
  },
  [GERMAN_LANGUAGE]: {
    aria: "Artikellink kopieren",
    copy: "Link kopieren",
    copied: "Kopiert",
    copiedMessage: "Link kopiert",
  },
};

export default function CopyLinkButton({ shareUrl, language = DEFAULT_LANGUAGE }) {
  const [copied, setCopied] = useState(false);
  const labels =
    COPY_LINK_LABELS[normalizeLanguage(language)] || COPY_LINK_LABELS[DEFAULT_LANGUAGE];

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
        aria-label={labels.aria}
        title={copied ? labels.copied : labels.copy}
      >
        <FaLink aria-hidden="true" className="h-3.25 w-3.25" />
      </button>

      {copied && (
        <span className="absolute right-0 top-[calc(100%+8px)] z-10 whitespace-nowrap rounded-sm bg-[var(--color-accent)] px-3 py-1 text-[12px] leading-4.5 text-white shadow-sm">
          {labels.copiedMessage}
        </span>
      )}
    </div>
  );
}
