import React from "react";
import { motion } from "motion/react";
import { ChevronRight, LayoutList, BellRing, MessageSquare, Star } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export const ProfessionalTools = () => {
  const features = [
    {
      title: "Service Listings",
      icon: LayoutList,
      description: "Showcase the services you offer and the areas you operate in."
    },
    {
      title: "Request Management",
      icon: BellRing,
      description: "Receive and manage incoming service requests effortlessly."
    },
    {
      title: "Client Communication",
      icon: MessageSquare,
      description: "Communicate directly with clients through our secure platform."
    },
    {
      title: "Reputation System",
      icon: Star,
      description: "Earn reviews and ratings that help you attract more clients."
    }
  ];

  return (
    <section className="py-24 bg-[#0A0613] relative overflow-hidden">
      {/* Dark Theme Layered Aesthetic Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#7B2D42]/10 to-transparent pointer-events-none z-0" />
      <div className="absolute -left-40 top-40 w-80 h-80 bg-[#7B2D42]/20 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute right-20 bottom-20 w-96 h-96 bg-[#C94B60]/10 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left Side: Content */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 shadow-sm mb-6 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#C94B60] animate-pulse"></span>
                <span className="text-sm font-semibold text-slate-200">Business Management</span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-white">
                Tools to Help You Manage Your <span className="text-[#C94B60]">Service Business</span>
              </h2>
              <p className="text-lg text-slate-300 mb-10 leading-relaxed max-w-xl font-medium">
                Our platform provides you with everything you need to showcase your work, handle requests, and keep clients satisfied in one unified workspace.
              </p>

              <div className="grid sm:grid-cols-2 gap-8 mb-10">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex gap-4 items-start bg-white/5 p-4 rounded-[24px] border border-white/10 backdrop-blur-sm shadow-[0_4px_20px_rgb(0,0,0,0.2)] transition-all hover:bg-white/10">
                    <div className="w-12 h-12 rounded-full bg-white/5 shadow-sm border border-white/10 flex flex-shrink-0 items-center justify-center">
                      <feature.icon className="w-5 h-5 text-[#C94B60]" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white mb-1">{feature.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed font-medium">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="h-14 px-8 rounded-full bg-[#7B2D42] text-white font-semibold text-lg hover:bg-[#C94B60] transition-colors flex items-center gap-2 shadow-lg shadow-[#7B2D42]/20 w-full sm:w-auto justify-center group">
                Explore Professional Tools <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>

          {/* Right Side: Dashboard Mockup */}
          <motion.div 
            className="flex-1 w-full"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              {/* Glassmorphic Decorative Frame */}
              <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-[24px] border border-white/10 transform translate-x-4 translate-y-4 shadow-2xl shadow-black/50" />
              
              <div className="relative rounded-[24px] overflow-hidden border border-slate-700 bg-[#120b10] shadow-2xl shadow-black/60 p-2">
                {/* Mockup Header */}
                <div className="h-10 bg-[#1a1219] rounded-t-[20px] flex items-center px-4 gap-2 mb-2 border-b border-slate-800/50">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                
                {/* Image replacing the raw laptop */}
                <div className="rounded-[16px] overflow-hidden border border-slate-800">
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1758876202980-0a28b744fb24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXNoYm9hcmQlMjBsYXB0b3AlMjBhbmFseXRpY3MlMjBtb2Rlcm58ZW58MXx8fHwxNzczMzI4OTUzfDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Professional CRM Dashboard"
                    className="w-full h-auto aspect-[4/3] object-cover opacity-90"
                  />
                </div>
              </div>

              {/* Floating UI Element - Glassmorphism */}
              <motion.div 
                className="absolute bottom-10 -left-6 bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.5)] hidden md:flex items-center gap-4 z-20"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/20">
                  <BellRing className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">New Request</p>
                  <p className="text-slate-400 text-xs">Interior Design for 3BR duplex</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
