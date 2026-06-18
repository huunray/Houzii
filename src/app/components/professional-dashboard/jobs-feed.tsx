import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin, Clock, ShieldCheck, ArrowRight, ListFilter,
  Zap, Droplets, Paintbrush, X, ChevronRight, AlertCircle,
  Image as ImageIcon, Video, Stethoscope, ClipboardList,
  Wind, Search, Sparkles, FileText, TriangleAlert
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type RequestType = 'direct-bid' | 'inspection-first';
type JobCategory = 'all' | 'inspection' | 'direct-bid' | 'emergency';
type MediaType = 'image' | 'video' | null;

interface JobRequest {
  id: number;
  requestType: RequestType;
  serviceType: string;
  icon: React.ElementType;
  title: string;
  client: string;
  verified: boolean;
  location: string;
  category: 'inspection' | 'direct-bid' | 'emergency';
  isAsap: boolean;
  posted: string;
  startRequested: string;
  budget?: string;
  inspectionFee?: string;
  description: string;
  specs: string[];
  hasMedia: boolean;
  mediaCount: number;
  mediaType: MediaType;
}

// ─── Job Data ─────────────────────────────────────────────────────────────────
const serviceRequests: JobRequest[] = [
  {
    id: 1,
    requestType: 'inspection-first',
    serviceType: 'Electrical',
    icon: Zap,
    title: 'Electrical fault — strong burning smell from panel, 3-floor complex.',
    client: 'TechHub Lagos',
    verified: true,
    location: 'Victoria Island, Lagos',
    category: 'emergency',
    isAsap: true,
    posted: '38 min ago',
    startRequested: 'Today before 2:00 PM',
    inspectionFee: '₦10,000',
    description:
      "Strong burning smell from the electrical panel on 2nd floor. Breakers tripping intermittently. Main switch has been killed. Not sure if it's the wiring or the DB board — need expert eyes urgently.",
    specs: ['3-floor commercial complex', 'DB board suspected', 'Main switch OFF', 'Immediate access available'],
    hasMedia: true,
    mediaCount: 3,
    mediaType: 'image',
  },
  {
    id: 2,
    requestType: 'direct-bid',
    serviceType: 'Cleaning',
    icon: Sparkles,
    title: 'Professional deep cleaning — 2-bed flat, post-renovation.',
    client: 'Ms. Folake Adeyemi',
    verified: true,
    location: 'Victoria Island, Lagos',
    category: 'direct-bid',
    isAsap: false,
    posted: '3h ago',
    startRequested: 'Sat, 10 May 2026',
    budget: '₦65,000',
    description:
      'Deep clean of a 2-bedroom flat after renovation work. All surfaces, kitchen, 2 bathrooms. Equipment NOT provided by client. Please quote for full-day service.',
    specs: ['2 bedrooms + 2 bathrooms', 'Post-renovation dust', 'Kitchen degrease included', 'Equipment: Pro must supply'],
    hasMedia: false,
    mediaCount: 0,
    mediaType: null,
  },
  {
    id: 3,
    requestType: 'inspection-first',
    serviceType: 'Plumbing',
    icon: Droplets,
    title: 'Burst pipe behind master bathroom wall — water already off.',
    client: 'Mrs. Ogundimu',
    verified: true,
    location: 'Lekki Phase 1, Lagos',
    category: 'emergency',
    isAsap: true,
    posted: '2h ago',
    startRequested: 'Today before 12:00 PM',
    inspectionFee: '₦10,000',
    description:
      "Pipe has burst behind the master bathroom wall. Water shut off at mains. Structural damage possible if not seen today. 3rd floor, elevator building. Concrete + ceramic tile wall.",
    specs: ['Pipe behind concrete wall', 'Main water shut off', '3rd floor unit', 'Ceramic tile — access needed'],
    hasMedia: true,
    mediaCount: 2,
    mediaType: 'image',
  },
  {
    id: 4,
    requestType: 'direct-bid',
    serviceType: 'Property Inspection',
    icon: Search,
    title: 'Pre-purchase inspection — 4-bed duplex with pool, Banana Island.',
    client: 'Mr. Chukwuemeka Adeyemi',
    verified: true,
    location: 'Banana Island, Lagos',
    category: 'inspection',
    isAsap: false,
    posted: '5h ago',
    startRequested: 'Thu, 8 May 2026',
    budget: '₦150,000 – ₦250,000',
    description:
      "Full structural and mechanical inspection of a 4-bedroom duplex before purchase. Need a comprehensive report covering electrical, plumbing, roofing, and structural integrity. Pool included.",
    specs: ['4-bed duplex + pool', 'Full written report required', 'C of O already verified', 'Access booked with agent'],
    hasMedia: false,
    mediaCount: 0,
    mediaType: null,
  },
  {
    id: 5,
    requestType: 'direct-bid',
    serviceType: 'Painting',
    icon: Paintbrush,
    title: '3-bedroom flat interior repaint — new tenant in 2 weeks.',
    client: 'Chukwudi Properties Ltd.',
    verified: true,
    location: 'Victoria Island, Lagos',
    category: 'direct-bid',
    isAsap: false,
    posted: '1d ago',
    startRequested: 'Mon, 12 May 2026',
    budget: '₦120,000 – ₦180,000',
    description:
      "Full interior repaint of a 3-bedroom flat, tenant just vacated. 2 coats needed, surface prep included. Client is NOT providing paint — please price accordingly. Timeline is firm at 2 weeks.",
    specs: ['3 beds + living + 2 baths', 'Prep + prime + 2 coats', 'Pro supplies all materials', '2-week firm deadline'],
    hasMedia: true,
    mediaCount: 5,
    mediaType: 'image',
  },
  {
    id: 6,
    requestType: 'inspection-first',
    serviceType: 'AC / HVAC',
    icon: Wind,
    title: 'AC not cooling + grinding noise from compressor — 2 units.',
    client: 'Zenith Gardens Estate',
    verified: true,
    location: 'Ikeja GRA, Lagos',
    category: 'inspection',
    isAsap: false,
    posted: '4h ago',
    startRequested: 'Tomorrow, 10:00 AM',
    inspectionFee: '₦8,000',
    description:
      "Two split AC units have stopped cooling. One compressor is making a grinding noise. Unsure if it's refrigerant, compressor failure, or electrical. Need a diagnostic visit before any repair.",
    specs: ['2 split units', 'Grinding compressor noise', 'Both on 1st floor', 'Easy access'],
    hasMedia: true,
    mediaCount: 1,
    mediaType: 'video',
  },
];

