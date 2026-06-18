import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PaymentReview } from './payment-review';
import { FundsSecured } from './funds-secured';
import { MoveInChecklist } from './move-in-checklist';
import { WalletTopUp } from './wallet-topup';
import { CheckCircle, X, ArrowRight } from 'lucide-react';

interface EscrowFlowProps {
  property: {
    title: string;
    location: string;
    image: string;
    price: string;
    agent?: { name: string };
    rentBreakdown?: {
      rent: string;
      serviceCharge: string;
      agencyFee: string;
      legalFee: string;
      cautionFee: string;
    };
  };
  onClose: () => void;
}

const parseCurrency = (s: string): number => {
  const n = s.replace(/[^0-9.]/g, '');
  return parseFloat(n) || 0;
};

const formatCurrency = (v: number) => `₦${v.toLocaleString('en-NG')}`;

export const EscrowFlow: React.FC<EscrowFlowProps> = ({ property, onClose }) => {
  const [step, setStep] = useState<'review' | 'topup' | 'secured' | 'checklist' | 'complete' | 'dispute'>('review');
  const [walletBalance, setWalletBalance] = useState(1200000);

  const breakdown = property.rentBreakdown;
  const fees = breakdown
    ? [
        { label: 'Annual Rent', amount: breakdown.rent, value: parseCurrency(breakdown.rent) },
        { label: 'Service Charge', amount: breakdown.serviceCharge, value: parseCurrency(breakdown.serviceCharge) },
        { label: 'Agency Fee', amount: breakdown.agencyFee, value: parseCurrency(breakdown.agencyFee) },
        { label: 'Legal Fee', amount: breakdown.legalFee, value: parseCurrency(breakdown.legalFee) },
        { label: 'Caution Fee', amount: breakdown.cautionFee, value: parseCurrency(breakdown.cautionFee) },
      ]
    : [
        { label: 'Annual Rent', amount: property.price, value: parseCurrency(property.price) },
        { label: 'Service Charge', amount: '₦200,000', value: 200000 },
        { label: 'Agency Fee', amount: '₦150,000', value: 150000 },
        { label: 'Legal Fee', amount: '₦100,000', value: 100000 },
        { label: 'Caution Fee', amount: '₦300,000', value: 300000 },
      ];

  const total = fees.reduce((s, f) => s + f.value, 0);
  const agentName = property.agent?.name || 'Your Agent';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        <AnimatePresence mode="wait">
          {step === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="overflow-y-auto max-h-[90vh]"
            >
              <PaymentReview
                propertyTitle={property.title}
                propertyLocation={property.location}
                propertyImage={property.image}
                agentName={agentName}
                fees={fees}
                walletBalance={walletBalance}
                onBack={onClose}
                onProceed={() => setStep('secured')}
                onTopUp={() => setStep('topup')}
              />
            </motion.div>
          )}

          {step === 'topup' && (
            <motion.div
              key="topup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="overflow-y-auto max-h-[90vh]"
            >
              <WalletTopUp
                currentBalance={walletBalance}
                requiredAmount={total}
                onBack={() => setStep('review')}
                onTopUpComplete={(newBalance) => {
                  setWalletBalance(newBalance);
                  setStep('review');
                }}
              />
            </motion.div>
          )}

          {step === 'secured' && (
            <motion.div
              key="secured"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="overflow-y-auto max-h-[90vh]"
            >
              <FundsSecured
                amount={formatCurrency(total)}
                agentName={agentName}
                propertyTitle={property.title}
                onBack={() => setStep('review')}
                onScheduleWalkthrough={() => setStep('checklist')}
              />
            </motion.div>
          )}

          {step === 'checklist' && (
            <motion.div
              key="checklist"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="overflow-y-auto max-h-[90vh]"
            >
              <MoveInChecklist
                agentName={agentName}
                propertyTitle={property.title}
                amount={formatCurrency(total)}
                onBack={() => setStep('secured')}
                onReleaseFunds={() => setStep('complete')}
                onDisputeSubmitted={() => setStep('dispute')}
              />
            </motion.div>
          )}

          {step === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[hsl(var(--navy))] flex flex-col items-center justify-center px-6 py-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-24 h-24 rounded-full bg-[hsl(var(--escrow-green))] flex items-center justify-center mb-6 shadow-2xl shadow-[hsl(var(--escrow-green))]/30"
              >
                <CheckCircle className="w-12 h-12 text-white" />
              </motion.div>
              <h1 className="text-white font-black text-2xl text-center mb-2">
                Transaction Complete!
              </h1>
              <p className="text-white/50 text-sm text-center font-medium mb-2">
                Funds released to {agentName}
              </p>
              <p className="text-white/30 text-xs text-center font-medium mb-8">
                Welcome to your new home 🏡
              </p>
              <button
                onClick={onClose}
                className="px-8 h-14 bg-white text-[hsl(var(--navy))] rounded-full font-bold text-sm flex items-center gap-2 hover:bg-slate-100 transition-all active:scale-[0.98] active:bg-primary active:text-white"
              >
                Back to Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 'dispute' && (
            <motion.div
              key="dispute"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[hsl(var(--navy))] flex flex-col items-center justify-center px-6 py-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-24 h-24 rounded-full bg-[hsl(var(--escrow-amber))]/20 border-2 border-[hsl(var(--escrow-amber))]/40 flex items-center justify-center mb-6"
              >
                <svg className="w-10 h-10 text-[hsl(var(--escrow-amber))]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </motion.div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[hsl(var(--escrow-amber))]/15 border border-[hsl(var(--escrow-amber))]/30 rounded-full mb-4">
                <div className="w-2 h-2 rounded-full bg-[hsl(var(--escrow-amber))] animate-pulse" />
                <span className="text-[10px] font-bold text-[hsl(var(--escrow-amber))] uppercase tracking-[0.2em]">
                  Frozen
                </span>
              </div>
              <h1 className="text-white font-black text-2xl text-center mb-2">
                Escrow Frozen
              </h1>
              <p className="text-white/50 text-sm text-center font-medium mb-2 max-w-xs">
                {formatCurrency(total)} has been frozen. The Houzii Human Oracle team has been alerted.
              </p>
              <p className="text-white/30 text-xs text-center font-medium mb-8">
                We'll review your dispute within 24 hours
              </p>
              <button
                onClick={onClose}
                className="px-8 h-14 bg-white/10 border border-white/20 text-white rounded-full font-bold text-sm flex items-center gap-2 hover:bg-white/20 transition-all active:scale-[0.98] active:bg-primary"
              >
                Back to Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
