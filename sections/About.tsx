import Image from "next/image";
import RevealOnScroll from "@/components/RevealOnScroll";
import SectionHeading from "@/components/SectionHeading";
import { coreValues, mission, site } from "@/lib/data";

export default function About() {
  return (
    <section id="about" className="bg-offwhite py-24 md:py-32">
      <div className="mx-auto max-w-content px-6 md:px-10">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <RevealOnScroll>
              <SectionHeading
                eyebrow="About EcoStruct Dynamics"
                title="A multidisciplinary company, built around one mission."
                description={mission}
              />
            </RevealOnScroll>

            <RevealOnScroll delay={120} className="mt-8">
              <a
                href="/about"
                className="group inline-flex items-center gap-2 font-body text-sm font-semibold uppercase tracking-[0.1em] text-charcoal transition-colors duration-300 hover:text-bronze"
              >
                Learn more about us
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="transition-transform duration-300 ease-engineer group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
                </svg>
              </a>
            </RevealOnScroll>

            <RevealOnScroll delay={160} className="mt-10">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm">
                <Image
                  src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1600&auto=format&fit=crop"
                  alt="Detail of structural concrete and formwork on an active construction site"
                  fill
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="object-cover"
                />
              </div>
            </RevealOnScroll>
          </div>

          <div className="lg:col-span-7 lg:pt-4">
            <RevealOnScroll
              stagger
              className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-charcoal/10 bg-charcoal/10 sm:grid-cols-4"
            >
              {coreValues.map((value) => (
                <div
                  key={value}
                  className="group flex items-center justify-center bg-offwhite px-4 py-6 text-center transition-colors duration-300 ease-engineer hover:bg-charcoal"
                >
                  <span className="font-display text-sm font-semibold text-charcoal transition-colors duration-300 group-hover:text-offwhite">
                    {value}
                  </span>
                </div>
              ))}
            </RevealOnScroll>

            <RevealOnScroll delay={150} className="mt-10 border-t border-charcoal/10 pt-8">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-steel">
                Registered in Kenya
              </span>
              <p className="mt-2 max-w-xl font-body text-sm leading-relaxed text-charcoal/60">
                {site.name} is registered under company number{" "}
                {site.registration.number}, dated {site.registration.date}.
                Further company history and credentials will be published as
                they become available.
              </p>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
