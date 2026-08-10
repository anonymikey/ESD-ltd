import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/sections/Hero";
import Capabilities from "@/sections/Capabilities";
import About from "@/sections/About";
import Services from "@/sections/Services";
import Projects from "@/sections/Projects";
import GreenBlueEconomy from "@/sections/GreenBlueEconomy";
import TechAI from "@/sections/TechAI";
import Impact from "@/sections/Impact";
import Quality from "@/sections/Quality";
import ValueProposition from "@/sections/ValueProposition";
import Contact from "@/sections/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Capabilities />
        <About />
        <Services />
        <Projects />
        <GreenBlueEconomy />
        <TechAI />
        <Impact />
        <Quality />
        <ValueProposition />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
