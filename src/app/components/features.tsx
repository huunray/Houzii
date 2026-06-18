import React from "react";
import { Search, UserPlus, Home, Hammer, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export const Features = () => {
  const features = [
    {
      title: "Find a Home",
      description: "Buy or rent verified properties anywhere in Nigeria. We ensure every listing is legitimate and ready for you.",
      icon: Search,
      color: "bg-primary text-white",
      bg: "bg-primary/5",
    },
    {
      title: "Sign up as an Agent",
      description: "Join Nigeria's leading real estate network. List properties, manage clients, and grow your agency business with ease.",
      icon: UserPlus,
      color: "bg-accent text-white",
      bg: "bg-accent/5",
    },
    {
      title: "Sell or Rent Property",
      description: "List your property to reach thousands of potential buyers and tenants across Nigeria. We make selling and renting easy and stress-free.",
      icon: Home,
      color: "bg-slate-900 text-white",
      bg: "bg-slate-900/5",
    },
    {
      title: "Hire Property Services",
      description: "Find trusted lawyers, surveyors, movers, and artisans. Every professional is vetted and peer-reviewed.",
      icon: Hammer,
      color: "bg-slate-600 text-white",
      bg: "bg-slate-600/5",
    },
  ];

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
              Everything You Need for Real Estate in One Platform
            </h2>
            <p className="text-slate-500 text-lg">
              Houzii is more than just listings. We offer a comprehensive ecosystem 
              designed to simplify every aspect of property ownership and investment.
            </p>
          </div>
          {/* Explore Ecosystem button removed */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
                        <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group p-8 rounded-[24px] bg-white border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all hover:-translate-y-2"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all group-hover:scale-110 group-hover:rotate-6 duration-300 ${feature.color}`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-500 leading-relaxed mb-8">
                {feature.description}
              </p>
              <button className="text-sm font-bold text-slate-900 flex items-center gap-2 transition-all group-hover:text-primary">
                {feature.title === "Hire Property Services" 
                  ? "Learn more" 
                  : feature.title === "Sell or Rent Property"
                    ? "List Property"
                    : feature.title === "Sign up as an Agent" 
                      ? "Get started" 
                      : "Explore properties"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
