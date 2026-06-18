import React from "react";
import { SubscriptionSection, Plan } from "../shared/subscription-section";

const professionalPlans: Plan[] = [
  {
    id: "basic",
    name: "Basic Profile",
    price: "Free",
    description: "Create your professional presence on Houzii and start listing your services.",
    features: [
      { text: "Professional service profile" },
      { text: "List services offered" },
      { text: "Receive service inquiries" },
      { text: "Basic search visibility" },
      { text: "Messaging with clients" },
    ],
    ctaText: "Get Started",
  },
  {
    id: "professional",
    name: "Professional Plan",
    price: "₦20,000",
    description: "Get discovered by more clients with priority search placement and portfolio tools.",
    isPopular: true,
    features: [
      { text: "Priority search placement" },
      { text: "Portfolio showcase tools" },
      { text: "Receive verified requests" },
      { text: "Client messaging tools" },
      { text: "Ratings & reviews system" },
    ],
    ctaText: "Upgrade",
  },
  {
    id: "premium",
    name: "Premium Plan",
    price: "₦50,000",
    description: "Grow your service business faster with top placement and advanced customization.",
    features: [
      { text: "Top service search placement" },
      { text: "Featured professional badge" },
      { text: "Unlimited service requests" },
      { text: "Advanced profile customization" },
      { text: "Profile performance analytics" },
      { text: "Priority support" },
    ],
    ctaText: "Go Premium",
  },
];

export const ProfessionalSubscription = () => {
  return (
    <SubscriptionSection
      title="Plans Built for Your Growth"
      subtitle="Professionals care about more service requests, credibility, and reputation. Scale your business on Houzii."
      plans={professionalPlans}
      theme="dark"
    />
  );
};
