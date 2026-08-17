import RevealOnScroll from "@/components/RevealOnScroll";
import SectionHeading from "@/components/SectionHeading";
import ServiceCard from "@/components/ServiceCard";
import { serviceCategories } from "@/lib/data";

export default function Services() {
  return (
    <section id="services" className="bg-charcoal py-24 md:py-32">
      <div className="mx-auto max-w-content px-6 md:px-10">
        <RevealOnScroll>
          <SectionHeading
            eyebrow="Core Services"
            title="A full-portfolio capability, grouped into eight strategic categories."
            description="Our service portfolio spans engineering, construction, design, cost management, green building, environmental work, technology and procurement. Full detail on each category will be available on dedicated service pages."
            tone="light"
          />
        </RevealOnScroll>

        <RevealOnScroll
          stagger
          className="mt-16 grid grid-cols-1 gap-px overflow-hidden bg-offwhite/12 sm:grid-cols-2 lg:grid-cols-4"
        >
          {serviceCategories.map((category) => (
            <div key={category.letter} className="bg-charcoal">
              <ServiceCard
                letter={category.letter}
                name={category.name}
                description={category.description}
              />
            </div>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}
