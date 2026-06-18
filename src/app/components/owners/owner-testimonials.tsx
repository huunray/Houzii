import React from "react";
import { motion } from "motion/react";
import { Quote, Star } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export const OwnerTestimonials = () => {
  return (
    <section className="py-24 bg-[#FAFAFA] relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#7B2D42]/5 rounded-full blur-[120px] pointer-events-none z-0" />
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6"
          >
            Trusted by Property Owners Across Nigeria
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 font-medium"
          >
            See how property owners are maximizing their returns and finding reliable tenants using Houzii's transparent and trusted platform.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative pb-12">
          {/* Testimonial 1 */}
          <motion.div 
            className="bg-white p-8 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col h-full relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0 }}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                ))}
              </div>
              <Quote className="w-10 h-10 text-slate-50 stroke-[1px]" />
            </div>
            
            <p className="text-slate-600 leading-relaxed font-medium mb-8 flex-grow">
              "Since joining Houzii, I've seen a 40% increase in verified inquiries. The owner dashboard is a game-changer for managing my property viewings and offers in one place."
            </p>
            
            <div className="flex items-center gap-4 pt-6 border-t border-slate-50 mt-auto">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1550051414-003c9007794c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwbWFuJTIwc21pbGluZyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MzM2NDUyN3ww&ixlib=rb-4.1.0&q=80&w=1080" 
                  alt="Oluwaseun Adewale"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Oluwaseun Adewale</h4>
                <p className="text-slate-500 text-xs">Property Owner, Lagos</p>
              </div>
            </div>
          </motion.div>

          {/* Testimonial 2 */}
          <motion.div 
            className="bg-white p-8 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col h-full relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                ))}
              </div>
              <Quote className="w-10 h-10 text-slate-50 stroke-[1px]" />
            </div>
            
            <p className="text-slate-600 leading-relaxed font-medium mb-8 flex-grow">
              "The listing management system is incredibly intuitive. Being able to track inquiries and follow up with serious tenants has made renting my apartments so much easier."
            </p>
            
            <div className="flex items-center gap-4 pt-6 border-t border-slate-50 mt-auto">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1765648684630-ac9c15ac98d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwd29tYW4lMjBzbWlsaW5nJTIwcHJvZmVzc2lvbmFsJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzczMzY0NTI3fDA&ixlib=rb-4.1.0&q=80&w=1080" 
                  alt="Chioma Nwosu"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Chioma Nwosu</h4>
                <p className="text-slate-500 text-xs">Landlord, Abuja</p>
              </div>
            </div>
          </motion.div>

          {/* Testimonial 3 */}
          <motion.div 
            className="bg-white p-8 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col h-full relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                ))}
              </div>
              <Quote className="w-10 h-10 text-slate-50 stroke-[1px]" />
            </div>
            
            <p className="text-slate-600 leading-relaxed font-medium mb-8 flex-grow">
              "The verified agents integration gives me peace of mind. Houzii truly understands the Nigerian real estate market and built the perfect solution for property owners."
            </p>
            
            <div className="flex items-center gap-4 pt-6 border-t border-slate-50 mt-auto">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1625181796571-7f0d4571ab12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwbWFuJTIwc21pbGluZyUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MzMzNTY1OHww&ixlib=rb-4.1.0&q=80&w=1080" 
                  alt="Tunde Bakare"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Tunde Bakare</h4>
                <p className="text-slate-500 text-xs">Real Estate Investor, Port Harcourt</p>
              </div>
            </div>
          </motion.div>
          
          {/* Soft gradient fade out effect at bottom to match image style */}
          <div className="absolute -bottom-8 left-0 w-full h-24 bg-gradient-to-t from-[#FAFAFA] to-transparent pointer-events-none z-10" />
        </div>
      </div>
    </section>
  );
};
