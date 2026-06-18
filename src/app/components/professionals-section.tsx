import React from "react";
import { Gavel, Ruler, Palette, Truck, Brush, Wrench, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export const ProfessionalsSection = () => {
  const categories = [
    { name: "Legal", icon: Gavel, color: "bg-blue-50 text-blue-600" },
    { name: "Survey", icon: Ruler, color: "bg-orange-50 text-orange-600" },
    { name: "Interior", icon: Palette, color: "bg-purple-50 text-purple-600" },
    { name: "Repairs", icon: Wrench, color: "bg-indigo-50 text-indigo-600" },
    { name: "Cleaning", icon: Brush, color: "bg-rose-50 text-rose-600" },
    { name: "Moving", icon: Truck, color: "bg-green-50 text-green-600" },
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 w-full lg:max-w-xl order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[4/5] md:aspect-[3/4] md:max-h-[736px] rounded-[40px] overflow-hidden group shadow-2xl shadow-slate-200"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1742094561255-18506fba7a48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBsYXd5ZXIlMjBzdXJ2ZXlvciUyMGFyY2hpdGVjdCUyMHdvcmtpbmclMjBhdCUyMGRlc2t8ZW58MXx8fHwxNzcyOTg2NDA5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Trusted Professionals"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-md p-8 rounded-[32px] shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" />
                      </div>
                    ))}
                  </div>
                  <span className="text-sm font-bold text-slate-900">2.5k+ Vetted Pros</span>
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2 italic">"The smoothest legal verification process I've ever had."</h4>
                <p className="text-slate-500 text-sm">— Dr. Olumide A., Property Investor</p>
              </div>
            </motion.div>
          </div>

          <div className="flex-1 max-w-2xl order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
                Hire Trusted <span className="text-primary">Property Professionals</span>
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-12">
                Real estate is a team sport. From verifying land titles to interior design, 
                Houzii connects you with top-tier professionals who specialize 
                in the Nigerian property market.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
                {categories.map((cat, idx) => (
                  <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all hover:-translate-y-1 group"
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300 ${cat.color}`}>
                      <cat.icon className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-slate-800">{cat.name}</span>
                  </motion.div>
                ))}
              </div>

              <button className="bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 flex items-center gap-2 group">
                Find Professionals
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
