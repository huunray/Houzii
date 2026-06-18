import React from "react";
import { motion } from "motion/react";
import { Quote, Star } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export const AgentSocialProof = () => {
  const testimonials = [
    {
      name: "Oluwaseun Adewale",
      role: "Independent Broker, Lagos",
      quote: "Since joining Houzii, I've seen a 40% increase in verified leads. The CRM tools are a game-changer for managing my property viewings.",
      avatar: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      name: "Chioma Nwosu",
      role: "Lead Agent, Abuja Realty",
      quote: "The listing management system is incredibly intuitive. Being able to track commissions and follow up with serious buyers has scaled our agency.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      name: "Tunde Bakare",
      role: "Property Manager, Portharcourt",
      quote: "Escrow integration gives my clients peace of mind. Houzii truly understands the Nigerian real estate market and built the perfect solution.",
      avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2&w=256&h=256&q=80"
    }
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-6"
          >
            Trusted by Top Agents Across Nigeria
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600"
          >
            See how real estate professionals are transforming their business using Houzii's transparent and layered platform.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              className="bg-white/60 backdrop-blur-xl p-8 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 hover:shadow-[0_8px_30px_rgb(123,45,66,0.08)] hover:bg-white transition-all duration-300 relative group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
            >
              <Quote className="absolute top-8 right-8 w-10 h-10 text-[#7B2D42]/5 group-hover:text-[#7B2D42]/10 transition-colors" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                ))}
              </div>
              
              <p className="text-slate-700 italic mb-8 relative z-10 text-lg leading-relaxed">
                "{testimonial.quote}"
              </p>
              
              <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 shadow-sm border border-white">
                  <ImageWithFallback 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
