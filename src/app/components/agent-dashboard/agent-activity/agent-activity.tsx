import React, { useState } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Clock, AlertCircle, ChevronRight,
  Calendar, MapPin, User, ArrowRight,
  FileCheck, Lock,
  CheckCircle2, Key, Tag, Eye
} from 'lucide-react';
import { AgentDocumentPortal } from './agent-document-portal';
import { SignatureWizard } from './signature-wizard';
import { MilestoneSuccessOverlay, MilestoneData } from './milestone-success-overlay';
import { InspectionRequestModal } from './inspection-request-modal';
import { toast } from 'sonner';
import { WalkthroughScheduler } from './walkthrough-scheduler';
import { DealProgressTracker, type TransactionStage } from '../transaction/deal-progress-tracker';
import { HandoverCard } from '../transaction/handover-card';
import type { ListingDeal } from '../agent-listings';

type Pipeline = 'rental' | 'sale';
type DealStage = 'funded' | 'acknowledged' | 'documented' | 'inspected' | 'released';

interface DealItem {
  id: number;
  pipeline: Pipeline;
  stage: DealStage;
  property: string;
  location: string;
  seekerName: string;
  amount: string;
  fundedAt: string;
  walkthroughDate?: string;
}

const initialDeals: DealItem[] = [
  {
    id: 1,
    pipeline: 'rental',
    stage: 'funded',
    property: '3 Bedroom Luxury Apartment',
    location: 'Lekki Phase 1, Lagos',
    seekerName: 'Adaeze M.',
    amount: '₦11,600,000',
    fundedAt: '2 hours ago',
  },
  {
    id: 2,
    pipeline: 'sale',
    stage: 'acknowledged',
    property: '4 Plots of Land - Epe',
    location: 'Epe, Lagos',
    seekerName: 'Emeka O.',
    amount: '₦45,000,000',
    fundedAt: '1 day ago',
  },
];

const recentActivities = [
  { id: 1, emoji: '💰', text: '₦11.6M secured in Escrow for 3 Bedroom Luxury Apartment.', time: '2 hours ago' },
  { id: 2, emoji: '📩', text: 'Adaeze M. funded the Total Move-In Package.', time: '2 hours ago' },
  { id: 3, emoji: '✅', text: 'You acknowledged payment for 4 Plots of Land - Epe.', time: '1 day ago' },
  { id: 4, emoji: '📄', text: 'Survey Plan uploaded for 4 Plots of Land - Epe.', time: '1 day ago' },
  { id: 5, emoji: '🔔', text: 'Emeka O. has been notified to sign the Deed of Assignment.', time: '23 hours ago' },
];

const inspectionRequests = [
  {
    id: 101,
    property: '3 Bedroom Luxury Apartment',
    location: 'Lekki Phase 1, Lagos',
    image: 'https://images.unsplash.com/photo-1633119712778-30d94755de54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBMYWdvcyUyMGludGVyaW9yJTIwZGVzaWdufGVufDF8fHx8MTc3MzYyNjcyMnww&ixlib=rb-4.1.0&q=80&w=1080',
    seekerName: 'Chiamaka N.',
    requestedDate: 'Friday, Apr 18th',
    requestedTime: '2:00 PM',
    funded: true,
    isNew: true,
  },
  {
    id: 102,
    property: '2 Bed Flat - Victoria Island',
    location: 'Victoria Island, Lagos',
    image: 'https://images.unsplash.com/photo-1770254386076-1997b2e90365?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwZW50aG91c2UlMjB0ZXJyYWNlJTIwY2l0eSUyMHZpZXd8ZW58MXx8fHwxNzczNjI2NjA5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    seekerName: 'Tunde A.',
    requestedDate: 'Monday, Apr 21st',
    requestedTime: '10:00 AM',
    funded: false,
    isNew: false,
  },
];

