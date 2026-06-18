import React from "react";
import { Search, ShieldCheck, Briefcase, TrendingUp, Home } from "lucide-react";
import { motion as Motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export const Stats = () => {
  const stats = [
    { label: "Active Listings", value: "15K+", icon: Home, color: "bg-primary text-white", isMain: true },
    { label: "Verified Agents", value: "2,500+", icon: ShieldCheck, color: "bg-rose-50 text-rose-600" },
    { label: "Trusted Professionals", value: "1,200+", icon: Briefcase, color: "bg-slate-50 text-slate-600" },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Header Column */}
          <div className="lg:col-span-5">
            <Motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="sticky top-24"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-8">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary/80">Our Impact</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
                Nigeria’s Fastest Growing <br />
                <span className="text-primary">Property Platform</span>
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-10 max-w-xl">
                We're building the most reliable real estate ecosystem in Africa, connecting millions 
                of seekers with verified properties and trusted professionals.
              </p>
              
              <div className="flex items-center gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100 max-w-sm">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                      <ImageWithFallback src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="font-bold text-slate-900">120K+ Users</div>
                  <div className="text-xs text-slate-500">Trusting Houzii daily</div>
                </div>
              </div>
            </Motion.div>
          </div>

          {/* Stats Grid Column */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stats.map((stat, idx) => (
                <Motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`p-10 rounded-3xl border border-slate-100 transition-all duration-500 group relative overflow-hidden ${
                    stat.isMain ? "md:col-span-2 bg-slate-900 text-white md:py-14" : 
                    idx === 2 ? "bg-accent/5 border-accent/20 shadow-inner" : "bg-white shadow-sm hover:shadow-xl hover:shadow-slate-200/50"
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all group-hover:scale-110 group-hover:rotate-3 duration-300 ${
                    stat.isMain ? "bg-white/10 text-white" : stat.color
                  }`}>
                    <stat.icon className="w-7 h-7" />
                  </div>
                  
                  <div className="relative z-10">
                    <div className={`text-5xl font-bold mb-3 tracking-tight ${stat.isMain ? "text-white" : "text-slate-900"}`}>
                      {stat.value}
                    </div>
                    <div className={`text-lg font-medium ${stat.isMain ? "text-slate-400" : "text-slate-500"}`}>
                      {stat.label}
                    </div>
                  </div>

                  {/* Decorative background icons for the big card */}
                  {stat.isMain && (
                    <div className="absolute top-10 right-10 opacity-10 scale-[3] pointer-events-none">
                      <stat.icon className="w-12 h-12" />
                    </div>
                  )}
                </Motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
