import React from 'react';
import { motion } from 'framer-motion';
import { Key, Shield, AlertTriangle, ChevronRight, X } from 'lucide-react';

interface HandoverDecisionModalProps {
  propertyTitle: string;
  agentName: string;
  onReviewVerify: () => void;
  onDispute: () => void;
  onClose: () => void;
}

export const HandoverDecisionModal: React.FC<HandoverDecisionModalProps> = ({
  propertyTitle,
  agentName,
  onReviewVerify,
  onDispute,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
        >
          <X className="w-4 h-4 text-slate-500" />
        </button>

        {/* Header */}
        <div className="bg-[hsl(var(--navy))] px-6 pt-8 pb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
            className="w-16 h-16 rounded-2xl bg-[hsl(var(--escrow-green))]/15 flex items-center justify-center mx-auto mb-4"
          >
            <Key className="w-8 h-8 text-[hsl(var(--escrow-green))]" />
          </motion.div>
          <h1 className="text-white font-black text-xl text-center">
            Agent Has Handed Over the Keys
          </h1>
          <p className="text-white/40 text-sm font-medium mt-2 text-center">
            Property: {propertyTitle}
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-4">
          {/* Info Card */}
          <div className="bg-[hsl(var(--escrow-green))]/5 border border-[hsl(var(--escrow-green))]/15 rounded-2xl p-4 flex items-start gap-3">
            <Shield className="w-5 h-5 text-[hsl(var(--escrow-green))] mt-0.5 shrink-0" />
            <p className="text-sm font-medium text-slate-600 leading-snug">
              Agent <span className="font-bold text-slate-800">{agentName}</span> has confirmed the handover.
              Please verify the property condition before releasing funds.
            </p>
          </div>

          {/* Primary CTA */}
          <button
            onClick={onReviewVerify}
            className="w-full h-14 bg-primary active:bg-primary text-white rounded-full font-bold text-sm shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Shield className="w-5 h-5" />
            Review & Verify
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Secondary CTA */}
          <button
            onClick={onDispute}
            className="w-full h-12 border-2 border-slate-200 text-slate-500 hover:border-[hsl(var(--escrow-red))] hover:text-[hsl(var(--escrow-red))] rounded-full font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            Report a Dispute
          </button>
        </div>
      </motion.div>
    </div>
  );
};
