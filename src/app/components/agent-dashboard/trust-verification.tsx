import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield, ShieldCheck, ChevronDown, Mail, UserCheck, Landmark,
  Lock, ArrowRight, X, Camera, FileText, Upload, CircleAlert, Clock,
  CheckCircle2, Sparkles, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { useTrust } from './trust-context';

// ═══════════════════════════════════════════════════════
// Screen A: Trust Tracker — Expandable Dashboard Card
// ═══════════════════════════════════════════════════════

export const TrustTracker: React.FC = () => {
  const { trust, progressPercent, tierLabel, completedCount, verifyEmail, verifyIdentity, clearFinancial } = useTrust();
  const [expanded, setExpanded] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [showFinancialSheet, setShowFinancialSheet] = useState(false);

  const remaining = 3 - completedCount;
  const nextTier = trust.tier === 1 ? 'Pro' : trust.tier === 2 ? 'Verified' : 'Verified';

  const checklist = [
    {
      id: 'email',
      label: 'Verify Email',
      description: 'To receive legal documents and secure your deals.',
      completed: trust.emailVerified,
      locked: false,
      icon: Mail,
      buttonLabel: 'Verify Now',
      action: () => setShowEmailModal(true),
    },
    {
      id: 'identity',
      label: 'Professional Status',
      description: 'Required to list properties.',
      completed: trust.identityVerified,
      locked: !trust.emailVerified,
      icon: UserCheck,
      buttonLabel: 'Start Verification',
      action: () => setShowIdentityModal(true),
    },
    {
      id: 'financial',
      label: 'Financial Clearance',
      description: 'Required to withdraw funds.',
      completed: trust.financialCleared,
      locked: !trust.identityVerified,
      icon: Landmark,
      buttonLabel: 'Upload Documents',
      action: () => setShowFinancialSheet(true),
    },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mx-6 mt-6 rounded-2xl overflow-hidden"
        style={{ background: '#0A1128' }}
      >
        {/* Collapsed bar */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-5 py-4 cursor-pointer text-left"
        >
          <div className="flex items-start gap-3">
            {/* Shield icon — elevated with amber glow, top-aligned */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 rounded-2xl bg-amber-400/20 blur-md" />
              <div className="relative w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #F59E0B22, #FFB02033)', border: '1px solid #F59E0B44' }}>
                {completedCount === 3 ? (
                  <ShieldCheck className="w-4 h-4 text-green-400" />
                ) : (
                  <Shield className="w-4 h-4 text-amber-400" />
                )}
              </div>
            </div>

            {/* Text + progress */}
            <div className="flex-1 min-w-0">
              {/* Primary headline with badge inline */}
              {completedCount === 3 ? (
                <p className="text-white font-black text-sm leading-snug mb-0.5">
                  You are fully <span className="text-green-400">Verified</span> 🎉
                </p>
              ) : (
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <p className="text-white font-black text-sm leading-snug">
                    Complete {remaining} more task{remaining > 1 ? 's' : ''} to unlock
                  </p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide shrink-0"
                    style={{ background: '#FFB02022', border: '1px solid #FFB02055', color: '#FFB020' }}>
                    ✦ VERIFIED
                  </span>
                </div>
              )}

              {/* Secondary label */}
              <p className="text-white/40 text-[10px] font-medium mb-2">
                Trust Score: <span className="text-white/55 font-bold">{tierLabel}</span>
              </p>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: completedCount === 3 ? '#22c55e' : 'linear-gradient(90deg, #F59E0B, #FFB020)' }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white/35">{completedCount} of 3 tasks</span>
                  <span className="text-[10px] font-black" style={{ color: completedCount === 3 ? '#22c55e' : '#FFB020' }}>
                    {progressPercent}%
                  </span>
                </div>
              </div>
            </div>

            {/* Chevron */}
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-white/30 shrink-0"
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </div>
        </button>

        {/* Expanded checklist */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 space-y-3">
                <div className="h-px bg-white/10 mb-1" />
                {checklist.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.08 }}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                        item.completed
                          ? 'bg-green-500/10 border border-green-500/20'
                          : item.locked
                          ? 'bg-white/[0.03] border border-white/[0.06] opacity-50'
                          : 'bg-white/[0.06] border border-white/10'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        item.completed
                          ? 'bg-green-500/20'
                          : item.locked
                          ? 'bg-white/5'
                          : 'bg-white/10'
                      }`}>
                        {item.completed ? (
                          <ShieldCheck className="w-5 h-5 text-green-400" />
                        ) : item.locked ? (
                          <Lock className="w-5 h-5 text-white/30" />
                        ) : (
                          <Icon className="w-5 h-5 text-white/60" />
                        )}
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
                        <button
                          onClick={(e) => { e.stopPropagation(); item.action(); }}
                          className="px-4 py-2 rounded-full text-white text-xs font-black shrink-0 transition-all hover:brightness-110 active:scale-95"
                          style={{ background: '#6D1D2C' }}
                        >
                          {item.buttonLabel}
                        </button>
                      )}
                      {item.locked && (
                        <span className="text-white/20 text-[10px] font-black uppercase tracking-wider shrink-0">Locked</span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Email Verification Modal */}
      <EmailVerificationModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onVerified={() => {
          setShowEmailModal(false);
          verifyEmail();
          toast.success('Email verified successfully!', {
            description: 'You can now receive legal documents and deal notifications.',
            icon: <ShieldCheck className="w-5 h-5 text-green-500" />,
          });
        }}
      />

      {/* Identity Verification Modal (Tier 2) */}
      <IdentityVerificationModal
        isOpen={showIdentityModal}
        onClose={() => setShowIdentityModal(false)}
        onVerified={() => {
          setShowIdentityModal(false);
          verifyIdentity();
          toast.success('Identity verified — Pro status unlocked!', {
            description: 'You can now list properties on the marketplace.',
            icon: <ShieldCheck className="w-5 h-5 text-green-500" />,
          });
        }}
      />

      {/* Financial Clearance Sheet (Tier 3) */}
      <Tier3WithdrawalSheet
        isOpen={showFinancialSheet}
        onClose={() => setShowFinancialSheet(false)}
        onUpload={() => {
          setShowFinancialSheet(false);
          clearFinancial();
          toast.success('Financial clearance granted!', {
            description: 'Withdrawals to your bank account are now enabled.',
            icon: <ShieldCheck className="w-5 h-5 text-green-500" />,
          });
        }}
      />
    </>
  );
};


// ═══════════════════════════════════════════════════════
// Email Verification Modal
// ═══════════════════════════════════════════════════════

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({ isOpen, onClose, onVerified }) => {
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
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
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
    setTimeout(() => {
      setIsVerifying(false);
      setVerified(true);
      setTimeout(() => onVerified(), 1200);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-7">
              <AnimatePresence mode="wait">
                {!verified ? (
                  <motion.div key="otp-form" exit={{ opacity: 0, scale: 0.95 }}>
                    {/* Icon */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                      className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-5"
                    >
                      <Mail className="w-8 h-8 text-blue-500" />
                    </motion.div>

                    <h2 className="text-slate-900 font-black text-2xl mb-2 text-center">Verify Your Email</h2>
                    <p className="text-slate-400 font-medium text-center text-sm mb-1">
                      We sent a 6-digit verification code to
                    </p>
                    <p className="text-slate-800 font-black text-center text-sm mb-7">agent@example.com</p>

                    {/* OTP */}
                    <div className="flex justify-center gap-3 mb-6">
                      {otp.map((digit, i) => (
                        <motion.input
                          key={i}
                          ref={(el) => { otpRefs.current[i] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          onPaste={i === 0 ? handleOtpPaste : undefined}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + i * 0.04 }}
                          className={`w-12 h-13 text-center text-lg font-black rounded-xl border-2 bg-slate-50 outline-none transition-all ${
                            digit ? 'border-blue-500 text-slate-900 bg-blue-50/30' : 'border-slate-200 text-slate-400'
                          } focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={handleVerify}
                      disabled={otp.join('').length < 6 || isVerifying}
                      className="w-full py-4 rounded-full text-white font-black text-base shadow-lg transition-all active:scale-[0.98] hover:brightness-110 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: '#6D1D2C', boxShadow: '0 8px 24px rgba(109, 29, 44, 0.3)' }}
                    >
                      {isVerifying ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          Verify Email
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>

                    <div className="mt-5 text-center">
                      {resendTimer > 0 ? (
                        <p className="text-slate-400 text-sm">
                          Resend code in <span className="font-black" style={{ color: '#6D1D2C' }}>{resendTimer}s</span>
                        </p>
                      ) : (
                        <button
                          onClick={() => { setResendTimer(60); setOtp(['', '', '', '', '', '']); otpRefs.current[0]?.focus(); }}
                          className="text-sm font-bold hover:underline"
                          style={{ color: '#6D1D2C' }}
                        >
                          Resend code
                        </button>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                    className="py-8 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-5"
                    >
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </motion.div>
                    <h2 className="text-slate-900 font-black text-2xl mb-2">Email Verified!</h2>
                    <p className="text-slate-400 font-medium text-sm">Your trust score has been updated.</p>
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


// ═══════════════════════════════════════════════════════
// Identity Verification Modal (Tier 2 inline flow)
// ═══════════════════════════════════════════════════════

interface IdentityVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
}

const IdentityVerificationModal: React.FC<IdentityVerificationModalProps> = ({ isOpen, onClose, onVerified }) => {
  const [step, setStep] = useState<'nin' | 'selfie' | 'processing' | 'success'>('nin');
  const [ninValue, setNinValue] = useState('');

  useEffect(() => {
    if (!isOpen) { setStep('nin'); setNinValue(''); }
  }, [isOpen]);

  const handleNinSubmit = () => {
    if (ninValue.length < 11) return;
    setStep('selfie');
  };

  const handleSelfieCapture = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => onVerified(), 1200);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
        >
          <motion.div onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Steps indicator */}
            <div className="px-7 pt-7 pb-2">
              <div className="flex items-center gap-2 mb-6">
                {['NIN/BVN', 'Selfie', 'Done'].map((label, i) => {
                  const stepIndex = i;
                  const currentIndex = step === 'nin' ? 0 : step === 'selfie' ? 1 : 2;
                  return (
                    <React.Fragment key={label}>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                          stepIndex < currentIndex ? 'bg-green-500 text-white' :
                          stepIndex === currentIndex ? 'text-white' : 'bg-slate-100 text-slate-300'
                        }`}
                          style={stepIndex === currentIndex ? { background: '#6D1D2C' } : undefined}
                        >
                          {stepIndex < currentIndex ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                        </div>
                        <span className={`text-xs font-bold ${stepIndex <= currentIndex ? 'text-slate-700' : 'text-slate-300'}`}>
                          {label}
                        </span>
                      </div>
                      {i < 2 && <div className={`flex-1 h-0.5 rounded ${stepIndex < currentIndex ? 'bg-green-500' : 'bg-slate-100'}`} />}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            <div className="px-7 pb-7">
              <AnimatePresence mode="wait">
                {step === 'nin' && (
                  <motion.div key="nin" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="text-slate-900 font-black text-xl mb-2">Enter NIN or BVN</h2>
                    <p className="text-slate-400 text-sm font-medium mb-5">Your National Identification Number or Bank Verification Number for identity confirmation.</p>

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={11}
                      value={ninValue}
                      onChange={(e) => setNinValue(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 12345678901"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-bold placeholder:text-slate-300 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 mb-5 tracking-widest"
                    />

                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3 mb-6">
                      <Shield className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-blue-600 text-xs font-medium">Your NIN/BVN is encrypted and only used for identity verification. We never store it in plain text.</p>
                    </div>

                    <button
                      onClick={handleNinSubmit}
                      disabled={ninValue.length < 11}
                      className="w-full py-4 rounded-full text-white font-black text-base shadow-lg transition-all active:scale-[0.98] hover:brightness-110 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: '#6D1D2C', boxShadow: '0 8px 24px rgba(109, 29, 44, 0.3)' }}
                    >
                      Continue to Selfie <ArrowRight className="w-5 h-5" />
                    </button>
                  </motion.div>
                )}

                {step === 'selfie' && (
                  <motion.div key="selfie" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="text-slate-900 font-black text-xl mb-2">Quick Selfie Verification</h2>
                    <p className="text-slate-400 text-sm font-medium mb-5">Take a quick selfie to match your identity. Make sure your face is well-lit and clearly visible.</p>

                    {/* Camera placeholder */}
                    <div className="w-full aspect-square max-w-[240px] mx-auto bg-slate-100 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center mb-6">
                      <Camera className="w-12 h-12 text-slate-300 mb-3" />
                      <p className="text-slate-400 text-xs font-bold">Camera Preview</p>
                      <p className="text-slate-300 text-[10px] font-medium">Position face in frame</p>
                    </div>

                    <button
                      onClick={handleSelfieCapture}
                      className="w-full py-4 rounded-full text-white font-black text-base shadow-lg transition-all active:scale-[0.98] hover:brightness-110 flex items-center justify-center gap-2"
                      style={{ background: '#6D1D2C', boxShadow: '0 8px 24px rgba(109, 29, 44, 0.3)' }}
                    >
                      <Camera className="w-5 h-5" />
                      Capture & Verify
                    </button>
                  </motion.div>
                )}

                {step === 'processing' && (
                  <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-12 text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                      className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-primary mx-auto mb-5"
                      style={{ borderTopColor: '#6D1D2C' }}
                    />
                    <h2 className="text-slate-900 font-black text-xl mb-2">Verifying Identity...</h2>
                    <p className="text-slate-400 text-sm font-medium">Matching your selfie with NIN records. This takes a moment.</p>
                  </motion.div>
                )}

                {step === 'success' && (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring' }} className="py-8 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-5"
                    >
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </motion.div>
                    <h2 className="text-slate-900 font-black text-2xl mb-2">Identity Verified!</h2>
                    <p className="text-slate-400 font-medium text-sm">Pro status unlocked. You can now list properties.</p>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-50 border border-green-200 rounded-full"
                    >
                      <Sparkles className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 text-xs font-black">Tier 2 — Pro Agent</span>
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


// ═══════════════════════════════════════════════════════
// Screen B: Tier 2 Action-Gate Modal
// ═══════════════════════════════════════════════════════

interface Tier2ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartVerification: () => void;
}

export const Tier2VerificationModal: React.FC<Tier2ModalProps> = ({
  isOpen,
  onClose,
  onStartVerification,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Illustration area */}
            <div className="relative h-48 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0A1128 0%, #1a2340 100%)' }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-40 h-28 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-3"
                  >
                    <div className="w-full h-12 bg-white/10 rounded-lg mb-2" />
                    <div className="w-24 h-2 bg-white/20 rounded-full mb-1.5" />
                    <div className="w-16 h-2 bg-white/10 rounded-full" />
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0, rotate: -20, x: 20, y: -20 }}
                    animate={{ scale: 1, rotate: 0, x: 0, y: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.5 }}
                    className="absolute -top-4 -right-4 w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
                    style={{ background: '#6D1D2C' }}
                  >
                    <ShieldCheck className="w-7 h-7 text-white" />
                  </motion.div>

                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                      transition={{ delay: 0.8 + i * 0.2, duration: 1, repeat: Infinity, repeatDelay: 2 }}
                      className="absolute w-2 h-2 bg-amber-400 rounded-full"
                      style={{
                        top: i === 0 ? '-12px' : i === 1 ? '10px' : '30px',
                        right: i === 0 ? '20px' : i === 1 ? '-20px' : '-10px',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="p-7">
              <h2 className="text-slate-900 font-black text-2xl mb-3">Ready to start listing?</h2>
              <p className="text-slate-500 font-medium mb-2">
                To maintain our <span className="text-slate-700 font-bold">100% Verified Marketplace</span>, we need to confirm your identity via NIN/BVN and a quick selfie.
              </p>
              <div className="flex items-center gap-2 mb-7">
                <Clock className="w-4 h-4" style={{ color: '#6D1D2C' }} />
                <span className="text-sm font-bold" style={{ color: '#6D1D2C' }}>This takes less than 2 minutes.</span>
              </div>

              <div className="flex items-center gap-3 mb-7 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-slate-600 text-xs font-bold">NIN/BVN</span>
                </div>
                <ArrowRight className="w-3 h-3 text-slate-300" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Camera className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-slate-600 text-xs font-bold">Selfie</span>
                </div>
                <ArrowRight className="w-3 h-3 text-slate-300" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                  </div>
                  <span className="text-slate-600 text-xs font-bold">Verified</span>
                </div>
              </div>

              <button
                onClick={onStartVerification}
                className="w-full py-4 rounded-full text-white font-black text-base shadow-lg transition-all active:scale-[0.98] hover:brightness-110 flex items-center justify-center gap-2"
                style={{ background: '#6D1D2C', boxShadow: '0 8px 24px rgba(109, 29, 44, 0.3)' }}
              >
                Start Verification
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onClose}
                className="w-full py-3 mt-2 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


// ═══════════════════════════════════════════════════════
// Screen C: Tier 3 Withdrawal Bottom Sheet
// ═══════════════════════════════════════════════════════

interface Tier3WithdrawalSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: () => void;
}

export const Tier3WithdrawalSheet: React.FC<Tier3WithdrawalSheetProps> = ({
  isOpen,
  onClose,
  onUpload,
}) => {
  const [dragOver, setDragOver] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end justify-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative bg-white rounded-t-3xl w-full max-w-lg overflow-hidden shadow-2xl"
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-slate-200 rounded-full" />
            </div>

            <div className="px-7 pb-5 pt-2">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                  <CircleAlert className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-slate-900 font-black text-lg">Financial Clearance Required</h3>
                  <p className="text-slate-400 text-xs font-bold">Standard AML Compliance</p>
                </div>
              </div>

              <p className="text-slate-500 font-medium mb-1">
                Please upload a <span className="text-slate-800 font-bold">Proof of Address</span> (Utility Bill or Bank Statement) to enable bank transfers.
              </p>
              <p className="text-slate-400 text-xs font-medium mb-6">
                This is required for Anti-Money Laundering (AML) compliance and protects your account.
              </p>

              <div className="flex gap-3 mb-6">
                {[
                  { label: 'Utility Bill', icon: '⚡', sub: 'Last 3 months' },
                  { label: 'Bank Statement', icon: '🏦', sub: 'Last 3 months' },
                ].map((doc) => (
                  <div key={doc.label} className="flex-1 p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                    <span className="text-xl">{doc.icon}</span>
                    <p className="text-slate-700 text-xs font-bold mt-1">{doc.label}</p>
                    <p className="text-slate-400 text-[10px] font-medium">{doc.sub}</p>
                  </div>
                ))}
              </div>

              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); onUpload(); }}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer mb-6 ${
                  dragOver
                    ? 'border-primary bg-primary/5'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
                onClick={onUpload}
              >
                <Upload className={`w-8 h-8 mx-auto mb-2 ${dragOver ? 'text-primary' : 'text-slate-300'}`} />
                <p className="text-slate-500 text-sm font-bold mb-1">
                  {dragOver ? 'Drop file here' : 'Drag & drop or click to upload'}
                </p>
                <p className="text-slate-400 text-[11px] font-medium">PDF, JPG, PNG — Max 5MB</p>
              </div>

              <button
                onClick={onUpload}
                className="w-full py-4 rounded-full text-white font-black text-base shadow-lg transition-all active:scale-[0.98] hover:brightness-110 flex items-center justify-center gap-2"
                style={{ background: '#6D1D2C', boxShadow: '0 8px 24px rgba(109, 29, 44, 0.3)' }}
              >
                <Upload className="w-5 h-5" />
                Upload Document
              </button>

              <button
                onClick={onClose}
                className="w-full py-3 mt-2 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors mb-2"
              >
                I'll do this later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};