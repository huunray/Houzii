import React from "react";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle, Star } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useNavigate } from "react-router-dom";

export const AgentHero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative w-full pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-white flex flex-col items-center justify-center">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#7B2D42]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#7B2D42]/10 rounded-full blur-3xl" />
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-white/80 shadow-sm backdrop-blur-md mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Star className="w-4 h-4 text-[#7B2D42] fill-current" />
            <span className="text-sm font-medium text-slate-800">For Real Estate Professionals</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] mb-6 tracking-tight">
            Grow Your Real Estate Business with <span className="text-[#7B2D42]">Houzii</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Join Houzii to connect with property buyers, tenants, and property owners actively looking for trusted real estate professionals.
          </p>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <button 
              onClick={() => navigate('/agent-onboarding')}
              className="h-14 px-8 rounded-full bg-[#7B2D42] text-white font-semibold text-lg hover:bg-[#5E1F32] transition-colors flex items-center gap-2 shadow-lg shadow-[#7B2D42]/20 w-full sm:w-auto justify-center">
              Join as an Agent <ArrowRight className="w-5 h-5" />
            </button>
            <button className="h-14 px-8 rounded-full bg-white text-slate-700 font-semibold text-lg hover:bg-slate-50 border border-slate-200 transition-colors w-full sm:w-auto justify-center">
              Learn How It Works
            </button>
          </motion.div>

          <motion.div
            className="flex flex-col gap-3 text-left w-full max-w-md mx-auto lg:mx-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {[
              "Access qualified property leads",
              "Manage listings and clients in one place",
              "Close deals faster with Houzii tools"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[#7B2D42] shrink-0" />
                <span className="text-slate-700 font-medium">{item}</span>
              </div>
            ))}
          </motion.div>

        </motion.div>

        {/* Right Column - People-Centered Composition with Glassmorphism */}
        <div className="flex-1 relative w-full h-[500px] lg:h-[600px] flex items-center justify-center lg:justify-end mt-12 lg:mt-0">
          
          {/* Main central image */}
          <motion.div 
            className="absolute z-20 w-[240px] h-[320px] lg:w-[300px] lg:h-[400px] rounded-[24px] overflow-hidden shadow-2xl shadow-slate-200/50 border-[6px] border-white left-1/2 lg:left-auto lg:right-[15%] top-1/2 -translate-x-1/2 -translate-y-1/2 lg:translate-x-0"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: "-50%" }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1080" 
              alt="Happy Real Estate Agent"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Top Left Floating Image */}
          <motion.div 
            className="absolute z-10 w-[160px] h-[200px] lg:w-[200px] lg:h-[260px] rounded-[24px] overflow-hidden shadow-xl shadow-slate-200/50 border-[4px] border-white left-[5%] lg:left-[10%] top-[10%] lg:top-[5%]"
            initial={{ opacity: 0, x: -30, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1080" 
              alt="Smiling African Woman Agent"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Bottom Right Floating Image */}
          <motion.div 
            className="absolute z-30 w-[180px] h-[220px] lg:w-[220px] lg:h-[280px] rounded-[24px] overflow-hidden shadow-xl shadow-slate-200/50 border-[4px] border-white right-[5%] lg:-right-[5%] bottom-[5%] lg:bottom-[10%]"
            initial={{ opacity: 0, x: 30, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
          >
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=1080" 
              alt="Real Estate Agent"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* High-fidelity Glassmorphism Card */}
          <motion.div 
            className="absolute z-40 left-1/2 lg:left-auto lg:right-[30%] bottom-[15%] lg:bottom-[25%] -translate-x-1/2 lg:translate-x-0 w-[240px] p-4 rounded-[24px] bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl flex items-center gap-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <div className="w-12 h-12 rounded-full bg-[#7B2D42] text-white flex items-center justify-center font-bold text-lg shadow-inner">
              5k+
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 leading-tight">Active Leads</p>
              <p className="text-xs text-slate-600">Generated this month</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};