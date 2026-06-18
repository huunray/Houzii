import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wallet, ArrowUpRight, ArrowDownLeft, Clock, Check,
  ChevronRight, Shield, CircleAlert, FileText, Search as SearchIcon, ShieldCheck,
  X, ChevronDown, Building2
} from 'lucide-react';
import { Tier3WithdrawalSheet } from './trust-verification';
import { useTrust } from './trust-context';
import { toast } from 'sonner';

type SavedAccount = { id: number; bank: string; accountNo: string; accountName: string; };

const NIGERIAN_BANKS = [
  'Access Bank', 'First Bank', 'GTBank', 'UBA', 'Zenith Bank',
  'Fidelity Bank', 'FCMB', 'Sterling Bank', 'Union Bank', 'Wema Bank',
  'Polaris Bank', 'Stanbic IBTC', 'Kuda Bank', 'OPay', 'Moniepoint',
];

const WithdrawalModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  savedAccounts: SavedAccount[];
  onSuccess: (account: SavedAccount) => void;
}> = ({ isOpen, onClose, savedAccounts, onSuccess }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [useExisting, setUseExisting] = useState(savedAccounts.length > 0);
  const [selectedAccount, setSelectedAccount] = useState<SavedAccount | null>(savedAccounts[0] || null);
  const [bank, setBank] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [accountName, setAccountName] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [amount, setAmount] = useState('');
  const [refNo] = useState(`HZ-WD-${Math.floor(Math.random() * 90000 + 10000)}`);

  useEffect(() => {
    if (!isOpen) { setStep('form'); setBank(''); setAccountNo(''); setAccountName(''); setAmount(''); }
  }, [isOpen]);

  useEffect(() => {
    if (accountNo.length === 10 && bank && !useExisting) {
      setIsVerifying(true);
      setAccountName('');
      const t = setTimeout(() => { setAccountName('Joy Adeyemi'); setIsVerifying(false); }, 1500);
      return () => clearTimeout(t);
    } else if (accountNo.length < 10) {
      setAccountName('');
    }
  }, [accountNo, bank, useExisting]);

  const canSubmit = useExisting
    ? !!selectedAccount && !!amount
    : !!bank && accountNo.length === 10 && !!accountName && !!amount;

  const handleSubmit = () => {
    const account: SavedAccount = useExisting && selectedAccount
      ? selectedAccount
      : { id: Date.now(), bank, accountNo, accountName };
    onSuccess(account);
    setStep('success');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="bg-white w-full max-w-lg rounded-t-3xl shadow-2xl max-h-[92vh] flex flex-col"
          >
            {step === 'form' ? (
              <>
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
                  <div>
                    <h2 className="text-slate-900 font-black text-lg">Withdraw Funds</h2>
                    <p className="text-slate-400 text-sm mt-0.5">Available: <span className="text-slate-700 font-bold">₦2,450,000</span></p>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>

                <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
                  {/* Saved accounts */}
                  {savedAccounts.length > 0 && (
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Saved Accounts</p>
                      <div className="space-y-2">
                        {savedAccounts.map(acc => (
                          <button
                            key={acc.id}
                            onClick={() => { setSelectedAccount(acc); setUseExisting(true); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                              useExisting && selectedAccount?.id === acc.id
                                ? 'border-primary bg-primary/5'
                                : 'border-slate-100 hover:border-slate-200 bg-white'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              useExisting && selectedAccount?.id === acc.id ? 'bg-primary/10' : 'bg-slate-100'
                            }`}>
                              <Building2 className={`w-4 h-4 ${useExisting && selectedAccount?.id === acc.id ? 'text-primary' : 'text-slate-400'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-800">{acc.bank}</p>
                              <p className="text-xs text-slate-400">{acc.accountNo} · {acc.accountName}</p>
                            </div>
                            {useExisting && selectedAccount?.id === acc.id && (
                              <Check className="w-4 h-4 text-primary shrink-0" />
                            )}
                          </button>
                        ))}
                        <button
                          onClick={() => { setUseExisting(false); setSelectedAccount(null); }}
                          className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl border text-left transition-all ${
                            !useExisting ? 'border-primary bg-primary/5' : 'border-dashed border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <span className="text-xs font-bold text-primary">+ Use a different account</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* New account form */}
                  {!useExisting && (
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bank Account Details</p>

                      <div className="relative">
                        <select
                          value={bank}
                          onChange={e => { setBank(e.target.value); setAccountName(''); }}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:border-primary bg-white appearance-none"
                        >
                          <option value="">Select Bank</option>
                          {NIGERIAN_BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>

                      <input
                        value={accountNo}
                        onChange={e => setAccountNo(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="10-digit account number"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 placeholder:font-normal placeholder:text-slate-300 focus:outline-none focus:border-primary tracking-widest"
                      />

                      <div className={`px-4 py-3 rounded-xl border transition-all ${
                        accountName ? 'border-green-200 bg-green-50' : 'border-slate-100 bg-slate-50'
                      }`}>
                        {isVerifying ? (
                          <p className="text-xs text-slate-400 font-bold animate-pulse">Verifying account name…</p>
                        ) : accountName ? (
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500 shrink-0" />
                            <p className="text-sm font-black text-green-700">{accountName}</p>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-300 font-bold">Account name will appear here after verification</p>
                        )}
                      </div>

                      {accountName && (
                        <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-100 rounded-xl">
                          <CircleAlert className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
                            Ensure this account name matches your registered Houzii profile name exactly. Mismatches may delay or block payment.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Amount */}
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Withdrawal Amount</p>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-sm">₦</span>
                      <input
                        value={amount}
                        onChange={e => setAmount(e.target.value.replace(/\D/g, ''))}
                        placeholder="0"
                        className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1.5">Minimum withdrawal: ₦10,000</p>
                  </div>

                  {/* Processing notice */}
                  <div className="flex items-start gap-2.5 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      Withdrawals are processed manually by our team. Expect funds in your account <span className="font-bold text-slate-700">within 24 hours</span> of submitting your request.
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-8 pt-4 border-t border-slate-100 shrink-0">
                  <button
                    disabled={!canSubmit}
                    onClick={handleSubmit}
                    className="w-full py-3.5 rounded-2xl bg-primary text-white text-sm font-black hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Request Withdrawal
                  </button>
                </div>
              </>
            ) : (
              /* Success */
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                  className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-5"
                >
                  <Check className="w-8 h-8 text-green-500" />
                </motion.div>
                <h2 className="text-slate-900 font-black text-xl mb-2">Request Received</h2>
                <p className="text-slate-400 text-sm mb-1">Your withdrawal is being processed.</p>
                <p className="text-slate-700 font-bold text-sm mb-6">
                  Expect funds in your account within <span className="text-primary">24 hours</span>.
                </p>
                <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 w-full mb-6 text-left">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Reference Number</p>
                  <p className="text-slate-700 font-black text-sm tracking-widest">#{refNo}</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-full py-3.5 rounded-2xl bg-slate-900 text-white text-sm font-black hover:bg-slate-800 transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const transactions = [
  { id: 1, type: 'credit' as const, label: 'Commission - 3-Bed Apt, Lekki', amount: '₦450,000', date: 'Mar 14, 2026', status: 'completed', method: 'A2W' },
  { id: 2, type: 'debit' as const, label: 'Withdrawal to GTBank ****4521', amount: '₦200,000', date: 'Mar 12, 2026', status: 'completed', method: 'W2A' },
  { id: 3, type: 'credit' as const, label: 'Commission - Land, Banana Island', amount: '₦1,200,000', date: 'Mar 10, 2026', status: 'completed', method: 'A2W' },
  { id: 4, type: 'credit' as const, label: 'Referral Bonus', amount: '₦25,000', date: 'Mar 8, 2026', status: 'completed', method: 'A2W' },
  { id: 5, type: 'debit' as const, label: 'Withdrawal to Access ****7832', amount: '₦500,000', date: 'Mar 5, 2026', status: 'completed', method: 'W2A' },
  { id: 6, type: 'credit' as const, label: 'Commission - Penthouse, VI', amount: '₦975,000', date: 'Mar 2, 2026', status: 'pending', method: 'A2W' },
];

const escrowMilestones = [
  { id: 1, label: 'Escrow Funded',         completed: true,  date: 'Mar 1'  },
  { id: 2, label: 'Payment Acknowledged',  completed: true,  date: 'Mar 3'  },
  { id: 3, label: 'Handover Initiated',    completed: true,  date: 'Mar 10' },
  { id: 4, label: 'Handover Confirmed',    completed: false, date: 'Pending' },
  { id: 5, label: 'Funds Disbursed',       completed: false, date: 'Pending' },
];

export const AgentWallet: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const [showWithdrawalSheet, setShowWithdrawalSheet] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([
    { id: 1, bank: 'GTBank', accountNo: '****4521', accountName: 'Joy Adeyemi' },
  ]);
  const { trust, clearFinancial } = useTrust();

  const filtered = transactions.filter(t => {
    if (activeFilter === 'all') return true;
    return t.type === activeFilter;
  });

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6 border-b border-slate-100">
        <h2 className="text-slate-900 font-black text-2xl mb-1">Wallet</h2>
        <p className="text-slate-400 font-medium text-sm">Commissions, payouts & escrow tracking</p>
      </div>

      {/* Balance Cards */}
      <div className="px-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Total Earned */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black rounded-2xl p-5 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
            <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">Total Earned</p>
            <p className="font-black text-2xl tracking-tight">₦4,850,000</p>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-3.5 h-3.5 text-green-300" />
              <span className="text-green-300 text-xs font-bold">+₦975K this month</span>
            </div>
          </motion.div>

          {/* Pending Escrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-full blur-2xl" />
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Pending Escrow</p>
            <p className="text-slate-900 font-black text-2xl tracking-tight">₦975,000</p>
            <div className="flex items-center gap-1 mt-2">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-amber-500 text-xs font-bold">1 active deal</span>
            </div>
          </motion.div>

          {/* Available for Withdrawal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 rounded-full blur-2xl" />
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Available for Withdrawal</p>
            <p className="text-slate-900 font-black text-2xl tracking-tight">₦2,450,000</p>
            <button
              onClick={() => {
                if (!trust.financialCleared) {
                  setShowWithdrawalSheet(true);
                } else {
                  setShowWithdrawModal(true);
                }
              }}
              className="mt-2 px-4 py-1.5 bg-primary text-white rounded-full text-xs font-bold hover:bg-primary-dark transition-colors flex items-center gap-1"
            >
              Withdraw <ArrowUpRight className="w-3 h-3" />
            </button>
          </motion.div>
        </div>

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
              <h3 className="text-slate-900 font-bold text-sm">Escrow Milestone: Penthouse Suite, VI</h3>
            </div>
            <span className="text-amber-500 text-xs font-bold bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">In Progress</span>
          </div>

          {/* Milestone Steps */}
          <div className="relative">
            <div className="flex items-center justify-between relative">
              {/* Connecting line */}
              <div className="absolute top-5 left-5 right-5 h-0.5 bg-slate-100 z-0" />
              <div
                className="absolute top-5 left-5 h-0.5 bg-primary z-0 transition-all duration-500"
                style={{ width: `${((escrowMilestones.filter(m => m.completed).length - 1) / (escrowMilestones.length - 1)) * 100}%` }}
              />

              {escrowMilestones.map((milestone, i) => (
                <div key={milestone.id} className="relative z-10 flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    milestone.completed
                      ? 'bg-primary border-primary text-white'
                      : 'bg-white border-slate-200 text-slate-300'
                  }`}>
                    {milestone.completed ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>
                  <p className={`text-[10px] font-bold mt-2 text-center max-w-[60px] ${
                    milestone.completed ? 'text-slate-700' : 'text-slate-300'
                  }`}>
                    {milestone.label}
                  </p>
                  <p className={`text-[9px] font-medium ${
                    milestone.completed ? 'text-slate-400' : 'text-slate-200'
                  }`}>
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

          {/* Filters */}
          <div className="flex gap-2 mb-4">
            {(['all', 'credit', 'debit'] as const).map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all capitalize ${
                  activeFilter === f
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                {f === 'all' ? 'All' : f === 'credit' ? 'Received (A2W)' : 'Withdrawn (W2A)'}
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
              className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 hover:shadow-sm transition-all"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                tx.type === 'credit' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-400'
              }`}>
                {tx.type === 'credit' ? (
                  <ArrowDownLeft className="w-5 h-5" />
                ) : (
                  <ArrowUpRight className="w-5 h-5" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-slate-800 text-sm font-bold truncate">{tx.label}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-slate-400 text-[10px] font-medium">{tx.date}</span>
                  <span className="text-slate-200">|</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    tx.method === 'A2W' ? 'bg-blue-50 text-blue-500' : 'bg-purple-50 text-purple-500'
                  }`}>{tx.method}</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className={`font-black text-sm ${
                  tx.type === 'credit' ? 'text-green-600' : 'text-red-500'
                }`}>
                  {tx.type === 'credit' ? '+' : '-'}{tx.amount}
                </p>
                <p className={`text-[10px] font-bold ${
                  tx.status === 'completed' ? 'text-green-500' : 'text-amber-500'
                }`}>
                  {tx.status === 'completed' ? 'Completed' : 'Pending'}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tier 3 KYC Sheet — shown when not yet financially cleared */}
      <Tier3WithdrawalSheet
        isOpen={showWithdrawalSheet}
        onClose={() => setShowWithdrawalSheet(false)}
        onUpload={() => {
          setShowWithdrawalSheet(false);
          clearFinancial();
          toast.success('Financial clearance granted!', {
            description: 'Withdrawals to your bank account are now enabled.',
            icon: <ShieldCheck className="w-5 h-5 text-green-500" />,
          });
        }}
      />

      {/* Withdrawal Modal — shown when KYC cleared */}
      <WithdrawalModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        savedAccounts={savedAccounts}
        onSuccess={account => {
          setSavedAccounts(prev =>
            prev.some(a => a.accountNo === account.accountNo) ? prev : [...prev, account]
          );
        }}
      />
    </div>
  );
};