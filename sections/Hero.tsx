"use client";

import Image from "next/image";
import { site } from "@/lib/data";
import { useParallax } from "@/lib/useParallax";

export default function Hero() {
  const bgRef = useParallax<HTMLDivElement>(0.06);
  const gridRef = useParallax<HTMLDivElement>(0.12);

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-charcoal text-offwhite"
    >
      {/* Layer 1 — background photograph, slowest parallax (furthest depth) */}
      <div ref={bgRef} className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2400&auto=format&fit=crop"
          alt="Structural steel framing of a modern building under construction"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-[0.34]"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/75 to-charcoal/40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(169,122,59,0.14),transparent_70%)]" />

      {/* Layer 2 — blueprint grid, faster parallax (closer depth) */}
      <div ref={gridRef} className="absolute inset-0 bg-blueprint bg-grid opacity-40" />

      {/* Signature: engineering framework assembling — staggered blueprint
          line drawing tracing a structural outline on load. */}
      <svg
        viewBox="0 0 1200 500"
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
      >
        <polyline
          className="line-draw"
          points="40,460 40,120 220,120 220,460 220,220 420,220 420,460 420,80 640,80 640,460 640,180 860,180 860,460 860,60 1050,60 1050,460 1050,300 1160,300"
          fill="none"
          stroke="#A97A3B"
          strokeWidth="1.5"
          strokeOpacity="0.55"
        />
        <polyline
          className="line-draw"
          style={{ animationDelay: "0.4s" }}
          points="0,500 130,500 130,340 330,340 330,500 530,500 530,260 730,260 730,500 930,500 930,160 1200,160"
          fill="none"
          stroke="#F5F3EC"
          strokeWidth="1"
          strokeOpacity="0.14"
        />
      </svg>

      <div className="relative z-10 mx-auto w-full max-w-content px-6 pb-24 pt-40 md:px-10 md:pb-32">
        <Image
          src="/logo-mark.webp"
          alt=""
          width={168}
          height={111}
          priority
          className="mb-8 h-14 w-auto opacity-95 md:h-[68px]"
        />

        <p className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.32em] text-offwhite/60">
          <span className="h-px w-8 bg-bronze" aria-hidden="true" />
          {site.name}
        </p>
        <h1 className="max-w-4xl text-balance font-display text-display-xl font-bold text-offwhite">
          {site.tagline}
        </h1>
        <p className="mt-7 max-w-xl text-balance font-body text-lg leading-relaxed text-offwhite/75 md:text-xl">
          An integrated engineering, infrastructure, technology and
          sustainability company — one company, multiple capabilities,
          delivering solutions that create value for clients, opportunity
          for communities, and a healthier planet.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href="#capabilities"
            className="group inline-flex items-center justify-center gap-2 rounded-sm bg-bronze px-7 py-3.5 font-body text-sm font-semibold uppercase tracking-[0.1em] text-charcoal transition-all duration-300 ease-engineer hover:bg-bronze-light"
          >
            Explore Our Capabilities
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 ease-engineer group-hover:translate-x-1" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
            </svg>
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-sm border border-offwhite/30 px-7 py-3.5 font-body text-sm font-semibold uppercase tracking-[0.1em] text-offwhite transition-all duration-300 ease-engineer hover:border-offwhite hover:bg-offwhite/5"
          >
            Talk to Us
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 right-6 z-10 hidden items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-offwhite/50 md:right-10 md:flex">
        Scroll
        <span className="relative block h-10 w-px overflow-hidden bg-offwhite/20">
          <span className="absolute inset-x-0 top-0 h-4 w-px animate-[fadeUp_1.8s_ease-in-out_infinite] bg-bronze" />
        </span>
      </div>
    </section>
  );
}
