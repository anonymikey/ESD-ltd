import RevealOnScroll from "@/components/RevealOnScroll";
import SectionHeading from "@/components/SectionHeading";
import ServiceCard from "@/components/ServiceCard";
import { serviceCategories } from "@/lib/data";

interface ServicesProps {
  compact?: boolean;
}

export default function Services({ compact = false }: ServicesProps) {
  const categories = compact ? serviceCategories.slice(0, 4) : serviceCategories;

  return (
    <section id="services" className="bg-charcoal py-24 md:py-32">
      <div className="mx-auto max-w-content px-6 md:px-10">
        <RevealOnScroll>
          <SectionHeading
            eyebrow="Core Services"
            title={compact ? "The capabilities that move projects forward." : "A full-portfolio capability, grouped into eight strategic categories."}
            description={compact ? "A focused view of our core disciplines. Explore the full service portfolio for the complete range of engineering, construction, sustainability, technology and procurement support." : "Our service portfolio spans engineering, construction, design, cost management, green building, environmental work, technology and procurement."}
            tone="light"
          />
        </RevealOnScroll>

        <RevealOnScroll
          stagger
          className="mt-16 grid grid-cols-1 gap-px overflow-hidden bg-offwhite/12 sm:grid-cols-2 lg:grid-cols-4"
        >
          {categories.map((category) => (
            <div key={category.letter} className="bg-charcoal">
              <ServiceCard
                letter={category.letter}
                name={category.name}
                description={category.description}
              />
            </div>
          ))}
        </RevealOnScroll>

        {compact && (
          <RevealOnScroll delay={150} className="mt-10">
            <a
              href="/services"
              className="group inline-flex items-center gap-2 font-body text-sm font-semibold uppercase tracking-[0.1em] text-offwhite transition-colors duration-300 hover:text-leaf"
            >
              View service details
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 ease-engineer group-hover:translate-x-1" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
              </svg>
            </a>
          </RevealOnScroll>
        )}
      </div>
    </section>
  );
}
