import RevealOnScroll from "@/components/RevealOnScroll";
import SectionHeading from "@/components/SectionHeading";
import TagPill from "@/components/TagPill";
import { blueEconomy, greenEconomy } from "@/lib/data";

export default function GreenBlueEconomy() {
  return (
    <section id="sustainability" className="bg-offwhite py-24 md:py-32">
      <div className="mx-auto max-w-content px-6 md:px-10">
        <RevealOnScroll>
          <SectionHeading
            eyebrow="Green + Blue Economy"
            title="Sustainability, on land and along the coast."
            description="Our sustainability work spans two connected fronts: green-economy solutions on land, and blue-economy work along Kenya's coastline."
          />
        </RevealOnScroll>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-charcoal/12 bg-charcoal/12 md:grid-cols-2">
          <RevealOnScroll className="bg-offwhite p-10 md:p-12">
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-bronze">
              Green Economy
            </span>
            <h3 className="mt-4 font-display text-2xl font-semibold text-charcoal">
              Land-based sustainability
            </h3>
            <p className="mt-3 max-w-sm font-body text-sm leading-relaxed text-charcoal/60">
              Practices that reduce environmental impact while supporting
              long-term resilience for the communities we build with.
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              {greenEconomy.map((item) => (
                <TagPill key={item} tone="dark">
                  {item}
                </TagPill>
              ))}
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={100} className="bg-charcoal p-10 text-offwhite md:p-12">
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-bronze">
              Blue Economy
            </span>
            <h3 className="mt-4 font-display text-2xl font-semibold text-offwhite">
              Coastal &amp; marine sustainability
            </h3>
            <p className="mt-3 max-w-sm font-body text-sm leading-relaxed text-offwhite/60">
              Solutions attentive to Kenya's coastline — from infrastructure
              that respects marine ecosystems to nature-based restoration
              work.
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              {blueEconomy.map((item) => (
                <TagPill key={item} tone="light">
                  {item}
                </TagPill>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
