import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, ShieldCheck, MapPin, Phone, ExternalLink,
  Clock, AlertCircle, Zap, Droplets, X, CheckCircle2,
  CalendarCheck, Navigation, ImageIcon,
  Wallet, Download, Camera, Check
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

// ─── Types ────────────────────────────────────────────────────────────────────
type LifecycleStage =
  | 'bid'          // 0 - Bid Analysis
  | 'unlock'       // 1 - Post-Approval Unlock
  | 'schedule'     // 2 - Scheduling
  | 'active'       // 3 - Active Activity Log
  | 'verify'       // 4 - Awaiting Verification
  | 'paid';        // 5 - Payment Success

interface RescheduleState {
  active: boolean;
  date: string;
  time: string;
}

// ─── Mock Job Data ─────────────────────────────────────────────────────────────
const JOB = {
  id: 'JOB-1042',
  type: 'Plumbing',
  icon: Droplets,
  title: 'Fix burst pipe in master bathroom',
  client: 'Mrs. Adunola Ogundimu',
  clientInitial: 'AO',
  phone: '+234 803 000 0000',
  address: '14B Admiralty Way, Lekki Phase 1, Lagos',
  budgetRange: '₦35,000 – ₦60,000',
  agreedAmount: '₦55,000',
  escrowAmount: '₦55,000',
  appointmentDate: 'Tue, 20 May 2026',
  appointmentTime: '10:00 AM',
  description:
    'Water pipe burst behind the wall in the master bathroom. Water is leaking into the bedroom floor. The pipe is behind the toilet wall. I\'ve turned off the main valve but water pressure has dropped in the entire flat. Need emergency repair ASAP before it gets worse.',
  specs: [
    'Pipe size: approx 15mm',
    'Wall material: concrete & ceramic tile',
    'Water already shut off at main',
    '3rd floor unit, building has elevator',
  ],
  images: [
    {
      src: 'https://images.unsplash.com/photo-1566447695072-9f6cc2c84fb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
      label: 'Burst pipe area',
    },
    {
      src: 'https://images.unsplash.com/photo-1676210134050-6f12c6898395?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
      label: 'Bathroom overview',
    },
    {
      src: 'https://images.unsplash.com/photo-1661332626430-2bdad0d84642?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
      label: 'Leak damage on wall',
    },
  ],
};

