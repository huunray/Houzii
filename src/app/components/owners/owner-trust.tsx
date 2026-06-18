import React from "react";
import { motion } from "motion/react";
import { ShieldCheck, CheckCircle } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export const OwnerTrust = () => {
  const features = [
    "Verified property listings",
    "Verified agents and professionals",
    "Transparent communication",
    "Secure transaction processes"
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="bg-[#FFF9FB] rounded-[32px] overflow-hidden flex flex-col lg:flex-row border border-[#7B2D42]/10 shadow-[0_8px_30px_rgb(123,45,66,0.04)]">
          
          {/* Left Content */}
          <div className="flex-1 p-12 lg:p-20 flex flex-col justify-center relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#7B2D42]/5 rounded-full blur-[80px] pointer-events-none" />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
                <ShieldCheck className="w-4 h-4 text-[#7B2D42]" />
                <span className="text-sm font-semibold text-slate-800">Trust & Security</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                A Trusted <span className="text-[#7B2D42]">Property Marketplace</span>
              </h2>
              
              <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">
                We understand the importance of trust in the Nigerian real estate market. Houzii is designed to promote transparency and confidence across every interaction in the property ecosystem.
              </p>
              
              <div className="flex flex-col gap-4">
                {features.map((feature, idx) => (
                  <motion.div 
                    key={idx}
                    className="flex items-center gap-4 bg-white/60 p-4 rounded-xl border border-white backdrop-blur-sm"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="text-slate-800 font-bold">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Right Image */}
          <div className="flex-1 min-h-[400px] lg:min-h-full relative">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1743487014165-c26c868b8186?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3VzZSUyMGtleXMlMjBoYW5kaW5nJTIwb3ZlciUyMHJlYWwlMjBlc3RhdGV8ZW58MXx8fHwxNzczMzM2MDU0fDA&ixlib=rb-4.1.0&q=80&w=1080" 
              alt="Secure Property Transaction"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Gradient overlay for blending */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFF9FB] via-[#FFF9FB]/50 to-transparent lg:w-1/2" />
          </div>

        </div>
      </div>
    </section>
  );
};
