import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, MapPin, Bed, Bath, Heart, Share2, Sparkles,
  SlidersHorizontal, X, ChevronDown, Calendar, Users, Check, Filter,
  Info
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MOCK_PROPERTIES } from '../../data';

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

// ── Amenities for Shortlet ──────────────────────────────
const SHORTLET_AMENITIES = ['Pool', 'WiFi', 'Gym', 'Parking', 'Security', 'Generator'];
const FURNISHING_OPTIONS = ['Furnished', 'Semi-Furnished', 'Unfurnished'];

// ── Price ranges per tab for slider ─────────────────────
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

const formatPriceInput = (val: number): string => {
  return `₦${val.toLocaleString()}`;
};

// ── Tab-specific chip definitions ────────────────────────
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

interface ExplorePanelProps {
  onViewProperty?: (id: number) => void;
}

// ── Dual Range Slider ────────────────────────────────────
const DualRangeSlider: React.FC<{
  min: number; max: number; step: number;
  low: number; high: number;
  onLowChange: (v: number) => void;
  onHighChange: (v: number) => void;
}> = ({ min, max, step, low, high, onLowChange, onHighChange }) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  return (
    <div className="relative h-8 flex items-center select-none" ref={trackRef}>
      {/* track bg */}
      <div className="absolute inset-x-0 h-1.5 rounded-full bg-slate-200" />
      {/* active range */}
      <div
        className="absolute h-1.5 rounded-full"
        style={{ left: `${pct(low)}%`, right: `${100 - pct(high)}%`, backgroundColor: BRAND }}
      />
      {/* Low handle */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={low}
        onChange={e => {
          const v = Number(e.target.value);
          if (v <= high) onLowChange(v);
        }}
        className="absolute inset-x-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer z-[3]"
        style={{
          // @ts-ignore
          '--tw-shadow-color': BRAND,
          // thumb bg via inline
        }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={high}
        onChange={e => {
          const v = Number(e.target.value);
          if (v >= low) onHighChange(v);
        }}
        className="absolute inset-x-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer z-[4]"
      />
      {/* styled thumb overlays for color */}
      <div
        className="absolute w-5 h-5 rounded-full border-2 border-white shadow-md pointer-events-none z-[5]"
        style={{ left: `calc(${pct(low)}% - 10px)`, backgroundColor: BRAND }}
      />
      <div
        className="absolute w-5 h-5 rounded-full border-2 border-white shadow-md pointer-events-none z-[5]"
        style={{ left: `calc(${pct(high)}% - 10px)`, backgroundColor: BRAND }}
      />
    </div>
  );
};

// ── Bottom Sheet wrapper (mobile) ────────────────────────
const BottomSheet: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fullScreen?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ isOpen, onClose, title, fullScreen, children, footer }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 z-[100] md:hidden"
          onClick={onClose}
        />
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[101] md:hidden flex flex-col ${fullScreen ? 'top-4' : 'max-h-[85vh]'}`}
        >
          <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100 shrink-0">
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

// ── Dropdown wrapper (desktop) — portal-based to escape overflow clipping ──
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

export const ExplorePanel: React.FC<ExplorePanelProps> = ({ onViewProperty }) => {
  const [activeTab, setActiveTab] = useState<TabType>('Buy');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedProperties, setLikedProperties] = useState<number[]>([]);
  const [activeFilterDropdown, setActiveFilterDropdown] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Refs for portal dropdown anchors
  const chipRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // ── Filter state ─────────────────────────────────────
  const [activeFilters, setActiveFilters] = useState<Record<string, string | string[]>>({});

  // Price slider state
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(PRICE_RANGES.Buy.max);
  const [priceMinInput, setPriceMinInput] = useState('');
  const [priceMaxInput, setPriceMaxInput] = useState('');

  // Staged values (for Apply/Clear pattern)
  const [stagedFilters, setStagedFilters] = useState<Record<string, string | string[]>>({});
  const [stagedPriceMin, setStagedPriceMin] = useState(0);
  const [stagedPriceMax, setStagedPriceMax] = useState(PRICE_RANGES.Buy.max);

  // More Filters state
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [moreMinLand, setMoreMinLand] = useState('');
  const [moreMaxLand, setMoreMaxLand] = useState('');

  // Mobile bottom sheet filter key
  const [mobileSheet, setMobileSheet] = useState<string | null>(null);

  const tabs: Array<TabType> = ['Buy', 'Rent', 'Shortlet'];

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Reset on tab change
  const isFirstMount = useRef(true);
  useEffect(() => {
    if (isFirstMount.current) { isFirstMount.current = false; return; }
    setActiveFilters({});
    setPriceMin(0);
    setPriceMax(PRICE_RANGES[activeTab].max);
    setPriceMinInput('');
    setPriceMaxInput('');
    setStagedFilters({});
    setStagedPriceMin(0);
    setStagedPriceMax(PRICE_RANGES[activeTab].max);
    setActiveFilterDropdown(null);
    setMobileSheet(null);
    setMoreMinLand('');
    setMoreMaxLand('');
  }, [activeTab]);

  // ── Filter helpers ──────────────────────────────────
  const setFilter = (key: string, val: string | string[]) => {
    setActiveFilters(prev => ({ ...prev, [key]: val }));
  };

  const removeFilter = (key: string) => {
    setActiveFilters(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setPriceMin(0);
    setPriceMax(PRICE_RANGES[activeTab].max);
    setPriceMinInput('');
    setPriceMaxInput('');
    setMoreMinLand('');
    setMoreMaxLand('');
  };

  // Opening a dropdown stages current values
  const openDropdown = (key: string) => {
    if (isMobile) {
      setMobileSheet(key);
      setActiveFilterDropdown(null);
    } else {
      setActiveFilterDropdown(prev => prev === key ? null : key);
      setMobileSheet(null);
    }
    // Stage current
    setStagedFilters({ ...activeFilters });
    setStagedPriceMin(priceMin);
    setStagedPriceMax(priceMax);
  };

  const closeDropdown = () => {
    setActiveFilterDropdown(null);
    setMobileSheet(null);
  };

  // Apply staged → active
  const applyDropdown = (key: string) => {
    // Staged values are already set via callbacks; just close
    closeDropdown();
  };

  // Filter count
  const activeFilterKeys = Object.keys(activeFilters);
  const hasPriceFilter = priceMin > 0 || priceMax < PRICE_RANGES[activeTab].max;
  const hasLandFilter = moreMinLand !== '' || moreMaxLand !== '';
  const activeFilterCount = activeFilterKeys.length + (hasPriceFilter ? 1 : 0) + (hasLandFilter ? 1 : 0);

  // Displayable active tags
  const getFilterTags = (): { key: string; label: string }[] => {
    const tags: { key: string; label: string }[] = [];
    if (hasPriceFilter) {
      tags.push({ key: '_price', label: `${formatPrice(priceMin)} - ${formatPrice(priceMax)}` });
    }
    activeFilterKeys.forEach(k => {
      const val = activeFilters[k];
      if (Array.isArray(val)) {
        tags.push({ key: k, label: `${k}: ${val.join(', ')}` });
      } else {
        tags.push({ key: k, label: `${k}: ${val}` });
      }
    });
    if (hasLandFilter) {
      tags.push({ key: '_land', label: `Land: ${moreMinLand || '0'} - ${moreMaxLand || 'Any'} sqm` });
    }
    return tags;
  };

  const removeTag = (key: string) => {
    if (key === '_price') {
      setPriceMin(0);
      setPriceMax(PRICE_RANGES[activeTab].max);
      setPriceMinInput('');
      setPriceMaxInput('');
    } else if (key === '_land') {
      setMoreMinLand('');
      setMoreMaxLand('');
    } else {
      removeFilter(key);
    }
  };

  // ── Filtering logic ─────────────────────────────────
  const filteredProperties = MOCK_PROPERTIES.filter((p) => {
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
    // Price range
    if (hasPriceFilter) {
      const raw = p.price.replace(/[₦,]/g, '');
      const num = parseFloat(raw);
      if (!isNaN(num)) {
        if (num < priceMin || num > priceMax) return false;
      }
    }
    return true;
  });

  const toggleLike = (id: number) => {
    setLikedProperties(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const resultLabel = activeTab === 'Shortlet' ? 'stays' : activeTab === 'Rent' ? 'rentals' : 'homes for sale';

  // ── Chip active state helper ────────────────────────
  const isChipActive = (key: string): boolean => {
    if (key === 'Price') return hasPriceFilter;
    if (key === 'More') return hasLandFilter;
    return !!activeFilters[key];
  };

  const chipCount = (key: string): number => {
    if (key === 'Amenities' && Array.isArray(activeFilters['Amenities'])) return (activeFilters['Amenities'] as string[]).length;
    return 0;
  };

  // ── Price input sync ────────────────────────────────
  const handlePriceMinInput = (raw: string) => {
    const cleaned = raw.replace(/[^0-9]/g, '');
    setPriceMinInput(cleaned ? formatPriceInput(parseInt(cleaned)) : '');
    if (cleaned) {
      const v = parseInt(cleaned);
      if (v <= priceMax) setPriceMin(v);
    } else {
      setPriceMin(0);
    }
  };

  const handlePriceMaxInput = (raw: string) => {
    const cleaned = raw.replace(/[^0-9]/g, '');
    setPriceMaxInput(cleaned ? formatPriceInput(parseInt(cleaned)) : '');
    if (cleaned) {
      const v = parseInt(cleaned);
      if (v >= priceMin) setPriceMax(v);
    } else {
      setPriceMax(PRICE_RANGES[activeTab].max);
    }
  };

  // ── Render helpers ──────────────────────────────────

  const renderPriceContent = () => {
    const range = PRICE_RANGES[activeTab];
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            {activeTab === 'Rent' ? 'Price / month' : activeTab === 'Shortlet' ? 'Price / night' : 'Price'}
          </span>
        </div>
        {/* Range labels */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-600">
          <span>{formatPrice(priceMin)}</span>
          <span>{formatPrice(priceMax)}</span>
        </div>
        {/* Dual slider */}
        <DualRangeSlider
          min={range.min}
          max={range.max}
          step={range.step}
          low={priceMin}
          high={priceMax}
          onLowChange={(v) => { setPriceMin(v); setPriceMinInput(v > 0 ? formatPriceInput(v) : ''); }}
          onHighChange={(v) => { setPriceMax(v); setPriceMaxInput(v < range.max ? formatPriceInput(v) : ''); }}
        />
        {/* Min / Max inputs */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <div className="space-y-1.5">
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Min Price</span>
            <input
              type="text"
              value={priceMinInput}
              onChange={e => handlePriceMinInput(e.target.value)}
              placeholder="₦0"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#7B1C3E] focus:bg-white focus:ring-2 focus:ring-[#7B1C3E]/10 transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Max Price</span>
            <input
              type="text"
              value={priceMaxInput}
              onChange={e => handlePriceMaxInput(e.target.value)}
              placeholder="Any"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#7B1C3E] focus:bg-white focus:ring-2 focus:ring-[#7B1C3E]/10 transition-all"
            />
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
          <button
            key={opt}
            onClick={() => setFilter('Property Type', opt)}
            className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all font-bold flex items-center justify-between ${
              isSel ? 'text-white' : 'text-slate-700 hover:bg-slate-50 hover:text-[#7B1C3E]'
            }`}
            style={isSel ? { backgroundColor: BRAND } : {}}
          >
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
          <button
            key={num}
            onClick={() => setFilter('Bedrooms', val)}
            className={`h-10 rounded-xl border text-sm font-black transition-all duration-200 ${
              isSel
                ? 'border-transparent text-white shadow-md'
                : 'border-slate-200 text-slate-600 hover:border-[#7B1C3E]/30 hover:bg-[#7B1C3E]/5 hover:text-[#7B1C3E]'
            }`}
            style={isSel ? { backgroundColor: BRAND, borderColor: BRAND } : {}}
          >
            {num}
          </button>
        );
      })}
    </div>
  );

  const renderTitleTypeContent = () => (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {TITLE_TYPES.map(tt => {
          const isSel = activeFilters['Title Type'] === tt.value;
          return (
            <div key={tt.value} className="relative group">
              <button
                onClick={() => setFilter('Title Type', tt.value)}
                className={`w-full px-3 py-2.5 rounded-xl border text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                  isSel
                    ? 'border-transparent text-white'
                    : 'border-slate-200 text-slate-700 hover:border-[#7B1C3E]/30 hover:bg-[#7B1C3E]/5'
                }`}
                style={isSel ? { backgroundColor: BRAND, borderColor: BRAND } : {}}
              >
                <span className="truncate flex-1 text-left">{tt.value}</span>
                <Info className={`w-3 h-3 shrink-0 ${isSel ? 'text-white/60' : 'text-slate-300'}`} />
              </button>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-slate-900 text-white text-[10px] font-medium px-3 py-2 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[60] pointer-events-none">
                {tt.tip}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 -mt-1" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderGuestsContent = () => (
    <div className="space-y-1">
      {['1-2', '3-4', '5+'].map(opt => {
        const isSel = activeFilters['Guests'] === opt;
        return (
          <button
            key={opt}
            onClick={() => setFilter('Guests', opt)}
            className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all font-bold flex items-center justify-between ${
              isSel ? 'text-white' : 'text-slate-700 hover:bg-slate-50 hover:text-[#7B1C3E]'
            }`}
            style={isSel ? { backgroundColor: BRAND } : {}}
          >
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
          <button
            key={opt}
            onClick={() => setFilter('Furnishing', opt)}
            className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all font-bold flex items-center justify-between ${
              isSel ? 'text-white' : 'text-slate-700 hover:bg-slate-50 hover:text-[#7B1C3E]'
            }`}
            style={isSel ? { backgroundColor: BRAND } : {}}
          >
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
            <button
              key={a}
              onClick={() => {
                const next = isSel ? selected.filter(x => x !== a) : [...selected, a];
                if (next.length === 0) removeFilter('Amenities');
                else setFilter('Amenities', next);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold border transition-all ${
                isSel
                  ? 'border-transparent text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-[#7B1C3E]/30'
              }`}
              style={isSel ? { backgroundColor: BRAND, borderColor: BRAND } : {}}
            >
              {a}
            </button>
          );
        })}
      </div>
    );
  };

  const renderMoreFiltersContent = () => (
    <div className="space-y-5">
      {/* Land Size (moved here) */}
      <div>
        <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2 block">Land size (sqm)</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Min</span>
            <input
              type="text"
              value={moreMinLand}
              onChange={e => setMoreMinLand(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="0"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#7B1C3E] focus:bg-white focus:ring-2 focus:ring-[#7B1C3E]/10 transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Max</span>
            <input
              type="text"
              value={moreMaxLand}
              onChange={e => setMoreMaxLand(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="Any"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#7B1C3E] focus:bg-white focus:ring-2 focus:ring-[#7B1C3E]/10 transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // ── Dropdown footer ─────────────────────────────────
  const renderDropdownFooter = (key: string) => (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
      <button
        onClick={() => {
          if (key === 'Price') {
            setPriceMin(0);
            setPriceMax(PRICE_RANGES[activeTab].max);
            setPriceMinInput('');
            setPriceMaxInput('');
          } else if (key === 'More') {
            setMoreMinLand('');
            setMoreMaxLand('');
          } else {
            removeFilter(key);
          }
        }}
        className="text-xs font-bold text-slate-400 hover:text-[#7B1C3E] transition-colors"
      >
        Clear
      </button>
      <button
        onClick={() => closeDropdown()}
        className="px-5 py-2 rounded-full text-white text-xs font-bold transition-all hover:opacity-90"
        style={{ backgroundColor: BRAND }}
      >
        Apply
      </button>
    </div>
  );

  // ── Render dropdown content by key ──────────────────
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

  const getDropdownTitle = (key: string) => {
    const chip = TAB_CHIPS[activeTab].find(c => c.key === key);
    return chip?.label || key;
  };

  const getDropdownWidth = (key: string): number => {
    if (key === 'Price') return 300;
    if (key === 'Title Type') return 340;
    if (key === 'More') return 300;
    if (key === 'Amenities') return 280;
    return 220;
  };

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6 border-b border-slate-100">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-slate-900 font-black text-2xl mb-1">Explore Properties</h2>
          <p className="text-slate-400 font-medium">
            Discover verified listings across Nigeria
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="mt-5 flex items-center gap-3">
          <div className="inline-flex bg-slate-100 p-1 rounded-full">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                style={activeTab === tab ? { backgroundColor: BRAND } : {}}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Search Bar */}
        <div className="mt-5">
          <div className="flex items-center bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-all focus-within:ring-2 focus-within:ring-[#7B1C3E]/20 focus-within:border-[#7B1C3E] p-1.5 h-[58px]">
            {/* Where */}
            <div className="flex-1 flex flex-col justify-center px-5 h-full border-r border-slate-100 hover:bg-slate-50 rounded-full cursor-pointer group transition-colors">
              <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 mb-0.5 group-hover:text-[#7B1C3E] transition-colors">Where</span>
              <div className="flex items-center">
                <MapPin className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={activeTab === 'Shortlet' ? 'Search destinations' : 'Search location (Lekki, Yaba, Abuja…)'}
                  className="w-full bg-transparent outline-none text-sm font-bold text-slate-900 placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-slate-300 hover:text-slate-500 shrink-0 ml-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {activeTab === 'Buy' && (
              <div ref={el => { chipRefs.current['Type-bar'] = el as any; }}
                className="flex-1 hidden md:flex flex-col justify-center px-5 h-full hover:bg-slate-50 rounded-full cursor-pointer group transition-colors relative"
                onClick={() => openDropdown('Type-bar')}>
                <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 mb-0.5 group-hover:text-[#7B1C3E] transition-colors">Property Type</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${activeFilters['Property Type'] ? 'text-slate-900' : 'text-slate-400'}`}>
                    {(activeFilters['Property Type'] as string) || 'Any type'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <DesktopDropdown anchorEl={chipRefs.current['Type-bar'] as any} isOpen={activeFilterDropdown === 'Type-bar'} onClose={closeDropdown} width={220}>
                  <div className="p-4">{renderPropertyTypeContent()}</div>
                  {renderDropdownFooter('Property Type')}
                </DesktopDropdown>
              </div>
            )}

            {activeTab === 'Rent' && (
              <div ref={el => { chipRefs.current['Beds-bar'] = el as any; }}
                className="flex-1 hidden md:flex flex-col justify-center px-5 h-full hover:bg-slate-50 rounded-full cursor-pointer group transition-colors relative"
                onClick={() => openDropdown('Beds-bar')}>
                <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 mb-0.5 group-hover:text-[#7B1C3E] transition-colors">Bedrooms</span>
                <div className="flex items-center gap-2">
                  <Bed className="w-3.5 h-3.5 text-slate-400" />
                  <span className={`text-sm font-bold ${activeFilters['Bedrooms'] ? 'text-slate-900' : 'text-slate-400'}`}>
                    {(activeFilters['Bedrooms'] as string) || 'Any'}
                  </span>
                </div>
                <DesktopDropdown anchorEl={chipRefs.current['Beds-bar'] as any} isOpen={activeFilterDropdown === 'Beds-bar'} onClose={closeDropdown} width={220} align="right">
                  <div className="p-4">{renderBedroomsContent()}</div>
                  {renderDropdownFooter('Bedrooms')}
                </DesktopDropdown>
              </div>
            )}

            {activeTab === 'Shortlet' && (
              <>
                <div className="flex-1 hidden md:flex flex-col justify-center px-5 h-full border-r border-slate-100 hover:bg-slate-50 rounded-full cursor-pointer group transition-colors relative">
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
                  <input type="date" className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    onChange={(e) => {
                      if (e.target.value) {
                        if (!activeFilters['Check-in'] || (activeFilters['Check-in'] && activeFilters['Check-out'])) {
                          setFilter('Check-in', e.target.value); removeFilter('Check-out');
                        } else { setFilter('Check-out', e.target.value); }
                      }
                    }} />
                </div>
                <div ref={el => { chipRefs.current['Guests-bar'] = el as any; }}
                  className="flex-1 hidden md:flex flex-col justify-center px-5 h-full hover:bg-slate-50 rounded-full cursor-pointer group transition-colors relative"
                  onClick={() => openDropdown('Guests-bar')}>
                  <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 mb-0.5 group-hover:text-[#7B1C3E] transition-colors">Guests</span>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Users className="w-3.5 h-3.5 shrink-0" />
                    <span className={`text-sm font-bold ${activeFilters['Guests'] ? 'text-slate-900' : 'text-slate-400'}`}>
                      {(activeFilters['Guests'] as string) || 'Add guests'}
                    </span>
                  </div>
                  <DesktopDropdown anchorEl={chipRefs.current['Guests-bar'] as any} isOpen={activeFilterDropdown === 'Guests-bar'} onClose={closeDropdown} width={200} align="right">
                    <div className="p-4">{renderGuestsContent()}</div>
                    {renderDropdownFooter('Guests')}
                  </DesktopDropdown>
                </div>
              </>
            )}

            {/* Search Button */}
            <button
              className="ml-2 w-10 h-10 rounded-full flex items-center justify-center text-white hover:opacity-90 transition-colors shrink-0 shadow-md"
              style={{ backgroundColor: BRAND }}
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ═══ Filter Chip Bar ═══ */}
        <div className="mt-4">
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
                      onClick={() => {
                        if (isMoreBtn) {
                          if (isMobile) {
                            setMobileSheet('More');
                          } else {
                            openDropdown('More');
                          }
                        } else {
                          openDropdown(chip.key);
                        }
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-black whitespace-nowrap transition-all duration-300 ${
                        active
                          ? 'border-transparent text-white'
                          : isOpen
                            ? 'border-[#7B1C3E] bg-[#7B1C3E]/5 text-[#7B1C3E]'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-[#7B1C3E]/30 hover:bg-slate-50'
                      }`}
                      style={active ? { backgroundColor: BRAND, borderColor: BRAND } : {}}
                    >
                      {isMoreBtn && <Filter className="w-3.5 h-3.5" />}
                      <span>{chip.label}</span>
                      {/* Count badge */}
                      {active && count > 0 && (
                        <span className="w-4.5 h-4.5 min-w-[18px] px-1 rounded-full bg-white/30 text-[9px] font-black flex items-center justify-center">{count}</span>
                      )}
                      {!isMoreBtn && (
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${active ? 'text-white/70' : 'opacity-50'} ${isOpen ? 'rotate-180' : ''}`} />
                      )}
                    </button>

                    {/* Desktop dropdown — portal-based */}
                    {!isMoreBtn && (
                      <DesktopDropdown
                        anchorEl={chipRefs.current[chip.key]}
                        isOpen={!isMobile && activeFilterDropdown === chip.key}
                        onClose={closeDropdown}
                        width={getDropdownWidth(chip.key)}
                      >
                        <div className="p-4">{getDropdownContent(chip.key)}</div>
                        {renderDropdownFooter(chip.key)}
                      </DesktopDropdown>
                    )}

                    {/* More Filters desktop dropdown — portal-based */}
                    {isMoreBtn && (
                      <DesktopDropdown
                        anchorEl={chipRefs.current['More']}
                        isOpen={!isMobile && activeFilterDropdown === 'More'}
                        onClose={closeDropdown}
                        width={300}
                        align="right"
                      >
                        <div className="p-4">{renderMoreFiltersContent()}</div>
                        {renderDropdownFooter('More')}
                      </DesktopDropdown>
                    )}

                    {/* Mobile bottom sheet */}
                    {!isMoreBtn && (
                      <BottomSheet
                        isOpen={mobileSheet === chip.key}
                        onClose={() => setMobileSheet(null)}
                        title={getDropdownTitle(chip.key)}
                        footer={renderDropdownFooter(chip.key)}
                      >
                        {getDropdownContent(chip.key)}
                      </BottomSheet>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* More Filters mobile bottom sheet (full-screen) */}
        <BottomSheet
          isOpen={mobileSheet === 'More'}
          onClose={() => setMobileSheet(null)}
          title="More Filters"
          fullScreen
          footer={renderDropdownFooter('More')}
        >
          {renderMoreFiltersContent()}
        </BottomSheet>

        {/* ═══ Active Filter Tags Row ═══ */}
        <AnimatePresence>
          {activeFilterCount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 overflow-hidden"
            >
              <div className="flex items-center gap-2 flex-wrap">
                {getFilterTags().map(tag => (
                  <motion.span
                    key={tag.key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold"
                    style={{ backgroundColor: '#7B1C3E10', color: BRAND }}
                  >
                    {tag.label}
                    <button
                      onClick={() => removeTag(tag.key)}
                      className="hover:opacity-70 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.span>
                ))}
                <button
                  onClick={clearAllFilters}
                  className="text-[10px] font-black uppercase tracking-widest hover:underline transition-all px-2 py-1.5"
                  style={{ color: BRAND }}
                >
                  Clear all
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══ Results Count ═══ */}
      <div className="px-6 pt-6 pb-2">
        <p className="text-slate-700 text-sm font-bold">
          {filteredProperties.length} {resultLabel} in Nigeria
        </p>
        <AnimatePresence>
          {activeFilterCount > 0 && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-slate-400 text-xs font-medium mt-0.5"
            >
              {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'} applied
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Property Grid */}
      <div className="px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + JSON.stringify(activeFilters) + priceMin + priceMax}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProperties.map((prop, idx) => (
              <motion.div
                key={prop.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                onClick={() => onViewProperty ? onViewProperty(prop.id) : null}
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
                        <span className="text-[10px] font-bold flex items-center gap-1 uppercase tracking-wide" style={{ color: BRAND }}>
                          <Sparkles className="w-3 h-3" style={{ fill: `${BRAND}20` }} />
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
                      onClick={(e) => { e.stopPropagation(); toggleLike(prop.id); }}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-600 hover:text-red-500 transition-colors shadow-md border border-slate-100"
                    >
                      <Heart className={`w-4 h-4 ${likedProperties.includes(prop.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                    <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-600 transition-colors shadow-md border border-slate-100" style={{ ['--hover-color' as string]: BRAND }}>
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{prop.location}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-[#7B1C3E] transition-colors line-clamp-1">
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
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md" style={{ color: BRAND, backgroundColor: `${BRAND}0A` }}>
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
          </motion.div>
        </AnimatePresence>

        {filteredProperties.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-bold">No properties found</p>
            <p className="text-slate-300 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Slider thumb color style */}
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          background-color: ${BRAND} !important;
        }
        input[type="range"]::-moz-range-thumb {
          background-color: ${BRAND} !important;
        }
      `}</style>
    </div>
  );
};