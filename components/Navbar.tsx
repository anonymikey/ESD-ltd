"use client";

import { useEffect, useState } from "react";
import { navLinks } from "@/lib/data";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-engineer ${
        scrolled
          ? "bg-offwhite/90 shadow-[0_1px_0_0_rgba(20,23,26,0.08)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className={`mx-auto flex max-w-content items-center justify-between px-6 transition-all duration-500 ease-engineer md:px-10 ${
          scrolled ? "py-4" : "py-6 md:py-8"
        }`}
      >
        <a
          href="/#home"
          className="font-display text-sm font-bold uppercase tracking-[0.18em] text-charcoal"
        >
          EcoStruct <span className="text-bronze">Dynamics</span>
        </a>

        <ul className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="group relative font-body text-[13px] font-medium uppercase tracking-[0.12em] text-charcoal/80 transition-colors duration-300 hover:text-charcoal"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-bronze transition-all duration-300 ease-engineer group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <a
          href="/#contact"
          className="hidden rounded-sm border border-charcoal bg-charcoal px-5 py-2.5 font-body text-[13px] font-semibold uppercase tracking-[0.1em] text-offwhite transition-all duration-300 ease-engineer hover:bg-transparent hover:text-charcoal md:inline-block"
        >
          Let&rsquo;s Talk
        </a>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="relative z-[60] flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
        >
          <span
            className={`h-px w-6 bg-charcoal transition-transform duration-300 ease-engineer ${
              menuOpen ? "translate-y-[6px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-6 bg-charcoal transition-opacity duration-300 ease-engineer ${
              menuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`h-px w-6 bg-charcoal transition-transform duration-300 ease-engineer ${
              menuOpen ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={`fixed inset-0 z-50 flex flex-col bg-charcoal px-8 pt-28 transition-all duration-500 ease-engineer md:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-2">
          {navLinks.map((link, i) => (
            <li
              key={link.href}
              className="border-b border-charcoal-line py-4"
              style={{
                transitionDelay: menuOpen ? `${i * 60}ms` : "0ms",
              }}
            >
              <a
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-display text-3xl font-semibold text-offwhite"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="/#contact"
          onClick={() => setMenuOpen(false)}
          className="mt-10 inline-block w-fit rounded-sm border border-bronze bg-bronze px-6 py-3 font-body text-sm font-semibold uppercase tracking-[0.1em] text-charcoal"
        >
          Let&rsquo;s Talk
        </a>
      </div>
    </header>
  );
}
