import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Tag, Key, CalendarClock, BriefcaseBusiness } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export const OwnerOptions = () => {
  const options = [
    {
      icon: Tag,
      title: "Sell Your Property",
      description: "Reach verified buyers actively searching for homes and investments.",
      image: "https://images.unsplash.com/photo-1563002543-b217d7fddab5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlJTIwZm9yJTIwc2FsZSUyMHNpZ258ZW58MXx8fHwxNzczMzM2MDY1fDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      icon: Key,
      title: "Rent to Tenants",
      description: "Find reliable tenants and manage rental inquiries easily.",
      image: "https://images.unsplash.com/photo-1639663742190-1b3dba2eebcf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtb2Rlcm4lMjBsaXZpbmclMjByb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzczMzA5NjQxfDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      icon: CalendarClock,
      title: "Shortlet Your Property",
      description: "Turn your property into a short-stay rental and earn recurring income.",
      image: "https://images.unsplash.com/photo-1628744448838-c04e09b1ba03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBob21lJTIwZXh0ZXJpb3IlMjBmcm9udCUyMHZpZXd8ZW58MXx8fHwxNzczMzM2MDU0fDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      icon: BriefcaseBusiness,
      title: "Work With Agents",
      description: "Partner with experienced agents who can help market and close deals.",
      image: "https://images.unsplash.com/photo-1594611342013-27c44e25625f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFraW5nJTIwaGFuZHMlMjByZWFsJTIwZXN0YXRlJTIwZGVhbHxlbnwxfHx8fDE3NzMzMzYwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
    }
  ];

  return (
    <section className="py-24 bg-[#FAFAFA] relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6"
          >
            Choose How You Want to <span className="text-[#7B2D42]">Monetize Your Property</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {options.map((option, idx) => {
            const Icon = option.icon;
            return (
              <motion.div
                key={idx}
                className="group relative h-[320px] rounded-[24px] overflow-hidden cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <ImageWithFallback 
                  src={option.image} 
                  alt={option.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Lighter solid dark overlay for overall readability */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-700 pointer-events-none" />
                {/* Bottom gradient for strong text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent pointer-events-none" />
                
                <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end z-10">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center mb-4 text-white">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{option.title}</h3>
                  <p className="text-white/90 font-medium leading-relaxed mb-4 max-w-md">
                    {option.description}
                  </p>
                  <div className="flex items-center gap-2 text-white text-sm font-bold transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <span>Explore Option</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
