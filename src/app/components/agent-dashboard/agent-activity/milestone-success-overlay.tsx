import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Sparkles, Key, FileCheck, Search, HandshakeIcon, ShieldCheck } from 'lucide-react';

type Pipeline = 'rental' | 'sale';

export interface MilestoneData {
  pipeline: Pipeline;
  milestone: 'acknowledged' | 'documented' | 'walkthrough_scheduled' | 'handover_complete';
  propertyName: string;
  amount: string;
  seekerName: string;
}

interface MilestoneConfig {
  headline: string;
  impactSummary: string;
  nudgeText: string;
  ctaLabel: string;
  stepCurrent: number;
  stepTotal: number;
  stepLabel: string;
  icon: 'key' | 'documents' | 'inspection' | 'handover' | 'oracle';
  celebrationLevel: 'standard' | 'high' | 'maximum';
}

function getMilestoneConfig(data: MilestoneData): MilestoneConfig {
  const { pipeline, milestone, propertyName, amount, seekerName } = data;

  if (milestone === 'acknowledged') {
    return {
      headline: 'Payment Acknowledged!',
      impactSummary: `The ${amount} payment for the ${propertyName} has been securely received in escrow and successfully acknowledged.`,
      nudgeText: pipeline === 'rental'
        ? `Your transaction has advanced to the 'Documents' stage. Fulfill your promise to unlock the next milestone and move towards key handover.`
        : `Your transaction has advanced to the 'Documents' stage. Fulfill your promise to unlock the next milestone and move towards title transfer.`,
      ctaLabel: pipeline === 'rental' ? 'Prepare Closing Documents' : 'Initiate Title Transfer',
      stepCurrent: 2,
      stepTotal: pipeline === 'rental' ? 4 : 5,
      stepLabel: pipeline === 'rental' ? 'Step 2 of 4' : 'Step 2 of 5',
      icon: 'key',
      celebrationLevel: 'standard',
    };
  }

  if (milestone === 'documented') {
    if (pipeline === 'rental') {
      return {
        headline: 'Documents Fulfilled!',
        impactSummary: `All promised documents and the executed Tenancy Agreement for the ${propertyName} have been successfully generated, uploaded, and verified.`,
        nudgeText: `Your transaction is now advanced to Step 3 of 4: 'Inspections'. Coordinate with ${seekerName} for the final physical walkthrough to trigger the key handover.`,
        ctaLabel: 'Coordinate Walkthrough',
        stepCurrent: 3,
        stepTotal: 4,
        stepLabel: 'Step 3 of 4',
        icon: 'documents',
        celebrationLevel: 'standard',
      };
    } else {
      return {
        headline: 'Title Documents Submitted!',
        impactSummary: `The Deed of Assignment and all accompanying title documents for ${propertyName} have been securely uploaded for priority Oracle Verification.`,
        nudgeText: `Our legal experts are now cross-checking the registry. This unique Houzii process ensures a safe title transfer. Coordinate with Seeker ${seekerName} for the final walkthrough while we perform the review.`,
        ctaLabel: 'Coordinate Walkthrough',
        stepCurrent: 2,
        stepTotal: 5,
        stepLabel: 'Step 2 of 5 (Pending Review)',
        icon: 'oracle',
        celebrationLevel: 'standard',
      };
    }
  }

  if (milestone === 'walkthrough_scheduled') {
    if (pipeline === 'rental') {
      return {
        headline: 'Walkthrough Scheduled!',
        impactSummary: `The final physical walkthrough and key handover for the ${propertyName} is confirmed.`,
        nudgeText: `This is the last step. Seeker ${seekerName} will confirm move-in and release funds directly after this meeting. Ensure you have the physical keys and meter card ready.`,
        ctaLabel: 'Prepare Final Handover',
        stepCurrent: 3,
        stepTotal: 4,
        stepLabel: 'Step 3 of 4',
        icon: 'inspection',
        celebrationLevel: 'standard',
      };
    } else {
      return {
        headline: 'Walkthrough Scheduled!',
        impactSummary: `The final physical inspection of ${propertyName} and surrounding landmarks is confirmed.`,
        nudgeText: `Review the topography and boundary pillars with Seeker ${seekerName} while the Oracle verification is in progress.`,
        ctaLabel: 'View Inspection Details',
        stepCurrent: 3,
        stepTotal: 5,
        stepLabel: 'Step 3 of 5',
        icon: 'inspection',
        celebrationLevel: 'standard',
      };
    }
  }

  // handover_complete
  if (pipeline === 'rental') {
    return {
      headline: 'Handover Complete!',
      impactSummary: `Keys and physical documents for the ${propertyName} are now officially with ${seekerName}.`,
      nudgeText: `Congratulations on a successful transaction. Your final commission is moving from the escrow vault to your wallet. You will be notified of the official funds release once the Seeker slides to confirm move-in.`,
      ctaLabel: 'View Final Earnings',
      stepCurrent: 4,
      stepTotal: 4,
      stepLabel: 'Step 4 of 4',
      icon: 'handover',
      celebrationLevel: 'maximum',
    };
  } else {
    return {
      headline: 'Handover Complete!',
      impactSummary: `All physical title documents and legal possession of ${propertyName} are now officially with ${seekerName}.`,
      nudgeText: `Congratulations on a high-value close. Payout is released once the Seeker slides to confirm receipt of all original documents and physical possession. The Oracle has verified the legal transfer.`,
      ctaLabel: 'View Final Earnings',
      stepCurrent: 5,
      stepTotal: 5,
      stepLabel: 'Step 5 of 5',
      icon: 'handover',
      celebrationLevel: 'maximum',
    };
  }
}

