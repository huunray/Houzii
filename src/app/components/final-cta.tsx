import React, { useEffect, useState } from "react";
import { ArrowRight, Search, Sparkles, Activity, Globe, ShieldCheck, Users } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import svgPaths from "../../imports/svg-8t40qc223t.ts";

export const FinalCTA = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const nodes = [
    { label: "Property Owners", icon: Globe, x: -420, y: -220, delay: 0 },
    { label: "Premium Agents", icon: ShieldCheck, x: 240, y: -160, delay: 1.2 },
    { label: "Property Seekers", icon: Users, x: -480, y: 10, delay: 2.4 },
    { label: "Professionals", icon: Activity, x: 240, y: 120, delay: 3.6 },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
          <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-br from-[#1F0D11] via-[#0D0204] to-[#1A0B0E] rounded-2xl overflow-hidden p-12 md:p-24 text-center group border border-white/5 shadow-2xl min-h-[500px] lg:min-h-[600px] flex flex-col items-center justify-center"
        >
          {/* Background Decorative - Midnight Burgundy Vibe */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            
            {/* Ambient Lighting */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#C94B60]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C94B60]/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0D0204] rounded-full blur-[80px] opacity-80" />
            
            {/* The Future of Connection Ecosystem Visualization */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,75,96,0.05)_0%,transparent_70%)]" />
              
              {/* Glassmorphic Nodes representing the Ecosystem */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-6xl">
                {nodes.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      animate={{ 
                        y: [item.y, item.y - 12, item.y],
                        boxShadow: [
                          "0 8px 32px rgba(0,0,0,0.3)",
                          "0 8px 32px rgba(201,75,96,0.15)",
                          "0 8px 32px rgba(0,0,0,0.3)"
                        ]
                      }}
                      transition={{ 
                        duration: 6, 
                        repeat: Infinity, 
                        ease: "easeInOut", 
                        delay: item.delay 
                      }}
                      style={{ left: `calc(50% + ${item.x}px)`, top: `calc(50% + ${item.y}px)` }}
                      className="absolute flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-5 sm:py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex z-20 scale-75 md:scale-100 origin-center"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#C94B60]/20 border border-[#C94B60]/30">
                        <Icon className="w-4 h-4 text-[#C94B60]" />
                      </div>
                      <span className="text-xs font-semibold text-white/90 tracking-wide">{item.label}</span>
                      
                      {/* Node Pulse Effect */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl border border-[#C94B60]"
                        initial={{ opacity: 0, scale: 1 }}
                        animate={{ opacity: [0, 0.5, 0], scale: [1, 1.15, 1.3] }}
                        transition={{ duration: 3, repeat: Infinity, delay: item.delay }}
                      />
                    </motion.div>
                  );
                })}

                {/* Central Hub Node */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  animate={{
                     boxShadow: [
                      "0 0 40px rgba(201,75,96,0.2)",
                      "0 0 80px rgba(201,75,96,0.4)",
                      "0 0 40px rgba(201,75,96,0.2)"
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-[#C94B60]/20 bg-[#C94B60]/5 backdrop-blur-3xl flex items-center justify-center z-10"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#C94B60] to-[#E86A80] flex items-center justify-center shadow-[0_0_30px_rgba(201,75,96,0.5)]">
                    <svg viewBox="0 -2 423 464" className="w-8 h-8 fill-white" aria-hidden="true">
                      <path d={svgPaths.p37228200} />
                    </svg>
                  </div>
                </motion.div>

                {/* SVG Connecting Lines and Data Particles */}
                {mounted && (
                  null
                )}
              </div>
            </div>
          </div>

          <div className="relative z-30 max-w-4xl mx-auto flex flex-col items-center">
             <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/5 rounded-2xl backdrop-blur-md border border-white/10 mb-10 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
                <Sparkles className="w-4 h-4 text-[#C94B60]" />
                <span className="text-xs font-bold uppercase tracking-widest text-white/90">The Future of Connections</span>
              </div>
            
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight font-urbanist">
              Where Nigeria’s Real Estate <br />
              Ecosystem <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#C94B60] to-white italic">
                Comes Together
              </span>
            </h2>
            <p className="text-white/60 text-lg md:text-xl mb-14 max-w-2xl mx-auto leading-relaxed font-urbanist">
              Houzii bridges the gap between owners, agents, and buyers. Join over 120,000 users 
              defining the new architectural standard for real estate in Nigeria.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-white text-[#0D0204] px-10 py-5 rounded-full font-bold hover:bg-slate-100 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2 text-lg font-urbanist">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="w-full sm:w-auto bg-white/5 backdrop-blur-sm text-white border border-white/20 px-10 py-5 rounded-full font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-lg font-urbanist">
                <Search className="w-5 h-5" />
                Explore Properties
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
