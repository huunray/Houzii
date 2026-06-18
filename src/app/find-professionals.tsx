import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, X, ArrowRight, Star, SlidersHorizontal, User, Phone, CheckCircle2, ChevronRight, Briefcase, LayoutGrid, List, ShieldCheck } from 'lucide-react';
import { Navbar } from './components/navbar';
import { Footer } from './components/footer';
import { ProfessionalCard } from './components/professionals/professional-card';
import { ProfessionalFilters } from './components/professionals/professional-filters';
import { MOCK_PROFESSIONALS, Professional } from './data';
import { toast } from 'sonner';

export const FindProfessionals = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isSticky, setIsSticky] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Trigger sticky state when page is scrolled
      setIsSticky(window.scrollY > 150);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(MOCK_PROFESSIONALS.map(p => p.category)));
    return cats;
  }, []);

  const filteredProfessionals = useMemo(() => {
    return MOCK_PROFESSIONALS.filter(p => {
      // Category filter
      if (activeCategory !== 'All' && p.category !== activeCategory) return false;
      
      // Search query filter
      const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      if (searchQuery && !searchMatch) return false;

      // Rating filter
      if (activeFilters['Rating']) {
        const minRating = parseFloat(activeFilters['Rating'].split(' ')[0]);
        if (p.rating < minRating) return false;
      }

      // Experience filter
      if (activeFilters['Experience']) {
        const exp = activeFilters['Experience'];
        if (exp === '10+ Years' && p.yearsOfExperience < 10) return false;
        if (exp === '5-10 Years' && (p.yearsOfExperience < 5 || p.yearsOfExperience >= 10)) return false;
        if (exp === '3-5 Years' && (p.yearsOfExperience < 3 || p.yearsOfExperience >= 5)) return false;
        if (exp === '0-2 Years' && p.yearsOfExperience >= 3) return false;
      }

      // Verified filter
      if (activeFilters['Verified'] === 'Verified Only' && !p.verified) return false;

      // Location filter
      if (activeFilters['Location'] && !p.location.toLowerCase().includes(activeFilters['Location'].toLowerCase())) return false;

      return true;
    });
  }, [activeCategory, searchQuery, activeFilters]);

  const featuredProfessionals = useMemo(() => {
    return MOCK_PROFESSIONALS.filter(p => p.featured).slice(0, 3);
  }, []);

  const handleContact = (id: number) => {
    setSelectedProfessional(id);
    setShowAuthModal(true);
  };

  const handleViewProfile = (id: number) => {
    toast.info("Profile view feature coming soon!");
  };

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setActiveFilters({});
    setActiveCategory('All');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#FDFCFE] selection:bg-[#7B2D42] selection:text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,#7B2D42_0%,transparent_70%)] opacity-[0.03] blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,#C94B60_0%,transparent_70%)] opacity-[0.03] blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7B2D42]/5 border border-[#7B2D42]/10 text-[#7B2D42] text-xs font-black uppercase tracking-[0.2em] mb-8"
            >
              <Briefcase className="w-4 h-4" />
              Expert Marketplace
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-7xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tight"
            >
              Find Verified <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7B2D42] to-[#C94B60]">
                Professionals
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-500 max-w-2xl mx-auto font-medium"
            >
              Connect with verified real estate professionals including agents, lawyers, 
              surveyors, interior designers, movers, and trusted service providers.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className={`bg-white/90 backdrop-blur-xl border-b border-slate-100 sticky top-[72px] z-30 transition-all duration-300 ${isSticky ? 'py-4 shadow-xl border-t-0 scale-[0.99] rounded-[2rem] mx-6' : 'py-8 -mt-32'}`}>
        <div className="container mx-auto px-6">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#7B2D42] to-[#C94B60] rounded-[32px] opacity-10 blur-xl group-focus-within:opacity-25 transition-opacity duration-500" />
              <div className="relative bg-white border border-slate-200 rounded-[2rem] lg:rounded-full shadow-sm hover:shadow-md transition-all focus-within:ring-2 focus-within:ring-[#7B2D42]/10 focus-within:border-[#7B2D42]/30 flex flex-col lg:flex-row items-stretch p-1.5 lg:h-[72px]">
                {/* WHERE FIELD */}
                <div className="flex-1 w-full flex flex-col justify-center px-8 py-2 lg:py-0 lg:h-full border-b lg:border-b-0 lg:border-r border-slate-100 hover:bg-slate-50 lg:rounded-l-full cursor-pointer group/loc transition-colors">
                  <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 mb-0.5 group-hover/loc:text-[#7B2D42] transition-colors">Where</span>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-slate-400 mr-3 shrink-0 group-hover/loc:text-[#7B2D42] transition-colors" />
                    <input 
                      type="text" 
                      placeholder="City, area, or state"
                      value={activeFilters['Location'] || ''}
                      onChange={(e) => handleFilterChange('Location', e.target.value)}
                      className="w-full bg-transparent outline-none text-base font-bold text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* SELECT SERVICE FIELD */}
                <div className="flex-1 w-full flex flex-col justify-center px-8 py-2 lg:py-0 lg:h-full border-b lg:border-b-0 lg:border-r border-slate-100 hover:bg-slate-50 cursor-pointer group/serv transition-colors relative">
                  <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 mb-0.5 group-hover/serv:text-[#7B2D42] transition-colors">Select Service</span>
                  <div className="flex items-center relative">
                    <Briefcase className="w-5 h-5 text-slate-400 mr-3 shrink-0 group-hover/serv:text-[#7B2D42] transition-colors" />
                    <select 
                      value={activeCategory}
                      onChange={(e) => setActiveCategory(e.target.value)}
                      className="w-full bg-transparent outline-none text-base font-bold text-slate-900 appearance-none cursor-pointer pr-8"
                    >
                      <option value="All">All Services</option>
                      <option value="Agents">Agents</option>
                      {categories.filter(cat => cat !== 'Agents').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <ChevronRight className="w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 rotate-90 text-slate-300 pointer-events-none" />
                  </div>
                </div>
                
                {/* PRO/AGENCY FIELD */}
                <div className="flex-1 w-full flex flex-col justify-center px-8 py-2 lg:py-0 lg:h-full hover:bg-slate-50 lg:rounded-r-full cursor-pointer group/prof transition-colors">
                  <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 mb-0.5 group-hover/prof:text-[#7B2D42] transition-colors">Pro / Agency</span>
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-slate-400 mr-3 shrink-0 group-hover/prof:text-[#7B2D42] transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search name (optional)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent outline-none text-base font-bold text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="w-full lg:w-auto flex items-center justify-end px-2 lg:pl-4">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {}} 
                    className="bg-[#7B2D42] text-white rounded-full hover:bg-[#5E1F32] transition-colors shrink-0 flex items-center justify-center shadow-lg w-12 h-12 lg:w-14 lg:h-14"
                  >
                    <Search className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Filter Chips */}
            <ProfessionalFilters 
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="container mx-auto px-6 py-12">
        <div className="flex flex-col gap-12">
          
          {/* Featured Section - Only show when no search active or on first page */}
          {!searchQuery && Object.keys(activeFilters).length === 0 && activeCategory === 'All' && (
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                    Featured <span className="text-[#7B2D42]">Verified</span> Professionals
                  </h2>
                  <p className="text-slate-500 font-medium">The most highly rated and active professionals in the Houzii ecosystem.</p>
                </div>
                <div className="flex items-center gap-4">
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProfessionals.map((pro) => (
                  <ProfessionalCard 
                    key={pro.id} 
                    professional={pro} 
                    onContact={handleContact}
                    onViewProfile={handleViewProfile}
                  />
                ))}
              </div>
              
              <div className="mt-12 p-8 rounded-[32px] bg-[#7B2D42]/5 border border-[#7B2D42]/10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-md">
                    <ShieldCheck className="w-10 h-10 text-[#7B2D42]" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-[#7B2D42]">Houzii Verified Promise</h4>
                    <p className="text-slate-600 font-medium">All featured professionals undergo rigorous background checks and document verification.</p>
                  </div>
                </div>
                <button className="px-8 py-4 rounded-2xl bg-[#7B2D42] text-white font-black hover:bg-[#5E1F32] transition-colors shadow-lg">
                  Learn About Verification
                </button>
              </div>
            </section>
          )}

          {/* All Results Section */}
          <section className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">
                  {searchQuery || activeCategory !== 'All' ? 'Search Results' : 'Explore All Professionals'}
                </h3>
                <div className="flex items-center gap-4 text-slate-500 text-sm font-bold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7B2D42]" />
                    {filteredProfessionals.length} Experts Found
                  </span>
                  {Object.keys(activeFilters).length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 uppercase tracking-widest text-[10px]">
                      Filtered
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <select className="appearance-none bg-white border border-slate-200 text-sm font-bold text-slate-700 px-6 py-3 pr-12 rounded-2xl shadow-sm hover:border-[#7B2D42]/30 cursor-pointer outline-none">
                    <option>Top Rated</option>
                    <option>Most Reviewed</option>
                    <option>Newest</option>
                    <option>Years of Experience</option>
                  </select>
                  <ChevronRight className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Marketplace Grid */}
            <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              <AnimatePresence mode="popLayout">
                {filteredProfessionals.length > 0 ? (
                  filteredProfessionals.map((pro) => (
                    <ProfessionalCard 
                      key={pro.id} 
                      professional={pro} 
                      onContact={handleContact}
                      onViewProfile={handleViewProfile}
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full py-24 flex flex-col items-center justify-center text-center bg-white rounded-[40px] border border-slate-100"
                  >
                    <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mb-8">
                      <Search className="w-12 h-12 text-slate-200" />
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 mb-3">No professionals found for your search</h4>
                    <p className="text-slate-500 max-w-md mx-auto mb-10 font-medium">Try adjusting your filters, clearing your search query, or exploring other service categories.</p>
                    <button 
                      onClick={clearFilters}
                      className="px-10 py-4 rounded-2xl bg-slate-900 text-white font-black hover:bg-[#7B2D42] transition-colors shadow-xl"
                    >
                      Clear All Filters
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </main>

      <Footer />

      {/* Signup Funnel Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={() => setShowAuthModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl border border-white"
            >
              {/* Header Illustration */}
              <div className="h-48 bg-[#0A0613] relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#7B2D42_0%,transparent_70%)] opacity-30" />
                <motion.div
                  initial={{ rotate: -10, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', damping: 12 }}
                  className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center relative z-10"
                >
                  <Phone className="w-12 h-12 text-white" />
                </motion.div>
                <button 
                  onClick={() => setShowAuthModal(false)}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-10 text-center">
                <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Login or Create Account</h3>
                <p className="text-slate-500 font-medium mb-10">
                  Create an account or log in to contact professionals and send service requests.
                </p>
                
                <div className="space-y-4">
                  <button className="w-full py-5 rounded-2xl bg-[#7B2D42] text-white font-black text-lg shadow-[0_8px_24px_rgba(123,45,66,0.3)] hover:bg-[#5E1F32] transition-all duration-300">
                    Sign Up
                  </button>
                  <button className="w-full py-5 rounded-2xl bg-white border border-slate-200 text-slate-700 font-black text-lg hover:bg-slate-50 transition-all duration-300">
                    Log In
                  </button>
                </div>
                
                <p className="mt-10 text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">
                  Join 10,000+ Property Owners
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
