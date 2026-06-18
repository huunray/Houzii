import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, Shield, Clock, User, ArrowRight, CheckCircle
} from 'lucide-react';
import { ScheduleWalkthrough } from './schedule-walkthrough';

interface FundsSecuredProps {
  amount: string;
  agentName: string;
  propertyTitle: string;
  onScheduleWalkthrough: () => void;
  onBack: () => void;
}

export const FundsSecured: React.FC<FundsSecuredProps> = ({
  amount,
  agentName,
  propertyTitle,
  onScheduleWalkthrough,
  onBack,
}) => {
  const [showScheduler, setShowScheduler] = useState(false);

  const stages = [
    { label: 'Funded', description: 'Money is in the vault', active: true, completed: true },
    { label: 'Confirmed', description: 'Agent accepts move-in', active: false, completed: false },
    { label: 'Inspected', description: 'You inspect the property', active: false, completed: false },
    { label: 'Released', description: 'Transaction complete', active: false, completed: false },
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--navy))] flex flex-col">
      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12 pb-8">
        {/* Vault Graphic */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="relative mb-8"
        >
          <div className="w-32 h-32 rounded-full bg-[hsl(var(--escrow-green))]/10 flex items-center justify-center border-2 border-[hsl(var(--escrow-green))]/30">
            <div className="w-24 h-24 rounded-full bg-[hsl(var(--escrow-green))]/15 flex items-center justify-center border border-[hsl(var(--escrow-green))]/40">
              <Lock className="w-10 h-10 text-[hsl(var(--escrow-green))]" />
            </div>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="absolute -top-1 -right-1 w-10 h-10 rounded-full bg-[hsl(var(--escrow-green))] flex items-center justify-center shadow-lg shadow-[hsl(var(--escrow-green))]/30"
          >
            <CheckCircle className="w-5 h-5 text-white" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[hsl(var(--escrow-green))]/15 border border-[hsl(var(--escrow-green))]/30 rounded-full mb-4">
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--escrow-green))] animate-pulse" />
            <span className="text-[10px] font-bold text-[hsl(var(--escrow-green))] uppercase tracking-[0.2em]">
              Locked
            </span>
          </div>
          <h1 className="text-white font-black text-2xl mb-2">
            {amount} Secured in Escrow
          </h1>
          <p className="text-white/40 text-sm font-medium">
            Digital vault active • Funds protected
          </p>
        </motion.div>
      </div>

      {/* Bottom Content */}
      <div className="bg-slate-50 rounded-t-[28px] px-6 pt-8 pb-32">
        {/* Next Steps Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[hsl(var(--navy))]/5 flex items-center justify-center">
              <User className="w-5 h-5 text-[hsl(var(--navy))]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Next Steps</h3>
              <p className="text-xs text-slate-400 font-medium">Agent notification sent</p>
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <p className="text-sm text-slate-700 font-semibold leading-relaxed">
              Agent <span className="font-black text-slate-900">{agentName}</span> has been notified.
              They have <span className="font-black text-[hsl(var(--escrow-amber))]">24 hours</span> to
              confirm your move-in date.
            </p>
          </div>
          <div className="flex items-center gap-2 mt-3 text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">Awaiting agent confirmation</span>
          </div>
        </motion.div>

        {/* Escrow Status Stages */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Shield className="w-4 h-4 text-[hsl(var(--escrow-green))]" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              Escrow Status
            </span>
          </div>
          <div className="flex items-center justify-between">
            {stages.map((stage, i) => (
              <React.Fragment key={stage.label}>
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      stage.completed
                        ? 'bg-[hsl(var(--escrow-green))] text-white'
                        : 'bg-slate-100 text-slate-300 border-2 border-slate-200'
                    }`}
                  >
                    {stage.completed ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-bold text-center leading-tight ${
                      stage.completed ? 'text-[hsl(var(--escrow-green))]' : 'text-slate-300'
                    }`}
                  >
                    {stage.label}
                  </span>
                </div>
                {i < stages.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 -mt-5 mx-1 rounded-full ${
                      stage.completed ? 'bg-[hsl(var(--escrow-green))]' : 'bg-slate-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={() => setShowScheduler(true)}
            className="w-full h-14 bg-primary hover:brightness-110 text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Schedule Final Walkthrough
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>

      {/* Schedule Walkthrough Modal */}
      <AnimatePresence>
        {showScheduler && (
          <ScheduleWalkthrough
            propertyTitle={propertyTitle}
            agentName={agentName}
            onClose={() => setShowScheduler(false)}
            onPropose={(date, time) => {
              setShowScheduler(false);
              onScheduleWalkthrough();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
