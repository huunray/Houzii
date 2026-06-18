import React from "react";
import { SubscriptionSection, Plan } from "../shared/subscription-section";

const ownerPlans: Plan[] = [
  {
    id: "basic",
    name: "Basic Listing",
    price: "Free",
    description: "List your property and start receiving inquiries from potential buyers and tenants.",
    features: [
      { text: "Create property listings" },
      { text: "Upload images and details" },
      { text: "Receive buyer/tenant inquiries" },
      { text: "Manage offers & viewing requests" },
      { text: "Access to Houzii messaging" },
    ],
    ctaText: "Get Started",
  },
  {
    id: "featured",
    name: "Featured Listing",
    price: "₦20,000",
    description: "Increase visibility and attract serious buyers with featured placement in search results.",
    isPopular: true,
    features: [
      { text: "Featured search placement" },
      { text: "Highlighted listing appearance" },
      { text: "Increased discovery rate" },
      { text: "Access to verified agents" },
      { text: "Performance insights & analytics" },
    ],
    ctaText: "Go Featured",
  },
  {
    id: "premium",
    name: "Premium Listing",
    price: "₦50,000",
    description: "Maximum exposure for your property with top placement and cross-platform marketing boost.",
    features: [
      { text: "Top placement in search" },
      { text: "Premium listing badge" },
      { text: "Marketing boost across Houzii" },
      { text: "Priority visibility to agents" },
      { text: "Advanced listing analytics" },
    ],
    ctaText: "Go Premium",
  },
];

export const OwnerSubscription = () => {
  return (
    <SubscriptionSection
      title="Plans Built for Your Growth"
      subtitle="Owners care about visibility, faster tenants, and access to top agents. Choose the right listing plan for your property."
      plans={ownerPlans}
      theme="dark"
    />
  );
};
