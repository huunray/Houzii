import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, MapPin, Bed, Bath, ChevronRight, Clock,
  FileText, CreditCard, CalendarCheck, CheckCircle2,
  Building2, Eye, ShieldCheck, Key, Pen, XCircle
} from 'lucide-react';


type ApplicationStatus = 'reviewing' | 'lease_ready' | 'lease_declined' | 'awaiting_payment' | 'payment_complete' | 'lease_signed' | 'awaiting_handover' | 'handover_ready' | 'verifying' | 'deal_closed' | 'move_in_scheduled';
type HomeStatus = 'active' | 'ended';

interface Application {
  id: number;
  property: string;
  location: string;
  image: string;
  beds: number;
  baths: number;
  rent: string;
  status: ApplicationStatus;
  agent: string;
  appliedDate: string;
  paymentDeadline?: Date;
}

interface MyHome {
  id: number;
  property: string;
  location: string;
  image: string;
  beds: number;
  baths: number;
  rent: string;
  status: HomeStatus;
  moveInDate: string;
  leaseEnd: string;
}

const statusConfig: Record<ApplicationStatus, { label: string; color: string; icon: React.ElementType }> = {
  reviewing: { label: 'Reviewing Application', color: 'bg-amber-50 text-amber-600 border-amber-200', icon: Clock },
  lease_ready: { label: 'Lease Ready to Review', color: 'bg-blue-50 text-blue-600 border-blue-200', icon: FileText },
  lease_declined: { label: 'Lease Declined', color: 'bg-slate-50 text-slate-500 border-slate-200', icon: XCircle },
  awaiting_payment: { label: 'Lease Accepted · Awaiting Payment', color: 'bg-purple-50 text-purple-600 border-purple-200', icon: CreditCard },
  payment_complete: { label: 'Payment Confirmed · Sign Lease', color: 'bg-blue-50 text-blue-600 border-blue-200', icon: Pen },
  lease_signed: { label: 'Lease Signed · Schedule Handover', color: 'bg-[hsl(var(--escrow-green))]/10 text-[hsl(var(--escrow-green))] border-[hsl(var(--escrow-green))]/20', icon: CalendarCheck },
  awaiting_handover: { label: 'Awaiting Agent Handover Approval', color: 'bg-amber-50 text-amber-600 border-amber-200', icon: Clock },
  handover_ready: { label: 'Handover Ready', color: 'bg-[hsl(var(--escrow-green))]/10 text-[hsl(var(--escrow-green))] border-[hsl(var(--escrow-green))]/20', icon: Key },
  verifying: { label: 'Verifying Property', color: 'bg-blue-50 text-blue-600 border-blue-200', icon: Eye },
  deal_closed: { label: 'Deal Closed', color: 'bg-[hsl(var(--escrow-green))]/10 text-[hsl(var(--escrow-green))] border-[hsl(var(--escrow-green))]/20', icon: CheckCircle2 },
  move_in_scheduled: { label: 'Move-in Scheduled', color: 'bg-[hsl(var(--escrow-green))]/10 text-[hsl(var(--escrow-green))] border-[hsl(var(--escrow-green))]/20', icon: CalendarCheck },
};


