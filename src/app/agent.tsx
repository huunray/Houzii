import React from "react";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { AgentHero } from "./components/agent/agent-hero";
import { AgentBenefits } from "./components/agent/agent-benefits";
import { AgentHowItWorks } from "./components/agent/agent-how-it-works";
import { AgentCRMTools } from "./components/agent/agent-crm-tools";
import { AgentSocialProof } from "./components/agent/agent-social-proof";
import { AgentSubscription } from "./components/agent/agent-subscription";
import { AgentFinalCTA } from "./components/agent/agent-final-cta";

export const AgentLanding = () => {
  return (
    <main className="min-h-screen font-['Urbanist'] selection:bg-primary selection:text-white bg-[#FAFAFA]">
      <Navbar />
      <AgentHero />
      <AgentBenefits />
      <AgentHowItWorks />
      <AgentCRMTools />
      <AgentSocialProof />
      <AgentSubscription />
      <AgentFinalCTA />
      <Footer />
    </main>
  );
};
