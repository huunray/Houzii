import React from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export const CityGrid = () => {
  const cities = [
    { name: "Lagos", properties: "5,420", image: "https://images.unsplash.com/photo-1744907895363-d351aa6019ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWdvcyUyMG5pZ2VyaWAlMjBjaXR5JTIwc2t5bGluZSUyMHN1bnNldCUyMG1vZGVybiUyGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzI5ODY0MTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", size: "lg" },
    { name: "Abuja", properties: "3,120", image: "https://images.unsplash.com/photo-1699297843165-0177556e2d25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBhYnVqYSUyMGV4dGVyaW9yJTIwbW9kZXJuJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzcyOTg2NDEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", size: "sm" },
    { name: "Port Harcourt", properties: "1,850", image: "https://images.unsplash.com/photo-1585011191285-8b443579631c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dGlmdWwlMjBmYW1pbHklMjBob21lJTIwbmlnZXJpYSUyMGdhcmRlbiUyMGx1eHVyeXxlbnwxfHx8fDE3NzI5ODY0MDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", size: "sm" },
    { name: "Ibadan", properties: "1,240", image: "https://images.unsplash.com/photo-1628353100822-0229ae96e820?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yJTIwbmlnZXJpYSUyMGx1eHVyeSUyMHByb3BlcnR5fGVufDF8fHx8MTc3Mjk4NjQwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", size: "sm" },
    { name: "Uyo", properties: "980", image: "https://images.unsplash.com/photo-1695684714296-b29348b6dd5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tJTIwbHV4dXJ5JTIwbGFnb3MlMjBob3VzZSUyMGludGVyaW9yfGVufDF8fHx8MTc3Mjk4NjQwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", size: "sm" },
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Explore Properties by <span className="text-primary italic">City</span>
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              Find your next home or investment in Nigeria's most vibrant urban centers. 
              We've curated the best properties in every major hub.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-6 h-[800px] lg:h-[600px]">
          {cities.map((city, idx) => (
            <motion.div
              key={city.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`group relative rounded-[32px] overflow-hidden cursor-pointer ${
                city.size === "lg" ? "lg:col-span-2 lg:row-span-2" : "col-span-1"
              }`}
            >
              <ImageWithFallback
                src={city.image}
                alt={city.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                <div>
                  <h3 className="text-white text-3xl font-bold mb-2">{city.name}</h3>
                  <span className="text-white/70 font-medium">{city.properties} Properties</span>
                </div>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white group-hover:bg-white group-hover:text-primary transition-all duration-300">
                  <ArrowUpRight className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
