import React from "react";
import { Navbar } from "./components/navbar";
import { Hero } from "./components/hero";
import { Stats } from "./components/stats";
import { Features } from "./components/features";
import { PropertyGrid } from "./components/property-grid";
import { ProfessionalsSection } from "./components/professionals-section";
import { ConversionSection } from "./components/conversion-section";
import { CityGrid } from "./components/city-grid";
import { Insights } from "./components/insights";
import { FinalCTA } from "./components/final-cta";
import { Footer } from "./components/footer";

export const Home = () => {
  return (
    <main className="min-h-screen font-['Urbanist'] selection:bg-primary selection:text-white">
      <Navbar />
      <Hero />
      <PropertyGrid />
      <Features />
      <Stats />
      <ProfessionalsSection />
      <ConversionSection />
      <CityGrid />
      <Insights />
      <FinalCTA />
      <Footer />
    </main>
  );
};