interface InspectionItem {
  id: number;
  property: string;
  location: string;
  date: string;
  time: string;
  type: 'standard' | 'final-walkthrough';
  seekerName: string;
  funded?: boolean;
}

const inspections: InspectionItem[] = [
  {
    id: 1,
    property: '3 Bed Apartment - Lekki Phase 1',
    location: 'Lekki Phase 1, Lagos',
    date: 'Apr 12, 2026',
    time: '10:00 AM',
    type: 'standard',
    seekerName: 'Adaeze M.',
  },
  {
    id: 2,
    property: '3 Bedroom Luxury Apartment',
    location: 'Lekki Phase 1, Lagos',
    date: 'Apr 15, 2026',
    time: '11:00 AM',
    type: 'final-walkthrough',
    seekerName: 'Adaeze M.',
    funded: true,
  },
  {
    id: 3,
    property: '2 Bed Flat - Victoria Island',
    location: 'Victoria Island, Lagos',
    date: 'Apr 10, 2026',
    time: '2:00 PM',
    type: 'standard',
    seekerName: 'Chioma K.',
  },
];

const stageLabels: Record<DealStage, string> = {
  funded: 'Acknowledged',
  acknowledged: 'Documents',
  documented: 'Inspection',
  inspected: 'Payout',
  released: 'Complete',
};

const stageOrder: DealStage[] = ['funded', 'acknowledged', 'documented', 'inspected', 'released'];

interface AgentActivityProps {
  deals?: ListingDeal[];
  onDealStageUpdate?: (listingId: number | string, stage: TransactionStage) => void;
}

