import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Wrench, ShieldCheck, Check, Clock, ChevronRight,
  AlertTriangle, MapPin, User, Phone, MessageCircle
} from 'lucide-react';

const serviceRequests = [
  {
    id: 1,
    title: 'Plumbing Issue in Unit 4',
    property: '3-Bed Duplex, Lekki Phase 1',
    priority: 'urgent' as const,
    provider: {
      name: 'Kehinde Plumbing Services',
      type: 'Artisan',
      verified: true,
      rating: 4.8,
    },
    escrowStatus: {
      stage: 2, // 0-indexed: 0=held, 1=work-in-progress, 2=confirmed, 3=released
      amount: '₦85,000',
    },
    reportedDate: 'Mar 12, 2026',
    status: 'in-progress' as const,
  },
  {
    id: 2,
    title: 'Electrical Wiring Inspection',
    property: '2-Bed Flat, Victoria Island',
    priority: 'medium' as const,
    provider: {
      name: 'PowerFix Nigeria Ltd',
      type: 'Artisan',
      verified: true,
      rating: 4.6,
    },
    escrowStatus: {
      stage: 1,
      amount: '₦120,000',
    },
    reportedDate: 'Mar 14, 2026',
    status: 'in-progress' as const,
  },
  {
    id: 3,
    title: 'Title Deed Verification',
    property: 'Land (1200sqm), Banana Island',
    priority: 'low' as const,
    provider: {
      name: 'Adeyemi & Partners (SAN)',
      type: 'Lawyer',
      verified: true,
      rating: 4.9,
    },
    escrowStatus: {
      stage: 3,
      amount: '₦250,000',
    },
    reportedDate: 'Mar 5, 2026',
    status: 'completed' as const,
  },
  {
    id: 4,
    title: 'Land Survey & Documentation',
    property: '4-Bed Duplex, Maitama',
    priority: 'medium' as const,
    provider: {
      name: 'GeoMap Surveyors',
      type: 'Surveyor',
      verified: true,
      rating: 4.7,
    },
    escrowStatus: {
      stage: 0,
      amount: '₦180,000',
    },
    reportedDate: 'Mar 15, 2026',
    status: 'pending' as const,
  },
];

const escrowStages = [
  'Fee in Escrow',
  'Work Started',
  'Work Confirmed',
  'Funds Released',
];

export const MaintenanceTracker: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'urgent' | 'in-progress' | 'completed'>('all');

  const filtered = serviceRequests.filter(r => {
    if (filter === 'all') return true;
    if (filter === 'urgent') return r.priority === 'urgent';
    return r.status === filter;
  });

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6 border-b border-slate-100">
        <h2 className="text-slate-900 font-black text-2xl mb-1">Service Requests</h2>
        <p className="text-slate-400 font-medium text-sm">Track maintenance issues and professional services</p>
      </div>

      <div className="px-6 pt-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Active Issues', value: '3', color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200' },
            { label: 'In Escrow', value: '₦435K', color: 'text-primary', bg: 'bg-primary/5 border-primary/15' },
            { label: 'Resolved', value: '12', color: 'text-green-500', bg: 'bg-green-50 border-green-200' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`${stat.bg} border rounded-xl p-4`}
            >
              <p className={`font-black text-xl ${stat.color}`}>{stat.value}</p>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {[
            { key: 'all' as const, label: 'All' },
            { key: 'urgent' as const, label: 'Urgent' },
            { key: 'in-progress' as const, label: 'In Progress' },
            { key: 'completed' as const, label: 'Completed' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                filter === f.key
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Service Requests */}
        <div className="space-y-4">
          {filtered.map((request, i) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all"
            >
              {/* Request Header */}
              <div className="p-5 pb-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    request.priority === 'urgent' ? 'bg-red-50 text-red-500' :
                    request.priority === 'medium' ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500'
                  }`}>
                    {request.priority === 'urgent' ? <AlertTriangle className="w-5 h-5" /> : <Wrench className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="text-slate-800 font-bold text-sm">{request.title}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        request.priority === 'urgent' ? 'bg-red-50 text-red-500' :
                        request.priority === 'medium' ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500'
                      }`}>
                        {request.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-300" />
                      <span className="text-slate-400 text-xs font-medium">{request.property}</span>
                    </div>
                    <span className="text-slate-300 text-[10px] font-medium">Reported: {request.reportedDate}</span>
                  </div>
                </div>

                {/* Service Provider */}
                <div className="bg-slate-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-slate-800 text-sm font-bold">{request.provider.name}</p>
                        {request.provider.verified && (
                          <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-green-50 border border-green-200 rounded-full">
                            <ShieldCheck className="w-3 h-3 text-green-500" />
                            <span className="text-green-600 text-[9px] font-black">Verified</span>
                          </div>
                        )}
                      </div>
                      <p className="text-slate-400 text-xs font-medium">{request.provider.type} · {request.provider.rating} rating</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors">
                        <Phone className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600 hover:bg-green-100 transition-colors">
                        <MessageCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Escrow Progress */}
              <div className="bg-slate-50 border-t border-slate-100 px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-slate-500 text-xs font-bold">Escrow: {request.escrowStatus.amount}</p>
                  <span className={`text-[10px] font-black uppercase ${
                    request.status === 'completed' ? 'text-green-500' :
                    request.status === 'in-progress' ? 'text-amber-500' : 'text-slate-400'
                  }`}>
                    {request.status === 'completed' ? 'Released' : request.status === 'in-progress' ? 'In Progress' : 'Pending'}
                  </span>
                </div>

                <div className="relative">
                  <div className="flex items-center justify-between relative">
                    <div className="absolute top-3.5 left-4 right-4 h-0.5 bg-slate-200 z-0" />
                    <div
                      className="absolute top-3.5 left-4 h-0.5 bg-primary z-0 transition-all duration-500"
                      style={{ width: `${(request.escrowStatus.stage / (escrowStages.length - 1)) * (100 - 8)}%` }}
                    />
                    {escrowStages.map((stage, si) => (
                      <div key={stage} className="relative z-10 flex flex-col items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                          si <= request.escrowStatus.stage
                            ? 'bg-primary border-primary text-white'
                            : 'bg-white border-slate-200 text-slate-300'
                        }`}>
                          {si <= request.escrowStatus.stage ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                        </div>
                        <p className={`text-[8px] font-bold mt-1.5 text-center max-w-[60px] leading-tight ${
                          si <= request.escrowStatus.stage ? 'text-slate-600' : 'text-slate-300'
                        }`}>
                          {stage}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
