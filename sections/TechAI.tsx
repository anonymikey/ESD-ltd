import RevealOnScroll from "@/components/RevealOnScroll";
import SectionHeading from "@/components/SectionHeading";
import TagPill from "@/components/TagPill";
import { techCapabilities } from "@/lib/data";

export default function TechAI() {
  return (
    <section id="technology" className="relative overflow-hidden bg-charcoal py-24 text-offwhite md:py-32">
      <div className="absolute inset-0 bg-blueprint bg-grid opacity-[0.05]" aria-hidden="true" />
      <div className="relative mx-auto max-w-content px-6 md:px-10">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <RevealOnScroll>
              <SectionHeading
                eyebrow="Technology + AI"
                title="Modern tools, applied to engineering work."
                description="We bring AI-enabled and digital technology into engineering and infrastructure delivery — supporting decisions with better data, and projects with better tools."
                tone="light"
              />
            </RevealOnScroll>
          </div>

          <div className="lg:col-span-7 lg:pt-2">
            <RevealOnScroll stagger delay={80} className="flex flex-wrap gap-3">
              {techCapabilities.map((capability) => (
                <TagPill key={capability} tone="light">
                  {capability}
                </TagPill>
              ))}
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
