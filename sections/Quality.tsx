import Image from "next/image";
import RevealOnScroll from "@/components/RevealOnScroll";
import SectionHeading from "@/components/SectionHeading";
import { qualitySafety } from "@/lib/data";

export default function Quality() {
  return (
    <section id="quality" className="bg-charcoal py-24 text-offwhite md:py-32">
      <div className="mx-auto max-w-content px-6 md:px-10">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <RevealOnScroll>
              <SectionHeading
                eyebrow="Quality, Safety &amp; Compliance"
                title="A standard we hold ourselves to, on every project."
                description="Our operating principles are built around quality assurance, occupational health and safety, environmental responsibility, and ethical, accountable business practice."
                tone="light"
              />
            </RevealOnScroll>

            <RevealOnScroll stagger delay={80} className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              {qualitySafety.map((item) => (
                <div key={item} className="flex items-center gap-3 border-l border-bronze/40 py-1 pl-4">
                  <span className="font-body text-sm text-offwhite/75">{item}</span>
                </div>
              ))}
            </RevealOnScroll>
          </div>

          <div className="lg:col-span-6">
            <RevealOnScroll delay={150} className="relative aspect-[4/3] w-full overflow-hidden rounded-sm lg:aspect-auto lg:h-full">
              <Image
                src="https://images.unsplash.com/photo-1590644365607-1c5a94b13a5f?q=80&w=1600&auto=format&fit=crop"
                alt="Structural steel geometry against the sky"
                fill
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
