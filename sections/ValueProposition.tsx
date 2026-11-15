import RevealOnScroll from "@/components/RevealOnScroll";
import { valueProposition } from "@/lib/data";

export default function ValueProposition() {
  return (
    <section id="value" className="bg-offwhite py-24 md:py-32">
      <div className="mx-auto max-w-content px-6 text-center md:px-10">
        <RevealOnScroll>
          <span className="mx-auto mb-6 flex w-fit items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-steel">
            <span className="h-px w-8 bg-leaf" aria-hidden="true" />
            Why Work With Us
            <span className="h-px w-8 bg-leaf" aria-hidden="true" />
          </span>
          <h2 className="mx-auto max-w-3xl text-balance font-display text-display-md font-bold uppercase tracking-tight text-charcoal">
            {valueProposition.statement}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-balance font-body text-base leading-relaxed text-charcoal/65 md:text-lg">
            We bring quality, efficiency, innovation, sustainability, inclusion and safety into one integrated way of working — with value for money at the centre.
          </p>
        </RevealOnScroll>

        <RevealOnScroll
          stagger
          delay={100}
          className="mx-auto mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-3"
        >
          {valueProposition.focusAreas.map((area) => (
            <span
              key={area}
              className="rounded-full border border-charcoal/15 px-5 py-2.5 font-body text-sm font-medium text-charcoal/75"
            >
              {area}
            </span>
          ))}
        </RevealOnScroll>

        <RevealOnScroll delay={150} className="mt-10">
          <a
            href="/about"
            className="group inline-flex items-center gap-2 font-body text-sm font-semibold uppercase tracking-[0.1em] text-charcoal transition-colors duration-300 hover:text-leaf"
          >
            Learn about our approach
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 ease-engineer group-hover:translate-x-1" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
            </svg>
          </a>
        </RevealOnScroll>
      </div>
    </section>
  );
}
