import React from "react";
import { motion } from "motion/react";
import { Quote, Star } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export const ProfessionalTestimonials = () => {
  return (
    <section className="py-24 bg-[#FFF9FB] relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#7B2D42]/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-100/30 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left: Trusted Ecosystem Intro */}
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Be Part of Nigeria’s <span className="text-[#7B2D42]">Trusted Property Ecosystem</span>
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">
              Houzii brings together property seekers, property owners, agents, and service professionals in one trusted platform. 
            </p>
            <p className="text-lg text-slate-600 leading-relaxed font-medium">
              By joining Houzii, professionals gain access to a growing real estate ecosystem where opportunities are constantly emerging.
            </p>
          </motion.div>

          {/* Right: Testimonial Card */}
          <motion.div 
            className="flex-1 w-full"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-[24px] border border-white transform translate-x-4 translate-y-4 shadow-xl shadow-slate-200/50" />
              
              <div className="relative bg-white/80 backdrop-blur-lg p-10 md:p-12 rounded-[24px] shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-white">
                <Quote className="absolute top-8 right-8 w-12 h-12 text-[#7B2D42]/10" />
                
                <div className="flex gap-1 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                  ))}
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-6 leading-tight">
                  "Houzii helps me connect with property owners who need interior design services. It's transformed how I get new clients."
                </h3>
                
                <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-200 shadow-sm border-2 border-white">
                    <ImageWithFallback 
                      src="https://images.unsplash.com/photo-1771041564650-55f067de005d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwcHJvZmVzc2lvbmFsJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzczMzM0NDI1fDA&ixlib=rb-4.1.0&q=80&w=1080" 
                      alt="Interior Designer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Chika O.</h4>
                    <p className="text-slate-500 font-medium">Interior Designer, Lagos</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
