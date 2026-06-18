import React from "react";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle, Home } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useNavigate } from "react-router-dom";

export const OwnerHero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-[#FAFAFA] flex flex-col items-center justify-center">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#7B2D42]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/30 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        
        {/* Left Column - Content */}
        <motion.div 
          className="flex-1 max-w-2xl text-center lg:text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-white shadow-[0_2px_10px_rgb(0,0,0,0.02)] backdrop-blur-md mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Home className="w-4 h-4 text-[#7B2D42]" />
            <span className="text-sm font-semibold text-slate-800">For Property Owners</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] mb-6 tracking-tight">
            List Your Property. Reach <span className="text-[#7B2D42]">Serious Buyers</span> and Tenants.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
            Houzii connects property owners with verified buyers, tenants, and trusted agents across Nigeria. List your property, manage inquiries, and close deals faster.
          </p>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <button
              onClick={() => navigate('/owner-onboarding')}
              className="h-14 px-8 rounded-full bg-[#7B2D42] text-white font-semibold text-lg hover:bg-[#5E1F32] transition-colors flex items-center gap-2 shadow-lg shadow-[#7B2D42]/20 w-full sm:w-auto justify-center group">
              List Your Property <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="h-14 px-8 rounded-full bg-white text-slate-700 font-semibold text-lg hover:bg-slate-50 border border-slate-200 transition-colors w-full sm:w-auto justify-center shadow-sm">
              Speak to an Agent
            </button>
          </motion.div>

          <motion.div
            className="flex flex-col gap-3 text-left w-full max-w-md mx-auto lg:mx-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {[
              "Verified buyers and tenants",
              "Trusted real estate agents",
              "Secure transactions"
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-slate-700 font-medium">{item}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Column - Hero Composition */}
        <div className="flex-1 relative w-full h-[500px] lg:h-[600px] flex items-center justify-center lg:justify-end mt-12 lg:mt-0">
          
          {/* Main central image */}
          <motion.div 
            className="absolute z-20 w-[260px] h-[340px] lg:w-[340px] lg:h-[440px] rounded-[24px] overflow-hidden shadow-[0_20px_60px_rgb(0,0,0,0.1)] border-[6px] border-white left-1/2 lg:left-auto lg:right-[5%] top-1/2 -translate-x-1/2 -translate-y-1/2 lg:translate-x-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1628744448838-c04e09b1ba03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBob21lJTIwZXh0ZXJpb3IlMjBmcm9udCUyMHZpZXd8ZW58MXx8fHwxNzczMzM2MDU0fDA&ixlib=rb-4.1.0&q=80&w=1080" 
              alt="Modern Luxury Home"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Bottom Left Floating Image */}
          <motion.div 
            className="absolute z-30 w-[180px] h-[220px] lg:w-[220px] lg:h-[280px] rounded-[24px] overflow-hidden shadow-[0_10px_40px_rgb(0,0,0,0.08)] border-[4px] border-white right-[15%] lg:left-[10%] bottom-[5%] lg:bottom-[5%]"
            initial={{ opacity: 0, x: -30, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1624890754543-187d8778413d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwcHJvcGVydHklMjBvd25lciUyMHNtaWxpbmclMjBob3VzZXxlbnwxfHx8fDE3NzMzMzYwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080" 
              alt="Property Owner"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* High-fidelity Glassmorphism Card */}
          <motion.div 
            className="absolute z-40 right-[5%] lg:right-[20%] top-[10%] lg:top-[15%] w-[220px] p-4 rounded-[20px] bg-white/80 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center border border-white shadow-sm">
              <span className="text-xl font-bold text-emerald-600">₦</span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 leading-tight">Offer Received</p>
              <p className="text-xs text-slate-500">Just now</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};