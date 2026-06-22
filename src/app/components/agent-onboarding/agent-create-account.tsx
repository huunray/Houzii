import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, ArrowRight, ShieldCheck, ArrowLeft, Check, X, Smartphone, MessageCircle, RefreshCw } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import HouziiLogo from '../../../imports/Group1410124151';
import { Link } from 'react-router-dom';

interface AgentCreateAccountProps {
  onContinue: (data: { fullName: string; email: string; phone: string; licenseNumber: string }) => void;
  onLogin: () => void;
}

export const AgentCreateAccount: React.FC<AgentCreateAccountProps> = ({ onContinue, onLogin }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const [sentVia, setSentVia] = useState<'sms' | 'whatsapp'>('sms');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!showVerification) return;
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [showVerification, resendTimer]);

  useEffect(() => {
    if (showVerification) {
      otpRefs.current[0]?.focus();
    }
  }, [showVerification]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName && email && phone) {
      setShowVerification(true);
      setResendTimer(60);
      setSentVia('sms');
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length < 6) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onContinue({ fullName, email, phone, licenseNumber });
    }, 1500);
  };

  const handleResend = (via: 'sms' | 'whatsapp') => {
    setSentVia(via);
    setResendTimer(60);
    setOtp(['', '', '', '', '', '']);
    otpRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Panel - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden rounded-r-[32px]">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1760072513442-9872656c1b07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBob21lJTIwaW50ZXJpb3IlMjBlbGVnYW50JTIwbGl2aW5nJTIwcm9vbXxlbnwxfHx8fDE3NzM3MDM1MTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Modern luxury home interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0613] via-[#0A0613]/60 to-[#0A0613]/30" />
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <div className="h-7 w-auto relative" style={{ aspectRatio: '1378.66/461.842' }}>
            <HouziiLogo />
          </div>
        </div>
        <Link to="/for-agents" className="absolute top-8 right-8 flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-bold">Back to Agent page</span>
        </Link>
        <div className="absolute bottom-16 left-8 right-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white font-black text-4xl leading-tight mb-4"
          >
            Grow Your Business.<br />
            Close More Deals.<br />
            Build Your Reputation.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white/70 font-medium max-w-md"
          >
            Join Nigeria's most trusted real estate platform. Manage listings, track leads, and earn commissions — all in one place.
          </motion.p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="h-7 w-auto relative" style={{ aspectRatio: '1378.66/461.842' }}>
              <HouziiLogo scrolled />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!showVerification ? (
              <motion.div
                key="create-form"
                initial={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 border border-primary/15 rounded-full mb-4">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                  <span className="text-primary text-xs font-black uppercase tracking-widest">Agent Account</span>
                </div>

                <h1 className="text-slate-900 font-black text-3xl mb-2">Create Your Agent Profile</h1>
                <p className="text-slate-400 font-medium mb-10">Start growing your real estate business with Houzii.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="text-slate-600 text-sm font-bold mb-2 block">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-300 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-slate-600 text-sm font-bold mb-2 block">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-300 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-slate-600 text-sm font-bold mb-2 block">Phone Number</label>
                    <div className="flex gap-3">
                      <div className="px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 font-bold text-sm flex items-center gap-1 shrink-0">
                        +234
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="8XX XXX XXXX"
                        className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-300 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-600 text-sm font-bold mb-2 block">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-300 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all pr-14"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {password.length > 0 && (() => {
                      const rules = [
                        { label: 'At least 8 characters', met: password.length >= 8 },
                        { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
                        { label: 'Lowercase letter', met: /[a-z]/.test(password) },
                        { label: 'Number', met: /[0-9]/.test(password) },
                        { label: 'Special character (!@#$...)', met: /[^A-Za-z0-9]/.test(password) },
                      ];
                      const metCount = rules.filter(r => r.met).length;
                      const strengthPercent = (metCount / rules.length) * 100;
                      const strengthColor = metCount <= 1 ? 'bg-red-400' : metCount <= 3 ? 'bg-amber-400' : metCount <= 4 ? 'bg-primary/70' : 'bg-green-500';
                      const strengthLabel = metCount <= 1 ? 'Weak' : metCount <= 3 ? 'Fair' : metCount <= 4 ? 'Good' : 'Strong';

                      return (
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${strengthColor}`}
                                style={{ width: `${strengthPercent}%` }}
                              />
                            </div>
                            <span className={`text-[11px] font-bold ${metCount <= 1 ? 'text-red-400' : metCount <= 3 ? 'text-amber-500' : metCount <= 4 ? 'text-primary/70' : 'text-green-500'}`}>
                              {strengthLabel}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            {rules.map((rule) => (
                              <div key={rule.label} className="flex items-center gap-1.5">
                                {rule.met ? (
                                  <Check className="w-3 h-3 text-green-500 shrink-0" />
                                ) : (
                                  <X className="w-3 h-3 text-slate-300 shrink-0" />
                                )}
                                <span className={`text-[11px] ${rule.met ? 'text-green-600 font-bold' : 'text-slate-400'}`}>
                                  {rule.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                    {password.length === 0 && (
                      <p className="text-slate-400 text-xs mt-2 ml-1">Must be at least 8 characters.</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-full font-black text-lg shadow-lg shadow-primary/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-8"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>

                <div className="mt-6 flex items-center gap-4">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-slate-400 text-sm font-medium">Or continue with</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                <div className="mt-6 flex gap-3 max-w-[280px] mx-auto">
                  <button className="flex-1 py-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 hover:shadow-sm">
                    <img src="https://www.google.com/favicon.ico" alt="" className="w-5 h-5" />
                    Google
                  </button>
                  <button className="flex-1 py-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 hover:shadow-sm">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1D1D1F">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                    Apple
                  </button>
                </div>

                <p className="mt-8 text-center text-sm text-slate-400">
                  Already have an account?{' '}
                  <button onClick={onLogin} className="text-primary font-bold hover:underline">
                    Login
                  </button>
                </p>

                <div className="mt-10 flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-500/60" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secure</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="verify-form"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Back button */}
                <button
                  onClick={() => { setShowVerification(false); setOtp(['', '', '', '', '', '']); }}
                  className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors mb-8"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-bold">Back</span>
                </button>

                {/* Phone icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
                >
                  <Smartphone className="w-9 h-9 text-primary" />
                </motion.div>

                <h1 className="text-slate-900 font-black text-3xl mb-2 text-center">Verify Your Phone</h1>
                <p className="text-slate-400 font-medium text-center mb-2">
                  We sent a 6-digit code {sentVia === 'whatsapp' ? 'via WhatsApp' : 'via SMS'} to
                </p>
                <p className="text-slate-800 font-black text-center mb-10">+234 {phone}</p>

                {/* OTP Input */}
                <div className="flex justify-center gap-3 mb-8">
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
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.05 }}
                      className={`w-13 h-14 text-center text-xl font-black rounded-2xl border-2 bg-slate-50 outline-none transition-all ${
                        digit ? 'border-primary text-slate-900 bg-primary/5' : 'border-slate-200 text-slate-400'
                      } focus:border-primary focus:ring-2 focus:ring-primary/10`}
                    />
                  ))}
                </div>

                {/* Verify Button */}
                <button
                  onClick={handleVerify}
                  disabled={otp.join('').length < 6 || isVerifying}
                  className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-full font-black text-lg shadow-lg shadow-primary/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify & Continue
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Send via WhatsApp */}
                <button
                  onClick={() => handleResend('whatsapp')}
                  disabled={resendTimer > 0 && sentVia === 'whatsapp'}
                  className="w-full py-4 mt-3 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-full font-bold text-base transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MessageCircle className="w-5 h-5" />
                  Send via WhatsApp
                </button>

                {/* Resend Timer */}
                <div className="mt-6 text-center">
                  {resendTimer > 0 ? (
                    <p className="text-slate-400 text-sm">
                      Resend code in <span className="text-primary font-black">{resendTimer}s</span>
                    </p>
                  ) : (
                    <button
                      onClick={() => handleResend('sms')}
                      className="text-primary text-sm font-bold hover:underline"
                    >
                      Resend code via SMS
                    </button>
                  )}
                </div>

                {/* Security badge */}
                <div className="mt-10 flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-500/60" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secure & Encrypted</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};