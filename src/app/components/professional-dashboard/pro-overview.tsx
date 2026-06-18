import React from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp, Shield, CheckCircle2, Bell, ArrowRight,
  TriangleAlert, Droplets, Zap, Clock, ShieldCheck,
  AlertCircle, Wallet
} from 'lucide-react';

const stats = [
  {
    label: 'Total Earned',
    value: '₦1.25M',
    trend: '+23% vs last month',
    trendUp: true,
    icon: TrendingUp,
    gradient: true,
  },
  {
    label: 'Pending in Escrow',
    value: '₦160,000',
    sub: '1 active job — safe to start',
    icon: Shield,
    escrow: true,
  },
  {
    label: 'Jobs Completed',
    value: '47',
    sub: 'All time • 4.9★ avg',
    icon: CheckCircle2,
    completed: true,
  },
];

const activityFeed = [
  {
    id: 1,
    type: 'bid',
    message: 'New bid received for Plumbing in Lekki.',
    sub: 'Tap to review and respond',
    time: '2m ago',
    icon: Bell,
    color: 'bg-orange-50 border-orange-100',
    iconColor: 'text-orange-500 bg-orange-100',
    dot: 'bg-orange-400',
    action: 'Review',
  },
  {
    id: 2,
    type: 'payment',
    message: 'Payment secured for Cleaning job #402.',
    sub: 'Please commence work — funds held in escrow',
    time: '1h ago',
    icon: Shield,
    color: 'bg-green-50 border-green-100',
    iconColor: 'text-green-600 bg-green-100',
    dot: 'bg-green-500',
    action: 'View Job',
  },
  {
    id: 3,
    type: 'quote',
    message: 'Your price for AC Servicing was accepted.',
    sub: 'Awaiting escrow funding from Zenith Gardens',
    time: '4h ago',
    icon: CheckCircle2,
    color: 'bg-blue-50 border-blue-100',
    iconColor: 'text-blue-500 bg-blue-100',
    dot: 'bg-blue-400',
    action: 'Track',
  },
  {
    id: 4,
    type: 'payout',
    message: '₦49,500 added to your Houzii Wallet.',
    sub: 'Job Paid & Closed — Title Search, Mr. Adebayo',
    time: '1d ago',
    icon: Wallet,
    color: 'bg-primary/5 border-primary/10',
    iconColor: 'text-primary bg-primary/10',
    dot: 'bg-primary',
    action: 'Receipt',
  },
  {
    id: 5,
    type: 'review',
    message: 'Mrs. Ogundimu left you a 5★ review.',
    sub: '"Excellent work! Will definitely hire again."',
    time: '2d ago',
    icon: CheckCircle2,
    color: 'bg-amber-50 border-amber-100',
    iconColor: 'text-amber-500 bg-amber-100',
    dot: 'bg-amber-400',
    action: 'View',
  },
];

const urgentJobs = [
  {
    id: 1,
    title: 'Fix burst pipe in master bathroom',
    client: 'Mrs. Ogundimu',
    location: 'Lekki Phase 1, Lagos',
    budget: '₦35,000 – ₦60,000',
    icon: Droplets,
    timeLeft: '45 min to respond',
    verified: true,
  },
  {
    id: 2,
    title: 'Electrical fault — 3-floor office complex',
    client: 'TechHub Lagos',
    location: 'Victoria Island, Lagos',
    budget: '₦80,000 – ₦150,000',
    icon: Zap,
    timeLeft: '1h 20min left',
    verified: true,
  },
];

interface ProOverviewProps {
  onNavigate: (tab: string) => void;
}

