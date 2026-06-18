import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wallet, ArrowUpRight, ArrowDownLeft, Clock, Check,
  Shield, CircleAlert, Info, X, Download, ChevronDown,
  Building2, CreditCard, CheckCircle2, AlertCircle
} from 'lucide-react';

const transactions = [
  { id: 1, type: 'credit' as const, label: 'Plumbing Repair — Mrs. Ogundimu', amount: '₦55,000', fee: '₦5,500', net: '₦49,500', date: 'Mar 14, 2026', status: 'completed' },
  { id: 2, type: 'debit' as const, label: 'Withdrawal to GTBank ****4521', amount: '₦100,000', fee: '-', net: '₦100,000', date: 'Mar 12, 2026', status: 'completed' },
  { id: 3, type: 'credit' as const, label: 'AC Servicing — Zenith Gardens', amount: '₦95,000', fee: '₦9,500', net: '₦85,500', date: 'Mar 10, 2026', status: 'completed' },
  { id: 4, type: 'credit' as const, label: 'Title Verification — Mr. Adebayo', amount: '₦200,000', fee: '₦20,000', net: '₦180,000', date: 'Mar 5, 2026', status: 'completed' },
  { id: 5, type: 'debit' as const, label: 'Withdrawal to Access ****7832', amount: '₦150,000', fee: '-', net: '₦150,000', date: 'Mar 2, 2026', status: 'completed' },
  { id: 6, type: 'credit' as const, label: 'Interior Paint — Chukwudi Props', amount: '₦160,000', fee: '₦16,000', net: '₦144,000', date: 'Pending', status: 'escrow' },
];

const escrowMilestones = [
  { id: 1, label: 'Quote Accepted', completed: true, date: 'Mar 15' },
  { id: 2, label: 'Work Started', completed: true, date: 'Mar 16' },
  { id: 3, label: 'Milestone Verified', completed: false, date: 'Pending' },
  { id: 4, label: 'Payout Released', completed: false, date: 'Pending' },
];

const NIGERIAN_BANKS = [
  'Access Bank', 'First Bank of Nigeria', 'GTBank (Guaranty Trust)',
  'United Bank for Africa (UBA)', 'Zenith Bank', 'Stanbic IBTC Bank',
  'FCMB', 'Fidelity Bank', 'Union Bank', 'Polaris Bank',
  'Wema Bank', 'Sterling Bank', 'Keystone Bank', 'Ecobank Nigeria',
  'Heritage Bank', 'Jaiz Bank', 'Providus Bank', 'Opay', 'PalmPay',
  'Kuda Bank', 'Moniepoint MFB', 'VFD MFB',
];

