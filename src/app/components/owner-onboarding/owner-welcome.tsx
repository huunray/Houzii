import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowRight, Sparkles, Home, Award, FileText, Key, Wallet } from 'lucide-react';

interface OwnerWelcomeProps {
  userName: string;
  onGoToDashboard: () => void;
}

export const OwnerWelcome: React.FC<OwnerWelcomeProps> = ({ userName, onGoToDashboard }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Soft Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/3 rounded-full blur-[120px]" />

      {/* Confetti-like decorations */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`confetti-${i}`}
          initial={{ opacity: 0, y: -50, rotate: 0 }}
          animate={{ opacity: [0, 1, 0.8], y: [0, 200 + i * 40], rotate: 360 }}
          transition={{ delay: 0.5 + i * 0.15, duration: 2, ease: 'easeOut' }}
          className="absolute top-10"
          style={{ left: `${15 + i * 14}%` }}
        >
          <div className={`w-3 h-3 rounded-sm ${
            i % 3 === 0 ? 'bg-primary/30' : i % 3 === 1 ? 'bg-yellow-400/40' : 'bg-green-400/30'
          }`} />
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-md mx-auto"
      >
        {/* Badge Illustration */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative w-40 h-40 mx-auto mb-10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-[32px] border border-primary/15" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Home className="w-16 h-16 text-primary" />
          </div>
          {/* Verified Checkmark */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
            className="absolute -bottom-3 -right-3 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-xl shadow-green-500/25 border-4 border-white"
          >
            <ShieldCheck className="w-7 h-7 text-white" />
          </motion.div>
          {/* Sparkle */}
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 1, type: 'spring' }}
            className="absolute -top-2 -left-2"
          >
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </motion.div>
          {/* Award */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.2, type: 'spring' }}
            className="absolute -top-1 -right-4"
          >
            <Award className="w-6 h-6 text-primary/50" />
          </motion.div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-slate-900 font-black text-3xl mb-4">
            Your profile is active, {userName}!
          </h1>
          <p className="text-slate-400 font-medium mb-2">
            Your owner account is now
          </p>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-50 border border-green-200 rounded-full mb-6">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            <span className="text-green-600 font-black text-sm uppercase tracking-widest">Tier 1 Active</span>
          </div>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-6 text-left"
        >
          <h3 className="text-slate-700 font-bold text-sm mb-4">What you can do now</h3>
          <div className="space-y-3">
            {[
              { icon: FileText, text: 'Draft your first property listing' },
              { icon: Key, text: 'Manage tenant inquiries & offers' },
              { icon: Home, text: 'Track your portfolio performance' },
              { icon: Wallet, text: 'View your financial dashboard' },
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <benefit.icon className="w-3 h-3 text-primary" />
                </div>
                <span className="text-slate-500 text-sm font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upgrade Notice */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-10 text-left"
        >
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-800 text-sm font-bold mb-1">Unlock Premium Features</p>
              <p className="text-amber-600 text-xs font-medium">
                To enable Automated Rent Collection or Digital Lease Signing, we'll verify your title documents in the Trust Center later.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <button
            onClick={onGoToDashboard}
            className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-full font-black text-lg shadow-lg shadow-primary/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};
