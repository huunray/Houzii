import React from "react";
import { motion } from "motion/react";
import { Users, Home, MessageSquare, Award, Building, TrendingUp } from "lucide-react";

export const AgentBenefits = () => {
  const benefits = [
    {
      icon: Users,
      title: "Access Qualified Leads",
      description: "Connect with buyers and tenants actively searching for properties."
    },
    {
      icon: Home,
      title: "List and Promote Properties",
      description: "Showcase your property listings to a large audience of serious seekers."
    },
    {
      icon: MessageSquare,
      title: "Manage Clients Easily",
      description: "Track client inquiries, schedule viewings, and communicate seamlessly."
    },
    {
      icon: Award,
      title: "Build Your Professional Reputation",
      description: "Create a verified profile that showcases your expertise and successful listings."
    },
    {
      icon: Building,
      title: "Collaborate With Property Owners",
      description: "Work directly with property owners looking for agents to market and manage their properties."
    },
    {
      icon: TrendingUp,
      title: "Grow Your Real Estate Network",
      description: "Connect with other professionals and service providers within the Houzii ecosystem."
    }
  ];

  return (
    <section className="py-24 bg-[#FFF9FB] relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            A Platform Built to Help Agents Succeed
          </h2>
          <p className="text-lg text-slate-600">
            Houzii provides agents with the tools, exposure, and network needed to grow their real estate business and close more deals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-[24px] shadow-sm border border-slate-100 hover:shadow-xl hover:border-[#7B2D42]/20 transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-[#7B2D42]/5 flex items-center justify-center mb-6 group-hover:bg-[#7B2D42] group-hover:text-white transition-colors duration-300">
                  <Icon className="w-7 h-7 text-[#7B2D42] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-[#7B2D42] transition-colors duration-300">
                  {benefit.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
