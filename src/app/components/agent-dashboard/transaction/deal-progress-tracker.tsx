import React from 'react';
import { motion } from 'framer-motion';
import { Check, Users, FileText, Wallet, Home, CircleDollarSign } from 'lucide-react';

export type TransactionStage = 'vetting' | 'agreement' | 'payment' | 'walkthrough' | 'payout';

const stages: { id: TransactionStage; label: string; icon: React.ElementType }[] = [
  { id: 'vetting', label: 'Vetting', icon: Users },
  { id: 'agreement', label: 'Agreement', icon: FileText },
  { id: 'payment', label: 'Payment', icon: Wallet },
  { id: 'walkthrough', label: 'Walkthrough', icon: Home },
  { id: 'payout', label: 'Payout', icon: CircleDollarSign },
];

const stageOrder: TransactionStage[] = ['vetting', 'agreement', 'payment', 'walkthrough', 'payout'];

export const getStageIndex = (stage: TransactionStage) => stageOrder.indexOf(stage);

interface DealProgressTrackerProps {
  currentStage: TransactionStage;
  className?: string;
}

export const DealProgressTracker: React.FC<DealProgressTrackerProps> = ({ currentStage, className = '' }) => {
  const currentIdx = getStageIndex(currentStage);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {stages.map((stage, idx) => {
        const isComplete = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        const Icon = stage.icon;

        return (
          <React.Fragment key={stage.id}>
            <div className="flex-1 flex flex-col items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isComplete
                  ? 'bg-[hsl(var(--escrow-green))] text-white'
                  : isCurrent
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-slate-100 text-slate-300'
              }`}>
                {isComplete ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>
              <span className={`text-[9px] font-bold text-center leading-tight ${
                isComplete
                  ? 'text-[hsl(var(--escrow-green))]'
                  : isCurrent
                  ? 'text-primary'
                  : 'text-slate-300'
              }`}>
                {stage.label}
              </span>
            </div>
            {idx < stages.length - 1 && (
              <div className={`h-0.5 flex-1 rounded-full -mt-4 ${
                idx < currentIdx ? 'bg-[hsl(var(--escrow-green))]' : 'bg-slate-100'
              }`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
