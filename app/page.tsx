import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/sections/Hero";
import WhatWeDo from "@/sections/WhatWeDo";
import About from "@/sections/About";
import Services from "@/sections/Services";
import GreenBlueEconomy from "@/sections/GreenBlueEconomy";
import Process from "@/sections/Process";
import ValueProposition from "@/sections/ValueProposition";
import Contact from "@/sections/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <WhatWeDo />
        <About />
        <Services compact />
        <GreenBlueEconomy />
        <Process />
        <ValueProposition />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
