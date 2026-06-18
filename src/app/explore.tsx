import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin, Search, ChevronDown, SlidersHorizontal,
  Heart, ShieldCheck, Map as MapIcon, Calendar,
  Users, Check, X, Maximize2, Minimize2, Share2, Bed, Bath,
  Phone, Maximize, Clock, Filter, Grid, Home, Info
} from 'lucide-react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { Navbar } from './components/navbar';
import { Footer } from './components/footer';
import { MOCK_PROPERTIES } from './data';

type TabType = 'Buy' | 'Rent' | 'Shortlet';

const BRAND = '#7B1C3E';

// ── Title Type data ──────────────────────────────────────
const TITLE_TYPES = [
  { value: 'C of O', tip: 'Certificate of Occupancy — the strongest land title issued by the state government.' },
  { value: "Governor's Consent", tip: "Governor's approval required when transferring land in urban areas." },
  { value: 'Gazette', tip: 'Government publication confirming land has been excised from acquisition.' },
  { value: 'Deed of Assignment', tip: 'Legal document transferring property ownership between parties.' },
  { value: 'Freehold', tip: 'Full ownership of land and buildings with no time limit.' },
  { value: 'Leasehold', tip: 'Right to use land/property for a fixed number of years.' },
  { value: 'Global C of O', tip: 'Single C of O covering an entire estate, not individual plots.' },
  { value: 'Excision', tip: 'Government release of acquired land back to the original community.' },
];

const SHORTLET_AMENITIES = ['Pool', 'WiFi', 'Gym', 'Parking', 'Security', 'Generator'];
const FURNISHING_OPTIONS = ['Furnished', 'Semi-Furnished', 'Unfurnished'];

const PRICE_RANGES: Record<TabType, { min: number; max: number; step: number }> = {
  Buy: { min: 0, max: 500_000_000, step: 5_000_000 },
  Rent: { min: 0, max: 20_000_000, step: 200_000 },
  Shortlet: { min: 0, max: 500_000, step: 5_000 },
};

