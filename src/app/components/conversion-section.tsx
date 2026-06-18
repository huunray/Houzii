import React from "react";
import { ListPlus, UserCheck, ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export const ConversionSection = () => {
  return (
    <section className="py-32 bg-[#FDF2F5] relative overflow-hidden">
      {/* Decorative architectural lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#7B2D42]/5 to-transparent" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] border border-[#7B2D42]/10 rounded-full" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] border border-[#7B2D42]/10 rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col gap-24 lg:gap-40">
          {/* For Property Owners - Mirrored Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 order-2 lg:order-1"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#7B2D42]/5 rounded-full mb-8">
                <div className="w-2 h-2 rounded-full bg-[#7B2D42]" />
                <span className="text-xs font-bold text-[#7B2D42] uppercase tracking-widest">Property Owners</span>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-8 leading-[1.1] tracking-tight">
                Your Property, <br />
                <span className="text-[#7B2D42] font-serif italic font-normal">Sold or Rented Faster.</span>
              </h2>
              
              <p className="text-slate-500 text-lg md:text-xl leading-relaxed mb-12 max-w-xl">
                Leverage Nigeria's most sophisticated real estate marketing engine to find verified buyers and quality tenants in record time.
              </p>

              <div className="space-y-6 mb-12">
                {[
                  { title: "Premium Visibility", desc: "Featured placement in search results and premium indexing." },
                  { title: "Verified Leads Only", desc: "Our system filters out time-wasters so you only deal with serious intent." }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="w-6 h-6 mt-1 rounded-full bg-[#7B2D42]/10 flex items-center justify-center text-[#7B2D42] group-hover:bg-[#7B2D42] group-hover:text-white transition-colors">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-slate-900 font-bold text-lg block mb-1">{item.title}</span>
                      <p className="text-slate-500 text-sm max-w-md">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-[#7B2D42] text-white px-10 py-5 rounded-full font-bold hover:bg-[#5d2232] transition-all shadow-xl shadow-[#7B2D42]/20 flex items-center justify-center gap-3 active:scale-95">
                  List Your Property
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="bg-white border-2 border-slate-100 text-slate-600 px-10 py-5 rounded-full font-bold hover:bg-slate-50 transition-all flex items-center justify-center">
                  Learn More
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 order-1 lg:order-2 relative"
            >
              <div className="relative z-10 aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1628353100822-0229ae96e820?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtb2Rlcm4lMjBob3VzZSUyMGFyY2hpdGVjdHVyZSUyMG5pZ2VyaWElMjBsYWdvc3xlbnwxfHx8fDE3NzMwODk0NDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Luxury Nigerian Architecture"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>
              
              {/* Floating Stat Overlay */}
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl z-20 hidden md:block border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="bg-[#7B2D42]/10 p-3 rounded-xl text-[#7B2D42]">
                    <ListPlus className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-900 leading-none">12.5k+</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">Active Listings</p>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#7B2D42]/10 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-[#7B2D42]/5 rounded-full blur-3xl -z-10" />
            </motion.div>
          </div>

          {/* For Agents & Professionals - Overlapping Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative z-10 aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1681505526188-b05e68c77582?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZWFsJTIwZXN0YXRlJTIwYWdlbnQlMjBoYW5kc2hha2UlMjBsdXh1cnklMjBvZmZpY2V8ZW58MXx8fHwxNzczMDg5NDQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Real Estate Professional"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Stat Highlight Card */}
              <div className="absolute -bottom-8 -right-4 lg:-right-12 bg-white/95 backdrop-blur-xl p-5 md:p-6 rounded-[24px] shadow-2xl border border-slate-100 flex items-center gap-5 z-20 hover:-translate-y-2 transition-transform duration-500 group">
                <div className="w-14 h-14 rounded-full bg-[#7B2D42]/10 flex items-center justify-center shrink-0 group-hover:bg-[#7B2D42] transition-colors duration-300">
                  <UserCheck className="w-7 h-7 text-[#7B2D42] group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 tracking-tight leading-none mb-1 text-[20px]">120K+</div>
                  <div className="text-sm font-medium text-slate-500">Monthly property seekers</div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#7B2D42]/10 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-[#7B2D42]/5 rounded-full blur-3xl -z-10" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-7"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/5 rounded-full mb-8">
                <div className="w-2 h-2 rounded-full bg-slate-900" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">Agents & Agencies</span>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-8 leading-[1.1] tracking-tight">
                Scale Your Business <br />
                <span className="text-[#7B2D42] font-serif italic font-normal">the Smart Way.</span>
              </h2>
              
              <p className="text-slate-500 text-lg md:text-xl leading-relaxed mb-12 max-w-xl">
                Houzii Pro provides the tools you need to manage listings, track client leads, and close more deals while building a reputable brand in Nigeria's market.
              </p>

              <div className="space-y-6 mb-12">
                {[
                  "Intelligent Lead CRM & Management",
                  "Verified Professional Profile Badge",
                  "Advanced Data Insights & Analytics"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-6 h-6 rounded-full bg-[#7B2D42]/10 flex items-center justify-center text-[#7B2D42] group-hover:bg-[#7B2D42] group-hover:text-white transition-colors">
                      <UserCheck className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-slate-700 font-medium text-lg">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-slate-900 text-white px-10 py-5 rounded-full font-bold hover:bg-black transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-3">
                  Join as an Agent
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="bg-white border-2 border-slate-100 text-slate-600 px-10 py-5 rounded-full font-bold hover:bg-slate-50 transition-all flex items-center justify-center">
                  Learn More
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
