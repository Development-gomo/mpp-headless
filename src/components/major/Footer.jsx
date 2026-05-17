import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const productLinks = [
    {
      label: "Mobila Bränsletankar",
      href: "#",
    },
    {
      label: "Stationära Bränsletankar",
      href: "#",
    },
    {
      label: "Defence Products",
      href: "#",
    },
  ];

  const quickLinks = [
    { label: "Services", href: "#" },
    { label: "Industries", href: "#" },
    { label: "About us", href: "#" },
    { label: "Customer cases", href: "#" },
    { label: "News & Blogs", href: "#" },
  ];

  const supportLinks = [
    { label: "FAQ mobile tanks", href: "#" },
    { label: "FAQ cisterns", href: "#" },
    { label: "Certifications", href: "#" },
  ];

  return (
    <footer className="bg-[#18201F] text-white">
      <div className="web-width px-6 pt-16 pb-10">
        {/* CTA BOX */}
        <div className="relative mb-16 overflow-hidden rounded-[8px] bg-[#303736] px-8 py-10 md:px-12 md:py-12">
          <div className="relative z-10 max-w-[680px]">
            <div className="mb-5 flex items-center gap-2">
              <span className="h-[12px] w-[2px] bg-[var(--color-yellow)]" />
              <p className="font-body text-[14px] font-medium uppercase leading-[24px] tracking-[0.56px] text-white">
                Get Started
              </p>
            </div>

            <h2 className="max-w-[720px] font-heading text-[36px] font-normal leading-[44px] tracking-[-0.72px] text-white md:text-[52px] md:leading-[60px] md:tracking-[-1.04px]">
              Ready to find the right fuel solution for your operation?
            </h2>
          </div>

          <Link
            href="#"
            className="group relative z-10 mt-8 inline-flex items-center gap-4 rounded-[4px] bg-[var(--color-yellow)] py-[6px] pr-[6px] pl-6 font-heading text-[14px] font-normal tracking-[-0.28px] text-black transition-opacity hover:opacity-90 md:absolute md:right-12 md:top-1/2 md:mt-0 md:-translate-y-1/2"
          >
            <span>Get in touch with us</span>

            <Image
              src="/black-white-arrow.svg"
              alt=""
              width={40}
              height={40}
              className="h-auto w-[40px] object-contain transition-transform group-hover:translate-x-1"
            />
          </Link>

          <div
            className="pointer-events-none absolute right-0 top-0 h-full w-[420px] opacity-30"
            style={{
              backgroundImage: "url('/mpp-pattern.svg')",
              backgroundSize: "105%",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "-40% center",
            }}
          />
        </div>

        {/* MAIN FOOTER GRID - 5 COLUMNS */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[2.1fr_1fr_1fr_1.45fr_0.95fr] lg:gap-14">
          {/* COLUMN 1 - PRODUCT LINKS */}
          <div>
            <ul>
              {productLinks.map((item, index) => (
                <li key={index} className="border-b border-white/10">
                  <Link
                    href={item.href}
                    className="group flex items-center justify-between gap-6 py-3"
                  >
                    <span className="font-heading text-[28px] font-normal leading-[38px] tracking-[-0.56px] text-white md:text-[26px] md:leading-[44px] md:tracking-[-0.64px]">
                      {item.label}
                    </span>

                    <Image
                      src="/orange-arrow.svg"
                      alt=""
                      width={15}
                      height={15}
                      className="h-auto w-[15px] shrink-0 object-contain transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Image
                src="/mpp_logo.svg"
                alt="MPP Logo"
                width={193}
                height={65}
                className="h-auto w-[150px] object-contain md:w-[193px]"
              />
            </div>
          </div>

          {/* COLUMN 2 - QUICK LINKS */}
          <div>
            <FooterHeading>Quick Links</FooterHeading>

            <ul className="mt-5 space-y-3">
              {quickLinks.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="font-body text-[14px] font-normal leading-[22px] tracking-[-0.28px] text-white transition-opacity hover:opacity-70"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3 - SUPPORT */}
          <div>
            <FooterHeading>Support</FooterHeading>

            <ul className="mt-5 space-y-3">
              {supportLinks.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="font-body text-[14px] font-normal leading-[22px] tracking-[-0.28px] text-white transition-opacity hover:opacity-70"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4 - CONTACT */}
          <div>
            <FooterHeading>Contact</FooterHeading>

            <div className="mt-5 space-y-4 font-body text-[14px] font-normal leading-[22px] tracking-[-0.28px] text-white">
              <Link
                href="https://goo.gl/maps/GiUoAHLm7gjy2Xfm7"
                target="_blank"
                className="block transition-opacity hover:opacity-70"
              >
                Fjärås industrial road 17, 439 74 Fjärås, Sweden
              </Link>

              <p>
                <strong className="font-bold">Call:</strong>{" "}
                <Link href="tel:+46300521930" className="hover:opacity-70">
                  +46 300 521 930
                </Link>
              </p>

              <p>
                <strong className="font-bold">Mail:</strong>{" "}
                <Link href="mailto:kontakt@mpp.se" className="hover:opacity-70">
                  kontakt@mpp.se
                </Link>
              </p>
            </div>
          </div>

          {/* COLUMN 5 - SOCIAL */}
          <div>
            <FooterHeading>Follow us</FooterHeading>

            <div className="mt-5 flex gap-2">
              {[
                { label: "LinkedIn", icon: "in", href: "#" },
                { label: "Instagram", icon: "ig", href: "#" },
                { label: "Facebook", icon: "f", href: "#" },
                { label: "YouTube", icon: "▶", href: "#" },
              ].map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  aria-label={item.label}
                  className="flex h-[24px] w-[25px] items-center justify-center rounded-[2px] bg-white font-body text-[10px] font-bold text-[#00709E]"
                >
                  {item.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="bg-[#303736] py-3">
        <div className="web-width flex flex-col gap-3 px-6 font-body text-[14px] font-normal leading-[24px] tracking-[-0.28px] text-white md:flex-row md:items-center md:justify-between">
          <p>Copyright 2026 © MPP. All Rights Reserved.</p>

          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link href="#" className="hover:opacity-70">
              Terms & Conditions
            </Link>
            <span className="opacity-60">|</span>
            <Link href="#" className="hover:opacity-70">
              Privacy policy
            </Link>
            <span className="opacity-60">|</span>
            <Link href="#" className="hover:opacity-70">
              Cookie policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterHeading({ children }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-[16px] w-[2px] bg-[var(--color-yellow)]" />
      <p className="font-body text-[14px] font-medium uppercase leading-[24px] tracking-[0.56px] text-white">
        {children}
      </p>
    </div>
  );
}