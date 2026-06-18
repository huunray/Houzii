import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Star, MapPin, ShieldCheck, Phone, User,
  Gavel, Ruler, Palette, Truck, Brush, Wrench, X,
  SlidersHorizontal, ChevronDown, Check, Filter,
  Briefcase
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MOCK_PROFESSIONALS } from '../../data';

const categories = [
  { name: 'All', icon: Search },
  { name: 'Lawyers', icon: Gavel },
  { name: 'Surveyors', icon: Ruler },
  { name: 'Interior Designers', icon: Palette },
  { name: 'Movers', icon: Truck },
  { name: 'Property Inspectors', icon: Wrench },
];

const PROFESSIONAL_FILTERS: Record<string, string[]> = {
  'Rating': ['4.5+', '4.0+', '3.5+', 'Any'],
  'Experience': ['1-3 Years', '3-5 Years', '5-10 Years', '10+ Years'],
  'Verified': ['Verified Only', 'All Professionals'],
  'Location': ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Enugu'],
};

const SERVICE_OPTIONS = [
  'All Services',
  'Lawyers',
  'Surveyors',
  'Interior Designers',
  'Movers',
  'Property Inspectors',
];

export const ProfessionalsPanel: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [proSearch, setProSearch] = useState('');
  const [selectedService, setSelectedService] = useState('All Services');
  const [activeFilterDropdown, setActiveFilterDropdown] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const applyFilter = (key: string, val: string) => {
    setActiveFilters(prev => ({ ...prev, [key]: val }));
    setActiveFilterDropdown(null);
  };

  const removeFilter = (key: string) => {
    setActiveFilters(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setActiveCategory('All');
  };

  const activeFilterCount = Object.keys(activeFilters).length;

  const filteredProfessionals = MOCK_PROFESSIONALS.filter((p) => {
    const matchesCategory = selectedService === 'All Services' || p.category === selectedService;
    const matchesSearch =
      searchQuery === '' ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProSearch =
      proSearch === '' ||
      p.name.toLowerCase().includes(proSearch.toLowerCase());

    const matchesLocation = !activeFilters['Location'] || p.location.includes(activeFilters['Location']);
    const matchesRating = !activeFilters['Rating'] || (() => {
      const minRating = parseFloat(activeFilters['Rating']);
      return isNaN(minRating) || p.rating >= minRating;
    })();
    const matchesExperience = !activeFilters['Experience'] || (() => {
      const exp = activeFilters['Experience'];
      if (exp === '10+ Years') return p.yearsOfExperience >= 10;
      if (exp === '5-10 Years') return p.yearsOfExperience >= 5 && p.yearsOfExperience <= 10;
      if (exp === '3-5 Years') return p.yearsOfExperience >= 3 && p.yearsOfExperience <= 5;
      if (exp === '1-3 Years') return p.yearsOfExperience >= 1 && p.yearsOfExperience <= 3;
      return true;
    })();
    const matchesVerified = !activeFilters['Verified'] || activeFilters['Verified'] === 'All Professionals' || (activeFilters['Verified'] === 'Verified Only' && p.verified);

    return matchesCategory && matchesSearch && matchesProSearch && matchesLocation && matchesRating && matchesExperience && matchesVerified;
  });

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6 border-b border-slate-100">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-slate-900 font-black text-2xl mb-1">Find Professionals</h2>
          <p className="text-slate-400 font-medium">
            Hire trusted, vetted property professionals across Nigeria
          </p>
        </motion.div>

        {/* Search Bar - Website Style */}
        <div className="mt-5">
          <div className="flex items-center bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary p-1.5 h-[58px]">
            {/* Where */}
            <div className="flex-1 flex flex-col justify-center px-5 h-full border-r border-slate-100 hover:bg-slate-50 rounded-full cursor-pointer group transition-colors">
              <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 mb-0.5 group-hover:text-primary transition-colors">Where</span>
              <div className="flex items-center">
                <MapPin className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="City, area, or state"
                  className="w-full bg-transparent outline-none text-sm font-bold text-slate-900 placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-slate-300 hover:text-slate-500 shrink-0 ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Select Service */}
            <div className="flex-1 hidden md:flex flex-col justify-center px-5 h-full border-r border-slate-100 hover:bg-slate-50 rounded-full cursor-pointer group transition-colors relative">
              <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 mb-0.5 group-hover:text-primary transition-colors">Select Service</span>
              <div className="flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className={`text-sm font-bold ${selectedService !== 'All Services' ? 'text-slate-900' : 'text-slate-900'}`}>
                  {selectedService}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="absolute inset-0 z-10" onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'Service-bar' ? null : 'Service-bar')} />
              <AnimatePresence>
                {activeFilterDropdown === 'Service-bar' && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setActiveFilterDropdown(null)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-3 bg-white rounded-[20px] shadow-[0_20px_48px_rgba(0,0,0,0.15)] border border-slate-200 p-4 z-50 w-56"
                    >
                      <div className="space-y-1">
                        {SERVICE_OPTIONS.map(opt => (
                          <button
                            key={opt}
                            onClick={() => {
                              setSelectedService(opt);
                              setActiveFilterDropdown(null);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all font-bold flex items-center justify-between ${
                              selectedService === opt
                                ? 'bg-[#7B2D42] text-white'
                                : 'text-slate-700 hover:bg-slate-50 hover:text-[#7B2D42]'
                            }`}
                          >
                            <span>{opt}</span>
                            {selectedService === opt && <Check className="w-4 h-4 text-white shrink-0" />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Pro / Agency */}
            <div className="flex-1 hidden md:flex flex-col justify-center px-5 h-full hover:bg-slate-50 rounded-full cursor-pointer group transition-colors">
              <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 mb-0.5 group-hover:text-primary transition-colors">Pro / Agency</span>
              <div className="flex items-center">
                <User className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={proSearch}
                  onChange={(e) => setProSearch(e.target.value)}
                  placeholder="Search name (optional)"
                  className="w-full bg-transparent outline-none text-sm font-bold text-slate-900 placeholder:text-slate-400"
                />
                {proSearch && (
                  <button
                    onClick={() => setProSearch('')}
                    className="text-slate-300 hover:text-slate-500 shrink-0 ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Search Button */}
            <button className="ml-2 w-10 h-10 bg-[#7B2D42] rounded-full flex items-center justify-center text-white hover:bg-[#6a2639] transition-colors shrink-0 shadow-md">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Bar - Website Style */}
        <div className="mt-4">
          <div className="flex items-center gap-4 w-full">
            <div className="flex items-center gap-2 text-[#7B2D42] font-black text-[10px] uppercase tracking-[0.15em] shrink-0">
              <SlidersHorizontal className="w-4 h-4" strokeWidth={2.5} />
              Filter By
            </div>

            <div className="flex-1 flex gap-2 overflow-x-auto py-2 scrollbar-hide items-center" style={{ scrollbarWidth: 'none' }}>
              {Object.keys(PROFESSIONAL_FILTERS).map(filter => {
                const isActive = !!activeFilters[filter];

                return (
                  <div key={filter} className="relative shrink-0">
                    <button
                      onClick={() => setActiveFilterDropdown(activeFilterDropdown === filter ? null : filter)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-black whitespace-nowrap transition-all duration-300 ${
                        isActive
                          ? 'border-[#7B2D42] bg-[#7B2D42]/5 text-[#7B2D42]'
                          : activeFilterDropdown === filter
                            ? 'border-[#7B2D42] bg-[#7B2D42]/5 text-[#7B2D42]'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-[#7B2D42]/30 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {isActive ? `${filter}: ${activeFilters[filter]}` : filter}
                        {isActive && (
                          <X
                            className="w-3.5 h-3.5 opacity-50 hover:opacity-100 hover:text-red-500 transition-all cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFilter(filter);
                              setActiveFilterDropdown(null);
                            }}
                          />
                        )}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 opacity-50 transition-transform duration-300 ${activeFilterDropdown === filter ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {activeFilterDropdown === filter && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setActiveFilterDropdown(null)} />
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-3 bg-white rounded-[20px] shadow-[0_20px_48px_rgba(0,0,0,0.15)] border border-slate-200 p-4 z-50 w-56 origin-top-left"
                          >
                            <div className="flex flex-col gap-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{filter}</span>
                                {activeFilters[filter] && (
                                  <button
                                    onClick={() => {
                                      removeFilter(filter);
                                      setActiveFilterDropdown(null);
                                    }}
                                    className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 hover:text-[#7B2D42] transition-colors"
                                  >
                                    Clear
                                  </button>
                                )}
                              </div>
                              <div className="space-y-1 max-h-[280px] overflow-y-auto pr-1 scrollbar-hide">
                                {PROFESSIONAL_FILTERS[filter].map(opt => {
                                  const isSel = activeFilters[filter] === opt;
                                  return (
                                    <button
                                      key={opt}
                                      onClick={() => applyFilter(filter, opt)}
                                      className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all duration-200 font-bold flex items-center justify-between group ${
                                        isSel
                                          ? 'bg-[#7B2D42] text-white'
                                          : 'text-slate-700 hover:bg-slate-50 hover:text-[#7B2D42]'
                                      }`}
                                    >
                                      <span className="truncate">{opt}</span>
                                      {isSel && <Check className="w-4 h-4 text-white shrink-0" />}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white text-slate-700 text-xs font-bold whitespace-nowrap transition-all duration-300 hover:border-primary/30 hover:bg-slate-50 hover:text-primary">
                <Filter className="w-3.5 h-3.5" />
                More
              </button>

              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="px-3 py-2 text-[10px] font-black tracking-widest text-slate-400 hover:text-primary uppercase transition-colors shrink-0"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="px-6 pt-6 pb-2">
        <p className="text-slate-400 text-sm font-bold">
          {filteredProfessionals.length} professional{filteredProfessionals.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Professionals Grid */}
      <div className="px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProfessionals.map((professional, idx) => (
              <motion.div
                key={professional.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group relative bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-md hover:shadow-2xl hover:shadow-slate-200/50 transition-all hover:-translate-y-1.5 flex flex-col h-full"
              >
                {/* Featured Badge */}
                {professional.featured && (
                  <div className="absolute top-4 left-4 z-10 bg-primary text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    Featured
                  </div>
                )}

                {/* Verified Badge */}
                {professional.verified && (
                  <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-md p-1.5 rounded-full shadow-md border border-slate-100">
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
                    <div className="flex items-center gap-1.5 text-primary mb-2">
                      <span className="text-[9px] font-black uppercase tracking-[0.15em] bg-primary/10 px-2 py-0.5 rounded-md">
                        {professional.category}
                      </span>
                    </div>
                    <h3 className="text-[18px] font-bold text-slate-900 group-hover:text-primary transition-colors duration-300 line-clamp-1">
                      {professional.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-bold">{professional.title}</p>
                  </div>

                  <div className="flex items-center gap-4 mb-3 pb-3 border-b border-slate-100">
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
                        <span className="text-[10px] font-bold text-slate-400 px-1">
                          + {professional.services.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 hover:border-primary/30 hover:text-primary transition-all duration-300">
                      <User className="w-3.5 h-3.5" />
                      Profile
                    </button>
                    <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark shadow-md hover:shadow-lg transition-all duration-300">
                      <Phone className="w-3.5 h-3.5" />
                      Contact
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredProfessionals.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-bold">No professionals found</p>
            <p className="text-slate-300 text-sm mt-1">Try adjusting your search or category</p>
          </div>
        )}
      </div>
    </div>
  );
};