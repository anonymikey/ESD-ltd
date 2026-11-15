import RevealOnScroll from "@/components/RevealOnScroll";
import SectionHeading from "@/components/SectionHeading";
import ContactForm from "@/components/ContactForm";
import { site } from "@/lib/data";

export default function Contact() {
  return (
    <section id="contact" className="bg-charcoal py-24 text-offwhite md:py-32">
      <div className="mx-auto max-w-content px-6 md:px-10">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <RevealOnScroll>
              <SectionHeading
                eyebrow="Start a Conversation"
                title="Begin an engineering consultation."
                description="Tell us about the brief, the site, or the problem you're trying to solve. A member of our team will follow up to discuss scope and next steps."
                tone="light"
              />
            </RevealOnScroll>

            <RevealOnScroll delay={100} className="mt-10 space-y-6">
              <div className="border-b border-offwhite/10 pb-6">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-offwhite/45">
                  Primary enquiries
                </span>
                <a
                  href={`mailto:${site.emails.website}`}
                  className="mt-2 block font-display text-xl font-semibold text-leaf underline decoration-leaf/40 decoration-1 underline-offset-4 transition-colors duration-300 hover:text-leaf-light hover:decoration-leaf-light"
                >
                  {site.emails.website}
                </a>
                <p className="mt-2 font-body text-sm leading-relaxed text-offwhite/55">
                  For project enquiries and general questions, this is the best place to start.
                </p>
              </div>
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-offwhite/45">
                  Additional contacts
                </span>
                <div className="mt-3 space-y-3">
                  <a
                    href={`mailto:${site.emails.official}`}
                    className="block font-display text-base font-medium text-offwhite underline decoration-offwhite/20 decoration-1 underline-offset-4 transition-colors duration-300 hover:text-leaf hover:decoration-leaf"
                  >
                    {site.emails.official}
                  </a>
                  <a
                    href={`mailto:${site.emails.direct}`}
                    className="block font-display text-base font-medium text-offwhite underline decoration-offwhite/20 decoration-1 underline-offset-4 transition-colors duration-300 hover:text-leaf hover:decoration-leaf"
                  >
                    {site.emails.direct}
                  </a>
                </div>
              </div>

              <div className="border-t border-offwhite/10 pt-6">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-offwhite/45">
                  Phone
                </span>
                <a
                  href={`tel:${site.phone.replace(/\s+/g, "")}`}
                  className="mt-1 block font-display text-lg font-medium text-offwhite transition-colors duration-300 hover:text-leaf"
                >
                  {site.phone}
                </a>
              </div>

              <div>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-offwhite/45">
                  Registered office
                </span>
                <p className="mt-1 font-body text-sm leading-relaxed text-offwhite/65">
                  {site.registeredOffice.line1}
                  <br />
                  {site.registeredOffice.line2}
                </p>
              </div>

              <div>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-offwhite/45">
                  Postal address
                </span>
                <p className="mt-1 font-body text-sm leading-relaxed text-offwhite/65">
                  {site.postalAddress.line1}
                  <br />
                  {site.postalAddress.line2}
                </p>
              </div>
            </RevealOnScroll>
          </div>

          <div className="lg:col-span-7">
            <RevealOnScroll delay={150} className="rounded-sm border border-offwhite/12 p-7 md:p-10">
              <ContactForm />
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
