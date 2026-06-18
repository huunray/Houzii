import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Tag, Key, Calendar, MapPin, ChevronRight, ChevronLeft, Upload,
  Shield, Lock, Camera, Video, FileText, CircleCheck, Plus, Minus,
  Wifi, Car, Dumbbell, Waves, Tv, UtensilsCrossed, Wind, Zap,
  ShieldCheck, Sun, Coffee, Bath, Music, Dog, Baby, Flower2,
  Shirt, Microwave, Thermometer, MonitorPlay, Save, Send,
  Home, Building, Landmark, TreePine, Image as ImageIcon,
  Search, Eye, TrendingUp, Hash, ToggleLeft, ToggleRight, Info, BarChart3,
  UserPlus, Stamp, AlertTriangle, Mail, ChevronDown, ChevronUp,
  CheckCircle2, LayoutDashboard, Award, Receipt, Scale, Banknote, Loader2, Sparkles
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';

type AuthPath = 'land-use' | 'utility' | 'legal' | null;
type LookupState = 'idle' | 'loading' | 'matched' | 'mismatch';

const NIGERIAN_BANKS = [
  'Access Bank', 'Citibank', 'Ecobank', 'Fidelity Bank', 'First Bank',
  'First City Monument Bank (FCMB)', 'Globus Bank', 'Guaranty Trust Bank (GTB)',
  'Heritage Bank', 'Keystone Bank', 'Kuda Bank', 'OPay', 'Polaris Bank',
  'Providus Bank', 'Stanbic IBTC', 'Standard Chartered', 'Sterling Bank',
  'SunTrust Bank', 'Union Bank', 'United Bank for Africa (UBA)',
  'Unity Bank', 'Wema Bank', 'Zenith Bank',
];

type ListingType = 'sale' | 'rent' | 'shortlet' | null;
type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const STEPS = ['Location', 'Property Spec', 'Pricing', 'Media', 'Authorization', 'Payouts', 'Review'];


const TITLE_DOCUMENTS = [
  'Certificate of Occupancy (C of O)',
  'Governor\'s Consent',
  'Deed of Assignment',
  'Gazette',
  'Excision',
  'Court Judgment',
  'Land Purchase Receipt',
];

const PROPERTY_TYPES = [
  { label: 'Apartment', icon: Building },
  { label: 'Duplex', icon: Home },
  { label: 'Mansion', icon: Landmark },
  { label: 'Land', icon: TreePine },
];

const AMENITIES = [
  { id: 'electricity', label: '24/7 Electricity', icon: Zap },
  { id: 'wifi', label: 'Fiber WiFi', icon: Wifi },
  { id: 'pool', label: 'Swimming Pool', icon: Waves },
  { id: 'gym', label: 'Gym', icon: Dumbbell },
  { id: 'parking', label: 'Parking', icon: Car },
  { id: 'ac', label: 'Air Conditioning', icon: Wind },
  { id: 'netflix', label: 'Netflix', icon: MonitorPlay },
  { id: 'security', label: '24/7 Security', icon: ShieldCheck },
  { id: 'balcony', label: 'Balcony/Terrace', icon: Sun },
  { id: 'kitchen', label: 'Equipped Kitchen', icon: UtensilsCrossed },
  { id: 'coffee', label: 'Coffee Machine', icon: Coffee },
  { id: 'bathtub', label: 'Bathtub/Jacuzzi', icon: Bath },
  { id: 'music', label: 'Sound System', icon: Music },
  { id: 'pets', label: 'Pet Friendly', icon: Dog },
  { id: 'kids', label: 'Kid Friendly', icon: Baby },
  { id: 'garden', label: 'Garden', icon: Flower2 },
  { id: 'laundry', label: 'Laundry', icon: Shirt },
  { id: 'microwave', label: 'Microwave', icon: Microwave },
  { id: 'heating', label: 'Heating', icon: Thermometer },
  { id: 'tv', label: 'Smart TV', icon: Tv },
];

const HOUSE_RULES = [
  'No smoking', 'No parties', 'No pets', 'No loud music after 10pm',
  'Max 4 guests', 'Max 6 guests', 'Max 8 guests', 'Check-in after 2pm',
  'Check-out before 12pm', 'Professionals only',
];

const PHOTO_SLOTS = [
  { id: 'living', label: 'Living Room', hint: 'Cover photo' },
  { id: 'bedroom', label: 'Bedroom', hint: 'Primary bedroom' },
  { id: 'kitchen', label: 'Kitchen', hint: 'Show appliances' },
  { id: 'bathroom', label: 'Bathroom', hint: 'Clean & bright' },
  { id: 'exterior', label: 'Exterior', hint: 'Front view' },
  { id: 'extra', label: 'Additional', hint: 'Any angle' },
];

export interface SubmittedListing {
  id: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  listingType: ListingType;
  propertyType: string;
  description: string;
  submittedAt: Date;
}

interface ListingEngineProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  onSubmit?: (listing: SubmittedListing) => void;
}

