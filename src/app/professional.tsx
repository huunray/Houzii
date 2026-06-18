import React from "react";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { ProfessionalHero } from "./components/professional/professional-hero";
import { ProfessionalRoles } from "./components/professional/professional-roles";
import { ProfessionalBenefits } from "./components/professional/professional-benefits";
import { ProfessionalHowItWorks } from "./components/professional/professional-how-it-works";
import { ProfessionalTools } from "./components/professional/professional-tools";
import { ProfessionalGrid } from "./components/professional/professional-grid";
import { ProfessionalTestimonials } from "./components/professional/professional-testimonials";
import { ProfessionalSubscription } from "./components/professional/professional-subscription";
import { ProfessionalCTA } from "./components/professional/professional-cta";

export const ProfessionalLanding = () => {
  return (
    <main className="min-h-screen font-['Urbanist'] selection:bg-primary selection:text-white bg-[#FAFAFA]">
      <Navbar />
      <ProfessionalHero />
      <ProfessionalRoles />
      <ProfessionalBenefits />
      <ProfessionalHowItWorks />
      <ProfessionalTools />
      <ProfessionalGrid />
      <ProfessionalTestimonials />
      <ProfessionalSubscription />
      <ProfessionalCTA />
      <Footer />
    </main>
  );
};
