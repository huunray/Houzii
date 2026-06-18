import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, CircleCheck, ShieldCheck } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export const ProfessionalHero = () => {
  return (
    <section className="relative w-full pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-white flex flex-col items-center justify-center">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#7B2D42]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-100/30 rounded-full blur-[100px]" />
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-white/80 shadow-[0_2px_10px_rgb(0,0,0,0.02)] backdrop-blur-md mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <ShieldCheck className="w-4 h-4 text-[#7B2D42]" />
            <span className="text-sm font-semibold text-slate-800">For Real Estate Professionals</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] mb-6 tracking-tight">
            Grow Your Business with <span className="text-[#7B2D42]">Houzii</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
            Join Houzii as a verified professional and connect with property owners, agents, and property seekers who need trusted services.
          </p>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Link to="/professional-onboarding" className="h-14 px-8 rounded-full bg-[#7B2D42] text-white font-semibold text-lg hover:bg-[#5E1F32] transition-colors flex items-center gap-2 shadow-lg shadow-[#7B2D42]/20 w-full sm:w-auto justify-center group">
              Join as a Professional <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="h-14 px-8 rounded-full bg-white text-slate-700 font-semibold text-lg hover:bg-slate-50 border border-slate-200 transition-colors w-full sm:w-auto justify-center shadow-sm">
              See How It Works
            </button>
          </motion.div>

          <motion.div
            className="flex flex-col gap-3 text-left w-full max-w-md mx-auto lg:mx-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {[
              "Connect with property owners and agents",
              "Receive service requests from real clients",
              "Grow your reputation in the real estate ecosystem"
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                  <CircleCheck className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-slate-700 font-medium">{item}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Column - Hero Composition with Glassmorphism */}
        <div className="flex-1 relative w-full h-[500px] lg:h-[600px] flex items-center justify-center lg:justify-end mt-12 lg:mt-0">
          
          {/* Main central image */}
          <motion.div 
            className="absolute z-20 w-[240px] h-[320px] lg:w-[320px] lg:h-[420px] rounded-[24px] overflow-hidden shadow-[0_20px_60px_rgb(0,0,0,0.1)] border-[6px] border-white left-1/2 lg:left-auto lg:right-[10%] top-1/2 -translate-x-1/2 -translate-y-1/2 lg:translate-x-0"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: "-50%" }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1611095777904-271a798ed635?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlJTIwcHJvZmVzc2lvbmFscyUyMG1lZXRpbmclMjBjbGllbnRzJTIwbW9kZXJufGVufDF8fHx8MTc3MzMzNDQyNXww&ixlib=rb-4.1.0&q=80&w=1080" 
              alt="Professional Meeting Clients"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Top Left Floating Image */}
          <motion.div 
            className="absolute z-10 w-[160px] h-[200px] lg:w-[200px] lg:h-[260px] rounded-[24px] overflow-hidden shadow-xl shadow-slate-200/50 border-[4px] border-white left-[5%] lg:left-[5%] top-[10%] lg:top-[5%]"
            initial={{ opacity: 0, x: -30, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1642976975710-1d8890dbf5ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnRlcmlvciUyMGRlc2lnbmVyJTIwbW9kZXJuJTIwaG9tZXxlbnwxfHx8fDE3NzMzMzQ0MjR8MA&ixlib=rb-4.1.0&q=80&w=1080" 
              alt="Interior Designer"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Bottom Left Floating Image */}
          <motion.div 
            className="absolute z-30 w-[180px] h-[220px] lg:w-[220px] lg:h-[280px] rounded-[24px] overflow-hidden shadow-[0_10px_40px_rgb(0,0,0,0.08)] border-[4px] border-white right-[5%] lg:left-[20%] bottom-[5%] lg:bottom-[5%]"
            initial={{ opacity: 0, x: 30, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
          >
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1564846824194-346b7871b855?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXd5ZXIlMjBzaWduaW5nJTIwcHJvcGVydHklMjBkb2N1bWVudHN8ZW58MXx8fHwxNzczMzM0NDI0fDA&ixlib=rb-4.1.0&q=80&w=1080" 
              alt="Legal Professional"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* High-fidelity Glassmorphism Card */}
          <motion.div 
            className="absolute z-40 right-[10%] lg:-right-[5%] top-[60%] lg:top-[30%] w-[240px] p-4 rounded-[24px] bg-white/70 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center gap-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center border border-white shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 leading-tight">Verified Pro</p>
              <p className="text-xs text-slate-500">Trusted by 100+ clients</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};