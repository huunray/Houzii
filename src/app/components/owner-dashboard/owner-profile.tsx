import React from 'react';
import { motion } from 'motion/react';
import {
  User, ShieldCheck, MapPin, Phone, Mail,
  ChevronRight, Award, Home, Building2, Edit3, FileText
} from 'lucide-react';

export const OwnerProfile: React.FC = () => {
  return (
    <div className="pb-6">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-black text-2xl border-4 border-white shadow-lg">
            NK
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-slate-900 font-black text-xl">Nkechi Kalu</h2>
              <ShieldCheck className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-slate-400 text-sm font-medium">Property Owner</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded-full">4 Properties</span>
              <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-black rounded-full">6 Tenants</span>
            </div>
          </div>
          <button className="p-2.5 bg-slate-50 border border-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Trust Center */}
      <div className="px-6 pt-6">
        <h3 className="text-slate-900 font-black text-lg mb-4">Trust Center</h3>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-green-800 font-black text-sm">Trust Tier 1</p>
              <p className="text-green-600 text-xs font-medium">Basic Verified Owner</p>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Identity Verified', done: true },
              { label: 'Phone Verified', done: true },
              { label: 'Title Documents', done: false },
              { label: 'Address Verified', done: false },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  item.done ? 'bg-green-500' : 'bg-slate-200'
                }`}>
                  {item.done && <ShieldCheck className="w-2.5 h-2.5 text-white" />}
                </div>
                <span className={`text-xs font-bold ${item.done ? 'text-green-700' : 'text-slate-400'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm transition-all">
            Verify Title Documents
          </button>
        </motion.div>

        {/* Upgrade Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6"
        >
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-800 text-sm font-bold mb-1">Unlock Premium Features</p>
              <p className="text-amber-600 text-xs font-medium">
                Verify your title documents to enable Automated Rent Collection, Digital Lease Signing, and the Verified Owner badge on your listings.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Profile Info */}
        <h3 className="text-slate-900 font-black text-lg mb-4">Profile Details</h3>
        <div className="space-y-3">
          {[
            { icon: Home, label: 'Account Type', value: 'Property Owner' },
            { icon: Building2, label: 'Properties', value: '4 active listings' },
            { icon: MapPin, label: 'Primary Location', value: 'Lagos, Nigeria' },
            { icon: Phone, label: 'Phone', value: '+234 803 456 7890' },
            { icon: Mail, label: 'Email', value: 'nkechi@email.com' },
            { icon: FileText, label: 'Listing Goal', value: 'Rent & Sell' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-slate-400" />
                </div>
                <div className="flex-1">
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{item.label}</p>
                  <p className="text-slate-800 text-sm font-bold">{item.value}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </motion.div>
            );
          })}
        </div>

        {/* Subscription */}
        <div className="mt-8">
          <h3 className="text-slate-900 font-black text-lg mb-4">Subscription</h3>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-primary/5 to-primary/[0.02] border border-primary/15 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <Award className="w-6 h-6 text-primary" />
              <div>
                <p className="text-slate-800 font-bold text-sm">Owner Basic Plan</p>
                <p className="text-slate-400 text-xs font-medium">5% commission on transactions</p>
              </div>
            </div>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-primary font-black text-2xl">Free</span>
              <span className="text-slate-400 text-sm font-medium">+ transaction fees</span>
            </div>
            <button className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-sm transition-all">
              Upgrade to Premium
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
