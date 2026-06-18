import React from "react";
import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

export interface PlanFeature {
  text: string;
}

export interface Plan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: PlanFeature[];
  ctaText: string;
  isPopular?: boolean;
}

interface SubscriptionSectionProps {
  title?: string;
  subtitle?: string;
  plans: Plan[];
  theme?: "light" | "dark";
}

export const SubscriptionSection: React.FC<SubscriptionSectionProps> = ({
  title = "Plans Built for Your Growth",
  subtitle = "Choose the right plan to accelerate your success on Houzii.",
  plans,
  theme = "dark",
}) => {
  const isDarkSection = theme === "dark";

  return (
    <section className={`py-24 relative overflow-hidden ${isDarkSection ? "bg-[#0A0613]" : "bg-[#FAFAFA]"}`}>
      {/* Background Decor */}
      {isDarkSection ? (
        <>
          <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#7B2D42]/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#7B2D42]/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#7B2D42]/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[100px] pointer-events-none" />
        </>
      )}

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight ${isDarkSection ? "text-white" : "text-slate-900"}`}
          >
            {title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ${isDarkSection ? "text-white/70" : "text-slate-600"}`}
          >
            {subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => {
            const isHighlight = plan.isPopular;
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className={`relative rounded-[24px] p-8 md:p-10 transition-all duration-500 flex flex-col h-full ${
                  isHighlight
                    ? "bg-[#1A1225] text-white shadow-[0_30px_60px_rgb(0,0,0,0.3)] md:-translate-y-4 border border-white/10 z-10"
                    : isDarkSection
                      ? "bg-white/5 backdrop-blur-md text-white border border-white/10 hover:bg-white/10"
                      : "bg-white text-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]"
                }`}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#7B2D42] text-white px-5 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-xl shadow-[#7B2D42]/40 whitespace-nowrap z-20">
                    <span className="text-lg">⭐</span> Most Popular
                  </div>
                )}

                {/* Glassmorphic internal pattern for highlight card */}
                {isHighlight && (
                  <>
                    <div className="absolute inset-0 opacity-20 pointer-events-none rounded-[24px]" 
                      style={{ 
                        backgroundImage: 'radial-gradient(circle at 2px 2px, #7B2D42 1px, transparent 0)', 
                        backgroundSize: '32px 32px' 
                      }} 
                    />
                    <div className="absolute inset-0 pointer-events-none rounded-[24px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#7B2D42]/20 via-transparent to-transparent" />
                  </>
                )}

                <div className="relative z-10 flex flex-col h-full">
                  <div className="mb-8">
                    <h3 className={`text-2xl font-bold mb-4 ${isHighlight || isDarkSection ? "text-white" : "text-slate-900"}`}>
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className={`text-4xl md:text-5xl font-bold ${isHighlight || isDarkSection ? "text-white" : "text-slate-900"}`}>
                        {plan.price}
                      </span>
                      {plan.price !== "Free" && (
                        <span className={`text-sm font-medium ${isHighlight || isDarkSection ? "text-white/50" : "text-slate-500"}`}>
                          /month
                        </span>
                      )}
                    </div>
                    <p className={`text-base leading-relaxed ${isHighlight || isDarkSection ? "text-white/70" : "text-slate-500"}`}>
                      {plan.description}
                    </p>
                  </div>

                  <div className={`w-full h-px mb-8 ${isHighlight || isDarkSection ? "bg-white/10" : "bg-slate-100"}`} />

                  <ul className="space-y-4 mb-10 flex-grow">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3">
                        <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${isHighlight ? "bg-[#7B2D42] text-white" : "bg-[#7B2D42]/20 text-[#7B2D42]"}`}>
                          <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={3} />
                        </div>
                        <span className={`text-sm font-medium ${isHighlight || isDarkSection ? "text-white/90" : "text-slate-700"}`}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    className={`w-full h-14 rounded-full font-bold text-base transition-all duration-300 flex items-center justify-center shadow-lg ${
                      isHighlight 
                        ? "bg-white text-[#0A0613] hover:bg-[#FAFAFA] hover:scale-[1.02] active:scale-[0.98] shadow-white/5" 
                        : isDarkSection
                          ? "bg-[#7B2D42] text-white hover:bg-[#8e354d] hover:scale-[1.02] active:scale-[0.98] shadow-[#7B2D42]/20"
                          : "bg-[#7B2D42] text-white hover:bg-[#5E1F32] hover:scale-[1.02] active:scale-[0.98] shadow-[#7B2D42]/20"
                    }`}
                  >
                    {plan.ctaText}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
