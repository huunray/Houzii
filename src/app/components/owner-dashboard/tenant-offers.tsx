import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck, Check, X, MessageCircle, ChevronRight,
  Clock, AlertCircle, Bell, DollarSign
} from 'lucide-react';

const offers = [
  {
    id: 1,
    name: 'Chioma Adekunle',
    trustTier: 3,
    property: '3-Bed Duplex, Lekki Phase 1',
    offerPrice: '₦85,000,000',
    originalPrice: '₦90,000,000',
    time: '2 hours ago',
    avatar: 'CA',
  },
  {
    id: 2,
    name: 'Emmanuel Obi',
    trustTier: 2,
    property: 'Land (1200sqm), Banana Island',
    offerPrice: '₦145,000,000',
    originalPrice: '₦150,000,000',
    time: '5 hours ago',
    avatar: 'EO',
  },
  {
    id: 3,
    name: 'Fatima Yusuf',
    trustTier: 4,
    property: '2-Bed Flat, Victoria Island',
    offerPrice: '₦52,000,000',
    originalPrice: '₦55,000,000',
    time: '1 day ago',
    avatar: 'FY',
  },
];

const tenants = [
  {
    id: 1,
    name: 'Adaeze Nwosu',
    property: '3-Bed Duplex, Lekki Phase 1 - Unit A',
    leaseExpiry: 'Dec 2026',
    rentStatus: 'paid' as const,
    monthlyRent: '₦350,000',
    avatar: 'AN',
  },
  {
    id: 2,
    name: 'Babatunde Afolabi',
    property: '2-Bed Flat, Victoria Island - Apt 4B',
    leaseExpiry: 'Aug 2026',
    rentStatus: 'paid' as const,
    monthlyRent: '₦280,000',
    avatar: 'BA',
  },
  {
    id: 3,
    name: 'Grace Ekpenyong',
    property: '3-Bed Duplex, Lekki Phase 1 - Unit B',
    leaseExpiry: 'Mar 2026',
    rentStatus: 'overdue' as const,
    monthlyRent: '₦350,000',
    avatar: 'GE',
  },
  {
    id: 4,
    name: 'Ikechukwu Okafor',
    property: '4-Bed Duplex, Maitama - Main',
    leaseExpiry: 'Jun 2027',
    rentStatus: 'paid' as const,
    monthlyRent: '₦420,000',
    avatar: 'IO',
  },
];

export const TenantOffers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'offers' | 'tenants'>('offers');

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-4 border-b border-slate-100">
        <h2 className="text-slate-900 font-black text-2xl mb-1">Tenants & Offers</h2>
        <p className="text-slate-400 font-medium text-sm mb-5">Manage incoming offers and active tenants</p>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 rounded-full p-1">
          <button
            onClick={() => setActiveTab('offers')}
            className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all ${
              activeTab === 'offers'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Active Offers ({offers.length})
          </button>
          <button
            onClick={() => setActiveTab('tenants')}
            className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all ${
              activeTab === 'tenants'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Tenant Directory ({tenants.length})
          </button>
        </div>
      </div>

      <div className="px-6 pt-6">
        {activeTab === 'offers' && (
          <div className="space-y-4">
            {offers.map((offer, i) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {offer.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="text-slate-800 font-bold text-sm">{offer.name}</h4>
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 border border-green-200 rounded-full">
                        <ShieldCheck className="w-3 h-3 text-green-500" />
                        <span className="text-green-600 text-[10px] font-black">T{offer.trustTier}</span>
                      </div>
                    </div>
                    <p className="text-slate-400 text-xs font-medium truncate">{offer.property}</p>
                    <p className="text-slate-300 text-[10px] font-medium mt-0.5">{offer.time}</p>
                  </div>
                </div>

                {/* Offer Price */}
                <div className="bg-slate-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Offer Price</p>
                      <p className="text-primary font-black text-xl">{offer.offerPrice}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Listing Price</p>
                      <p className="text-slate-500 font-bold text-sm line-through">{offer.originalPrice}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" /> Accept
                  </button>
                  <button className="flex-1 py-3 bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                    <DollarSign className="w-4 h-4" /> Counter
                  </button>
                  <button className="py-3 px-4 bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 rounded-xl font-bold text-sm transition-all flex items-center justify-center">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'tenants' && (
          <div className="space-y-3">
            {tenants.map((tenant, i) => (
              <motion.div
                key={tenant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {tenant.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-slate-800 font-bold text-sm">{tenant.name}</h4>
                    <p className="text-slate-400 text-xs font-medium truncate">{tenant.property}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-300" />
                        <span className="text-slate-400 text-[10px] font-bold">Lease: {tenant.leaseExpiry}</span>
                      </div>
                      <span className="text-slate-200">|</span>
                      <span className="text-slate-500 text-[10px] font-bold">{tenant.monthlyRent}/mo</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      tenant.rentStatus === 'paid'
                        ? 'bg-green-50 text-green-600 border border-green-200'
                        : 'bg-red-50 text-red-500 border border-red-200'
                    }`}>
                      {tenant.rentStatus === 'paid' ? 'Paid' : 'Overdue'}
                    </div>
                    {tenant.rentStatus === 'overdue' && (
                      <button className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-[10px] font-bold flex items-center gap-1 hover:bg-primary/20 transition-colors">
                        <Bell className="w-3 h-3" /> Send Reminder
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
