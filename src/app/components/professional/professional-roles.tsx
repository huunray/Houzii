import React from "react";
import { motion } from "motion/react";
import { Scale, Map, Palette, Truck, ClipboardCheck, Wrench } from "lucide-react";

export const ProfessionalRoles = () => {
  const roles = [
    {
      icon: Scale,
      title: "Lawyers",
      description: "Handle property documentation, legal verification, and contract processing."
    },
    {
      icon: Map,
      title: "Surveyors",
      description: "Provide land verification, boundary surveys, and title checks."
    },
    {
      icon: Palette,
      title: "Interior Designers",
      description: "Help property owners transform spaces and increase property value."
    },
    {
      icon: Truck,
      title: "Movers & Relocation Services",
      description: "Assist tenants and homeowners with moving services."
    },
    {
      icon: ClipboardCheck,
      title: "Property Inspectors",
      description: "Inspect homes before purchase or rental agreements."
    },
    {
      icon: Wrench,
      title: "Maintenance & Repair Services",
      description: "Provide repairs, renovations, and maintenance services."
    }
  ];

  return (
    <section className="py-24 bg-[#FAFAFA] relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-6"
          >
            <span className="text-sm font-semibold text-slate-800">Who Can Join</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6"
          >
            Built for Professionals in the Real Estate Ecosystem
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600"
          >
            Houzii connects service professionals with people who need trusted real estate services.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <motion.div
                key={index}
                className="bg-white/60 backdrop-blur-xl p-8 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 hover:shadow-[0_8px_30px_rgb(123,45,66,0.08)] hover:bg-white transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-[#7B2D42]/5 border border-[#7B2D42]/10 flex items-center justify-center mb-6 group-hover:bg-[#7B2D42] group-hover:border-[#7B2D42] transition-colors duration-300 shadow-sm">
                  <Icon className="w-7 h-7 text-[#7B2D42] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#7B2D42] transition-colors duration-300">
                  {role.title}
                </h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {role.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
