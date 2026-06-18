import React from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export const ProfessionalCTA = () => {
  return (
    <section className="py-24 bg-[#FAFAFA] relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <motion.div 
          className="bg-[#0A0613] rounded-[32px] overflow-hidden relative shadow-[0_20px_60px_rgb(10,6,19,0.15)] flex flex-col md:flex-row"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
        >
          {/* Decorative Stars from Inspiration */}
          <svg 
            viewBox="0 0 200 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className="absolute top-0 right-[10%] md:right-[35%] lg:right-[38%] w-40 md:w-56 text-white z-0 opacity-90"
          >
            <path d="M50 0 C50 35, 15 50, 0 50 C15 50, 50 65, 50 100 C50 65, 85 50, 100 50 C85 50, 50 35, 50 0 Z" fill="currentColor"/>
            <path d="M150 0 C150 35, 115 50, 100 50 C115 50, 150 65, 150 100 C150 65, 185 50, 200 50 C185 50, 150 35, 150 0 Z" fill="currentColor"/>
          </svg>

          {/* Content Side */}
          <div className="w-full md:w-[60%] lg:w-[60%] p-10 md:p-16 lg:p-24 relative z-10 flex flex-col justify-center min-h-[400px] md:min-h-[560px]">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight max-w-lg">
              Change the way you <br className="hidden lg:block" /> grow your <span className="font-serif italic font-normal tracking-normal text-white">business</span>
            </h2>
            <p className="text-white/80 text-lg md:text-xl mb-12 max-w-md font-medium leading-relaxed">
              Join Houzii today and start connecting with property owners, agents, and clients who need your expertise.
            </p>
            <div>
              <button className="h-14 px-8 rounded-full bg-white text-[#0A0613] font-bold text-base hover:bg-slate-100 transition-colors inline-flex items-center justify-center shadow-lg shadow-white/5">
                Create Professional Account
              </button>
            </div>
          </div>

          {/* Graphic Side */}
          <div className="w-full md:w-[40%] lg:w-[40%] relative min-h-[320px] md:min-h-[auto] flex items-end justify-end mt-4 md:mt-0">
            <div className="absolute bottom-0 right-0 w-[90%] md:w-full h-[110%] md:h-[85%] bg-[#F4F4F4] rounded-tl-[80px] md:rounded-tl-[140px] overflow-hidden">
              <div className="absolute inset-0 p-6 md:p-8 lg:p-10 pt-10 md:pt-14 lg:pt-16">
                <div className="w-full h-full rounded-[24px] overflow-hidden shadow-2xl relative bg-slate-200 transform translate-y-4 md:translate-y-0 rotate-[-3deg] transition-transform hover:rotate-0 duration-500">
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1760963301666-582b92218a19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3QlMjByZWFsJTIwZXN0YXRlJTIwYnVpbGRlcnxlbnwxfHx8fDE3NzMzNjY1MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080" 
                    alt="Real Estate Professionals"
                    className="absolute inset-0 w-full h-full object-cover scale-[1.05]"
                  />
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
