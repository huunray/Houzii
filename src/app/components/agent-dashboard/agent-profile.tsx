import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, ShieldCheck, Phone, Mail, Building2, Camera, Lock,
  ChevronRight, Eye, EyeOff, Check, CreditCard, Crown,
  CircleCheck, Sparkles, Landmark, AlertCircle, KeyRound,
  ShieldAlert, CheckCircle2, UserCheck, HelpCircle, X
} from 'lucide-react';
import { toast } from 'sonner';

type AffiliationType = 'independent' | 'agency' | 'broker';

const NIGERIAN_BANKS = [
  'Guaranty Trust Bank (GTBank)',
  'Zenith Bank',
  'Access Bank',
  'United Bank for Africa (UBA)',
  'First Bank of Nigeria',
  'Stanbic IBTC Bank',
  'Fidelity Bank',
  'Wema Bank',
  'Sterling Bank',
  'Providus Bank',
  'Kuda Microfinance Bank',
];

interface PlanItem {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export const AgentProfile: React.FC = () => {
  // ── Profile states ──
  const [fullName] = useState('Adamu Okonkwo'); // Read-only compliance lock
  const [email] = useState('adamu@email.com');   // Read-only compliance lock
  
  // Phone number state with custom inline verification states
  const [phone, setPhone] = useState('+234 801 234 5678');
  const [tempPhone, setTempPhone] = useState('+234 801 234 5678');
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(true);
  const [inlineOtpSent, setInlineOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Agency Rep / Broker States
  const [affiliation, setAffiliation] = useState<AffiliationType>('agency');
  const [agencyName, setAgencyName] = useState('Prime Heights Realty');
  const [licenseNumber, setLicenseNumber] = useState('NIESV/2026/9482');
  
  // Public Bio
  const [bio, setBio] = useState('Senior real estate consultant and portfolio manager specializing in verified, high-end residential listings in Lekki, Ikoyi, and Victoria Island, Lagos.');
  const [isSavingBio, setIsSavingBio] = useState(false);

  // ── Pay-out details states ──
  const [bankName, setBankName] = useState('Guaranty Trust Bank (GTBank)');
  const [accountNumber, setAccountNumber] = useState('0124859382');
  const [isSavingPayout, setIsSavingPayout] = useState(false);
  const [isPayoutSaved, setIsPayoutSaved] = useState(true);

  // ── Change password states ──
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // ── Subscription selected/active plan ──
  const [selectedPlanId, setSelectedPlanId] = useState<string>('pro-agent');

  const subscriptionPlans: PlanItem[] = [
    {
      id: 'basic-agent',
      name: 'Independent Free',
      price: '₦0',
      period: 'forever',
      description: 'Ideal for starting independent agents exploring Lagos listing ecosystems.',
      features: [
        'Up to 3 active listings',
        'Standard search placement',
        'Basic contact lead forms',
        'Tier 1 basic verification badge'
      ]
    },
    {
      id: 'pro-agent',
      name: 'Professional Pro',
      price: '₦15,000',
      period: 'month',
      description: 'Our most popular tier. Unlimited listings with premium escrow benefits.',
      features: [
        'Unlimited residential listings',
        'Direct Houzii escrow payouts',
        'Tier 2 Pro Identity badge tracker',
        '3 featured listing boosts/mo',
        '24/7 prioritized whatsapp assistance'
      ],
      isPopular: true
    },
    {
      id: 'enterprise-broker',
      name: 'Enterprise Broker',
      price: '₦45,000',
      period: 'month',
      description: 'Tailored for professional brokerage teams and corporate offices in Nigeria.',
      features: [
        'Everything in Professional Pro',
        'Up to 10 sub-agent sub-profiles',
        'Corporate brokerage branding tools',
        'Shared listing activity registers',
        'Dedicated corporate relationship manager'
      ]
    }
  ];

  // Section scroll handler
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Inline OTP verification flow trigger
  const handleSendPhoneOtp = () => {
    if (!tempPhone.trim()) {
      toast.error('Please enter a valid phone number');
      return;
    }
    if (tempPhone === phone && isPhoneVerified) {
      setIsEditingPhone(false);
      return;
    }
    setInlineOtpSent(true);
    setOtpCode('');
    setOtpError('');
    toast.success('Simulation: OTP dispatched to ' + tempPhone);
  };

  const handleVerifyPhoneOtp = () => {
    if (otpCode.length !== 4) {
      setOtpError('Enter a valid 4-digit verification code.');
      return;
    }
    setIsVerifyingOtp(true);
    setTimeout(() => {
      setIsVerifyingOtp(false);
      setInlineOtpSent(false);
      setIsEditingPhone(false);
      setIsPhoneVerified(true);
      setPhone(tempPhone);
      toast.success('Your phone number has been updated and verified!');
    }, 1200);
  };

  // Payout save function with interactive feedback
  const handleSavePayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (accountNumber.length !== 10) {
      toast.error('NUBAN Account Number must be exactly 10 digits.');
      return;
    }
    setIsSavingPayout(true);
    setTimeout(() => {
      setIsSavingPayout(false);
      setIsPayoutSaved(true);
      toast.success('NUBAN settlement details securely locked and verified!');
    }, 1200);
  };

