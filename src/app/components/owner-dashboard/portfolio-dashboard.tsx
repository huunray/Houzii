import React from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp, Wallet, Wrench, ChevronRight, ArrowUpRight,
  Plus, UserSearch, ClipboardList, Users, Star, MapPin
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

const activeAssets = [
  {
    id: 1,
    title: '3-Bed Duplex, Lekki Phase 1',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=80',
    performance: '95% Occupied',
    performanceColor: 'bg-green-500',
    rent: '₦3.5M/yr',
    location: 'Lekki, Lagos',
  },
  {
    id: 2,
    title: '2-Bed Flat, Victoria Island',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80',
    performance: '12 Inquiries',
    performanceColor: 'bg-blue-500',
    rent: '₦2.8M/yr',
    location: 'VI, Lagos',
  },
  {
    id: 3,
    title: 'Land (1200sqm), Banana Island',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80',
    performance: '3 Offers',
    performanceColor: 'bg-amber-500',
    rent: '₦150M',
    location: 'Ikoyi, Lagos',
  },
  {
    id: 4,
    title: '4-Bed Duplex, Maitama',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80',
    performance: '100% Occupied',
    performanceColor: 'bg-green-500',
    rent: '₦5M/yr',
    location: 'Maitama, Abuja',
  },
];

const quickActions = [
  { id: 'create', label: 'Create Listing', icon: Plus, color: 'bg-primary/10 text-primary' },
  { id: 'screen', label: 'Screen Tenant', icon: UserSearch, color: 'bg-blue-50 text-blue-500' },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench, color: 'bg-amber-50 text-amber-500' },
  { id: 'assign', label: 'Assign Agent', icon: Users, color: 'bg-green-50 text-green-500' },
];

export const PortfolioDashboard: React.FC = () => {
  return (
    <div className="pb-6">
      {/* Financial Health Card */}
      <div className="px-6 pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-[24px] p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-white/60" />
                <span className="text-white/60 text-sm font-bold">Financial Health</span>
              </div>
              <span className="text-white/40 text-xs font-bold">YTD 2026</span>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">Total Rent Collected</p>
                <h2 className="text-white font-black text-3xl tracking-tight">&#8358;18.5M</h2>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-green-400 text-xs font-bold">+23% vs last year</span>
                </div>
              </div>
              <div>
                <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">Pending Maintenance</p>
                <h2 className="text-white font-black text-3xl tracking-tight">3</h2>
                <div className="flex items-center gap-1 mt-1">
                  <Wrench className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-400 text-xs font-bold">2 urgent requests</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/30">
                View Reports <ArrowUpRight className="w-4 h-4" />
              </button>
              <button className="flex-1 py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 backdrop-blur-sm border border-white/10">
                Collect Rent <Wallet className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mb-8">
        <h3 className="text-slate-900 font-black text-lg mb-4">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="flex flex-col items-center gap-2 p-4 bg-white border border-slate-200 rounded-2xl hover:shadow-md hover:border-slate-300 transition-all"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${action.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-slate-600 text-[10px] font-bold text-center leading-tight">{action.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Portfolio Overview - Active Assets */}
      <div className="px-6 mb-8">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-slate-900 font-black text-lg">Active Assets</h3>
          <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
          {activeAssets.map((asset, i) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="min-w-[260px] bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all shrink-0"
            >
              <div className="relative h-36">
                <ImageWithFallback
                  src={asset.image}
                  alt={asset.title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute top-3 left-3 px-3 py-1 ${asset.performanceColor} rounded-full`}>
                  <span className="text-white text-[10px] font-black">{asset.performance}</span>
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-slate-800 font-bold text-sm mb-1 truncate">{asset.title}</h4>
                <div className="flex items-center gap-1 mb-2">
                  <MapPin className="w-3 h-3 text-slate-300" />
                  <span className="text-slate-400 text-xs font-medium">{asset.location}</span>
                </div>
                <p className="text-primary font-black text-sm">{asset.rent}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Performance Summary */}
      <div className="px-6">
        <h3 className="text-slate-900 font-black text-lg mb-4">Portfolio Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Assets', value: '4', icon: ClipboardList },
            { label: 'Occupancy Rate', value: '92%', icon: TrendingUp },
            { label: 'Active Tenants', value: '6', icon: Users },
            { label: 'Avg. Rating', value: '4.9', icon: Star },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="bg-white border border-slate-200 rounded-xl p-4"
              >
                <Icon className="w-4 h-4 text-slate-300 mb-2" />
                <p className="text-slate-900 font-black text-xl">{stat.value}</p>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
