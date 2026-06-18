import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  X, Clock, AlertTriangle, ArrowRight, Shield,
  Lock, CreditCard, Zap
} from 'lucide-react';

interface PaymentGate48hProps {
  propertyTitle: string;
  amount: string;
  onClose: () => void;
  onProceedToPayment: () => void;
}

export const PaymentGate48h: React.FC<PaymentGate48hProps> = ({
  propertyTitle,
  amount,
  onClose,
  onProceedToPayment,
}) => {
  // 48 hour countdown (mock starting at 47:59:02 remaining)
  const [timeLeft, setTimeLeft] = useState(172742); // seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  const urgencyLevel = hours < 6 ? 'critical' : hours < 24 ? 'warning' : 'normal';

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
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
        className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Dark urgency */}
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
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            className="w-16 h-16 rounded-full bg-[hsl(var(--escrow-amber))]/20 flex items-center justify-center mx-auto mb-4"
          >
            <Clock className="w-8 h-8 text-[hsl(var(--escrow-amber))]" />
          </motion.div>

          <h1 className="text-white font-black text-xl mb-1">Secure Your Home</h1>
          <p className="text-white/40 text-sm font-medium">{propertyTitle}</p>

          {/* Countdown Timer */}
          <div className="mt-6 flex items-center justify-center gap-3">
            {[
              { value: pad(hours), label: 'HRS' },
              { value: pad(minutes), label: 'MIN' },
              { value: pad(seconds), label: 'SEC' },
            ].map((unit, i) => (
              <React.Fragment key={unit.label}>
                {i > 0 && <span className="text-white/30 font-black text-2xl">:</span>}
                <div className="text-center">
                  <motion.div
                    key={unit.value}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black ${
                      urgencyLevel === 'critical'
                        ? 'bg-[hsl(var(--escrow-red))]/20 text-[hsl(var(--escrow-red))]'
                        : urgencyLevel === 'warning'
                        ? 'bg-[hsl(var(--escrow-amber))]/20 text-[hsl(var(--escrow-amber))]'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    {unit.value}
                  </motion.div>
                  <p className="text-white/30 text-[9px] font-bold mt-1.5 uppercase tracking-widest">{unit.label}</p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-5">
          {/* Amount Card */}
          <div className="p-4 bg-gradient-to-br from-primary/5 to-primary/[0.02] border border-primary/15 rounded-2xl text-center">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Total Due</p>
            <p className="text-slate-900 font-black text-3xl">{amount}</p>
            <p className="text-primary text-xs font-bold mt-1 flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" /> Protected by Houzii Escrow
            </p>
          </div>

          {/* Warning */}
          <div className={`p-4 rounded-xl flex items-start gap-2.5 ${
            urgencyLevel === 'critical'
              ? 'bg-red-50 border border-red-200'
              : 'bg-amber-50 border border-amber-200'
          }`}>
            <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${
              urgencyLevel === 'critical' ? 'text-red-500' : 'text-amber-500'
            }`} />
            <div>
              <p className={`text-xs font-bold ${urgencyLevel === 'critical' ? 'text-red-700' : 'text-amber-700'}`}>
                {urgencyLevel === 'critical' ? 'Time is running out!' : 'Payment window active'}
              </p>
              <p className={`text-[10px] font-medium mt-0.5 ${urgencyLevel === 'critical' ? 'text-red-600' : 'text-amber-600'}`}>
                To finalize this deal, payment must be made within 48 hours. After this, the Agent may move to the next candidate.
              </p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center gap-3">
            {[
              { icon: Lock, label: 'Escrow Protected' },
              { icon: Shield, label: 'Verified Agent' },
              { icon: Zap, label: 'Instant Confirmation' },
            ].map((item) => (
              <div key={item.label} className="flex-1 flex flex-col items-center gap-1.5 p-2.5 bg-slate-50 rounded-xl">
                <item.icon className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[9px] font-bold text-slate-400 text-center">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="px-6 pb-6">
          <button
            onClick={onProceedToPayment}
            className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-full font-bold text-sm shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            Proceed to Secure Payment
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
