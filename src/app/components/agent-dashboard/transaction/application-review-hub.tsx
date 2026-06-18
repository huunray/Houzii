import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Shield, User, Briefcase, Heart, CreditCard,
  CheckCircle2, AlertTriangle, ChevronRight, ArrowRight
} from 'lucide-react';

export interface Applicant {
  id: number;
  name: string;
  avatar: string;
  profession: string;
  employer: string;
  maritalStatus: string;
  ninVerified: boolean;
  compatibilityScore: number;
  funded: boolean;
  appliedAt: string;
}

interface ApplicationReviewHubProps {
  isOpen: boolean;
  onClose: () => void;
  listingTitle: string;
  listingLocation: string;
  applicants: Applicant[];
  onAcceptCandidate: (applicant: Applicant) => void;
}

const CompatibilityGauge: React.FC<{ score: number }> = ({ score }) => {
  const circumference = 2 * Math.PI * 28;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? 'hsl(var(--escrow-green))' : score >= 60 ? 'hsl(var(--escrow-amber))' : 'hsl(var(--escrow-red))';

  return (
    <div className="relative w-16 h-16 shrink-0">
      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="28" fill="none" stroke="hsl(var(--border))" strokeWidth="4" />
        <circle
          cx="32" cy="32" r="28" fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-black text-slate-800">{score}%</span>
      </div>
    </div>
  );
};

const AcceptConfirmModal: React.FC<{
  applicant: Applicant;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ applicant, onConfirm, onCancel }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4"
    onClick={onCancel}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
      className="bg-white rounded-2xl max-w-sm w-full p-6"
    >
      <div className="w-12 h-12 rounded-full bg-[hsl(var(--escrow-amber))]/10 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-6 h-6 text-[hsl(var(--escrow-amber))]" />
      </div>
      <h3 className="text-slate-900 font-black text-lg text-center mb-2">Accept {applicant.name}?</h3>
      <p className="text-slate-500 text-sm text-center leading-relaxed mb-6">
        This locks the deal. Once the lease is signed, the seeker has <span className="font-bold text-[hsl(var(--escrow-amber))]">48 hours</span> to pay or the deal expires.
      </p>
      <div className="space-y-3">
        <button
          onClick={onConfirm}
          className="w-full h-12 bg-primary text-white rounded-xl font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" /> Accept Candidate
        </button>
        <button
          onClick={onCancel}
          className="w-full h-12 border border-slate-200 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  </motion.div>
);

export const ApplicationReviewHub: React.FC<ApplicationReviewHubProps> = ({
  isOpen, onClose, listingTitle, listingLocation, applicants, onAcceptCandidate
}) => {
  const [confirmApplicant, setConfirmApplicant] = useState<Applicant | null>(null);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl w-full max-w-2xl mx-4 overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-slate-900 font-black text-lg">Applications</h2>
              <p className="text-slate-400 text-xs font-medium mt-0.5">{listingTitle} · {listingLocation}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Applicant count */}
          <div className="px-6 py-3 bg-slate-50 border-b border-slate-100">
            <span className="text-slate-500 text-xs font-bold">{applicants.length} applicant{applicants.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Applicant list */}
          <div className="divide-y divide-slate-100 max-h-[60vh] overflow-y-auto">
            {applicants.map((applicant, i) => (
              <motion.div
                key={applicant.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="p-5 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Compatibility Gauge */}
                  <CompatibilityGauge score={applicant.compatibilityScore} />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-slate-900 font-bold text-sm">{applicant.name}</h4>
                      {applicant.funded && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full shadow-sm">
                          <Shield className="w-2.5 h-2.5 text-amber-800" />
                          <span className="text-[8px] font-black text-amber-900 uppercase tracking-wider">Priority</span>
                        </span>
                      )}
                      {applicant.ninVerified && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-[hsl(var(--escrow-green))]/10 border border-[hsl(var(--escrow-green))]/20 rounded-full">
                          <CheckCircle2 className="w-2.5 h-2.5 text-[hsl(var(--escrow-green))]" />
                          <span className="text-[8px] font-bold text-[hsl(var(--escrow-green))] uppercase">NIN</span>
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Briefcase className="w-3 h-3" />
                        <span className="text-[11px] font-medium">{applicant.profession} at {applicant.employer}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Heart className="w-3 h-3" />
                        <span className="text-[11px] font-medium">{applicant.maritalStatus}</span>
                      </div>
                    </div>

                    <p className="text-slate-300 text-[10px] font-medium mt-1.5">Applied {applicant.appliedAt}</p>
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => setConfirmApplicant(applicant)}
                    className="shrink-0 h-9 px-4 bg-primary text-white rounded-lg text-xs font-bold hover:brightness-110 transition-all flex items-center gap-1.5"
                  >
                    Accept <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Confirm modal */}
      {confirmApplicant && (
        <AcceptConfirmModal
          applicant={confirmApplicant}
          onConfirm={() => {
            onAcceptCandidate(confirmApplicant);
            setConfirmApplicant(null);
          }}
          onCancel={() => setConfirmApplicant(null)}
        />
      )}
    </AnimatePresence>
  );
};
