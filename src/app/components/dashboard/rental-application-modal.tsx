import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ArrowRight, User, Briefcase, Building2, Heart,
  CheckCircle2, Send, MapPin
} from 'lucide-react';

interface RentalApplicationModalProps {
  propertyTitle: string;
  propertyLocation: string;
  agentName: string;
  onClose: () => void;
  onSubmit: () => void;
}

const maritalOptions = ['Single', 'Married', 'Divorced', 'Widowed', 'Prefer not to say'];

export const RentalApplicationModal: React.FC<RentalApplicationModalProps> = ({
  propertyTitle,
  propertyLocation,
  agentName,
  onClose,
  onSubmit,
}) => {
  const [profession, setProfession] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [workAddress, setWorkAddress] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = profession && companyName && workAddress && maritalStatus;

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      onSubmit();
    }, 3000);
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
        className="relative w-full max-w-lg max-h-[85vh] rounded-3xl shadow-2xl bg-white flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
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
              <h3 className="text-slate-900 font-black text-xl mb-2 text-center">Application Sent!</h3>
              <p className="text-slate-400 text-sm font-medium text-center max-w-xs">
                Agent {agentName} is reviewing your profile. You'll be notified once a deal is initiated.
              </p>
            </motion.div>
          ) : (
            <motion.div key="form" className="flex flex-col max-h-[85vh]">
              {/* Header */}
              <div className="bg-[hsl(var(--navy))] px-6 pt-6 pb-5 shrink-0">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
                <div className="flex items-center gap-2 mb-2">
                  <Send className="w-4 h-4 text-[hsl(var(--escrow-green))]" />
                </div>
                <h1 className="text-white font-black text-xl">Apply to Rent</h1>
                <p className="text-white/40 text-sm font-medium mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {propertyTitle} • {propertyLocation}
                </p>
              </div>

              {/* Form */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
                {/* Auto-filled fields */}
                <div>
                  <label className="text-slate-600 text-[11px] font-bold uppercase tracking-wider mb-2 block">
                    Your Details (Auto-filled)
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <User className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-slate-800 text-sm font-bold">Adaeze Okonkwo</p>
                        <p className="text-slate-400 text-[10px] font-medium">adaeze.okonkwo@email.com • +234 801 234 5678</p>
                      </div>
                      <span className="ml-auto px-2 py-0.5 bg-[hsl(var(--escrow-green))]/10 text-[hsl(var(--escrow-green))] text-[9px] font-bold rounded-full">Verified</span>
                    </div>
                  </div>
                </div>

                {/* Profession */}
                <div>
                  <label className="text-slate-600 text-[11px] font-bold uppercase tracking-wider mb-2 block">
                    Profession *
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                      type="text"
                      value={profession}
                      onChange={e => setProfession(e.target.value)}
                      placeholder="e.g. Software Engineer, Doctor, Banker"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/5"
                    />
                  </div>
                </div>

                {/* Company Name */}
                <div>
                  <label className="text-slate-600 text-[11px] font-bold uppercase tracking-wider mb-2 block">
                    Company / Employer *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      placeholder="e.g. GTBank, Andela, Federal Ministry"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/5"
                    />
                  </div>
                </div>

                {/* Work Address */}
                <div>
                  <label className="text-slate-600 text-[11px] font-bold uppercase tracking-wider mb-2 block">
                    Business / Work Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-300" />
                    <textarea
                      value={workAddress}
                      onChange={e => setWorkAddress(e.target.value)}
                      placeholder="Full address of your workplace"
                      rows={2}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/5 resize-none"
                    />
                  </div>
                </div>

                {/* Marital Status */}
                <div>
                  <label className="text-slate-600 text-[11px] font-bold uppercase tracking-wider mb-2 block">
                    Marital Status *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {maritalOptions.map(opt => (
                      <button
                        key={opt}
                        onClick={() => setMaritalStatus(opt)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
                          maritalStatus === opt
                            ? 'border-[hsl(var(--navy))] bg-[hsl(var(--navy))]/5 text-[hsl(var(--navy))]'
                            : 'border-slate-200 text-slate-500 hover:border-slate-300'
                        }`}
                      >
                        {opt === 'Married' && <Heart className="w-3 h-3 inline mr-1" />}
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className={`w-full h-14 rounded-full font-bold text-sm shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                    canSubmit
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  <Send className="w-5 h-5" />
                  Submit Application
                  {canSubmit && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
