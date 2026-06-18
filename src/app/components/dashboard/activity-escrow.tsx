import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Home, Search, Activity, Wallet, User,
  ShieldCheck, Shield, MapPin, Clock, CheckCircle,
  ArrowRight, ChevronRight, Calendar, Eye, FileText
} from 'lucide-react';

interface ActivityEscrowProps {
  onNavigate: (screen: string) => void;
  activeTab: string;
}

const activeOffers = [
  {
    id: 1,
    property: '3 Bedroom Luxury Apartment',
    location: 'Lekki Phase 1, Lagos',
    amount: '₦4.5M/yr',
    status: 'inspection',
    image: 'https://images.unsplash.com/photo-1633119712778-30d94755de54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBMYWdvcyUyMGludGVyaW9yJTIwZGVzaWdufGVufDF8fHx8MTc3MzYyNjcyMnww&ixlib=rb-4.1.0&q=80&w=1080',
    milestones: [
      { id: 'deposit', label: 'Deposit Secured', completed: true, date: 'Mar 10' },
      { id: 'inspection', label: 'Inspection Complete', completed: true, date: 'Mar 13' },
      { id: 'legal', label: 'Legal Review', completed: false, active: true, date: 'In Progress' },
      { id: 'handover', label: 'Final Handover', completed: false, date: 'Pending' },
    ],
  },
  {
    id: 2,
    property: 'Penthouse Suite',
    location: 'Victoria Island, Lagos',
    amount: '₦120K/night',
    status: 'deposit',
    image: 'https://images.unsplash.com/photo-1770254386076-1997b2e90365?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwZW50aG91c2UlMjB0ZXJyYWNlJTIwY2l0eSUyMHZpZXd8ZW58MXx8fHwxNzczNjI2NjA5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    milestones: [
      { id: 'deposit', label: 'Deposit Secured', completed: true, date: 'Mar 14' },
      { id: 'inspection', label: 'Inspection Complete', completed: false, active: true, date: 'Scheduled' },
      { id: 'legal', label: 'Legal Review', completed: false, date: 'Pending' },
      { id: 'handover', label: 'Final Handover', completed: false, date: 'Pending' },
    ],
  },
];

const inspections = [
  {
    id: 1,
    property: 'Modern 4-Bed Duplex',
    location: 'Banana Island, Lagos',
    date: 'Mar 18, 2026',
    time: '10:00 AM',
    status: 'upcoming',
    agent: 'Adaeze Nwosu',
  },
  {
    id: 2,
    property: '3 Bedroom Luxury Apartment',
    location: 'Lekki Phase 1, Lagos',
    date: 'Mar 13, 2026',
    time: '2:00 PM',
    status: 'completed',
    agent: 'Emeka Obi',
  },
  {
    id: 3,
    property: 'Executive Villa',
    location: 'Ikoyi, Lagos',
    date: 'Mar 20, 2026',
    time: '11:30 AM',
    status: 'upcoming',
    agent: 'Fatima Hassan',
  },
];

export const ActivityEscrow: React.FC<ActivityEscrowProps> = ({ onNavigate, activeTab }) => {
  const [currentTab, setCurrentTab] = useState<'offers' | 'inspections'>('offers');

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: Search },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-slate-900 font-black text-2xl">Activity</h1>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 border border-primary/15 rounded-full">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-primary text-xs font-black">Trust Protected</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-slate-100 rounded-2xl p-1.5">
          <button
            onClick={() => setCurrentTab('offers')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
              currentTab === 'offers'
                ? 'bg-primary text-white shadow-lg shadow-primary/15'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Active Offers
          </button>
          <button
            onClick={() => setCurrentTab('inspections')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
              currentTab === 'inspections'
                ? 'bg-primary text-white shadow-lg shadow-primary/15'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Inspections
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {currentTab === 'offers' ? (
          <div className="space-y-6">
            {/* Trust Shield Banner */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex-1">
                <p className="text-green-700 text-xs font-bold">Houzii Trust Shield Active</p>
                <p className="text-green-600/60 text-[11px] font-medium">All your transactions are protected with escrow</p>
              </div>
            </motion.div>

            {activeOffers.map((offer, i) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all"
              >
                {/* Property Info */}
                <div className="flex gap-4 p-4 border-b border-slate-100">
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 shadow-sm">
                    <img src={offer.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-slate-900 font-bold text-sm mb-1 truncate">{offer.property}</h4>
                    <p className="text-slate-400 text-xs font-medium flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3 shrink-0" /> {offer.location}
                    </p>
                    <p className="text-primary font-black text-lg">{offer.amount}</p>
                  </div>
                </div>

                {/* Milestone Tracker */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-5">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Escrow Milestone Tracker</span>
                  </div>

                  <div className="relative">
                    {offer.milestones.map((milestone, idx) => {
                      const isLast = idx === offer.milestones.length - 1;
                      return (
                        <div key={milestone.id} className="flex gap-4 relative">
                          {/* Connector Line */}
                          {!isLast && (
                            <div className="absolute left-[15px] top-8 w-0.5 h-[calc(100%-8px)]">
                              <div className={`w-full h-full ${milestone.completed ? 'bg-green-300' : 'bg-slate-200'}`} />
                            </div>
                          )}

                          {/* Node */}
                          <div className="relative z-10 shrink-0">
                            {milestone.completed ? (
                              <div className="w-[30px] h-[30px] rounded-full bg-green-50 flex items-center justify-center border-2 border-green-300">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              </div>
                            ) : (milestone as any).active ? (
                              <div className="w-[30px] h-[30px] rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/40 relative">
                                <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                              </div>
                            ) : (
                              <div className="w-[30px] h-[30px] rounded-full bg-slate-50 flex items-center justify-center border-2 border-slate-200">
                                <div className="w-2 h-2 rounded-full bg-slate-300" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className={`flex-1 pb-6 ${isLast ? 'pb-0' : ''}`}>
                            <div className="flex items-center justify-between">
                              <span className={`text-sm font-bold ${
                                milestone.completed ? 'text-slate-700' : (milestone as any).active ? 'text-slate-900' : 'text-slate-300'
                              }`}>
                                {milestone.label}
                              </span>
                              <span className={`text-[11px] font-bold ${
                                milestone.completed ? 'text-green-500' : (milestone as any).active ? 'text-primary' : 'text-slate-300'
                              }`}>
                                {milestone.date}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action */}
                <div className="px-5 pb-5">
                  <button className="w-full py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-slate-600 hover:text-slate-800 text-sm font-bold transition-all flex items-center justify-center gap-2 hover:shadow-sm">
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {inspections.map((inspection, i) => (
              <motion.div
                key={inspection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:border-slate-300 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-slate-900 font-bold text-sm mb-1">{inspection.property}</h4>
                    <p className="text-slate-400 text-xs font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {inspection.location}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    inspection.status === 'upcoming'
                      ? 'bg-blue-50 text-blue-500 border border-blue-200'
                      : 'bg-green-50 text-green-500 border border-green-200'
                  }`}>
                    {inspection.status}
                  </div>
                </div>

                <div className="flex items-center gap-6 mb-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-bold">{inspection.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-bold">{inspection.time}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-slate-500 text-xs font-bold">{inspection.agent}</span>
                  </div>
                  <button className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
                    {inspection.status === 'upcoming' ? 'Reschedule' : 'View Report'}
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-2 py-2 z-50">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${
                  isActive ? 'text-primary' : 'text-slate-300 hover:text-slate-500'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-bold">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabActivity"
                    className="w-1 h-1 rounded-full bg-primary"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
