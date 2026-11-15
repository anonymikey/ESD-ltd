import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Services from "@/sections/Services";
import TechAI from "@/sections/TechAI";
import Quality from "@/sections/Quality";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore EcoStruct Dynamics Limited's engineering, construction, sustainability, technology and procurement services.",
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="bg-offwhite pt-20 md:pt-28">
        <Services />
        <TechAI />
        <Quality />
      </main>
      <Footer />
    </>
  );
}
