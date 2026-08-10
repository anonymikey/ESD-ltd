import RevealOnScroll from "@/components/RevealOnScroll";
import SectionHeading from "@/components/SectionHeading";
import { impactGroups } from "@/lib/data";

export default function Impact() {
  return (
    <section id="impact" className="bg-offwhite py-24 md:py-32">
      <div className="mx-auto max-w-content px-6 md:px-10">
        <RevealOnScroll>
          <SectionHeading
            eyebrow="Impact &amp; Inclusion"
            title="Attention to who gets to participate, not just what gets built."
            description="Inclusion is one of our core values. In practice, that means paying deliberate attention to who has access to the opportunities our projects create."
          />
        </RevealOnScroll>

        <RevealOnScroll
          stagger
          className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-charcoal/10 bg-charcoal/10 sm:grid-cols-2 lg:grid-cols-5"
        >
          {impactGroups.map((group) => (
            <div key={group.name} className="bg-offwhite p-7">
              <h3 className="font-display text-base font-semibold text-charcoal">
                {group.name}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-charcoal/60">
                {group.description}
              </p>
            </div>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}
