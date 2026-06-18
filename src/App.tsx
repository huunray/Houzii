import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Home } from "./pages/houzii/home";
import { Explore } from "./pages/houzii/explore";
import { PropertyDetails } from "./pages/houzii/property-details";
import { AgentLanding } from "./pages/houzii/agent";
import { ProfessionalLanding } from "./pages/houzii/professional";
import { OwnersLanding } from "./pages/houzii/owners";
import { FindProfessionals } from "./pages/houzii/find-professionals";
import { Onboarding } from "./pages/houzii/onboarding";
import { AgentOnboarding } from "./pages/houzii/agent-onboarding";
import { OwnerOnboarding } from "./pages/houzii/owner-onboarding";
import { ProfessionalOnboarding } from "./pages/houzii/professional-onboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/for-agents" element={<AgentLanding />} />
          <Route path="/professional" element={<ProfessionalLanding />} />
          <Route path="/owners" element={<OwnersLanding />} />
          <Route path="/find-professionals" element={<FindProfessionals />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/agent-onboarding" element={<AgentOnboarding />} />
          <Route path="/owner-onboarding" element={<OwnerOnboarding />} />
          <Route path="/professional-onboarding" element={<ProfessionalOnboarding />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;