export const ListingEngine: React.FC<ListingEngineProps> = ({ isOpen, onClose, userName, onSubmit }) => {
  const [step, setStep] = useState<Step>(1);
  const [listingType, setListingType] = useState<ListingType>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Sale fields
  const [titleDoc, setTitleDoc] = useState('');
  const [landSize, setLandSize] = useState('');
  const [price, setPrice] = useState('');
  const [negotiable, setNegotiable] = useState(false);
  const [propertyType, setPropertyType] = useState('');
  const [propertyStatus, setPropertyStatus] = useState('');
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(2);

  // Rent fields
  const [annualRent, setAnnualRent] = useState('');
  const [serviceCharge, setServiceCharge] = useState('');
  const [cautionFee, setCautionFee] = useState('');
  const [agencyFee, setAgencyFee] = useState('');
  const [rentFrequency, setRentFrequency] = useState('Yearly');
  const [tenantPref, setTenantPref] = useState('');

  // Shortlet fields
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const [minStay, setMinStay] = useState(1);
  const [maxStay, setMaxStay] = useState(30);
  const [nightlyRate, setNightlyRate] = useState('');

  // Common
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [verificationDoc, setVerificationDoc] = useState(false);
  const [agentVideo, setAgentVideo] = useState(false);

  // Authorization & Trust (Step 5) — 3-tier verification
  const [authPath, setAuthPath] = useState<AuthPath>(null);
  const [mandateFile, setMandateFile] = useState(false);
  const [landlordName, setLandlordName] = useState('');
  const [landlordContact, setLandlordContact] = useState('');
  // Path-specific evidence
  const [docFront, setDocFront] = useState(false);
  const [docBack, setDocBack] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState('');
  const [billDate, setBillDate] = useState('');
  const [utilityMeterNumber, setUtilityMeterNumber] = useState('');
  const [nbaSeal, setNbaSeal] = useState('');
  const [lawFirmName, setLawFirmName] = useState('');
  // Financial anchor (Landlord's payout for THIS property — moved to Step 6)
  const [bankName, setBankName] = useState('');
  const [bankSearch, setBankSearch] = useState('');
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [lookupState, setLookupState] = useState<LookupState>('idle');
  const [resolvedAccountName, setResolvedAccountName] = useState('');
  // Agent's own payout (saved as default for future listings)
  // Mock: in real app, derive from agent profile / API
  const [hasSavedPayoutProfile] = useState(false);
  const [selfBankName, setSelfBankName] = useState('');
  const [selfBankSearch, setSelfBankSearch] = useState('');
  const [showSelfBankDropdown, setShowSelfBankDropdown] = useState(false);
  const [selfAccountNumber, setSelfAccountNumber] = useState('');
  const [selfAccountName, setSelfAccountName] = useState('');
  const [saveSelfPayoutDefault, setSaveSelfPayoutDefault] = useState(true);
  // Liability checklist
  const [affirmSighted, setAffirmSighted] = useState(false);
  const [affirmAuthentic, setAffirmAuthentic] = useState(false);
  const [affirmLiability, setAffirmLiability] = useState(false);


  // Unit details (new)
  const [apartmentNumber, setApartmentNumber] = useState('');
  const [showGatedEstate, setShowGatedEstate] = useState(false);
  const [gatedEstateName, setGatedEstateName] = useState('');

  // Property Spec additions
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [propertyRules, setPropertyRules] = useState<string[]>([]);
  const [customRules, setCustomRules] = useState<string[]>([]);
  const [maxOccupancyEnabled, setMaxOccupancyEnabled] = useState(false);
  const [maxOccupancy, setMaxOccupancy] = useState(4);
  const [referenceRequired, setReferenceRequired] = useState(false);

  // Agency fee mode
  const [agencyFeeMode, setAgencyFeeMode] = useState<'percent' | 'naira'>('percent');
  const [agencyFeePercent, setAgencyFeePercent] = useState('10');

  const reset = useCallback(() => {
    setStep(1);
    setListingType(null);
    setTitleDoc('');
    setLandSize('');
    setPrice('');
    setNegotiable(false);
    setPropertyType('');
    setPropertyStatus('');
    setBedrooms(3);
    setBathrooms(2);
    setAnnualRent('');
    setServiceCharge('');
    setCautionFee('');
    setAgencyFee('');
    setRentFrequency('Yearly');
    setTenantPref('');
    setSelectedAmenities([]);
    setSelectedRules([]);
    setMinStay(1);
    setMaxStay(30);
    setNightlyRate('');
    setAddress('');
    setDescription('');
    setUploadedPhotos([]);
    setVerificationDoc(false);
    setAgentVideo(false);
    setAuthPath(null);
    setMandateFile(false);
    setLandlordName('');
    setLandlordContact('');
    setDocFront(false); setDocBack(false); setReceiptNumber('');
    setBillDate(''); setUtilityMeterNumber(''); setNbaSeal(''); setLawFirmName('');
    setBankName(''); setBankSearch(''); setShowBankDropdown(false);
    setAccountNumber(''); setLookupState('idle'); setResolvedAccountName('');
    setAffirmSighted(false); setAffirmAuthentic(false); setAffirmLiability(false);
    setApartmentNumber('');
    setShowGatedEstate(false);
    setGatedEstateName('');
    setShowAllAmenities(false);
    setPropertyRules([]);
    setCustomRules([]);
    setMaxOccupancyEnabled(false);
    setMaxOccupancy(4);
    setReferenceRequired(false);
    setAgencyFeeMode('percent');
    setAgencyFeePercent('10');
  }, []);

  const handleClose = () => {
    reset();
    setShowSuccess(false);
    onClose();
  };

  const handleSubmit = () => {
    const priceDisplay = listingType === 'rent' ? `₦${annualRent || '0'}/yr` 
      : listingType === 'shortlet' ? `₦${nightlyRate || '0'}/night` 
      : `₦${price || '0'}`;
    
    const submitted: SubmittedListing = {
      id: `listing-${Date.now()}`,
      title: `${propertyType || 'Property'} in ${address?.split(',')[0] || 'Lagos'}`,
      location: address || 'Lagos, Nigeria',
      price: priceDisplay,
      beds: bedrooms,
      baths: bathrooms,
      listingType,
      propertyType,
      description,
      submittedAt: new Date(),
    };
    onSubmit?.(submitted);
    setShowSuccess(true);
  };

  const toggleAmenity = (id: string) => {
    setSelectedAmenities(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const toggleRule = (rule: string) => {
    setSelectedRules(prev => prev.includes(rule) ? prev.filter(r => r !== rule) : [...prev, rule]);
  };

  const canProceed = () => {
    if (step === 1) return listingType !== null && address.trim() !== '';
    if (step === 2) return propertyType !== '';
    if (step === 3) {
      if (listingType === 'sale') return titleDoc !== '' && price !== '';
      if (listingType === 'rent') return annualRent !== '';
      if (listingType === 'shortlet') return selectedAmenities.length > 0 && nightlyRate !== '';
    }
    if (step === 5) {
      const evidenceOk = authPath !== 'utility' || utilityMeterNumber.trim() !== '';
      return !!authPath && evidenceOk && affirmSighted && affirmAuthentic && affirmLiability;
    }
    if (step === 6) {
      const selfOk = hasSavedPayoutProfile || (
        !!selfBankName && selfAccountNumber.length === 10 && selfAccountName.trim() !== ''
      );
      const landlordOk = !!bankName && accountNumber.length === 10 && lookupState === 'matched';
      return selfOk && landlordOk;
    }
    return true;
  };


  const pricePerSqm = landSize && price ? (parseFloat(price.replace(/,/g, '')) / parseFloat(landSize)).toLocaleString('en-NG', { maximumFractionDigits: 0 }) : null;
  const totalPackage = [annualRent, serviceCharge, cautionFee, agencyFee]
    .filter(Boolean)
    .reduce((sum, v) => sum + parseFloat(v.replace(/,/g, '') || '0'), 0);

  if (!isOpen) return null;

  // AREA MARKET DATA (simulated intelligence)
  const AREA_MARKET_DATA: Record<string, { views: number; avgPrice: number; avgRent: number; avgNightly: number; demand: string }> = {
    'lekki': { views: 1200, avgPrice: 120000000, avgRent: 3200000, avgNightly: 75000, demand: 'High' },
    'ikoyi': { views: 890, avgPrice: 250000000, avgRent: 5500000, avgNightly: 120000, demand: 'Very High' },
    'victoria island': { views: 1450, avgPrice: 180000000, avgRent: 4500000, avgNightly: 95000, demand: 'Very High' },
    'ajah': { views: 2100, avgPrice: 45000000, avgRent: 1200000, avgNightly: 35000, demand: 'High' },
    'yaba': { views: 1800, avgPrice: 35000000, avgRent: 1500000, avgNightly: 40000, demand: 'Medium' },
    'surulere': { views: 950, avgPrice: 28000000, avgRent: 1000000, avgNightly: 30000, demand: 'Medium' },
    'ikeja': { views: 1100, avgPrice: 55000000, avgRent: 2000000, avgNightly: 50000, demand: 'High' },
  };

  const getAreaData = (addr: string) => {
    const lower = addr.toLowerCase();
    for (const [key, data] of Object.entries(AREA_MARKET_DATA)) {
      if (lower.includes(key)) return { area: key.charAt(0).toUpperCase() + key.slice(1), ...data };
    }
    return null;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 pt-5 pb-4 border-b border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-slate-900 font-black text-lg">New Listing</h2>
                <p className="text-slate-400 text-xs font-medium mt-0.5">
                  {step === 1 && `Hi ${userName || 'Agent'}! Let's get your property live.`}
                  {step === 2 && 'Define the property specs and layout.'}
                  {step === 3 && (
                    listingType === 'sale' ? 'Ownership details for your Verified Badge.' :
                    listingType === 'rent' ? 'Transparency builds trust. Break down the costs.' :
                    'Hospitality matters. Show what makes your space special.'
                  )}
                  {step === 4 && 'High-quality photos get 3x more leads.'}
                  {step === 5 && 'Verified listings get 3x more views.'}
                  {step === 6 && 'Set payout accounts. Saved as default for your future listings.'}
                  {step === 7 && 'Final step to earn your Verified badge.'}

                </p>
              </div>
              <button onClick={handleClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Stepper */}
            <div className="flex items-center gap-1">
              {STEPS.map((s, i) => (
                <div key={s} className="flex-1 flex items-center gap-1">
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black transition-colors ${
                    i + 1 < step ? 'bg-green-50 text-green-600' :
                    i + 1 === step ? 'bg-primary/10 text-primary' :
                    'bg-slate-50 text-slate-300'
                  }`}>
                    {i + 1 < step ? <CircleCheck className="w-3 h-3" /> : <span>{i + 1}</span>}
                    <span className="hidden sm:inline">{s}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 rounded-full ${i + 1 < step ? 'bg-green-300' : 'bg-slate-100'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <AnimatePresence mode="wait">
              {/* Step 1: Category & Location */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                  <h3 className="text-slate-900 font-black text-base mb-1">What are we listing today?</h3>
                  <p className="text-slate-400 text-xs font-medium mb-5">Select the listing type to get started.</p>

                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {([
                      { type: 'sale' as const, label: 'Sell It', icon: Tag, tip: '4x more serious inquiries', color: 'from-primary to-red-400' },
                      { type: 'rent' as const, label: 'Rent It', icon: Key, tip: 'Steady monthly income', color: 'from-blue-500 to-blue-400' },
                      { type: 'shortlet' as const, label: 'Shortlet It', icon: Calendar, tip: 'Higher nightly yield', color: 'from-emerald-500 to-emerald-400' },
                    ]).map(item => (
                      <motion.button
                        key={item.type}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setListingType(item.type)}
                        className={`relative p-5 rounded-2xl border-2 text-left transition-all ${
                          listingType === item.type
                            ? 'border-primary bg-primary/5 shadow-md'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                        }`}
                      >
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}>
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-slate-900 font-black text-sm">{item.label}</p>
                        <p className="text-slate-400 text-[10px] font-medium mt-1">{item.tip}</p>
                        {listingType === item.type && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3">
                            <CircleCheck className="w-5 h-5 text-primary" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {listingType && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                      <div className="p-3 bg-primary/5 border border-primary/10 rounded-xl">
                        <p className="text-primary text-xs font-bold">
                          {listingType === 'sale' && '✨ Verified Sale listings get 4x more serious inquiries.'}
                          {listingType === 'rent' && '✨ Transparent rental packages attract quality tenants faster.'}
                          {listingType === 'shortlet' && '✨ Verified Shortlet hosts earn 60% more bookings.'}
                        </p>
                      </div>

                      {/* Address Search */}
                      <div>
                        <label className="text-slate-700 text-xs font-bold block mb-2">Building / Address</label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                          <input
                            type="text"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            placeholder="Search address... e.g. 12 Admiralty Way, Lekki Phase 1"
                            className="w-full pl-10 pr-10 py-3.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                          />
                        </div>
                      </div>

                      {/* Unit Details Section */}
                      <div className="border border-slate-200 rounded-xl p-4 space-y-5">
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-primary" />
                          <span className="text-slate-800 text-xs font-black">Unit Details</span>
                        </div>

                        <div>
                          <label className="text-slate-600 text-xs font-bold block mb-1.5">Apartment / Flat Number</label>
                          <input
                            type="text"
                            value={apartmentNumber}
                            onChange={e => setApartmentNumber(e.target.value)}
                            placeholder="e.g. Flat 4B, Unit 12"
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-slate-600 text-xs font-bold block">Gated Estate</span>
                            <span className="text-slate-400 text-[10px] font-medium">Is this property within a gated estate?</span>
                          </div>
                          <button
                            onClick={() => { setShowGatedEstate(!showGatedEstate); if (showGatedEstate) setGatedEstateName(''); }}
                            className="flex items-center gap-1"
                          >
                            {showGatedEstate ? (
                              <ToggleRight className="w-8 h-8 text-primary" />
                            ) : (
                              <ToggleLeft className="w-8 h-8 text-slate-300" />
                            )}
                          </button>
                        </div>

                        <AnimatePresence>
                          {showGatedEstate && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                              <input
                                type="text"
                                value={gatedEstateName}
                                onChange={e => setGatedEstateName(e.target.value)}
                                placeholder="e.g. Banana Island, Pinnock Beach Estate"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Houzii Insight Demand Card */}
                      {address.trim().length > 3 && (() => {
                        const areaData = getAreaData(address);
                        if (!areaData) return null;
                        return (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-blue-50 border border-blue-100 rounded-xl"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                <Eye className="w-4 h-4 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <span className="text-blue-800 text-xs font-black">Houzii Insight</span>
                                  <div className="group relative">
                                    <Info className="w-3 h-3 text-blue-400 cursor-help" />
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                                      Based on Houzii marketplace data for the {areaData.area} area over the last 7 days.
                                    </div>
                                  </div>
                                </div>
                                <p className="text-blue-700 text-xs font-medium">
                                  This area has seen <span className="font-black">{areaData.views.toLocaleString()}</span> property views this week.
                                  Demand is <span className={`font-black ${areaData.demand === 'Very High' ? 'text-green-600' : areaData.demand === 'High' ? 'text-blue-700' : 'text-amber-600'}`}>{areaData.demand}</span>.
                                </p>
                              </div>
                              <div className={`px-2 py-1 rounded-full text-[9px] font-black shrink-0 ${
                                areaData.demand === 'Very High' ? 'bg-green-100 text-green-700' : areaData.demand === 'High' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                <TrendingUp className="w-3 h-3 inline mr-0.5" />{areaData.demand}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })()}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Step 2: Property Spec */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                  <h3 className="text-slate-900 font-black text-base mb-1">Property Specifications</h3>
                  <p className="text-slate-400 text-xs font-medium mb-5">Tell us more about the property layout and features.</p>

                  <div className="space-y-6">
                    <div>
                      <label className="text-slate-700 text-xs font-bold block mb-2">Property Type</label>
                      <div className="grid grid-cols-4 gap-2">
                        {PROPERTY_TYPES.map(pt => (
                          <button
                            key={pt.label}
                            onClick={() => setPropertyType(pt.label)}
                            className={`p-3 rounded-xl border-2 text-center transition-all ${
                              propertyType === pt.label
                                ? 'border-primary bg-primary/5'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <pt.icon className={`w-5 h-5 mx-auto mb-1 ${propertyType === pt.label ? 'text-primary' : 'text-slate-400'}`} />
                            <span className={`text-[10px] font-bold ${propertyType === pt.label ? 'text-primary' : 'text-slate-500'}`}>{pt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {propertyType && propertyType !== 'Land' && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-slate-700 text-xs font-bold block mb-2">Bedrooms</label>
                          <div className="flex items-center gap-3">
                            <button onClick={() => setBedrooms(Math.max(0, bedrooms - 1))} className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-primary hover:text-primary transition-colors">
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-slate-900 font-black text-lg w-8 text-center">{bedrooms}</span>
                            <button onClick={() => setBedrooms(bedrooms + 1)} className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-primary hover:text-primary transition-colors">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="text-slate-700 text-xs font-bold block mb-2">Bathrooms</label>
                          <div className="flex items-center gap-3">
                            <button onClick={() => setBathrooms(Math.max(0, bathrooms - 1))} className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-primary hover:text-primary transition-colors">
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-slate-900 font-black text-lg w-8 text-center">{bathrooms}</span>
                            <button onClick={() => setBathrooms(bathrooms + 1)} className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-primary hover:text-primary transition-colors">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div>
                      <label className="text-slate-700 text-xs font-bold block mb-2">Description</label>
                      <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Describe the property in a few sentences..."
                        rows={3}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                      />
                    </div>

                    {/* Key Amenities */}
                    <div>
                      <label className="text-slate-700 text-xs font-bold block mb-2">Key Amenities</label>
                      <div className="grid grid-cols-4 gap-2">
                        {(showAllAmenities ? AMENITIES : AMENITIES.slice(0, 8)).map(a => (
                          <button
                            key={a.id}
                            onClick={() => toggleAmenity(a.id)}
                            className={`p-2.5 rounded-xl border text-center transition-all ${
                              selectedAmenities.includes(a.id)
                                ? 'border-primary bg-primary/5'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <a.icon className={`w-4 h-4 mx-auto mb-1 ${selectedAmenities.includes(a.id) ? 'text-primary' : 'text-slate-400'}`} />
                            <span className={`text-[9px] font-bold leading-tight block ${selectedAmenities.includes(a.id) ? 'text-primary' : 'text-slate-500'}`}>{a.label}</span>
                          </button>
                        ))}
                      </div>
                      {!showAllAmenities && (
                        <button
                          onClick={() => setShowAllAmenities(true)}
                          className="mt-2 flex items-center gap-1 text-xs font-bold text-primary/70 hover:text-primary transition-colors"
                        >
                          See more amenities <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {showAllAmenities && (
                        <button
                          onClick={() => setShowAllAmenities(false)}
                          className="mt-2 flex items-center gap-1 text-xs font-bold text-primary/70 hover:text-primary transition-colors"
                        >
                          Show less <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="text-slate-700 text-xs font-bold block mb-2">Tenant Preferences (optional)</label>
                      <input type="text" value={tenantPref} onChange={e => setTenantPref(e.target.value)} placeholder="e.g. Professionals only, Families preferred" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
                    </div>

                    {/* Property Rules */}
                    <div>
                      <label className="text-slate-700 text-xs font-bold block mb-2">Property Rules</label>
                      <div className="space-y-2">
                        {[
                          { id: 'no-pets', label: 'No Pets Allowed' },
                          { id: 'no-parties', label: 'No Parties / Events' },
                          { id: 'quiet-hours', label: 'Quiet Hours after 10 PM' },
                          { id: 'no-smoking', label: 'No Smoking' },
                          { id: 'max-occupancy', label: 'Maximum Occupancy Limit' },
                        ].map(rule => (
                          <div key={rule.id}>
                            <label
                              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                                propertyRules.includes(rule.id)
                                  ? 'bg-primary/5 border border-primary/20'
                                  : 'bg-slate-50 border border-transparent hover:bg-slate-100'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={propertyRules.includes(rule.id)}
                                onChange={() => {
                                  if (propertyRules.includes(rule.id)) {
                                    setPropertyRules(propertyRules.filter(r => r !== rule.id));
                                    if (rule.id === 'max-occupancy') setMaxOccupancyEnabled(false);
                                  } else {
                                    setPropertyRules([...propertyRules, rule.id]);
                                    if (rule.id === 'max-occupancy') setMaxOccupancyEnabled(true);
                                  }
                                }}
                                className="w-4 h-4 rounded border-slate-300 accent-primary"
                              />
                              <span className={`text-xs font-bold ${propertyRules.includes(rule.id) ? 'text-primary' : 'text-slate-600'}`}>{rule.label}</span>
                            </label>
                            {/* Conditional occupancy stepper */}
                            {rule.id === 'max-occupancy' && maxOccupancyEnabled && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="ml-10 mt-2 flex items-center gap-3"
                              >
                                <button
                                  onClick={() => setMaxOccupancy(Math.max(1, maxOccupancy - 1))}
                                  className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-primary hover:text-primary transition-colors"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-slate-900 font-black text-base w-6 text-center">{maxOccupancy}</span>
                                <button
                                  onClick={() => setMaxOccupancy(maxOccupancy + 1)}
                                  className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-primary hover:text-primary transition-colors"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-slate-400 text-[10px] font-bold">People</span>
                              </motion.div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Custom rules */}
                      {customRules.map((rule, i) => (
                        <div key={`custom-${i}`} className="mt-2 flex items-center gap-2">
                          <input
                            type="text"
                            value={rule}
                            onChange={e => {
                              const updated = [...customRules];
                              updated[i] = e.target.value;
                              setCustomRules(updated);
                            }}
                            placeholder={`Custom rule ${i + 1}`}
                            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                          />
                          <button
                            onClick={() => setCustomRules(customRules.filter((_, idx) => idx !== i))}
                            className="p-2 text-slate-300 hover:text-red-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => setCustomRules([...customRules, ''])}
                        className="mt-2 flex items-center gap-1.5 text-xs font-bold text-primary/70 hover:text-primary transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add more
                      </button>
                    </div>

                    {/* Reference Required Toggle */}
                    <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="text-slate-700 text-xs font-bold block">Reference Required</span>
                        <span className="text-slate-400 text-[10px] font-medium">Ask seekers for a guarantor or previous landlord reference.</span>
                      </div>
                      <Switch
                        checked={referenceRequired}
                        onCheckedChange={setReferenceRequired}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Pricing & Data */}
              {step === 3 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                  {/* SALE */}
                  {listingType === 'sale' && (() => {
                    const areaData = getAreaData(address);
                    const priceNum = parseFloat(price.replace(/,/g, '') || '0');
                    const avgPrice = areaData?.avgPrice || 120000000;
                    const ratio = priceNum > 0 ? priceNum / avgPrice : 0;
                    // Market meter: 0=green, 0.5=green, 1.0=amber, 1.5+=red
                    const meterPercent = Math.min(ratio * 50, 100);
                    const meterColor = ratio <= 1.05 ? '#22c55e' : ratio <= 1.3 ? '#f59e0b' : '#ef4444';
                    const meterLabel = ratio <= 1.05 ? 'Competitive' : ratio <= 1.3 ? 'Above Average' : 'Premium';
                    const meterLabelColor = ratio <= 1.05 ? 'text-green-600 bg-green-50 border-green-200' : ratio <= 1.3 ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-red-600 bg-red-50 border-red-200';

                    return (
                    <div className="space-y-7">
                      <div>
                        <h3 className="text-slate-900 font-black text-base mb-1">Pricing Advisor</h3>
                        <p className="text-slate-400 text-xs font-medium">Set the right price with market intelligence.</p>
                      </div>

                      <div>
                        <label className="text-slate-700 text-xs font-bold block mb-2">Title Document Type</label>
                        <select
                          value={titleDoc}
                          onChange={e => setTitleDoc(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 appearance-none"
                        >
                          <option value="">Select document type...</option>
                          {TITLE_DOCUMENTS.map(doc => <option key={doc} value={doc}>{doc}</option>)}
                        </select>
                      </div>

                      {/* Large Price Input */}
                      <div>
                        <label className="text-slate-700 text-xs font-bold block mb-2">Asking Price</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900 font-black text-xl">₦</span>
                          <input
                            type="text"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            placeholder="150,000,000"
                            className="w-full pl-10 pr-4 py-5 border-2 border-slate-200 rounded-2xl text-xl text-slate-900 font-black placeholder:text-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                          />
                        </div>
                      </div>

                      {/* Market Meter */}
                      {priceNum > 0 && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <BarChart3 className="w-4 h-4 text-slate-500" />
                              <span className="text-slate-700 text-xs font-black">Market Meter</span>
                              <div className="group relative">
                                <Info className="w-3 h-3 text-slate-400 cursor-help" />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-2 bg-slate-800 text-white text-[10px] font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                                  Market intelligence based on recent {areaData?.area || 'area'} transactions for {bedrooms}-bed properties.
                                </div>
                              </div>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${meterLabelColor}`}>
                              {meterLabel}
                            </span>
                          </div>

                          {/* Gradient bar */}
                          <div className="relative h-3 rounded-full overflow-hidden" style={{ background: 'linear-gradient(to right, #22c55e 0%, #22c55e 40%, #f59e0b 60%, #ef4444 85%, #dc2626 100%)' }}>
                            <motion.div
                              initial={{ left: '0%' }}
                              animate={{ left: `${Math.min(meterPercent, 97)}%` }}
                              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white rounded-full shadow-lg border-2"
                              style={{ borderColor: meterColor }}
                            />
                          </div>
                          <div className="flex justify-between text-[9px] font-bold text-slate-400">
                            <span>Below Market</span>
                            <span>Market Rate</span>
                            <span>Premium</span>
                          </div>

                          {/* Dynamic feedback text */}
                          {ratio > 1.05 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-3 rounded-xl border ${ratio > 1.3 ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
                              <p className={`text-xs font-medium ${ratio > 1.3 ? 'text-red-700' : 'text-amber-700'}`}>
                                Average price for a <span className="font-black">{bedrooms}-bed {propertyType || 'property'}</span> in {areaData?.area || 'this area'} is{' '}
                                <span className="font-black">₦{avgPrice.toLocaleString('en-NG')}</span>.{' '}
                                {ratio > 1.3
                                  ? 'High pricing may significantly reduce initial inquiries.'
                                  : 'Slightly above average — may reduce initial inquiries.'}
                              </p>
                            </motion.div>
                          )}
                          {ratio <= 1.05 && ratio > 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-xl border bg-green-50 border-green-200">
                              <p className="text-xs font-medium text-green-700">
                                Great pricing! This is competitive for a <span className="font-black">{bedrooms}-bed</span> in <span className="font-black">{areaData?.area || 'this area'}</span>. Expect strong inquiry volume.
                              </p>
                            </motion.div>
                          )}

                          {/* Comparison Table */}
                          <div className="border border-slate-200 rounded-xl overflow-hidden">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-slate-50">
                                  <th className="text-left text-[10px] font-black text-slate-500 uppercase tracking-wider px-4 py-2.5">Metric</th>
                                  <th className="text-right text-[10px] font-black text-slate-500 uppercase tracking-wider px-4 py-2.5">Area Average</th>
                                  <th className="text-right text-[10px] font-black text-slate-500 uppercase tracking-wider px-4 py-2.5">Your Price</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-t border-slate-100">
                                  <td className="px-4 py-3 text-xs font-bold text-slate-600">Asking Price</td>
                                  <td className="px-4 py-3 text-xs font-black text-slate-800 text-right">₦{avgPrice.toLocaleString('en-NG')}</td>
                                  <td className="px-4 py-3 text-right">
                                    <span className={`text-xs font-black ${ratio <= 1.05 ? 'text-green-600' : ratio <= 1.3 ? 'text-amber-600' : 'text-red-600'}`}>
                                      ₦{priceNum.toLocaleString('en-NG')}
                                    </span>
                                  </td>
                                </tr>
                                <tr className="border-t border-slate-100">
                                  <td className="px-4 py-3 text-xs font-bold text-slate-600">Difference</td>
                                  <td className="px-4 py-3 text-xs font-black text-slate-400 text-right">—</td>
                                  <td className="px-4 py-3 text-right">
                                    <span className={`text-xs font-black ${priceNum >= avgPrice ? (ratio <= 1.05 ? 'text-green-600' : ratio <= 1.3 ? 'text-amber-600' : 'text-red-600') : 'text-blue-600'}`}>
                                      {priceNum >= avgPrice ? '+' : ''}₦{Math.abs(priceNum - avgPrice).toLocaleString('en-NG')}
                                    </span>
                                  </td>
                                </tr>
                                <tr className="border-t border-slate-100">
                                  <td className="px-4 py-3 text-xs font-bold text-slate-600">vs. Average</td>
                                  <td className="px-4 py-3 text-xs font-black text-slate-400 text-right">Baseline</td>
                                  <td className="px-4 py-3 text-right">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${ratio <= 1.05 ? 'bg-green-50 text-green-600' : ratio <= 1.3 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>
                                      {priceNum >= avgPrice ? '+' : ''}{((ratio - 1) * 100).toFixed(0)}%
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </motion.div>
                      )}

                      <div className="flex items-center justify-between p-3 border border-slate-200 rounded-xl">
                        <span className="text-slate-700 text-xs font-bold">Price Negotiable?</span>
                        <button
                          onClick={() => setNegotiable(!negotiable)}
                          className={`w-11 h-6 rounded-full transition-colors relative ${negotiable ? 'bg-primary' : 'bg-slate-200'}`}
                        >
                          <motion.div
                            animate={{ x: negotiable ? 20 : 2 }}
                            className="w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5"
                          />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-slate-700 text-xs font-bold block mb-2">Land Size (Sqm)</label>
                          <input
                            type="text"
                            value={landSize}
                            onChange={e => setLandSize(e.target.value)}
                            placeholder="e.g. 500"
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                          />
                        </div>
                        <div className="flex items-end">
                          {pricePerSqm && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                              <span className="text-emerald-700 text-[10px] font-bold">Price/Sqm</span>
                              <span className="text-emerald-800 font-black text-sm">₦{pricePerSqm}</span>
                            </motion.div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-700 text-xs font-bold block mb-2">Property Status</label>
                        <div className="flex gap-2">
                          {['New Build', 'Off-plan', 'Renovated', 'Standard'].map(s => (
                            <button
                              key={s}
                              onClick={() => setPropertyStatus(s)}
                              className={`px-4 py-2 rounded-full text-xs font-bold border-2 transition-all ${
                                propertyStatus === s ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    );
                  })()}

                  {/* RENT */}
                  {listingType === 'rent' && (() => {
                    const areaData = getAreaData(address);
                    const rentNum = parseFloat(annualRent.replace(/,/g, '') || '0');
                    const avgRent = areaData?.avgRent || 3200000;
                    const rentRatio = rentNum > 0 ? rentNum / avgRent : 0;
                    const rentMeterPercent = Math.min(rentRatio * 50, 100);
                    const rentMeterColor = rentRatio <= 1.05 ? '#22c55e' : rentRatio <= 1.3 ? '#f59e0b' : '#ef4444';
                    const rentMeterLabel = rentRatio <= 1.05 ? 'Competitive' : rentRatio <= 1.3 ? 'Above Average' : 'Premium';
                    const rentLabelColor = rentRatio <= 1.05 ? 'text-green-600 bg-green-50 border-green-200' : rentRatio <= 1.3 ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-red-600 bg-red-50 border-red-200';

                    return (
                    <div className="space-y-7">
                      <div>
                        <h3 className="text-slate-900 font-black text-base mb-1">The Total Package</h3>
                        <p className="text-slate-400 text-xs font-medium">Break down all costs for full transparency.</p>
                      </div>

                      <div>
                        <label className="text-slate-700 text-xs font-bold block mb-2">Annual Rent</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900 font-black text-xl">₦</span>
                          <input type="text" value={annualRent} onChange={e => setAnnualRent(e.target.value)} placeholder="3,500,000" className="w-full pl-10 pr-4 h-14 border-2 border-slate-200 rounded-2xl text-xl text-slate-900 font-black placeholder:text-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
                        </div>
                      </div>

                      {/* Rent Market Meter */}
                      {rentNum > 0 && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <BarChart3 className="w-4 h-4 text-slate-500" />
                              <span className="text-slate-700 text-xs font-black">Market Meter</span>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${rentLabelColor}`}>{rentMeterLabel}</span>
                          </div>
                          <div className="relative h-3 rounded-full overflow-hidden" style={{ background: 'linear-gradient(to right, #22c55e 0%, #22c55e 40%, #f59e0b 60%, #ef4444 85%, #dc2626 100%)' }}>
                            <motion.div
                              initial={{ left: '0%' }}
                              animate={{ left: `${Math.min(rentMeterPercent, 97)}%` }}
                              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white rounded-full shadow-lg border-2"
                              style={{ borderColor: rentMeterColor }}
                            />
                          </div>
                          <p className={`text-xs font-medium ${rentRatio <= 1.05 ? 'text-green-700' : rentRatio <= 1.3 ? 'text-amber-700' : 'text-red-700'}`}>
                            Average annual rent in {areaData?.area || 'this area'}: <span className="font-black">₦{avgRent.toLocaleString('en-NG')}</span>
                          </p>
                        </motion.div>
                      )}

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-slate-700 text-xs font-bold block mb-2">Service Charge (₦)</label>
                          <input type="text" value={serviceCharge} onChange={e => setServiceCharge(e.target.value)} placeholder="500,000" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
                        </div>
                        <div>
                          <label className="text-slate-700 text-xs font-bold block mb-2">Caution Deposit (₦)</label>
                          <input type="text" value={cautionFee} onChange={e => setCautionFee(e.target.value)} placeholder="500,000" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
                        </div>
                        <div>
                          <label className="text-slate-700 text-xs font-bold block mb-2">Agency Fee</label>
                          <div className="flex items-stretch gap-0 border border-slate-200 rounded-xl overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                            {/* Toggle button */}
                            <button
                              onClick={() => {
                                if (agencyFeeMode === 'percent') {
                                  // Switch to naira — auto-calculate from percent
                                  const rentNum = parseFloat(annualRent.replace(/,/g, '') || '0');
                                  const pct = parseFloat(agencyFeePercent || '0');
                                  const calc = Math.round(rentNum * pct / 100);
                                  setAgencyFeeMode('naira');
                                  setAgencyFee(calc > 0 ? calc.toLocaleString('en-NG') : '');
                                } else {
                                  setAgencyFeeMode('percent');
                                  setAgencyFeePercent('10');
                                }
                              }}
                              className="px-3 bg-slate-50 border-r border-slate-200 text-xs font-black text-slate-600 hover:bg-slate-100 transition-colors shrink-0 flex items-center gap-1"
                            >
                              {agencyFeeMode === 'percent' ? '%' : '₦'}
                              <ChevronDown className="w-3 h-3 text-slate-400" />
                            </button>
                            {agencyFeeMode === 'percent' ? (
                              <input
                                type="text"
                                value={agencyFeePercent}
                                onChange={e => {
                                  setAgencyFeePercent(e.target.value);
                                  // Auto-calc naira value for total package
                                  const rentNum = parseFloat(annualRent.replace(/,/g, '') || '0');
                                  const pct = parseFloat(e.target.value || '0');
                                  const calc = Math.round(rentNum * pct / 100);
                                  setAgencyFee(calc > 0 ? calc.toString() : '');
                                }}
                                placeholder="10"
                                className="flex-1 px-3 py-3 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none"
                              />
                            ) : (
                              <input
                                type="text"
                                value={agencyFee}
                                onChange={e => setAgencyFee(e.target.value)}
                                placeholder="350,000"
                                className="flex-1 px-3 py-3 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none"
                              />
                            )}
                          </div>
                          {/* Auto-calculated display */}
                          {agencyFeeMode === 'percent' && (() => {
                            const rentNum = parseFloat(annualRent.replace(/,/g, '') || '0');
                            const pct = parseFloat(agencyFeePercent || '0');
                            const calc = Math.round(rentNum * pct / 100);
                            return calc > 0 ? (
                              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1.5 text-[11px] font-medium text-slate-400">
                                = <span className="text-slate-700 font-bold">₦{calc.toLocaleString('en-NG')}</span> ({agencyFeePercent}% of ₦{rentNum.toLocaleString('en-NG')})
                              </motion.p>
                            ) : null;
                          })()}
                        </div>
                      </div>

                      {totalPackage > 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-primary/5 border border-primary/10 rounded-xl">
                          <div className="flex items-center justify-between">
                            <span className="text-primary text-xs font-bold">Total Move-in Package</span>
                            <span className="text-primary font-black text-lg">₦{totalPackage.toLocaleString('en-NG')}</span>
                          </div>
                        </motion.div>
                      )}

                      <div>
                        <label className="text-slate-700 text-xs font-bold block mb-2">Rent Frequency</label>
                        <div className="flex gap-2">
                          {['Yearly', 'Bi-Annual', 'Quarterly', 'Monthly'].map(f => (
                            <button
                              key={f}
                              onClick={() => setRentFrequency(f)}
                              className={`px-4 py-2 rounded-full text-xs font-bold border-2 transition-all ${
                                rentFrequency === f ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                              }`}
                            >
                              {f}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                    );
                  })()}

                  {/* SHORTLET */}
                  {listingType === 'shortlet' && (() => {
                    const areaData = getAreaData(address);
                    const nightlyNum = parseFloat(nightlyRate.replace(/,/g, '') || '0');
                    const avgNightly = areaData?.avgNightly || 75000;
                    const nightlyRatio = nightlyNum > 0 ? nightlyNum / avgNightly : 0;

                    return (
                    <div className="space-y-7">
                      <div>
                        <h3 className="text-slate-900 font-black text-base mb-1">Hospitality & Amenities</h3>
                        <p className="text-slate-400 text-xs font-medium">What makes your stay special?</p>
                      </div>

                      <div>
                        <label className="text-slate-700 text-xs font-bold block mb-2">Nightly Rate</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900 font-black text-xl">₦</span>
                          <input type="text" value={nightlyRate} onChange={e => setNightlyRate(e.target.value)} placeholder="85,000" className="w-full pl-10 pr-4 py-5 border-2 border-slate-200 rounded-2xl text-xl text-slate-900 font-black placeholder:text-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
                        </div>
                        {nightlyNum > 0 && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mt-2 text-xs font-medium ${nightlyRatio <= 1.05 ? 'text-green-600' : nightlyRatio <= 1.3 ? 'text-amber-600' : 'text-red-600'}`}>
                            Area average: <span className="font-black">₦{avgNightly.toLocaleString('en-NG')}/night</span> — Your rate is {nightlyRatio <= 1.05 ? 'competitive' : nightlyRatio <= 1.3 ? 'above average' : 'premium'}.
                          </motion.p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-slate-700 text-xs font-bold block mb-2">Minimum Stay (nights)</label>
                          <div className="flex items-center gap-3">
                            <button onClick={() => setMinStay(Math.max(1, minStay - 1))} className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-primary hover:text-primary transition-colors">
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-slate-900 font-black text-lg w-8 text-center">{minStay}</span>
                            <button onClick={() => setMinStay(minStay + 1)} className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-primary hover:text-primary transition-colors">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="text-slate-700 text-xs font-bold block mb-2">Maximum Stay (nights)</label>
                          <div className="flex items-center gap-3">
                            <button onClick={() => setMaxStay(Math.max(minStay, maxStay - 1))} className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-primary hover:text-primary transition-colors">
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-slate-900 font-black text-lg w-8 text-center">{maxStay}</span>
                            <button onClick={() => setMaxStay(maxStay + 1)} className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-primary hover:text-primary transition-colors">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-700 text-xs font-bold block mb-3">Amenities <span className="text-slate-400 font-medium">({selectedAmenities.length} selected)</span></label>
                        <div className="grid grid-cols-4 gap-2">
                          {AMENITIES.map(a => (
                            <button
                              key={a.id}
                              onClick={() => toggleAmenity(a.id)}
                              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                                selectedAmenities.includes(a.id)
                                  ? 'border-primary bg-primary/5 text-primary'
                                  : 'border-slate-100 text-slate-400 hover:border-slate-200'
                              }`}
                            >
                              <a.icon className="w-4 h-4" />
                              <span className="text-[9px] font-bold text-center leading-tight">{a.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-700 text-xs font-bold block mb-3">House Rules</label>
                        <div className="flex flex-wrap gap-2">
                          {HOUSE_RULES.map(rule => (
                            <button
                              key={rule}
                              onClick={() => toggleRule(rule)}
                              className={`px-3 py-1.5 rounded-full text-[10px] font-bold border-2 transition-all ${
                                selectedRules.includes(rule)
                                  ? 'border-primary bg-primary/5 text-primary'
                                  : 'border-slate-200 text-slate-500 hover:border-slate-300'
                              }`}
                            >
                              {rule}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    );
                  })()}
                </motion.div>
              )}

              {/* Step 4: Media */}
              {step === 4 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                  <h3 className="text-slate-900 font-black text-base mb-1">Visual Proof</h3>
                  <p className="text-slate-400 text-xs font-medium mb-5">Let's show it off! Upload 3–20 high-quality images.</p>

                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {PHOTO_SLOTS.map((slot, i) => (
                      <motion.button
                        key={slot.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="relative aspect-square border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all group"
                      >
                        {i === 0 && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-white text-[9px] font-black rounded-full">
                            COVER
                          </div>
                        )}
                        <Camera className="w-6 h-6 text-slate-300 group-hover:text-primary transition-colors" />
                        <span className="text-slate-500 text-[10px] font-bold">{slot.label}</span>
                        <span className="text-slate-300 text-[8px] font-medium">{slot.hint}</span>
                      </motion.button>
                    ))}
                  </div>

                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer mb-5">
                    <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-600 text-xs font-bold">Drag & drop photos here or click to browse</p>
                    <p className="text-slate-300 text-[10px] font-medium mt-1">PNG, JPG up to 10MB each • Max 20 photos</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="text-left">
                        <p className="text-slate-800 text-xs font-bold">360° Tour</p>
                        <p className="text-slate-400 text-[10px] font-medium">Upload panoramic images</p>
                      </div>
                    </button>
                    <button className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all">
                      <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                        <Video className="w-5 h-5 text-purple-500" />
                      </div>
                      <div className="text-left">
                        <p className="text-slate-800 text-xs font-bold">Video Walkthrough</p>
                        <p className="text-slate-400 text-[10px] font-medium">Max 2 minutes, MP4</p>
                      </div>
                    </button>
                  </div>

                  {/* Agent Live Verify */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-5 p-4 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <Video className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-800 text-xs font-bold">Verify with Agent Live</p>
                        <p className="text-slate-400 text-[10px] font-medium">Record a 5-second on-site video to boost your Trust Rank</p>
                      </div>
                      <button className="px-4 py-2 bg-primary text-white text-[10px] font-black rounded-full hover:bg-primary/90 transition-colors">
                        Record
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Step 5: Authorization & Trust — 3-tier verification */}
              {step === 5 && (() => {
                const handleAcctChange = (val: string) => {
                  const digits = val.replace(/\D/g, '').slice(0, 10);
                  setAccountNumber(digits);
                  if (digits.length === 10 && bankName) {
                    setLookupState('loading');
                    setResolvedAccountName('');
                    setTimeout(() => {
                      // Mock NIP: name match depends on whether last digit is even
                      const matched = parseInt(digits[9], 10) % 2 === 0;
                      const names = ['ADEWALE OGUNDIMU CHIEF', 'CHINEDU OKAFOR', 'FATIMA BELLO HASSAN'];
                      const name = names[parseInt(digits[0], 10) % names.length];
                      setResolvedAccountName(name);
                      setLookupState(matched ? 'matched' : 'mismatch');
                    }, 1200);
                  } else {
                    setLookupState('idle');
                    setResolvedAccountName('');
                  }
                };

                const filteredBanks = NIGERIAN_BANKS.filter(b =>
                  b.toLowerCase().includes(bankSearch.toLowerCase())
                );

                const paths = [
                  {
                    id: 'land-use' as const, label: 'Land Use Charge', icon: Award,
                    badge: 'Highest Trust', tagline: 'Optimal for premium listings. Upload official government land receipts.',
                    border: 'border-slate-200', bg: 'from-amber-50/40 to-white', iconBg: 'bg-amber-100', iconColor: 'text-amber-600',
                  },
                  {
                    id: 'utility' as const, label: 'Utility (NEPA) Meter', icon: Receipt,
                    badge: null, tagline: 'Enter the utility meter number. It must be registered in the landlord’s name.',
                    border: 'border-slate-200', bg: 'from-white to-slate-50', iconBg: 'bg-blue-50', iconColor: 'text-blue-600',
                  },
                  {
                    id: 'legal' as const, label: 'Legal Mandate', icon: Scale,
                    badge: null, tagline: 'For managed properties. Upload a Letter of Authority from a Solicitor or Law Firm.',
                    border: 'border-slate-200', bg: 'from-white to-slate-50', iconBg: 'bg-purple-50', iconColor: 'text-purple-600',
                  },
                ];

                return (
                <motion.div key="step5" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                  <h3 className="text-slate-900 font-black text-base mb-1">Authorization & Trust</h3>
                  <p className="text-slate-400 text-xs font-medium mb-6">Bind a verified document to the Landlord's payout account.</p>

                  {/* PART 1: Selection Hub — 3 tiered cards */}
                  {!authPath && (
                    <div className="space-y-3 mb-6">
                      {paths.map(p => (
                        <motion.button
                          key={p.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => setAuthPath(p.id)}
                          className={`w-full relative p-5 rounded-2xl border ${p.border} bg-gradient-to-br ${p.bg} text-left transition-all hover:border-slate-300 hover:shadow-md`}
                        >
                          {p.badge && (
                            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> {p.badge}
                            </div>
                          )}
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl ${p.iconBg} flex items-center justify-center shrink-0`}>
                              <p.icon className={`w-6 h-6 ${p.iconColor}`} />
                            </div>
                            <div className="flex-1 pr-16">
                              <p className="text-slate-900 font-black text-sm mb-1">{p.label}</p>
                              <p className="text-slate-500 text-[11px] font-medium leading-relaxed">{p.tagline}</p>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* Selected path flow */}
                  {authPath && (
                    <div className="space-y-5 mb-6">
                      {/* Path header with switch link */}
                      <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/10 rounded-xl">
                        <div className="flex items-center gap-2">
                          <CircleCheck className="w-4 h-4 text-primary" />
                          <span className="text-primary text-xs font-black">
                            {paths.find(p => p.id === authPath)?.label}
                          </span>
                        </div>
                        <button onClick={() => { setAuthPath(null); setLookupState('idle'); setResolvedAccountName(''); }} className="text-slate-500 text-[10px] font-bold hover:text-primary">
                          Change path
                        </button>
                      </div>

                      {/* STEP A: Evidence */}
                      <div className="space-y-3">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Step 1 · Evidence</p>

                        {authPath === 'land-use' && (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              {[{ label: 'Front', state: docFront, set: setDocFront }, { label: 'Back', state: docBack, set: setDocBack }].map(s => (
                                <button key={s.label} onClick={() => s.set(!s.state)} className={`p-4 border-2 border-dashed rounded-xl text-center transition-all ${s.state ? 'border-green-400 bg-green-50' : 'border-slate-200 hover:border-primary'}`}>
                                  {s.state ? <CircleCheck className="w-6 h-6 text-green-500 mx-auto mb-1" /> : <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />}
                                  <p className="text-[11px] font-bold text-slate-700">{s.label} of receipt</p>
                                </button>
                              ))}
                            </div>
                            <input type="text" value={receiptNumber} onChange={e => setReceiptNumber(e.target.value)} placeholder="Receipt / Document Number" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
                          </div>
                        )}

                        {authPath === 'utility' && (
                          <div className="space-y-3">
                            <div>
                              <label className="text-slate-600 text-[11px] font-bold block mb-1.5">Utility Meter Number</label>
                              <input type="text" value={utilityMeterNumber} onChange={e => setUtilityMeterNumber(e.target.value)} placeholder="Enter meter number" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
                              <p className="text-slate-400 text-[10px] font-medium mt-1.5 flex items-start gap-1">
                                <Info className="w-3 h-3 mt-0.5 shrink-0" />
                                <span>Ensure the meter number is registered in the landlord's name.</span>
                              </p>
                            </div>
                          </div>
                        )}

                        {authPath === 'legal' && (
                          <div className="space-y-3">
                            <button onClick={() => setMandateFile(!mandateFile)} className={`w-full p-5 border-2 border-dashed rounded-xl text-center transition-all ${mandateFile ? 'border-green-400 bg-green-50' : 'border-slate-200 hover:border-primary'}`}>
                              {mandateFile ? <CircleCheck className="w-8 h-8 text-green-500 mx-auto mb-1" /> : <Upload className="w-8 h-8 text-slate-400 mx-auto mb-1" />}
                              <p className="text-xs font-bold text-slate-700">{mandateFile ? 'Mandate uploaded' : 'Upload Letter of Authority'}</p>
                            </button>
                            <input type="text" value={nbaSeal} onChange={e => setNbaSeal(e.target.value)} placeholder="Solicitor's NBA Seal Number" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
                            <input type="text" value={lawFirmName} onChange={e => setLawFirmName(e.target.value)} placeholder="Law Firm Name" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
                          </div>
                        )}
                      </div>

                      {/* STEP B: Liability Affirmation */}
                      <div className="space-y-3 pt-4 border-t border-slate-100">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Step 2 · Affirmation & Liability</p>

                        {[
                          { state: affirmSighted, set: setAffirmSighted, text: 'I have sighted the original documents for this property.' },
                          { state: affirmAuthentic, set: setAffirmAuthentic, text: 'I affirm that the account details provided belong to the authentic Landlord.' },
                          { state: affirmLiability, set: setAffirmLiability, text: `I, ${userName || 'Agent'}, accept full legal liability for any discrepancies or fraudulent claims regarding this listing.` },
                        ].map((c, i) => (
                          <label key={i} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${c.state ? 'bg-primary/5 border-primary/30' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                            <input type="checkbox" checked={c.state} onChange={e => c.set(e.target.checked)} className="mt-0.5 w-4 h-4 accent-primary" />
                            <span className="text-slate-700 text-[11px] font-medium leading-relaxed">{c.text}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
                );
              })()}

              {/* Step 6: Payouts */}
              {step === 6 && (() => {
                const handleLandlordAcctChange = (val: string) => {
                  const digits = val.replace(/\D/g, '').slice(0, 10);
                  setAccountNumber(digits);
                  if (digits.length === 10 && bankName) {
                    setLookupState('loading');
                    setResolvedAccountName('');
                    setTimeout(() => {
                      const matched = parseInt(digits[9], 10) % 2 === 0;
                      const names = ['ADEWALE OGUNDIMU CHIEF', 'CHINEDU OKAFOR', 'FATIMA BELLO HASSAN'];
                      const name = names[parseInt(digits[0], 10) % names.length];
                      setResolvedAccountName(name);
                      setLookupState(matched ? 'matched' : 'mismatch');
                    }, 1200);
                  } else {
                    setLookupState('idle');
                    setResolvedAccountName('');
                  }
                };
                const filteredLandlordBanks = NIGERIAN_BANKS.filter(b =>
                  b.toLowerCase().includes(bankSearch.toLowerCase())
                );
                const filteredSelfBanks = NIGERIAN_BANKS.filter(b =>
                  b.toLowerCase().includes(selfBankSearch.toLowerCase())
                );
                return (
                <motion.div key="step6-payouts" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                  <h3 className="text-slate-900 font-black text-base mb-1">Payout Details</h3>
                  <p className="text-slate-400 text-xs font-medium mb-5">Where the money goes when this listing closes.</p>

                  {/* SECTION 1: Your payout (saved as default) */}
                  {hasSavedPayoutProfile ? (
                    <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-800 text-sm font-black">Your payout account is set</p>
                        <p className="text-slate-400 text-[11px] font-medium">Your earnings from this listing route to your saved default account.</p>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    </div>
                  ) : (
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-1">
                        <UserPlus className="w-3.5 h-3.5 text-primary" />
                        <p className="text-slate-900 text-xs font-black uppercase tracking-wider">Your payout details</p>
                      </div>
                      <p className="text-slate-400 text-[11px] font-medium mb-3 flex items-start gap-1.5">
                        <Info className="w-3 h-3 mt-0.5 shrink-0" />
                        <span>
                          Account name must match your profile name
                          <span className="text-slate-600 font-bold"> ({userName || 'Your profile name'})</span>.
                          Saved as your default for future listings.
                        </span>
                      </p>

                      <div className="space-y-3">
                        {/* Self bank picker */}
                        <div className="relative">
                          <button onClick={() => setShowSelfBankDropdown(!showSelfBankDropdown)} className="w-full flex items-center justify-between px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white hover:border-primary transition-all">
                            <span className={selfBankName ? 'text-slate-800 font-bold' : 'text-slate-400'}>{selfBankName || 'Select your bank'}</span>
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          </button>
                          {showSelfBankDropdown && (
                            <div className="absolute top-full mt-1 left-0 right-0 z-10 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-hidden flex flex-col">
                              <input autoFocus type="text" value={selfBankSearch} onChange={e => setSelfBankSearch(e.target.value)} placeholder="Search bank..." className="px-4 py-2.5 text-sm border-b border-slate-100 focus:outline-none" />
                              <div className="overflow-y-auto">
                                {filteredSelfBanks.map(b => (
                                  <button key={b} onClick={() => { setSelfBankName(b); setShowSelfBankDropdown(false); setSelfBankSearch(''); }} className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-primary/5 hover:text-primary">
                                    {b}
                                  </button>
                                ))}
                                {filteredSelfBanks.length === 0 && <p className="px-4 py-3 text-xs text-slate-400">No banks found</p>}
                              </div>
                            </div>
                          )}
                        </div>

                        <input
                          type="text"
                          inputMode="numeric"
                          value={selfAccountNumber}
                          onChange={e => setSelfAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          placeholder="10-digit account number"
                          disabled={!selfBankName}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm tracking-wider focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-slate-50 disabled:text-slate-400"
                        />

                        <input
                          type="text"
                          value={selfAccountName}
                          onChange={e => setSelfAccountName(e.target.value)}
                          placeholder="Account name"
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                      </div>

                      <label className="flex items-center justify-between mt-3 p-3 bg-primary/5 border border-primary/10 rounded-xl cursor-pointer">
                        <span className="flex items-center gap-2 text-primary text-xs font-black">
                          <Save className="w-3.5 h-3.5" />
                          Save as my default payout
                        </span>
                        <input type="checkbox" checked={saveSelfPayoutDefault} onChange={e => setSaveSelfPayoutDefault(e.target.checked)} className="w-4 h-4 accent-primary" />
                      </label>
                    </div>
                  )}

                  {/* Divider */}
                  <div className="h-px bg-slate-100 my-5" />

                  {/* SECTION 2: Landlord payout for this property */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Home className="w-3.5 h-3.5 text-primary" />
                      <p className="text-slate-900 text-xs font-black uppercase tracking-wider">Landlord details for this property</p>
                    </div>
                    <p className="text-slate-400 text-[11px] font-medium mb-3 flex items-start gap-1.5">
                      <Info className="w-3 h-3 mt-0.5 shrink-0" />
                      <span>
                        Account name must match the landlord on the authorization document
                        {authPath === 'land-use' && ' (Land Use Charge receipt)'}
                        {authPath === 'utility' && ' (Utility bill)'}
                        {authPath === 'legal' && ' (Lawyer’s mandate / Law Firm)'}
                        .
                      </span>
                    </p>

                    <div className="space-y-3">
                      {/* Landlord bank picker */}
                      <div className="relative">
                        <button onClick={() => setShowBankDropdown(!showBankDropdown)} className="w-full flex items-center justify-between px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white hover:border-primary transition-all">
                          <span className={bankName ? 'text-slate-800 font-bold' : 'text-slate-400'}>{bankName || "Select landlord's bank"}</span>
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        </button>
                        {showBankDropdown && (
                          <div className="absolute top-full mt-1 left-0 right-0 z-10 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-hidden flex flex-col">
                            <input autoFocus type="text" value={bankSearch} onChange={e => setBankSearch(e.target.value)} placeholder="Search bank..." className="px-4 py-2.5 text-sm border-b border-slate-100 focus:outline-none" />
                            <div className="overflow-y-auto">
                              {filteredLandlordBanks.map(b => (
                                <button key={b} onClick={() => { setBankName(b); setShowBankDropdown(false); setBankSearch(''); if (accountNumber.length === 10) handleLandlordAcctChange(accountNumber); }} className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-primary/5 hover:text-primary">
                                  {b}
                                </button>
                              ))}
                              {filteredLandlordBanks.length === 0 && <p className="px-4 py-3 text-xs text-slate-400">No banks found</p>}
                            </div>
                          </div>
                        )}
                      </div>

                      <input
                        type="text"
                        inputMode="numeric"
                        value={accountNumber}
                        onChange={e => handleLandlordAcctChange(e.target.value)}
                        placeholder="Landlord's 10-digit account number"
                        disabled={!bankName}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm tracking-wider focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-slate-50 disabled:text-slate-400"
                      />

                      {/* Lookup result */}
                      <AnimatePresence mode="wait">
                        {lookupState === 'loading' && (
                          <motion.div key="loading" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                            <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                            <span className="text-slate-500 text-xs font-bold">Verifying account name with bank…</span>
                          </motion.div>
                        )}
                        {lookupState === 'matched' && (
                          <motion.div key="matched" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                            <div className="flex items-center gap-2 mb-1">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span className="text-emerald-700 text-[10px] font-black uppercase tracking-wider">Account Verified</span>
                            </div>
                            <p className="text-emerald-900 text-base font-black">{resolvedAccountName}</p>
                            <p className="text-emerald-600 text-[11px] font-medium mt-0.5">{bankName} • {accountNumber}</p>
                          </motion.div>
                        )}
                        {lookupState === 'mismatch' && (
                          <motion.div key="mismatch" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                              <div>
                                <p className="text-amber-800 text-xs font-black mb-1">Name Mismatch — Manual Review</p>
                                <p className="text-amber-700 text-[11px] font-medium">Account name <span className="font-black">{resolvedAccountName}</span> differs from the authorization document. This listing will require manual review before going live.</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
                );
              })()}

              {/* Step 7: Review */}
              {step === 7 && (
                <motion.div key="step7" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>

                  <h3 className="text-slate-900 font-black text-base mb-1">Review Your Listing</h3>
                  <p className="text-slate-400 text-xs font-medium mb-5">Double-check everything before submitting for review.</p>

                  <div className="space-y-4">
                    {/* Location & Type */}
                    <div className="p-4 bg-slate-50 rounded-2xl space-y-2.5">
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Location & Type</p>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-xs font-medium">Listing Type</span>
                        <span className="text-slate-800 text-xs font-bold capitalize">{listingType || '—'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-xs font-medium">Address</span>
                        <span className="text-slate-800 text-xs font-bold text-right max-w-[60%] truncate">{address || '—'}</span>
                      </div>
                      {propertyType && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 text-xs font-medium">Property Type</span>
                          <span className="text-slate-800 text-xs font-bold">{propertyType}</span>
                        </div>
                      )}
                      {showGatedEstate && gatedEstateName && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 text-xs font-medium">Estate</span>
                          <span className="text-slate-800 text-xs font-bold">{gatedEstateName}</span>
                        </div>
                      )}
                    </div>

                    {/* Property Specs */}
                    <div className="p-4 bg-slate-50 rounded-2xl space-y-2.5">
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Property Specs</p>
                      {propertyType !== 'Land' && (
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <Bath className="w-4 h-4 text-primary" />
                            <span className="text-slate-700 font-bold text-xs">{bedrooms} Beds</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Bath className="w-4 h-4 text-primary" />
                            <span className="text-slate-700 font-bold text-xs">{bathrooms} Baths</span>
                          </div>
                        </div>
                      )}
                      {landSize && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 text-xs font-medium">Land Size</span>
                          <span className="text-slate-800 text-xs font-bold">{landSize} sqm</span>
                        </div>
                      )}
                      {description && (
                        <div>
                          <span className="text-slate-500 text-xs font-medium block mb-1">Description</span>
                          <p className="text-slate-700 text-xs font-medium leading-relaxed line-clamp-3">{description}</p>
                        </div>
                      )}
                    </div>

                    {/* Amenities */}
                    {selectedAmenities.length > 0 && (
                      <div className="p-4 bg-slate-50 rounded-2xl">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider mb-2">Amenities</p>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedAmenities.map(id => {
                            const am = AMENITIES.find(a => a.id === id);
                            return am ? (
                              <span key={id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold">
                                <am.icon className="w-3 h-3" /> {am.label}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    {/* Pricing */}
                    <div className="p-4 bg-slate-50 rounded-2xl space-y-2.5">
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Pricing</p>
                      {listingType === 'sale' && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 text-xs font-medium">Asking Price</span>
                            <span className="text-slate-900 font-black text-sm">₦{price || '0'}</span>
                          </div>
                          {negotiable && (
                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Negotiable</span>
                          )}
                        </>
                      )}
                      {listingType === 'rent' && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 text-xs font-medium">Annual Rent</span>
                            <span className="text-slate-900 font-black text-sm">₦{annualRent || '0'}</span>
                          </div>
                          {serviceCharge && (
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500 text-xs font-medium">Service Charge</span>
                              <span className="text-slate-700 text-xs font-bold">₦{serviceCharge}</span>
                            </div>
                          )}
                          {cautionFee && (
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500 text-xs font-medium">Caution Fee</span>
                              <span className="text-slate-700 text-xs font-bold">₦{cautionFee}</span>
                            </div>
                          )}
                          {agencyFee && (
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500 text-xs font-medium">Agency Fee</span>
                              <span className="text-slate-700 text-xs font-bold">₦{agencyFee}</span>
                            </div>
                          )}
                        </>
                      )}
                      {listingType === 'shortlet' && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 text-xs font-medium">Nightly Rate</span>
                            <span className="text-slate-900 font-black text-sm">₦{nightlyRate || '0'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 text-xs font-medium">Stay Duration</span>
                            <span className="text-slate-700 text-xs font-bold">{minStay}–{maxStay} nights</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Rules & Restrictions */}
                    {(propertyRules.length > 0 || customRules.some(r => r.trim())) && (
                      <div className="p-4 bg-slate-50 rounded-2xl space-y-2.5">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Rules & Restrictions</p>
                        {(() => {
                          const RULE_LABELS: Record<string, string> = {
                            'no-pets': 'No Pets Allowed',
                            'no-parties': 'No Parties / Events',
                            'quiet-hours': 'Quiet Hours after 10 PM',
                            'no-smoking': 'No Smoking',
                            'max-occupancy': `Maximum Occupancy: ${maxOccupancy} People`,
                          };
                          return propertyRules.map(id => (
                            <span key={id} className="inline-block text-[10px] bg-red-50 text-red-600 px-2.5 py-1 rounded-full font-bold mr-1.5 mb-1">
                              {RULE_LABELS[id] || id}
                            </span>
                          ));
                        })()}
                        {customRules.filter(r => r.trim()).map((rule, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="text-slate-600 text-xs font-medium">{rule}</span>
                          </div>
                        ))}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <span className="text-slate-500 text-xs font-medium">Reference Required</span>
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${referenceRequired ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'}`}>
                            {referenceRequired ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Media */}
                    <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Photos Uploaded</p>
                      <span className="text-slate-700 text-xs font-bold">{uploadedPhotos.length} / {PHOTO_SLOTS.length}</span>
                    </div>

                    {/* Authorization */}
                    <div className="p-4 bg-slate-50 rounded-2xl space-y-2.5">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className={`w-5 h-5 ${authPath && lookupState === 'matched' ? 'text-green-500' : 'text-slate-300'}`} />
                        <div className="flex-1">
                          <span className="text-slate-700 text-xs font-bold block">Authorization</span>
                          <span className="text-slate-400 text-[10px] font-medium">
                            {authPath === 'land-use' ? 'Land Use Charge' :
                             authPath === 'utility' ? 'Utility (NEPA) Meter' :
                             authPath === 'legal' ? 'Legal Mandate' : 'Not completed'}
                            {resolvedAccountName && ` • Payout to ${resolvedAccountName}`}
                          </span>
                        </div>
                      </div>
                      {authPath === 'utility' && utilityMeterNumber && (
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <span className="text-slate-500 text-xs font-medium">Meter Number</span>
                          <span className="text-slate-800 text-xs font-bold">{utilityMeterNumber}</span>
                        </div>
                      )}
                    </div>

                    {/* Self-certification */}
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={verificationDoc}
                          onChange={e => setVerificationDoc(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded border-amber-300 accent-primary focus:ring-primary/20"
                        />
                        <span className="text-amber-800 text-xs font-medium leading-relaxed">
                          I confirm that all information provided is accurate and I have the right to list this property on Houzii.
                        </span>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {step > 1 && (
                <button
                  onClick={() => setStep((step - 1) as Step)}
                  className="flex items-center gap-1 text-slate-500 text-xs font-bold hover:text-slate-700 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              )}
              <button className="flex items-center gap-1.5 text-slate-400 text-xs font-bold hover:text-primary transition-colors">
                <Save className="w-3.5 h-3.5" /> Save Draft
              </button>
            </div>

            {step < 7 ? (
              <button
                onClick={() => canProceed() && setStep((step + 1) as Step)}
                disabled={!canProceed()}
                className={`px-6 py-2.5 rounded-full text-xs font-black flex items-center gap-1.5 transition-all ${
                  canProceed()
                    ? 'bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20'
                    : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                }`}
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-full text-xs font-black bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 flex items-center gap-1.5 transition-all"
              >
                <Send className="w-3.5 h-3.5" /> Submit for Review
              </button>
            )}
          </div>
        </motion.div>

        {/* Success Overlay */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-white rounded-3xl flex flex-col items-center justify-center text-center px-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
                className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6"
              >
                <CircleCheck className="w-10 h-10 text-green-600" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-slate-900 font-black text-xl mb-2"
              >
                Listing Submitted!
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-slate-400 text-sm font-medium max-w-xs mb-8 leading-relaxed"
              >
                Your listing has been submitted successfully and is now pending review. You'll be notified once it's approved.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="flex flex-col gap-3 w-full max-w-xs"
              >
                <button
                  onClick={handleClose}
                  className="w-full h-11 rounded-full bg-primary text-white text-sm font-black hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" /> Back to Dashboard
                </button>
                <button
                  onClick={() => {
                    setShowSuccess(false);
                    reset();
                  }}
                  className="w-full h-11 rounded-full border border-primary text-primary text-sm font-black hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add New Listing
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};