export const ProOverview: React.FC<ProOverviewProps> = ({ onNavigate }) => {
  return (
    <div className="pb-10">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-slate-900 font-black text-2xl">Good morning, Adekunle 👋</h2>
            <p className="text-slate-400 font-medium text-sm mt-0.5">Here's what needs your attention today</p>
          </div>
          <div className="relative">
            <button className="p-3 bg-slate-50 border border-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-400 rounded-full border-2 border-white" />
          </div>
        </div>
      </div>

      <div className="px-6 pt-6 space-y-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`rounded-2xl p-5 relative overflow-hidden ${
                  stat.gradient
                    ? 'bg-gradient-to-br from-[#7B2D42] to-[#7B1C3E] text-white'
                    : stat.escrow
                    ? 'bg-white border border-green-200'
                    : 'bg-white border border-slate-200'
                }`}
              >
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20 bg-white" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <p className={`text-xs font-bold uppercase tracking-wider ${
                      stat.gradient ? 'text-white/60' : 'text-slate-400'
                    }`}>
                      {stat.label}
                    </p>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      stat.gradient
                        ? 'bg-white/10'
                        : stat.escrow
                        ? 'bg-green-50'
                        : 'bg-slate-50'
                    }`}>
                      <Icon className={`w-4 h-4 ${
                        stat.gradient ? 'text-white/80' : stat.escrow ? 'text-green-500' : 'text-slate-400'
                      }`} />
                    </div>
                  </div>
                  <p className={`font-black text-2xl tracking-tight ${
                    stat.gradient ? 'text-white' : 'text-slate-900'
                  }`}>
                    {stat.value}
                  </p>
                  <p className={`text-xs font-medium mt-1.5 ${
                    stat.gradient
                      ? 'text-green-300'
                      : stat.escrow
                      ? 'text-green-600 font-bold'
                      : 'text-slate-400'
                  }`}>
                    {stat.trend || stat.sub}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Priority Queue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TriangleAlert className="w-4 h-4 text-red-500" />
              <h3 className="text-slate-900 font-black text-base">Urgent — Needs Response</h3>
              <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {urgentJobs.length}
              </span>
            </div>
            <button
              onClick={() => onNavigate('jobs-feed')}
              className="text-primary text-xs font-bold flex items-center gap-1 hover:underline"
            >
              See all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {urgentJobs.map((job, i) => {
              const Icon = job.icon;
              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.08 }}
                  className="bg-red-50 border border-red-200 rounded-2xl p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-slate-800 font-bold text-sm mb-0.5 leading-tight">{job.title}</h4>
                      <p className="text-slate-500 text-xs font-medium mb-2">
                        {job.client} · {job.location}
                      </p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-slate-700 font-black text-xs">{job.budget}</span>
                        {job.verified && (
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 border border-green-200 rounded-full">
                            <ShieldCheck className="w-3 h-3 text-green-500" />
                            <span className="text-green-600 text-[10px] font-bold">Verified Client</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="flex items-center gap-1 text-red-500 text-[10px] font-bold">
                        <Clock className="w-3 h-3" />
                        {job.timeLeft}
                      </div>
                      <button
                        onClick={() => onNavigate('jobs-feed')}
                        className="px-4 py-2 bg-[#7B2D42] hover:bg-[#7B1C3E] text-white rounded-full text-xs font-bold transition-all shadow-lg shadow-primary/20 active:scale-95"
                      >
                        Send Price
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 font-black text-base">Recent Activity</h3>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-600 text-[10px] font-bold">Live</span>
            </div>
          </div>

          <div className="space-y-3">
            {activityFeed.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + i * 0.06 }}
                  className={`border rounded-xl p-4 ${item.color}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.iconColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-slate-800 font-bold text-sm leading-tight">{item.message}</p>
                        <span className="text-slate-400 text-[10px] font-medium shrink-0">{item.time}</span>
                      </div>
                      <p className="text-slate-500 text-xs font-medium mt-0.5 leading-tight">{item.sub}</p>
                    </div>
                  </div>
                  {item.action && (
                    <div className="mt-3 flex justify-end">
                      <button className="text-xs font-bold text-slate-600 hover:text-primary transition-colors flex items-center gap-1">
                        {item.action} <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Safety Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-[#7B2D42]/5 border border-[#7B2D42]/15 rounded-2xl p-5"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#7B2D42] shrink-0 mt-0.5" />
            <div>
              <p className="text-[#7B2D42] font-bold text-sm mb-1">Houzii Safety Reminder</p>
              <p className="text-[#7B2D42]/70 text-xs font-medium leading-relaxed">
                Never accept cash outside the app. Your payment is only guaranteed when Escrow is funded.
                All jobs booked through Houzii are protected.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
