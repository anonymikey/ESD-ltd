import RevealOnScroll from "@/components/RevealOnScroll";
import SectionHeading from "@/components/SectionHeading";

const pillars = [
  {
    number: "01",
    title: "Engineering & Infrastructure",
    description:
      "Technical design, civil works and infrastructure planning that move projects from brief to delivery.",
  },
  {
    number: "02",
    title: "Construction & Project Delivery",
    description:
      "Building and project management support shaped around quality, safety, programme and value.",
  },
  {
    number: "03",
    title: "Sustainable Development",
    description:
      "Green construction, renewable energy and environmental solutions for more resilient places and communities.",
  },
  {
    number: "04",
    title: "Technology & Digital Solutions",
    description:
      "AI-enabled applications, data and modern digital tools applied to engineering and infrastructure challenges.",
  },
];

export default function WhatWeDo() {
  return (
    <section id="what-we-do" className="bg-offwhite py-24 md:py-32">
      <div className="mx-auto max-w-content px-6 md:px-10">
        <RevealOnScroll>
          <SectionHeading
            eyebrow="What We Do"
            title="Four connected ways to move a project forward."
            description="One company, multiple capabilities — bringing practical expertise together for clients who need responsible solutions from planning through delivery."
          />
        </RevealOnScroll>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-charcoal/10 bg-charcoal/10 md:grid-cols-2">
          {pillars.map((pillar, index) => (
            <RevealOnScroll key={pillar.number} delay={index * 80} className="h-full">
              <article className="group flex h-full min-h-[230px] flex-col justify-between bg-offwhite p-7 transition-colors duration-300 hover:bg-offwhite-dim md:p-9">
                <div className="flex items-start justify-between gap-6">
                  <span className="font-mono text-xs tracking-[0.2em] text-leaf">
                    {pillar.number}
                  </span>
                  <span className="h-px w-12 bg-leaf/50 transition-all duration-300 ease-engineer group-hover:w-20" aria-hidden="true" />
                </div>
                <div className="mt-12">
                  <h3 className="max-w-sm font-display text-2xl font-semibold tracking-tight text-charcoal md:text-[1.7rem]">
                    {pillar.title}
                  </h3>
                  <p className="mt-4 max-w-lg font-body text-sm leading-relaxed text-charcoal/65 md:text-base">
                    {pillar.description}
                  </p>
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
