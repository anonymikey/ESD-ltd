import RevealOnScroll from "@/components/RevealOnScroll";
import SectionHeading from "@/components/SectionHeading";

export default function Projects() {
  return (
    <section id="projects" className="bg-offwhite py-24 md:py-32">
      <div className="mx-auto max-w-content px-6 md:px-10">
        <RevealOnScroll>
          <SectionHeading
            eyebrow="Our Work"
            title="Featured projects"
            description="Selected projects and case studies will be featured here."
          />
        </RevealOnScroll>

        <RevealOnScroll delay={100}>
          <div className="relative mt-16 overflow-hidden rounded-sm border border-charcoal/12 bg-charcoal">
            <div className="absolute inset-0 bg-blueprint bg-grid opacity-[0.07]" />
            <div className="relative flex flex-col items-start gap-8 px-8 py-16 md:flex-row md:items-center md:justify-between md:px-14 md:py-20">
              <div className="max-w-xl">
                <span className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-bronze">
                  <span className="h-px w-8 bg-bronze" aria-hidden="true" />
                  Coming Soon
                </span>
                <h3 className="mt-5 text-balance font-display text-display-md font-semibold text-offwhite">
                  Project case studies, in progress.
                </h3>
                <p className="mt-5 font-body text-base leading-relaxed text-offwhite/65">
                  Selected projects and case studies will be featured here
                  once documentation is complete. We publish only work we
                  can stand behind.
                </p>
              </div>

              <a
                href="#contact"
                className="inline-flex shrink-0 items-center justify-center rounded-sm border border-offwhite/25 px-6 py-3.5 font-body text-sm font-semibold uppercase tracking-[0.1em] text-offwhite transition-all duration-300 ease-engineer hover:border-bronze hover:text-bronze"
              >
                Discuss a Project
              </a>
            </div>

            {/* Placeholder tiles hinting at the future grid layout */}
            <div className="relative grid grid-cols-1 gap-px border-t border-offwhite/10 bg-offwhite/10 sm:grid-cols-3">
              {["Construction", "Civil Engineering", "Infrastructure"].map((label) => (
                <div
                  key={label}
                  className="flex aspect-[4/3] flex-col items-center justify-center gap-3 bg-charcoal px-6 text-center"
                >
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                    <rect x="1" y="1" width="26" height="26" stroke="#A97A3B" strokeOpacity="0.5" strokeWidth="1" strokeDasharray="3 3" />
                  </svg>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-offwhite/40">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
