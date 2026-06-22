import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Key, CheckCircle2, Clock, ArrowRight, Shield, Home, AlertCircle
} from 'lucide-react';

interface HandoverCardProps {
  property: string;
  seekerName: string;
  amount: string;
  status: 'in_progress' | 'awaiting_confirmation' | 'deal_closed';
  onConfirmHandover: () => void;
  confirmationDeadline?: Date;
}

const CountdownTimer: React.FC<{ deadline: Date }> = ({ deadline }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const tick = () => {
      const diff = deadline.getTime() - Date.now();
      if (diff <= 0) { setTimeLeft('00:00:00'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  return (
    <span className="text-[hsl(var(--escrow-amber))] font-mono font-black text-sm">{timeLeft}</span>
  );
};

export const HandoverCard: React.FC<HandoverCardProps> = ({
  property, seekerName, amount, status, onConfirmHandover, confirmationDeadline
}) => {
  if (status === 'deal_closed') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-2 border-[hsl(var(--escrow-green))] rounded-2xl p-5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[hsl(var(--escrow-green))]/5 rounded-full blur-3xl" />
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-[hsl(var(--escrow-green))]/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-[hsl(var(--escrow-green))]" />
          </div>
          <div>
            <span className="px-2 py-0.5 bg-[hsl(var(--escrow-green))]/10 text-[hsl(var(--escrow-green))] rounded-full text-[9px] font-black uppercase">Deal Closed</span>
          </div>
        </div>
        <h4 className="text-slate-900 font-bold text-sm">{property}</h4>
        <p className="text-slate-400 text-xs font-medium mt-1">Tenant: {seekerName}</p>
        <div className="mt-3 p-3 bg-[hsl(var(--escrow-green))]/5 border border-[hsl(var(--escrow-green))]/20 rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[hsl(var(--escrow-green))]" />
          <span className="text-[hsl(var(--escrow-green))] text-xs font-bold">{amount} credited to your Wallet</span>
        </div>
      </motion.div>
    );
  }

  if (status === 'awaiting_confirmation') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-[hsl(var(--escrow-amber))]/30 rounded-2xl p-5"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-[hsl(var(--escrow-amber))]/10 rounded-full flex items-center justify-center">
            <Clock className="w-5 h-5 text-[hsl(var(--escrow-amber))]" />
          </div>
          <div>
            <span className="px-2 py-0.5 bg-[hsl(var(--escrow-amber))]/10 text-[hsl(var(--escrow-amber))] rounded-full text-[9px] font-black uppercase">Awaiting Confirmation</span>
          </div>
        </div>
        <h4 className="text-slate-900 font-bold text-sm">{property}</h4>
        <p className="text-slate-400 text-xs font-medium mt-1">Tenant: {seekerName}</p>
        <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-500 text-xs font-bold">Seeker confirmation pending</span>
            {confirmationDeadline && <CountdownTimer deadline={confirmationDeadline} />}
          </div>
          <p className="text-slate-400 text-[10px] font-medium">Payout in 24hrs if no dispute is raised.</p>
        </div>
      </motion.div>
    );
  }

  // in_progress
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-primary/20 rounded-2xl p-5 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl" />
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <Home className="w-5 h-5 text-primary" />
        </div>
        <div>
          <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase">Handover in Progress</span>
        </div>
      </div>
      <h4 className="text-slate-900 font-bold text-sm">{property}</h4>
      <p className="text-slate-400 text-xs font-medium mt-1">Tenant: {seekerName}</p>
      <p className="text-slate-500 text-xs mt-3 leading-relaxed">
        After giving the keys, confirm the handover to trigger fund release.
      </p>
      <button
        onClick={onConfirmHandover}
        className="mt-4 h-11 px-6 bg-[hsl(var(--escrow-green))] text-white rounded-xl font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-md shadow-[hsl(var(--escrow-green))]/20 w-fit"
      >
        <Key className="w-4 h-4" />
        Confirm Handover Complete
        <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
