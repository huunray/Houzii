import React, { forwardRef } from 'react';
import { motion } from 'motion/react';
import { Star, MapPin, ShieldCheck, Phone, User } from 'lucide-react';
import { Professional } from '../../data';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface ProfessionalCardProps {
  professional: Professional;
  onContact: (id: number) => void;
  onViewProfile: (id: number) => void;
}

export const ProfessionalCard = forwardRef<HTMLDivElement, ProfessionalCardProps>(({ 
  professional, 
  onContact, 
  onViewProfile 
}, ref) => {
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -8 }}
      className="group relative bg-white/80 backdrop-blur-xl border border-white/20 rounded-[24px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_48px_rgba(123,45,66,0.12)] transition-all duration-500 flex flex-col h-full"
    >
      {/* Featured Badge */}
      {professional.featured && (
        <div className="absolute top-4 left-4 z-10 bg-[#7B2D42] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-1">
          <Star className="w-3 h-3 fill-current" />
          Featured
        </div>
      )}

      {/* Verified Badge */}
      {professional.verified && (
        <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-md p-1.5 rounded-full shadow-md border border-white/50">
          <ShieldCheck className="w-4 h-4 text-green-500" />
        </div>
      )}

      {/* Image Section */}
      <div className="relative aspect-[3/2] overflow-hidden bg-slate-100">
        <ImageWithFallback
          src={professional.image}
          alt={professional.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
          <span className="text-white text-[10px] font-bold bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/30 uppercase tracking-wider">
            {professional.yearsOfExperience}+ Years Experience
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-3">
          <div className="flex items-center gap-1.5 text-[#7B2D42] mb-2">
            <span className="text-[9px] font-black uppercase tracking-[0.15em] bg-[#7B2D42]/10 px-2 py-0.5 rounded-md">
              {professional.category}
            </span>
          </div>
          <h3 className="text-[18px] font-bold text-slate-900 group-hover:text-[#7B2D42] transition-colors duration-300 line-clamp-1">
            {professional.name}
          </h3>
          <p className="text-xs text-slate-500 font-bold">{professional.title}</p>
        </div>

        <div className="flex items-center gap-4 mb-3 pb-3 border-b border-slate-50">
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-xs font-bold text-slate-900">{professional.rating}</span>
            <span className="text-[10px] text-slate-400 font-bold">({professional.reviews})</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">{professional.location}</span>
          </div>
        </div>

        <div className="mb-5 flex-1">
          <div className="flex flex-wrap gap-1.5">
            {professional.services.slice(0, 2).map((service, index) => (
              <span 
                key={index}
                className="text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md"
              >
                {service}
              </span>
            ))}
            {professional.services.length > 2 && (
              <span className="text-[10px] font-bold text-slate-400 px-1">+ {professional.services.length - 2} more</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <button
            onClick={() => onViewProfile(professional.id)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 hover:border-[#7B2D42]/30 hover:text-[#7B2D42] transition-all duration-300"
          >
            <User className="w-3.5 h-3.5" />
            Profile
          </button>
          <button
            onClick={() => onContact(professional.id)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#7B2D42] text-white text-xs font-bold hover:bg-[#5E1F32] shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Phone className="w-3.5 h-3.5" />
            Contact
          </button>
        </div>
      </div>
    </motion.div>
  );
});

ProfessionalCard.displayName = 'ProfessionalCard';
