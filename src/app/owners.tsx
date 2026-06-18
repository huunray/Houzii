import React from "react";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { OwnerHero } from "./components/owners/owner-hero";
import { OwnerBenefits } from "./components/owners/owner-benefits";
import { OwnerHowItWorks } from "./components/owners/owner-how-it-works";
import { OwnerOptions } from "./components/owners/owner-options";
import { OwnerTools } from "./components/owners/owner-tools";
import { OwnerTrust } from "./components/owners/owner-trust";
import { OwnerTestimonials } from "./components/owners/owner-testimonials";
import { OwnerSubscription } from "./components/owners/owner-subscription";
import { OwnerCTA } from "./components/owners/owner-cta";

export const OwnersLanding = () => {
  return (
    <main className="min-h-screen font-['Urbanist'] selection:bg-primary selection:text-white bg-[#FAFAFA]">
      <Navbar />
      <OwnerHero />
      <OwnerBenefits />
      <OwnerHowItWorks />
      <OwnerOptions />
      <OwnerTools />
      <OwnerTrust />
      <OwnerTestimonials />
      <OwnerSubscription />
      <OwnerCTA />
      <Footer />
    </main>
  );
};
