import RevealOnScroll from "@/components/RevealOnScroll";
import { valueProposition } from "@/lib/data";

export default function ValueProposition() {
  return (
    <section id="value" className="bg-offwhite py-24 md:py-32">
      <div className="mx-auto max-w-content px-6 text-center md:px-10">
        <RevealOnScroll>
          <span className="mx-auto mb-6 flex w-fit items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-steel">
            <span className="h-px w-8 bg-bronze" aria-hidden="true" />
            Our Value Proposition
            <span className="h-px w-8 bg-bronze" aria-hidden="true" />
          </span>
          <h2 className="mx-auto max-w-3xl text-balance font-display text-display-md font-bold uppercase tracking-tight text-charcoal">
            {valueProposition.statement}
          </h2>
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
      </div>
    </section>
  );
}
