import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Filter, X, SlidersHorizontal, Check } from 'lucide-react';

interface ProfessionalFiltersProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  activeFilters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

const FILTER_CONFIG = {
  'Rating': ['4.5 & up', '4.0 & up', '3.5 & up'],
  'Experience': ['0-2 Years', '3-5 Years', '5-10 Years', '10+ Years'],
  'Verified': ['Verified Only', 'All Professionals'],
  'Location': ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Enugu']
};

export const ProfessionalFilters: React.FC<ProfessionalFiltersProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  activeFilters,
  onFilterChange,
  onClearFilters
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-wrap items-center gap-3 py-2">
        <div className="flex items-center gap-2 text-[#7B2D42] font-bold text-xs uppercase tracking-widest mr-2">
          <SlidersHorizontal className="w-4 h-4" />
          Filter By
        </div>
        
        {Object.entries(FILTER_CONFIG).map(([label, options]) => {
          const isActive = !!activeFilters[label];
          return (
            <div key={label} className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === label ? null : label)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                  isActive
                    ? 'border-[#7B2D42] bg-[#7B2D42]/5 text-[#7B2D42]'
                    : activeDropdown === label
                      ? 'border-[#7B2D42] bg-[#7B2D42]/5 text-[#7B2D42]'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                {isActive ? `${label}: ${activeFilters[label]}` : label}
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === label ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {activeDropdown === label && (
                  <>
                    <div 
                      className="fixed inset-0 z-40 bg-transparent" 
                      onClick={() => setActiveDropdown(null)} 
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full left-0 mt-2 w-56 bg-white/90 backdrop-blur-xl rounded-[20px] shadow-[0_20px_48px_rgba(0,0,0,0.15)] border border-white/50 p-3 z-50 overflow-hidden"
                    >
                      <div className="space-y-1">
                        {options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => {
                              onFilterChange(label, opt);
                              setActiveDropdown(null);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-xl transition-all duration-200 ${
                              activeFilters[label] === opt
                                ? 'bg-[#7B2D42] text-white'
                                : 'text-slate-700 hover:bg-slate-50 hover:text-[#7B2D42]'
                            }`}
                          >
                            <span className="font-bold">{opt}</span>
                            {activeFilters[label] === opt && <Check className="w-4 h-4" />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {Object.keys(activeFilters).length > 0 && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-transparent text-sm font-bold text-slate-400 hover:text-[#7B2D42] transition-colors"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>
    </div>
  );
};