// ─── Status Chip ──────────────────────────────────────────────────────────────
const StatusChip: React.FC<{
  label: string;
  variant: 'escrow' | 'bidding' | 'awaiting' | 'active' | 'verified' | 'rescheduled';
}> = ({ label, variant }) => {
  const map = {
    escrow: 'bg-green-50 text-green-700 border-green-200',
    bidding: 'bg-orange-50 text-orange-600 border-orange-200',
    awaiting: 'bg-blue-50 text-blue-600 border-blue-200',
    active: 'bg-green-50 text-green-700 border-green-200',
    verified: 'bg-green-50 text-green-700 border-green-200',
    rescheduled: 'bg-amber-50 text-amber-600 border-amber-200',
  };
  const dot = {
    escrow: 'bg-green-500',
    bidding: 'bg-orange-400',
    awaiting: 'bg-blue-400',
    active: 'bg-green-500',
    verified: 'bg-green-500',
    rescheduled: 'bg-amber-400',
  };
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${map[variant]}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${dot[variant]} animate-pulse`} />
      {label}
    </div>
  );
};

// ─── Safety Footer ─────────────────────────────────────────────────────────────
const SafetyFooter: React.FC = () => (
  <div className="mt-8 bg-[#7B2D42]/5 border border-[#7B2D42]/15 rounded-xl p-4 flex items-start gap-3">
    <AlertCircle className="w-4 h-4 text-[#7B2D42] shrink-0 mt-0.5" />
    <p className="text-[#7B2D42]/75 text-xs font-medium leading-relaxed">
      Never accept cash outside the app. Your payment is only guaranteed when Escrow is funded.
    </p>
  </div>
);

// ─── Stage 0: Bid Analysis ─────────────────────────────────────────────────────
const BidAnalysisView: React.FC<{ onSendPrice: (amount: string, note: string) => void }> = ({ onSendPrice }) => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [defaultInspection, setDefaultInspection] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const Icon = JOB.icon;

  const handleInspectionDefault = () => {
    setDefaultInspection(true);
    setAmount('15000');
    setNote('This covers a diagnostic/inspection fee to assess the extent of the damage and provide a full repair quote before any work begins.');
  };

  return (
    <div className="space-y-6">
      {/* Request Summary */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-primary text-xs font-bold mb-0.5">{JOB.type} Request · {JOB.id}</p>
              <h3 className="text-slate-900 font-black text-base leading-tight">{JOB.title}</h3>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                  <MapPin className="w-3 h-3" />
                  {JOB.address}
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 border border-green-200 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-green-500" />
                  <span className="text-green-600 text-[10px] font-bold">Verified Client</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Problem Statement */}
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Problem Statement</p>
            <p className="text-slate-600 text-sm font-medium leading-relaxed">{JOB.description}</p>
          </div>

          {/* Inventory / Specs */}
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Inventory / Specs</p>
            <div className="space-y-1.5">
              {JOB.specs.map((spec, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                  {spec}
                </div>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Client Budget</p>
              <p className="text-slate-900 font-black text-base">{JOB.budgetRange}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Media Gallery */}
      <div>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-3">Media Uploaded by Client</p>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {JOB.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setLightboxIdx(i)}
              className="relative rounded-xl overflow-hidden shrink-0 w-40 h-28 group"
            >
              <ImageWithFallback
                src={img.src}
                alt={img.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors" />
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <p className="text-white text-[10px] font-bold">{img.label}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6"
            onClick={() => setLightboxIdx(null)}
          >
            <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
              <X className="w-5 h-5" />
            </button>
            <ImageWithFallback
              src={JOB.images[lightboxIdx].src}
              alt={JOB.images[lightboxIdx].label}
              className="max-w-full max-h-[80vh] rounded-2xl object-contain"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Your Bid */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-slate-900 font-black text-sm">Your Price</h3>
          <button
            onClick={handleInspectionDefault}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-200 text-orange-600 rounded-full text-xs font-bold hover:bg-orange-100 transition-colors"
          >
            <Zap className="w-3 h-3" />
            Quick Quote (Inspection Fee)
          </button>
        </div>

        <div>
          <label className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1.5">
            Diagnostic / Inspection Fee (₦)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₦</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 15000"
              className="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-xl text-slate-800 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
            />
          </div>
          {defaultInspection && (
            <p className="text-orange-500 text-[10px] font-bold mt-1">
              ⚡ Auto-filled: Standard Inspection Fee
            </p>
          )}
        </div>

        <div>
          <label className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1.5">
            Note to Client (Optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Briefly describe your approach or ask a clarifying question..."
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-700 text-sm font-medium resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
          />
        </div>

        <button
          onClick={() => onSendPrice(amount || '15000', note)}
          disabled={!amount && !defaultInspection}
          className="w-full py-4 bg-[#7B2D42] hover:bg-[#7B1C3E] disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-black text-sm transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
        >
          Send Price to Client →
        </button>

        <p className="text-slate-400 text-[10px] font-medium text-center">
          The client will review your price before funds are secured in escrow.
        </p>
      </div>

      <SafetyFooter />
    </div>
  );
};

// ─── Stage 1: Post-Approval Unlock ────────────────────────────────────────────
const PostApprovalView: React.FC<{ onProceed: () => void }> = ({ onProceed }) => {
  const Icon = JOB.icon;
  return (
    <div className="space-y-6">
      {/* Escrow Signal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 border-2 border-green-300 rounded-2xl p-6 text-center"
      >
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8 text-green-600" />
        </div>
        <StatusChip label="PAYMENT SECURED IN ESCROW" variant="escrow" />
        <p className="text-slate-900 font-black text-xl mt-3">
          Houzii is holding {JOB.escrowAmount}
        </p>
        <p className="text-green-700 text-sm font-medium mt-1">
          You are safe to start work. Funds are locked until job is verified.
        </p>
      </motion.div>

      {/* Unlocked Worksite Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <h3 className="text-slate-900 font-black text-sm">Worksite Details — Unlocked</h3>
          <span className="ml-auto px-2 py-0.5 bg-green-50 border border-green-200 text-green-600 text-[10px] font-bold rounded-full">NEW</span>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Address */}
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">Full Address</p>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(JOB.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary font-bold text-sm hover:underline"
            >
              <MapPin className="w-4 h-4" />
              {JOB.address}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Contact */}
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">Client Contact</p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {JOB.clientInitial}
              </div>
              <div>
                <p className="text-slate-800 font-bold text-sm">{JOB.client}</p>
                <p className="text-slate-400 text-xs font-medium">{JOB.phone}</p>
              </div>
              <a
                href={`tel:${JOB.phone}`}
                className="ml-auto flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 text-green-700 rounded-full text-xs font-bold hover:bg-green-100 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                Call Client
              </a>
            </div>
          </div>

          {/* Agreed Amount */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Agreed Price</p>
              <p className="text-slate-900 font-black text-xl">{JOB.agreedAmount}</p>
            </div>
            <StatusChip label="IN ESCROW" variant="escrow" />
          </div>
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        onClick={onProceed}
        className="w-full py-4 bg-[#7B2D42] hover:bg-[#7B1C3E] text-white rounded-xl font-black text-sm transition-all shadow-lg shadow-primary/20 active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <CalendarCheck className="w-5 h-5" />
        Confirm Appointment & Continue
      </motion.button>

      <SafetyFooter />
    </div>
  );
};

// ─── Stage 2: Scheduling ──────────────────────────────────────────────────────
const SchedulingView: React.FC<{ onProceed: () => void }> = ({ onProceed }) => {
  const [reschedule, setReschedule] = useState<RescheduleState>({ active: false, date: '', time: '' });
  const [rescheduled, setRescheduled] = useState(false);

  const handlePropose = () => {
    if (reschedule.date && reschedule.time) {
      setRescheduled(true);
      setReschedule((r) => ({ ...r, active: false }));
    }
  };

  return (
    <div className="space-y-6">
      <StatusChip
        label={rescheduled ? 'AWAITING SEEKER CONFIRMATION (RESCHEDULED)' : 'PAYMENT SECURED IN ESCROW'}
        variant={rescheduled ? 'rescheduled' : 'escrow'}
      />

      {/* Appointment Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <CalendarCheck className="w-5 h-5 text-primary" />
          <h3 className="text-slate-900 font-black text-sm">Confirmed Appointment</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-primary/5 rounded-xl p-4 text-center">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Date</p>
            <p className="text-slate-900 font-black text-sm">
              {rescheduled ? reschedule.date : JOB.appointmentDate}
            </p>
          </div>
          <div className="bg-primary/5 rounded-xl p-4 text-center">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Time</p>
            <p className="text-slate-900 font-black text-sm">
              {rescheduled ? reschedule.time : JOB.appointmentTime}
            </p>
          </div>
        </div>

        {rescheduled && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500 shrink-0" />
            <p className="text-amber-700 text-xs font-medium">
              Reschedule proposed — waiting for client to confirm.
            </p>
          </div>
        )}

        {!reschedule.active ? (
          <button
            onClick={() => setReschedule((r) => ({ ...r, active: true }))}
            className="w-full py-2.5 border border-slate-200 rounded-xl text-slate-600 text-sm font-bold hover:border-slate-300 hover:bg-slate-50 transition-all"
          >
            Reschedule Visit
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Propose New Time</p>
            <input
              type="date"
              value={reschedule.date}
              onChange={(e) => setReschedule((r) => ({ ...r, date: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <select
              value={reschedule.time}
              onChange={(e) => setReschedule((r) => ({ ...r, time: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select time slot</option>
              {['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => setReschedule({ active: false, date: '', time: '' })}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-500 text-sm font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handlePropose}
                className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-bold"
              >
                Propose Time
              </button>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onProceed}
        disabled={rescheduled}
        className="w-full py-4 bg-[#7B2D42] hover:bg-[#7B1C3E] disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-black text-sm transition-all shadow-lg shadow-primary/20 active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <Navigation className="w-5 h-5" />
        {rescheduled ? 'Waiting for Confirmation' : "I'm On My Way — Notify Client"}
      </button>

      <SafetyFooter />
    </div>
  );
};

// ─── Stage 3: Active Activity Log ─────────────────────────────────────────────
const ActivityLogView: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [photoUploaded, setPhotoUploaded] = useState(false);

  const milestones = [
    {
      key: 'acknowledge',
      label: 'Acknowledge & Start Journey',
      sub: 'Triggers a notification: "Pro is on the way"',
      required: true,
    },
    {
      key: 'arrived',
      label: 'Arrived at Location',
      sub: 'Mark when you are at the worksite',
      required: true,
    },
    {
      key: 'wip',
      label: 'Work in Progress',
      sub: 'Optional: Add a photo log to keep client updated',
      hasPhoto: true,
      required: true,
    },
    {
      key: 'complete',
      label: 'Work Complete',
      sub: 'This will trigger client verification before payout',
      required: true,
      isPrimary: true,
    },
  ];

  const toggle = (key: string) => {
    setChecked((c) => ({ ...c, [key]: !c[key] }));
  };

  const allDone = milestones.every((m) => checked[m.key]);

  return (
    <div className="space-y-6">
      <StatusChip label="PAID & ACTIVE — WORK IN PROGRESS" variant="active" />

      {/* Escrow reminder */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
        <div>
          <p className="text-green-800 font-bold text-sm">Payment Secured — Safe to Start</p>
          <p className="text-green-600 text-xs font-medium">
            Houzii is holding {JOB.escrowAmount}. Paid when client verifies completion.
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h3 className="text-slate-900 font-black text-sm mb-5">Work Activity Log</h3>
        <div className="space-y-0">
          {milestones.map((m, i) => {
            const isDone = !!checked[m.key];
            const isLast = i === milestones.length - 1;
            return (
              <div key={m.key} className="flex gap-4">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => toggle(m.key)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all shrink-0 ${
                      isDone
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'bg-white border-slate-300 text-slate-300 hover:border-primary'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                  </button>
                  {!isLast && (
                    <div className={`w-0.5 h-12 mt-1 ${isDone ? 'bg-green-400' : 'bg-slate-100'}`} />
                  )}
                </div>

                <div className={`pb-6 flex-1 ${isLast ? 'pb-0' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`font-bold text-sm ${isDone ? 'text-green-700' : 'text-slate-800'}`}>
                        {m.label}
                      </p>
                      <p className="text-slate-400 text-xs font-medium mt-0.5">{m.sub}</p>
                    </div>
                    {isDone && (
                      <span className="px-2 py-0.5 bg-green-50 border border-green-200 text-green-600 text-[10px] font-bold rounded-full shrink-0">
                        ✓ Done
                      </span>
                    )}
                  </div>

                  {/* Photo Upload option */}
                  {m.hasPhoto && isDone && !photoUploaded && (
                    <button
                      onClick={() => setPhotoUploaded(true)}
                      className="mt-3 flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-600 rounded-full text-xs font-bold hover:bg-blue-100 transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      Upload Progress Photo
                    </button>
                  )}
                  {m.hasPhoto && photoUploaded && (
                    <div className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full w-fit">
                      <ImageIcon className="w-3.5 h-3.5 text-green-500" />
                      <span className="text-green-600 text-xs font-bold">Photo shared with client</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Primary CTA */}
      <button
        onClick={onComplete}
        disabled={!allDone}
        className="w-full py-4 bg-[#7B2D42] hover:bg-[#7B1C3E] disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-black text-sm transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
      >
        {allDone
          ? 'Mark Work as Complete — Request Payout'
          : `Complete all ${milestones.filter(m => !checked[m.key]).length} remaining steps first`}
      </button>

      <SafetyFooter />
    </div>
  );
};