// ─── Filter Config ─────────────────────────────────────────────────────────────
const FILTERS: { id: JobCategory; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'All Requests', icon: ListFilter },
  { id: 'inspection', label: 'Property Inspection', icon: Search },
  { id: 'direct-bid', label: 'Direct Bids', icon: FileText },
  { id: 'emergency', label: 'Emergency (ASAP)', icon: TriangleAlert },
];

// ─── Media Badge ──────────────────────────────────────────────────────────────
const MediaBadge: React.FC<{ count: number; type: MediaType }> = ({ count, type }) => {
  if (!count || !type) return null;
  const Icon = type === 'video' ? Video : ImageIcon;
  return (
    <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-full">
      <Icon className="w-3 h-3 text-slate-500" />
      <span className="text-slate-600 text-[10px] font-bold">
        {count} {type === 'video' ? 'video' : count === 1 ? 'photo' : 'photos'} uploaded
      </span>
    </div>
  );
};

// ─── ASAP Flash Ring ──────────────────────────────────────────────────────────
// Injected once globally
const AsapKeyframes = () => (
  <style>{`
    @keyframes asap-pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(123,45,66,0.25), 0 4px 24px rgba(123,45,66,0.12); }
      50%        { box-shadow: 0 0 0 6px rgba(123,45,66,0.0),  0 4px 24px rgba(123,45,66,0.22); }
    }
    .asap-card { animation: asap-pulse 1.8s ease-in-out infinite; }
  `}</style>
);

