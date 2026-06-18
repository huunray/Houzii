import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Shield, CheckCircle, AlertTriangle,
  X, Lock, Key, Zap, Camera, FileText, Send, ImagePlus, Trash2
} from 'lucide-react';

interface MoveInChecklistProps {
  agentName: string;
  propertyTitle: string;
  amount: string;
  onBack: () => void;
  onReleaseFunds: () => void;
  onDisputeSubmitted: () => void;
}

const checklistItems = [
  { id: 'keys', label: 'Keys Received', icon: Key },
  { id: 'utilities', label: 'Utilities Working', icon: Zap },
  { id: 'condition', label: 'Apartment as Pictured', icon: Camera },
  { id: 'agreement', label: 'Agreement Signed', icon: FileText },
];

const disputeReasons = [
  'False Listing',
  'Condition Issue',
  'Agent Absent',
];

export const MoveInChecklist: React.FC<MoveInChecklistProps> = ({
  agentName,
  propertyTitle,
  amount,
  onBack,
  onReleaseFunds,
  onDisputeSubmitted,
}) => {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [showDispute, setShowDispute] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeDetails, setDisputeDetails] = useState('');
  const [disputeImages, setDisputeImages] = useState<{ file: File; preview: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.slice(0, 5 - disputeImages.length).map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setDisputeImages(prev => [...prev, ...newImages]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setDisputeImages(prev => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const allChecked = checklistItems.every((item) => checked[item.id]);

  const toggleCheck = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDisputeSubmit = () => {
    setShowDispute(false);
    onDisputeSubmitted();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-[hsl(var(--navy))] px-6 pt-8 pb-8 rounded-b-[28px]">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors font-bold text-sm mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-[hsl(var(--escrow-green))]" />
            <span className="text-[10px] font-bold text-[hsl(var(--escrow-green))] uppercase tracking-[0.2em]">
              Move-In Verification
            </span>
          </div>
          <h1 className="text-white font-black text-2xl">Everything Check Out?</h1>
          <p className="text-white/40 text-sm font-medium mt-1">
            {propertyTitle} • {amount} in escrow
          </p>
        </motion.div>
      </div>

      <div className="px-6 py-6 pb-32">
        {/* Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6"
        >
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Move-In Checklist</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Confirm each item before releasing funds
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {checklistItems.map((item, i) => {
              const Icon = item.icon;
              const isChecked = !!checked[item.id];
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  onClick={() => toggleCheck(item.id)}
                  className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors text-left"
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                      isChecked
                        ? 'bg-[hsl(var(--escrow-green))] shadow-md shadow-[hsl(var(--escrow-green))]/20'
                        : 'bg-slate-100 border-2 border-slate-200'
                    }`}
                  >
                    {isChecked ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <Icon className="w-4 h-4 text-slate-300" />
                    )}
                  </div>
                  <span
                    className={`text-sm font-bold flex-1 transition-colors ${
                      isChecked ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    {item.label}
                  </span>
                  {isChecked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-[10px] font-bold text-[hsl(var(--escrow-green))] bg-[hsl(var(--escrow-green-muted))] px-2 py-1 rounded-full"
                    >
                      Verified
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-400">Verification Progress</span>
            <span className="text-xs font-black text-slate-900">
              {Object.values(checked).filter(Boolean).length}/{checklistItems.length}
            </span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[hsl(var(--escrow-green))] rounded-full"
              animate={{
                width: `${(Object.values(checked).filter(Boolean).length / checklistItems.length) * 100}%`,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>
        </motion.div>

        {/* Release Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <button
            onClick={onReleaseFunds}
            disabled={!allChecked}
            className={`w-full h-14 rounded-full font-bold text-sm shadow-lg transition-all active:scale-[0.98] active:bg-primary flex items-center justify-center gap-2 ${
              allChecked
                ? 'bg-[hsl(var(--escrow-green))] text-white shadow-[hsl(var(--escrow-green))]/25 hover:brightness-110'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <Lock className="w-5 h-5" />
            Release Funds to Agent
          </button>
        </motion.div>

        {/* Dispute Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-5"
        >
          <button
            onClick={() => setShowDispute(true)}
            className="text-[hsl(var(--escrow-red))] text-xs font-bold hover:underline inline-flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Raise a Dispute
          </button>
        </motion.div>
      </div>

      {/* Dispute Modal */}
      <AnimatePresence>
        {showDispute && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full bg-white rounded-t-[28px] max-h-[85vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* Handle */}
                <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-6" />

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">Raise a Dispute</h2>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      Escrow will be frozen immediately
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDispute(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                </div>

                {/* Freeze Warning */}
                <div className="bg-[hsl(var(--escrow-red))]/5 border border-[hsl(var(--escrow-red))]/15 rounded-2xl p-4 flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[hsl(var(--escrow-red))]/10 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-[hsl(var(--escrow-red))]" />
                  </div>
                  <p className="text-[12px] font-bold text-[hsl(var(--escrow-red))] leading-snug">
                    Filing a dispute will freeze {amount} in escrow and alert the Houzii Support team.
                  </p>
                </div>

                {/* Reason Selection */}
                <div className="mb-5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Select Reason
                  </h3>
                  <div className="space-y-2">
                    {disputeReasons.map((reason) => (
                      <button
                        key={reason}
                        onClick={() => setDisputeReason(reason)}
                        className={`w-full p-4 rounded-xl text-left text-sm font-bold transition-all border-2 ${
                          disputeReason === reason
                            ? 'border-[hsl(var(--escrow-red))] bg-[hsl(var(--escrow-red))]/5 text-[hsl(var(--escrow-red))]'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {reason}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Additional Details
                  </h3>
                  <textarea
                    value={disputeDetails}
                    onChange={(e) => setDisputeDetails(e.target.value)}
                    placeholder="Describe the issue in detail..."
                    className="w-full h-28 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-[hsl(var(--escrow-red))]/30 focus:border-[hsl(var(--escrow-red))]"
                  />
                </div>

                {/* Image Evidence Upload */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Photo Evidence (Optional)
                  </h3>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  {disputeImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {disputeImages.map((img, i) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                          <img src={img.preview} alt={`Evidence ${i + 1}`} className="w-full h-full object-cover" />
                          <button
                            onClick={() => removeImage(i)}
                            className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {disputeImages.length < 5 && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center gap-1.5 hover:border-slate-300 hover:bg-slate-50 transition-all"
                    >
                      <ImagePlus className="w-5 h-5 text-slate-400" />
                      <span className="text-xs font-bold text-slate-400">
                        Upload Photos ({disputeImages.length}/5)
                      </span>
                    </button>
                  )}
                </div>

                {/* Submit */}
                <button
                  onClick={handleDisputeSubmit}
                  disabled={!disputeReason}
                  className={`w-full h-14 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    disputeReason
                      ? 'bg-[hsl(var(--escrow-red))] text-white hover:brightness-110 active:scale-[0.98] active:bg-primary'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  Freeze Escrow & Submit Dispute
                </button>

                <p className="text-center text-[11px] font-medium text-slate-400 mt-3 pb-4">
                  Houzii Human Oracle team will review within 24 hours
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
