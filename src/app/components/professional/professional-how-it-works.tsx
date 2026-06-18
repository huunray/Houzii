import React from "react";
import { motion } from "motion/react";
import { UserPlus, ShieldCheck, Mail, Star } from "lucide-react";

export const ProfessionalHowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "Create Your Professional Profile",
      description: "Add your services, experience, location, and credentials to showcase your expertise."
    },
    {
      icon: ShieldCheck,
      title: "Get Verified",
      description: "Houzii verifies professionals to maintain trust across the platform."
    },
    {
      icon: Mail,
      title: "Receive Service Requests",
      description: "Property owners, agents, and clients can request your services directly."
    },
    {
      icon: Star,
      title: "Deliver Services & Grow",
      description: "Complete jobs, receive reviews, and expand your client base rapidly."
    }
  ];

  return (
    <section className="py-24 bg-white/50 backdrop-blur-xl relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-6"
          >
            How Houzii Connects You With Clients
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 font-medium"
          >
            A simple, transparent process designed to help you secure more jobs and build your reputation.
          </motion.p>
        </div>

        <div className="relative">
          {/* Connector Line */}
          <div className="hidden lg:block absolute top-[60px] left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-transparent via-[#7B2D42]/20 to-transparent z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  className="flex flex-col items-center text-center relative bg-white/60 backdrop-blur-md p-8 rounded-[24px] border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(123,45,66,0.08)] transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                >
                  <div className="w-24 h-24 rounded-full bg-white/80 backdrop-blur-sm shadow-lg shadow-[#7B2D42]/5 border border-white flex items-center justify-center mb-6 relative group z-10 hover:border-[#7B2D42]/30 transition-colors duration-300">
                    <Icon className="w-10 h-10 text-[#7B2D42]" strokeWidth={1.5} />
                    
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#7B2D42] text-white flex items-center justify-center text-sm font-bold shadow-md ring-4 ring-white">
                      {index + 1}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
