import React from "react";
import { Bed, Bath, MapPin, Heart, Share2, Sparkles, ArrowRight, Map } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export const PropertyGrid = () => {
  const [activeTab, setActiveTab] = React.useState("For Sale");
  
  const tabs = ["For Sale", "For Rent", "Shortlet"];

  const properties = [
    // --- FOR SALE (3 items) ---
    {
      id: 1,
      title: "Luxury 5-Bedroom Duplex with Pool",
      location: "Lekki Phase 1, Lagos",
      price: "₦180,000,000",
      beds: 5,
      baths: 6,
      type: "Duplex",
      category: "For Sale",
      tag: "Verified",
      image: "https://images.unsplash.com/photo-1695684714296-b29348b6dd5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tJTIwbHV4dXJ5JTIwbGFnb3MlMjBob3VzZSUyMGludGVyaW9yfGVufDF8fHx8MTc3Mjk4NjQwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 2,
      title: "Contemporary 4-Bedroom Semi-Detached",
      location: "G.R.A Phase 2, Port Harcourt",
      price: "₦120,000,000",
      beds: 4,
      baths: 5,
      type: "Semi-Detached",
      category: "For Sale",
      tag: "Hot Deal",
      image: "https://images.unsplash.com/photo-1585011191285-8b443579631c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dGlmdWwlMjBmYW1pbHklMjBob21lJTIwbmlnZXJpYSUyMGdhcmRlbiUyMGx1eHVyeXxlbnwxfHx8fDE3NzI5ODY0MDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 3,
      title: "Exquisite 6-Bedroom Smart Villa",
      location: "Banana Island, Lagos",
      price: "₦950,000,000",
      beds: 6,
      baths: 7,
      type: "Villa",
      category: "For Sale",
      tag: "Exclusive",
      image: "https://images.unsplash.com/photo-1622015663381-d2e05ae91b72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjB2aWxsYSUyMGV4dGVyaW9yfGVufDF8fHx8MTc3MzAwMjgwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },

    // --- FOR RENT (3 items) ---
    {
      id: 4,
      title: "Ultra-Modern 3-Bedroom Penthouse",
      location: "Maitama, Abuja",
      price: "₦15,000,000/yr",
      beds: 3,
      baths: 4,
      type: "Penthouse",
      category: "For Rent",
      tag: "Premium",
      image: "https://images.unsplash.com/photo-1699297843165-0177556e2d25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBhYnVqYSUyMGV4dGVyaW9yJTIwbW9kZXJuJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzcyOTg2NDEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 5,
      title: "Executive 4-Bedroom Detached House",
      location: "Ikoyi, Lagos",
      price: "₦25,000,000/yr",
      beds: 4,
      baths: 5,
      type: "Detached House",
      category: "For Rent",
      tag: "Verified",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1080&auto=format&fit=crop",
    },
    {
      id: 6,
      title: "Luxury 2-Bedroom High-Rise Apartment",
      location: "Eko Atlantic City, Lagos",
      price: "₦12,000,000/yr",
      beds: 2,
      baths: 3,
      type: "Apartment",
      category: "For Rent",
      tag: "New",
      image: "https://images.unsplash.com/photo-1664892798972-079f15663b16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBhcGFydG1lbnQlMjBidWlsZGluZ3xlbnwxfHx8fDE3NzMwNjQ0NTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },

    // --- SHORTLET (3 items) ---
    {
      id: 7,
      title: "Luxury 2-Bedroom Shortlet Apartment",
      location: "Victoria Island, Lagos",
      price: "₦150,000/night",
      beds: 2,
      baths: 2,
      type: "Apartment",
      category: "Shortlet",
      tag: "Verified",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1080&auto=format&fit=crop",
    },
    {
      id: 8,
      title: "Cozy 1-Bedroom Studio with City View",
      location: "Wuse II, Abuja",
      price: "₦80,000/night",
      beds: 1,
      baths: 1,
      type: "Studio",
      category: "Shortlet",
      tag: "Top Rated",
      image: "https://images.unsplash.com/photo-1759264244827-1dde5bee00a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwbGl2aW5nJTIwcm9vbSUyMGx1eHVyeSUyMGFwYXJ0bWVudHxlbnwxfHx8fDE3NzMwOTg0MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 9,
      title: "Premium 3-Bedroom Getaway Suite",
      location: "Lekki Phase 1, Lagos",
      price: "₦200,000/night",
      beds: 3,
      baths: 3,
      type: "Suite",
      category: "Shortlet",
      tag: "Trending",
      image: "https://images.unsplash.com/photo-1640109414028-4c7f29f39ad4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWRyb29tJTIwaW50ZXJpb3IlMjBsdXh1cnl8ZW58MXx8fHwxNzczMDk4NDIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    }
  ];

  const filteredProperties = properties.filter(p => p.category === activeTab);

  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
              Featured Properties
            </h2>
            <p className="text-slate-500 text-lg">
              Carefully curated listings from verified sellers. Discover high-quality homes 
              in the most desirable neighborhoods across Nigeria.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          {/* Dynamic Filtering Tabs */}
          <div className="inline-flex bg-slate-100 p-1 rounded-full max-w-full overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  activeTab === tab 
                    ? "bg-primary text-white shadow-sm" 
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab === "For Sale" ? "Buy" : tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a href="/explore" className="flex items-center gap-2 text-primary font-bold group cursor-pointer">
              Explore More Properties
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Properties Grid */}
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((prop, idx) => (
            <motion.div
              key={prop.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-md hover:shadow-2xl hover:shadow-slate-200/50 transition-all hover:-translate-y-1.5"
            >
              <div className="relative aspect-[3/2] overflow-hidden">
                <ImageWithFallback
                  src={prop.image}
                  alt={prop.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 bg-white px-3 py-1.5 rounded-full shadow-md border border-slate-100">
                  <span className="text-[10px] font-bold text-primary flex items-center gap-1 uppercase tracking-wide">
                    <Sparkles className="w-3 h-3 fill-primary/20" />
                    {prop.tag}
                  </span>
                </div>
                <div className="absolute top-3 right-3 flex gap-2">
                  <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-600 hover:text-red-500 transition-colors shadow-md border border-slate-100">
                    <Heart className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-600 hover:text-primary transition-colors shadow-md border border-slate-100">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-1.5 text-slate-500 mb-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{prop.location}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors line-clamp-1">
                  {prop.title}
                </h3>
                
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Bed className="w-4 h-4" />
                      <span className="text-sm font-semibold">{prop.beds} <span className="font-normal text-xs text-slate-500">Beds</span></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Bath className="w-4 h-4" />
                      <span className="text-sm font-semibold">{prop.baths} <span className="font-normal text-xs text-slate-500">Baths</span></span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-2.5 py-1 rounded-md">
                    {prop.type}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xl font-black text-slate-900 leading-none">{prop.price}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};