// ─── Direct Bid Card ──────────────────────────────────────────────────────────
const DirectBidCard: React.FC<{
  job: JobRequest;
  onSendQuote: (job: JobRequest) => void;
  delay: number;
}> = ({ job, onSendQuote, delay }) => {
  const Icon = job.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all group"
    >
      {/* Top stripe */}
      <div className="h-0.5 bg-gradient-to-r from-primary/60 to-primary/20" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-primary text-[10px] font-black uppercase tracking-wide">{job.serviceType}</span>
              <span className="px-2 py-0.5 bg-primary/8 border border-primary/15 text-[#7B2D42] text-[10px] font-bold rounded-full">
                ● Direct Bid
              </span>
            </div>
            <h3 className="text-slate-800 font-bold text-sm leading-snug">{job.title}</h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-400 text-xs font-medium mb-3 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Inventory / Specs */}
        <div className="grid grid-cols-2 gap-1.5 mb-4">
          {job.specs.slice(0, 4).map((spec, i) => (
            <div key={i} className="flex items-center gap-1.5 text-slate-500 text-[10px] font-medium">
              <div className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
              {spec}
            </div>
          ))}
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
            <MapPin className="w-3.5 h-3.5" />
            {job.location}
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
            <Clock className="w-3.5 h-3.5" />
            {job.posted}
          </div>
          {job.verified && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 border border-green-200 rounded-full">
              <ShieldCheck className="w-3 h-3 text-green-500" />
              <span className="text-green-600 text-[10px] font-bold">Verified</span>
            </div>
          )}
          <MediaBadge count={job.mediaCount} type={job.mediaType} />
        </div>

        {/* Start date */}
        <div className="flex items-center gap-1.5 mb-4 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
          <ClipboardList className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-500 text-xs font-medium">Start requested: </span>
          <span className="text-slate-700 text-xs font-bold">{job.startRequested}</span>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div>
            <span className="text-slate-300 text-[10px] font-bold uppercase tracking-wider block">Client Budget</span>
            <span className="text-slate-900 font-black text-base">{job.budget}</span>
          </div>
          <button
            onClick={() => onSendQuote(job)}
            className="px-5 py-2.5 bg-[#7B2D42] hover:bg-[#7B1C3E] text-white rounded-full font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-primary/15 active:scale-[0.97]"
          >
            Send Final Quote <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Inspection-First Card ────────────────────────────────────────────────────
