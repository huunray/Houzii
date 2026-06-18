import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Wallet, ArrowUpRight, ArrowDownLeft, Clock, Check,
  Shield, AlertCircle, TrendingUp, DollarSign, PieChart
} from 'lucide-react';

const transactions = [
  { id: 1, type: 'credit' as const, label: 'Rent - Adaeze Nwosu (Unit A, Lekki)', amount: '₦350,000', date: 'Mar 15, 2026', status: 'completed' as const, method: 'Auto' },
  { id: 2, type: 'credit' as const, label: 'Rent - Babatunde Afolabi (Apt 4B, VI)', amount: '₦280,000', date: 'Mar 15, 2026', status: 'completed' as const, method: 'Auto' },
  { id: 3, type: 'debit' as const, label: 'Platform Fee - March Collection', amount: '₦31,500', date: 'Mar 15, 2026', status: 'completed' as const, method: 'Fee' },
  { id: 4, type: 'debit' as const, label: 'Maintenance Escrow - Plumbing', amount: '₦85,000', date: 'Mar 12, 2026', status: 'pending' as const, method: 'Escrow' },
  { id: 5, type: 'credit' as const, label: 'Rent - Ikechukwu Okafor (Maitama)', amount: '₦420,000', date: 'Mar 1, 2026', status: 'completed' as const, method: 'Auto' },
  { id: 6, type: 'debit' as const, label: 'Withdrawal to Zenith ****3341', amount: '₦800,000', date: 'Feb 28, 2026', status: 'completed' as const, method: 'W2A' },
  { id: 7, type: 'credit' as const, label: 'Security Deposit - New Tenant', amount: '₦700,000', date: 'Feb 25, 2026', status: 'completed' as const, method: 'Escrow' },
];

const expenseBreakdown = [
  { label: 'Platform Fee (5%)', amount: '₦925,000', percent: 5, color: 'bg-primary' },
  { label: 'Maintenance Escrow', amount: '₦435,000', percent: 2.3, color: 'bg-amber-500' },
  { label: 'Agent Commission', amount: '₦1,850,000', percent: 10, color: 'bg-blue-500' },
  { label: 'Net Income', amount: '₦15,290,000', percent: 82.7, color: 'bg-green-500' },
];

export const OwnerWallet: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'credit' | 'debit'>('all');

  const filtered = transactions.filter(t => {
    if (activeFilter === 'all') return true;
    return t.type === activeFilter;
  });

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6 border-b border-slate-100">
        <h2 className="text-slate-900 font-black text-2xl mb-1">Wallet</h2>
        <p className="text-slate-400 font-medium text-sm">Rent collection, payouts & expense tracking</p>
      </div>

      <div className="px-6 pt-6">
        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-5 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
            <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">Total Collected (YTD)</p>
            <p className="font-black text-2xl tracking-tight">₦18,500,000</p>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-3.5 h-3.5 text-green-300" />
              <span className="text-green-300 text-xs font-bold">+₦1.05M this month</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 rounded-full blur-2xl" />
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Available Balance</p>
            <p className="text-slate-900 font-black text-2xl tracking-tight">₦4,250,000</p>
            <button className="mt-2 px-4 py-1.5 bg-primary text-white rounded-full text-xs font-bold hover:bg-primary-dark transition-colors flex items-center gap-1">
              Withdraw <ArrowUpRight className="w-3 h-3" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-full blur-2xl" />
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">In Escrow</p>
            <p className="text-slate-900 font-black text-2xl tracking-tight">₦785,000</p>
            <div className="flex items-center gap-1 mt-2">
              <Shield className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-amber-500 text-xs font-bold">2 active holds</span>
            </div>
          </motion.div>
        </div>

        {/* Rent Collection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-green-800 font-bold text-sm">Automated Rent Collection</p>
              <p className="text-green-600 text-xs font-medium">Next collection: April 1, 2026</p>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 bg-green-500 rounded-full">
              <Check className="w-3.5 h-3.5 text-white" />
              <span className="text-white text-xs font-black">Active</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/60 rounded-lg p-3">
              <p className="text-green-700 font-black text-lg">4/6</p>
              <p className="text-green-600 text-[10px] font-bold uppercase tracking-wider">Tenants Paid</p>
            </div>
            <div className="bg-white/60 rounded-lg p-3">
              <p className="text-green-700 font-black text-lg">₦1.05M</p>
              <p className="text-green-600 text-[10px] font-bold uppercase tracking-wider">This Month</p>
            </div>
            <div className="bg-white/60 rounded-lg p-3">
              <p className="text-amber-600 font-black text-lg">₦700K</p>
              <p className="text-amber-500 text-[10px] font-bold uppercase tracking-wider">Overdue</p>
            </div>
          </div>
        </motion.div>

        {/* 24-hour Dispute Window */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-blue-800 text-sm font-bold mb-1">24-Hour Dispute Window</p>
              <p className="text-blue-600 text-xs font-medium leading-relaxed">
                All security deposits are held in escrow with a 24-hour review window. Both owner and tenant can raise a dispute before funds are released, ensuring fair and transparent transactions.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Expense Reporting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white border border-slate-200 rounded-2xl p-5 mb-8"
        >
          <div className="flex items-center gap-2 mb-5">
            <PieChart className="w-5 h-5 text-primary" />
            <h3 className="text-slate-900 font-bold text-sm">Expense Breakdown (YTD)</h3>
          </div>

          {/* Visual Bar */}
          <div className="h-4 rounded-full overflow-hidden flex mb-5">
            {expenseBreakdown.map((item) => (
              <div
                key={item.label}
                className={`${item.color} h-full`}
                style={{ width: `${item.percent}%` }}
              />
            ))}
          </div>

          <div className="space-y-3">
            {expenseBreakdown.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-slate-600 text-sm font-bold">{item.label}</span>
                </div>
                <span className="text-slate-800 font-black text-sm">{item.amount}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Transaction History */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 font-black text-lg">Transaction History</h3>
          </div>
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
                {f === 'all' ? 'All' : f === 'credit' ? 'Received' : 'Fees & Withdrawals'}
              </button>
            ))}
          </div>
        </div>

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
                    tx.method === 'Auto' ? 'bg-green-50 text-green-500' :
                    tx.method === 'Escrow' ? 'bg-amber-50 text-amber-500' :
                    tx.method === 'Fee' ? 'bg-purple-50 text-purple-500' :
                    'bg-blue-50 text-blue-500'
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
    </div>
  );
};