// ─── Stage 4: Awaiting Verification ───────────────────────────────────────────
const AwaitingVerificationView: React.FC<{ onVerified: () => void }> = ({ onVerified }) => {
  return (
    <div className="space-y-6">
      <StatusChip label="AWAITING SEEKER VERIFICATION" variant="awaiting" />

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-slate-900 font-black text-lg mb-2">Work Submitted!</h3>
        <p className="text-slate-500 text-sm font-medium leading-relaxed">
          The client has been notified to verify your work. Once they confirm, Houzii will release{' '}
          <span className="font-black text-slate-800">{JOB.agreedAmount}</span> to your wallet.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
        <h4 className="text-slate-900 font-bold text-sm">What happens next?</h4>
        {[
          { step: '1', label: 'Client reviews your work', sub: 'They have 24 hours to confirm or raise a dispute.' },
          { step: '2', label: 'Houzii Human Oracle review', sub: 'If approved, our team signs off on the release.' },
          { step: '3', label: 'Funds released to your wallet', sub: `${JOB.agreedAmount} minus 10% platform fee = ₦49,500.` },
        ].map((item) => (
          <div key={item.step} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-[10px] shrink-0">
              {item.step}
            </div>
            <div>
              <p className="text-slate-800 font-bold text-xs">{item.label}</p>
              <p className="text-slate-400 text-xs font-medium">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Simulate client verification for demo */}
      <button
        onClick={onVerified}
        className="w-full py-3 border-2 border-dashed border-primary/30 text-primary text-sm font-bold rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all"
      >
        [Demo] Simulate Client Verification →
      </button>

      <SafetyFooter />
    </div>
  );
};

// ─── Stage 5: Payment Success ──────────────────────────────────────────────────
const PaymentSuccessView: React.FC<{ onViewWallet: () => void }> = ({ onViewWallet }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Success Banner */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-2xl p-8 text-center relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-green-200 rounded-full opacity-50" />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-200 rounded-full opacity-40" />
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle2 className="w-10 h-10 text-white" />
          </motion.div>
          <h3 className="text-green-900 font-black text-2xl mb-1">Job Paid & Closed!</h3>
          <p className="text-green-700 text-sm font-medium mb-4">
            {JOB.title}
          </p>
          <div className="bg-white rounded-2xl px-6 py-4 inline-block shadow-sm">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Added to Wallet</p>
            <p className="text-slate-900 font-black text-3xl tracking-tight mt-0.5">₦49,500</p>
            <p className="text-slate-400 text-[10px] font-medium mt-0.5">Net after 10% platform fee</p>
          </div>
        </div>
      </div>

      {/* Job Summary */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
        <h4 className="text-slate-900 font-bold text-sm">Job Summary</h4>
        {[
          { label: 'Client', value: JOB.client },
          { label: 'Service', value: JOB.title },
          { label: 'Agreed Price', value: JOB.agreedAmount },
          { label: 'Platform Fee (10%)', value: '₦5,500' },
          { label: 'Net Payout', value: '₦49,500', highlight: true },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium">{row.label}</span>
            <span className={`text-sm font-bold ${row.highlight ? 'text-green-600' : 'text-slate-800'}`}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={onViewWallet}
          className="w-full py-4 bg-[#7B2D42] hover:bg-[#7B1C3E] text-white rounded-xl font-black text-sm transition-all shadow-lg shadow-primary/20 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Wallet className="w-5 h-5" />
          View Wallet
        </button>
        <button className="w-full py-3 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
          <Download className="w-4 h-4" />
          Download Receipt
        </button>
      </div>
    </motion.div>
  );
};

// ─── Main: JobLifecycle ────────────────────────────────────────────────────────
interface JobLifecycleProps {
  onBack: () => void;
  onGoToWallet: () => void;
}

const STAGE_LABELS: Record<LifecycleStage, string> = {
  bid: 'Send Price',
  unlock: 'Job Details Unlocked',
  schedule: 'Appointment',
  active: 'Active Work Log',
  verify: 'Awaiting Verification',
  paid: 'Job Complete',
};

const STAGE_ORDER: LifecycleStage[] = ['bid', 'unlock', 'schedule', 'active', 'verify', 'paid'];

export const JobLifecycle: React.FC<JobLifecycleProps> = ({ onBack, onGoToWallet }) => {
  const [stage, setStage] = useState<LifecycleStage>('bid');
  const Icon = JOB.icon;

  const stageIndex = STAGE_ORDER.indexOf(stage);

  const advance = (next: LifecycleStage) => setStage(next);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-primary shrink-0" />
              <p className="text-slate-900 font-black text-sm truncate">{JOB.title}</p>
            </div>
            <p className="text-slate-400 text-[11px] font-medium">{JOB.id} · {JOB.client}</p>
          </div>
          <div className="shrink-0">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              Step {stageIndex + 1}/{STAGE_ORDER.length}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={false}
            animate={{ width: `${((stageIndex + 1) / STAGE_ORDER.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Stage Label */}
        <p className="text-primary text-xs font-bold mt-1.5">{STAGE_LABELS[stage]}</p>
      </div>

      {/* Safety Banner — persistent */}
      {stage !== 'paid' && (
        <div className="bg-[#7B2D42] px-6 py-2.5 flex items-center gap-3">
          <AlertCircle className="w-3.5 h-3.5 text-white/70 shrink-0" />
          <p className="text-white/80 text-[10px] font-medium">
            Never accept cash outside the app. Payment is only guaranteed when Escrow is funded.
          </p>
        </div>
      )}

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {stage === 'bid' && (
              <BidAnalysisView onSendPrice={() => advance('unlock')} />
            )}
            {stage === 'unlock' && (
              <PostApprovalView onProceed={() => advance('schedule')} />
            )}
            {stage === 'schedule' && (
              <SchedulingView onProceed={() => advance('active')} />
            )}
            {stage === 'active' && (
              <ActivityLogView onComplete={() => advance('verify')} />
            )}
            {stage === 'verify' && (
              <AwaitingVerificationView onVerified={() => advance('paid')} />
            )}
            {stage === 'paid' && (
              <PaymentSuccessView onViewWallet={onGoToWallet} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};