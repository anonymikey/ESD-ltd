import Image from "next/image";
import { navLinks, site } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-offwhite/10 bg-charcoal py-14 text-offwhite">
      <div className="absolute inset-0 bg-blueprint bg-grid opacity-[0.035]" aria-hidden="true" />
      <div className="relative mx-auto max-w-content px-6 md:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="flex items-center gap-3">
              <Image src="/logo-mark.webp" alt="" width={112} height={74} className="h-9 w-auto" />
              <span className="font-display text-sm font-bold uppercase tracking-[0.18em] text-offwhite">
                EcoStruct <span className="text-bronze">Dynamics</span>
              </span>
            </div>
            <p className="mt-3 font-body text-xs uppercase tracking-[0.14em] text-offwhite/40">
              {site.tagline}
            </p>
            <p className="mt-4 max-w-xs font-body text-sm leading-relaxed text-offwhite/50">
              {site.description}
            </p>
          </div>

          <div className="md:col-span-2">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-offwhite/40">
              Navigate
            </span>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-offwhite/65 transition-colors duration-300 hover:text-bronze"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-offwhite/40">
              Contact
            </span>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={`mailto:${site.emails.website}`}
                  className="font-body text-sm text-offwhite/65 transition-colors duration-300 hover:text-bronze"
                >
                  {site.emails.website}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.emails.official}`}
                  className="font-body text-sm text-offwhite/65 transition-colors duration-300 hover:text-bronze"
                >
                  {site.emails.official}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.emails.direct}`}
                  className="font-body text-sm text-offwhite/65 transition-colors duration-300 hover:text-bronze"
                >
                  {site.emails.direct}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${site.phone.replace(/\s+/g, "")}`}
                  className="font-body text-sm text-offwhite/65 transition-colors duration-300 hover:text-bronze"
                >
                  {site.phone}
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-offwhite/40">
              Registered Office
            </span>
            <p className="mt-4 font-body text-sm leading-relaxed text-offwhite/50">
              {site.registeredOffice.line1}
              <br />
              {site.registeredOffice.line2}
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-offwhite/10 pt-6 font-body text-xs text-offwhite/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>
            {site.domain} · Reg. {site.registration.number}
          </p>
        </div>
      </div>
    </footer>
  );
}
