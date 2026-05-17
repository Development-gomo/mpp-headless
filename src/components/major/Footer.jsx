import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#18201F] text-white">
      <div className="web-width px-6 py-16">

        {/* CTA BOX */}
        <div className="relative mb-16 overflow-hidden rounded-[8px] bg-[#303736] px-10 py-12">
          <div className="max-w-[720px]">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-[2px] h-[12px] bg-[var(--color-yellow)]" />
              <p className="text-[12px] uppercase tracking-[0.5px] font-body text-white/70">
                Get Started
              </p>
            </div>

            <h2 className="text-[42px] leading-[1.2] font-heading font-medium">
              Ready to find the right fuel solution for your operation?
            </h2>
          </div>

          <Link
            href="#"
            className="group inline-flex items-center gap-4 py-[6px] pr-[6px] pl-6 rounded-[4px] bg-[var(--color-yellow)] text-black font-[var(--font-heading)] text-[14px] font-normal leading-[normal] tracking-[-0.28px] hover:opacity-90 transition-opacity relative md:absolute right-0 md:right-10 top-0 md:top-1/2 md:-translate-y-1/2 z-10"
          >
            <span>Get in touch with us</span>
            <Image
                src="/black-white-arrow.svg"
                alt=""
                width={36}
                height={36}
                className="w-[36px] h-auto object-contain transition-transform group-hover:translate-x-1"
            />
          </Link>

          {/* Decorative shapes (optional) */}
          <div className="absolute right-0 top-0 h-full w-[300px] opacity-20 bg-[url('/mpp-pattern.svg')] bg-no-repeat bg-[length:105%] bg-[-100%]" />
        </div>

        {/* MAIN FOOTER GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* LEFT LINKS */}
          <div className="lg:col-span-2">
            <ul className="space-y-4 text-[20px]">
              {[
                "Mobila Bränsletankar",
                "Stationära Bränsletankar",
                "Defence Products",
              ].map((item, i) => (
                <li key={i} className="flex justify-between items-center border-b border-white/10 pb-3 font-heading text-[32px] tracking-[-0.64px] leading-[1.2]">
                  <span>{item}</span>
                  <Image
                    src="/orange-arrow.svg"
                    alt=""
                    width={15}
                    height={15}
                    className="w-[15px] h-auto object-contain transition-transform group-hover:translate-x-1"
                    />
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <Image
                src="/mpp_logo.svg"
                alt="MPP Logo"
                width={140}
                height={60}
                className="object-contain"
              />
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-5">
                <span className="w-[2px] h-[10px] bg-[var(--color-yellow)]" />
                <p className="text-[14px] text-white leading-[24px] font-medium tracking-[0.56px] uppercase font-body">
                    Quick Links
                </p>
            </div>
            <ul className="space-y-2 text-[14px]">
              <li><Link href="#">Services</Link></li>
              <li><Link href="#">Industries</Link></li>
              <li><Link href="#">About us</Link></li>
              <li><Link href="#">Customer cases</Link></li>
              <li><Link href="#">News & Blogs</Link></li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-5">
                <span className="w-[2px] h-[10px] bg-[var(--color-yellow)]" />
                <p className="text-[14px] text-white leading-[24px] font-medium tracking-[0.56px] uppercase font-body">
                    Support
                </p>
            </div>
            <ul className="space-y-2 text-[14px]">
              <li><Link href="#">FAQ mobile tanks</Link></li>
              <li><Link href="#">FAQ cisterns</Link></li>
              <li><Link href="#">Certifications</Link></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-5">
                <span className="w-[2px] h-[10px] bg-[var(--color-yellow)]" />
                <p className="text-[14px] text-white leading-[24px] font-medium tracking-[0.56px] uppercase font-body">
                    Follow us
                </p>
            </div>
            <div className="space-y-3 text-[14px] text-white/80">
              <p>Fjärås industrial road 17, 439 74</p>
              <p>Fjärås, Sweden</p>

              <p className="mt-4">
                <strong>Call:</strong> <Link href="tel:+46300521930">+46 300 521 930</Link>
              </p>

              <p>
                <strong>Mail:</strong> <Link href="mailto:kontakt@mpp.se">kontakt@mpp.se</Link>
              </p>
            </div>
          </div>

          {/* SOCIAL */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-5">
                <span className="w-[2px] h-[10px] bg-[var(--color-yellow)]" />
                <p className="text-[14px] text-white leading-[24px] font-medium tracking-[0.56px] uppercase font-body">
                    Follow us
                </p>
            </div>

            <div className="flex gap-3">
              {["in", "ig", "fb", "yt"].map((icon, i) => (
                <div
                  key={i}
                  className="flex h-[32px] w-[32px] items-center justify-center bg-white text-black text-[12px] rounded"
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/10 py-4 text-[12px] text-white/60">
        <div className="web-width px-6 flex flex-col md:flex-row justify-between gap-4">
          <p>Copyright 2026 © MPP. All Rights Reserved.</p>

          <div className="flex gap-6">
            <Link href="#">Terms & Conditions</Link>
            <Link href="#">Privacy policy</Link>
            <Link href="#">Cookie policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}