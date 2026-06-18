import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Phone, MessageCircle, Star, Clock, Search,
  MapPin, ShieldCheck, Eye, Zap, Tag, ChevronDown,
  Calendar, CheckCircle2, AlertCircle, TrendingUp,
  Lock, Sparkles, ArrowRight, X, Check,
  ChevronLeft, ChevronRight, Users, Target, CalendarDays,
  Handshake, Layers, Settings, Send, ImagePlus,
  Home, Building2, AlertTriangle, Gauge,
  Camera, Video, Upload, Image as ImageIcon, Box,
  Bed, Bath, Droplets, ShieldAlert, Dumbbell, Car, Wifi, Trees, Wind, Dog, Flame
} from 'lucide-react';

type CRMTab = 'opportunities' | 'leads' | 'schedule';
type LeadStatus = 'inspected' | 'offer-made' | 'pending-closing' | 'new';
type FulfillPath = null | 'options' | 'optimize-pick' | 'optimize-edit' | 'source-wizard';
type SourcingStep = 1 | 2 | 3 | 4;

// ── Helpers ──────────────────────────────────────────────

const parseBudget = (budget: string): number => {
  const cleaned = budget.replace(/[₦,]/g, '').toLowerCase();
  const match = cleaned.match(/([\d.]+)(m|k)?/);
  if (!match) return 0;
  const num = parseFloat(match[1]);
  if (match[2] === 'm') return num * 1_000_000;
  if (match[2] === 'k') return num * 1_000;
  return num;
};

const parsePrice = (price: string): number => parseBudget(price);

const calcMatchScore = (listingPrice: number, seekerBudget: number, locationMatch: boolean): number => {
  if (seekerBudget === 0) return 40;
  const priceDiff = Math.abs(listingPrice - seekerBudget) / seekerBudget;
  let score = Math.max(0, 100 - priceDiff * 100);
  if (locationMatch) score = Math.min(100, score + 15);
  return Math.round(score);
};

