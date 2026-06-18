import React from "react";
import { motion } from "motion/react";
import { Users, UserCheck, LayoutDashboard, ShieldCheck, Megaphone, LineChart } from "lucide-react";

export const OwnerBenefits = () => {
  const benefits = [
    {
      icon: Users,
      title: "Reach Qualified Buyers & Tenants",
      description: "Your listings are seen by people actively searching for homes and investment opportunities."
    },
    {
      icon: UserCheck,
      title: "Connect With Trusted Agents",
      description: "Assign verified agents to help market and close deals faster."
    },
    {
      icon: LayoutDashboard,
      title: "Manage Listings Easily",
      description: "Update property details, upload photos, and manage inquiries from one dashboard."
    },
    {
      icon: ShieldCheck,
      title: "Secure Transactions",
      description: "Protect your deals with transparent offers, secure communication, and trusted verification."
    },
    {
      icon: Megaphone,
      title: "Market Your Property Effectively",
      description: "Promote listings to the right audience using Houzii’s property discovery tools."
    },
    {
      icon: LineChart,
      title: "Track Performance",
      description: "Monitor views, inquiries, and offers in real time."
    }
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-6"
          >
            <span className="text-sm font-semibold text-slate-800">Why Choose Houzii</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6"
          >
            A Smarter Way to Sell or Rent Property
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 font-medium"
          >
            Houzii gives property owners the tools, visibility, and trusted network needed to sell, rent, or manage property efficiently.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                className="bg-[#FAFAFA] p-8 rounded-[24px] border border-slate-100 hover:shadow-[0_8px_30px_rgb(123,45,66,0.08)] hover:bg-white transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center mb-6 group-hover:bg-[#7B2D42] group-hover:border-[#7B2D42] transition-colors duration-300">
                  <Icon className="w-6 h-6 text-[#7B2D42] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#7B2D42] transition-colors duration-300">
                  {benefit.title}
                </h3>
                <p className="text-slate-600 leading-relaxed font-medium">
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