const formatPrice = (val: number): string => {
  if (val >= 1_000_000_000) return `₦${(val / 1_000_000_000).toFixed(1)}B`;
  if (val >= 1_000_000) return `₦${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `₦${(val / 1_000).toFixed(0)}K`;
  return `₦${val.toLocaleString()}`;
};

const formatPriceInput = (val: number): string => `₦${val.toLocaleString()}`;

type ChipDef = { key: string; label: string };
const TAB_CHIPS: Record<TabType, ChipDef[]> = {
  Buy: [
    { key: 'Price', label: 'Price' },
    { key: 'Property Type', label: 'Property Type' },
    { key: 'Title Type', label: 'Title Type' },
    { key: 'Bedrooms', label: 'Bedrooms' },
    { key: 'More', label: 'More Filters' },
  ],
  Rent: [
    { key: 'Price', label: 'Price/month' },
    { key: 'Property Type', label: 'Property Type' },
    { key: 'Bedrooms', label: 'Bedrooms' },
    { key: 'Furnishing', label: 'Furnishing' },
    { key: 'More', label: 'More Filters' },
  ],
  Shortlet: [
    { key: 'Price', label: 'Price/night' },
    { key: 'Property Type', label: 'Property Type' },
    { key: 'Guests', label: 'Guests' },
    { key: 'Amenities', label: 'Amenities' },
    { key: 'More', label: 'More Filters' },
  ],
};

const PROPERTY_TYPES: Record<TabType, string[]> = {
  Buy: ['Duplex', 'Mansion', 'Apartment', 'Bungalow', 'Terrace', 'Villa'],
  Rent: ['Apartment', 'Duplex', 'Penthouse', 'Bungalow'],
  Shortlet: ['Apartment', 'Penthouse', 'Villa', 'Studio'],
};

// ── Dual Range Slider ─────────────────────────────────────────────────
const DualRangeSlider: React.FC<{
  min: number; max: number; step: number;
  low: number; high: number;
  onLowChange: (v: number) => void;
  onHighChange: (v: number) => void;
}> = ({ min, max, step, low, high, onLowChange, onHighChange }) => {
  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  return (
    <div className="relative h-8 flex items-center select-none">
      <div className="absolute inset-x-0 h-1.5 rounded-full bg-slate-200" />
      <div
        className="absolute h-1.5 rounded-full"
        style={{ left: `${pct(low)}%`, right: `${100 - pct(high)}%`, backgroundColor: BRAND }}
      />
      <input
        type="range" min={min} max={max} step={step} value={low}
        onChange={e => { const v = Number(e.target.value); if (v <= high) onLowChange(v); }}
        className="absolute inset-x-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:opacity-0 [&::-webkit-slider-thumb]:cursor-pointer z-[3]"
      />
      <input
        type="range" min={min} max={max} step={step} value={high}
        onChange={e => { const v = Number(e.target.value); if (v >= low) onHighChange(v); }}
        className="absolute inset-x-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:opacity-0 [&::-webkit-slider-thumb]:cursor-pointer z-[4]"
      />
      <div className="absolute w-5 h-5 rounded-full border-2 border-white shadow-md pointer-events-none z-[5]"
        style={{ left: `calc(${pct(low)}% - 10px)`, backgroundColor: BRAND }} />
      <div className="absolute w-5 h-5 rounded-full border-2 border-white shadow-md pointer-events-none z-[5]"
        style={{ left: `calc(${pct(high)}% - 10px)`, backgroundColor: BRAND }} />
    </div>
  );
};

// ── Bottom Sheet (mobile) ─────────────────────────────────────────────
const BottomSheet: React.FC<{
  isOpen: boolean; onClose: () => void; title: string;
  fullScreen?: boolean; children: React.ReactNode; footer?: React.ReactNode;
}> = ({ isOpen, onClose, title, fullScreen, children, footer }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 z-[200] md:hidden" onClick={onClose} />
        <motion.div
          initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[201] md:hidden flex flex-col ${fullScreen ? 'top-4' : 'max-h-[85vh]'}`}
        >
          <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100 shrink-0 relative">
            <div className="w-10 h-1 rounded-full bg-slate-200 absolute top-2 left-1/2 -translate-x-1/2" />
            <h3 className="text-slate-900 font-black text-sm">{title}</h3>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-5 h-5" /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
          {footer && <div className="px-5 py-3 border-t border-slate-100 shrink-0">{footer}</div>}
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// ── Desktop Dropdown — portal-based so overflow-x-auto never clips it ──
const DesktopDropdown: React.FC<{
  anchorEl: HTMLElement | null;
  isOpen: boolean;
  onClose: () => void;
  width?: number;
  align?: 'left' | 'right';
  children: React.ReactNode;
}> = ({ anchorEl, isOpen, onClose, width = 288, align = 'left', children }) => {
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && anchorEl) {
      const rect = anchorEl.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 12,
        left: align === 'right' ? rect.right - width : rect.left,
      });
    }
  }, [isOpen, anchorEl, align, width]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[500]" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'fixed', top: coords.top, left: coords.left, width, zIndex: 501 }}
            className="bg-white rounded-[20px] shadow-[0_20px_48px_rgba(0,0,0,0.15)] border border-slate-200 origin-top-left"
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export const Explore = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const getInitialTab = (): TabType => {
    const type = searchParams.get('type');
    if (!type) return 'Buy';
    const formatted = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    if (['Buy', 'Rent', 'Shortlet'].includes(formatted)) return formatted as TabType;
    return 'Buy';
  };

  // ── Core state ────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<TabType>(getInitialTab());
  const [searchQuery, setSearchQuery] = useState(searchParams.get('location') || '');
  const [mapExpanded, setMapExpanded] = useState(false);
  const [showMobileMap, setShowMobileMap] = useState(false);
  const [hoveredPin, setHoveredPin] = useState<number | null>(null);
  const [compareList, setCompareList] = useState<number[]>([]);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [showComparePanel, setShowComparePanel] = useState(false);
  const [quickViewId, setQuickViewId] = useState<number | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // ── Filter state ──────────────────────────────────────
  const [activeFilters, setActiveFilters] = useState<Record<string, string | string[]>>(() => {
    const filters: Record<string, string> = {};
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = searchParams.get('guests');
    if (checkIn) filters['Check-in'] = checkIn.split('T')[0];
    if (checkOut) filters['Check-out'] = checkOut.split('T')[0];
    if (guests) {
      const g = parseInt(guests, 10);
      if (g <= 2) filters['Guests'] = '1-2';
      else if (g <= 4) filters['Guests'] = '3-4';
      else filters['Guests'] = '5+';
    }
    return filters;
  });

  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(PRICE_RANGES[getInitialTab()].max);
  const [priceMinInput, setPriceMinInput] = useState('');
  const [priceMaxInput, setPriceMaxInput] = useState('');
  const [moreMinLand, setMoreMinLand] = useState('');
  const [moreMaxLand, setMoreMaxLand] = useState('');
  const [activeFilterDropdown, setActiveFilterDropdown] = useState<string | null>(null);
  const [mobileSheet, setMobileSheet] = useState<string | null>(null);

  // Shortlet date picker dropdown
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Refs for portal-based dropdowns — keyed by filter name
  const chipRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const searchBarRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isFirstMount = useRef(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset on tab change
  useEffect(() => {
    if (isFirstMount.current) { isFirstMount.current = false; return; }
    setActiveFilters({});
    setPriceMin(0);
    setPriceMax(PRICE_RANGES[activeTab].max);
    setPriceMinInput('');
    setPriceMaxInput('');
    setMoreMinLand('');
    setMoreMaxLand('');
    setActiveFilterDropdown(null);
    setMobileSheet(null);
    setCompareList([]);
    setIsCompareMode(false);
    setShowDatePicker(false);
  }, [activeTab]);

  // ── Filter helpers ────────────────────────────────────
  const setFilter = (key: string, val: string | string[]) =>
    setActiveFilters(prev => ({ ...prev, [key]: val }));

  const removeFilter = (key: string) =>
    setActiveFilters(prev => { const n = { ...prev }; delete n[key]; return n; });

  const clearAllFilters = () => {
    setActiveFilters({});
    setPriceMin(0);
    setPriceMax(PRICE_RANGES[activeTab].max);
    setPriceMinInput('');
    setPriceMaxInput('');
    setMoreMinLand('');
    setMoreMaxLand('');
  };

  const openDropdown = (key: string) => {
    if (isMobile) {
      setMobileSheet(key);
      setActiveFilterDropdown(null);
    } else {
      setActiveFilterDropdown(prev => prev === key ? null : key);
      setMobileSheet(null);
    }
  };

  const closeDropdown = () => {
    setActiveFilterDropdown(null);
    setMobileSheet(null);
  };

  // ── Computed values ────────────────────────────────────
  const hasPriceFilter = priceMin > 0 || priceMax < PRICE_RANGES[activeTab].max;
  const hasLandFilter = moreMinLand !== '' || moreMaxLand !== '';
  const activeFilterCount = Object.keys(activeFilters).length + (hasPriceFilter ? 1 : 0) + (hasLandFilter ? 1 : 0);

  const isChipActive = (key: string): boolean => {
    if (key === 'Price') return hasPriceFilter;
    if (key === 'More') return hasLandFilter;
    return !!activeFilters[key];
  };

  const chipCount = (key: string): number => {
    if (key === 'Amenities' && Array.isArray(activeFilters['Amenities'])) return (activeFilters['Amenities'] as string[]).length;
    return 0;
  };

  const getFilterTags = (): { key: string; label: string }[] => {
    const tags: { key: string; label: string }[] = [];
    if (hasPriceFilter) tags.push({ key: '_price', label: `${formatPrice(priceMin)} – ${formatPrice(priceMax)}` });
    Object.keys(activeFilters).forEach(k => {
      const val = activeFilters[k];
      if (Array.isArray(val)) tags.push({ key: k, label: `${k}: ${val.join(', ')}` });
      else tags.push({ key: k, label: `${k}: ${val}` });
    });
    if (hasLandFilter) tags.push({ key: '_land', label: `Land: ${moreMinLand || '0'} – ${moreMaxLand || 'Any'} sqm` });
    return tags;
  };

  const removeTag = (key: string) => {
    if (key === '_price') { setPriceMin(0); setPriceMax(PRICE_RANGES[activeTab].max); setPriceMinInput(''); setPriceMaxInput(''); }
    else if (key === '_land') { setMoreMinLand(''); setMoreMaxLand(''); }
    else removeFilter(key);
  };

  // ── Filtering logic ────────────────────────────────────
  const filteredProperties = MOCK_PROPERTIES.filter(p => {
    if (p.type !== activeTab) return false;
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.location.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeFilters['Property Type'] && p.propertyType !== activeFilters['Property Type']) return false;
    if (activeFilters['Bedrooms']) {
      const val = activeFilters['Bedrooms'] as string;
      const beds = parseInt(val.charAt(0));
      if (val.includes('+')) { if (p.bedrooms < beds) return false; }
      else { if (p.bedrooms !== beds) return false; }
    }
    if (activeTab === 'Shortlet' && activeFilters['Guests']) {
      const g = activeFilters['Guests'] as string;
      if (g === '1-2' && p.bedrooms > 2) return false;
      if (g === '3-4' && (p.bedrooms < 2 || p.bedrooms > 4)) return false;
      if (g === '5+' && p.bedrooms < 3) return false;
    }
    if (hasPriceFilter) {
      const raw = p.price.replace(/[₦,]/g, '');
      const num = parseFloat(raw);
      if (!isNaN(num) && (num < priceMin || num > priceMax)) return false;
    }
    return true;
  });

  // ── Price input sync ───────────────────────────────────
  const handlePriceMinInput = (raw: string) => {
    const cleaned = raw.replace(/[^0-9]/g, '');
    setPriceMinInput(cleaned ? formatPriceInput(parseInt(cleaned)) : '');
    if (cleaned) { const v = parseInt(cleaned); if (v <= priceMax) setPriceMin(v); }
    else setPriceMin(0);
  };

  const handlePriceMaxInput = (raw: string) => {
    const cleaned = raw.replace(/[^0-9]/g, '');
    setPriceMaxInput(cleaned ? formatPriceInput(parseInt(cleaned)) : '');
    if (cleaned) { const v = parseInt(cleaned); if (v >= priceMin) setPriceMax(v); }
    else setPriceMax(PRICE_RANGES[activeTab].max);
  };

  // ── Compare helpers ────────────────────────────────────
  const toggleCompare = (id: number) => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(pid => pid !== id);
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  };

  // ── Dropdown content renderers ─────────────────────────
  const renderPriceContent = () => {
    const range = PRICE_RANGES[activeTab];
    return (
      <div className="space-y-4">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          {activeTab === 'Rent' ? 'Price / month' : activeTab === 'Shortlet' ? 'Price / night' : 'Price'}
        </span>
        <div className="flex items-center justify-between text-xs font-bold text-slate-600">
          <span>{formatPrice(priceMin)}</span>
          <span>{formatPrice(priceMax)}</span>
        </div>
        <DualRangeSlider
          min={range.min} max={range.max} step={range.step}
          low={priceMin} high={priceMax}
          onLowChange={v => { setPriceMin(v); setPriceMinInput(v > 0 ? formatPriceInput(v) : ''); }}
          onHighChange={v => { setPriceMax(v); setPriceMaxInput(v < range.max ? formatPriceInput(v) : ''); }}
        />
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <div className="space-y-1.5">
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Min Price</span>
            <input type="text" value={priceMinInput} onChange={e => handlePriceMinInput(e.target.value)} placeholder="₦0"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#7B1C3E] focus:bg-white focus:ring-2 focus:ring-[#7B1C3E]/10 transition-all" />
          </div>
          <div className="space-y-1.5">
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Max Price</span>
            <input type="text" value={priceMaxInput} onChange={e => handlePriceMaxInput(e.target.value)} placeholder="Any"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#7B1C3E] focus:bg-white focus:ring-2 focus:ring-[#7B1C3E]/10 transition-all" />
          </div>
        </div>
      </div>
    );
  };

  const renderPropertyTypeContent = () => (
    <div className="space-y-1">
      {PROPERTY_TYPES[activeTab].map(opt => {
        const isSel = activeFilters['Property Type'] === opt;
        return (
          <button key={opt} onClick={() => setFilter('Property Type', opt)}
            className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all font-bold flex items-center justify-between ${isSel ? 'text-white' : 'text-slate-700 hover:bg-slate-50 hover:text-[#7B1C3E]'}`}
            style={isSel ? { backgroundColor: BRAND } : {}}>
            <span>{opt}</span>
            {isSel && <Check className="w-4 h-4 text-white shrink-0" />}
          </button>
        );
      })}
    </div>
  );

  const renderBedroomsContent = () => (
    <div className="grid grid-cols-4 gap-2">
      {['1', '2', '3', '4+'].map(num => {
        const val = `${num} Bed${num === '1' ? '' : 's'}`;
        const isSel = activeFilters['Bedrooms'] === val;
        return (
          <button key={num} onClick={() => setFilter('Bedrooms', val)}
            className={`h-10 rounded-xl border text-sm font-black transition-all duration-200 ${isSel ? 'border-transparent text-white shadow-md' : 'border-slate-200 text-slate-600 hover:border-[#7B1C3E]/30 hover:bg-[#7B1C3E]/5 hover:text-[#7B1C3E]'}`}
            style={isSel ? { backgroundColor: BRAND, borderColor: BRAND } : {}}>
            {num}
          </button>
        );
      })}
    </div>
  );

  const renderTitleTypeContent = () => (
    <div className="grid grid-cols-2 gap-2">
      {TITLE_TYPES.map(tt => {
        const isSel = activeFilters['Title Type'] === tt.value;
        return (
          <div key={tt.value} className="relative group">
            <button onClick={() => setFilter('Title Type', tt.value)}
              className={`w-full px-3 py-2.5 rounded-xl border text-[11px] font-bold transition-all flex items-center gap-1.5 ${isSel ? 'border-transparent text-white' : 'border-slate-200 text-slate-700 hover:border-[#7B1C3E]/30 hover:bg-[#7B1C3E]/5'}`}
              style={isSel ? { backgroundColor: BRAND, borderColor: BRAND } : {}}>
              <span className="truncate flex-1 text-left">{tt.value}</span>
              <Info className={`w-3 h-3 shrink-0 ${isSel ? 'text-white/60' : 'text-slate-300'}`} />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-slate-900 text-white text-[10px] font-medium px-3 py-2 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[60] pointer-events-none">
              {tt.tip}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 -mt-1" />
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderGuestsContent = () => (
    <div className="space-y-1">
      {['1-2', '3-4', '5+'].map(opt => {
        const isSel = activeFilters['Guests'] === opt;
        return (
          <button key={opt} onClick={() => setFilter('Guests', opt)}
            className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all font-bold flex items-center justify-between ${isSel ? 'text-white' : 'text-slate-700 hover:bg-slate-50 hover:text-[#7B1C3E]'}`}
            style={isSel ? { backgroundColor: BRAND } : {}}>
            <span>{opt} guests</span>
            {isSel && <Check className="w-4 h-4 text-white shrink-0" />}
          </button>
        );
      })}
    </div>
  );

  const renderFurnishingContent = () => (
    <div className="space-y-1">
      {FURNISHING_OPTIONS.map(opt => {
        const isSel = activeFilters['Furnishing'] === opt;
        return (
          <button key={opt} onClick={() => setFilter('Furnishing', opt)}
            className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all font-bold flex items-center justify-between ${isSel ? 'text-white' : 'text-slate-700 hover:bg-slate-50 hover:text-[#7B1C3E]'}`}
            style={isSel ? { backgroundColor: BRAND } : {}}>
            <span>{opt}</span>
            {isSel && <Check className="w-4 h-4 text-white shrink-0" />}
          </button>
        );
      })}
    </div>
  );

  const renderAmenitiesContent = () => {
    const selected = (activeFilters['Amenities'] as string[]) || [];
    return (
      <div className="flex flex-wrap gap-2">
        {SHORTLET_AMENITIES.map(a => {
          const isSel = selected.includes(a);
          return (
            <button key={a}
              onClick={() => {
                const next = isSel ? selected.filter(x => x !== a) : [...selected, a];
                if (next.length === 0) removeFilter('Amenities');
                else setFilter('Amenities', next);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold border transition-all ${isSel ? 'border-transparent text-white' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-[#7B1C3E]/30'}`}
              style={isSel ? { backgroundColor: BRAND, borderColor: BRAND } : {}}>
              {a}
            </button>
          );
        })}
      </div>
    );
  };

  const renderMoreFiltersContent = () => (
    <div className="space-y-5">
      <div>
        <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2 block">Land size (sqm)</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Min</span>
            <input type="text" value={moreMinLand} onChange={e => setMoreMinLand(e.target.value.replace(/[^0-9]/g, ''))} placeholder="0"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#7B1C3E] focus:bg-white focus:ring-2 focus:ring-[#7B1C3E]/10 transition-all" />
          </div>
          <div className="space-y-1.5">
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Max</span>
            <input type="text" value={moreMaxLand} onChange={e => setMoreMaxLand(e.target.value.replace(/[^0-9]/g, ''))} placeholder="Any"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#7B1C3E] focus:bg-white focus:ring-2 focus:ring-[#7B1C3E]/10 transition-all" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderDropdownFooter = (key: string) => (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
      <button
        onClick={() => {
          if (key === 'Price') { setPriceMin(0); setPriceMax(PRICE_RANGES[activeTab].max); setPriceMinInput(''); setPriceMaxInput(''); }
          else if (key === 'More') { setMoreMinLand(''); setMoreMaxLand(''); }
          else removeFilter(key);
        }}
        className="text-xs font-bold text-slate-400 hover:text-[#7B1C3E] transition-colors">
        Clear
      </button>
      <button onClick={closeDropdown}
        className="px-5 py-2 rounded-full text-white text-xs font-bold transition-all hover:opacity-90"
        style={{ backgroundColor: BRAND }}>
        Apply
      </button>
    </div>
  );

  const getDropdownContent = (key: string) => {
    switch (key) {
      case 'Price': return renderPriceContent();
      case 'Property Type': return renderPropertyTypeContent();
      case 'Bedrooms': return renderBedroomsContent();
      case 'Title Type': return renderTitleTypeContent();
      case 'Guests': return renderGuestsContent();
      case 'Furnishing': return renderFurnishingContent();
      case 'Amenities': return renderAmenitiesContent();
      case 'More': return renderMoreFiltersContent();
      default: return null;
    }
  };

  const getDropdownTitle = (key: string) => TAB_CHIPS[activeTab].find(c => c.key === key)?.label || key;

  const getDropdownWidth = (key: string): number => {
    if (key === 'Price') return 300;
    if (key === 'Title Type') return 340;
    if (key === 'More') return 300;
    if (key === 'Amenities') return 280;
    return 220;
  };

  const resultLabel = activeTab === 'Shortlet' ? 'stays' : activeTab === 'Rent' ? 'rentals' : 'homes for sale';

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-24 pb-20 lg:pb-0 font-['Urbanist'] selection:bg-primary selection:text-white">
      <Navbar />

      {/* ── Sticky Search & Filter Top Bar ── */}
      <div
        className={`sticky top-[64px] z-40 transition-all duration-300 border-b ${isSticky ? 'bg-white/90 backdrop-blur-xl shadow-md border-slate-200 py-3' : 'bg-transparent border-slate-200/60 py-5'}`}
      >
        <div className="container mx-auto flex flex-col items-center">
          <div className={`w-full max-w-5xl transition-all duration-300 ${isSticky ? 'px-4 flex items-center gap-4' : 'px-4'}`}>

            {/* Tabs */}
            <div className={`flex justify-center bg-white/80 backdrop-blur-md p-1 rounded-full border border-slate-200 shadow-sm shrink-0 max-w-full overflow-x-auto scrollbar-hide transition-all ${isSticky ? 'scale-90 origin-left' : 'mb-5 mx-auto w-fit'}`}>
              {(['Buy', 'Rent', 'Shortlet'] as TabType[]).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeTab === tab ? 'text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  style={activeTab === tab ? { backgroundColor: BRAND } : {}}>
                  {tab}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className={`flex-1 flex items-center bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-all focus-within:ring-2 focus-within:ring-[#7B1C3E]/20 focus-within:border-[#7B1C3E] p-1.5 ${isSticky ? 'h-[54px]' : 'h-[64px]'}`}>
              {/* Where */}
              <div className="flex-1 flex flex-col justify-center px-5 h-full border-r border-slate-100 hover:bg-slate-50 rounded-full cursor-pointer group transition-colors">
                <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 mb-0.5 group-hover:text-[#7B1C3E] transition-colors">Where</span>
                <div className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                  <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    placeholder={activeTab === 'Shortlet' ? 'Search destinations' : 'Search location (Lekki, Yaba, Abuja…)'}
                    className="w-full bg-transparent outline-none text-sm font-bold text-slate-900 placeholder:text-slate-400" />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="text-slate-300 hover:text-slate-500 shrink-0 ml-1">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Shortlet: When + Who */}
              {activeTab === 'Shortlet' && (
                <>
                  <div className="flex-1 hidden md:flex flex-col justify-center px-5 h-full border-r border-slate-100 hover:bg-slate-50 rounded-full cursor-pointer group transition-colors relative"
                    onClick={() => setShowDatePicker(p => !p)}>
                    <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 mb-0.5 group-hover:text-[#7B1C3E] transition-colors">When</span>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span className={`text-sm font-bold ${(activeFilters['Check-in'] || activeFilters['Check-out']) ? 'text-slate-900' : 'text-slate-400'}`}>
                        {activeFilters['Check-in'] && activeFilters['Check-out']
                          ? `${new Date(activeFilters['Check-in'] as string).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - ${new Date(activeFilters['Check-out'] as string).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
                          : activeFilters['Check-in']
                            ? `${new Date(activeFilters['Check-in'] as string).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - Add checkout`
                            : 'Add dates'}
                      </span>
                    </div>

                    <AnimatePresence>
                      {showDatePicker && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={e => { e.stopPropagation(); setShowDatePicker(false); }} />
                          <motion.div
                            initial={{ opacity: 0, y: 12, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.95 }}
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[720px] bg-white rounded-[32px] shadow-[0_24px_64px_rgba(0,0,0,0.15)] border border-slate-200 p-8 z-50 origin-top"
                            onClick={e => e.stopPropagation()}>
                            <div className="text-center mb-8">
                              <span className="text-slate-900 font-black text-sm uppercase tracking-widest">
                                {activeFilters['Check-in'] && activeFilters['Check-out']
                                  ? `${new Date(activeFilters['Check-in'] as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — ${new Date(activeFilters['Check-out'] as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                                  : activeFilters['Check-in']
                                    ? `${new Date(activeFilters['Check-in'] as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — ...`
                                    : 'Select dates'}
                              </span>
                            </div>
                            <div className="flex gap-12">
                              {[{ name: 'April 2026', month: '2026-04', days: 30, startDay: 3 }, { name: 'May 2026', month: '2026-05', days: 31, startDay: 5 }].map(cal => (
                                <div key={cal.month} className="flex-1">
                                  <div className="text-center mb-6">
                                    <span className="text-sm font-black text-slate-900">{cal.name}</span>
                                  </div>
                                  <div className="grid grid-cols-7 gap-y-1">
                                    {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(d => (
                                      <div key={d} className="text-[11px] font-black text-slate-400 text-center uppercase py-2 tracking-widest">{d}</div>
                                    ))}
                                    {Array.from({ length: cal.startDay }).map((_, i) => <div key={`e${i}`} />)}
                                    {Array.from({ length: cal.days }, (_, i) => {
                                      const day = i + 1;
                                      const dateStr = `${cal.month}-${day.toString().padStart(2, '0')}`;
                                      const isStart = activeFilters['Check-in'] === dateStr;
                                      const isEnd = activeFilters['Check-out'] === dateStr;
                                      const isInRange = activeFilters['Check-in'] && activeFilters['Check-out'] &&
                                        dateStr > (activeFilters['Check-in'] as string) && dateStr < (activeFilters['Check-out'] as string);
                                      return (
                                        <div key={dateStr} className="relative aspect-square flex items-center justify-center">
                                          {isInRange && <div className="absolute inset-y-1.5 inset-x-0 bg-[#7B1C3E]/10" />}
                                          {isStart && activeFilters['Check-out'] && <div className="absolute inset-y-1.5 right-0 w-1/2 bg-[#7B1C3E]/10" />}
                                          {isEnd && activeFilters['Check-in'] && <div className="absolute inset-y-1.5 left-0 w-1/2 bg-[#7B1C3E]/10" />}
                                          <button
                                            onClick={() => {
                                              if (!activeFilters['Check-in'] || (activeFilters['Check-in'] && activeFilters['Check-out'])) {
                                                setFilter('Check-in', dateStr); removeFilter('Check-out');
                                              } else if (dateStr > (activeFilters['Check-in'] as string)) {
                                                setFilter('Check-out', dateStr);
                                              } else { setFilter('Check-in', dateStr); }
                                            }}
                                            className={`w-9 h-9 flex items-center justify-center text-sm font-bold rounded-full transition-all z-10 relative ${isStart || isEnd ? 'text-white shadow-lg' : isInRange ? 'text-[#7B1C3E] font-black' : 'text-slate-600 hover:bg-slate-100'}`}
                                            style={(isStart || isEnd) ? { backgroundColor: BRAND } : {}}>
                                            {day}
                                          </button>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                              <button onClick={() => { removeFilter('Check-in'); removeFilter('Check-out'); }}
                                className="text-xs font-black text-slate-400 hover:text-[#7B1C3E] transition-colors uppercase tracking-widest">Clear</button>
                              <button onClick={() => setShowDatePicker(false)}
                                className="px-8 py-3 text-white text-xs font-black rounded-full hover:opacity-90 transition-all shadow-lg uppercase tracking-widest"
                                style={{ backgroundColor: BRAND }}>Apply dates</button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  <div ref={el => { searchBarRefs.current['Guests'] = el; }}
                    className="flex-1 hidden md:flex flex-col justify-center px-5 h-full hover:bg-slate-50 rounded-full cursor-pointer group transition-colors relative"
                    onClick={() => openDropdown('Guests')}>
                    <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 mb-0.5 group-hover:text-[#7B1C3E] transition-colors">Who</span>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className={`text-sm font-bold ${activeFilters['Guests'] ? 'text-slate-900' : 'text-slate-400'}`}>
                        {activeFilters['Guests'] ? `${activeFilters['Guests']} Guests` : 'Add guests'}
                      </span>
                    </div>
                    <DesktopDropdown anchorEl={searchBarRefs.current['Guests']} isOpen={!isMobile && activeFilterDropdown === 'Guests'} onClose={closeDropdown} width={192} align="right">
                      <div className="p-4">{renderGuestsContent()}</div>
                      {renderDropdownFooter('Guests')}
                    </DesktopDropdown>
                  </div>
                </>
              )}

              {/* Buy: Property Type inline */}
              {activeTab === 'Buy' && (
                <div ref={el => { searchBarRefs.current['Property Type'] = el; }}
                  className="flex-1 hidden md:flex flex-col justify-center px-5 h-full hover:bg-slate-50 rounded-full cursor-pointer group transition-colors relative"
                  onClick={() => openDropdown('Property Type')}>
                  <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 mb-0.5 group-hover:text-[#7B1C3E] transition-colors">Property Type</span>
                  <div className="flex items-center gap-2">
                    <Home className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className={`text-sm font-bold ${activeFilters['Property Type'] ? 'text-slate-900' : 'text-slate-400'}`}>
                      {(activeFilters['Property Type'] as string) || 'All types'}
                    </span>
                  </div>
                  <DesktopDropdown anchorEl={searchBarRefs.current['Property Type']} isOpen={!isMobile && activeFilterDropdown === 'Property Type'} onClose={closeDropdown} width={220} align="right">
                    <div className="p-4">{renderPropertyTypeContent()}</div>
                    {renderDropdownFooter('Property Type')}
                  </DesktopDropdown>
                </div>
              )}

              {/* Rent: Bedrooms inline */}
              {activeTab === 'Rent' && (
                <div ref={el => { searchBarRefs.current['Bedrooms'] = el; }}
                  className="flex-1 hidden md:flex flex-col justify-center px-5 h-full hover:bg-slate-50 rounded-full cursor-pointer group transition-colors relative"
                  onClick={() => openDropdown('Bedrooms')}>
                  <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 mb-0.5 group-hover:text-[#7B1C3E] transition-colors">Bedrooms</span>
                  <div className="flex items-center gap-2">
                    <Bed className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className={`text-sm font-bold ${activeFilters['Bedrooms'] ? 'text-slate-900' : 'text-slate-400'}`}>
                      {(activeFilters['Bedrooms'] as string) || 'Any'}
                    </span>
                  </div>
                  <DesktopDropdown anchorEl={searchBarRefs.current['Bedrooms']} isOpen={!isMobile && activeFilterDropdown === 'Bedrooms'} onClose={closeDropdown} width={220} align="right">
                    <div className="p-4">{renderBedroomsContent()}</div>
                    {renderDropdownFooter('Bedrooms')}
                  </DesktopDropdown>
                </div>
              )}

              {/* Search Button */}
              <button className={`rounded-full flex items-center justify-center text-white hover:opacity-90 transition-colors shrink-0 shadow-md ml-1.5 ${isSticky ? 'w-10 h-10' : 'w-11 h-11'}`} style={{ backgroundColor: BRAND }}>
                <Search className={isSticky ? 'w-4 h-4' : 'w-4.5 h-4.5'} />
              </button>
            </div>

            {/* Mobile Filter Button */}
            <button onClick={() => setMobileSheet('MobileAll')}
              className="md:hidden ml-2 p-3 bg-white border border-slate-200 rounded-full shadow-sm text-slate-700 flex items-center gap-2 shrink-0">
              <Filter className="w-5 h-5" />
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full text-white text-[10px] font-black flex items-center justify-center" style={{ backgroundColor: BRAND }}>
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* ── Filter Chip Bar (desktop, hides when sticky) ── */}
          <div className={`hidden md:flex w-full max-w-5xl transition-all duration-300 ${isSticky ? 'h-0 opacity-0 overflow-hidden' : 'h-auto opacity-100 mt-2 px-4'}`}>
            <div className="flex items-center gap-4 w-full">
              <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.15em] shrink-0" style={{ color: BRAND }}>
                <SlidersHorizontal className="w-4 h-4" strokeWidth={2.5} />
                Filter By
              </div>

              <div className="flex-1 flex gap-2 overflow-x-auto py-2 scrollbar-hide items-center">
                {TAB_CHIPS[activeTab].map(chip => {
                  const active = isChipActive(chip.key);
                  const count = chipCount(chip.key);
                  const isOpen = activeFilterDropdown === chip.key;
                  const isMoreBtn = chip.key === 'More';

                  return (
                    <div key={chip.key} className="relative shrink-0">
                      <button
                        ref={el => { chipRefs.current[chip.key] = el; }}
                        onClick={() => openDropdown(chip.key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-black whitespace-nowrap transition-all duration-300 bg-white ${active ? '' : isOpen ? 'border-[#7B1C3E] bg-[#7B1C3E]/5 text-[#7B1C3E]' : 'border-slate-200 text-slate-700 hover:border-[#7B1C3E]/30 hover:bg-slate-50'}`}
                        style={active ? { borderColor: BRAND, borderWidth: 2, color: BRAND } : {}}>
                        {isMoreBtn && <Filter className="w-3.5 h-3.5" />}
                        <span>{chip.label}</span>
                        {active && count > 0 && (
                          <span className="min-w-[18px] px-1 rounded-full text-[9px] font-black flex items-center justify-center text-white" style={{ backgroundColor: BRAND }}>{count}</span>
                        )}
                        {!isMoreBtn && (
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 opacity-60 ${isOpen ? 'rotate-180' : ''}`} />
                        )}
                      </button>

                      {/* Desktop Dropdowns — portal-based */}
                      {!isMoreBtn && (
                        <DesktopDropdown anchorEl={chipRefs.current[chip.key]} isOpen={!isMobile && activeFilterDropdown === chip.key} onClose={closeDropdown} width={getDropdownWidth(chip.key)}>
                          <div className="p-4">{getDropdownContent(chip.key)}</div>
                          {renderDropdownFooter(chip.key)}
                        </DesktopDropdown>
                      )}
                      {isMoreBtn && (
                        <DesktopDropdown anchorEl={chipRefs.current['More']} isOpen={!isMobile && activeFilterDropdown === 'More'} onClose={closeDropdown} width={300} align="right">
                          <div className="p-4">{renderMoreFiltersContent()}</div>
                          {renderDropdownFooter('More')}
                        </DesktopDropdown>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Active Filter Tags Row ── */}
          <AnimatePresence>
            {activeFilterCount > 0 && !isSticky && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="w-full max-w-5xl px-4 overflow-hidden">
                <div className="flex items-center gap-2 flex-wrap pt-2 pb-1">
                  {getFilterTags().map(tag => (
                    <motion.span key={tag.key}
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold"
                      style={{ backgroundColor: '#7B1C3E10', color: BRAND }}>
                      {tag.label}
                      <button onClick={() => removeTag(tag.key)} className="hover:opacity-70 transition-opacity">
                        <X className="w-3 h-3" />
                      </button>
                    </motion.span>
                  ))}
                  <button onClick={clearAllFilters}
                    className="text-[10px] font-black uppercase tracking-widest hover:underline transition-all px-2 py-1.5"
                    style={{ color: BRAND }}>
                    Clear all
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6 relative">

          {/* Left: Listings */}
          <div className={`flex flex-col gap-6 transition-all duration-500 mt-4 ${!mapExpanded ? 'flex-1' : 'w-full lg:w-[calc(100%-424px)] xl:w-[calc(100%-524px)] lg:flex-none'}`}>

            {/* Results header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-0.5">
                  {filteredProperties.length} {resultLabel} in Nigeria
                </h1>
                <AnimatePresence>
                  {activeFilterCount > 0 && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                      className="text-slate-400 text-xs font-medium">
                      {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'} applied
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                <button
                  onClick={() => { setIsCompareMode(!isCompareMode); if (isCompareMode) setCompareList([]); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm border shrink-0 ${isCompareMode ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50'}`}>
                  {isCompareMode ? <X className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />}
                  {isCompareMode ? 'Cancel Compare' : 'Compare'}
                </button>
                <button onClick={() => setMapExpanded(!mapExpanded)}
                  className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-full text-sm font-medium transition-colors shadow-sm shrink-0">
                  <MapIcon className="w-4 h-4" /> {mapExpanded ? 'Hide Map' : 'Show Map'}
                </button>
                <div className="relative shrink-0">
                  <select className="appearance-none bg-white border border-slate-200 text-sm font-medium text-slate-700 outline-none cursor-pointer px-4 py-2 pr-8 rounded-full shadow-sm hover:bg-slate-50">
                    <option>Newest</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Most Popular</option>
                    <option>Verified Listings</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                <button onClick={() => setShowMobileMap(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-sm font-medium shrink-0 shadow-sm">
                  <MapIcon className="w-4 h-4" /> Map
                </button>
              </div>
            </div>

            {/* Empty State */}
            {filteredProperties.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="bg-slate-50 p-6 rounded-full mb-6">
                  <Search className="w-12 h-12 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No properties found</h3>
                <p className="text-slate-500 max-w-md mb-8">We couldn't find any {activeTab.toLowerCase()} properties matching your filters. Try adjusting them.</p>
                <button onClick={clearAllFilters} className="px-6 py-2.5 text-white rounded-full font-bold shadow-lg hover:opacity-90 transition-colors" style={{ backgroundColor: BRAND }}>
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Property Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab + JSON.stringify(activeFilters) + priceMin + priceMax}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className={`grid gap-6 ${mapExpanded ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                {filteredProperties.map((property, idx) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: idx * 0.06 }}
                    onMouseEnter={() => setHoveredPin(property.id)}
                    onMouseLeave={() => setHoveredPin(null)}
                    onClick={() => !isCompareMode && navigate(`/property/${property.id}`)}
                    className={`group bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-md hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col ${hoveredPin === property.id ? 'ring-2 ring-offset-2 ring-offset-[#F8F9FA]' : ''}`}
                    style={hoveredPin === property.id ? { '--tw-ring-color': BRAND } as React.CSSProperties : {}}>
                    <div className="relative aspect-[3/2] overflow-hidden bg-slate-50">
                      <ImageWithFallback src={property.image} alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute top-3 left-3 flex gap-2">
                        {property.verified && (
                          <div className="bg-white px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-slate-100">
                            <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">Verified</span>
                          </div>
                        )}
                        <div className="bg-slate-900 px-2.5 py-1 rounded-md text-[10px] font-bold text-white tracking-widest uppercase">
                          {property.listedDate}
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 flex gap-2">
                        <button onClick={e => e.stopPropagation()}
                          className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-600 hover:text-red-500 transition-colors shadow-md border border-slate-100">
                          <Heart className="w-4 h-4" />
                        </button>
                        <button onClick={e => e.stopPropagation()}
                          className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors shadow-md border border-slate-100">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-1.5 text-slate-500 mb-2">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-xs font-semibold">{property.location}</span>
                      </div>
                      <h3 className="text-[17px] font-bold text-slate-900 mb-4 group-hover:text-[#7B1C3E] transition-colors line-clamp-1">{property.title}</h3>

                      <div className="flex flex-wrap gap-y-3 gap-x-4 mb-4 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Bed className="w-4 h-4" />
                          <span className="text-sm font-bold">{property.bedrooms} <span className="font-normal text-xs text-slate-500">Beds</span></span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Bath className="w-4 h-4" />
                          <span className="text-sm font-bold">{property.bathrooms} <span className="font-normal text-xs text-slate-500">Baths</span></span>
                        </div>
                        {property.landSize && (
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Maximize className="w-4 h-4" />
                            <span className="text-sm font-bold">{property.landSize}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest mb-1 bg-primary/5 w-fit px-2 py-0.5 rounded-md" style={{ color: BRAND }}>{property.propertyType}</span>
                          <span className="text-xl font-black text-slate-900 leading-none">{property.price}</span>
                        </div>
                        <div className="w-10 h-10 rounded-full border-2 border-white shadow-lg overflow-hidden shrink-0 group-hover:scale-110 transition-transform">
                          <img src={property.agent?.avatar} alt="Agent" className="w-full h-full object-cover" />
                        </div>
                      </div>

                      <AnimatePresence>
                        {isCompareMode && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            className="mt-4 pt-4 border-t border-slate-100 flex items-center overflow-hidden">
                            <label className={`flex items-center gap-3 cursor-pointer w-full ${compareList.length >= 2 && !compareList.includes(property.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                              onClick={e => { e.stopPropagation(); e.preventDefault(); toggleCompare(property.id); }}>
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${compareList.includes(property.id) ? 'border-transparent' : 'border-slate-300'}`}
                                style={compareList.includes(property.id) ? { backgroundColor: BRAND } : {}}>
                                {compareList.includes(property.id) && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <span className="text-sm font-bold text-slate-600">Add to compare</span>
                            </label>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {filteredProperties.length > 0 && (
              <div className="flex justify-center mt-8">
                <button className="px-8 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-full shadow-sm hover:shadow-md hover:bg-slate-50 transition-all flex items-center gap-2">
                  <Grid className="w-4 h-4" /> Load More Listings
                </button>
              </div>
            )}
          </div>

          {/* Right: Map (Desktop) */}
          <div className={`hidden lg:block sticky top-[180px] h-[calc(100vh-200px)] transition-all duration-500 rounded-[32px] overflow-hidden shadow-inner border border-slate-200 bg-slate-100 relative ${!mapExpanded ? 'w-0 opacity-0 overflow-hidden border-0' : 'w-[400px] xl:w-[500px]'}`}>
            <button onClick={() => setMapExpanded(!mapExpanded)}
              className="absolute top-4 left-4 z-10 bg-white shadow-md p-2.5 rounded-xl text-slate-700 hover:text-slate-900 hover:scale-105 transition-all">
              {mapExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <iframe title="Property Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126844.06232598687!2d3.3106574999999995!3d6.536965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2sus!4v1709664535353!5m2!1sen!2sus"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0" />
            {filteredProperties.map(property => (
              <motion.div key={`pin-${property.id}`}
                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                className="absolute cursor-pointer -translate-x-1/2 -translate-y-full"
                style={{ left: `${property.coordinates?.x ?? 50}%`, top: `${property.coordinates?.y ?? 50}%` }}
                onMouseEnter={() => setHoveredPin(property.id)}
                onMouseLeave={() => setHoveredPin(null)}
                onClick={() => setQuickViewId(property.id)}>
                <div className={`px-3 py-1.5 rounded-full font-bold text-sm shadow-lg whitespace-nowrap transition-all duration-300 origin-bottom flex items-center gap-1.5 ${hoveredPin === property.id ? 'bg-slate-900 text-white scale-110 z-20' : 'bg-white text-slate-900 z-10'}`}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: BRAND }} />
                  {property.price.split(' ')[0]}
                </div>
                <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent mx-auto mt-[-1px] transition-colors duration-300"
                  style={{ borderTopColor: hoveredPin === property.id ? '#0f172a' : 'white' }} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile Bottom Sheets (per-filter) ── */}
      {TAB_CHIPS[activeTab].filter(c => c.key !== 'More').map(chip => (
        <BottomSheet key={chip.key}
          isOpen={mobileSheet === chip.key}
          onClose={() => setMobileSheet(null)}
          title={getDropdownTitle(chip.key)}
          footer={renderDropdownFooter(chip.key)}>
          {getDropdownContent(chip.key)}
        </BottomSheet>
      ))}
      <BottomSheet isOpen={mobileSheet === 'More'} onClose={() => setMobileSheet(null)} title="More Filters" fullScreen footer={renderDropdownFooter('More')}>
        {renderMoreFiltersContent()}
      </BottomSheet>

      {/* ── Mobile: All Filters Bottom Sheet ── */}
      <BottomSheet isOpen={mobileSheet === 'MobileAll'} onClose={() => setMobileSheet(null)} title="Filters" fullScreen
        footer={
          <div className="flex gap-3">
            <button onClick={() => { clearAllFilters(); setMobileSheet(null); }}
              className="px-6 py-3 text-slate-500 font-bold hover:text-slate-900 transition-colors text-sm">Clear all</button>
            <button onClick={() => setMobileSheet(null)}
              className="flex-1 py-3 text-white rounded-full font-bold shadow-lg text-sm" style={{ backgroundColor: BRAND }}>
              Show {filteredProperties.length} results
            </button>
          </div>
        }>
        <div className="space-y-6">
          {/* Price */}
          <div>
            <h3 className="font-black text-slate-900 mb-3">{activeTab === 'Rent' ? 'Price / month' : activeTab === 'Shortlet' ? 'Price / night' : 'Price'}</h3>
            {renderPriceContent()}
          </div>
          <div className="border-t border-slate-100" />
          {/* Property Type */}
          <div>
            <h3 className="font-black text-slate-900 mb-3">Property Type</h3>
            {renderPropertyTypeContent()}
          </div>
          {activeTab === 'Buy' && (
            <>
              <div className="border-t border-slate-100" />
              <div>
                <h3 className="font-black text-slate-900 mb-3">Title Type</h3>
                {renderTitleTypeContent()}
              </div>
            </>
          )}
          {(activeTab === 'Buy' || activeTab === 'Rent') && (
            <>
              <div className="border-t border-slate-100" />
              <div>
                <h3 className="font-black text-slate-900 mb-3">Bedrooms</h3>
                {renderBedroomsContent()}
              </div>
            </>
          )}
          {activeTab === 'Rent' && (
            <>
              <div className="border-t border-slate-100" />
              <div>
                <h3 className="font-black text-slate-900 mb-3">Furnishing</h3>
                {renderFurnishingContent()}
              </div>
            </>
          )}
          {activeTab === 'Shortlet' && (
            <>
              <div className="border-t border-slate-100" />
              <div>
                <h3 className="font-black text-slate-900 mb-3">Guests</h3>
                {renderGuestsContent()}
              </div>
              <div className="border-t border-slate-100" />
              <div>
                <h3 className="font-black text-slate-900 mb-3">Amenities</h3>
                {renderAmenitiesContent()}
              </div>
            </>
          )}
          <div className="border-t border-slate-100" />
          <div>
            <h3 className="font-black text-slate-900 mb-3">More Filters</h3>
            {renderMoreFiltersContent()}
          </div>
        </div>
      </BottomSheet>

      {/* ── Compare Bar ── */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-6 z-[60]">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">{compareList.length}</div>
              <span className="font-medium whitespace-nowrap">Selected (Max 2)</span>
            </div>
            <div className="w-px h-6 bg-white/20" />
            <div className="flex items-center gap-3">
              <button className="text-white/70 hover:text-white text-sm font-medium transition-colors" onClick={() => setCompareList([])}>Clear</button>
              <button disabled={compareList.length < 2} onClick={() => setShowComparePanel(true)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold shadow-lg transition-colors whitespace-nowrap ${compareList.length === 2 ? 'text-white hover:opacity-90' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                style={compareList.length === 2 ? { backgroundColor: BRAND } : {}}>
                Compare Selected
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Compare Side Panel ── */}
      <AnimatePresence>
        {showComparePanel && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowComparePanel(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-[900px] max-w-full bg-white shadow-2xl z-[110] flex flex-col">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Compare Properties</h2>
                  <p className="text-sm text-slate-500">Side-by-side comparison</p>
                </div>
                <button onClick={() => setShowComparePanel(false)} className="p-2.5 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors">
                  <X className="w-5 h-5 text-slate-700" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 flex gap-6">
                {compareList.map(id => {
                  const prop = MOCK_PROPERTIES.find(p => p.id === id);
                  if (!prop) return null;
                  return (
                    <div key={prop.id} className="flex-1 flex flex-col">
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-5 relative group">
                        <img src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <button onClick={() => toggleCompare(prop.id)}
                          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-600 hover:text-red-500 shadow-md border border-slate-100">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="mb-4">
                        <div className="text-[10px] font-bold uppercase tracking-widest inline-block px-2.5 py-1 rounded-md mb-2" style={{ color: BRAND, backgroundColor: `${BRAND}15` }}>{prop.propertyType}</div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">{prop.title}</h3>
                        <p className="text-sm text-slate-500 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{prop.location}</p>
                      </div>
                      <div className="text-2xl font-extrabold text-slate-900 mb-5 pb-5 border-b border-slate-100">{prop.price}</div>
                      <div className="space-y-3">
                        {[
                          { icon: <Bed className="w-4 h-4" />, label: 'Bedrooms', val: prop.bedrooms },
                          { icon: <Bath className="w-4 h-4" />, label: 'Bathrooms', val: prop.bathrooms },
                          { icon: <Maximize className="w-4 h-4" />, label: 'Land Size', val: prop.landSize },
                          { icon: <Clock className="w-4 h-4" />, label: 'Listed', val: prop.listedDate },
                          { icon: <ShieldCheck className="w-4 h-4" />, label: 'Verified', val: prop.verified ? 'Yes' : 'No' },
                        ].map(row => (
                          <div key={row.label} className="flex items-center justify-between py-2 border-b border-slate-50">
                            <span className="text-slate-500 flex items-center gap-2">{row.icon} {row.label}</span>
                            <span className="font-bold text-slate-900">{row.val}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-auto pt-6">
                        <button className="w-full py-3.5 text-white rounded-full font-bold shadow-lg transition-colors hover:opacity-90" style={{ backgroundColor: BRAND }}>
                          Contact Agent
                        </button>
                      </div>
                    </div>
                  );
                })}
                {compareList.length === 1 && (
                  <div className="flex-1 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
                    <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-slate-300">
                      <SlidersHorizontal className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Add another property</h4>
                    <p className="text-sm text-slate-500">Select one more property from the list to compare side-by-side.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Quick View Panel ── */}
      <AnimatePresence>
        {quickViewId !== null && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setQuickViewId(null)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-[450px] max-w-full bg-white shadow-2xl z-[110] flex flex-col overflow-y-auto">
              {(() => {
                const prop = MOCK_PROPERTIES.find(p => p.id === quickViewId);
                if (!prop) return null;
                return (
                  <>
                    <div className="relative aspect-[4/3] w-full">
                      <img src={prop.image} alt={prop.title} className="w-full h-full object-cover" />
                      <button onClick={() => setQuickViewId(null)}
                        className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-700 hover:text-slate-900 shadow-lg border border-slate-100 transition-all">
                        <X className="w-5 h-5" />
                      </button>
                      {prop.verified && (
                        <div className="absolute bottom-4 left-4 bg-white px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-slate-100">
                          <ShieldCheck className="w-4 h-4 text-green-500" />
                          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Verified Listing</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col gap-6">
                      <div>
                        <div className="flex items-center gap-2 text-slate-500 mb-3">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm font-semibold">{prop.location}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2 leading-tight">{prop.title}</h2>
                        <div className="text-3xl font-extrabold" style={{ color: BRAND }}>{prop.price}</div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        {[{ Icon: Bed, val: prop.bedrooms, label: 'Beds' }, { Icon: Bath, val: prop.bathrooms, label: 'Baths' }, { Icon: Maximize, val: prop.landSize, label: 'Area' }].map((item, i, arr) => (
                          <React.Fragment key={item.label}>
                            <div className="flex flex-col items-center gap-1">
                              <item.Icon className="w-5 h-5 text-slate-400" />
                              <span className="font-bold text-slate-900">{item.val}</span>
                              <span className="text-[10px] text-slate-500 uppercase tracking-wider">{item.label}</span>
                            </div>
                            {i < arr.length - 1 && <div className="w-px h-10 bg-slate-200" />}
                          </React.Fragment>
                        ))}
                      </div>
                      <div className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={prop.agent?.avatar} alt={prop.agent?.name} className="w-12 h-12 rounded-full object-cover border-2 border-slate-100" />
                          <div>
                            <div className="text-sm font-bold text-slate-900">{prop.agent?.name}</div>
                            <div className="text-xs text-slate-500">Listing Agent</div>
                          </div>
                        </div>
                        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-colors" style={{ backgroundColor: `${BRAND}15`, color: BRAND }}>
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="mt-auto pt-2 flex gap-3">
                        <button className="flex-1 py-4 text-white rounded-full font-bold shadow-lg transition-colors hover:opacity-90" style={{ backgroundColor: BRAND }}>
                          Contact Agent
                        </button>
                        <button onClick={() => navigate(`/property/${prop.id}`)}
                          className="px-6 py-4 bg-white border border-slate-200 text-slate-700 rounded-full font-bold shadow-sm hover:bg-slate-50 transition-colors">
                          Full Details
                        </button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Mobile Map ── */}
      <AnimatePresence>
        {showMobileMap && (
          <motion.div initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }}
            className="fixed inset-0 z-[100] bg-slate-100 flex flex-col">
            <div className="p-4 bg-white border-b flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Map View</h2>
              <button onClick={() => setShowMobileMap(false)} className="p-2 bg-slate-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 relative bg-slate-200">
              <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #cbd5e1 1px, transparent 0)', backgroundSize: '24px 24px' }} />
              {filteredProperties.map(property => (
                <div key={`pin-mob-${property.id}`} className="absolute cursor-pointer -translate-x-1/2 -translate-y-full"
                  style={{ left: `${property.coordinates?.x ?? 50}%`, top: `${property.coordinates?.y ?? 50}%` }}>
                  <div className="bg-white text-slate-900 px-3 py-1.5 rounded-full font-bold text-sm shadow-lg whitespace-nowrap">
                    {property.price.split(' ')[0]}
                  </div>
                  <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-white mx-auto mt-[-1px]" />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slider thumb color */}
      <style>{`
        input[type="range"]::-webkit-slider-thumb { background-color: ${BRAND} !important; }
        input[type="range"]::-moz-range-thumb { background-color: ${BRAND} !important; border: none; }
      `}</style>

      <Footer />
    </div>
  );
};