const useCountdown = (targetDate: Date | undefined) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    if (!targetDate) return 0;
    return Math.max(0, targetDate.getTime() - Date.now());
  });

  useEffect(() => {
    if (!targetDate || timeLeft <= 0) return;
    const interval = setInterval(() => {
      const diff = targetDate.getTime() - Date.now();
      setTimeLeft(Math.max(0, diff));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate, timeLeft]);

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  const pad = (n: number) => String(n).padStart(2, '0');

  return { display: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`, expired: timeLeft <= 0 };
};

const mockApplications: Application[] = [
  {
    id: 1,
    property: '2 Bed Serviced Apartment',
    location: 'Victoria Island, Lagos',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
    beds: 2,
    baths: 2,
    rent: '₦4.5M/yr',
    status: 'lease_ready',
    agent: 'Joy Adeyemi',
    appliedDate: 'Mar 20, 2026',
  },
  {
    id: 2,
    property: '3 Bed Penthouse Suite',
    location: 'Ikoyi, Lagos',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
    beds: 3,
    baths: 3,
    rent: '₦8M/yr',
    status: 'reviewing',
    agent: 'Chinedu Okafor',
    appliedDate: 'Mar 22, 2026',
  },
];

const mockHomes: MyHome[] = [
  {
    id: 1,
    property: '1 Bed Studio Apartment',
    location: 'Lekki Phase 1, Lagos',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
    beds: 1,
    baths: 1,
    rent: '₦1.8M/yr',
    status: 'active',
    moveInDate: 'Jan 15, 2025',
    leaseEnd: 'Jan 14, 2026',
  },
];

interface ApplicationCardProps {
  app: Application;
  index: number;
  onViewLease?: (id: number) => void;
  onViewSignedLease?: (id: number) => void;
  onPayment?: (id: number) => void;
  onSignLease?: (id: number) => void;
  onViewProperty?: (id: number) => void;
  onScheduleHandover?: (id: number) => void;
  onReviewVerify?: (id: number) => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ app, index, onViewLease, onViewSignedLease, onPayment, onSignLease, onViewProperty, onScheduleHandover, onReviewVerify }) => {
  const statusInfo = statusConfig[app.status];
  const StatusIcon = statusInfo.icon;
  const countdown = useCountdown(app.paymentDeadline);
  const showAccepted = app.status === 'awaiting_payment' || app.status === 'payment_complete' || app.status === 'lease_signed' || app.status === 'awaiting_handover' || app.status === 'handover_ready' || app.status === 'verifying' || app.status === 'move_in_scheduled' || app.status === 'deal_closed';


  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all"
    >
      <div className="flex">
        <div className="w-28 h-full shrink-0">
          <img src={app.image} alt={app.property} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h4 className="text-slate-900 font-bold text-sm truncate">{app.property}</h4>
              <p className="text-slate-400 text-xs font-medium flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" /> {app.location}
              </p>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex items-center gap-2 flex-wrap mb-3">
            {showAccepted && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-[hsl(var(--escrow-green))]/10 text-[hsl(var(--escrow-green))] border-[hsl(var(--escrow-green))]/20">
                <CheckCircle2 className="w-3 h-3" />
                Application Accepted
              </div>
            )}
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusInfo.color}`}>
              <StatusIcon className="w-3 h-3" />
              {statusInfo.label}
            </div>
          </div>

          {/* 48h Countdown Timer for awaiting_payment */}
          {app.status === 'awaiting_payment' && app.paymentDeadline && (
            <div className="mb-3 p-2.5 rounded-xl bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span className="text-primary font-black text-sm tracking-wide">{countdown.display}</span>
                <span className="text-primary/60 text-[10px] font-bold uppercase">remaining</span>
              </div>
              <p className="text-slate-500 text-[10px] font-medium leading-tight">
                Lease accepted. Pay into escrow within 48 hours to lock the property in your name.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-slate-500 text-xs">
                <Bed className="w-3.5 h-3.5" /> {app.beds}
              </div>
              <div className="flex items-center gap-1 text-slate-500 text-xs">
                <Bath className="w-3.5 h-3.5" /> {app.baths}
              </div>
            </div>
            <span className="text-slate-900 font-black text-sm">{app.rent}</span>
          </div>

          {/* Contextual CTA */}
          <div className="mt-3 pt-3 border-t border-slate-100">
            {app.status === 'lease_ready' ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onViewLease?.(app.id)}
                  className="h-11 px-5 bg-primary active:bg-primary text-white rounded-full font-bold text-xs shadow-sm shadow-primary/20 transition-all active:scale-[0.98] flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Review Lease
                  <ChevronRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onViewProperty?.(app.id)}
                  className="h-11 px-4 text-primary hover:bg-primary/5 rounded-full font-bold text-xs transition-all active:scale-[0.98] flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Property
                </button>
              </div>
            ) : app.status === 'awaiting_payment' ? (
              <button
                onClick={() => onPayment?.(app.id)}
                className="h-11 px-5 bg-primary active:bg-primary text-white rounded-full font-bold text-xs shadow-sm shadow-primary/20 transition-all active:scale-[0.98] flex items-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" />
                Make Payment
                <ChevronRight className="w-3 h-3" />
              </button>
            ) : app.status === 'payment_complete' ? (
              <button
                onClick={() => onSignLease?.(app.id)}
                className="h-11 px-5 bg-primary active:bg-primary text-white rounded-full font-bold text-xs shadow-sm shadow-primary/20 transition-all active:scale-[0.98] flex items-center gap-1.5"
              >
                <Pen className="w-3.5 h-3.5" />
                Sign Lease (Agent has signed)
                <ChevronRight className="w-3 h-3" />
              </button>
            ) : app.status === 'lease_signed' || app.status === 'move_in_scheduled' ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onScheduleHandover?.(app.id)}
                  className="h-11 px-5 bg-primary active:bg-primary text-white rounded-full font-bold text-xs shadow-sm shadow-primary/20 transition-all active:scale-[0.98] flex items-center gap-1.5"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  Schedule Handover
                  <ChevronRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onViewSignedLease?.(app.id)}
                  className="h-11 px-4 text-primary hover:bg-primary/5 rounded-full font-bold text-xs transition-all active:scale-[0.98] flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  View Signed Lease
                </button>
              </div>
            ) : app.status === 'awaiting_handover' ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-600 text-xs font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  Waiting for Agent {app.agent} to confirm your handover time
                </div>
                {/* Demo: simulate agent handover trigger */}
                <button
                  onClick={() => onReviewVerify?.(app.id)}
                  className="h-9 px-4 bg-[hsl(var(--escrow-green))]/10 text-[hsl(var(--escrow-green))] border border-[hsl(var(--escrow-green))]/20 rounded-full font-bold text-[10px] transition-all active:scale-[0.98] flex items-center gap-1.5"
                >
                  <Key className="w-3 h-3" />
                  Demo: Agent Confirmed Handover
                </button>
              </div>
            ) : app.status === 'handover_ready' ? (
              <button
                onClick={() => onReviewVerify?.(app.id)}
                className="h-11 px-5 bg-primary active:bg-primary text-white rounded-full font-bold text-xs shadow-sm shadow-primary/20 transition-all active:scale-[0.98] flex items-center gap-1.5"
              >
                <Key className="w-3.5 h-3.5" />
                Review & Verify
                <ChevronRight className="w-3 h-3" />
              </button>
            ) : app.status === 'deal_closed' ? (
              <div className="flex items-center gap-2 text-[hsl(var(--escrow-green))] text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Deal Closed — Funds Released
              </div>
            ) : app.status === 'lease_declined' ? (
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                <XCircle className="w-3.5 h-3.5" />
                You declined this lease — application withdrawn
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                <Clock className="w-3.5 h-3.5" />
                Applied {app.appliedDate} • Agent {app.agent}
              </div>
            )}
          </div>

        </div>
      </div>
    </motion.div>
  );
};

