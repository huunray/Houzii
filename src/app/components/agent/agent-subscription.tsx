import React from "react";
import { SubscriptionSection, Plan } from "../shared/subscription-section";

const agentPlans: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    price: "Free",
    description: "Perfect for agents getting started and testing the platform.",
    features: [
      { text: "Basic agent profile" },
      { text: "Up to 5 property listings" },
      { text: "Standard search placement" },
      { text: "Receive property inquiries" },
      { text: "Access to Houzii messaging" },
      { text: "Basic listing management" },
    ],
    ctaText: "Get Started",
  },
  {
    id: "professional",
    name: "Professional",
    price: "₦20,000",
    description: "Designed for agents actively closing deals and managing multiple clients.",
    isPopular: true,
    features: [
      { text: "Up to 50 property listings" },
      { text: "Lead and client CRM management" },
      { text: "Property performance analytics" },
      { text: "Featured placement in search results" },
      { text: "Dedicated virtual phone number" },
      { text: "Viewing scheduling tools" },
      { text: "Enhanced professional profile" },
    ],
    ctaText: "Upgrade",
  },
  {
    id: "premium",
    name: "Premium",
    price: "₦50,000",
    description: "For high-performing agents and brokerages managing large portfolios.",
    features: [
      { text: "Unlimited property listings" },
      { text: "Priority placement in search results" },
      { text: "Advanced marketing tools for listings" },
      { text: "MLS access for shared listings" },
      { text: "Full analytics dashboard" },
      { text: "Priority support" },
      { text: "Agent branding and promotional tools" },
    ],
    ctaText: "Go Premium",
  },
];

export const AgentSubscription = () => {
  return (
    <SubscriptionSection
      title="Plans Built for Your Growth"
      subtitle="Agents care about more listings, more leads, and closing deals faster. Choose the right plan to accelerate your success on Houzii."
      plans={agentPlans}
      theme="dark"
    />
  );
};
