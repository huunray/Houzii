import React from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export const ProfessionalGrid = () => {
  const categories = [
    {
      name: "Lawyers",
      image: "https://images.unsplash.com/photo-1564846824194-346b7871b855?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXd5ZXIlMjBzaWduaW5nJTIwcHJvcGVydHklMjBkb2N1bWVudHN8ZW58MXx8fHwxNzczMzM0NDI0fDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      name: "Surveyors",
      image: "https://images.unsplash.com/photo-1628158145409-9e222b56cc0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5kJTIwc3VydmV5b3IlMjB3b3JraW5nJTIwb3V0ZG9vcnxlbnwxfHx8fDE3NzMzMzQ0MjR8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      name: "Interior Designers",
      image: "https://images.unsplash.com/photo-1642976975710-1d8890dbf5ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnRlcmlvciUyMGRlc2lnbmVyJTIwbW9kZXJuJTIwaG9tZXxlbnwxfHx8fDE3NzMzMzQ0MjR8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      name: "Movers",
      image: "https://images.unsplash.com/photo-1554620158-d8d5c2f3a27b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpbmclMjBjb21wYW55JTIwY2FycnlpbmclMjBib3hlc3xlbnwxfHx8fDE3NzMzMzQ0MjV8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      name: "Property Inspectors",
      image: "https://images.unsplash.com/photo-1760630219436-d8a1e9f950a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9wZXJ0eSUyMGluc3BlY3RvciUyMGNsaXBib2FyZCUyMGhvdXNlfGVufDF8fHx8MTc3MzMzNDQyNXww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      name: "Maintenance Experts",
      image: "https://images.unsplash.com/photo-1722411983889-a3a6321ecf8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWludGVuYW5jZSUyMHdvcmtlciUyMHJlcGFpcmluZyUyMGhvbWV8ZW58MXx8fHwxNzczMzM0NDI1fDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      name: "Cleaning Services",
      image: "https://images.unsplash.com/photo-1758272422155-d898efd14f81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbmluZyUyMHNlcnZpY2UlMjBtb2Rlcm4lMjBob21lfGVufDF8fHx8MTc3MzMzNDQyNXww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      name: "Architects",
      image: "https://images.unsplash.com/photo-1721132537184-5494c01ed87f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3QlMjByZXZpZXdpbmclMjBibHVlcHJpbnRzJTIwb2ZmaWNlfGVufDF8fHx8MTc3MzMzNDQyNXww&ixlib=rb-4.1.0&q=80&w=1080"
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
            Find Opportunities in Your Field
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 font-medium"
          >
            Whatever your specialty, there's a growing demand for your services on Houzii.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              className="group relative h-72 rounded-[24px] overflow-hidden cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <ImageWithFallback 
                src={cat.image} 
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent pointer-events-none" />
              
              <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end">
                <h3 className="text-xl font-bold text-white mb-2">{cat.name}</h3>
                <div className="flex items-center gap-2 text-white/80 text-sm font-medium transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <span>Join as a {cat.name.replace(/s$/, '')}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
