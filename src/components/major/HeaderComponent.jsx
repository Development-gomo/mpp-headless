"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { DEFAULT_LANGUAGE, FALLBACK_LANGUAGES, localizePath } from "@/lib/i18n";
import { useQuoteCart } from "@/components/quote/QuoteCartProvider";

function getColumnClass(layoutType) {
  if (layoutType === "three_column") return "md:grid-cols-3";
  if (layoutType === "two_column") return "md:grid-cols-2";
  return "md:grid-cols-1";
}

export default function HeaderComponent(props) {
  const {
    logoUrl,
    logoDarkUrl,
    megaMenuRows = [],
    navLinks = [],
    headerTelephoneLink = "tel:+46300521930",
    cta1Text = "Defence",
    cta1Url = "#",
    cta1Target = "_self",
    cta2Text = "Reseller",
    cta2Url = "#",
    cta2Target = "_self",
    variant = "light",
    language = DEFAULT_LANGUAGE,
    languages = FALLBACK_LANGUAGES,
    languageLinks = {},
  } = props;

  const { count: quoteCount } = useQuoteCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [scrolled, setScrolled] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSubmenu = (key) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isDark = variant === "dark";
  const languageOptions = (Array.isArray(languages) && languages.length > 0
    ? languages
    : FALLBACK_LANGUAGES
  ).filter((item) => item?.code);
  const currentLanguage =
    languageOptions.find((item) => item.code === language) || {
      code: language,
    };
  const availableLanguageOptions = languageOptions.filter(
    (item) => item.code !== language && languageLinks[item.code]
  );
  const activeLogoUrl = isDark ? logoDarkUrl || logoUrl : logoUrl;
  const quoteHref = localizePath("/rfq", language);
  const callIcon = isDark ? "/call-dark.svg" : "/call.svg";
  const languageArrowIcon = isDark ? "/down-arrow-black.svg" : "/down-arrow.svg";
  const menuLinkClass = `inline-flex h-6 items-center gap-1 text-[14px] font-normal leading-[24px] tracking-[-0.28px] font-heading transition-colors ${
    isDark ? "text-black hover:text-[var(--color-accent)]" : "text-white hover:text-white/80"
  }`;
  const headerClass = isDark
    ? scrolled
      ? "bg-white text-black shadow-sm"
      : "bg-white text-black"
    : scrolled
    ? "bg-black/25 text-white backdrop-blur-[7.5px]"
    : "bg-transparent text-white";
  const navShellClass = isDark
    ? "bg-[#F3F4FB] border-[#DEDFE7]"
    : "bg-[#8A8A8A]/20 border-white/10";
  const navInnerClass = isDark
    ? "bg-[#E8EAF3] backdrop-blur-[5px]"
    : "bg-white/25 backdrop-blur-[15px]";
  const topPillClass = isDark
    ? "border border-white/10 bg-[#8A8A8A]/20 text-black"
    : "border border-white/10 bg-[#8A8A8A]/20 text-white";
  const mobileButtonClass = isDark
    ? "border-black/25 text-black hover:bg-black/5"
    : "border-white/25 text-white hover:bg-white/10";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerClass}`}
    >
      <div
        className={`relative mx-auto flex max-w-[1280px] items-center px-5 transition-all duration-300 xl:px-0 ${
          scrolled ? "h-[72px]" : "h-[88px] xl:h-[104px]"
        }`}
      >
        {/* LOGO */}
        <Link
          href="/"
          className={`shrink-0 transition-all duration-300 xl:absolute xl:left-0 ${
            scrolled ? "xl:top-[16px]" : isDark ? "xl:top-[48px]" : "xl:top-[42px]"
          }`}
        >
          {activeLogoUrl ? (
            <Image
              src={activeLogoUrl}
              alt="Logo"
              width={168}
              height={56}
              priority
              className={`h-auto object-contain transition-all duration-300 ${
                scrolled
                  ? "w-[120px] xl:w-[144px]"
                  : isDark
                  ? "w-[133px]"
                  : "w-[132px] xl:w-[168px]"
              }`}
            />
          ) : (
            <span className="text-xl font-semibold">MPP</span>
          )}
        </Link>

        {/* DESKTOP NAV */}
        <nav
          className={`hidden h-[50px] w-[647px] items-center rounded-[4px] border p-1 backdrop-blur-[10px] transition-all duration-300 xl:absolute xl:left-[316px] xl:flex ${
            scrolled ? "xl:top-[11px]" : "xl:top-[47px]"
          } ${navShellClass}`}
        >
          <div
            className={`flex h-[42px] w-full items-center justify-between rounded-[4px] px-8 ${navInnerClass}`}
          >
            {megaMenuRows.length > 0
            ? megaMenuRows.map((menuRow) => {
                if (menuRow.layoutType === "no_column") {
                  return (
                    <Link
                      key={menuRow.key}
                      href={menuRow.titleLink.href}
                      target={menuRow.titleLink.target}
                      className={menuLinkClass}
                    >
                      {menuRow.title}
                    </Link>
                  );
                }

                return (
                  <div key={menuRow.key} className="relative group py-8 -my-8">
                    <Link
                      href={menuRow.titleLink.href}
                      target={menuRow.titleLink.target}
                      className={menuLinkClass}
                    >
                      <span>{menuRow.title}</span>

                      <svg
                        width="10"
                        height="6"
                        viewBox="0 0 10 6"
                        fill="none"
                        className="transition-transform group-hover:rotate-180"
                      >
                        <path
                          d="M1 1L5 5L9 1"
                          stroke="currentColor"
                          strokeWidth="1.4"
                        />
                      </svg>
                    </Link>

                    <div className="pointer-events-none absolute left-1/2 top-full w-[min(1180px,calc(100vw-3rem))] -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
                      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white text-slate-900 shadow-[0_30px_70px_-25px_rgba(8,15,40,0.55)]">
                        <div
                          className={`grid ${
                            menuRow.sideImage
                              ? "md:grid-cols-[1fr_380px]"
                              : "grid-cols-1"
                          }`}
                        >
                          <div className="bg-[#f5f6f9] p-6">
                            <div
                              className={`grid gap-5 ${getColumnClass(
                                menuRow.layoutType
                              )}`}
                            >
                              {menuRow.columns.map((column) =>
                                column.card ? (
                                  <article
                                    key={`${column.key}-card`}
                                    className="rounded-md border border-slate-200 bg-white p-5"
                                  >
                                    {column.card.title && (
                                      <h3 className="text-xl font-semibold leading-snug text-slate-900">
                                        {column.card.title}
                                      </h3>
                                    )}

                                    {column.card.description && (
                                      <div
                                        className="mt-2 text-sm leading-relaxed text-slate-600"
                                        dangerouslySetInnerHTML={{
                                          __html: column.card.description,
                                        }}
                                      />
                                    )}

                                    {column.card.button?.href && (
                                      <Link
                                        href={column.card.button.href}
                                        target={column.card.button.target}
                                        className="mt-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#2f56d3] text-white transition-colors hover:bg-[#2849b5]"
                                        aria-label={column.card.button.label}
                                      >
                                        <svg
                                          width="14"
                                          height="14"
                                          viewBox="0 0 18 18"
                                          fill="none"
                                        >
                                          <path
                                            d="M3 9H15"
                                            stroke="currentColor"
                                            strokeWidth="1.6"
                                          />
                                          <path
                                            d="M10 4L15 9L10 14"
                                            stroke="currentColor"
                                            strokeWidth="1.6"
                                          />
                                        </svg>
                                      </Link>
                                    )}
                                  </article>
                                ) : (
                                  <div
                                    key={`${column.key}-spacer`}
                                    className="hidden md:block"
                                  />
                                )
                              )}
                            </div>

                            <div
                              className={`mt-6 grid gap-7 ${getColumnClass(
                                menuRow.layoutType
                              )}`}
                            >
                              {menuRow.columns.map((column) => (
                                <ul
                                  key={`${column.key}-links`}
                                  className="space-y-1"
                                >
                                  {column.links.map((subLink) => (
                                    <li
                                      key={subLink.key}
                                      className="border-b border-slate-200"
                                    >
                                      <Link
                                        href={subLink.href}
                                        target={subLink.target}
                                        className="group/link flex items-center justify-between gap-3 py-3 text-sm text-slate-600 transition-colors hover:text-slate-900"
                                      >
                                        <span className="leading-tight">
                                          {subLink.label}
                                        </span>

                                        <span className="translate-x-0 transition-transform group-hover/link:translate-x-1">
                                          -&gt;
                                        </span>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              ))}
                            </div>
                          </div>

                          {menuRow.sideImage && (
                            <div className="relative min-h-70 bg-slate-300">
                              <Image
                                src={menuRow.sideImage}
                                alt={`${menuRow.title} image`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 380px"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            : navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={menuLinkClass}
                >
                  {link.label}
                </Link>
              ))}
          </div>
        </nav>

        {/* RIGHT SIDE */}
        <div
          className={`hidden items-center gap-2 transition-all duration-300 xl:absolute xl:right-0 xl:flex ${
            scrolled ? "xl:top-[12px]" : "xl:top-[48px]"
          }`}
        >
          {/* Top menu: hidden on scroll */}
          <div
            className={`absolute right-0 flex items-center gap-2 transition-all duration-300 ${
              isDark ? "top-[-36px]" : "top-[-36px]"
            } ${
              scrolled
                ? "pointer-events-none opacity-0 -translate-y-2"
                : "opacity-100 translate-y-0"
            }`}
          >
            <Link
              href={quoteHref}
              className={`flex h-[28px] items-center justify-center rounded-[4px] px-3 backdrop-blur-[10px] text-[14px] leading-6 tracking-[-0.28px] font-heading ${topPillClass}`}
            >
              RFQ{quoteCount > 0 ? ` (${quoteCount})` : ""}
            </Link>

            <Link
              href={headerTelephoneLink || "tel:+46300521930"}
              className="flex h-[28px] w-[28px] items-center justify-center"
              aria-label="Call"
            >
              <Image
                src={callIcon}
                alt=""
                width={28}
                height={28}
                className="h-[28px] w-[28px] object-contain"
              />
            </Link>

            <div className="relative">
              <button
                type="button"
                className={`flex h-[28px] w-[45px] items-center justify-center gap-1 rounded-[4px] backdrop-blur-[10px] text-[14px] leading-6 tracking-[-0.28px] font-heading ${topPillClass} ${
                  availableLanguageOptions.length === 0
                    ? "cursor-default"
                    : "cursor-pointer"
                }`}
                aria-label="Select language"
                aria-expanded={languageMenuOpen}
                onClick={() => {
                  if (availableLanguageOptions.length > 0) {
                    setLanguageMenuOpen((open) => !open);
                  }
                }}
              >
                {currentLanguage.code.toUpperCase()}
                <Image
                  src={languageArrowIcon}
                  alt=""
                  width={9}
                  height={5}
                  className={`h-auto w-[9px] transition-transform ${
                    languageMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {languageMenuOpen && availableLanguageOptions.length > 0 && (
                <div className="absolute right-0 top-full mt-1 min-w-[45px] overflow-hidden rounded-[4px] border border-black/10 bg-white text-black shadow-[0_12px_28px_rgba(0,0,0,0.14)]">
                  {availableLanguageOptions.map((item) => (
                    <Link
                      key={item.code}
                      href={languageLinks[item.code]}
                      className="block px-3 py-2 text-center font-heading text-[13px] leading-none hover:bg-[#F3F4FB]"
                      onClick={() => setLanguageMenuOpen(false)}
                    >
                      {item.code.toUpperCase()}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CTA 1 */}
          <Link
            href={cta1Url || "#"}
            target={cta1Target || "_self"}
            className="inline-flex h-[48px] w-[127px] items-center justify-between rounded-[4px] bg-[#445641] py-[6px] pr-[6px] pl-4 text-white font-heading text-[14px] leading-6 tracking-[-0.28px] hover:opacity-90 transition-opacity"
          >
            <span>{cta1Text}</span>

            <span className="flex h-[36px] w-[37px] shrink-0 items-center justify-center rounded-[4px] bg-white">
              <Image
                src="/defence.svg"
                alt=""
                width={36}
                height={36}
                className="h-auto w-[36px] object-contain"
              />
            </span>
          </Link>

          {/* CTA 2 */}
          <Link
            href={cta2Url || "#"}
            target={cta2Target || "_self"}
            className="group inline-flex h-[48px] w-[126px] items-center justify-between rounded-[4px] bg-[var(--color-yellow)] py-[6px] pr-[6px] pl-4 text-black font-heading text-[14px] leading-6 tracking-[-0.28px] hover:opacity-90 transition-opacity"
          >
            <span>{cta2Text}</span>

            <span className="flex h-[36px] w-[37px] shrink-0 items-center justify-center rounded-[4px] bg-white">
              <Image
                src="/reseller.svg"
                alt=""
                width={36}
                height={36}
                className="h-auto w-[36px] object-contain transition-transform"
              />
            </span>
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className={`xl:hidden ml-auto flex items-center justify-center w-10 h-10 rounded border ${mobileButtonClass}`}
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
            <rect y="6" width="28" height="2.5" rx="1.25" fill="currentColor" />
            <rect
              y="13"
              width="28"
              height="2.5"
              rx="1.25"
              fill="currentColor"
            />
            <rect
              y="20"
              width="28"
              height="2.5"
              rx="1.25"
              fill="currentColor"
            />
          </svg>
        </button>

        {/* MOBILE NAV */}
        {mobileOpen && (
          <div className="fixed inset-0 z-[999] bg-black/40 flex">
            <div className="relative w-[min(92vw,360px)] bg-white text-slate-900 shadow-xl h-full flex flex-col">
              <button
                className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M6 6L16 16" stroke="currentColor" strokeWidth="2" />
                  <path d="M16 6L6 16" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>

              <div className="p-6 pt-12 flex-1 overflow-y-auto">
                <ul className="space-y-2">
                  {megaMenuRows.length > 0
                    ? megaMenuRows.map((menuRow) => (
                        <li
                          key={`mobile-${menuRow.key}`}
                          className="border-b border-slate-200 pb-2"
                        >
                          {menuRow.layoutType !== "no_column" ? (
                            <>
                              <button
                                className="flex w-full items-center justify-between py-2 text-[16px] font-semibold"
                                onClick={() => toggleSubmenu(menuRow.key)}
                                aria-expanded={!!openSubmenus[menuRow.key]}
                              >
                                <span>{menuRow.title}</span>

                                <svg
                                  width="18"
                                  height="18"
                                  viewBox="0 0 18 18"
                                  fill="none"
                                  className={`transition-transform ${
                                    openSubmenus[menuRow.key]
                                      ? "rotate-90"
                                      : "rotate-0"
                                  }`}
                                >
                                  <path
                                    d="M6 4L12 9L6 14"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  />
                                </svg>
                              </button>

                              {openSubmenus[menuRow.key] && (
                                <ul className="pl-3 pb-2">
                                  {menuRow.columns
                                    .flatMap((column) => column.links)
                                    .map((link) => (
                                      <li key={`mobile-${link.key}`}>
                                        <Link
                                          href={link.href}
                                          target={link.target}
                                          className="block py-1 text-[15px] text-slate-700 hover:text-slate-900"
                                          onClick={() => setMobileOpen(false)}
                                        >
                                          {link.label}
                                        </Link>
                                      </li>
                                    ))}
                                </ul>
                              )}
                            </>
                          ) : (
                            <Link
                              href={menuRow.titleLink.href}
                              target={menuRow.titleLink.target}
                              className="block py-2 text-[16px] font-semibold"
                              onClick={() => setMobileOpen(false)}
                            >
                              {menuRow.title}
                            </Link>
                          )}
                        </li>
                      ))
                    : navLinks.map((link) => (
                        <li
                          key={`mobile-${link.href}`}
                          className="border-b border-slate-200 pb-2"
                        >
                          <Link
                            href={link.href}
                            className="block py-2 text-[16px] font-semibold"
                            onClick={() => setMobileOpen(false)}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                </ul>

                <div className="mt-8 flex flex-col gap-3">
                  <Link
                    href={quoteHref}
                    className="inline-flex items-center justify-between rounded-[4px] bg-[#E5F2F7] py-3 px-5 text-slate-900 font-heading text-[14px]"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span>RFQ</span>
                    {quoteCount > 0 && (
                      <span className="rounded-full bg-[var(--color-yellow)] px-2 py-0.5 text-[12px] leading-none text-black">
                        {quoteCount}
                      </span>
                    )}
                  </Link>

                  {/* Mobile CTA 1 */}
                  <Link
                    href={cta1Url || "#"}
                    target={cta1Target || "_self"}
                    className="inline-flex items-center justify-between rounded-[4px] bg-[#445641] py-[6px] pr-[6px] pl-5 text-white font-heading text-[14px]"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span>{cta1Text}</span>

                    <span className="flex h-[36px] w-[37px] items-center justify-center rounded-[4px] bg-white">
                      <Image
                        src="/defence.svg"
                        alt=""
                        width={18}
                        height={18}
                        className="h-auto w-[18px]"
                      />
                    </span>
                  </Link>

                  {/* Mobile CTA 2 */}
                  <Link
                    href={cta2Url || "#"}
                    target={cta2Target || "_self"}
                    className="inline-flex items-center justify-between rounded-[4px] bg-[var(--color-yellow)] py-[6px] pr-[6px] pl-5 text-black font-heading text-[14px]"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span>{cta2Text}</span>

                    <span className="flex h-[36px] w-[37px] items-center justify-center rounded-[4px] bg-white">
                      <Image
                        src="/reseller.svg"
                        alt=""
                        width={18}
                        height={18}
                        className="h-auto w-[18px]"
                      />
                    </span>
                  </Link>

                  {/* Mobile Phone */}
                  <Link
                    href={headerTelephoneLink || "tel:+46300521930"}
                    className="inline-flex items-center justify-between rounded-[4px] bg-slate-100 py-3 px-5 text-slate-900 font-heading text-[14px]"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span>Call us</span>

                    <Image
                      src="/call.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="h-auto w-[16px]"
                    />
                  </Link>
                </div>
              </div>
            </div>

            <button
              aria-label="Close menu overlay"
              className="flex-1"
              onClick={() => setMobileOpen(false)}
            />
          </div>
        )}
      </div>
    </header>
  );
}
