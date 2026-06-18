import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  Search, 
  MapPin, 
  Home, 
  Sparkles, 
  ChevronRight, 
  Users, 
  PlusCircle, 
  Hammer,
  Bed,
  Calendar as CalendarIcon,
  Plus,
  Minus,
  ChevronDown,
  X,
  SlidersHorizontal
} from "lucide-react";
import { motion as Motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "./ui/use-mobile";
const bgImage = "https://images.unsplash.com/photo-1659135091508-345ca86791bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBuaWdlcmlhbiUyMGhvbWUlMjBleHRlcmlvciUyMGRhcmt8ZW58MXx8fHwxNzczNDgwODkxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

const FloatingChip = ({ 
  icon: Icon, 
  label, 
  className, 
  delay = 0,
  link = "#"
}: { 
  icon: any, 
  label: string, 
  className?: string, 
  delay?: number,
  link?: string
}) => (
  <Motion.a
    href={link}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ 
      opacity: 1, 
      scale: 1,
      y: [0, -10, 0] 
    }}
    transition={{ 
      opacity: { duration: 0.5, delay },
      scale: { duration: 0.5, delay },
      y: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay * 2
      }
    }}
    whileHover={{ 
      scale: 1.05
    }}
    className={`flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl cursor-pointer group transition-colors hover:bg-white/20 hover:border-white/40 min-w-[200px] h-[38px] justify-center px-6 ${className}`}
  >
    <div className="p-1.5 rounded-full bg-primary/20 group-hover:bg-primary/40 transition-colors">
      <Icon className="w-4 h-4 text-white" />
    </div>
    <span className="text-white text-sm font-semibold whitespace-nowrap">{label}</span>
  </Motion.a>
);