export const AgentActivity: React.FC<AgentActivityProps> = ({ deals: transactionDeals = [], onDealStageUpdate }) => {
  const [currentTab, setCurrentTab] = useState<'todo' | 'recent' | 'inspections'>('todo');
  const [deals, setDeals] = useState<DealItem[]>(initialDeals);
  const [selectedDeal, setSelectedDeal] = useState<DealItem | null>(null);
  const [showDocPortal, setShowDocPortal] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [showWalkthroughScheduler, setShowWalkthroughScheduler] = useState(false);
  const [milestoneData, setMilestoneData] = useState<MilestoneData | null>(null);
  const [pendingRequests, setPendingRequests] = useState(inspectionRequests);
  const [selectedRequest, setSelectedRequest] = useState<typeof inspectionRequests[0] | null>(null);
  const [confirmedInspections, setConfirmedInspections] = useState(inspections);

  const advanceDealStage = (dealId: number) => {
    setDeals(prev => prev.map(d => {
      if (d.id !== dealId) return d;
      const currentIdx = stageOrder.indexOf(d.stage);
      if (currentIdx < stageOrder.length - 1) {
        return { ...d, stage: stageOrder[currentIdx + 1] };
      }
      return d;
    }));
  };

  const showMilestone = (deal: DealItem, milestone: MilestoneData['milestone']) => {
    setMilestoneData({
      pipeline: deal.pipeline,
      milestone,
      propertyName: deal.property,
      amount: deal.amount,
      seekerName: deal.seekerName,
    });
  };

  const handleAcknowledge = (deal: DealItem) => {
    advanceDealStage(deal.id);
    showMilestone(deal, 'acknowledged');
  };

  const handlePrepareDocuments = (deal: DealItem) => {
    setSelectedDeal(deal);
    setShowDocPortal(true);
  };

  const handleDocumentsSubmitted = () => {
    if (!selectedDeal) return;
    advanceDealStage(selectedDeal.id);
    setShowDocPortal(false);
    showMilestone(selectedDeal, 'documented');
  };

  const handleSignatureComplete = () => {
    setShowSignature(false);
    setShowDocPortal(true);
  };

  const handleScheduleWalkthrough = (deal: DealItem) => {
    setSelectedDeal(deal);
    setShowWalkthroughScheduler(true);
  };

  const handleWalkthroughScheduled = (date: Date, time: string) => {
    if (!selectedDeal) return;
    setDeals(prev => prev.map(d =>
      d.id === selectedDeal.id ? { ...d, walkthroughDate: `${format(date, 'MMM dd, yyyy')} at ${time}` } : d
    ));
    advanceDealStage(selectedDeal.id);
    setShowWalkthroughScheduler(false);
    showMilestone(selectedDeal, 'walkthrough_scheduled');
  };

  const handleHandoverComplete = (deal: DealItem) => {
    advanceDealStage(deal.id);
    showMilestone(deal, 'handover_complete');
  };

  const handleAcceptRequest = (req: typeof inspectionRequests[0]) => {
    setPendingRequests(prev => prev.filter(r => r.id !== req.id));
    setConfirmedInspections(prev => [
      {
        id: req.id,
        property: req.property,
        location: req.location,
        date: req.requestedDate,
        time: req.requestedTime,
        type: 'standard' as const,
        seekerName: req.seekerName,
        funded: req.funded,
      },
      ...prev,
    ]);
    setSelectedRequest(null);
    toast.success(`Inspection Confirmed. We've notified ${req.seekerName} and added this to your schedule.`);
  };

  const handleRescheduleRequest = (req: typeof inspectionRequests[0], _date: Date, time: string) => {
    setPendingRequests(prev => prev.map(r =>
      r.id === req.id ? { ...r, requestedTime: time, requestedDate: format(_date, 'EEEE, MMM do'), isNew: false } : r
    ));
    setSelectedRequest(null);
    toast('Proposed time sent. Awaiting seeker approval.');
  };

  const getStageIndex = (stage: DealStage) => stageOrder.indexOf(stage);

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6 border-b border-slate-100">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-slate-900 font-black text-2xl">Activity</h2>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 border border-primary/15 rounded-full">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-primary text-xs font-black">Trust Protected</span>
            </div>
          </div>
          <p className="text-slate-400 font-medium">
            Manage closing deals, documents, and handovers
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="mt-5 flex gap-1 bg-slate-100 rounded-xl p-1 h-11">
          {[
            { id: 'todo' as const, label: 'To-Do', count: deals.length + pendingRequests.length },
            { id: 'recent' as const, label: 'Recent Activities', count: recentActivities.length },
            { id: 'inspections' as const, label: 'Inspections', count: confirmedInspections.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex-1 flex items-center justify-center rounded-lg font-bold text-sm transition-all gap-1.5 ${
                currentTab === tab.id
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  currentTab === tab.id ? 'bg-primary/10 text-primary' : 'bg-slate-200 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <AnimatePresence mode="wait">
          {currentTab === 'todo' && (
            <motion.div
              key="todo"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              {/* Transaction Deal Cards */}
              {transactionDeals.filter(d => d.stage === 'walkthrough' || d.stage === 'payout').length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                      Handover & Payout
                    </span>
                  </div>
                  {transactionDeals.filter(d => d.stage === 'walkthrough' || d.stage === 'payout').map(deal => (
                    <HandoverCard
                      key={deal.listingId}
                      property={deal.applicant.profession}
                      seekerName={deal.applicant.name}
                      amount="₦450,000"
                      status={deal.stage === 'payout' ? 'deal_closed' : 'in_progress'}
                      onConfirmHandover={() => {
                        onDealStageUpdate?.(deal.listingId, 'payout');
                      }}
                      confirmationDeadline={new Date(Date.now() + 24 * 60 * 60 * 1000)}
                    />
                  ))}
                </div>
              )}
              {/* Payment confirmed cards */}
              {transactionDeals.filter(d => d.stage === 'payment').length > 0 && (
                <div className="space-y-4">
                  {transactionDeals.filter(d => d.stage === 'payment').map(deal => (
                    <motion.div key={deal.listingId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-[hsl(var(--escrow-green))]/30 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-[hsl(var(--escrow-green))]/10 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-[hsl(var(--escrow-green))]" />
                        </div>
                        <span className="text-[hsl(var(--escrow-green))] text-xs font-black">Payment Confirmed — Escrow Secured</span>
                      </div>
                      <p className="text-slate-800 font-bold text-sm">{deal.applicant.name}</p>
                      <p className="text-slate-400 text-xs mt-1">Awaiting seeker's lease signature and payment.</p>
                      <DealProgressTracker currentStage="payment" className="mt-4" />
                    </motion.div>
                  ))}
                </div>
              )}
              {/* Inspection Request Cards */}
              {pendingRequests.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                      Inspection Requests
                    </span>
                  </div>

                  {pendingRequests.map((req, i) => (
                    <motion.div
                      key={req.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`bg-white border rounded-2xl overflow-hidden hover:shadow-md transition-all relative ${
                        req.isNew ? 'border-primary/30 ring-2 ring-primary/10' : 'border-slate-200'
                      }`}
                    >
                      {/* New pulse indicator */}
                      {req.isNew && (
                        <div className="absolute top-3 left-3 z-10">
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
                          </span>
                        </div>
                      )}

                      {/* Priority Badge */}
                      {req.funded && (
                        <div className="absolute top-3 right-3 z-10">
                          <div className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full shadow-md shadow-amber-200/50">
                            <Shield className="w-3 h-3 text-amber-800" />
                            <span className="text-[9px] font-black text-amber-900 uppercase tracking-wider">Priority (Funded)</span>
                          </div>
                        </div>
                      )}

                      {/* Header */}
                      <div className="px-5 pt-5 pb-0">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3">
                          {req.funded ? '⭐ Priority Inspection' : 'Inspection Requested'}
                        </p>
                      </div>

                      {/* Property Info */}
                      <div className="flex gap-3 px-5 pb-3">
                        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-sm">
                          <img src={req.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-slate-900 font-bold text-sm truncate">{req.property}</h4>
                          <p className="text-slate-400 text-xs font-medium flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" /> {req.location}
                          </p>
                        </div>
                      </div>

                      {/* Date + Seeker */}
                      <div className="px-5 pb-3 flex items-center gap-4">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="text-xs font-bold">{req.requestedDate} @ {req.requestedTime}</span>
                        </div>
                      </div>

                      <div className="px-5 pb-4 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-slate-600 text-xs font-bold">{req.seekerName}</span>
                      </div>

                      {/* CTA */}
                      <div className="px-5 pb-5">
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="h-11 px-6 bg-primary hover:brightness-110 text-white rounded-full font-bold text-sm shadow-md shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 w-fit"
                        >
                          Respond to Request
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Pipeline Filter */}
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-[hsl(var(--escrow-amber))]" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  Priority Actions
                </span>
              </div>

              {deals.map((deal, i) => (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all"
                >
                  {/* Pipeline badge */}
                  <div className="px-5 pt-4 flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      deal.pipeline === 'rental'
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'bg-amber-50 text-amber-600 border border-amber-200'
                    }`}>
                      {deal.pipeline === 'rental' ? '🔑 Rental' : '🏷️ Sale'}
                    </span>
                    <span className="text-[10px] text-slate-300 font-bold">{deal.fundedAt}</span>
                  </div>

                  {/* Progress tracker */}
                  <div className="px-5 pt-4 pb-2">
                    <div className="flex items-center gap-1">
                      {stageOrder.slice(0, -1).map((stage, idx) => {
                        const current = getStageIndex(deal.stage);
                        const isComplete = idx < current;
                        const isCurrent = idx === current;
                        return (
                          <React.Fragment key={stage}>
                            <div className="flex-1 flex flex-col items-center gap-1">
                              <div className={`w-full h-1.5 rounded-full transition-all ${
                                isComplete ? 'bg-[hsl(var(--escrow-green))]' : isCurrent ? 'bg-primary' : 'bg-slate-100'
                              }`} />
                              <span className={`text-[8px] font-bold ${
                                isComplete ? 'text-[hsl(var(--escrow-green))]' : isCurrent ? 'text-primary' : 'text-slate-300'
                              }`}>
                                {stageLabels[stage]}
                              </span>
                            </div>
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>

                  {/* Deal info */}
                  <div className="p-5 pt-3">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        deal.pipeline === 'rental' ? 'bg-blue-50' : 'bg-amber-50'
                      }`}>
                        {deal.pipeline === 'rental' ? (
                          <Key className="w-5 h-5 text-blue-500" />
                        ) : (
                          <Tag className="w-5 h-5 text-amber-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-slate-900 font-bold text-sm">{deal.property}</h4>
                        <p className="text-slate-400 text-xs font-medium flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" /> {deal.location}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-slate-900 font-black text-sm">{deal.amount}</span>
                          <span className="text-slate-300">·</span>
                          <span className="text-slate-400 text-xs font-bold flex items-center gap-1">
                            <User className="w-3 h-3" /> {deal.seekerName}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stage-specific title and CTA */}
                    {deal.stage === 'funded' && (
                      <div>
                        <p className="text-slate-500 text-xs font-medium mb-3">
                          Payment Received: Acknowledge to begin {deal.pipeline === 'rental' ? 'Handover' : 'Title Transfer'}.
                        </p>
                        <button
                          onClick={() => handleAcknowledge(deal)}
                          className="h-11 px-6 bg-primary hover:brightness-110 text-white rounded-full font-bold text-sm shadow-md shadow-primary/20 transition-all active:scale-[0.98] flex items-center gap-2 w-fit"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Acknowledge Payment
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {deal.stage === 'acknowledged' && (
                      <div>
                        <p className="text-slate-500 text-xs font-medium mb-3">
                          {deal.pipeline === 'rental'
                            ? 'Prepare Handover: Upload documents and sign the Tenancy Agreement.'
                            : 'Initiate Title Transfer: Upload documents and prepare the Deed of Assignment.'}
                        </p>
                        <button
                          onClick={() => handlePrepareDocuments(deal)}
                          className="h-11 px-6 bg-primary hover:brightness-110 text-white rounded-full font-bold text-sm shadow-md shadow-primary/20 transition-all active:scale-[0.98] flex items-center gap-2 w-fit"
                        >
                          <FileCheck className="w-4 h-4" />
                          {deal.pipeline === 'rental' ? 'Prepare Handover & Documents' : 'Initiate Title Transfer'}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {deal.stage === 'documented' && (
                      <div>
                        <p className="text-slate-500 text-xs font-medium mb-3">
                          Documents submitted. Awaiting final walkthrough and key handover.
                        </p>
                        <button onClick={() => handleScheduleWalkthrough(deal)} className="h-11 px-6 border-2 border-primary text-primary hover:bg-primary/5 rounded-full font-bold text-sm transition-all active:scale-[0.98] flex items-center gap-2 w-fit">
                          <Calendar className="w-4 h-4" />
                          Schedule Final Walkthrough
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {deal.stage === 'inspected' && (
                      <div>
                        <p className="text-slate-500 text-xs font-medium mb-3">
                          Walkthrough complete. Mark the handover as done to trigger seeker confirmation.
                        </p>
                        <button
                          onClick={() => handleHandoverComplete(deal)}
                          className="h-11 px-6 bg-[hsl(var(--escrow-green))] hover:brightness-110 text-white rounded-full font-bold text-sm shadow-md shadow-[hsl(var(--escrow-green))]/20 transition-all active:scale-[0.98] flex items-center gap-2 w-fit"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Handover Complete
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {deal.stage === 'released' && (
                      <div className="flex items-center gap-3 p-3 bg-[hsl(var(--escrow-green))]/10 border border-[hsl(var(--escrow-green))]/20 rounded-xl">
                        <CheckCircle2 className="w-5 h-5 text-[hsl(var(--escrow-green))]" />
                        <span className="text-[hsl(var(--escrow-green))] font-bold text-sm">
                          Funds Released. Withdraw {deal.amount} to Wallet.
                        </span>
                      </div>
                    )}

                    {/* Oracle lock for sales */}
                    {deal.pipeline === 'sale' && deal.stage === 'acknowledged' && (
                      <div className="mt-3 flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                        <Lock className="w-4 h-4 text-amber-500" />
                        <span className="text-amber-600 text-[11px] font-bold">
                          Awaiting Human Oracle Verification of Title Documents
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {currentTab === 'recent' && (
            <motion.div
              key="recent"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  Recent Activity
                </span>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                {recentActivities.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-start gap-3 px-5 py-4 ${
                      i < recentActivities.length - 1 ? 'border-b border-slate-100' : ''
                    }`}
                  >
                    <span className="text-base shrink-0 mt-0.5">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 font-medium leading-relaxed">{item.text}</p>
                      <p className="text-[11px] text-slate-400 font-bold mt-1">{item.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {currentTab === 'inspections' && (
            <motion.div
              key="inspections"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-4"
            >
              {confirmedInspections.map((inspection, i) => (
                <motion.div
                  key={inspection.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`bg-white border rounded-2xl p-5 hover:shadow-md transition-all ${
                    inspection.type === 'final-walkthrough' && inspection.funded
                      ? 'border-amber-300 bg-amber-50/30'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-slate-900 font-bold text-sm">{inspection.property}</h4>
                        {inspection.type === 'final-walkthrough' && inspection.funded && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-600 border border-amber-300 rounded-full text-[9px] font-bold uppercase tracking-wider">
                            ⭐ Final Walkthrough
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-xs font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {inspection.location}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      inspection.type === 'final-walkthrough'
                        ? 'bg-amber-100 text-amber-600 border border-amber-300'
                        : 'bg-blue-50 text-blue-500 border border-blue-200'
                    }`}>
                      {inspection.type === 'final-walkthrough' ? 'Funded' : 'Upcoming'}
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
                      <span className="text-slate-500 text-xs font-bold">{inspection.seekerName}</span>
                    </div>
                    <button className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
                      Manage
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Document Portal Modal */}
      {showDocPortal && selectedDeal && (
        <AgentDocumentPortal
          deal={selectedDeal}
          onClose={() => { setShowDocPortal(false); setSelectedDeal(null); }}
          onOpenSignature={() => { setShowDocPortal(false); setShowSignature(true); }}
          onSubmitAll={handleDocumentsSubmitted}
        />
      )}

      {/* Signature Wizard Modal */}
      {showSignature && selectedDeal && (
        <SignatureWizard
          pipeline={selectedDeal.pipeline}
          onClose={() => { setShowSignature(false); setShowDocPortal(true); }}
          onComplete={handleSignatureComplete}
        />
      )}

      {/* Walkthrough Scheduler Modal */}
      {showWalkthroughScheduler && selectedDeal && (
        <WalkthroughScheduler
          deal={selectedDeal}
          onClose={() => { setShowWalkthroughScheduler(false); setSelectedDeal(null); }}
          onScheduled={handleWalkthroughScheduled}
        />
      )}

      {milestoneData && (
        <MilestoneSuccessOverlay
          data={milestoneData}
          onClose={() => setMilestoneData(null)}
          onCTA={() => {
            const deal = deals.find(d => d.property === milestoneData.propertyName);
            setMilestoneData(null);
            if (milestoneData.milestone === 'acknowledged' && deal) {
              handlePrepareDocuments(deal);
            } else if (milestoneData.milestone === 'documented' && deal) {
              handleScheduleWalkthrough(deal);
            }
          }}
        />
      )}

      {/* Inspection Request Decision Modal */}
      {selectedRequest && (
        <InspectionRequestModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onAccept={handleAcceptRequest}
          onReschedule={handleRescheduleRequest}
          onMessage={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
};
