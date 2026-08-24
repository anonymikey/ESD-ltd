import RevealOnScroll from "@/components/RevealOnScroll";
import SectionHeading from "@/components/SectionHeading";
import ProcessStep from "@/components/ProcessStep";
import { processSteps } from "@/lib/data";

export default function Process() {
  return (
    <section id="process" className="relative overflow-hidden bg-offwhite py-24 md:py-32">
      <div className="absolute inset-0 bg-blueprint bg-grid opacity-[0.035]" aria-hidden="true" />
      <div className="relative mx-auto max-w-content px-6 md:px-10">
        <RevealOnScroll>
          <SectionHeading
            eyebrow="How We Work"
            title="An engineering workflow, built one stage at a time."
            align="center"
            className="mx-auto"
          />
        </RevealOnScroll>

        <RevealOnScroll stagger className="mt-16 flex flex-col md:flex-row md:items-start">
          {processSteps.map((step, index) => (
            <ProcessStep
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
              isLast={index === processSteps.length - 1}
            />
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}