const formatNum = (n: number): string => {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}K`;
  return `₦${n}`;
};

// ── Mock Data ──────────────────────────────────────────────

interface SeekerOpp {
  id: number; name: string; avatar: string; lookingFor: string;
  area: string; budget: string; lockedFunds: string; trustTier: number;
  postedAgo: string; urgency: 'high' | 'medium' | 'low';
  intent: 'rent' | 'sale'; propertyType: string; bedrooms: number;
  bathrooms: number; amenities: string[];
}

const AMENITY_ICONS: Record<string, React.ElementType> = {
  '24/7 Power': Zap, 'Pool': Droplets, 'Security': ShieldAlert, 'Gym': Dumbbell,
  'Parking': Car, 'Garden': Trees, 'Internet': Wifi, 'Gas': Flame, 'AC': Wind, 'Pet Friendly': Dog,
};

const seekerOpportunities: SeekerOpp[] = [
  {
    id: 1, name: 'Chinedu O.', avatar: 'CO', lookingFor: '3-Bedroom Flat',
    area: 'Surulere', budget: '₦4.5M/yr', lockedFunds: '₦4.5M',
    trustTier: 2, postedAgo: '2 hours ago', urgency: 'high',
    intent: 'rent', propertyType: 'Apartment', bedrooms: 3,
    bathrooms: 2, amenities: ['24/7 Power', 'Security', 'Parking'],
  },
  {
    id: 2, name: 'Amara K.', avatar: 'AK', lookingFor: '4-Bedroom Duplex',
    area: 'Lekki Phase 1', budget: '₦250M', lockedFunds: '₦250M',
    trustTier: 3, postedAgo: '5 hours ago', urgency: 'high',
    intent: 'sale', propertyType: 'Duplex', bedrooms: 4,
    bathrooms: 4, amenities: ['Pool', '24/7 Power', 'Security', 'Gym', 'Garden'],
  },
  {
    id: 3, name: 'Emeka N.', avatar: 'EN', lookingFor: '2-Bedroom Apartment',
    area: 'Victoria Island', budget: '₦3.2M/yr', lockedFunds: '₦3.2M',
    trustTier: 2, postedAgo: '1 day ago', urgency: 'medium',
    intent: 'rent', propertyType: 'Apartment', bedrooms: 2,
    bathrooms: 2, amenities: ['24/7 Power', 'Internet', 'AC'],
  },
  {
    id: 4, name: 'Fatima B.', avatar: 'FB', lookingFor: 'Commercial Space',
    area: 'Allen Avenue, Ikeja', budget: '₦8M/yr', lockedFunds: '₦8M',
    trustTier: 3, postedAgo: '3 hours ago', urgency: 'medium',
    intent: 'rent', propertyType: 'Commercial', bedrooms: 0,
    bathrooms: 2, amenities: ['24/7 Power', 'Security', 'Parking', 'AC'],
  },
  {
    id: 5, name: 'Yusuf D.', avatar: 'YD', lookingFor: 'Land (600sqm)',
    area: 'Ajah', budget: '₦45M', lockedFunds: '₦45M',
    trustTier: 1, postedAgo: '2 days ago', urgency: 'low',
    intent: 'sale', propertyType: 'Land', bedrooms: 0,
    bathrooms: 0, amenities: [],
  },
];

interface AgentListing {
  id: number; title: string; location: string; price: string;
  image: string; beds: number; baths: number; type: string;
  description: string; amenities: string[];
}

const agentListingsForMatch: AgentListing[] = [
  { id: 1, title: '3-Bed Luxury Apartment', location: 'Lekki Phase 1', price: '₦4.5M/yr', image: '', beds: 3, baths: 3, type: 'Apartment', description: 'Spacious 3-bedroom luxury apartment with modern finishes, 24/7 power, and gated security.', amenities: ['24/7 Power', 'Security', 'Parking', 'AC'] },
  { id: 2, title: '4-Bed Modern Duplex', location: 'Banana Island', price: '₦285M', image: '', beds: 4, baths: 5, type: 'Duplex', description: 'Contemporary 4-bedroom duplex with smart home features, swimming pool, and BQ.', amenities: ['Pool', '24/7 Power', 'Security', 'Gym', 'Garden', 'Parking'] },
  { id: 3, title: 'Penthouse Suite', location: 'Victoria Island', price: '₦120K/night', image: '', beds: 2, baths: 2, type: 'Apartment', description: 'Premium penthouse with panoramic ocean views and rooftop terrace.', amenities: ['24/7 Power', 'Internet', 'AC', 'Security'] },
  { id: 4, title: '5-Bed Mansion with Pool', location: 'Ikoyi', price: '₦450M', image: '', beds: 5, baths: 6, type: 'Duplex', description: 'Ultra-luxury 5-bedroom mansion with infinity pool, cinema room, and landscaped gardens.', amenities: ['Pool', '24/7 Power', 'Security', 'Gym', 'Garden', 'Parking', 'AC'] },
];

const leads: {
  id: number; name: string; avatar: string; property: string;
  status: LeadStatus; budget: string; source: string; lastContact: string;
  trustTier: number; nudge?: string; viewCount?: number;
}[] = [
  { id: 1, name: 'Chinedu Okafor', avatar: 'CO', property: '3-Bed Apartment, Lekki Phase 1', status: 'inspected', budget: '₦4-5M/yr', source: 'Houzii Search', lastContact: '30 mins ago', trustTier: 2, nudge: 'Chinedu has viewed your Ikoyi Duplex 5 times today. Follow up now?', viewCount: 5 },
  { id: 2, name: 'Amina Ibrahim', avatar: 'AI', property: 'Land (500sqm), Banana Island', status: 'offer-made', budget: '₦200-300M', source: 'Direct Inquiry', lastContact: '2 hours ago', trustTier: 3 },
  { id: 3, name: 'David Adeyemi', avatar: 'DA', property: 'Penthouse Suite, Victoria Island', status: 'pending-closing', budget: '₦120-150K/night', source: 'Houzii Search', lastContact: '1 hour ago', trustTier: 2, nudge: 'David requested closing documentation. Prepare escrow details.' },
  { id: 4, name: 'Blessing Eze', avatar: 'BE', property: '4-Bed Duplex, Ikoyi', status: 'new', budget: '₦180-250M', source: 'Referral', lastContact: '5 hours ago', trustTier: 1, nudge: 'Blessing is a new lead from a trusted referral. Respond quickly!' },
  { id: 5, name: 'Tunde Bakare', avatar: 'TB', property: '2-Bed Apartment, Ajah', status: 'inspected', budget: '₦1.5-2M/yr', source: 'Houzii Search', lastContact: '2 days ago', trustTier: 2 },
];

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const inspections = [
  { id: 1, property: '3-Bed Apartment, Lekki Phase 1', client: 'Chinedu Okafor', date: '2026-03-23', time: '10:00 AM', dayIndex: 0, agentConfirmed: true, seekerConfirmed: false, status: 'upcoming' as const },
  { id: 2, property: '4-Bed Duplex, Ikoyi', client: 'Blessing Eze', date: '2026-03-24', time: '2:00 PM', dayIndex: 1, agentConfirmed: false, seekerConfirmed: false, status: 'upcoming' as const },
  { id: 3, property: 'Penthouse Suite, VI', client: 'David Adeyemi', date: '2026-03-25', time: '11:00 AM', dayIndex: 2, agentConfirmed: true, seekerConfirmed: true, status: 'completed' as const },
  { id: 4, property: '5-Bed Mansion, Ikoyi', client: 'Amina Ibrahim', date: '2026-03-27', time: '9:00 AM', dayIndex: 4, agentConfirmed: false, seekerConfirmed: false, status: 'upcoming' as const },
];

// ── Component ──────────────────────────────────────────────

export const AgentLeads: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CRMTab>('opportunities');
  const [searchQuery, setSearchQuery] = useState('');
  const [matchedSeekers, setMatchedSeekers] = useState<Record<number, number>>({});
  const [leadFilter, setLeadFilter] = useState<LeadStatus | 'all'>('all');
  const [inspectionToggles, setInspectionToggles] = useState<Record<number, boolean>>({ 3: true });

  // Fulfill Request flow state
  const [fulfillPath, setFulfillPath] = useState<FulfillPath>(null);
  const [activeSeeker, setActiveSeeker] = useState<SeekerOpp | null>(null);
  const [selectedListing, setSelectedListing] = useState<AgentListing | null>(null);
  const [optimizePrice, setOptimizePrice] = useState('');
  const [counterOfferSent, setCounterOfferSent] = useState(false);

  // Sourcing Wizard state
  const [sourcingStep, setSourcingStep] = useState<SourcingStep>(1);
  const [sourcingLocation, setSourcingLocation] = useState('');
  const [sourcingPrice, setSourcingPrice] = useState('');
  const [sourcingDescription, setSourcingDescription] = useState('');
  const [sourcingSubmitted, setSourcingSubmitted] = useState(false);

  const tabs: { id: CRMTab; label: string; icon: React.ElementType; count: number }[] = [
    { id: 'opportunities', label: 'Opportunities', icon: Target, count: seekerOpportunities.length },
    { id: 'leads', label: 'Leads', icon: Users, count: leads.length },
    { id: 'schedule', label: 'Schedule', icon: CalendarDays, count: inspections.filter(i => i.status === 'upcoming').length },
  ];

  const filteredLeads = leads.filter(l => {
    if (leadFilter !== 'all' && l.status !== leadFilter) return false;
    if (searchQuery && !l.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const tierConfig = (tier: number) => {
    if (tier === 3) return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: 'text-green-500', label: 'Tier 3 Verified' };
    if (tier === 2) return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'text-blue-500', label: 'Tier 2 Verified' };
    return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: 'text-amber-500', label: 'Tier 1 Basic' };
  };

  const statusConfig: Record<LeadStatus, { bg: string; text: string; label: string }> = {
    'new': { bg: 'bg-slate-100', text: 'text-slate-600', label: 'New' },
    'inspected': { bg: 'bg-blue-50', text: 'text-blue-600', label: 'Inspected' },
    'offer-made': { bg: 'bg-amber-50', text: 'text-amber-600', label: 'Offer Made' },
    'pending-closing': { bg: 'bg-green-50', text: 'text-green-600', label: 'Pending Closing' },
  };

  const urgencyColors = { high: 'border-l-red-500', medium: 'border-l-amber-400', low: 'border-l-slate-300' };

  // ── Fulfill Request helpers ─────────────────────────────

  const openFulfillModal = (seeker: SeekerOpp) => {
    setActiveSeeker(seeker);
    setFulfillPath('options');
    setSelectedListing(null);
    setOptimizePrice('');
    setCounterOfferSent(false);
    setSourcingStep(1);
    setSourcingLocation(seeker.area);
    setSourcingPrice('');
    setSourcingDescription('');
    setSourcingSubmitted(false);
  };

  const closeFulfillFlow = () => {
    setFulfillPath(null);
    setActiveSeeker(null);
    setSelectedListing(null);
    setCounterOfferSent(false);
    setSourcingSubmitted(false);
  };

  // Scored listings for Optimize path
  const scoredListings = useMemo(() => {
    if (!activeSeeker) return [];
    const seekerBudgetNum = parseBudget(activeSeeker.budget);
    return agentListingsForMatch
      .map(listing => {
        const locMatch = listing.location.toLowerCase().includes(activeSeeker.area.toLowerCase().split(',')[0].trim());
        const score = calcMatchScore(parsePrice(listing.price), seekerBudgetNum, locMatch);
        return { ...listing, matchScore: score, locationMatch: locMatch };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [activeSeeker]);

  // Optimize match meter
  const optimizeMatchScore = useMemo(() => {
    if (!activeSeeker || !selectedListing) return 0;
    const seekerBudget = parseBudget(activeSeeker.budget);
    const offerPrice = optimizePrice ? parseBudget(optimizePrice.replace(/[^\d.mMkK]/g, '₦')) : parsePrice(selectedListing.price);
    const locMatch = selectedListing.location.toLowerCase().includes(activeSeeker.area.toLowerCase().split(',')[0].trim());
    return calcMatchScore(offerPrice, seekerBudget, locMatch);
  }, [activeSeeker, selectedListing, optimizePrice]);

  // Sourcing match score
  const sourcingMatchScore = useMemo(() => {
    if (!activeSeeker || !sourcingPrice) return 0;
    const seekerBudget = parseBudget(activeSeeker.budget);
    const price = parseBudget(sourcingPrice.replace(/[^\d.mMkK]/g, '₦'));
    const locMatch = sourcingLocation.toLowerCase().includes(activeSeeker.area.toLowerCase().split(',')[0].trim());
    return calcMatchScore(price, seekerBudget, locMatch);
  }, [activeSeeker, sourcingPrice, sourcingLocation]);

  const hasPotentialMatch = (seeker: SeekerOpp) => {
    const seekerBudget = parseBudget(seeker.budget);
    return agentListingsForMatch.some(l => {
      const diff = Math.abs(parsePrice(l.price) - seekerBudget) / seekerBudget;
      return diff <= 0.25;
    });
  };

  const toggleInspection = (id: number) => {
    setInspectionToggles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const meterColor = (score: number) => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 60) return 'bg-amber-400';
    return 'bg-red-400';
  };

  const meterTextColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-500';
  };

  // ── Render ─────────────────────────────────────────────

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-5 border-b border-slate-100">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-slate-900 font-black text-2xl">Intelligent CRM</h2>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 border border-primary/10 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-primary text-[10px] font-black">AI-Powered</span>
          </div>
        </div>
        <p className="text-slate-400 text-sm font-medium">Opportunities, leads & scheduling in one place</p>

        <div className="grid grid-cols-4 gap-3 mt-5">
          {[
            { label: 'Opportunities', value: seekerOpportunities.length.toString(), color: 'text-primary', icon: Target },
            { label: 'Active Leads', value: leads.length.toString(), color: 'text-blue-500', icon: Users },
            { label: 'Inspections', value: inspections.filter(i => i.status === 'upcoming').length.toString(), color: 'text-amber-500', icon: Calendar },
            { label: 'Conversion', value: '18%', color: 'text-green-500', icon: TrendingUp },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                <Icon className={`w-4 h-4 mx-auto mb-1 ${stat.color}`} />
                <p className={`font-black text-lg ${stat.color}`}>{stat.value}</p>
                <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tab Bar */}
      <div className="px-6 pt-4 pb-3 bg-white border-b border-slate-100">
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === tab.id ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-primary/10 text-primary' : 'bg-slate-200 text-slate-400'
                }`}>{tab.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ═══════════ OPPORTUNITIES TAB ═══════════ */}
        {activeTab === 'opportunities' && (
          <motion.div key="opportunities" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="px-6 pt-5">
            <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/10 rounded-2xl mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-slate-800 text-xs font-black">Marketplace Demand Feed</p>
                <p className="text-slate-500 text-[11px] font-medium">Verified seekers with locked funds. Fulfill requests to earn commissions.</p>
              </div>
            </div>

            <div className="space-y-3">
              {seekerOpportunities.map((seeker, i) => {
                const tc = tierConfig(seeker.trustTier);
                const matched = matchedSeekers[seeker.id];
                const matchedListing = matched ? agentListingsForMatch.find(l => l.id === matched) : null;

                return (
                  <motion.div
                    key={seeker.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className={`bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all border-l-4 ${urgencyColors[seeker.urgency]}`}
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-xs shrink-0">
                          {seeker.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <h4 className="text-slate-800 font-bold text-sm">{seeker.name}</h4>
                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black ${tc.bg} border ${tc.border} ${tc.text}`}>
                              <ShieldCheck className={`w-3 h-3 ${tc.icon}`} />
                              {tc.label}
                            </div>
                          </div>
                          <p className="text-slate-600 text-xs font-medium mb-2">
                            is looking for a <span className="font-black text-slate-800">{seeker.lookingFor}</span> in{' '}
                            <span className="font-black text-slate-800">{seeker.area}</span>.
                            Budget: <span className="font-black text-primary">{seeker.budget}</span>
                          </p>

                          {/* Spec Icons Row */}
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            {seeker.bedrooms > 0 && (
                              <span className="flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600">
                                <Bed className="w-3 h-3" /> {seeker.bedrooms} Bed
                              </span>
                            )}
                            {seeker.bathrooms > 0 && (
                              <span className="flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600">
                                <Bath className="w-3 h-3" /> {seeker.bathrooms} Bath
                              </span>
                            )}
                            {seeker.amenities.slice(0, 3).map(a => {
                              const AIcon = AMENITY_ICONS[a] || Zap;
                              return (
                                <span key={a} className="flex items-center gap-1 px-2 py-1 bg-primary/5 border border-primary/10 rounded-lg text-[10px] font-bold text-primary">
                                  <AIcon className="w-3 h-3" /> {a}
                                </span>
                              );
                            })}
                            {seeker.amenities.length > 3 && (
                              <span className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-400">
                                +{seeker.amenities.length - 3} more
                              </span>
                            )}
                          </div>

                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full mb-3">
                            <Lock className="w-3.5 h-3.5 text-green-600" />
                            <span className="text-green-700 text-[11px] font-black">{seeker.lockedFunds} Locked in Wallet</span>
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                          </div>

                          {/* Match or Fulfill */}
                          {matchedListing ? (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 p-2.5 bg-primary/5 border border-primary/15 rounded-xl">
                              <Tag className="w-4 h-4 text-primary shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-primary text-[10px] font-black uppercase tracking-wider">Tagged</p>
                                <p className="text-slate-700 text-xs font-bold truncate">{matchedListing.title} — {matchedListing.location}</p>
                              </div>
                              <button
                                onClick={() => setMatchedSeekers(prev => { const n = { ...prev }; delete n[seeker.id]; return n; })}
                                className="p-1 hover:bg-primary/10 rounded-lg transition-colors"
                              >
                                <X className="w-3.5 h-3.5 text-primary" />
                              </button>
                            </motion.div>
                          ) : (
                            <button
                              onClick={() => openFulfillModal(seeker)}
                              className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md"
                              style={{ backgroundColor: '#6D1D2C' }}
                            >
                              <Handshake className="w-4 h-4" />
                              Fulfill Request
                            </button>
                          )}
                        </div>
                        <span className="text-slate-300 text-[10px] font-bold shrink-0 mt-1">{seeker.postedAgo}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ═══════════ LEADS TAB ═══════════ */}
        {activeTab === 'leads' && (
          <motion.div key="leads" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="px-6 pt-5">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search leads..."
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all" />
            </div>
            <div className="flex gap-2 mb-5 flex-wrap">
              {([
                { id: 'all' as const, label: 'All' }, { id: 'new' as const, label: 'New' },
                { id: 'inspected' as const, label: 'Inspected' }, { id: 'offer-made' as const, label: 'Offer Made' },
                { id: 'pending-closing' as const, label: 'Pending Closing' },
              ]).map(f => (
                <button key={f.id} onClick={() => setLeadFilter(f.id)}
                  className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
                    leadFilter === f.id ? 'bg-primary text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}>{f.label}</button>
              ))}
            </div>
            <div className="space-y-3">
              {filteredLeads.map((lead, i) => {
                const tc = tierConfig(lead.trustTier);
                const sc = statusConfig[lead.status];
                return (
                  <motion.div key={lead.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all">
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-xs shrink-0">{lead.avatar}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h4 className="text-slate-800 font-bold text-sm">{lead.name}</h4>
                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black ${tc.bg} border ${tc.border} ${tc.text}`}>
                              <ShieldCheck className={`w-3 h-3 ${tc.icon}`} />{tc.label}
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${sc.bg} ${sc.text}`}>{sc.label}</span>
                          </div>
                          <p className="text-slate-400 text-xs font-medium flex items-center gap-1 mb-1"><Star className="w-3 h-3 text-amber-400 shrink-0" />{lead.property}</p>
                          <div className="flex items-center gap-3 text-[10px] text-slate-300 mb-1">
                            <span className="font-bold">Budget: <span className="text-slate-500">{lead.budget}</span></span>
                            <span className="font-bold">Via: <span className="text-slate-500">{lead.source}</span></span>
                          </div>
                          <p className="text-slate-300 text-[10px] font-medium flex items-center gap-1"><Clock className="w-3 h-3" /> Last contact: {lead.lastContact}</p>
                          {lead.nudge && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                              className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
                              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                              <div>
                                <p className="text-amber-700 text-[11px] font-bold leading-snug">{lead.nudge}</p>
                                {lead.viewCount && (
                                  <div className="flex items-center gap-1 mt-1.5">
                                    <Eye className="w-3 h-3 text-amber-500" />
                                    <span className="text-amber-600 text-[10px] font-black">{lead.viewCount} views today</span>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </div>
                        <div className="flex flex-col items-center gap-2 shrink-0">
                          <button className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors" title="Call"><Phone className="w-4 h-4" /></button>
                          <button className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 hover:bg-green-100 transition-colors" title="Message"><MessageCircle className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ═══════════ SCHEDULE TAB ═══════════ */}
        {activeTab === 'schedule' && (
          <motion.div key="schedule" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="px-6 pt-5">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-5">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <button className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors"><ChevronLeft className="w-4 h-4 text-slate-400" /></button>
                <div className="text-center">
                  <p className="text-slate-800 text-sm font-black">Mar 23 – 29, 2026</p>
                  <p className="text-slate-400 text-[10px] font-bold">This Week</p>
                </div>
                <button className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors"><ChevronRight className="w-4 h-4 text-slate-400" /></button>
              </div>
              <div className="grid grid-cols-7 gap-0">
                {weekDays.map((day, idx) => {
                  const dayInspections = inspections.filter(ins => ins.dayIndex === idx);
                  const hasInspection = dayInspections.length > 0;
                  const dateNum = 23 + idx;
                  const isToday = idx === 0;
                  return (
                    <div key={day} className={`text-center py-3 border-r border-slate-100 last:border-r-0 ${isToday ? 'bg-primary/5' : ''}`}>
                      <p className={`text-[10px] font-bold mb-1 ${isToday ? 'text-primary' : 'text-slate-400'}`}>{day}</p>
                      <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-sm font-black ${isToday ? 'bg-primary text-white' : 'text-slate-700'}`}>{dateNum}</div>
                      {hasInspection && (
                        <div className="flex justify-center gap-0.5 mt-1.5">
                          {dayInspections.map(ins => (
                            <div key={ins.id} className={`w-1.5 h-1.5 rounded-full ${ins.status === 'completed' ? 'bg-green-500' : 'bg-primary'}`} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-slate-800 text-sm font-black">Upcoming Inspections</h3>
              <span className="text-slate-400 text-[10px] font-bold">{inspections.length} total</span>
            </div>
            <div className="space-y-3">
              {inspections.map((ins, i) => {
                const agentToggled = inspectionToggles[ins.id] || false;
                const bothConfirmed = agentToggled && ins.seekerConfirmed;
                return (
                  <motion.div key={ins.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className={`bg-white border rounded-2xl overflow-hidden transition-all ${bothConfirmed ? 'border-green-200' : 'border-slate-200'}`}>
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 ${ins.status === 'completed' ? 'bg-green-50' : 'bg-primary/5'}`}>
                          <span className={`text-lg font-black ${ins.status === 'completed' ? 'text-green-600' : 'text-primary'}`}>{ins.date.split('-')[2]}</span>
                          <span className={`text-[9px] font-bold ${ins.status === 'completed' ? 'text-green-500' : 'text-primary/60'}`}>{weekDays[ins.dayIndex]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-slate-800 text-sm font-bold mb-0.5 truncate">{ins.property}</h4>
                          <p className="text-slate-400 text-xs font-medium flex items-center gap-1 mb-1"><Users className="w-3 h-3 shrink-0" /> {ins.client}</p>
                          <p className="text-slate-300 text-[10px] font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> {ins.time}</p>
                          <div className="flex items-center gap-3 mt-3">
                            <div className="flex items-center gap-1.5">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${agentToggled ? 'bg-green-500' : 'bg-slate-200'}`}>
                                <Check className={`w-3 h-3 ${agentToggled ? 'text-white' : 'text-slate-400'}`} /></div>
                              <span className="text-[10px] font-bold text-slate-500">Agent</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${ins.seekerConfirmed ? 'bg-green-500' : 'bg-slate-200'}`}>
                                <Check className={`w-3 h-3 ${ins.seekerConfirmed ? 'text-white' : 'text-slate-400'}`} /></div>
                              <span className="text-[10px] font-bold text-slate-500">Seeker</span>
                            </div>
                            {bothConfirmed && (
                              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-1 px-2 py-0.5 bg-green-50 border border-green-200 rounded-full">
                                <AlertCircle className="w-3 h-3 text-green-500" />
                                <span className="text-green-600 text-[9px] font-black">Escrow Notified</span>
                              </motion.div>
                            )}
                          </div>
                        </div>
                        <div className="shrink-0">
                          <button onClick={() => toggleInspection(ins.id)}
                            className={`px-3 py-2 rounded-xl text-[10px] font-black transition-all flex items-center gap-1.5 ${
                              agentToggled ? 'bg-green-50 border border-green-200 text-green-600' : 'bg-slate-50 border border-slate-200 text-slate-500 hover:border-primary hover:text-primary'
                            }`}>
                            <CheckCircle2 className="w-3.5 h-3.5" />{agentToggled ? 'Confirmed' : 'Confirm'}
                          </button>
                        </div>
                      </div>
                    </div>
                    {bothConfirmed && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        className="px-4 py-2.5 bg-green-50 border-t border-green-200 flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-green-500" />
                        <p className="text-green-700 text-[11px] font-bold">Both parties confirmed. Super Admin has been notified to prepare escrow release.</p>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════
          FULFILL REQUEST MODALS & OVERLAYS
         ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {fulfillPath && activeSeeker && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={closeFulfillFlow}
            />

            {/* ─── Component 2: Fulfillment Options Modal ─── */}
            {fulfillPath === 'options' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                onClick={e => e.stopPropagation()}
              >
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                  {/* Navy header */}
                  <div className="px-6 py-5" style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)' }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-black text-lg flex items-center gap-2">
                          <Handshake className="w-5 h-5" />
                          Fulfill Request
                        </h3>
                        <p className="text-slate-300 text-xs font-medium mt-1">
                          {activeSeeker.name} • {activeSeeker.lookingFor} in {activeSeeker.area}
                        </p>
                      </div>
                      <button onClick={closeFulfillFlow} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                        <X className="w-5 h-5 text-white" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                        <Lock className="w-3 h-3 text-green-400" />
                        <span className="text-green-300 text-[10px] font-black">{activeSeeker.lockedFunds} Locked</span>
                      </div>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="p-6 space-y-4">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Choose your approach</p>

                    {/* Option A: Optimize Existing */}
                    <button
                      onClick={() => setFulfillPath('optimize-pick')}
                      className="w-full text-left p-5 rounded-2xl border-2 border-slate-200 hover:border-primary hover:shadow-md transition-all group relative"
                    >
                      {hasPotentialMatch(activeSeeker) && (
                        <div className="absolute top-3 right-3 flex items-center gap-1">
                          <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="w-2.5 h-2.5 rounded-full bg-green-500"
                          />
                          <span className="text-green-600 text-[9px] font-black">Match Found</span>
                        </div>
                      )}
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shrink-0">
                          <div className="relative">
                            <Layers className="w-6 h-6 text-primary" />
                            <Settings className="w-3.5 h-3.5 text-primary absolute -bottom-1 -right-1" />
                          </div>
                        </div>
                        <div>
                          <h4 className="text-slate-800 font-black text-sm mb-1 group-hover:text-primary transition-colors">
                            Optimize an Existing Property
                          </h4>
                          <p className="text-slate-400 text-xs font-medium leading-relaxed">
                            Select one of your current properties and adjust its details to create a counter-offer for this seeker.
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* Option B: Source New */}
                    <button
                      onClick={() => setFulfillPath('source-wizard')}
                      className="w-full text-left p-5 rounded-2xl border-2 border-slate-200 hover:border-primary hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center shrink-0">
                          <div className="relative">
                            <Search className="w-6 h-6 text-blue-600" />
                            <ImagePlus className="w-3.5 h-3.5 text-blue-500 absolute -bottom-1 -right-1" />
                          </div>
                        </div>
                        <div>
                          <h4 className="text-slate-800 font-black text-sm mb-1 group-hover:text-primary transition-colors">
                            Source a New Property for Seeker
                          </h4>
                          <p className="text-slate-400 text-xs font-medium leading-relaxed">
                            Find a property that perfectly fulfills this seeker&apos;s request.
                          </p>
                          <div className="flex items-center gap-1.5 mt-2">
                            <Lock className="w-3.5 h-3.5 text-green-600" />
                            <span className="text-green-700 text-[11px] font-black">Budget: {activeSeeker.budget}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── Component 3: Optimize Pick List ─── */}
            {fulfillPath === 'optimize-pick' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                onClick={e => e.stopPropagation()}
              >
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                    <div>
                      <h3 className="text-slate-900 font-black text-base">Select a Property to Optimize</h3>
                      <p className="text-slate-400 text-[11px] font-medium">Properties ranked by match score with {activeSeeker.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setFulfillPath('options')} className="px-3 py-1.5 text-slate-400 text-xs font-bold hover:text-slate-600 transition-colors">Back</button>
                      <button onClick={closeFulfillFlow} className="p-1.5 hover:bg-slate-50 rounded-lg"><X className="w-4 h-4 text-slate-400" /></button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {scoredListings.map((listing, i) => (
                      <motion.button
                        key={listing.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        onClick={() => {
                          setSelectedListing(listing);
                          setOptimizePrice(listing.price);
                          setFulfillPath('optimize-edit');
                        }}
                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all hover:shadow-md flex items-center gap-4 ${
                          listing.matchScore >= 70 ? 'border-green-200 hover:border-green-400 bg-green-50/30' : 'border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        {/* Thumbnail placeholder */}
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center shrink-0 ${
                          listing.matchScore >= 70 ? 'bg-green-100' : 'bg-slate-100'
                        }`}>
                          <Home className={`w-7 h-7 ${listing.matchScore >= 70 ? 'text-green-500' : 'text-slate-300'}`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-slate-800 text-sm font-bold truncate">{listing.title}</h4>
                          <p className="text-slate-400 text-xs font-medium flex items-center gap-1">
                            <MapPin className="w-3 h-3" />{listing.location}
                          </p>
                          <p className="text-slate-700 text-sm font-black mt-1">{listing.price}</p>
                        </div>

                        {/* Match Score */}
                        <div className="shrink-0 text-center">
                          <div className={`w-14 h-14 rounded-full border-4 flex items-center justify-center ${
                            listing.matchScore >= 70 ? 'border-green-400' : listing.matchScore >= 50 ? 'border-amber-300' : 'border-red-300'
                          }`}>
                            <span className={`font-black text-sm ${
                              listing.matchScore >= 70 ? 'text-green-600' : listing.matchScore >= 50 ? 'text-amber-600' : 'text-red-500'
                            }`}>{listing.matchScore}%</span>
                          </div>
                          <p className="text-slate-400 text-[9px] font-bold mt-1">MATCH</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── Component 3b: Optimize & Match Quick-Edit Overlay ─── */}
            {fulfillPath === 'optimize-edit' && selectedListing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                onClick={e => e.stopPropagation()}
              >
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                    <div>
                      <h3 className="text-slate-900 font-black text-base">Optimize & Match</h3>
                      <p className="text-slate-400 text-[11px] font-medium">Adjust pricing for {activeSeeker.name}&apos;s request</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setFulfillPath('optimize-pick')} className="px-3 py-1.5 text-slate-400 text-xs font-bold hover:text-slate-600 transition-colors">Back</button>
                      <button onClick={closeFulfillFlow} className="p-1.5 hover:bg-slate-50 rounded-lg"><X className="w-4 h-4 text-slate-400" /></button>
                    </div>
                  </div>

                  {counterOfferSent ? (
                    /* Success State */
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-10 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.2 }}
                        className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5"
                      >
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                      </motion.div>
                      <h3 className="text-slate-900 font-black text-xl mb-2">Counter-Offer Sent!</h3>
                      <p className="text-slate-500 text-sm font-medium mb-4">
                        Your optimized offer of <span className="font-black text-primary">{optimizePrice}</span> for <span className="font-bold">{selectedListing.title}</span> has been sent directly to <span className="font-bold">{activeSeeker.name}</span>.
                      </p>
                      {optimizeMatchScore >= 85 ? (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
                          <ShieldCheck className="w-4 h-4 text-green-500" />
                          <span className="text-green-700 text-xs font-black">{optimizeMatchScore}% Direct Match — First Dibs Granted</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full">
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                          <span className="text-amber-700 text-xs font-black">Listed on General Marketplace</span>
                        </div>
                      )}
                      <button onClick={closeFulfillFlow} className="mt-6 px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors">
                        Back to Opportunities
                      </button>
                    </motion.div>
                  ) : (
                    /* Edit Form */
                    <div className="flex-1 overflow-y-auto">
                      <div className="flex flex-col lg:flex-row">
                        {/* Left: Property Details */}
                        <div className="flex-1 p-6 border-r border-slate-100">
                          {/* Property Card */}
                          <div className="p-4 bg-slate-50 rounded-2xl mb-5">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-primary" />
                              </div>
                              <div>
                                <h4 className="text-slate-800 font-bold text-sm">{selectedListing.title}</h4>
                                <p className="text-slate-400 text-xs font-medium flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />{selectedListing.location}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-[11px] text-slate-500">
                              <span className="font-bold">{selectedListing.beds} Beds</span>
                              <span className="font-bold">{selectedListing.baths} Baths</span>
                              <span className="font-bold">{selectedListing.type}</span>
                            </div>
                            <p className="text-slate-400 text-xs font-medium mt-2 leading-relaxed">{selectedListing.description}</p>
                          </div>

                          {/* Seeker Context */}
                          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl mb-5">
                            <p className="text-blue-700 text-xs font-bold">
                              <span className="font-black">{activeSeeker.name}</span> wants: {activeSeeker.lookingFor} in {activeSeeker.area} •
                              Budget: <span className="font-black">{activeSeeker.budget}</span>
                            </p>
                          </div>

                          {/* Asking Price Field */}
                          <div>
                            <label className="text-slate-700 text-xs font-black block mb-2">Your Asking Price</label>
                            <input
                              type="text"
                              value={optimizePrice}
                              onChange={e => setOptimizePrice(e.target.value)}
                              className={`w-full px-4 py-3.5 border-2 rounded-xl text-lg font-black transition-all focus:outline-none ${
                                optimizeMatchScore >= 85
                                  ? 'border-green-400 bg-green-50/50 text-green-700 focus:ring-2 focus:ring-green-200'
                                  : optimizeMatchScore >= 60
                                  ? 'border-amber-300 bg-amber-50/50 text-amber-700 focus:ring-2 focus:ring-amber-200'
                                  : 'border-red-300 bg-red-50/50 text-red-600 focus:ring-2 focus:ring-red-200'
                              }`}
                            />
                            <p className={`mt-2 text-[11px] font-bold ${meterTextColor(optimizeMatchScore)}`}>
                              {optimizeMatchScore >= 85
                                ? 'Excellent! This price is highly competitive for the seeker.'
                                : optimizeMatchScore >= 60
                                ? 'Good range — consider adjusting closer to the seeker\'s budget.'
                                : 'Price gap is significant. Lower your asking price for a better match.'}
                            </p>
                          </div>

                          {/* Send Counter-Offer Button */}
                          <button
                            onClick={() => {
                              setCounterOfferSent(true);
                              setMatchedSeekers(prev => ({ ...prev, [activeSeeker.id]: selectedListing.id }));
                            }}
                            className="w-full mt-6 py-3.5 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md"
                            style={{ backgroundColor: '#6D1D2C' }}
                          >
                            <Send className="w-4 h-4" />
                            Send Counter-Offer
                          </button>
                        </div>

                        {/* Right: Sticky Match Meter */}
                        <div className="w-full lg:w-56 p-6 bg-slate-50 shrink-0">
                          <div className="sticky top-6">
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider text-center mb-4">Match Meter</p>

                            {/* Circular Gauge */}
                            <div className="relative w-32 h-32 mx-auto mb-4">
                              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                                <circle cx="60" cy="60" r="52" stroke="#e2e8f0" strokeWidth="10" fill="none" />
                                <motion.circle
                                  cx="60" cy="60" r="52"
                                  stroke={optimizeMatchScore >= 85 ? '#22c55e' : optimizeMatchScore >= 60 ? '#f59e0b' : '#ef4444'}
                                  strokeWidth="10"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeDasharray={2 * Math.PI * 52}
                                  initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                                  animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - optimizeMatchScore / 100) }}
                                  transition={{ type: 'spring', stiffness: 60 }}
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <motion.span
                                  key={optimizeMatchScore}
                                  initial={{ scale: 1.3 }}
                                  animate={{ scale: 1 }}
                                  className={`font-black text-2xl ${meterTextColor(optimizeMatchScore)}`}
                                >
                                  {optimizeMatchScore}%
                                </motion.span>
                                <span className="text-slate-400 text-[9px] font-bold">MATCH</span>
                              </div>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-4">
                              <motion.div
                                animate={{ width: `${optimizeMatchScore}%` }}
                                className={`h-full rounded-full ${meterColor(optimizeMatchScore)}`}
                                transition={{ type: 'spring', stiffness: 60 }}
                              />
                            </div>

                            {/* 85%+ Direct Match badge */}
                            <AnimatePresence>
                              {optimizeMatchScore >= 85 && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  className="p-3 bg-green-50 border border-green-200 rounded-xl text-center"
                                >
                                  <ShieldCheck className="w-5 h-5 text-green-500 mx-auto mb-1" />
                                  <p className="text-green-700 text-[10px] font-black leading-snug">
                                    {optimizeMatchScore}% Match! This counter-offer will be sent directly to {activeSeeker.name} for first dibs.
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {optimizeMatchScore < 85 && (
                              <div className="p-3 bg-slate-100 rounded-xl text-center">
                                <Gauge className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                                <p className="text-slate-500 text-[10px] font-bold leading-snug">
                                  Reach 85%+ for a direct match with {activeSeeker.name}.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ─── Component 4: Guided Sourcing Wizard ─── */}
            {fulfillPath === 'source-wizard' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                onClick={e => e.stopPropagation()}
              >
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                    <div>
                      <h3 className="text-slate-900 font-black text-base">
                        {sourcingSubmitted ? 'Submission Complete' : 'Source New Property'}
                      </h3>
                      {!sourcingSubmitted && (
                        <p className="text-slate-400 text-[11px] font-medium">
                          Step {sourcingStep} of 4 — For {activeSeeker.name}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!sourcingSubmitted && sourcingStep > 1 && (
                        <button onClick={() => setSourcingStep((sourcingStep - 1) as SourcingStep)}
                          className="px-3 py-1.5 text-slate-400 text-xs font-bold hover:text-slate-600 transition-colors">Back</button>
                      )}
                      {!sourcingSubmitted && sourcingStep === 1 && (
                        <button onClick={() => setFulfillPath('options')}
                          className="px-3 py-1.5 text-slate-400 text-xs font-bold hover:text-slate-600 transition-colors">Back</button>
                      )}
                      <button onClick={closeFulfillFlow} className="p-1.5 hover:bg-slate-50 rounded-lg"><X className="w-4 h-4 text-slate-400" /></button>
                    </div>
                  </div>

                  {/* Step Progress */}
                  {!sourcingSubmitted && (
                    <div className="px-6 pt-4 pb-2 shrink-0">
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4].map(s => (
                          <div key={s} className={`flex-1 h-1.5 rounded-full transition-colors ${s <= sourcingStep ? 'bg-primary' : 'bg-slate-200'}`} />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex-1 overflow-y-auto p-6">
                    {sourcingSubmitted ? (
                      /* Post-Submission */
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', delay: 0.2 }}
                          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 ${
                            sourcingMatchScore >= 85 ? 'bg-green-100' : 'bg-amber-100'
                          }`}
                        >
                          {sourcingMatchScore >= 85 ? (
                            <Zap className="w-10 h-10 text-green-500" />
                          ) : (
                            <CheckCircle2 className="w-10 h-10 text-amber-500" />
                          )}
                        </motion.div>

                        {sourcingMatchScore >= 85 ? (
                          <>
                            <h3 className="text-slate-900 font-black text-lg mb-2">
                              Listing Fast-Tracked!
                            </h3>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full mb-3">
                              <ShieldCheck className="w-4 h-4 text-green-500" />
                              <span className="text-green-700 text-xs font-black">{sourcingMatchScore}% Direct Match</span>
                            </div>
                            <p className="text-slate-500 text-sm font-medium">
                              Direct Match with <span className="font-bold">{activeSeeker.name}</span>.
                              <br />Verification SLA: <span className="font-black text-green-600">2 Hours</span>
                            </p>
                          </>
                        ) : (
                          <>
                            <h3 className="text-slate-900 font-black text-lg mb-2">Listing Submitted</h3>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full mb-3">
                              <AlertCircle className="w-4 h-4 text-amber-500" />
                              <span className="text-amber-700 text-xs font-black">General Marketplace</span>
                            </div>
                            <p className="text-slate-500 text-sm font-medium">
                              Listing submitted to General Marketplace.
                              <br />Verification SLA: <span className="font-black text-amber-600">24 Hours</span>
                            </p>
                          </>
                        )}

                        <button onClick={closeFulfillFlow} className="mt-6 px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors">
                          Back to Opportunities
                        </button>
                      </motion.div>
                    ) : (
                      <AnimatePresence mode="wait">
                        {/* Step 1: Context Initialization */}
                        {sourcingStep === 1 && (
                          <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Category & Type</p>

                            {/* Locked Category */}
                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                              <div className="flex items-center justify-between mb-3">
                                <label className="text-slate-700 text-xs font-black">Listing Category</label>
                                <span className="text-[9px] font-black text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Lock className="w-2.5 h-2.5" />LOCKED
                                </span>
                              </div>
                              <div className="px-4 py-3 bg-white border border-slate-200 rounded-xl">
                                <span className="text-sm font-black text-primary">
                                  {activeSeeker.intent === 'rent' ? 'Rent It' : 'Sell It'}
                                </span>
                              </div>
                            </div>

                            {/* Locked Property Type */}
                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                              <div className="flex items-center justify-between mb-3">
                                <label className="text-slate-700 text-xs font-black">Property Type</label>
                                <span className="text-[9px] font-black text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Lock className="w-2.5 h-2.5" />LOCKED
                                </span>
                              </div>
                              <div className="px-4 py-3 bg-white border border-slate-200 rounded-xl flex items-center gap-2">
                                <Home className="w-4 h-4 text-primary" />
                                <span className="text-sm font-black text-slate-800">
                                  {activeSeeker.lookingFor}
                                </span>
                              </div>
                            </div>

                            {/* Editable Location */}
                            <div>
                              <label className="text-slate-700 text-xs font-black block mb-2">Location / Neighborhood</label>
                              <input
                                type="text"
                                value={sourcingLocation}
                                onChange={e => setSourcingLocation(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                              />
                              {!sourcingLocation.toLowerCase().includes(activeSeeker.area.toLowerCase().split(',')[0].trim().toLowerCase()) && sourcingLocation.length > 2 && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                  className="flex items-center gap-1.5 mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                  <p className="text-amber-700 text-[10px] font-bold">
                                    Seeker prefers <span className="font-black">{activeSeeker.area}</span>. Moving far may reduce match score.
                                  </p>
                                </motion.div>
                              )}
                            </div>

                            <button onClick={() => setSourcingStep(2)}
                              className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
                              Continue <ArrowRight className="w-4 h-4" />
                            </button>
                          </motion.div>
                        )}

                        {/* Step 2: Details */}
                        {sourcingStep === 2 && (
                          <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Property Details</p>

                            {activeSeeker.bedrooms > 0 && (
                              <div>
                                <label className="text-slate-700 text-xs font-black block mb-2">Bedrooms</label>
                                <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-800">
                                  {activeSeeker.bedrooms} Bedrooms
                                </div>
                              </div>
                            )}

                            <div>
                              <label className="text-slate-700 text-xs font-black block mb-2">Description</label>
                              <textarea
                                value={sourcingDescription}
                                onChange={e => setSourcingDescription(e.target.value)}
                                placeholder="Describe the property features, amenities, and condition..."
                                rows={4}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
                              />
                            </div>

                            <button onClick={() => setSourcingStep(3)}
                              className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
                              Continue <ArrowRight className="w-4 h-4" />
                            </button>
                          </motion.div>
                        )}

                        {/* Step 3: Media */}
                        {sourcingStep === 3 && (
                          <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                            <h3 className="text-slate-900 font-black text-base mb-0">Visual Proof</h3>
                            <p className="text-slate-400 text-xs font-medium -mt-3">Let's show it off! Upload 3–20 high-quality images.</p>

                            {/* Guided Photo Slots */}
                            <div className="grid grid-cols-3 gap-3">
                              {[
                                { id: 'living', label: 'Living Room', hint: 'Cover photo' },
                                { id: 'bedroom', label: 'Bedroom', hint: 'Primary bedroom' },
                                { id: 'kitchen', label: 'Kitchen', hint: 'Show appliances' },
                                { id: 'bathroom', label: 'Bathroom', hint: 'Clean & bright' },
                                { id: 'exterior', label: 'Exterior', hint: 'Street view' },
                                { id: 'extra', label: 'More Photos', hint: 'Add extras' },
                              ].map((slot, i) => (
                                <motion.button
                                  key={slot.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.05 }}
                                  className="relative aspect-square border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-1.5 hover:border-primary hover:bg-primary/5 transition-all group"
                                >
                                  {i === 0 && (
                                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-white text-[8px] font-black rounded-full">COVER</div>
                                  )}
                                  <Camera className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                                  <span className="text-slate-500 text-[10px] font-bold">{slot.label}</span>
                                  <span className="text-slate-300 text-[8px] font-medium">{slot.hint}</span>
                                </motion.button>
                              ))}
                            </div>

                            {/* Drag & Drop Zone */}
                            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-5 text-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                              <Upload className="w-7 h-7 text-slate-300 mx-auto mb-2" />
                              <p className="text-slate-600 text-xs font-bold">Drag & drop photos here or click to browse</p>
                              <p className="text-slate-300 text-[10px] font-medium mt-1">PNG, JPG up to 10MB each • Max 20 photos</p>
                            </div>

                            {/* Video & 3D Model Options */}
                            <div className="grid grid-cols-2 gap-3">
                              <button className="flex items-center gap-3 p-3.5 border border-slate-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all">
                                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                  <ImageIcon className="w-4 h-4 text-blue-500" />
                                </div>
                                <div className="text-left">
                                  <p className="text-slate-800 text-[11px] font-bold">360° Tour</p>
                                  <p className="text-slate-400 text-[9px] font-medium">Panoramic images</p>
                                </div>
                              </button>
                              <button className="flex items-center gap-3 p-3.5 border border-slate-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all">
                                <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                                  <Video className="w-4 h-4 text-purple-500" />
                                </div>
                                <div className="text-left">
                                  <p className="text-slate-800 text-[11px] font-bold">Video Walkthrough</p>
                                  <p className="text-slate-400 text-[9px] font-medium">Max 2 min, MP4</p>
                                </div>
                              </button>
                            </div>

                            {/* 3D Model Upload */}
                            <button className="w-full flex items-center gap-3 p-3.5 border border-slate-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all">
                              <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                <Box className="w-4 h-4 text-emerald-500" />
                              </div>
                              <div className="text-left flex-1">
                                <p className="text-slate-800 text-[11px] font-bold">3D Model</p>
                                <p className="text-slate-400 text-[9px] font-medium">Upload .glb or .obj files for immersive viewing</p>
                              </div>
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded-full">NEW</span>
                            </button>

                            {/* Agent Live Verify */}
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                              className="p-3.5 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                  <Video className="w-4 h-4 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-slate-800 text-[11px] font-bold">Verify with Agent Live</p>
                                  <p className="text-slate-400 text-[9px] font-medium">Record a 5-second on-site video to boost Trust Rank</p>
                                </div>
                                <button className="px-3 py-1.5 bg-primary text-white text-[10px] font-black rounded-full hover:bg-primary/90 transition-colors">
                                  Record
                                </button>
                              </div>
                            </motion.div>

                            <button onClick={() => setSourcingStep(4)}
                              className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
                              Continue to Pricing <ArrowRight className="w-4 h-4" />
                            </button>
                          </motion.div>
                        )}

                        {/* Step 4: Verification / Pricing */}
                        {sourcingStep === 4 && (
                          <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Pricing & Verification</p>

                            {/* Seeker budget context */}
                            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-2">
                              <Lock className="w-4 h-4 text-blue-500 shrink-0" />
                              <p className="text-blue-700 text-xs font-bold">
                                Seeker&apos;s Budget: <span className="font-black">{activeSeeker.budget}</span>
                              </p>
                            </div>

                            {/* Asking Price */}
                            <div>
                              <label className="text-slate-700 text-xs font-black block mb-2">Your Asking Price</label>
                              <input
                                type="text"
                                value={sourcingPrice}
                                onChange={e => setSourcingPrice(e.target.value)}
                                placeholder={`e.g. ${activeSeeker.budget}`}
                                className={`w-full px-4 py-3.5 border-2 rounded-xl text-lg font-black transition-all focus:outline-none ${
                                  sourcingPrice && sourcingMatchScore >= 85
                                    ? 'border-green-400 bg-green-50/50 text-green-700 focus:ring-2 focus:ring-green-200'
                                    : sourcingPrice && sourcingMatchScore >= 60
                                    ? 'border-amber-300 bg-amber-50/50 text-amber-700 focus:ring-2 focus:ring-amber-200'
                                    : sourcingPrice
                                    ? 'border-red-300 bg-red-50/50 text-red-600 focus:ring-2 focus:ring-red-200'
                                    : 'border-slate-200 text-slate-800 focus:border-primary focus:ring-2 focus:ring-primary/10'
                                }`}
                              />
                            </div>

                            {/* Shadow Pricing Feedback */}
                            {sourcingPrice && (
                              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                                {/* Match meter bar */}
                                <div>
                                  <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-slate-500 text-[10px] font-bold">Match Score</span>
                                    <span className={`text-sm font-black ${meterTextColor(sourcingMatchScore)}`}>{sourcingMatchScore}%</span>
                                  </div>
                                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                                    <motion.div
                                      animate={{ width: `${sourcingMatchScore}%` }}
                                      className={`h-full rounded-full ${meterColor(sourcingMatchScore)}`}
                                      transition={{ type: 'spring', stiffness: 60 }}
                                    />
                                  </div>
                                </div>

                                <p className={`text-[11px] font-bold ${meterTextColor(sourcingMatchScore)}`}>
                                  {sourcingMatchScore >= 85
                                    ? 'Direct match pricing — this listing will be fast-tracked!'
                                    : sourcingMatchScore >= 60
                                    ? 'Good range. Lower price would improve your match score.'
                                    : 'Price gap is large. Consider pricing closer to the seeker\'s budget.'}
                                </p>
                              </motion.div>
                            )}

                            {/* Submit Button */}
                            <button
                              onClick={() => setSourcingSubmitted(true)}
                              disabled={!sourcingPrice}
                              className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                                !sourcingPrice
                                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                  : 'text-white shadow-sm hover:shadow-md'
                              }`}
                              style={sourcingPrice ? { backgroundColor: '#6D1D2C' } : undefined}
                            >
                              <Send className="w-4 h-4" />
                              Submit for Verification
                              {sourcingPrice && sourcingMatchScore >= 85 && (
                                <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-black">Direct Match</span>
                              )}
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
