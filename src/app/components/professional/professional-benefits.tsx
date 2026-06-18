import React from "react";
import { motion } from "motion/react";
import { Users, TrendingUp, ShieldCheck, BriefcaseBusiness, Star } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export const ProfessionalBenefits = () => {
  const benefits = [
    {
      icon: Users,
      title: "Lead Generation",
      description: "Receive service requests from property owners and clients actively looking for help."
    },
    {
      icon: TrendingUp,
      title: "Grow Your Client Base",
      description: "Reach thousands of users across the Houzii marketplace."
    },
    {
      icon: ShieldCheck,
      title: "Build Trust With Verification",
      description: "Get a verified professional badge that builds credibility with clients."
    },
    {
      icon: BriefcaseBusiness,
      title: "Showcase Your Work",
      description: "Create a professional profile with services, experience, and portfolio."
    },
    {
      icon: Star,
      title: "Receive Reviews and Ratings",
      description: "Build your reputation through client feedback."
    }
  ];

  return (
    <section className="py-24 bg-[#FFF9FB] relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#7B2D42]/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left Side: Images */}
          <div className="flex-1 w-full relative h-[600px] hidden lg:block">
            <motion.div 
              className="absolute left-0 top-[10%] w-[320px] h-[400px] rounded-[24px] overflow-hidden shadow-2xl border-4 border-white z-10"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1721132537184-5494c01ed87f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3QlMjByZXZpZXdpbmclMjBibHVlcHJpbnRzJTIwb2ZmaWNlfGVufDF8fHx8MTc3MzMzNDQyNXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Architect"
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            <motion.div 
              className="absolute right-[5%] bottom-[10%] w-[280px] h-[340px] rounded-[24px] overflow-hidden shadow-2xl border-4 border-white z-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1628158145409-9e222b56cc0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5kJTIwc3VydmV5b3IlMjB3b3JraW5nJTIwb3V0ZG9vcnxlbnwxfHx8fDE3NzMzMzQ0MjR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Surveyor"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Floating verified badge */}
            <motion.div 
              className="absolute left-[50%] top-[40%] bg-white/80 backdrop-blur-md p-4 rounded-[24px] shadow-xl border border-white z-30 flex items-center gap-3"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <Star className="w-5 h-5 text-emerald-600 fill-current" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">4.9/5 Rating</p>
                <p className="text-xs text-slate-500">Based on 120 reviews</p>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Content */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 leading-tight text-slate-900">
                Turn Your Expertise Into <span className="text-[#7B2D42]">More Opportunities</span>
              </h2>
              
              <div className="flex flex-col gap-6">
                {benefits.map((benefit, idx) => (
                  <motion.div 
                    key={idx} 
                    className="flex gap-5 items-start p-4 rounded-[24px] hover:bg-white/60 transition-colors border border-transparent hover:border-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                  >
                    <div className="w-14 h-14 rounded-[20px] bg-white shadow-sm border border-slate-100 flex flex-shrink-0 items-center justify-center">
                      <benefit.icon className="w-6 h-6 text-[#7B2D42]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1">{benefit.title}</h3>
                      <p className="text-base text-slate-600 leading-relaxed font-medium">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
};
