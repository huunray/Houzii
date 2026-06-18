import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Wallet, CreditCard, Building2,
  CheckCircle, ArrowRight
} from 'lucide-react';

interface WalletTopUpProps {
  currentBalance: number;
  requiredAmount: number;
  onBack: () => void;
  onTopUpComplete: (newBalance: number) => void;
}

const QUICK_AMOUNTS = [500000, 1000000, 2000000, 5000000];

const formatCurrency = (v: number) => `₦${v.toLocaleString('en-NG')}`;

type PaymentMethod = 'card' | 'bank';
type TopUpStep = 'amount' | 'method' | 'processing' | 'success';

export const WalletTopUp: React.FC<WalletTopUpProps> = ({
  currentBalance,
  requiredAmount,
  onBack,
  onTopUpComplete,
}) => {
  const deficit = Math.max(0, requiredAmount - currentBalance);
  const [amount, setAmount] = useState<number>(deficit);
  const [customInput, setCustomInput] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [step, setStep] = useState<TopUpStep>('amount');

  const handleQuickAmount = (val: number) => {
    setAmount(val);
    setCustomInput('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setCustomInput(raw);
    setAmount(parseInt(raw) || 0);
  };

  const handleProceedToMethod = () => {
    if (amount > 0) setStep('method');
  };

  const handlePay = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
    }, 2000);
  };

  const handleDone = () => {
    onTopUpComplete(currentBalance + amount);
  };

  const methods: { id: PaymentMethod; label: string; desc: string; icon: React.ReactNode }[] = [
    { id: 'card', label: 'Debit Card', desc: 'Visa, Mastercard', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'bank', label: 'Bank Transfer', desc: 'Direct transfer', icon: <Building2 className="w-5 h-5" /> },
  ];

  return (
    <div className="bg-[hsl(var(--navy))]">
      <AnimatePresence mode="wait">
        {(step === 'amount' || step === 'method') && (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Header */}
            <div className="px-6 pt-8 pb-6">
              <button
                onClick={step === 'method' ? () => setStep('amount') : onBack}
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors font-bold text-sm mb-8"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-4 h-4 text-[hsl(var(--escrow-green))]" />
                <span className="text-[10px] font-bold text-[hsl(var(--escrow-green))] uppercase tracking-[0.2em]">
                  Wallet Top Up
                </span>
              </div>
              <h1 className="text-white font-black text-2xl leading-tight">
                {step === 'amount' ? 'Add Funds' : 'Payment Method'}
              </h1>
            </div>

            <div className="bg-slate-50 rounded-t-[28px] min-h-[60vh] px-6 pt-8 pb-32">
              {step === 'amount' && (
                <>
                  {/* Current Balance */}
                  <div className="bg-[hsl(var(--navy))] rounded-2xl p-5 mb-6 relative overflow-hidden">
                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full" />
                    <div className="relative">
                      <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">
                        Current Balance
                      </p>
                      <p className="text-white font-black text-2xl">{formatCurrency(currentBalance)}</p>
                      {deficit > 0 && (
                        <p className="text-[hsl(var(--escrow-amber))] text-xs font-bold mt-2">
                          You need at least {formatCurrency(deficit)} more
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-5">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                      Enter Amount
                    </h3>
                    <div className="relative mb-4">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">₦</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={customInput || (amount > 0 ? amount.toLocaleString('en-NG') : '')}
                        onChange={handleCustomChange}
                        placeholder="0"
                        className="w-full h-14 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-full text-slate-900 font-black text-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      />
                    </div>

                    {/* Quick amounts */}
                    <div className="grid grid-cols-2 gap-2">
                      {QUICK_AMOUNTS.map((val) => (
                        <button
                          key={val}
                          onClick={() => handleQuickAmount(val)}
                          className={`h-11 rounded-full font-bold text-sm transition-all ${
                            amount === val
                              ? 'bg-primary text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {formatCurrency(val)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={handleProceedToMethod}
                    disabled={amount <= 0}
                    className={`w-full h-14 rounded-full font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${
                      amount <= 0
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                        : 'bg-primary hover:brightness-110 text-white active:bg-primary active:scale-[0.98]'
                    }`}
                  >
                    Continue — {formatCurrency(amount)}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {step === 'method' && (
                <>
                  {/* Amount summary */}
                  <div className="bg-[hsl(var(--escrow-green-muted))] border border-[hsl(var(--escrow-green))]/20 rounded-2xl p-4 flex items-center justify-between mb-6">
                    <div>
                      <p className="text-xs font-bold text-[hsl(var(--escrow-green))]">Top Up Amount</p>
                      <p className="text-lg font-black text-[hsl(var(--escrow-green))]">{formatCurrency(amount)}</p>
                    </div>
                    <button
                      onClick={() => setStep('amount')}
                      className="text-xs font-bold text-[hsl(var(--escrow-green))] underline"
                    >
                      Change
                    </button>
                  </div>

                  {/* Payment methods */}
                  <div className="space-y-3 mb-6">
                    {methods.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setSelectedMethod(m.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                          selectedMethod === m.id
                            ? 'border-primary bg-primary/5'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          selectedMethod === m.id
                            ? 'bg-primary text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {m.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-900">{m.label}</p>
                          <p className="text-xs text-slate-400 font-medium">{m.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedMethod === m.id ? 'border-primary' : 'border-slate-300'
                        }`}>
                          {selectedMethod === m.id && (
                            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Pay CTA */}
                  <button
                    onClick={handlePay}
                    className="w-full h-14 rounded-full font-bold text-sm shadow-lg bg-[hsl(var(--escrow-green))] hover:brightness-110 text-white transition-all flex items-center justify-center gap-2 active:bg-primary active:scale-[0.98]"
                  >
                    <CreditCard className="w-5 h-5" />
                    Pay {formatCurrency(amount)}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}

        {step === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[hsl(var(--navy))] flex flex-col items-center justify-center px-6 py-24"
          >
            <div className="w-16 h-16 border-4 border-white/10 border-t-[hsl(var(--escrow-green))] rounded-full animate-spin mb-6" />
            <h2 className="text-white font-bold text-lg mb-2">Processing Payment</h2>
            <p className="text-white/40 text-sm font-medium">Please wait...</p>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success"
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
              Top Up Successful!
            </h1>
            <p className="text-white/50 text-sm text-center font-medium mb-1">
              {formatCurrency(amount)} added to your wallet
            </p>
            <p className="text-white/30 text-xs text-center font-medium mb-8">
              New balance: {formatCurrency(currentBalance + amount)}
            </p>
            <button
              onClick={handleDone}
              className="px-8 h-14 bg-white text-[hsl(var(--navy))] rounded-full font-bold text-sm flex items-center gap-2 hover:bg-slate-100 transition-all active:bg-primary active:text-white active:scale-[0.98]"
            >
              Continue to Payment
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
