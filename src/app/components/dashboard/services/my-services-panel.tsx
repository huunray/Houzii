import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, Star, Plus, Sparkles, Clock, AlertTriangle,
  CheckCircle2, Shield, X, ArrowLeft, Wrench, Camera, Upload, Trash2,
} from 'lucide-react';
import {
  ServiceRequest, ServiceCategoryId, ServiceBid, SERVICE_CATEGORIES, STATUS_CONFIG,
} from './service-types';
import { toast } from 'sonner';

const formatNaira = (n: number) => `₦${n.toLocaleString('en-NG')}`;

interface MyServicesPanelProps {
  requests: ServiceRequest[];
  onNewRequest: () => void;
  onAcceptBid: (requestId: number, bidId: number) => void;
  onApprove: (requestId: number) => void;
  onDispute: (requestId: number) => void;
}

export const MyServicesPanel: React.FC<MyServicesPanelProps> = ({
  requests,
  onNewRequest,
  onAcceptBid,
  onApprove,
  onDispute,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [openProposals, setOpenProposals] = useState<ServiceRequest | null>(null);
  const [openApprovalGate, setOpenApprovalGate] = useState<ServiceRequest | null>(null);
  const [openDisputeForm, setOpenDisputeForm] = useState<ServiceRequest | null>(null);

  const filtered = useMemo(() => {
    if (filter === 'active')
      return requests.filter((r) => r.status !== 'completed' && r.status !== 'disputed');
    if (filter === 'completed')
      return requests.filter((r) => r.status === 'completed' || r.status === 'disputed');
    return requests;
  }, [filter, requests]);

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6 border-b border-slate-100">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-slate-900 font-black text-2xl">My Services</h2>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 border border-primary/15 rounded-full">
              <Wrench className="w-4 h-4 text-primary" />
              <span className="text-primary text-xs font-black">{requests.length}</span>
            </div>
          </div>
          <p className="text-slate-400 font-medium">
            Track moving, cleaning and repairs across your homes
          </p>
        </motion.div>

        {/* Filters + new request */}
        <div className="mt-5 flex items-center gap-3">
          <div className="flex gap-1.5 bg-slate-100 rounded-2xl p-1 h-11 flex-1">
            {([
              { id: 'all', label: 'All' },
              { id: 'active', label: 'Active' },
              { id: 'completed', label: 'Completed' },
            ] as const).map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`flex-1 rounded-xl text-xs font-bold transition-all ${
                  filter === f.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <button
            onClick={onNewRequest}
            className="h-11 px-4 bg-primary hover:bg-primary-dark text-white rounded-full font-bold text-xs shadow-md shadow-primary/20 transition-all active:scale-[0.98] flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> New
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-400 font-bold text-sm">No service requests yet</p>
            <p className="text-slate-300 text-xs font-medium mt-1">
              Tap “New” to book a pro
            </p>
          </div>
        ) : (
          filtered.map((req, i) => (
            <ServiceRequestCard
              key={req.id}
              req={req}
              index={i}
              onViewProposals={() => setOpenProposals(req)}
              onVerify={() => setOpenApprovalGate(req)}
            />
          ))
        )}
      </div>

      {/* Proposals view */}
      <AnimatePresence>
        {openProposals && (
          <ProposalsView
            req={openProposals}
            onClose={() => setOpenProposals(null)}
            onAccept={(bidId) => {
              onAcceptBid(openProposals.id, bidId);
              setOpenProposals(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Work Approval Gate */}
      <AnimatePresence>
        {openApprovalGate && (
          <WorkApprovalGate
            req={openApprovalGate}
            onClose={() => setOpenApprovalGate(null)}
            onApprove={() => {
              onApprove(openApprovalGate.id);
              setOpenApprovalGate(null);
            }}
            onDispute={() => {
              const r = openApprovalGate;
              setOpenApprovalGate(null);
              setOpenDisputeForm(r);
            }}
          />
        )}
      </AnimatePresence>

      {/* Dispute Form */}
      <AnimatePresence>
        {openDisputeForm && (
          <DisputeForm
            req={openDisputeForm}
            onClose={() => setOpenDisputeForm(null)}
            onSubmit={() => {
              onDispute(openDisputeForm.id);
              setOpenDisputeForm(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Card ────────────────────────────────────────────────────────────────────

const ServiceRequestCard: React.FC<{
  req: ServiceRequest;
  index: number;
  onViewProposals: () => void;
  onVerify: () => void;
}> = ({ req, index, onViewProposals, onVerify }) => {
  const cat = SERVICE_CATEGORIES.find((c) => c.id === req.category)!;
  const status = STATUS_CONFIG[req.status];
  const Icon = cat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`w-12 h-12 rounded-xl ${cat.accent.iconBg} flex items-center justify-center shrink-0`}>
            <Icon className={`w-6 h-6 ${cat.accent.icon}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="text-slate-900 font-black text-sm">{cat.label}</h4>
              <span
                className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${status.chip}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                {status.label}
              </span>
            </div>
            <p className="text-slate-500 text-xs font-medium truncate">
              {req.propertyTitle}
            </p>
            <p className="text-slate-300 text-[10px] font-bold mt-0.5">
              {req.createdAt}
            </p>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
          {req.status === 'awaiting_bids' && (
            <>
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                Proposals ({req.bids.length})
              </div>
              <button
                onClick={onViewProposals}
                className="h-9 px-4 bg-primary hover:bg-primary-dark text-white rounded-full font-bold text-xs shadow-sm shadow-primary/20 transition-all active:scale-[0.98] flex items-center gap-1"
              >
                Review Bids <ChevronRight className="w-3 h-3" />
              </button>
            </>
          )}

          {req.status === 'in_escrow' && (
            <>
              <div className="flex items-center gap-1.5 text-[hsl(var(--escrow-green))] text-xs font-bold">
                <Shield className="w-3.5 h-3.5" />
                {formatNaira(req.escrowAmount || 0)} locked in escrow
              </div>
              <span className="text-slate-400 text-[11px] font-bold">
                Awaiting work completion
              </span>
            </>
          )}

          {req.status === 'awaiting_inspection' && (
            <div className="flex items-center gap-1.5 text-blue-600 text-xs font-bold">
              <Clock className="w-3.5 h-3.5" />
              Inspection scheduled
            </div>
          )}

          {req.status === 'work_complete' && (
            <>
              <div className="flex items-center gap-1.5 text-primary text-xs font-bold">
                <AlertTriangle className="w-3.5 h-3.5" />
                Verify before funds release
              </div>
              <button
                onClick={onVerify}
                className="h-9 px-4 bg-primary hover:bg-primary-dark text-white rounded-full font-bold text-xs shadow-sm shadow-primary/20 transition-all active:scale-[0.98] flex items-center gap-1"
              >
                Verify Work <ChevronRight className="w-3 h-3" />
              </button>
            </>
          )}

          {req.status === 'completed' && (
            <div className="flex items-center gap-1.5 text-[hsl(var(--escrow-green))] text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Completed — Funds released
            </div>
          )}

          {req.status === 'disputed' && (
            <div className="flex items-center gap-1.5 text-[hsl(var(--escrow-red))] text-xs font-bold">
              <AlertTriangle className="w-3.5 h-3.5" /> In dispute — Houzii reviewing
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Proposals view ──────────────────────────────────────────────────────────

const ProposalsView: React.FC<{
  req: ServiceRequest;
  onClose: () => void;
  onAccept: (bidId: number) => void;
}> = ({ req, onClose, onAccept }) => {
  const cat = SERVICE_CATEGORIES.find((c) => c.id === req.category)!;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl bg-white max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-500">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h3 className="text-slate-900 font-black text-base">Proposals ({req.bids.length})</h3>
              <p className="text-slate-400 text-[11px] font-bold">{cat.label} • {req.propertyTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
          {cat.requiresInspection && (
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
              <p className="text-blue-700 text-[11px] font-bold leading-snug">
                These bids cover the <span className="underline">physical inspection / diagnosis fee only</span>.
                Final job cost is agreed after the pro inspects on-site.
              </p>
            </div>
          )}

          {req.bids.map((bid, i) => (
            <BidCard
              key={bid.id}
              bid={bid}
              index={i}
              ctaLabel={cat.requiresInspection ? 'Accept Bid & Schedule Inspection' : 'Accept Bid'}
              onAccept={() => onAccept(bid.id)}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const BidCard: React.FC<{
  bid: ServiceBid;
  index: number;
  ctaLabel: string;
  onAccept: () => void;
}> = ({ bid, index, ctaLabel, onAccept }) => {
  const isInspection = /inspection|diagnosis/i.test(bid.amountLabel);
  const chipClass = isInspection
    ? 'bg-primary/10 text-primary'
    : 'bg-[hsl(var(--escrow-green-muted))] text-[hsl(var(--escrow-green))]';
  const dotClass = isInspection
    ? 'bg-primary'
    : 'bg-[hsl(var(--escrow-green))]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-white border border-slate-200 rounded-2xl p-4 hover:border-slate-300 transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 font-black text-sm shrink-0">
          {bid.proName.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h4 className="text-slate-900 font-black text-sm truncate">{bid.proName}</h4>
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {bid.rating}
              <span className="text-slate-300 font-medium">({bid.jobsCompleted})</span>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-1.5 ${chipClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
            {bid.amountLabel}
          </span>
          <p className="text-slate-900 font-black text-xl mb-1">{formatNaira(bid.amount)}</p>
          {isInspection && (
            <p className="text-slate-500 text-[11px] font-medium mb-1">
              Full project cost is estimated but agreed upon later.
            </p>
          )}
          <p className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" /> {bid.eta}
          </p>
          {bid.note && (
            <p className="text-slate-500 text-[11px] font-medium mt-2 italic">"{bid.note}"</p>
          )}
        </div>
      </div>

      <button
        onClick={onAccept}
        className="mt-4 w-full h-11 bg-primary hover:bg-primary-dark text-white rounded-full font-bold text-xs shadow-sm shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      >
        {ctaLabel}
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
};

// ─── Work Approval Gate (48h countdown) ──────────────────────────────────────

const WorkApprovalGate: React.FC<{
  req: ServiceRequest;
  onClose: () => void;
  onApprove: () => void;
  onDispute: () => void;
}> = ({ req, onClose, onApprove, onDispute }) => {
  const cat = SERVICE_CATEGORIES.find((c) => c.id === req.category)!;
  const acceptedBid = req.bids.find((b) => b.id === req.acceptedBidId);
  const deadline = (req.workCompletedAt || Date.now()) + 48 * 60 * 60 * 1000;
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, deadline - Date.now()));

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(Math.max(0, deadline - Date.now())), 1000);
    return () => clearInterval(t);
  }, [deadline]);

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  const pad = (n: number) => String(n).padStart(2, '0');
  const urgent = hours < 6;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[hsl(var(--navy))] px-6 pt-8 pb-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 14 }}
            className="w-16 h-16 rounded-2xl bg-[hsl(var(--escrow-green))]/15 flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle2 className="w-8 h-8 text-[hsl(var(--escrow-green))]" />
          </motion.div>

          <h1 className="text-white font-black text-xl mb-1">Work Complete Verification</h1>
          <p className="text-white/50 text-sm font-medium">
            {cat.label} by {acceptedBid?.proName ?? 'your pro'}
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-4">
          {/* Amount */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
              Held in escrow
            </p>
            <p className="text-slate-900 font-black text-2xl">
              {formatNaira(req.escrowAmount || acceptedBid?.amount || 0)}
            </p>
          </div>

          {/* Countdown */}
          <div className="p-4 bg-gradient-to-br from-primary/5 to-primary/[0.02] border border-primary/15 rounded-2xl">
            <div className="flex items-center justify-center gap-3 mb-2">
              {[
                { v: pad(hours), l: 'HRS' },
                { v: pad(minutes), l: 'MIN' },
                { v: pad(seconds), l: 'SEC' },
              ].map((u, i) => (
                <React.Fragment key={u.l}>
                  {i > 0 && <span className="text-slate-300 font-black text-xl">:</span>}
                  <div className="text-center">
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-black ${
                        urgent
                          ? 'bg-[hsl(var(--escrow-red))]/10 text-[hsl(var(--escrow-red))]'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      {u.v}
                    </div>
                    <p className="text-slate-400 text-[9px] font-black mt-1 tracking-widest">
                      {u.l}
                    </p>
                  </div>
                </React.Fragment>
              ))}
            </div>
            <p className="text-slate-500 text-[11px] font-medium text-center leading-snug">
              If you do not approve or report a dispute within 48 hours, the funds in escrow will
              <span className="font-bold"> automatically be released</span>.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-2.5">
            <button
              onClick={onApprove}
              className="w-full h-14 bg-primary hover:bg-primary-dark text-white rounded-full font-bold text-sm shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Shield className="w-5 h-5" />
              Approve & Release Funds
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={onDispute}
              className="w-full h-12 border-2 border-slate-200 text-slate-500 hover:border-[hsl(var(--escrow-red))] hover:text-[hsl(var(--escrow-red))] rounded-full font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              Report a Dispute
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Dispute Form ────────────────────────────────────────────────────────────

const DisputeForm: React.FC<{
  req: ServiceRequest;
  onClose: () => void;
  onSubmit: () => void;
}> = ({ req, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');
  const [photos, setPhotos] = useState(0);

  const valid = reason.trim().length > 10 && photos > 0;

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl bg-white max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-[hsl(var(--escrow-red))]" />
            </div>
            <div>
              <h3 className="text-slate-900 font-black text-sm">Report a Dispute</h3>
              <p className="text-slate-400 text-[10px] font-bold">Funds frozen during review</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div>
            <label className="text-slate-600 text-[11px] font-bold uppercase tracking-wider mb-2 block">
              Why is the work unsatisfactory?
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe what wasn't completed or done correctly…"
              rows={4}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/5 resize-none"
            />
          </div>

          <div>
            <label className="text-slate-600 text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
              Evidence Photos <span className="text-[hsl(var(--escrow-red))]">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: photos }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 border border-slate-200 relative overflow-hidden flex items-center justify-center"
                >
                  <Camera className="w-5 h-5 text-slate-500" />
                  <button
                    type="button"
                    onClick={() => setPhotos((p) => Math.max(0, p - 1))}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center"
                  >
                    <Trash2 className="w-2.5 h-2.5 text-white" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setPhotos((p) => p + 1)}
                className="aspect-square rounded-xl bg-slate-50 border-2 border-dashed border-slate-300 hover:border-primary/40 flex flex-col items-center justify-center gap-1 transition-all"
              >
                <Upload className="w-5 h-5 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400">Upload</span>
              </button>
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-amber-700 text-[11px] font-bold leading-snug">
              Filing a dispute freezes the escrow. The Houzii Human Oracle team will review within
              24 hours.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 shrink-0 flex gap-3">
          <button
            onClick={onClose}
            className="px-5 h-11 rounded-full text-slate-500 hover:text-slate-700 text-sm font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSubmit();
              toast.error('Dispute Filed', {
                description: 'Escrow frozen. Houzii will review within 24h.',
              });
            }}
            disabled={!valid}
            className="flex-1 h-11 bg-[hsl(var(--escrow-red))] hover:opacity-90 text-white rounded-full font-bold text-sm shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <AlertTriangle className="w-4 h-4" />
            Submit Dispute
          </button>
        </div>
      </motion.div>
    </div>
  );
};
