import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart, MapPin, Bed, Bath, Share2, Sparkles, Star,
  ShieldCheck, ChevronRight, Search, X
} from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MOCK_PROPERTIES, MOCK_PROFESSIONALS, Property, Professional } from '../../data';

interface FavouritesPanelProps {
  onNavigate: (screen: string) => void;
  onViewProperty?: (id: number) => void;
}

type MainTab = 'Properties' | 'Professionals';
type PropertyFilter = 'All' | 'For Sale' | 'To Rent' | 'Shortlet';
type ProCategory = 'All' | 'Legal' | 'Surveying' | 'Maintenance';

const propertyTypeToFilter = (type: Property['type']): PropertyFilter => {
  switch (type) {
    case 'Buy': return 'For Sale';
    case 'Rent': return 'To Rent';
    case 'Shortlet': return 'Shortlet';
  }
};

const proCategoryMap: Record<string, ProCategory> = {
  'Lawyers': 'Legal',
  'Surveyors': 'Surveying',
  'Property Inspectors': 'Maintenance',
  'Interior Designers': 'Maintenance',
  'Movers': 'Maintenance',
};

const proCategoryLabels: Record<ProCategory, string> = {
  'All': 'All Professionals',
  'Legal': 'Legal',
  'Surveying': 'Surveying',
  'Maintenance': 'Maintenance & Services',
};

