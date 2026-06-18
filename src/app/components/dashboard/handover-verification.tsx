import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Calendar, Lightbulb, CheckSquare, ArrowRight,
  Key, Camera, Droplets, Plug, Shield, AlertTriangle,
  Upload, CheckCircle2, Clock
} from 'lucide-react';

interface HandoverVerificationProps {
  propertyTitle: string;
  agentName: string;
  amount: string;
  onClose: () => void;
  onReleaseFunds: () => void;
  onDispute: () => void;
}

const hintItems = [
  { icon: Droplets, text: 'Test all plumbing — taps, showers, toilets' },
  { icon: Plug, text: 'Check every electrical socket and switch' },
  { icon: Camera, text: 'Take photos of wall condition on move-in' },
  { icon: CheckSquare, text: 'Ensure all "Property Promises" from the listing are met' },
];

interface CheckItem {
  id: string;
  label: string;
  checked: boolean;
}

export const HandoverVerification: React.FC<HandoverVerificationProps> = ({
  propertyTitle,
  agentName,
  amount,
  onClose,
  onReleaseFunds,
  onDispute,
}) => {
  const [step, setStep] = useState<'schedule' | 'checklist' | 'dispute'>('checklist');
  const [checkItems, setCheckItems] = useState<CheckItem[]>([
    { id: 'keys', label: 'Received physical keys / meter cards', checked: false },
    { id: 'amenities', label: 'Amenities match the agreement', checked: false },
    { id: 'condition', label: 'Apartment is in the promised condition', checked: false },
  ]);
  const [slideProgress, setSlideProgress] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [released, setReleased] = useState(false);
  const [disputeText, setDisputeText] = useState('');
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);

  const allChecked = checkItems.every(c => c.checked);

  const toggleCheck = (id: string) => {
    setCheckItems(prev => prev.map(c => c.id === id ? { ...c, checked: !c.checked } : c));
  };

  const handleSlideStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (!allChecked) return;
    setIsSliding(true);
  };

  const handleSlideMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isSliding) return;
    const target = (e.currentTarget as HTMLElement).parentElement!;
    const rect = target.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const progress = Math.min(Math.max((clientX - rect.left - 28) / (rect.width - 56), 0), 1);
    setSlideProgress(progress);

    if (progress >= 0.95) {
      setIsSliding(false);
      setReleased(true);
      setTimeout(onReleaseFunds, 2000);
    }
  };

  const handleSlideEnd = () => {
    if (!released) {
      setIsSliding(false);
      setSlideProgress(0);
    }
  };

  const handleDisputeSubmit = () => {
    setDisputeSubmitted(true);
    setTimeout(onClose, 2500);
  };

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
        className="relative w-full max-w-lg max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl bg-white flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          {released ? (
            <motion.div
              key="released"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-16 px-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                className="w-20 h-20 rounded-full bg-[hsl(var(--escrow-green))]/10 flex items-center justify-center mb-5"
              >
                <CheckCircle2 className="w-10 h-10 text-[hsl(var(--escrow-green))]" />
              </motion.div>
              <h3 className="text-slate-900 font-black text-xl mb-2 text-center">Funds Released! 🎉</h3>
              <p className="text-slate-400 text-sm font-medium text-center max-w-xs">
                {amount} has been released to Agent {agentName}. Welcome to your new home!
              </p>
            </motion.div>
          ) : disputeSubmitted ? (
            <motion.div
              key="dispute-done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-16 px-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-5"
              >
                <Shield className="w-10 h-10 text-amber-500" />
              </motion.div>
              <h3 className="text-slate-900 font-black text-xl mb-2 text-center">Dispute Filed</h3>
              <p className="text-slate-400 text-sm font-medium text-center max-w-xs">
                Escrowed funds are now frozen. Houzii Support will contact both parties within 24 hours.
              </p>
            </motion.div>
          ) : step === 'dispute' ? (
            <motion.div key="dispute" className="flex flex-col h-full">
              <div className="bg-[hsl(var(--escrow-red))] px-6 pt-6 pb-5 shrink-0">
                <button
                  onClick={() => setStep('checklist')}
                  className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-white/60" />
                </div>
                <h1 className="text-white font-black text-xl">Raise a Dispute</h1>
                <p className="text-white/50 text-sm font-medium mt-1">{propertyTitle}</p>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
                <div>
                  <label className="text-slate-600 text-[11px] font-bold uppercase tracking-wider mb-2 block">
                    Describe the Issue
                  </label>
                  <textarea
                    value={disputeText}
                    onChange={e => setDisputeText(e.target.value)}
                    placeholder="Explain what doesn't match the agreement or listing..."
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/5 resize-none"
                  />
                </div>

                <div>
                  <label className="text-slate-600 text-[11px] font-bold uppercase tracking-wider mb-2 block">
                    Upload Evidence (Photos)
                  </label>
                  <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl text-center">
                    <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm font-medium">Tap to upload photos of issues</p>
                    <button className="mt-3 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:border-slate-300 transition-all">
                      Choose Files
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-amber-700 text-xs font-medium">
                    Filing a dispute will freeze the escrowed {amount}. Houzii Support will mediate between you and Agent {agentName}.
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-3 border-t border-slate-100 shrink-0">
                <button
                  onClick={handleDisputeSubmit}
                  disabled={!disputeText}
                  className={`w-full h-14 rounded-full font-bold text-sm shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                    disputeText
                      ? 'bg-[hsl(var(--escrow-red))] text-white hover:bg-[hsl(var(--escrow-red))]/90'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  <AlertTriangle className="w-5 h-5" />
                  Submit Dispute
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="checklist" className="flex flex-col h-full">
              {/* Header */}
              <div className="bg-[hsl(var(--navy))] px-6 pt-6 pb-5 shrink-0">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
                <div className="flex items-center gap-2 mb-2">
                  <Key className="w-4 h-4 text-[hsl(var(--escrow-green))]" />
                </div>
                <h1 className="text-white font-black text-xl">Handover Verification</h1>
                <p className="text-white/40 text-sm font-medium mt-1">{propertyTitle} • Agent {agentName}</p>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                {/* Hint Box */}
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-4 h-4 text-blue-500" />
                    <h4 className="text-blue-800 text-xs font-black">What to Check</h4>
                  </div>
                  <div className="space-y-2">
                    {hintItems.map((hint, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <hint.icon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <p className="text-blue-700 text-xs font-medium">{hint.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Checklist */}
                <div>
                  <label className="text-slate-600 text-[11px] font-bold uppercase tracking-wider mb-3 block">
                    Handover Checklist
                  </label>
                  <div className="space-y-3">
                    {checkItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                          item.checked
                            ? 'border-[hsl(var(--escrow-green))] bg-[hsl(var(--escrow-green))]/5'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                          item.checked
                            ? 'bg-[hsl(var(--escrow-green))] border-[hsl(var(--escrow-green))]'
                            : 'border-slate-300'
                        }`}>
                          {item.checked && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </div>
                        <span className={`text-sm font-bold ${item.checked ? 'text-slate-800' : 'text-slate-500'}`}>
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount */}
                <div className="p-4 bg-primary/5 border border-primary/15 rounded-xl text-center">
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Escrowed Amount</p>
                  <p className="text-slate-900 font-black text-2xl">{amount}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 pb-6 pt-3 border-t border-slate-100 shrink-0 space-y-3">
                {/* Slide to Release */}
                <div className={`relative h-14 rounded-full overflow-hidden ${
                  allChecked ? 'bg-[hsl(var(--escrow-green))]/10' : 'bg-slate-100'
                }`}>
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: allChecked
                        ? `linear-gradient(90deg, hsl(var(--escrow-green)) ${slideProgress * 100}%, transparent ${slideProgress * 100}%)`
                        : undefined,
                    }}
                  />
                  <div
                    className={`absolute top-1 bottom-1 left-1 w-12 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform ${
                      allChecked ? 'bg-[hsl(var(--escrow-green))] text-white shadow-lg' : 'bg-slate-300 text-white'
                    }`}
                    style={{ transform: `translateX(${slideProgress * (typeof window !== 'undefined' ? Math.min(window.innerWidth - 120, 400) : 300)}px)` }}
                    onMouseDown={handleSlideStart}
                    onMouseMove={handleSlideMove}
                    onMouseUp={handleSlideEnd}
                    onMouseLeave={handleSlideEnd}
                    onTouchStart={handleSlideStart}
                    onTouchMove={handleSlideMove}
                    onTouchEnd={handleSlideEnd}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </div>
                  <p className={`absolute inset-0 flex items-center justify-center text-sm font-bold pointer-events-none ${
                    allChecked ? 'text-[hsl(var(--escrow-green))]' : 'text-slate-400'
                  }`}>
                    {allChecked ? 'Slide to Approve & Release Funds' : 'Complete checklist first'}
                  </p>
                </div>

                {/* Dispute Button */}
                <button
                  onClick={() => setStep('dispute')}
                  className="w-full h-11 border-2 border-[hsl(var(--escrow-red))]/30 text-[hsl(var(--escrow-red))] rounded-full font-bold text-xs transition-all hover:bg-[hsl(var(--escrow-red))]/5 flex items-center justify-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Raise a Dispute
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