  // Password update function
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Confirm password does not match with new password.');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Security key must contain at least 8 characters.');
      return;
    }
    setIsUpdatingPassword(true);
    setTimeout(() => {
      setIsUpdatingPassword(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Your security password registry was updated successfully.');
    }, 1400);
  };

  // Switch subscription plan simulated trigger
  const handleSwitchPlan = (planId: string) => {
    if (planId === 'pro-agent') {
      toast.info('You are already subscribed to the Professional Pro plan.');
      return;
    }
    setSelectedPlanId(planId);
    const plan = subscriptionPlans.find(p => p.id === planId);
    toast.success(`Plan switch request registered! Switching to ${plan?.name}...`);
  };

  // Helper functions for password strength
  const testPasswordStrength = () => {
    const hasLower = /[a-z]/.test(newPassword);
    const hasUpper = /[A-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecial = /[^a-zA-Z0-9]/.test(newPassword);
    const isLong = newPassword.length >= 8;
    const score = [hasLower, hasUpper, hasNumber, hasSpecial, isLong].filter(Boolean).length;
    return { score, hasLower, hasUpper, hasNumber, hasSpecial, isLong };
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-24 font-['Urbanist']">
      
      {/* ── Page Header / Visual Brand Banner ── */}
      <div className="bg-[#0A0613] px-8 pt-10 pb-20 relative overflow-hidden">
        {/* Obsidian dark background styling consistent with the brand theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#120C22] to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#591C2B] to-[#7B2D42] flex items-center justify-center text-white font-black text-3xl border-4 border-white/20 shadow-xl">
                {fullName.split(' ').map(n => n[0]).join('')}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary-dark transition-colors border-2 border-white/20">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-white font-black text-2xl tracking-tight">{fullName}</h1>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-550/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-emerald-400" /> T2 Pro Verified
                </span>
              </div>
              <p className="text-slate-200 text-xs mt-1.5 font-medium flex items-center gap-3">
                <span>{email}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span>ID: HZ-AGN-48209</span>
              </p>
            </div>
          </div>
          
          {/* Quick Stats overview panel */}
          <div className="flex gap-4 self-start md:self-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 px-5 border border-white/10">
              <p className="text-white/60 text-[10px] font-black uppercase tracking-wider">KYC Compliance Tier</p>
              <p className="text-amber-300 font-extrabold text-sm mt-0.5">Tier 2: Premium Pro</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 px-5 border border-white/10">
              <p className="text-white/60 text-[10px] font-black uppercase tracking-wider">Plan Status</p>
              <p className="text-emerald-400 font-extrabold text-sm mt-0.5">Professional Premium</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ── Left Navigation Sticky Anchor Index Panel ── */}
          <div className="lg:col-span-4 lg:sticky lg:top-6 self-start space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
              <h3 className="text-slate-900 font-black text-xs uppercase tracking-wider px-2 mb-4 text-slate-400">Settings Nav Index</h3>
              <nav className="space-y-1">
                {[
                  { id: 'account-section', label: 'Account Profile', num: '01' },
                  { id: 'payout-section', label: 'Settlement Payout Details', num: '02' },
                  { id: 'subscription-section', label: 'Subscription Tiers', num: '03' },
                  { id: 'kyc-section', label: 'KYC Verification Status', num: '04' },
                  { id: 'password-section', label: 'Security Password', num: '05' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="w-full flex items-center justify-between p-3.5 px-4 rounded-2xl text-left text-xs font-black transition-all hover:bg-slate-50 text-slate-600 hover:text-primary"
                  >
                    <span>{item.label}</span>
                    <span className="font-mono text-[10px] text-slate-400 font-medium">{item.num}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-5 border-t border-slate-100 px-2">
                <p className="text-[10px] font-bold text-slate-450 uppercase tracking-widest leading-relaxed">Central Bank Compliance</p>
                <div className="mt-2.5 flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-100 p-3 rounded-2xl">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <div className="text-[11px] font-semibold leading-relaxed">
                    Identity matches Lagos and CBN verification standards perfectly.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Content Stack Containing the 5 required sections ── */}
          <div className="lg:col-span-8 space-y-8">

            {/* ── SECTION 1: Account and Account Profile ── */}
            <section id="account-section" className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm transition-all scroll-mt-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-slate-900 font-black text-lg">1. Account & Profile</h2>
                  <p className="text-slate-400 text-xs font-medium font-sans">Verify read-only markers and configure licensed business representative affiliations</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Visual Lock Notification */}
                <div className="p-3.5 bg-slate-50/85 rounded-2xl border border-slate-100 flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <p className="text-slate-500 text-[11px] font-bold font-sans leading-relaxed">
                    <strong>Read-only Verification Locks:</strong> To protect buyers and prevent real estate agency credential fraud on Houzii, legal names and registered email inputs must match official state registration records and cannot be directly self-edited.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Full Name (Read-only Compliance) */}
                  <div className="relative">
                    <label className="text-slate-450 text-[10px] font-black uppercase tracking-wider block mb-1.5">Full Name (Read-only)</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={fullName}
                        readOnly
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-500 select-all cursor-not-allowed focus:outline-none"
                      />
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-350" />
                    </div>
                  </div>

                  {/* Email address (Read-only Compliance) */}
                  <div className="relative">
                    <label className="text-slate-455 text-[10px] font-black uppercase tracking-wider block mb-1.5">Registered Email (Read-only)</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={email}
                        readOnly
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-500 select-all cursor-not-allowed focus:outline-none"
                      />
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-355" />
                    </div>
                  </div>
                </div>

                {/* Editable Phone Number with inline verification trigger */}
                <div className="relative">
                  <label className="text-slate-450 text-[10px] font-black uppercase tracking-wider block mb-1.5">Phone Number (Verified)</label>
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2.5">
                      <div className="relative flex-1">
                        <input
                          type="tel"
                          value={tempPhone}
                          onChange={(e) => {
                            setTempPhone(e.target.value);
                            if (e.target.value !== phone) {
                              setIsPhoneVerified(false);
                            } else {
                              setIsPhoneVerified(true);
                            }
                          }}
                          disabled={!isEditingPhone}
                          className={`w-full px-4 py-3 border rounded-2xl text-sm font-bold transition-all focus:outline-none ${
                            isEditingPhone
                              ? 'bg-white border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/5 text-slate-900'
                              : 'bg-slate-55/70 bg-slate-50 border-slate-200 text-slate-800'
                          }`}
                          placeholder="+234..."
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                          {isPhoneVerified ? (
                            <span className="flex items-center gap-1 text-emerald-600 text-[10px] font-black uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                              ✓ Verified
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-amber-600 text-[10px] font-black uppercase tracking-wider bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                              Pending Match
                            </span>
                          )}
                        </div>
                      </div>
                      {isEditingPhone ? (
                        <div className="flex gap-2">
                          <button
                            onClick={handleSendPhoneOtp}
                            className="px-4 py-3 bg-primary hover:bg-primary-dark text-white text-xs font-black rounded-2xl shadow-md transition-colors whitespace-nowrap"
                          >
                            Send OTP Code
                          </button>
                          <button
                            onClick={() => {
                              setTempPhone(phone);
                              setIsPhoneVerified(true);
                              setIsEditingPhone(false);
                              setInlineOtpSent(false);
                            }}
                            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-2xl transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setIsEditingPhone(true)}
                          className="px-4 py-3 border border-slate-200 hover:border-primary hover:bg-primary/5 text-slate-700 text-xs font-black rounded-2xl transition-all"
                        >
                          Change Phone
                        </button>
                      )}
                    </div>

                    {/* Compact Inline OTP Verification Field */}
                    <AnimatePresence>
                      {inlineOtpSent && isEditingPhone && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3"
                        >
                          <p className="text-slate-500 text-[11px] font-medium leading-relaxed font-sans">
                            A verification code was dispatched mock-wise to <strong>{tempPhone}</strong>. Enter <strong>1234</strong> to verify.
                          </p>
                          <div className="flex gap-3">
                            <div className="relative flex-1">
                              <input
                                type="text"
                                maxLength={4}
                                value={otpCode}
                                onChange={(e) => {
                                  setOtpCode(e.target.value.replace(/\D/g, ''));
                                  setOtpError('');
                                }}
                                className="w-full tracking-[1.2em] text-center px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-base font-bold text-slate-800 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-mono"
                                placeholder="••••"
                              />
                            </div>
                            <button
                              onClick={handleVerifyPhoneOtp}
                              disabled={isVerifyingOtp}
                              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition-colors shrink-0 shadow-sm shadow-emerald-100"
                            >
                              {isVerifyingOtp ? 'Verifying...' : 'Verify OTP'}
                            </button>
                          </div>
                          {otpError && <p className="text-red-500 text-[10px] font-bold mt-1">{otpError}</p>}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Selected agency or representative details */}
                <div className="pt-4 border-t border-slate-50 space-y-5">
                  <div>
                    <label className="text-slate-450 text-[10px] font-black uppercase tracking-wider block mb-2.5">Representative Type & Professional Affiliation</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        { id: 'independent' as const, title: 'Independent Practice', desc: 'No institutional firm' },
                        { id: 'agency' as const, title: 'Agency Representative', desc: 'Accredited estate firm' },
                        { id: 'broker' as const, title: 'Corporate Brokerage', desc: 'Corporate licensed broker' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setAffiliation(item.id)}
                          className={`p-4 rounded-2xl text-left border-2 transition-all flex flex-col justify-between h-24 ${
                            affiliation === item.id
                              ? 'border-primary bg-primary/5'
                              : 'border-slate-100 bg-white hover:border-slate-200'
                          }`}
                        >
                          <span className={`text-xs font-black ${affiliation === item.id ? 'text-primary' : 'text-slate-800'}`}>
                            {item.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold leading-normal font-sans">
                            {item.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Render Agency Information Conditionally based on selection */}
                  <AnimatePresence mode="popLayout">
                    {affiliation !== 'independent' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2"
                      >
                        {/* Firm Details */}
                        <div>
                          <label className="text-slate-450 text-[10px] font-black uppercase tracking-wider block mb-1.5">Registered Agency / Firm Name</label>
                          <input
                            type="text"
                            value={agencyName}
                            onChange={(e) => setAgencyName(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                            placeholder="e.g. Fine and Country Lagos"
                          />
                        </div>

                        {/* License details */}
                        <div>
                          <label className="text-slate-450 text-[10px] font-black uppercase tracking-wider block mb-1.5">Professional Registry License Number</label>
                          <input
                            type="text"
                            value={licenseNumber}
                            onChange={(e) => setLicenseNumber(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all w-full"
                            placeholder="e.g. NIESV/2026/XXXX"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Public Agent Bio */}
                  <div>
                    <label className="text-slate-450 text-[10px] font-black uppercase tracking-wider block mb-1.5">Public Agent Bio Summary</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[10px] text-slate-400 font-bold font-sans">Visible to Lagos tenant clients on your home listings</span>
                      <button
                        onClick={() => {
                          setIsSavingBio(true);
                          setTimeout(() => {
                            setIsSavingBio(false);
                            toast.success('Agent bio summary saved successfully!');
                          }, 1000);
                        }}
                        disabled={isSavingBio}
                        className="px-4 py-1.5 bg-slate-100 hover:bg-primary/5 text-slate-700 hover:text-primary text-[11px] font-black rounded-full transition-all border border-slate-200/50"
                      >
                        {isSavingBio ? 'Saving...' : 'Save Bio Change'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>


            {/* ── SECTION 2: Payment and Settlement Details ── */}
            <section id="payout-section" className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm transition-all scroll-mt-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center animate-pulse">
                    <Landmark className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-slate-900 font-black text-lg">2. Settlement Payout Details</h2>
                    <p className="text-slate-400 text-xs font-medium font-sans">Clear destinations for verified secure escrow rent deposits</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSavePayout} className="space-y-6">
                {/* Security and compliance note */}
                <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-100 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-emerald-800 font-extrabold text-xs">CBN Anti-Fraud Clearance Standard</h4>
                    <p className="text-emerald-700 text-[10px] font-medium font-sans mt-0.5 leading-relaxed">
                      To comply with money laundering audits under the Laws of Lagos State and Central Bank guidelines, the registered payout bank account holder name must matches your verified profile identity (<strong>Adamu Okonkwo</strong>). Settlement redirects to alternative names are strictly blocked.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Bank Name Selector */}
                  <div>
                    <label className="text-slate-450 text-[10px] font-black uppercase tracking-wider block mb-1.5">Settlement Payout Bank</label>
                    <select
                      value={bankName}
                      onChange={(e) => {
                        setBankName(e.target.value);
                        setIsPayoutSaved(false);
                      }}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all cursor-pointer appearance-none"
                    >
                      {NIGERIAN_BANKS.map((bank) => (
                        <option key={bank} value={bank}>{bank}</option>
                      ))}
                    </select>
                  </div>

                  {/* Account Number */}
                  <div>
                    <label className="text-slate-450 text-[10px] font-black uppercase tracking-wider block mb-1.5">Settlement Account Number (10-Digit NUBAN)</label>
                    <input
                      type="text"
                      maxLength={10}
                      value={accountNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setAccountNumber(val);
                        setIsPayoutSaved(false);
                      }}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-mono"
                      placeholder="e.g. 0123456789"
                    />
                  </div>
                </div>

                {/* Account Name - TIED directly with profile name (read-only compliance) */}
                <div>
                  <label className="text-slate-450 text-[10px] font-black uppercase tracking-wider block mb-1.5">NUBAN Account Holder (Compliance Match Locked)</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={fullName}
                      readOnly
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-500 select-all cursor-not-allowed focus:outline-none tracking-wide uppercase font-mono"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                      <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider border border-emerald-250 flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" /> Identity Matched
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <CircleCheck className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold text-[11px] font-sans">Active Payout Bank Registered: {bankName}</span>
                  </div>
                  <button
                    type="submit"
                    disabled={isSavingPayout || isPayoutSaved}
                    className={`px-6 py-2.5 rounded-full text-xs font-black transition-all ${
                      isPayoutSaved
                        ? 'bg-slate-150 text-slate-400 bg-slate-100 cursor-default'
                        : 'bg-primary hover:bg-primary-dark text-white shadow-md active:scale-95'
                    }`}
                  >
                    {isSavingPayout ? 'Validating NUBAN...' : isPayoutSaved ? 'Active Credentials Saved' : 'Verify & Activate Account'}
                  </button>
                </div>
              </form>
            </section>


            {/* ── SECTION 3: Subscription Status ── */}
            <section id="subscription-section" className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm transition-all scroll-mt-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-slate-900 font-black text-lg">3. Subscription Tiers</h2>
                  <p className="text-slate-400 text-xs font-medium font-sans">Configure platform agency rights and browse available premium features</p>
                </div>
              </div>

              {/* Plans comparison list grid */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {subscriptionPlans.map((plan) => {
                    const isCurrent = plan.id === 'pro-agent';
                    return (
                      <div
                        key={plan.id}
                        className={`rounded-2xl p-5 border-2 transition-all flex flex-col justify-between relative ${
                          isCurrent
                            ? 'border-primary bg-primary/[0.02] shadow-md shadow-primary/5'
                            : 'border-slate-100 bg-white hover:border-slate-200'
                        }`}
                      >
                        {isCurrent && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-sm">
                            Active Plan
                          </div>
                        )}

                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="font-black text-xs text-slate-905 uppercase tracking-wide">{plan.name}</h4>
                            {plan.isPopular && <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />}
                          </div>
                          
                          <div className="mt-2.5">
                            <span className="text-lg font-black text-slate-900">{plan.price}</span>
                            <span className="text-slate-400 text-[10px] font-bold"> / {plan.period}</span>
                          </div>

                          <p className="text-[10px] text-slate-400 font-bold mt-2 font-sans leading-normal">
                            {plan.description}
                          </p>

                          <ul className="mt-4 space-y-2">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-start gap-1.5 text-[10px] font-bold text-slate-600 font-sans">
                                <Check className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-primary' : 'text-slate-500'}`} />
                                <span className="leading-snug">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-50">
                          {isCurrent ? (
                            <div className="w-full text-center text-xs font-black text-primary bg-primary/10 py-2.5 rounded-full uppercase tracking-wider">
                              Your Active Plan
                            </div>
                          ) : (
                            <button
                              onClick={() => handleSwitchPlan(plan.id)}
                              className="w-full text-center text-xs font-black py-2.5 border border-slate-200 hover:border-primary text-slate-600 hover:text-primary rounded-full uppercase tracking-wider transition-colors bg-white hover:bg-slate-50"
                            >
                              Choose Plan
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Sub summary block */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-wider font-sans">Current Premium Billing Registry</p>
                    <p className="text-slate-700 text-xs font-black mt-1 leading-normal">
                      Renewal Scheduled: <strong>₦15,000 / mo</strong> on <strong>July 20, 2026</strong>. Payment Card linked matches NUBAN GTB registry.
                    </p>
                  </div>
                  <button className="text-primary hover:underline font-black text-xs uppercase tracking-wider shrink-0 whitespace-nowrap">
                    View Billing History
                  </button>
                </div>
              </div>
            </section>


            {/* ── SECTION 4: KYC Compliance Status (Dossier Record) ── */}
            <section id="kyc-section" className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm transition-all scroll-mt-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-slate-900 font-black text-lg">4. KYC Compliance Status</h2>
                  <p className="text-slate-400 text-xs font-medium font-sans">Official credentials match status record index</p>
                </div>
              </div>

              {/* Core KYC status values */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4.5 p-4 rounded-2xl bg-emerald-500/[0.03] border border-emerald-500/15 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-black text-xs text-slate-800 uppercase tracking-widest leading-none">Tier 1 Compliance Status</h4>
                      <p className="text-slate-500 text-[10px] font-bold mt-1 font-sans">Contact and basic credentialsverified</p>
                      <div className="mt-3.5 space-y-1.5 text-slate-700 text-[11px] font-bold">
                        <p>✓ Registry Email: {email}</p>
                        <p>✓ Active Mobile Line: {phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4.5 p-4 rounded-2xl bg-emerald-500/[0.03] border border-emerald-500/15 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-black text-xs text-slate-800 uppercase tracking-widest leading-none">Tier 2 Compliance Status</h4>
                      <p className="text-slate-500 text-[10px] font-bold mt-1 font-sans">Identity documents and bio records matched</p>
                      <div className="mt-3.5 space-y-1.5 text-slate-700 text-[11px] font-bold">
                        <p>✓ National ID (NIN) Verified (********572)</p>
                        <p>✓ Face Biometrics Similarity Match: 98.4%</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100">
                  <p className="text-[#1E3A5F] font-black text-xs uppercase tracking-wide mb-3">Stored Compliance Registry Data</p>
                  
                  <div className="space-y-2.5">
                    {[
                      { label: 'LASRRA Residency Card Match', val: 'Registered & Verified (LA/48201)' },
                      { label: 'Agency Accreditation Signature', val: 'Accredited (NIESV/2026)' },
                      { label: 'Biometric Clearance Score', val: 'Optimal Certification' },
                      { label: 'Address Document Ledger Status', val: 'Verified Utility Record' },
                    ].map((row, index) => (
                      <div key={index} className="flex justify-between items-center text-xs py-1.5 border-b border-slate-100 last:border-0 font-sans">
                        <span className="text-slate-550 text-slate-500 font-bold">{row.label}</span>
                        <span className="text-slate-800 font-extrabold">{row.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>


            {/* ── SECTION 5: Change Password & Security ── */}
            <section id="password-section" className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm transition-all scroll-mt-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-slate-900 font-black text-lg">5. Security & Password</h2>
                  <p className="text-slate-400 text-xs font-medium font-sans">Update login passwords to maintain professional brokerage access security</p>
                </div>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-5">
                {/* Visual Security warning */}
                <div className="p-3 bg-amber-500/10 text-amber-800 border border-amber-500/20 rounded-2xl flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-[10px] font-bold leading-normal font-sans">
                    Updating your password security key will instantly revoke all alternative concurrent browser cookies to prevent unauthorized escrow access.
                  </p>
                </div>

                {/* Current Password */}
                <div>
                  <label className="text-slate-400 text-[10px] font-black uppercase tracking-wider block mb-1.5">Current Password</label>
                  <div className="relative">
                    <input
                      type={showOld ? 'text' : 'password'}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-10 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all w-full"
                      placeholder="Enter current password key"
                    />
                    <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password & Confirmation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-slate-400 text-[10px] font-black uppercase tracking-wider block mb-1.5">New Password</label>
                    <div className="relative">
                      <input
                        type={showNew ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-10 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all w-full"
                        placeholder="Min 8 characters"
                      />
                      <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 text-[10px] font-black uppercase tracking-wider block mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-10 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all w-full"
                        placeholder="Re-enter new key"
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password strength details */}
                {newPassword && (() => {
                  const { score, hasUpper, hasLower, hasNumber, hasSpecial, isLong } = testPasswordStrength();
                  const strengthLabel = score <= 1 ? 'Weak' : score <= 3 ? 'Medium Strength' : 'Excellent Security Code';
                  const strengthColor = score <= 1 ? 'bg-red-500' : score <= 3 ? 'bg-amber-500' : 'bg-emerald-600';
                  
                  return (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-105 space-y-3 font-sans">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-sans">Strength Checklist</span>
                        <span className="text-[11px] font-black text-primary">{strengthLabel}</span>
                      </div>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((idx) => (
                          <div key={idx} className={`h-1.5 flex-1 rounded-full transition-all ${idx <= score ? strengthColor : 'bg-slate-250 bg-slate-200'}`} />
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-500">
                        <span className={isLong ? 'text-emerald-600' : ''}>
                          {isLong ? '✓' : '•'} At least 8 digits
                        </span>
                        <span className={hasUpper ? 'text-emerald-600' : ''}>
                          {hasUpper ? '✓' : '•'} Uppercase character
                        </span>
                        <span className={hasLower ? 'text-emerald-600' : ''}>
                          {hasLower ? '✓' : '•'} Lowercase character
                        </span>
                        <span className={hasNumber ? 'text-emerald-600' : ''}>
                          {hasNumber ? '✓' : '•'} Number digit
                        </span>
                      </div>
                    </div>
                  );
                })()}

                <div className="border-t border-slate-50 pt-5 flex justify-end">
                  <button
                    type="submit"
                    disabled={isUpdatingPassword || !oldPassword || !newPassword || newPassword !== confirmPassword}
                    className="px-6 py-2.5 bg-primary hover:bg-primary-dark disabled:bg-slate-100 disabled:text-slate-400 text-white text-xs font-black rounded-full transition-all shadow-md active:scale-95 whitespace-nowrap"
                  >
                    {isUpdatingPassword ? 'Updating Key...' : 'Update Password Registry'}
                  </button>
                </div>
              </form>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentProfile;
