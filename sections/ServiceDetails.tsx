import RevealOnScroll from "@/components/RevealOnScroll";
import SectionHeading from "@/components/SectionHeading";
import { serviceCategories } from "@/lib/data";
import { serviceDetails } from "@/lib/serviceDetails";

function DetailList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-2 font-body text-sm leading-relaxed text-charcoal/70">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ServiceDetails() {
  return (
    <section id="service-details" className="bg-offwhite py-24 md:py-32">
      <div className="mx-auto max-w-content px-6 md:px-10">
        <RevealOnScroll>
          <SectionHeading
            eyebrow="Service Details"
            title="The right level of support for each project stage."
            description="Use these outlines to understand the typical scope, fit and outputs for each service category. The final scope is shaped around your brief, site and requirements."
          />
        </RevealOnScroll>

        <div className="mt-16 space-y-5">
          {serviceDetails.map((detail, index) => {
            const category = serviceCategories.find((item) => item.letter === detail.letter);
            if (!category) return null;

            return (
              <RevealOnScroll key={detail.letter} delay={index * 40}>
                <article id={`service-${detail.letter}`} className="scroll-mt-24 overflow-hidden border border-charcoal/10 bg-white">
                  <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="p-7 md:p-10">
                      <div className="flex items-start gap-5">
                        <span className="font-mono text-sm text-leaf">{detail.letter}</span>
                        <div>
                          <h2 className="font-display text-2xl font-semibold tracking-tight text-charcoal md:text-3xl">
                            {category.name}
                          </h2>
                          <p className="mt-3 max-w-2xl font-body text-base leading-relaxed text-charcoal/65">
                            {category.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-9 grid grid-cols-1 gap-8 sm:grid-cols-2">
                        <div>
                          <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-steel">What it includes</h3>
                          <DetailList items={detail.includes} />
                        </div>
                        <div>
                          <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-steel">Who it is for</h3>
                          <p className="mt-4 font-body text-sm leading-relaxed text-charcoal/70">{detail.for}</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-charcoal/10 bg-offwhite p-7 md:p-10 lg:border-l lg:border-t-0">
                      <div>
                        <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-steel">Typical stages</h3>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {detail.stages.map((stage, stageIndex) => (
                            <span key={stage} className="rounded-full border border-charcoal/15 px-3 py-1.5 font-body text-xs font-medium text-charcoal/75">
                              <span className="mr-1.5 font-mono text-leaf">0{stageIndex + 1}</span>
                              {stage}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-8 border-t border-charcoal/10 pt-8">
                        <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-steel">Typical deliverables</h3>
                        <DetailList items={detail.deliverables} />
                      </div>
                      <a href="/#contact" className="mt-8 inline-flex items-center gap-2 font-body text-sm font-semibold uppercase tracking-[0.1em] text-charcoal transition-colors duration-300 hover:text-leaf">
                        {detail.cta}
                        <span aria-hidden="true">→</span>
                      </a>
                    </div>
                  </div>
                </article>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