// ─── Withdrawal Modal ─────────────────────────────────────────────────────────
const WithdrawalModal: React.FC<{
  availableBalance: string;
  onClose: () => void;
}> = ({ availableBalance, onClose }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState({
    amount: '',
    bank: '',
    accountNumber: '',
    accountName: '',
  });
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleVerifyAccount = () => {
    if (form.accountNumber.length === 10) {
      setVerifying(true);
      setTimeout(() => {
        setVerifying(false);
        setVerified(true);
        setForm((f) => ({ ...f, accountName: 'Adekunle Okafor' }));
      }, 1500);
    }
  };

  const handleSubmit = () => {
    setStep(3);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-slate-900 font-black text-base">
              {step === 3 ? 'Withdrawal Submitted' : 'Withdraw to Bank'}
            </h3>
            <p className="text-slate-400 text-xs font-medium">Available: {availableBalance}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator */}
        {step !== 3 && (
          <div className="px-6 pt-4 pb-2 flex items-center gap-2">
            {[1, 2].map((s) => (
              <React.Fragment key={s}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= s ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {step > s ? <Check className="w-3 h-3" /> : s}
                </div>
                {s < 2 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-primary' : 'bg-slate-100'}`} />}
              </React.Fragment>
            ))}
          </div>
        )}

        <div className="px-6 pb-6 pt-4">
          {/* Step 1: Amount + Bank */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-1.5">
                  Withdrawal Amount (₦)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₦</span>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                    placeholder="Enter amount"
                    className="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-1.5">
                  Select Bank
                </label>
                <div className="relative">
                  <select
                    value={form.bank}
                    onChange={(e) => setForm((f) => ({ ...f, bank: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 pr-10"
                  >
                    <option value="">Choose your bank</option>
                    {NIGERIAN_BANKS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-1.5">
                  Account Number (10 digits)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.accountNumber}
                    onChange={(e) => {
                      const val = e.target.value.slice(0, 10);
                      setForm((f) => ({ ...f, accountNumber: val }));
                      setVerified(false);
                      setForm((f) => ({ ...f, accountName: '' }));
                    }}
                    placeholder="0123456789"
                    maxLength={10}
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-slate-800 font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    onClick={handleVerifyAccount}
                    disabled={form.accountNumber.length !== 10 || !form.bank || verifying}
                    className="px-4 py-3 bg-primary disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    {verifying ? (
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : 'Verify'}
                  </button>
                </div>

                {verified && form.accountName && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-xl"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    <div>
                      <p className="text-green-700 text-xs font-black">{form.accountName}</p>
                      <p className="text-green-600 text-[10px] font-medium">{form.bank}</p>
                    </div>
                  </motion.div>
                )}
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!form.amount || !form.bank || !verified}
                className="w-full py-4 bg-[#7B2D42] hover:bg-[#7B1C3E] disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-black text-sm transition-all"
              >
                Continue to Review →
              </button>
            </div>
          )}

          {/* Step 2: Confirm */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-5 space-y-3">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Review Withdrawal</p>
                {[
                  { label: 'Amount', value: `₦${Number(form.amount).toLocaleString()}` },
                  { label: 'Bank', value: form.bank },
                  { label: 'Account', value: `****${form.accountNumber.slice(-4)}` },
                  { label: 'Account Name', value: form.accountName },
                  { label: 'Processing Time', value: '1–3 business hours' },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-slate-400 text-xs font-medium">{row.label}</span>
                    <span className="text-slate-800 font-bold text-sm">{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-2 px-3 py-3 bg-amber-50 border border-amber-200 rounded-xl">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-amber-700 text-xs font-medium">
                  Please confirm that all bank details are correct. Houzii is not liable for transfers to incorrect accounts.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3.5 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all"
                >
                  Edit Details
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3.5 bg-[#7B2D42] hover:bg-[#7B1C3E] text-white rounded-xl font-black text-sm transition-all"
                >
                  Confirm Withdrawal
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <h4 className="text-slate-900 font-black text-lg">Withdrawal Submitted</h4>
                <p className="text-slate-500 text-sm font-medium mt-1">
                  ₦{Number(form.amount).toLocaleString()} will arrive in your {form.bank} account within 1–3 business hours.
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Transaction Reference</p>
                <p className="text-slate-900 font-black text-sm">HZW-{Date.now().toString().slice(-8)}</p>
              </div>
              <button
                onClick={onClose}
                className="w-full py-3.5 bg-[#7B2D42] text-white rounded-xl font-black text-sm"
              >
                Done
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Main: ProWallet ──────────────────────────────────────────────────────────
export const ProWallet: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const [showWithdrawal, setShowWithdrawal] = useState(false);

  const filtered = transactions.filter((t) => {
    if (activeFilter === 'all') return true;
    return t.type === activeFilter;
  });

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6 border-b border-slate-100">
        <h2 className="text-slate-900 font-black text-2xl mb-1">Professional Wallet</h2>
        <p className="text-slate-400 font-medium text-sm">Earnings, escrow & commission transparency</p>
      </div>

      <div className="px-6 pt-6">
        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Available Balance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#7B2D42] to-[#7B1C3E] rounded-2xl p-5 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-1">
                <p className="text-white/60 text-xs font-bold uppercase tracking-wider">Available Balance</p>
                <Wallet className="w-4 h-4 text-white/40" />
              </div>
              <p className="font-black text-2xl tracking-tight">₦315,000</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className="w-3.5 h-3.5 text-green-300" />
                <span className="text-green-300 text-xs font-bold">+23% vs last month</span>
              </div>
              <button
                onClick={() => setShowWithdrawal(true)}
                className="mt-4 w-full py-2.5 bg-white/15 hover:bg-white/25 text-white border border-white/20 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                Withdraw to Bank <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>

          {/* Locked in Escrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-green-200 rounded-2xl p-5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-1">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Locked in Escrow</p>
                <Shield className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-slate-900 font-black text-2xl tracking-tight">₦160,000</p>
              <div className="flex items-center gap-1 mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-green-600 text-xs font-bold">1 active job — safe to start</span>
              </div>
              <p className="mt-3 text-slate-400 text-[10px] font-medium">
                Released when client verifies completion.
              </p>
            </div>
          </motion.div>

          {/* Total Earned */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/3 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-1">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Earned</p>
                <ArrowUpRight className="w-4 h-4 text-slate-300" />
              </div>
              <p className="text-slate-900 font-black text-2xl tracking-tight">₦1.25M</p>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-slate-400 text-xs font-medium">47 jobs completed</span>
              </div>
              <p className="mt-3 text-slate-400 text-[10px] font-medium">
                Lifetime earnings on Houzii
              </p>
            </div>
          </motion.div>
        </div>

        {/* Escrow Security Note */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 flex items-start gap-3"
        >
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-blue-700 text-xs font-medium">
            <strong className="font-bold">Escrow Protection:</strong> Funds for active jobs are
            secured in Houzii Escrow. Payouts are released 24 hours after job confirmation by the
            Houzii Human Oracle.
          </p>
        </motion.div>

        {/* Escrow Milestone Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="text-slate-900 font-bold text-sm">
                Active Escrow: Interior Paint — Chukwudi Properties
              </h3>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-600 text-[10px] font-bold">IN ESCROW</span>
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-5 left-5 right-5 h-0.5 bg-slate-100 z-0" />
              <div
                className="absolute top-5 left-5 h-0.5 bg-primary z-0 transition-all duration-500"
                style={{
                  width: `${((escrowMilestones.filter((m) => m.completed).length - 1) / (escrowMilestones.length - 1)) * 100}%`,
                }}
              />

              {escrowMilestones.map((milestone) => (
                <div key={milestone.id} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      milestone.completed
                        ? 'bg-primary border-primary text-white'
                        : 'bg-white border-slate-200 text-slate-300'
                    }`}
                  >
                    {milestone.completed ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>
                  <p
                    className={`text-[10px] font-bold mt-2 text-center max-w-[80px] ${
                      milestone.completed ? 'text-slate-700' : 'text-slate-300'
                    }`}
                  >
                    {milestone.label}
                  </p>
                  <p
                    className={`text-[9px] font-medium ${
                      milestone.completed ? 'text-slate-400' : 'text-slate-200'
                    }`}
                  >
                    {milestone.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Transaction History */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 font-black text-lg">Transaction History</h3>
          </div>

          <div className="flex gap-2 mb-4">
            {(['all', 'credit', 'debit'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all capitalize ${
                  activeFilter === f
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                {f === 'all' ? 'All' : f === 'credit' ? 'Earnings' : 'Withdrawals'}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {filtered.map((tx, i) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    tx.type === 'credit' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-400'
                  }`}
                >
                  {tx.type === 'credit' ? (
                    <ArrowDownLeft className="w-5 h-5" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 text-sm font-bold truncate">{tx.label}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-slate-400 text-[10px] font-medium">{tx.date}</span>
                    {tx.status === 'escrow' && (
                      <>
                        <span className="text-slate-200">|</span>
                        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-green-50 border border-green-200 rounded">
                          <div className="w-1 h-1 rounded-full bg-green-500" />
                          <span className="text-green-600 text-[10px] font-bold">In Escrow</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p
                    className={`font-black text-sm ${
                      tx.type === 'credit' ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {tx.type === 'credit' ? '+' : '-'}{tx.amount}
                  </p>
                  {tx.type === 'credit' && tx.fee !== '-' && (
                    <p className="text-[9px] font-bold text-slate-400">
                      Net: <span className="text-green-500">{tx.net}</span>
                    </p>
                  )}
                </div>

                {/* Download Receipt */}
                {tx.status === 'completed' && (
                  <button className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors shrink-0">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Withdraw CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-gradient-to-r from-[#7B2D42] to-[#7B1C3E] rounded-2xl p-6 flex items-center justify-between"
        >
          <div>
            <p className="text-white/70 text-xs font-bold uppercase tracking-wider mb-1">Ready to Withdraw?</p>
            <p className="text-white font-black text-xl">₦315,000</p>
            <p className="text-white/60 text-xs font-medium">Available for instant withdrawal</p>
          </div>
          <button
            onClick={() => setShowWithdrawal(true)}
            className="px-6 py-3 bg-white text-[#7B2D42] rounded-xl font-black text-sm hover:bg-slate-50 transition-all shadow-lg flex items-center gap-2"
          >
            <Building2 className="w-4 h-4" />
            Withdraw Now
          </button>
        </motion.div>

        {/* Fee Transparency */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-4 bg-slate-50 border border-slate-200 rounded-2xl p-5"
        >
          <div className="flex items-start gap-3">
            <CircleAlert className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-slate-700 text-sm font-bold mb-1">Commission Transparency</p>
              <p className="text-slate-400 text-xs font-medium">
                Houzii charges a{' '}
                <strong className="text-slate-600">10% Service Marketplace Fee</strong> on completed
                jobs. This covers escrow protection, client verification, dispute resolution, and
                platform maintenance. The fee is deducted automatically before payout.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Withdrawal Modal */}
      <AnimatePresence>
        {showWithdrawal && (
          <WithdrawalModal
            availableBalance="₦315,000"
            onClose={() => setShowWithdrawal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