export const FavouritesPanel: React.FC<FavouritesPanelProps> = ({ onNavigate, onViewProperty }) => {
  const [mainTab, setMainTab] = useState<MainTab>('Properties');
  const [propertyFilter, setPropertyFilter] = useState<PropertyFilter>('All');
  const [proFilter, setProFilter] = useState<ProCategory>('All');

  // Simulate some already-favourited properties and professionals
  const [favouritePropertyIds, setFavouritePropertyIds] = useState<number[]>([1, 4, 2, 3]);
  const [favouriteProfessionalIds, setFavouriteProfessionalIds] = useState<number[]>([1, 2, 3, 5]);

  const favouriteProperties = MOCK_PROPERTIES.filter(p => favouritePropertyIds.includes(p.id));
  const favouriteProfessionals = MOCK_PROFESSIONALS.filter(p => favouriteProfessionalIds.includes(p.id));

  const filteredProperties = propertyFilter === 'All'
    ? favouriteProperties
    : favouriteProperties.filter(p => propertyTypeToFilter(p.type) === propertyFilter);

  const filteredProfessionals = proFilter === 'All'
    ? favouriteProfessionals
    : favouriteProfessionals.filter(p => proCategoryMap[p.category] === proFilter);

  const groupedProfessionals = filteredProfessionals.reduce((acc, pro) => {
    const group = proCategoryMap[pro.category] || 'Maintenance';
    if (!acc[group]) acc[group] = [];
    acc[group].push(pro);
    return acc;
  }, {} as Record<ProCategory, Professional[]>);

  const removeProperty = (id: number, title: string) => {
    setFavouritePropertyIds(prev => prev.filter(i => i !== id));
    toast('Removed from Favourites', {
      description: title,
      icon: <Heart className="w-4 h-4 text-slate-400" />,
      action: {
        label: 'Undo',
        onClick: () => setFavouritePropertyIds(prev => [...prev, id]),
      },
    });
  };

  const removeProfessional = (id: number, name: string) => {
    setFavouriteProfessionalIds(prev => prev.filter(i => i !== id));
    toast('Removed from Favourites', {
      description: name,
      icon: <Heart className="w-4 h-4 text-slate-400" />,
      action: {
        label: 'Undo',
        onClick: () => setFavouriteProfessionalIds(prev => [...prev, id]),
      },
    });
  };

  const isEmpty = favouritePropertyIds.length === 0 && favouriteProfessionalIds.length === 0;

  // Empty state
  if (isEmpty) {
    return (
      <div className="pb-6">
        <div className="bg-white px-6 pt-8 pb-6 border-b border-slate-100">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-slate-900 font-black text-2xl mb-1">Favourites</h2>
            <p className="text-slate-400 font-medium">Your saved properties and professionals</p>
          </motion.div>
        </div>

        <div className="flex flex-col items-center justify-center px-6 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            {/* Minimalist house + heart line art */}
            <svg width="160" height="140" viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* House body */}
              <rect x="35" y="65" width="90" height="55" rx="4" stroke="#CBD5E1" strokeWidth="2" fill="none" />
              {/* Roof */}
              <path d="M25 68 L80 28 L135 68" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              {/* Door */}
              <rect x="65" y="90" width="30" height="30" rx="3" stroke="#CBD5E1" strokeWidth="2" fill="none" />
              {/* Door knob */}
              <circle cx="90" cy="105" r="2" fill="#CBD5E1" />
              {/* Left window */}
              <rect x="42" y="75" width="18" height="15" rx="2" stroke="#CBD5E1" strokeWidth="1.5" fill="none" />
              <line x1="51" y1="75" x2="51" y2="90" stroke="#CBD5E1" strokeWidth="1" />
              <line x1="42" y1="82.5" x2="60" y2="82.5" stroke="#CBD5E1" strokeWidth="1" />
              {/* Right window */}
              <rect x="100" y="75" width="18" height="15" rx="2" stroke="#CBD5E1" strokeWidth="1.5" fill="none" />
              <line x1="109" y1="75" x2="109" y2="90" stroke="#CBD5E1" strokeWidth="1" />
              <line x1="100" y1="82.5" x2="118" y2="82.5" stroke="#CBD5E1" strokeWidth="1" />
              {/* Chimney */}
              <rect x="105" y="35" width="12" height="22" rx="2" stroke="#CBD5E1" strokeWidth="1.5" fill="none" />
              {/* Floating heart */}
              <motion.g
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <path
                  d="M80 12 C76 4, 66 4, 66 12 C66 20, 80 28, 80 28 C80 28, 94 20, 94 12 C94 4, 84 4, 80 12Z"
                  stroke="#7B2D42"
                  strokeWidth="2"
                  fill="#7B2D42"
                  fillOpacity="0.15"
                />
              </motion.g>
            </svg>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center max-w-sm"
          >
            <h3 className="text-slate-900 font-black text-xl mb-2">Your Shortlist is Empty</h3>
            <p className="text-slate-400 text-sm font-medium mb-8">
              Start exploring the most trusted properties in Nigeria and save your favorites here.
            </p>
            <button
              onClick={() => onNavigate('explore')}
              className="px-8 py-3.5 bg-[#6D1D2C] text-white rounded-full font-black text-sm hover:bg-[#5a1824] transition-all shadow-lg shadow-[#6D1D2C]/20 hover:shadow-xl hover:shadow-[#6D1D2C]/30 hover:-translate-y-0.5"
            >
              Start Exploring
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6 border-b border-slate-100">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-slate-900 font-black text-2xl">Favourites</h2>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 border border-primary/15 rounded-full">
              <Heart className="w-4 h-4 text-primary fill-primary" />
              <span className="text-primary text-xs font-black">
                {favouritePropertyIds.length + favouriteProfessionalIds.length} Saved
              </span>
            </div>
          </div>
          <p className="text-slate-400 font-medium">Your saved properties and professionals</p>
        </motion.div>

        {/* Main Tabs */}
        <div className="mt-5 flex gap-2 bg-slate-100 rounded-2xl p-1.5">
          {(['Properties', 'Professionals'] as MainTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setMainTab(tab)}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                mainTab === tab
                  ? 'bg-primary text-white shadow-lg shadow-primary/15'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Sub-filters */}
        {mainTab === 'Properties' && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide"
          >
            {(['All', 'For Sale', 'To Rent', 'Shortlet'] as PropertyFilter[]).map(filter => (
              <button
                key={filter}
                onClick={() => setPropertyFilter(filter)}
                className={`px-4 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all border ${
                  propertyFilter === filter
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-primary/30 hover:text-primary'
                }`}
              >
                {filter}
                {filter !== 'All' && (
                  <span className="ml-1.5 opacity-60">
                    ({favouriteProperties.filter(p => propertyTypeToFilter(p.type) === filter).length})
                  </span>
                )}
                {filter === 'All' && (
                  <span className="ml-1.5 opacity-60">({favouriteProperties.length})</span>
                )}
              </button>
            ))}
          </motion.div>
        )}

        {mainTab === 'Professionals' && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide"
          >
            {(['All', 'Legal', 'Surveying', 'Maintenance'] as ProCategory[]).map(cat => (
              <button
                key={cat}
                onClick={() => setProFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all border ${
                  proFilter === cat
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-primary/30 hover:text-primary'
                }`}
              >
                {cat === 'All' ? 'All' : proCategoryLabels[cat]}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <AnimatePresence mode="wait">
          {mainTab === 'Properties' ? (
            <motion.div
              key={`properties-${propertyFilter}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {filteredProperties.length === 0 ? (
                <div className="text-center py-16">
                  <Search className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-400 font-bold text-sm">No {propertyFilter !== 'All' ? propertyFilter.toLowerCase() : ''} favourites yet</p>
                  <button
                    onClick={() => onNavigate('explore')}
                    className="mt-4 text-primary text-sm font-bold hover:underline"
                  >
                    Browse properties
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-slate-400 text-sm font-bold mb-4">
                    {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProperties.map((prop, idx) => (
                      <motion.div
                        key={prop.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, delay: idx * 0.06 }}
                        layout
                        onClick={() => onViewProperty ? onViewProperty(prop.id) : onNavigate(`/property/${prop.id}`)}
                        className="group bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-md hover:shadow-2xl hover:shadow-slate-200/50 transition-all hover:-translate-y-1.5 cursor-pointer"
                      >
                        <div className="relative aspect-[3/2] overflow-hidden">
                          <ImageWithFallback
                            src={prop.image}
                            alt={prop.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute top-3 left-3 flex gap-2">
                            {prop.verified && (
                              <div className="bg-white px-3 py-1.5 rounded-full shadow-md border border-slate-100">
                                <span className="text-[10px] font-bold text-primary flex items-center gap-1 uppercase tracking-wide">
                                  <Sparkles className="w-3 h-3 fill-primary/20" />
                                  Verified
                                </span>
                              </div>
                            )}
                            <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md border border-slate-100">
                              <span className="text-[10px] font-bold text-slate-700">{prop.listedDate}</span>
                            </div>
                          </div>
                          <div className="absolute top-3 right-3 flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeProperty(prop.id, prop.title);
                              }}
                              className="w-8 h-8 bg-white rounded-full flex items-center justify-center transition-colors shadow-md border border-slate-100 group/heart"
                            >
                              <Heart className="w-4 h-4 fill-red-500 text-red-500 group-hover/heart:scale-110 transition-transform" />
                            </button>
                            <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-600 hover:text-primary transition-colors shadow-md border border-slate-100">
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                          {/* Category tag */}
                          <div className="absolute bottom-3 left-3">
                            <div className="bg-primary/90 backdrop-blur-sm px-3 py-1 rounded-full">
                              <span className="text-[10px] font-black text-white uppercase tracking-wider">
                                {propertyTypeToFilter(prop.type)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="p-5">
                          {/* Agent */}
                          {prop.agent && (
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-6 h-6 rounded-full overflow-hidden border border-primary/20">
                                <ImageWithFallback
                                  src={prop.agent.avatar}
                                  alt={prop.agent.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="text-[11px] font-bold text-slate-500">{prop.agent.name}</span>
                              {prop.agent.agency && (
                                <span className="text-[10px] font-medium text-slate-400">| {prop.agent.agency}</span>
                              )}
                            </div>
                          )}

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
                                <span className="text-sm font-semibold">
                                  {prop.bedrooms} <span className="font-normal text-xs text-slate-500">Beds</span>
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-slate-600">
                                <Bath className="w-4 h-4" />
                                <span className="text-sm font-semibold">
                                  {prop.bathrooms} <span className="font-normal text-xs text-slate-500">Baths</span>
                                </span>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-2.5 py-1 rounded-md">
                              {prop.propertyType}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-xl font-black text-slate-900 leading-none">{prop.price}</span>
                            {prop.landSize && (
                              <span className="text-xs font-bold text-slate-400">{prop.landSize}</span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key={`professionals-${proFilter}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {filteredProfessionals.length === 0 ? (
                <div className="text-center py-16">
                  <Search className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-400 font-bold text-sm">No saved professionals in this category</p>
                  <button
                    onClick={() => onNavigate('professionals')}
                    className="mt-4 text-primary text-sm font-bold hover:underline"
                  >
                    Find professionals
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {proFilter === 'All' ? (
                    // Grouped view
                    Object.entries(groupedProfessionals).map(([group, pros]) => (
                      <div key={group}>
                        <div className="flex items-center gap-2 mb-4">
                          <h3 className="text-slate-900 font-black text-sm uppercase tracking-widest">
                            {proCategoryLabels[group as ProCategory]}
                          </h3>
                          <div className="flex-1 h-px bg-slate-100" />
                          <span className="text-xs font-bold text-slate-400">{pros.length}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {pros.map((pro, idx) => (
                            <ProfessionalCard
                              key={pro.id}
                              professional={pro}
                              index={idx}
                              onRemove={() => removeProfessional(pro.id, pro.name)}
                            />
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    // Flat view for specific filter
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredProfessionals.map((pro, idx) => (
                        <ProfessionalCard
                          key={pro.id}
                          professional={pro}
                          index={idx}
                          onRemove={() => removeProfessional(pro.id, pro.name)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Professional Card Sub-Component
const ProfessionalCard: React.FC<{
  professional: Professional;
  index: number;
  onRemove: () => void;
}> = ({ professional: pro, index, onRemove }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.06 }}
    className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg hover:border-slate-300 transition-all group"
  >
    <div className="flex items-start gap-4 mb-4">
      <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-primary/10 shrink-0 shadow-sm">
        <ImageWithFallback
          src={pro.image}
          alt={pro.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-slate-900 font-bold text-sm truncate">{pro.name}</h4>
          {pro.verified && (
            <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
          )}
        </div>
        <p className="text-slate-400 text-xs font-medium mb-1.5">{pro.title}</p>
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-xs font-black text-slate-700">{pro.rating}</span>
          <span className="text-xs font-medium text-slate-400">({pro.reviews})</span>
        </div>
      </div>
      <button
        onClick={onRemove}
        className="w-8 h-8 rounded-full flex items-center justify-center transition-colors border border-slate-100 hover:border-red-200 hover:bg-red-50 group/heart shrink-0"
      >
        <Heart className="w-4 h-4 fill-red-500 text-red-500 group-hover/heart:scale-110 transition-transform" />
      </button>
    </div>

    <div className="flex items-center gap-1.5 text-slate-400 mb-3">
      <MapPin className="w-3 h-3" />
      <span className="text-[11px] font-medium">{pro.location}</span>
      <span className="text-slate-300 mx-1">|</span>
      <span className="text-[11px] font-bold text-slate-500">{pro.yearsOfExperience}yr exp</span>
    </div>

    <div className="flex flex-wrap gap-1.5 mb-4">
      {pro.services.slice(0, 2).map(s => (
        <span
          key={s}
          className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-bold text-slate-500"
        >
          {s}
        </span>
      ))}
    </div>

    {pro.verified && (
      <div className="flex items-center gap-1.5 mb-4 px-3 py-1.5 bg-green-50 border border-green-100 rounded-lg w-fit">
        <ShieldCheck className="w-3 h-3 text-green-500" />
        <span className="text-[10px] font-black text-green-600 uppercase tracking-wider">Houzii Verified</span>
      </div>
    )}

    <button className="w-full py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-[#6a2639] transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
      Request Service
      <ChevronRight className="w-4 h-4" />
    </button>
  </motion.div>
);