import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield, ShieldCheck, ChevronDown, Mail, UserCheck,
  Lock, ArrowRight, X, Upload, CircleAlert,
  CheckCircle2, Sparkles, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { useSeekerTrust } from './seeker-trust-context';

// ─── Email Verification Modal ───────────────────────────────────────────────

const EmailVerificationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
}> = ({ isOpen, onClose, onVerified }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [verified, setVerified] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setOtp(['', '', '', '', '', '']);
      setIsVerifying(false);
      setResendTimer(60);
      setVerified(false);
      return;
    }
    otpRefs.current[0]?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [isOpen, resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    pasted.split('').forEach((ch, i) => { newOtp[i] = ch; });
    setOtp(newOtp);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = () => {
    if (otp.join('').length < 6) return;
    setIsVerifying(true);
    setTimeout(() => { setIsVerifying(false); setVerified(true); setTimeout(() => onVerified(), 1200); }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl"
          >
            <button onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-4 h-4" />
            </button>
            <div className="p-7">
              <AnimatePresence mode="wait">
                {!verified ? (
                  <motion.div key="otp-form" exit={{ opacity: 0, scale: 0.95 }}>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                      className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-5">
                      <Mail className="w-8 h-8 text-blue-500" />
                    </motion.div>
                    <h2 className="text-slate-900 font-black text-2xl mb-2 text-center">Verify Your Email</h2>
                    <p className="text-slate-400 font-medium text-center text-sm mb-1">We sent a 6-digit code to</p>
                    <p className="text-slate-800 font-black text-center text-sm mb-7">your registered email</p>
                    <div className="flex justify-center gap-3 mb-6">
                      {otp.map((digit, i) => (
                        <motion.input key={i} ref={el => { otpRefs.current[i] = el; }}
                          type="text" inputMode="numeric" maxLength={1} value={digit}
                          onChange={e => handleOtpChange(i, e.target.value)}
                          onKeyDown={e => handleOtpKeyDown(i, e)}
                          onPaste={i === 0 ? handleOtpPaste : undefined}
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + i * 0.04 }}
                          className={`w-12 h-12 text-center text-lg font-black rounded-xl border-2 bg-slate-50 outline-none transition-all ${
                            digit ? 'border-primary text-slate-900 bg-primary/5' : 'border-slate-200 text-slate-400'
                          } focus:border-primary focus:ring-2 focus:ring-primary/10`}
                        />
                      ))}
                    </div>
                    <button onClick={handleVerify} disabled={otp.join('').length < 6 || isVerifying}
                      className="w-full py-4 rounded-full text-white font-black text-base shadow-lg transition-all active:scale-[0.98] hover:brightness-110 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: '#6D1D2C', boxShadow: '0 8px 24px rgba(109, 29, 44, 0.3)' }}>
                      {isVerifying ? <><RefreshCw className="w-5 h-5 animate-spin" /> Verifying...</> : <>Verify Email <ArrowRight className="w-5 h-5" /></>}
                    </button>
                    <div className="mt-5 text-center">
                      {resendTimer > 0 ? (
                        <p className="text-slate-400 text-sm">Resend in <span className="font-black" style={{ color: '#6D1D2C' }}>{resendTimer}s</span></p>
                      ) : (
                        <button onClick={() => { setResendTimer(60); setOtp(['', '', '', '', '', '']); otpRefs.current[0]?.focus(); }}
                          className="text-sm font-bold hover:underline" style={{ color: '#6D1D2C' }}>Resend code</button>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 250, damping: 20 }} className="py-8 text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-5">
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </motion.div>
                    <h2 className="text-slate-900 font-black text-2xl mb-2">Email Verified!</h2>
                    <p className="text-slate-400 font-medium text-sm">Your trust score has been updated to Tier 1.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── Identity Verification Modal ────────────────────────────────────────────

const ID_OPTIONS = [
  { value: 'nin_card', label: 'National ID Card (NIN)' },
  { value: 'passport', label: 'International Passport' },
  { value: 'drivers', label: "Driver's Licence" },
  { value: 'voters', label: "Voter's Card" },
  { value: 'cac', label: 'CAC ID Card' },
];

type IdentityStep = 'nin' | 'upload' | 'processing' | 'success';

const UploadBox: React.FC<{
  side: 'Front' | 'Back';
  uploaded: boolean;
  disabled: boolean;
  onUpload: () => void;
}> = ({ side, uploaded, disabled, onUpload }) => {
  const [drag, setDrag] = useState(false);
  return (
    <div className="flex-1 min-w-0">
      <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1.5">{side}</p>
      {uploaded ? (
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="h-[88px] bg-green-50 border-2 border-green-200 rounded-2xl flex flex-col items-center justify-center gap-1">
          <CheckCircle2 className="w-6 h-6 text-green-500" />
          <p className="text-green-600 text-[11px] font-black">Uploaded ✓</p>
        </motion.div>
      ) : (
        <div
          onDragOver={e => { if (!disabled) { e.preventDefault(); setDrag(true); } }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); if (!disabled) onUpload(); }}
          onClick={() => { if (!disabled) onUpload(); }}
          className={`h-[88px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
            disabled
              ? 'border-slate-100 bg-slate-50 cursor-not-allowed opacity-40'
              : drag
              ? 'border-primary bg-primary/5 cursor-pointer'
              : 'border-slate-200 hover:border-primary/50 hover:bg-slate-50 cursor-pointer'
          }`}
        >
          <Upload className={`w-5 h-5 ${drag ? 'text-primary' : disabled ? 'text-slate-200' : 'text-slate-300'}`} />
          <p className={`text-[11px] font-bold text-center leading-snug ${disabled ? 'text-slate-300' : 'text-slate-400'}`}>
            {drag ? 'Drop here' : `Tap to upload ${side.toLowerCase()}`}
          </p>
        </div>
      )}
    </div>
  );
};

const IdentityVerificationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
}> = ({ isOpen, onClose, onVerified }) => {
  const [step, setStep] = useState<IdentityStep>('nin');
  const [nin, setNin] = useState('');
  const [idType, setIdType] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [frontUploaded, setFrontUploaded] = useState(false);
  const [backUploaded, setBackUploaded] = useState(false);

  useEffect(() => {
    if (!isOpen) { setStep('nin'); setNin(''); setIdType(''); setDropdownOpen(false); setFrontUploaded(false); setBackUploaded(false); }
  }, [isOpen]);

  const handleSubmit = () => {
    setStep('processing');
    setTimeout(() => { setStep('success'); setTimeout(() => onVerified(), 1200); }, 2000);
  };

  const selectedLabel = ID_OPTIONS.find(o => o.value === idType)?.label || '';
  const canSubmit = !!idType && frontUploaded && backUploaded;
  const stepIndex = step === 'nin' ? 0 : 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl flex flex-col"
            style={{ maxHeight: 'min(92vh, 680px)' }}
          >
            <button onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-4 h-4" />
            </button>

            {/* Step pill indicator */}
            {(step === 'nin' || step === 'upload') && (
              <div className="px-7 pt-6 pb-0 shrink-0">
                <div className="flex items-center gap-3 mb-5 pr-10">
                  {['NIN', 'Upload ID'].map((label, i) => (
                    <React.Fragment key={label}>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                          i < stepIndex ? 'bg-green-500 text-white' : i === stepIndex ? 'text-white' : 'bg-slate-100 text-slate-300'
                        }`} style={i === stepIndex ? { background: '#6D1D2C' } : undefined}>
                          {i < stepIndex ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                        </div>
                        <span className={`text-xs font-bold ${i <= stepIndex ? 'text-slate-700' : 'text-slate-300'}`}>{label}</span>
                      </div>
                      {i === 0 && <div className={`flex-1 h-0.5 rounded ${i < stepIndex ? 'bg-green-500' : 'bg-slate-100'}`} />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {/* Scrollable body */}
            <div className="px-7 pb-7 overflow-y-auto flex-1">
              <AnimatePresence mode="wait">

                {/* ── Step 1: NIN ── */}
                {step === 'nin' && (
                  <motion.div key="nin" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="text-slate-900 font-black text-xl mb-1">Enter Your NIN</h2>
                    <p className="text-slate-400 text-sm font-medium mb-5">Your National Identification Number is required to confirm your identity.</p>

                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">NIN</label>
                    <input type="text" inputMode="numeric" maxLength={11} value={nin}
                      onChange={e => setNin(e.target.value.replace(/\D/g, ''))}
                      placeholder="11-digit NIN e.g. 12345678901"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-bold placeholder:text-slate-300 placeholder:font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 mb-2 tracking-widest"
                    />
                    <p className="text-slate-400 text-xs font-medium mb-5">
                      Find your NIN on your NIN slip or dial <span className="font-black text-slate-600">*346#</span> on your registered phone.
                    </p>

                    <div className="flex items-start gap-2.5 p-3.5 bg-blue-50 border border-blue-100 rounded-xl mb-6">
                      <Shield className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-blue-600 text-xs font-medium leading-relaxed">
                        Your NIN is encrypted end-to-end and only used for identity verification. We never store it in plain text.
                      </p>
                    </div>

                    <button onClick={() => setStep('upload')} disabled={nin.length < 11}
                      className="w-full py-4 rounded-full text-white font-black text-base shadow-lg transition-all active:scale-[0.98] hover:brightness-110 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: '#6D1D2C', boxShadow: '0 8px 24px rgba(109, 29, 44, 0.3)' }}>
                      Continue <ArrowRight className="w-5 h-5" />
                    </button>
                  </motion.div>
                )}

                {/* ── Step 2: ID type + front/back upload (all visible at once) ── */}
                {step === 'upload' && (
                  <motion.div key="upload" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="text-slate-900 font-black text-xl mb-1">Upload Your ID</h2>
                    <p className="text-slate-400 text-sm font-medium mb-5">Choose your ID type, then upload both sides.</p>

                    {/* Dropdown — always visible */}
                    <div className="relative mb-5">
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Government ID Type</label>
                      <button
                        onClick={() => setDropdownOpen(v => !v)}
                        className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl border text-left transition-all ${
                          idType ? 'border-primary bg-primary/5' : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <span className={`text-sm font-bold ${idType ? 'text-primary' : 'text-slate-400'}`}>
                          {selectedLabel || 'Select your government ID…'}
                        </span>
                        <motion.span animate={{ rotate: dropdownOpen ? 180 : 0 }} transition={{ duration: 0.18 }}>
                          <ChevronDown className={`w-4 h-4 ${idType ? 'text-primary' : 'text-slate-300'}`} />
                        </motion.span>
                      </button>

                      <AnimatePresence>
                        {dropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            className="absolute z-20 top-full mt-1.5 w-full bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden"
                          >
                            {ID_OPTIONS.map((opt, i) => (
                              <button key={opt.value}
                                onClick={() => { setIdType(opt.value); setDropdownOpen(false); setFrontUploaded(false); setBackUploaded(false); }}
                                className={`w-full flex items-center justify-between px-5 py-3.5 text-left transition-colors hover:bg-slate-50 ${
                                  i < ID_OPTIONS.length - 1 ? 'border-b border-slate-50' : ''
                                }`}
                              >
                                <span className={`text-sm font-bold ${idType === opt.value ? 'text-primary' : 'text-slate-700'}`}>{opt.label}</span>
                                {idType === opt.value && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Upload zones — always visible, disabled until ID type chosen */}
                    <div className="mb-1">
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
                        {idType ? `Upload ${selectedLabel}` : 'Upload ID Card'}
                      </label>
                      {!idType && (
                        <p className="text-[11px] text-slate-400 font-medium mb-2">
                          Select an ID type above to enable the upload areas.
                        </p>
                      )}
                      <div className="flex gap-3 mb-4">
                        <UploadBox side="Front" uploaded={frontUploaded} disabled={!idType} onUpload={() => setFrontUploaded(true)} />
                        <UploadBox side="Back" uploaded={backUploaded} disabled={!idType} onUpload={() => setBackUploaded(true)} />
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-100 rounded-xl mb-5">
                      <CircleAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-amber-700 text-xs font-medium leading-relaxed">
                        All four corners must be visible, text clearly readable, no glare or shadow.
                      </p>
                    </div>

                    <button onClick={handleSubmit} disabled={!canSubmit}
                      className="w-full py-4 rounded-full text-white font-black text-base shadow-lg transition-all active:scale-[0.98] hover:brightness-110 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ background: '#6D1D2C', boxShadow: canSubmit ? '0 8px 24px rgba(109, 29, 44, 0.3)' : 'none' }}>
                      Submit for Verification <ArrowRight className="w-5 h-5" />
                    </button>
                  </motion.div>
                )}

                {/* Processing */}
                {step === 'processing' && (
                  <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-14 text-center">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                      className="w-16 h-16 rounded-full border-4 border-slate-100 mx-auto mb-5"
                      style={{ borderTopColor: '#6D1D2C' }} />
                    <h2 className="text-slate-900 font-black text-xl mb-2">Submitting Documents…</h2>
                    <p className="text-slate-400 text-sm font-medium">Uploading your ID for review. This takes a moment.</p>
                  </motion.div>
                )}

                {/* Success */}
                {step === 'success' && (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring' }} className="py-10 text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-5">
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </motion.div>
                    <h2 className="text-slate-900 font-black text-2xl mb-2">Documents Submitted!</h2>
                    <p className="text-slate-400 font-medium text-sm">Your ID is under review. You'll be Tier 2 verified shortly.</p>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                      className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
                      <Sparkles className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 text-xs font-black">Identity Verified — Tier 2</span>
                    </motion.div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── Main Card ───────────────────────────────────────────────────────────────

export const SeekerTrustTracker: React.FC = () => {
  const { trust, verifyEmail, verifyIdentity, completedCount, tierLabel } = useSeekerTrust();
  const [expanded, setExpanded] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showIdentityModal, setShowIdentityModal] = useState(false);

  const totalCount = 2;
  const progressPercent = Math.round((completedCount / totalCount) * 100);
  const remaining = totalCount - completedCount;
  const allDone = completedCount === totalCount;

  if (allDone) return null;

  const checklist = [
    {
      id: 'email',
      label: 'Verify Email',
      description: 'Confirms your email — unlocks Tier 1 and deal notifications.',
      completed: trust.emailVerified,
      locked: false,
      icon: Mail,
      buttonLabel: 'Verify Now',
      action: () => setShowEmailModal(true),
    },
    {
      id: 'identity',
      label: 'Verify Identity',
      description: 'Upload a government ID — unlocks Tier 2 and secure transactions.',
      completed: trust.identityVerified,
      locked: !trust.emailVerified,
      icon: UserCheck,
      buttonLabel: 'Upload ID',
      action: () => setShowIdentityModal(true),
    },
  ];

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="mx-6 mt-6 rounded-2xl overflow-hidden" style={{ background: '#0A1128' }}>

        {/* Collapsed header */}
        <button onClick={() => setExpanded(!expanded)} className="w-full px-5 py-4 cursor-pointer text-left">
          <div className="flex items-start gap-3">
            <div className="relative shrink-0">
              <div className="absolute inset-0 rounded-2xl bg-amber-400/20 blur-md" />
              <div className="relative w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #F59E0B22, #FFB02033)', border: '1px solid #F59E0B44' }}>
                <Shield className="w-4 h-4 text-amber-400" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <p className="text-white font-black text-sm leading-snug">
                  Complete {remaining} more task{remaining > 1 ? 's' : ''} to unlock
                </p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide shrink-0"
                  style={{ background: '#FFB02022', border: '1px solid #FFB02055', color: '#FFB020' }}>
                  ✦ VERIFIED
                </span>
              </div>

              <p className="text-white/40 text-[10px] font-medium mb-2">
                Trust Score: <span className="text-white/55 font-bold">{tierLabel}</span>
              </p>

              <div className="space-y-1">
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #F59E0B, #FFB020)' }} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white/35">{completedCount} of {totalCount} tasks</span>
                  <span className="text-[10px] font-black" style={{ color: '#FFB020' }}>{progressPercent}%</span>
                </div>
              </div>
            </div>

            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-white/30 shrink-0">
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </div>
        </button>

        {/* Expanded checklist */}
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
              <div className="px-5 pb-5 space-y-3">
                <div className="h-px bg-white/10 mb-1" />
                {checklist.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div key={item.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.08 }}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                        item.completed ? 'bg-green-500/10 border border-green-500/20'
                          : item.locked ? 'bg-white/[0.03] border border-white/[0.06] opacity-50'
                          : 'bg-white/[0.06] border border-white/10'
                      }`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        item.completed ? 'bg-green-500/20' : item.locked ? 'bg-white/5' : 'bg-white/10'
                      }`}>
                        {item.completed ? <ShieldCheck className="w-5 h-5 text-green-400" />
                          : item.locked ? <Lock className="w-5 h-5 text-white/30" />
                          : <Icon className="w-5 h-5 text-white/60" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-black ${item.completed ? 'text-green-400' : 'text-white'}`}>
                          {item.label}
                          {item.completed && <span className="ml-2 text-[10px] font-bold text-green-400/70 uppercase">Done</span>}
                        </p>
                        <p className={`text-xs mt-0.5 ${item.completed ? 'text-green-400/50' : 'text-white/40'}`}>
                          {item.description}
                        </p>
                      </div>
                      {!item.completed && !item.locked && (
                        <button onClick={e => { e.stopPropagation(); item.action(); }}
                          className="px-4 py-2 rounded-full text-white text-xs font-black shrink-0 transition-all hover:brightness-110 active:scale-95"
                          style={{ background: '#6D1D2C' }}>
                          {item.buttonLabel}
                        </button>
                      )}
                      {item.locked && <span className="text-white/20 text-[10px] font-black uppercase tracking-wider shrink-0">Locked</span>}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <EmailVerificationModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onVerified={() => {
          setShowEmailModal(false);
          verifyEmail();
          toast.success('Email verified — Tier 1 unlocked!', {
            description: 'You can now receive deal notifications and documents.',
            icon: <ShieldCheck className="w-5 h-5 text-green-500" />,
          });
        }}
      />

      <IdentityVerificationModal
        isOpen={showIdentityModal}
        onClose={() => setShowIdentityModal(false)}
        onVerified={() => {
          setShowIdentityModal(false);
          verifyIdentity();
          toast.success('Identity submitted — Tier 2 unlocked!', {
            description: 'Your ID is under review. Full access granted shortly.',
            icon: <ShieldCheck className="w-5 h-5 text-green-500" />,
          });
        }}
      />
    </>
  );
};