interface MyPropertiesPanelProps {
  onViewLease?: (applicationId: number) => void;
  onViewSignedLease?: (applicationId: number) => void;
  onPayment?: (applicationId: number) => void;
  onSignLease?: (applicationId: number) => void;
  onViewProperty?: (propertyId: number) => void;
  onLeaseSigned?: (applicationId: number) => void;
  onScheduleHandover?: (applicationId: number) => void;
  onReviewVerify?: (applicationId: number) => void;
  onGetSettled?: (propertyTitle: string) => void;
  signedApplicationIds?: number[];
  applicationStatuses?: Record<number, ApplicationStatus>;
}

export const MyPropertiesPanel: React.FC<MyPropertiesPanelProps> = ({
  onViewLease,
  onViewSignedLease,
  onPayment,
  onSignLease,
  onViewProperty,
  signedApplicationIds = [],
  applicationStatuses = {},
  onScheduleHandover,
  onReviewVerify,
  onGetSettled,
}) => {
  const [activeSection, setActiveSection] = useState<'applications' | 'homes'>('applications');

  const applicationsWithState = mockApplications.map(app => {
    // Override status from parent if provided
    if (applicationStatuses[app.id]) {
      const overrideStatus = applicationStatuses[app.id];
      return { ...app, status: overrideStatus, ...(overrideStatus === 'awaiting_payment' ? { paymentDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000) } : {}) };
    }
    if (signedApplicationIds.includes(app.id) && app.status === 'lease_ready') {
      return { ...app, status: 'awaiting_payment' as ApplicationStatus, paymentDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000) };
    }
    return app;
  });


  return (
    <div className="pb-6">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6 border-b border-slate-100">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-slate-900 font-black text-2xl">My Properties</h2>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 border border-primary/15 rounded-full">
              <Building2 className="w-4 h-4 text-primary" />
              <span className="text-primary text-xs font-black">{mockApplications.length + mockHomes.length}</span>
            </div>
          </div>
          <p className="text-slate-400 font-medium">
            Your applications and current homes
          </p>
        </motion.div>

        {/* Sub-section Toggle */}
        <div className="mt-5 flex gap-2 bg-slate-100 rounded-2xl p-1 h-11">
          <button
            onClick={() => setActiveSection('applications')}
            className={`flex-1 flex items-center justify-center rounded-xl font-bold text-sm transition-all relative ${
              activeSection === 'applications'
                ? 'bg-primary text-white shadow-lg shadow-primary/15'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Applications
            {activeSection !== 'applications' && mockApplications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[hsl(var(--escrow-amber))] text-white text-[10px] font-black rounded-full flex items-center justify-center">
                {mockApplications.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveSection('homes')}
            className={`flex-1 flex items-center justify-center rounded-xl font-bold text-sm transition-all ${
              activeSection === 'homes'
                ? 'bg-primary text-white shadow-lg shadow-primary/15'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            My Homes
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <AnimatePresence mode="wait">
          {activeSection === 'applications' ? (
            <motion.div
              key="applications"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-4"
            >
              {mockApplications.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-400 font-bold text-sm">No applications yet</p>
                  <p className="text-slate-300 text-xs font-medium mt-1">Apply to rent after viewing a property</p>
                </div>
              ) : (
                applicationsWithState.map((app, i) => (
                  <ApplicationCard
                    key={app.id}
                    app={app}
                    index={i}
                    onViewLease={onViewLease}
                    onViewSignedLease={onViewSignedLease}
                    onPayment={onPayment}
                    onSignLease={onSignLease}

                    onViewProperty={onViewProperty}
                    onScheduleHandover={onScheduleHandover}
                    onReviewVerify={onReviewVerify}
                  />
                ))
              )}
            </motion.div>
          ) : (
            <motion.div
              key="homes"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-4"
            >
              {mockHomes.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <Home className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-400 font-bold text-sm">No current homes</p>
                  <p className="text-slate-300 text-xs font-medium mt-1">Completed rentals will appear here</p>
                </div>
              ) : (
                mockHomes.map((home, i) => (
                  <motion.div
                    key={home.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all"
                  >
                    <div className="flex">
                      <div className="w-28 h-full shrink-0">
                        <img src={home.image} alt={home.property} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-slate-900 font-bold text-sm truncate">{home.property}</h4>
                            <p className="text-slate-400 text-xs font-medium flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3" /> {home.location}
                            </p>
                          </div>
                          <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            home.status === 'active'
                              ? 'bg-[hsl(var(--escrow-green))]/10 text-[hsl(var(--escrow-green))] border-[hsl(var(--escrow-green))]/20'
                              : 'bg-slate-100 text-slate-400 border-slate-200'
                          }`}>
                            {home.status === 'active' ? 'Active Lease' : 'Ended'}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-1 text-slate-500 text-xs">
                            <Bed className="w-3.5 h-3.5" /> {home.beds}
                          </div>
                          <div className="flex items-center gap-1 text-slate-500 text-xs">
                            <Bath className="w-3.5 h-3.5" /> {home.baths}
                          </div>
                          <span className="text-slate-900 font-black text-sm ml-auto">{home.rent}</span>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div className="text-xs text-slate-400 font-medium">
                            <span className="font-bold text-slate-600">Move-in:</span> {home.moveInDate}
                          </div>
                          <div className="text-xs text-slate-400 font-medium">
                            <span className="font-bold text-slate-600">Ends:</span> {home.leaseEnd}
                          </div>
                        </div>
                        {home.status === 'active' && onGetSettled && (
                          <button
                            onClick={() => onGetSettled(`${home.property}, ${home.location}`)}
                            className="mt-3 w-full h-10 bg-primary/5 hover:bg-primary/10 text-primary border border-primary/15 rounded-full font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                          >
                            ✨ Get Settled — Book Services
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