const InspectionCard: React.FC<{
  job: JobRequest;
  onApply: (job: JobRequest) => void;
  delay: number;
}> = ({ job, onApply, delay }) => {
  const Icon = job.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`rounded-2xl overflow-hidden transition-all group ${
        job.isAsap
          ? 'border-2 border-[#7B2D42] bg-white asap-card'
          : 'border border-slate-200 bg-white hover:shadow-md'
      }`}
    >
      {/* ASAP banner */}
      {job.isAsap && (
        <div className="bg-[#7B2D42] px-5 py-2 flex items-center gap-2">
          <TriangleAlert className="w-3.5 h-3.5 text-white animate-pulse shrink-0" />
          <span className="text-white text-[10px] font-black uppercase tracking-widest">
            Emergency — Start requested {job.startRequested}
          </span>
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            job.isAsap ? 'bg-[#7B2D42]/8' : 'bg-blue-50'
          }`}>
            <Icon className={`w-5 h-5 ${job.isAsap ? 'text-[#7B2D42]' : 'text-blue-500'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-blue-600 text-[10px] font-black uppercase tracking-wide">{job.serviceType}</span>
            </div>
            <h3 className="text-slate-800 font-bold text-sm leading-snug">{job.title}</h3>
          </div>
        </div>

        {/* ● Diagnosis Recommended chip — prominent */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl">
            <Stethoscope className="w-4 h-4 text-blue-500 shrink-0" />
            <div>
              <p className="text-blue-700 font-black text-xs">● Diagnosis Recommended</p>
              <p className="text-blue-500 text-[10px] font-medium">
                Nature of fault is unclear — inspection required before quoting final repair cost.
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-400 text-xs font-medium mb-3 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-1.5 mb-4">
          {job.specs.slice(0, 4).map((spec, i) => (
            <div key={i} className="flex items-center gap-1.5 text-slate-500 text-[10px] font-medium">
              <div className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
              {spec}
            </div>
          ))}
        </div>

        {/* Media — highlighted for inspection jobs */}
        {job.hasMedia && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
            {job.mediaType === 'video' ? (
              <Video className="w-4 h-4 text-slate-500 shrink-0" />
            ) : (
              <ImageIcon className="w-4 h-4 text-slate-500 shrink-0" />
            )}
            <div>
              <p className="text-slate-700 text-xs font-bold">
                {job.mediaCount} {job.mediaType === 'video' ? 'video' : job.mediaCount === 1 ? 'photo' : 'photos'} uploaded by client
              </p>
              <p className="text-slate-400 text-[10px] font-medium">
                Visual evidence of the fault — visible after you apply
              </p>
            </div>
          </div>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
            <MapPin className="w-3.5 h-3.5" />
            {job.location}
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
            <Clock className="w-3.5 h-3.5" />
            {job.posted}
          </div>
          {job.verified && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 border border-green-200 rounded-full">
              <ShieldCheck className="w-3 h-3 text-green-500" />
              <span className="text-green-600 text-[10px] font-bold">Verified</span>
            </div>
          )}
        </div>

        {/* Bottom row — Inspection fee only, NO final budget */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div>
            <span className="text-slate-300 text-[10px] font-bold uppercase tracking-wider block">Inspection Fee</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-900 font-black text-base">{job.inspectionFee}</span>
              <span className="text-slate-400 text-[10px] font-medium">(fixed by Houzii)</span>
            </div>
            <span className="text-slate-400 text-[10px] font-medium">Full repair quote after visit</span>
          </div>
          <button
            onClick={() => onApply(job)}
            className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-blue-500/15 active:scale-[0.97]"
          >
            Apply for Visit <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Send Quote Modal ─────────────────────────────────────────────────────────
const QuoteModal: React.FC<{
  job: JobRequest;
  onClose: () => void;
  onSend: () => void;
}> = ({ job, onClose, onSend }) => {
  const Icon = job.icon;
  const isInspection = job.requestType === 'inspection-first';
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(isInspection ? job.inspectionFee?.replace('₦', '').replace(',', '') || '' : '');
  const [note, setNote] = useState('');

  const handleNext = () => {
    if (step === 1) setStep(2);
    else { onSend(); onClose(); }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`px-6 py-5 border-b border-slate-100 ${isInspection ? 'border-l-4 border-l-blue-400' : 'border-l-4 border-l-primary'}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isInspection ? 'bg-blue-50' : 'bg-primary/5'}`}>
                <Icon className={`w-5 h-5 ${isInspection ? 'text-blue-500' : 'text-primary'}`} />
              </div>
              <div>
                <p className="text-slate-800 font-black text-sm leading-tight line-clamp-1">{job.title}</p>
                <p className="text-slate-400 text-[11px] font-medium">{job.client} · {job.location}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
          {isInspection && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl">
              <Stethoscope className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <p className="text-blue-700 text-[10px] font-bold">
                Inspection visit — fixed fee only. Final repair quote submitted after diagnosis.
              </p>
            </div>
          )}
        </div>

        {/* Step indicator */}
        <div className="px-6 pt-4 pb-1">
          <div className="flex items-center gap-2">
            {[1, 2].map((s) => (
              <React.Fragment key={s}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${step >= s ? (isInspection ? 'bg-blue-500 text-white' : 'bg-primary text-white') : 'bg-slate-100 text-slate-400'}`}>
                  {s}
                </div>
                {s < 2 && <div className={`flex-1 h-0.5 transition-all ${step > s ? (isInspection ? 'bg-blue-400' : 'bg-primary') : 'bg-slate-100'}`} />}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{isInspection ? 'Confirm Fee' : 'Set Price'}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Confirm & Send</span>
          </div>
        </div>

        <div className="px-6 pb-6 pt-3">
          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <label className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-1.5">
                  {isInspection ? 'Inspection Fee (₦) — fixed by Houzii' : 'Your Final Quote (₦)'}
                </label>
                {isInspection && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl mb-2">
                    <Stethoscope className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <p className="text-blue-600 text-xs font-medium">Standard inspection rate auto-applied</p>
                  </div>
                )}
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₦</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => !isInspection && setAmount(e.target.value)}
                    readOnly={isInspection}
                    placeholder={isInspection ? '' : 'Enter your price'}
                    className={`w-full pl-8 pr-4 py-3 border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none focus:ring-2 ${isInspection ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : 'focus:ring-primary/20 focus:border-primary/40'}`}
                  />
                </div>
                {!isInspection && job.budget && (
                  <p className="text-slate-400 text-[10px] font-medium mt-1">Client budget: {job.budget}</p>
                )}
              </div>
              <div>
                <label className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-1.5">Note to Client (optional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  placeholder={isInspection ? 'e.g. I can arrive within 30 minutes...' : 'e.g. Price includes all materials...'}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-700 text-sm font-medium resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-3">Confirm Details</p>
                {[
                  { label: isInspection ? 'Inspection Fee' : 'Your Quote', value: `₦${Number(amount).toLocaleString()}` },
                  { label: 'Platform Fee (10%)', value: `-₦${(Number(amount) * 0.1).toLocaleString()}` },
                  { label: 'You Receive', value: `₦${(Number(amount) * 0.9).toLocaleString()}`, highlight: true },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-slate-400 text-xs font-medium">{row.label}</span>
                    <span className={`text-sm font-bold ${row.highlight ? 'text-green-600' : 'text-slate-800'}`}>{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-2 px-3 py-3 bg-green-50 border border-green-200 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <p className="text-green-700 text-xs font-medium">
                  Payment is guaranteed only after the client accepts and escrow is funded.
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleNext}
            disabled={!amount}
            className={`mt-5 w-full py-3.5 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-black text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
              isInspection
                ? 'bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/20'
                : 'bg-[#7B2D42] hover:bg-[#7B1C3E] shadow-lg shadow-primary/20'
            }`}
          >
            {step === 1 ? (
              <>{isInspection ? 'Review Visit Application' : 'Review Quote'} <ChevronRight className="w-4 h-4" /></>
            ) : (
              <>{isInspection ? 'Apply for Inspection Visit' : 'Send Final Quote'} <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Main: JobsFeed ───────────────────────────────────────────────────────────
interface JobsFeedProps {
  onViewJob?: () => void;
}

export const JobsFeed: React.FC<JobsFeedProps> = ({ onViewJob }) => {
  const [activeFilter, setActiveFilter] = useState<JobCategory>('all');
  const [modalJob, setModalJob] = useState<JobRequest | null>(null);
  const [sentIds, setSentIds] = useState<number[]>([]);

  const filtered = serviceRequests.filter((r) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'emergency') return r.isAsap;
    if (activeFilter === 'inspection') return r.category === 'inspection' || r.requestType === 'inspection-first';
    if (activeFilter === 'direct-bid') return r.requestType === 'direct-bid';
    return true;
  });

  const handleSent = () => {
    if (modalJob) setSentIds((ids) => [...ids, modalJob.id]);
  };

  const emergencyCount = serviceRequests.filter((r) => r.isAsap).length;

  return (
    <div className="pb-6">
      <AsapKeyframes />

      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6 border-b border-slate-100">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                <span className="text-green-600 text-[10px] font-black">Verified Professional</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/5 border border-primary/15 rounded-full">
                <span className="text-primary text-[10px] font-black">Tier 1</span>
              </div>
            </div>
            <h2 className="text-slate-900 font-black text-2xl">Dispatch Feed</h2>
            <p className="text-slate-400 font-medium text-sm">Intent-matched requests — respond before they're claimed</p>
          </div>
        </div>
      </div>

      {/* Safety Banner */}
      <div className="bg-[#7B2D42] px-6 py-3 flex items-center gap-3">
        <AlertCircle className="w-3.5 h-3.5 text-white/70 shrink-0" />
        <p className="text-white/80 text-[10px] font-medium">
          Never accept cash outside the app. Payment is only guaranteed when Escrow is funded.
        </p>
      </div>

      <div className="px-6 pt-6">
        {/* Categorical Filters */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          {FILTERS.map((f) => {
            const FIcon = f.icon;
            const isActive = activeFilter === f.id;
            const isEmergency = f.id === 'emergency';
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? isEmergency
                      ? 'bg-[#7B2D42] text-white shadow-sm shadow-primary/20'
                      : 'bg-primary text-white shadow-sm'
                    : isEmergency
                    ? 'bg-red-50 border border-red-200 text-red-600 hover:bg-red-100'
                    : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                <FIcon className="w-3.5 h-3.5" />
                {f.label}
                {isEmergency && emergencyCount > 0 && (
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black ${isActive ? 'bg-white/30 text-white' : 'bg-red-500 text-white'}`}>
                    {emergencyCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Result count */}
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">
          {filtered.length} request{filtered.length !== 1 ? 's' : ''} —{' '}
          {activeFilter === 'all' ? 'all categories' : FILTERS.find(f => f.id === activeFilter)?.label}
        </p>

        {/* Cards */}
        <div className="space-y-4">
          {filtered.map((job, i) => {
            const isSent = sentIds.includes(job.id);
            if (isSent) {
              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0.6 }}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-slate-700 font-bold text-sm line-clamp-1">{job.title}</p>
                    <p className="text-green-600 text-xs font-bold mt-0.5">
                      {job.requestType === 'inspection-first' ? 'Visit application sent ✓' : 'Quote sent ✓'} — awaiting client response
                    </p>
                  </div>
                </motion.div>
              );
            }

            return job.requestType === 'direct-bid' ? (
              <DirectBidCard
                key={job.id}
                job={job}
                onSendQuote={setModalJob}
                delay={i * 0.07}
              />
            ) : (
              <InspectionCard
                key={job.id}
                job={job}
                onApply={setModalJob}
                delay={i * 0.07}
              />
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <ListFilter className="w-6 h-6 text-slate-300" />
            </div>
            <p className="text-slate-400 font-bold text-sm">No requests in this category right now.</p>
            <p className="text-slate-300 text-xs font-medium mt-1">Check back soon — new jobs are dispatched in real time.</p>
          </div>
        )}
      </div>

      {/* Quote/Application Modal */}
      <AnimatePresence>
        {modalJob && (
          <QuoteModal
            job={modalJob}
            onClose={() => setModalJob(null)}
            onSend={handleSent}
          />
        )}
      </AnimatePresence>
    </div>
  );
};