export const Hero = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("Buy");
  const [showAiSearch, setShowAiSearch] = useState(false);
  const [aiSearchValue, setAiSearchValue] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [showSearchSheet, setShowSearchSheet] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState('');
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  // Shortlet specific state
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });
  const [showGuestPicker, setShowGuestPicker] = useState(false);

  // Refs for fixed-position floating panels
  const whenFieldRef = useRef<HTMLDivElement>(null);
  const whoFieldRef = useRef<HTMLDivElement>(null);
  const [calendarPos, setCalendarPos] = useState<{ top: number; left: number } | null>(null);
  const [guestPickerPos, setGuestPickerPos] = useState<{ top: number; left: number } | null>(null);

  const updateCalendarPos = useCallback(() => {
    if (whenFieldRef.current && !isMobile) {
      const rect = whenFieldRef.current.getBoundingClientRect();
      setCalendarPos({
        top: rect.bottom + 12,
        left: rect.left + rect.width / 2,
      });
    }
  }, [isMobile]);

  const updateGuestPickerPos = useCallback(() => {
    if (whoFieldRef.current && !isMobile) {
      const rect = whoFieldRef.current.getBoundingClientRect();
      setGuestPickerPos({
        top: rect.bottom + 12,
        left: rect.left,
      });
    }
  }, [isMobile]);

  useEffect(() => {
    if (showCalendar) updateCalendarPos();
  }, [showCalendar, updateCalendarPos]);

  useEffect(() => {
    if (showGuestPicker) updateGuestPickerPos();
  }, [showGuestPicker, updateGuestPickerPos]);

  // Recalculate on scroll/resize since panels are fixed
  useEffect(() => {
    if (!showCalendar && !showGuestPicker) return;
    const handleUpdate = () => {
      if (showCalendar) updateCalendarPos();
      if (showGuestPicker) updateGuestPickerPos();
    };
    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);
    return () => {
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [showCalendar, showGuestPicker, updateCalendarPos, updateGuestPickerPos]);

  const userGroups = [
    "FOR PROPERTY SEEKERS",
    "FOR PROPERTY OWNERS",
    "FOR PROPERTY PROFESSIONALS",
    "FOR AGENTS"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveGroupIndex((prev) => (prev + 1) % userGroups.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  const suggestions = [
    "Lekki",
    "Lekki Phase 1",
    "Lekki Phase 2",
    "Lekki Conservation",
    "Yaba",
    "Abuja",
    "Victoria Island",
    "Ikoyi",
    "Port Harcourt"
  ];

  const filteredSuggestions = suggestions.filter(s => 
    s.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = ["Buy", "Rent", "Shortlet", "Find professionals", "Invest"];
  
  const smartFilters = [
    "Apartment", "Duplex", "Detached House", "Land", "Pool", "Parking", "Gated Estate"
  ];

  const popularLocations = [
    "Lekki Phase 1", "Victoria Island", "Ikoyi", "Abuja CBD", "Gbagada"
  ];

  const aiSuggestions = [
    "3 bedroom duplex in Lekki under ₦120M",
    "Shortlet apartments in Victoria Island",
    "Luxury homes in Ikoyi",
    "2 bedroom flats for rent in Abuja"
  ];

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter) 
        : [...prev, filter]
    );
  };

  const handleSearch = () => {
    if (activeTab === "Shortlet") {
      const params = new URLSearchParams({
        location: searchQuery,
        checkIn: dateRange.from?.toISOString() || "",
        checkOut: dateRange.to?.toISOString() || "",
        guests: (guests.adults + guests.children).toString()
      });
      navigate(`/explore?${params.toString()}`);
    } else if (activeTab === "Find professionals") {
      navigate("/find-professionals");
    } else {
      navigate("/explore");
    }
  };

  const totalGuests = guests.adults + guests.children;

  const closePickers = () => {
    setShowCalendar(false);
    setShowGuestPicker(false);
    setShowSuggestions(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center pt-16 pb-16 overflow-hidden">
      {/* Backdrop overlay for floating panels */}
      {!isMobile && (showCalendar || showGuestPicker) && (
        <div 
          className="fixed inset-0 z-[100] bg-black/5"
          onClick={closePickers}
        />
      )}
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 -z-10 bg-[#0A0613]">
        <img
          src={bgImage}
          alt="Luxury Nigerian Home"
          className="absolute inset-0 w-full h-full object-cover object-bottom pointer-events-none"
        />
        {/* Gradient Overlay - Matches Figma Design */}
        <div 
          className="absolute inset-0" 
          style={{ backgroundImage: "linear-gradient(190.275deg, rgba(0, 0, 0, 0.3) 15.307%, rgba(0, 0, 0, 0.92) 67.37%)" }} 
          onClick={closePickers}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="w-full">
          {/* Main Content */}
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center w-full mt-[120px]"
          >
            {/* Animated User Groups Chip */}
            <div className="mb-6 h-[34px] flex items-center justify-center relative w-full">
              <AnimatePresence mode="wait">
                <Motion.div
                  key={activeGroupIndex}
                  initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-5 py-1.5 flex items-center gap-2 shadow-xl absolute -mt-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E76379] animate-pulse" />
                  <span className="text-[10px] md:text-xs font-bold tracking-widest text-white/90 uppercase whitespace-nowrap">
                    {userGroups[activeGroupIndex]}
                  </span>
                </Motion.div>
              </AnimatePresence>
            </div>

            <h1 className="text-white text-5xl md:text-7xl font-bold leading-[1.1] mb-8 tracking-tight max-w-4xl mx-auto">
              The Trusted Marketplace <br /> for Real Estate
            </h1>
            
            <p className="text-slate-200 mb-12 max-w-2xl mx-auto leading-relaxed text-[18px]">
              Buy, rent, or list verified homes, apartments, land, and commercial spaces with trusted agents and property owners across Nigeria.
            </p>

            {/* Main Search Card Container */}
            <div className="relative w-full max-w-4xl mb-12 mx-auto">
              {/* Main Search Card */}
              <Motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`bg-white/10 backdrop-blur-2xl rounded-[24px] p-6 md:p-8 shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)] border border-white/20 relative w-full text-left mt-6 transition-all duration-300 ${(!isMobile && (showCalendar || showGuestPicker)) ? "z-[110]" : "z-20"}`}
              >
                {/* ── Tabs ── */}
                <div className="flex justify-center mb-6">
                  <div className="flex gap-1 bg-white/10 p-1 rounded-full w-fit border border-white/10 backdrop-blur-sm">
                    {["Buy", "Rent", "Shortlet"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => {
                          setActiveTab(tab);
                          setSelectedFilters([]);
                          setSelectedPropertyType('');
                          setShowAiSearch(false);
                          closePickers();
                        }}
                        className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                          activeTab === tab
                            ? "bg-white text-primary shadow-lg scale-105"
                            : "text-white/60 hover:text-white"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Mobile: Single Search Pill ── */}
                {isMobile && (
                  <button
                    onClick={() => setShowSearchSheet(true)}
                    className="w-full flex items-center gap-4 bg-white/5 border border-white/15 rounded-full px-4 py-3 mb-5 hover:bg-white/10 active:scale-[0.99] transition-all group"
                  >
                    <div className="w-11 h-11 bg-primary rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow">
                      <Search className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider leading-none mb-1.5">
                        {activeTab === "Shortlet" ? "Where to?" : "Where do you want to live?"}
                      </p>
                      <p className={`text-sm font-semibold leading-none truncate ${searchQuery ? "text-white" : "text-white/35"}`}>
                        {searchQuery || "Search location, area, city…"}
                      </p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-white/50" />
                    </div>
                  </button>
                )}

                {/* ── Desktop: Original Multi-field Row ── */}
                {!isMobile && (
                  <Motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-row items-center p-1 mb-8 relative w-full h-[72px] isolate"
                  >
                    <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-full backdrop-blur-md shadow-xl -z-10 pointer-events-none" />

                    {/* Location */}
                    <div className="flex-1 relative flex flex-col justify-center px-6 rounded-full hover:bg-white/5 transition-colors cursor-text group h-full">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-0 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Where
                      </label>
                      <input
                        type="text"
                        placeholder={activeTab === "Shortlet" ? "Search destinations" : "Search location (Lekki, Yaba, Abuja…)"}
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); setShowCalendar(false); setShowGuestPicker(false); }}
                        onFocus={() => { setShowSuggestions(true); setShowCalendar(false); setShowGuestPicker(false); }}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        className="w-full bg-transparent border-none p-0 text-base font-semibold text-white placeholder:text-white/40 focus:ring-0 outline-none truncate"
                      />
                      <AnimatePresence>
                        {showSuggestions && searchQuery.length > 0 && filteredSuggestions.length > 0 && (
                          <Motion.div
                            key="suggestions"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-[110%] left-0 mt-2 w-full min-w-[280px] bg-white/10 backdrop-blur-[11px] border border-white/20 rounded-[24px] overflow-hidden z-[60] shadow-[0_8px_32px_rgba(0,0,0,0.37)]"
                          >
                            {filteredSuggestions.map((suggestion, index) => (
                              <div
                                key={index}
                                onClick={() => { setSearchQuery(suggestion); setShowSuggestions(false); }}
                                className="px-6 py-4 text-sm font-medium text-white/90 hover:bg-white/20 hover:text-white cursor-pointer transition-all duration-300 flex items-center gap-4 border-b border-white/10 last:border-0 group"
                              >
                                <div className="w-10 h-10 rounded-[12px] bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 group-hover:bg-white/20 transition-all">
                                  <MapPin className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" />
                                </div>
                                <span className="drop-shadow-sm group-hover:translate-x-1 transition-transform duration-300">{suggestion}</span>
                              </div>
                            ))}
                          </Motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="w-[1px] h-12 bg-white/10" />

                    {/* Tab-specific fields */}
                    {activeTab === "Shortlet" ? (
                      <>
                        <div
                          className="flex-1 relative flex flex-col justify-center px-6 rounded-full hover:bg-white/5 transition-colors cursor-pointer h-full"
                          onClick={() => { setShowCalendar(!showCalendar); setShowGuestPicker(false); setShowSuggestions(false); }}
                          ref={whenFieldRef}
                        >
                          <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-0 flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" /> When
                          </label>
                          <div className="text-base font-semibold text-white truncate">
                            {dateRange.from ? (dateRange.to ? `${format(dateRange.from, "MMM d")} — ${format(dateRange.to, "MMM d")}` : <span className="text-primary-foreground font-bold">Checkout?</span>) : <span className="text-white/40 font-normal">Add dates</span>}
                          </div>
                        </div>
                        <div className="w-[1px] h-12 bg-white/10" />
                        <div
                          className="flex-1 relative flex flex-col justify-center px-6 rounded-full hover:bg-white/5 transition-colors cursor-pointer h-full"
                          onClick={() => { setShowGuestPicker(!showGuestPicker); setShowCalendar(false); setShowSuggestions(false); }}
                          ref={whoFieldRef}
                        >
                          <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-0 flex items-center gap-1">
                            <Users className="w-3 h-3" /> Who
                          </label>
                          <div className="text-base font-semibold text-white truncate">
                            {totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}${guests.infants > 0 ? `, ${guests.infants} infant${guests.infants > 1 ? 's' : ''}` : ''}` : <span className="text-white/40 font-normal">Add guests</span>}
                          </div>
                        </div>
                      </>
                    ) : (activeTab === "Buy" || activeTab === "Rent") ? (
                      <div className="flex-1 relative flex flex-col justify-center px-6 rounded-full hover:bg-white/5 transition-colors cursor-pointer h-full">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-0 flex items-center gap-1">
                          {activeTab === "Rent" ? <><Bed className="w-3 h-3" /> Bedrooms</> : <><Home className="w-3 h-3" /> Property Type</>}
                        </label>
                        <select className="w-full bg-transparent border-none p-0 pr-6 text-base font-medium text-white focus:ring-0 outline-none appearance-none cursor-pointer truncate [&>option]:text-slate-900 [&>option]:bg-white">
                          {activeTab === "Rent" ? (
                            <>
                              <option value="" disabled hidden>Any bedrooms</option>
                              <option>1 Bedroom</option>
                              <option>2 Bedrooms</option>
                              <option>3 Bedrooms</option>
                              <option>4 Bedrooms</option>
                              <option>5+ Bedrooms</option>
                            </>
                          ) : (
                            <>
                              <option value="" disabled hidden>All types</option>
                              <option>Apartment / Flat</option>
                              <option>Duplex</option>
                              <option>Detached House</option>
                              <option>Semi-Detached House</option>
                              <option>Terraced House</option>
                              <option>Land</option>
                              <option>Commercial Property</option>
                            </>
                          )}
                        </select>
                        <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 rotate-90 pointer-events-none" />
                      </div>
                    ) : null}

                    <div className="w-auto pl-1 h-full flex items-center">
                      <button
                        onClick={() => {
                          const params = new URLSearchParams();
                          if (searchQuery) params.set("location", searchQuery);
                          params.set("type", activeTab.toLowerCase());
                          if (activeTab === "Shortlet") {
                            if (dateRange.from) params.set("checkIn", dateRange.from.toISOString());
                            if (dateRange.to) params.set("checkOut", dateRange.to.toISOString());
                            params.set("guests", (guests.adults + guests.children).toString());
                            navigate(`/explore?${params.toString()}`);
                          } else if (activeTab === "Find professionals") {
                            navigate("/find-professionals");
                          } else {
                            navigate(`/explore?${params.toString()}`);
                          }
                        }}
                        className="w-[64px] h-[64px] bg-primary hover:bg-primary-dark text-white rounded-full flex items-center justify-center transition-all active:scale-95 shadow-[0px_10px_15px_0px_rgba(123,45,66,0.2),0px_4px_6px_0px_rgba(123,45,66,0.2)]"
                      >
                        <Search className="w-6 h-6" />
                      </button>
                    </div>
                  </Motion.div>
                )}

                {/* ── Popular chips ── */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                  <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Popular:</span>
                  {["Lekki Phase 1", "Victoria Island", "Ikoyi", "Abuja CBD", "Gbagada"].map((loc) => (
                    <button
                      key={loc}
                      onClick={() => { setSearchQuery(loc); if (isMobile) setShowSearchSheet(true); }}
                      className="text-[11px] font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10 hover:border-white/25 transition-all"
                    >
                      {loc}
                    </button>
                  ))}
                </div>

                {/* ── Divider ── */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-[1px] flex-1 bg-white/10" />
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">or</span>
                  <div className="h-[1px] flex-1 bg-white/10" />
                </div>

                {/* ── AI Search Toggle ── */}
                <div className="flex flex-col items-center w-full">
                  <button
                    onClick={() => setShowAiSearch(!showAiSearch)}
                    className={`group relative flex items-center gap-3 px-10 py-4 rounded-full transition-all duration-500 ${
                      showAiSearch
                        ? "bg-white text-primary shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] scale-[1.05]"
                        : "bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/20 hover:border-white/30 hover:-translate-y-1 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.2)]"
                    }`}
                  >
                    <div className="absolute inset-0 rounded-full transition-opacity duration-500 blur-xl opacity-0 group-hover:opacity-30 bg-white -z-10" />
                    {showAiSearch && <span className="absolute inset-0 rounded-full border border-white animate-ping opacity-25" />}
                    <Sparkles className={`w-5 h-5 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-[45deg] group-hover:scale-125 ${
                      showAiSearch ? "text-primary rotate-[160deg]" : "text-white/40 group-hover:text-white"
                    }`} />
                    <span className="text-xs font-black tracking-[0.2em] uppercase">Ask Houzii AI</span>
                  </button>

                  <AnimatePresence>
                    {showAiSearch && (
                      <Motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: "auto", opacity: 1, marginTop: 24 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden w-full"
                      >
                        <div className="relative group mb-4">
                          <input
                            type="text"
                            value={aiSearchValue}
                            onChange={(e) => setAiSearchValue(e.target.value)}
                            placeholder="“3 bedroom duplex in Lekki with a pool under ₦120M”"
                            className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 pr-14 text-sm font-medium italic text-white placeholder:text-white/40 focus:ring-2 focus:ring-white/10 outline-none"
                          />
                          <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary-dark text-white p-2.5 rounded-full shadow-lg shadow-primary/20 transition-all">
                            <Search className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-2">
                          <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest mr-1">Try:</span>
                          {["3 bed duplex in Lekki under ₦120M", "Shortlet in Victoria Island", "Luxury homes in Ikoyi"].map((s) => (
                            <button key={s} onClick={() => setAiSearchValue(s)} className="text-[11px] font-medium text-white/60 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10 transition-colors">
                              {s}
                            </button>
                          ))}
                        </div>
                      </Motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ══ SEARCH BOTTOM SHEET (mobile only) ══ */}
                {isMobile && (
                <AnimatePresence>
                  {showSearchSheet && (
                    <>
                      <Motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="fixed inset-0 bg-black/65 backdrop-blur-sm z-[300]"
                        onClick={() => setShowSearchSheet(false)}
                      />
                      <Motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 32, stiffness: 370 }}
                        className="fixed bottom-0 left-0 right-0 z-[301] bg-[#0f0a1e] border-t border-white/10 rounded-t-[28px] flex flex-col max-h-[92vh]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-center pt-3 shrink-0">
                          <div className="w-10 h-1 bg-white/20 rounded-full" />
                        </div>
                        <div className="overflow-y-auto flex-1 px-5 pb-10">
                          {/* Header */}
                          <div className="flex items-start justify-between pt-5 pb-5">
                            <div>
                              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">
                                {activeTab === "Buy" ? "Buying" : activeTab === "Rent" ? "Renting" : "Shortlet"}
                              </p>
                              <h3 className="text-white font-black text-[22px] leading-tight">
                                {activeTab === "Buy" ? "Find your home" : activeTab === "Rent" ? "Find a rental" : "Where are you going?"}
                              </h3>
                            </div>
                            <button onClick={() => setShowSearchSheet(false)} className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center mt-1 shrink-0">
                              <X className="w-4 h-4 text-white/60" />
                            </button>
                          </div>

                          {/* Location input */}
                          <div className="relative mb-4">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                              <MapPin className="w-4 h-4 text-primary" />
                            </div>
                            <input
                              type="text"
                              autoFocus
                              placeholder={activeTab === "Shortlet" ? "City, neighbourhood, landmark..." : "Search area, city, neighbourhood..."}
                              value={searchQuery}
                              onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                              onFocus={() => setShowSuggestions(true)}
                              onBlur={() => setTimeout(() => setShowSuggestions(false), 180)}
                              className="w-full border border-white/15 rounded-2xl py-4 pl-11 pr-4 text-white placeholder:text-white/30 text-sm font-medium outline-none focus:border-primary/60 transition-all bg-white/5"
                            />
                            <AnimatePresence>
                              {showSuggestions && searchQuery.length > 0 && filteredSuggestions.length > 0 && (
                                <Motion.div
                                  initial={{ opacity: 0, y: 4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 4 }}
                                  className="absolute top-[calc(100%+6px)] left-0 right-0 bg-[#1b1332] border border-white/10 rounded-2xl overflow-hidden z-10 shadow-2xl"
                                >
                                  {filteredSuggestions.slice(0, 5).map((sug, i) => (
                                    <button
                                      key={i}
                                      onMouseDown={() => { setSearchQuery(sug); setShowSuggestions(false); }}
                                      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 text-left"
                                    >
                                      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                        <MapPin className="w-3.5 h-3.5 text-primary/80" />
                                      </div>
                                      <span className="text-white/80 text-sm font-medium">{sug}</span>
                                    </button>
                                  ))}
                                </Motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Buy / Rent: type / bedroom grid */}
                          {(activeTab === "Buy" || activeTab === "Rent") && (
                            <Motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="mb-4">
                              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-3">
                                {activeTab === "Buy" ? "Property Type" : "Bedrooms"}
                              </p>
                              <div className="grid grid-cols-3 gap-2">
                                {(activeTab === "Buy"
                                  ? ["Apartment", "Duplex", "Detached", "Semi-Det.", "Land", "Commercial"]
                                  : ["Studio", "1 Bed", "2 Beds", "3 Beds", "4 Beds", "5+ Beds"]
                                ).map((type) => (
                                  <button
                                    key={type}
                                    onClick={() => setSelectedPropertyType(selectedPropertyType === type ? '' : type)}
                                    className={`py-3 px-2 rounded-xl border text-xs font-bold transition-all ${selectedPropertyType === type ? "bg-primary border-primary text-white shadow-lg shadow-primary/25" : "bg-white/5 border-white/10 text-white/55 hover:border-white/20 hover:text-white"}`}
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>
                            </Motion.div>
                          )}

                          {/* Shortlet: dates + guests */}
                          {activeTab === "Shortlet" && (
                            <Motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="mb-4 space-y-3">
                              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Dates & Guests</p>
                              <div className="grid grid-cols-2 gap-2.5">
                                <div className="bg-white/5 border border-white/15 rounded-2xl p-4 text-left">
                                  <p className="text-white/40 text-[10px] font-black uppercase tracking-wide mb-1.5">Check-in</p>
                                  <p className={`text-sm font-bold ${dateRange.from ? "text-white" : "text-white/30"}`}>{dateRange.from ? format(dateRange.from, "MMM d, yyyy") : "Add date"}</p>
                                </div>
                                <div className="bg-white/5 border border-white/15 rounded-2xl p-4 text-left">
                                  <p className="text-white/40 text-[10px] font-black uppercase tracking-wide mb-1.5">Check-out</p>
                                  <p className={`text-sm font-bold ${dateRange.to ? "text-white" : "text-white/30"}`}>{dateRange.to ? format(dateRange.to, "MMM d, yyyy") : "Add date"}</p>
                                </div>
                              </div>
                              <div className="bg-white/5 border border-white/15 rounded-2xl px-4 py-3.5 flex items-center justify-between">
                                <div>
                                  <p className="text-white/40 text-[10px] font-black uppercase tracking-wide mb-0.5">Guests</p>
                                  <p className="text-white text-sm font-bold">{totalGuests} guest{totalGuests !== 1 ? "s" : ""}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                  <button disabled={guests.adults <= 1} onClick={() => setGuests(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))} className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:border-primary/60 hover:text-white disabled:opacity-30 transition-all">
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="text-white font-black w-4 text-center">{totalGuests}</span>
                                  <button onClick={() => setGuests(prev => ({ ...prev, adults: prev.adults + 1 }))} className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:border-primary/60 hover:text-white transition-all">
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </Motion.div>
                          )}

                          {/* More filters */}
                          <button onClick={() => setShowMoreFilters(!showMoreFilters)} className="w-full flex items-center justify-between py-4 border-t border-b border-white/10 mb-4">
                            <div className="flex items-center gap-2 text-white/55">
                              <SlidersHorizontal className="w-4 h-4" />
                              <span className="text-sm font-bold">More filters</span>
                              {selectedFilters.length > 0 && <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full">{selectedFilters.length}</span>}
                            </div>
                            <ChevronDown className={`w-4 h-4 text-white/35 transition-transform duration-300 ${showMoreFilters ? "rotate-180" : ""}`} />
                          </button>
                          <AnimatePresence>
                            {showMoreFilters && (
                              <Motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden mb-5">
                                <div className="flex flex-wrap gap-2 pt-1 pb-3">
                                  {["Pool", "Parking", "Gated Estate", "Furnished", "Generator", "24/7 Water", "CCTV", "Gym"].map((filter) => (
                                    <button key={filter} onClick={() => toggleFilter(filter)} className={`px-4 py-2 rounded-full border text-xs font-bold transition-all ${selectedFilters.includes(filter) ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "bg-white/5 border-white/10 text-white/55 hover:border-white/20 hover:text-white"}`}>
                                      {filter}
                                    </button>
                                  ))}
                                </div>
                              </Motion.div>
                            )}
                          </AnimatePresence>

                          {/* CTA */}
                          <button
                            onClick={() => { setShowSearchSheet(false); handleSearch(); }}
                            className="w-full bg-primary hover:bg-primary-dark text-white py-5 rounded-2xl font-black shadow-xl shadow-primary/30 flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all"
                          >
                            <Search className="w-5 h-5" />
                            Search {activeTab === "Buy" ? "homes" : activeTab === "Rent" ? "rentals" : "shortlets"}
                          </button>
                        </div>
                      </Motion.div>
                    </>
                  )}
                </AnimatePresence>
                )}
              </Motion.div>


            </div>
          </Motion.div>
        </div>
      </div>

      {/* FIXED POSITION FLOATING PANELS - Moved here to escape stacking context and blurs */}
      <AnimatePresence>
        {showCalendar && (
          <Motion.div
            initial={isMobile ? { y: '100%' } : { opacity: 0, y: 10, x: '-50%' }}
            animate={isMobile ? { y: 0 } : { opacity: 1, y: 0, x: '-50%' }}
            exit={isMobile ? { y: '100%' } : { opacity: 0, y: 10, x: '-50%' }}
            transition={isMobile 
              ? { type: 'spring', damping: 28, stiffness: 300 } 
              : { duration: 0.25, ease: 'easeOut' }
            }
            style={!isMobile && calendarPos ? { 
              position: 'fixed', 
              top: calendarPos.top, 
              left: '50%', 
              zIndex: 1000 
            } : {}}
            className={
              isMobile 
                ? "fixed inset-0 z-[1000] bg-white flex flex-col" 
                : "min-w-[680px] bg-white/10 backdrop-blur-[11px] rounded-[24px] shadow-[0_40px_80px_rgba(0,0,0,0.4)] border border-white/20 p-8"
            }
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Header */}
            {isMobile && (
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {!dateRange.from 
                      ? "When's your trip?" 
                      : !dateRange.to 
                        ? "Select checkout date" 
                        : "Your stay"}
                  </h3>
                  {dateRange.from && dateRange.to && (
                    <p className="text-sm text-slate-500 mt-0.5">
                      {format(dateRange.from, "MMM d")} — {format(dateRange.to, "MMM d")}
                    </p>
                  )}
                </div>
                <button 
                  onClick={closePickers}
                  className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Desktop Header */}
            {!isMobile && (
              <div className="mb-5 text-center">
                <p className="text-sm text-white font-semibold drop-shadow-sm">
                  {!dateRange.from 
                    ? "Select check-in date" 
                    : !dateRange.to 
                      ? "Now select checkout date" 
                      : `${format(dateRange.from, "MMM d")} — ${format(dateRange.to, "MMM d")}`}
                </p>
              </div>
            )}

            {/* Calendar */}
            <div className={isMobile ? "flex-1 overflow-auto px-4 py-4 flex justify-center" : "flex justify-center"}>
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  setDateRange({
                    from: range?.from,
                    to: range?.to
                  });
                  if (range?.from && range?.to) {
                    setTimeout(() => setShowCalendar(false), 400);
                  }
                }}
                numberOfMonths={isMobile ? 1 : 2}
                disabled={{ before: new Date() }}
                className="border-none [&_.rdp-day_focus]:outline-none"
                classNames={{
                  months: "flex flex-col sm:flex-row gap-10",
                  month: "flex flex-col gap-3",
                  caption: "flex justify-center pt-1 relative items-center w-full h-10",
                  caption_label: "text-sm font-bold text-white drop-shadow-sm",
                  nav: "flex items-center gap-1",
                  nav_button: "inline-flex items-center justify-center size-8 rounded-full bg-transparent hover:bg-white/10 text-white/60 hover:text-white transition-colors absolute top-0",
                  nav_button_previous: "left-0",
                  nav_button_next: "right-0",
                  table: "w-full border-collapse",
                  head_row: "flex mb-1",
                  head_cell: "text-white/40 rounded-md w-11 font-medium text-[11px] text-center uppercase tracking-wider",
                  row: "flex w-full",
                  cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 w-11 h-11 [&:has([aria-selected])]:bg-white/10 [&:has([aria-selected].day-range-end)]:rounded-r-full [&:has(>.day-range-end)]:rounded-r-full [&:has(>.day-range-start)]:rounded-l-full first:[&:has([aria-selected])]:rounded-l-full last:[&:has([aria-selected])]:rounded-r-full",
                  day: "inline-flex items-center justify-center w-11 h-11 p-0 font-normal aria-selected:opacity-100 rounded-full text-sm text-white/70 hover:bg-white/10 hover:text-white cursor-pointer transition-all duration-150",
                  day_range_start: "day-range-start aria-selected:bg-primary aria-selected:text-white aria-selected:hover:bg-primary aria-selected:font-bold aria-selected:shadow-md aria-selected:shadow-primary/20 !rounded-full relative z-10",
                  day_range_end: "day-range-end aria-selected:bg-primary aria-selected:text-white aria-selected:hover:bg-primary aria-selected:font-bold aria-selected:shadow-md aria-selected:shadow-primary/20 !rounded-full relative z-10",
                  day_selected: "bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white font-bold shadow-md shadow-primary/20",
                  day_today: "relative font-semibold text-white after:content-[''] after:absolute after:bottom-1.5 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-primary",
                  day_outside: "day-outside text-white/30 aria-selected:text-white/70",
                  day_disabled: "!text-white/30 !opacity-40 !cursor-not-allowed hover:!bg-transparent pointer-events-none",
                  day_range_middle: "aria-selected:bg-transparent aria-selected:text-white font-medium",
                  day_hidden: "invisible",
                }}
              />
            </div>

            {/* Desktop Footer - Clear Dates */}
            {!isMobile && dateRange.from && (
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <button 
                  onClick={() => setDateRange({ from: undefined, to: undefined })}
                  className="text-sm font-semibold text-white/60 hover:text-white underline underline-offset-4 transition-colors"
                >
                  Clear dates
                </button>
                {dateRange.from && dateRange.to && (
                  <button 
                    onClick={() => setShowCalendar(false)}
                    className="bg-primary text-white text-sm font-bold px-6 py-2.5 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95"
                  >
                    Confirm
                  </button>
                )}
              </div>
            )}

            {/* Mobile Footer */}
            {isMobile && (
              <div className="p-6 border-t border-slate-100 flex items-center gap-3 mt-auto">
                {dateRange.from && (
                  <button 
                    onClick={() => setDateRange({ from: undefined, to: undefined })}
                    className="px-5 py-4 rounded-full font-bold text-sm text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Clear
                  </button>
                )}
                <button 
                  onClick={() => setShowCalendar(false)}
                  disabled={!dateRange.from || !dateRange.to}
                  className="flex-1 bg-primary text-white py-4 rounded-full font-bold shadow-xl shadow-primary/20 disabled:opacity-40 disabled:shadow-none transition-all active:scale-[0.98]"
                >
                  {dateRange.from && dateRange.to 
                    ? `${format(dateRange.from, "MMM d")} — ${format(dateRange.to, "MMM d")}` 
                    : "Select dates"}
                </button>
              </div>
            )}
          </Motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showGuestPicker && (
          <Motion.div
            initial={isMobile ? { y: '100%' } : { opacity: 0, y: 20, scale: 0.95 }}
            animate={isMobile ? { y: 0 } : { opacity: 1, y: 0, scale: 1 }}
            exit={isMobile ? { y: '100%' } : { opacity: 0, y: 20, scale: 0.95 }}
            style={!isMobile && guestPickerPos ? { 
              position: 'fixed', 
              top: guestPickerPos.top, 
              left: guestPickerPos.left,
              zIndex: 1000 
            } : {}}
            className={`
              ${isMobile 
                ? "fixed inset-0 z-[1000] bg-white pt-20" 
                : "w-[320px] bg-white/10 backdrop-blur-[11px] rounded-3xl p-6 shadow-[0_40px_80px_rgba(0,0,0,0.4)] border border-white/20"
              }
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {isMobile && (
              <button 
                onClick={closePickers}
                className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 text-slate-900"
              >
                <X className="w-6 h-6" />
              </button>
            )}
            <div className={`space-y-8 ${isMobile ? 'p-8' : ''}`}>
              {isMobile && <h3 className="text-3xl font-bold text-slate-900 mb-8">Who's coming?</h3>}
              {[
                { key: 'adults', label: 'Adults', desc: 'Ages 13 or above' },
                { key: 'children', label: 'Children', desc: 'Ages 2 – 12' },
                { key: 'infants', label: 'Infants', desc: 'Under 2' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-lg drop-shadow-sm">{item.label}</div>
                    <div className="text-sm text-white/60">{item.desc}</div>
                  </div>
                  <div className="flex items-center gap-6">
                    <button 
                      disabled={guests[item.key as keyof typeof guests] === (item.key === 'adults' ? 1 : 0)}
                      onClick={() => setGuests(prev => ({ ...prev, [item.key]: prev[item.key as keyof typeof guests] - 1 }))}
                      className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:border-primary hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="w-4 text-center font-bold text-white text-xl drop-shadow-sm">{guests[item.key as keyof typeof guests]}</span>
                    <button 
                      onClick={() => setGuests(prev => ({ ...prev, [item.key]: prev[item.key as keyof typeof guests] + 1 }))}
                      className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:border-primary hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              {isMobile && (
                <div className="pt-8">
                  <button 
                    onClick={() => setShowGuestPicker(false)}
                    className="w-full bg-slate-900 text-white py-4 rounded-full font-bold shadow-xl shadow-slate-900/20"
                  >
                    Show results
                  </button>
                </div>
              )}
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};