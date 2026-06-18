import React from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft, Shield, Wallet, ArrowRight, Lock,
  CreditCard, Building2, CheckCircle, Plus
} from 'lucide-react';

interface FeeItem {
  label: string;
  amount: string;
  value: number;
}

interface PaymentReviewProps {
  propertyTitle: string;
  propertyLocation: string;
  propertyImage: string;
  agentName: string;
  fees: FeeItem[];
  walletBalance: number;
  onBack: () => void;
  onProceed: () => void;
  onTopUp?: () => void;
}

export const PaymentReview: React.FC<PaymentReviewProps> = ({
  propertyTitle,
  propertyLocation,
  propertyImage,
  agentName,
  fees,
  walletBalance,
  onBack,
  onProceed,
  onTopUp,
}) => {
  const total = fees.reduce((sum, f) => sum + f.value, 0);
  const needsTopUp = walletBalance < total;
  const formatCurrency = (v: number) =>
    `₦${v.toLocaleString('en-NG')}`;

  return (
    <div className="bg-[hsl(var(--navy))]">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors font-bold text-sm mb-8"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-[hsl(var(--escrow-green))]" />
            <span className="text-[10px] font-bold text-[hsl(var(--escrow-green))] uppercase tracking-[0.2em]">
              Secure Checkout
            </span>
          </div>
          <h1 className="text-white font-black text-2xl leading-tight">
            Secure Your New Home
          </h1>
        </motion.div>
      </div>

      <div className="bg-slate-50 rounded-t-[28px] min-h-[70vh] px-6 pt-8 pb-32">
        {/* Property Summary */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm mb-6"
        >
          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
            <img src={propertyImage} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-slate-900 font-bold text-sm truncate">{propertyTitle}</h3>
            <p className="text-slate-400 text-xs font-medium mb-1">{propertyLocation}</p>
            <p className="text-slate-500 text-[11px] font-semibold">Agent: {agentName}</p>
          </div>
        </motion.div>

        {/* Fee Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-5"
        >
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            Fee Breakdown
          </h3>
          <div className="space-y-3">
            {fees.map((fee, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600">{fee.label}</span>
                <span className="text-sm font-bold text-slate-900">{fee.amount}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t-2 border-dashed border-slate-200 flex justify-between items-center">
            <span className="text-sm font-black text-slate-900">Total</span>
            <span className="text-lg font-black text-slate-900">{formatCurrency(total)}</span>
          </div>
        </motion.div>

        {/* Wallet Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-[hsl(var(--navy))] rounded-2xl p-5 mb-5 relative overflow-hidden"
        >
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-white/60" />
                <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                  Houzii Wallet
                </span>
              </div>
              {needsTopUp && (
                <button
                  onClick={onTopUp}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-[11px] font-bold transition-colors active:bg-primary"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Top Up
                </button>
              )}
            </div>
            <div className="text-white font-black text-2xl mb-1">
              {formatCurrency(walletBalance)}
            </div>
            <p className="text-white/40 text-xs font-medium">Current Balance</p>
            {needsTopUp && (
              <div className="mt-3 px-3 py-2 bg-[hsl(var(--escrow-amber))]/15 border border-[hsl(var(--escrow-amber))]/30 rounded-xl flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[hsl(var(--escrow-amber))]" />
                <span className="text-[11px] font-bold text-[hsl(var(--escrow-amber))]">
                  You need {formatCurrency(total - walletBalance)} more
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Trust Escrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[hsl(var(--escrow-green-muted))] border border-[hsl(var(--escrow-green))]/20 rounded-2xl p-4 flex items-center gap-3 mb-6"
        >
          <div className="w-10 h-10 rounded-full bg-[hsl(var(--escrow-green))]/10 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-[hsl(var(--escrow-green))]" />
          </div>
          <p className="text-[12px] font-bold text-[hsl(var(--escrow-green))] leading-snug">
            Your funds will be held in Houzii Escrow until you move in
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <button
            onClick={onProceed}
            disabled={needsTopUp}
            className={`w-full h-14 rounded-full font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${
              needsTopUp
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-[hsl(var(--escrow-green))] hover:brightness-110 text-white shadow-[hsl(var(--escrow-green))]/25 active:scale-[0.98] active:bg-primary'
            }`}
          >
            {needsTopUp ? (
              <>
                <CreditCard className="w-5 h-5" />
                Pay {formatCurrency(total)}
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Secure Funds — {formatCurrency(total)}
              </>
            )}
          </button>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Lock className="w-3 h-3 text-slate-300" />
            <span className="text-[11px] font-bold text-slate-400">
              Secured by Paystack / Bank Transfer
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