const MilestoneIcon: React.FC<{ icon: MilestoneConfig['icon']; celebrationLevel: string }> = ({ icon, celebrationLevel }) => {
  const iconMap = {
    key: Key,
    documents: FileCheck,
    inspection: Search,
    handover: HandshakeIcon,
    oracle: ShieldCheck,
  };
  const Icon = iconMap[icon];

  return (
    <div className="relative flex items-center justify-center">
      {/* Sparkle particles */}
      {['standard', 'high', 'maximum'].includes(celebrationLevel) && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: [0, Math.cos((i * Math.PI * 2) / 8) * (celebrationLevel === 'maximum' ? 60 : 45)],
                y: [0, Math.sin((i * Math.PI * 2) / 8) * (celebrationLevel === 'maximum' ? 60 : 45)],
              }}
              transition={{
                duration: 1.8,
                delay: 0.3 + i * 0.08,
                repeat: Infinity,
                repeatDelay: 2.5,
              }}
            >
              <Sparkles className={`w-3 h-3 ${i % 2 === 0 ? 'text-[hsl(var(--escrow-amber))]' : 'text-primary'}`} />
            </motion.div>
          ))}
        </>
      )}

      {/* Glow ring */}
      <motion.div
        className="absolute w-24 h-24 rounded-full bg-[hsl(var(--escrow-amber))]/10"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />

      {/* Icon container */}
      <motion.div
        className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-[hsl(var(--escrow-amber))] to-[hsl(38,80%,40%)] flex items-center justify-center shadow-xl shadow-[hsl(var(--escrow-amber))]/30"
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.15 }}
      >
        <Icon className="w-9 h-9 text-white drop-shadow-md" />
      </motion.div>

      {/* Checkmark badge */}
      <motion.div
        className="absolute -bottom-1 -right-1 z-20 w-8 h-8 rounded-full bg-[hsl(var(--escrow-green))] flex items-center justify-center shadow-lg border-2 border-white"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.5 }}
      >
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>
    </div>
  );
};

