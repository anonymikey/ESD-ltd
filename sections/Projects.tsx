import RevealOnScroll from "@/components/RevealOnScroll";
import SectionHeading from "@/components/SectionHeading";

const placeholderFields = [
  { letter: "A", category: "Construction", location: "Location — TBC" },
  { letter: "B", category: "Civil Engineering", location: "Location — TBC" },
  { letter: "C", category: "Infrastructure", location: "Location — TBC" },
];

export default function Projects() {
  return (
    <section id="projects" className="bg-offwhite py-24 md:py-32">
      <div className="mx-auto max-w-content px-6 md:px-10">
        <RevealOnScroll>
          <SectionHeading
            eyebrow="Our Work"
            title="Selected projects"
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
                  Status: Coming Soon
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

            {/* Placeholder cards previewing the future project-card layout:
                number, category, location and status — ready to swap for
                real project data via ProjectCard without a redesign. */}
            <div className="relative grid grid-cols-1 gap-px border-t border-offwhite/10 bg-offwhite/10 sm:grid-cols-3">
              {placeholderFields.map((project, index) => (
                <div
                  key={project.category}
                  className="group relative flex aspect-[4/3] flex-col justify-between overflow-hidden bg-charcoal p-6 transition-colors duration-500 ease-engineer hover:bg-charcoal-soft"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-xs text-bronze">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="rounded-full border border-offwhite/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-offwhite/45">
                      Coming Soon
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                    <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true" className="opacity-60 transition-transform duration-500 ease-engineer group-hover:scale-110">
                      <rect x="1" y="1" width="26" height="26" stroke="#A97A3B" strokeOpacity="0.6" strokeWidth="1" strokeDasharray="3 3" />
                    </svg>
                  </div>

                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-offwhite/55">
                      {project.category}
                    </span>
                    <p className="mt-1 font-body text-xs text-offwhite/35">
                      {project.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
