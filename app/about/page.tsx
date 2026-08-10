import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RevealOnScroll from "@/components/RevealOnScroll";
import SectionHeading from "@/components/SectionHeading";
import { coreValues, mission, site, vision } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "EcoStruct Dynamics Limited's vision, mission and core values — a multidisciplinary engineering, infrastructure and sustainability company.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="bg-offwhite pt-32 md:pt-40">
        <section className="mx-auto max-w-content px-6 pb-20 md:px-10">
          <RevealOnScroll>
            <Image
              src="/logo-full.webp"
              alt={`${site.name} logo`}
              width={900}
              height={765}
              className="mb-8 h-24 w-auto md:h-32"
            />
            <span className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-steel">
              <span className="h-px w-8 bg-bronze" aria-hidden="true" />
              About Us
            </span>
            <h1 className="max-w-3xl text-balance font-display text-display-lg font-bold text-charcoal">
              {site.name}
            </h1>
            <p className="mt-5 max-w-xl font-body text-lg leading-relaxed text-charcoal/65">
              {site.tagline}
            </p>
          </RevealOnScroll>
        </section>

        <section className="border-t border-charcoal/10 bg-charcoal py-20 text-offwhite md:py-28">
          <div className="mx-auto grid max-w-content grid-cols-1 gap-14 px-6 md:px-10 lg:grid-cols-2 lg:gap-10">
            <RevealOnScroll>
              <SectionHeading eyebrow="Our Vision" title="Where we're headed" tone="light" description={vision} />
            </RevealOnScroll>
            <RevealOnScroll delay={100}>
              <SectionHeading eyebrow="Our Mission" title="Why we do this work" tone="light" description={mission} />
            </RevealOnScroll>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-content px-6 md:px-10">
            <RevealOnScroll>
              <SectionHeading
                eyebrow="Core Values"
                title="What guides every project we take on."
                align="center"
                className="mx-auto"
              />
            </RevealOnScroll>

            <RevealOnScroll
              stagger
              className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-charcoal/10 bg-charcoal/10 sm:grid-cols-4"
            >
              {coreValues.map((value) => (
                <div
                  key={value}
                  className="flex items-center justify-center bg-offwhite px-4 py-8 text-center"
                >
                  <span className="font-display text-base font-semibold text-charcoal">
                    {value}
                  </span>
                </div>
              ))}
            </RevealOnScroll>
          </div>
        </section>

        <section className="border-t border-charcoal/10 py-20 md:py-28">
          <div className="mx-auto max-w-content px-6 md:px-10">
            <RevealOnScroll>
              <SectionHeading
                eyebrow="Company Registration"
                title="Registered and operating in Kenya."
              />
            </RevealOnScroll>

            <RevealOnScroll delay={100} className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-charcoal/10 bg-charcoal/10 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-offwhite p-7">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-steel">
                  Registration Number
                </span>
                <p className="mt-2 font-display text-lg font-semibold text-charcoal">
                  {site.registration.number}
                </p>
              </div>
              <div className="bg-offwhite p-7">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-steel">
                  Registration Date
                </span>
                <p className="mt-2 font-display text-lg font-semibold text-charcoal">
                  {site.registration.date}
                </p>
              </div>
              <div className="bg-offwhite p-7">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-steel">
                  Registered Office
                </span>
                <p className="mt-2 font-body text-sm leading-relaxed text-charcoal/70">
                  {site.registeredOffice.line1}
                  <br />
                  {site.registeredOffice.line2}
                </p>
              </div>
              <div className="bg-offwhite p-7">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-steel">
                  Postal Address
                </span>
                <p className="mt-2 font-body text-sm leading-relaxed text-charcoal/70">
                  {site.postalAddress.line1}
                  <br />
                  {site.postalAddress.line2}
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={150} className="mt-14 flex flex-wrap items-center gap-4">
              <a
                href="/#capabilities"
                className="inline-flex items-center justify-center rounded-sm bg-charcoal px-7 py-3.5 font-body text-sm font-semibold uppercase tracking-[0.1em] text-offwhite transition-all duration-300 ease-engineer hover:bg-charcoal/85"
              >
                Explore Our Capabilities
              </a>
              <a
                href="/#contact"
                className="inline-flex items-center justify-center rounded-sm border border-charcoal/25 px-7 py-3.5 font-body text-sm font-semibold uppercase tracking-[0.1em] text-charcoal transition-all duration-300 ease-engineer hover:border-charcoal"
              >
                Talk to Us
              </a>
            </RevealOnScroll>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
