import RevealOnScroll from "@/components/RevealOnScroll";
import SectionHeading from "@/components/SectionHeading";
import TagPill from "@/components/TagPill";
import { capabilities, operatingAreas } from "@/lib/data";

export default function Capabilities() {
  return (
    <section id="capabilities" className="relative bg-charcoal py-24 text-offwhite md:py-32">
      <div className="absolute inset-0 bg-blueprint bg-grid opacity-[0.05]" aria-hidden="true" />
      <div className="relative mx-auto max-w-content px-6 md:px-10">
        <RevealOnScroll>
          <SectionHeading
            eyebrow="One Company, Multiple Capabilities"
            title="An integrated approach across seven core disciplines."
            description="EcoStruct Dynamics works as a single, connected team across engineering, construction, infrastructure, procurement, technology, sustainability and enterprise support — so a project moves between disciplines without moving between companies."
            tone="light"
          />
        </RevealOnScroll>

        {/* Signature: capability nodes joined by a connecting line, echoing the
            hero's blueprint motif to visualise "integrated" rather than
            merely listing services. */}
        <RevealOnScroll delay={100} className="relative mt-16">
          <span
            className="absolute left-0 right-0 top-6 hidden h-px bg-offwhite/12 md:block"
            aria-hidden="true"
          />
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-7 md:gap-x-4">
            {capabilities.map((capability) => (
              <div key={capability.name} className="relative flex flex-col items-center text-center">
                <span
                  className="relative z-10 mb-4 h-3 w-3 rounded-full border border-bronze bg-charcoal"
                  aria-hidden="true"
                />
                <h3 className="font-display text-sm font-semibold uppercase tracking-[0.08em] text-offwhite">
                  {capability.name}
                </h3>
                <p className="mt-2 max-w-[9rem] font-body text-xs leading-relaxed text-offwhite/50">
                  {capability.description}
                </p>
              </div>
            ))}
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={200} className="mt-16 border-t border-offwhite/10 pt-10">
          <span className="mb-5 block font-mono text-xs uppercase tracking-[0.24em] text-offwhite/40">
            Operating across
          </span>
          <div className="flex flex-wrap gap-2.5">
            {operatingAreas.map((area) => (
              <TagPill key={area} tone="light">
                {area}
              </TagPill>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