const ProgressRing: React.FC<{ current: number; total: number; label: string }> = ({ current, total, label }) => {
  const radius = 28;
  const stroke = 4;
  const circumference = 2 * Math.PI * radius;
  const progress = (current / total) * circumference;
  const isComplete = current === total;

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth={stroke} />
          <motion.circle
            cx="32" cy="32" r={radius} fill="none"
            stroke={isComplete ? 'hsl(var(--escrow-green))' : 'hsl(var(--primary))'}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xs font-black ${isComplete ? 'text-[hsl(var(--escrow-green))]' : 'text-primary'}`}>
            {current}/{total}
          </span>
        </div>
      </div>
      <span className="text-[11px] font-bold text-slate-400">{label}</span>
    </div>
  );
};

// Confetti particles for maximum celebration
const ConfettiParticles: React.FC = () => (
  <>
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute pointer-events-none"
        style={{
          left: `${10 + Math.random() * 80}%`,
          top: '-10px',
        }}
        initial={{ y: 0, opacity: 1, rotate: 0 }}
        animate={{
          y: [0, 300 + Math.random() * 200],
          opacity: [1, 1, 0],
          rotate: [0, Math.random() * 720 - 360],
          x: [0, (Math.random() - 0.5) * 100],
        }}
        transition={{
          duration: 2 + Math.random(),
          delay: Math.random() * 0.5,
          ease: 'easeOut',
        }}
      >
        <div
          className="rounded-sm"
          style={{
            width: 6 + Math.random() * 4,
            height: 6 + Math.random() * 4,
            backgroundColor: ['hsl(var(--primary))', 'hsl(var(--escrow-amber))', 'hsl(var(--escrow-green))', '#E8B931', '#8B1A4A'][Math.floor(Math.random() * 5)],
          }}
        />
      </motion.div>
    ))}
  </>
);

interface MilestoneSuccessOverlayProps {
  data: MilestoneData;
  onClose: () => void;
  onCTA: () => void;
}

export const MilestoneSuccessOverlay: React.FC<MilestoneSuccessOverlayProps> = ({ data, onClose, onCTA }) => {
  const config = getMilestoneConfig(data);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (config.celebrationLevel === 'maximum') {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [config.celebrationLevel]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onClose}
        />

        {/* Confetti */}
        {showConfetti && <ConfettiParticles />}

        {/* Modal */}
        <motion.div
          className="relative z-10 bg-white rounded-3xl shadow-2xl w-full max-w-[380px] overflow-hidden"
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>

          {/* Top gradient accent */}
          <div className="h-1.5 bg-gradient-to-r from-primary via-[hsl(var(--escrow-amber))] to-primary" />

          {/* Content */}
          <div className="px-6 pt-8 pb-6 flex flex-col items-center text-center">
            {/* Hero Icon */}
            <div className="mb-6">
              <MilestoneIcon icon={config.icon} celebrationLevel={config.celebrationLevel} />
            </div>

            {/* Headline */}
            <motion.h2
              className="text-2xl font-black text-slate-900 mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {config.headline}
            </motion.h2>

            {/* Impact Summary */}
            <motion.p
              className="text-sm text-slate-600 font-medium leading-relaxed mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {config.impactSummary}
            </motion.p>

            {/* Nudge */}
            <motion.div
              className="w-full p-3.5 bg-primary/5 border border-primary/10 rounded-xl mb-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-xs text-primary/80 font-semibold leading-relaxed">
                {config.nudgeText}
              </p>
            </motion.div>

            {/* Progress Ring */}
            <motion.div
              className="mb-6 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <ProgressRing current={config.stepCurrent} total={config.stepTotal} label={config.stepLabel} />
            </motion.div>

            {/* CTA Button */}
            <motion.button
              onClick={onCTA}
              className="w-full h-12 bg-primary hover:brightness-110 text-primary-foreground rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileTap={{ scale: 0.97 }}
            >
              {config.ctaLabel}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
