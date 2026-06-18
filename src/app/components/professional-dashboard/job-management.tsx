import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check, Clock, MessageSquare, CircleCheck, CircleAlert,
  MapPin, ArrowLeft, Camera, Upload, ShieldCheck,
  CheckCircle2, Droplets, Wrench, Scale, Paintbrush,
  ImageIcon, AlertCircle, Star
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

// ─── Status Chip ──────────────────────────────────────────────────────────────
const StatusChip: React.FC<{
  label: string;
  variant: 'completed' | 'active' | 'pending' | 'escrow' | 'awaiting' | 'paid';
}> = ({ label, variant }) => {
  const styles = {
    completed: 'bg-green-50 text-green-700 border-green-200',
    active: 'bg-orange-50 text-orange-600 border-orange-200',
    pending: 'bg-slate-50 text-slate-400 border-slate-200',
    escrow: 'bg-green-50 text-green-700 border-green-200',
    awaiting: 'bg-blue-50 text-blue-600 border-blue-200',
    paid: 'bg-[#7B2D42]/8 text-[#7B2D42] border-[#7B2D42]/20',
  };
  const dots = {
    completed: 'bg-green-500',
    active: 'bg-orange-400 animate-pulse',
    pending: 'bg-slate-300',
    escrow: 'bg-green-500',
    awaiting: 'bg-blue-400 animate-pulse',
    paid: 'bg-[#7B2D42]',
  };
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${styles[variant]}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${dots[variant]}`} />
      {label}
    </div>
  );
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const milestoneSteps = [
  { key: 'quote', label: 'Quote Accepted' },
  { key: 'wip', label: 'Work in Progress' },
  { key: 'review', label: 'Client Review' },
  { key: 'paid', label: 'Payment Released' },
];

const activeJobs = [
  {
    id: 1,
    serviceType: 'Plumbing',
    icon: Droplets,
    title: 'Fix burst pipe in master bathroom',
    client: 'Mrs. Ogundimu',
    clientInitial: 'MO',
    location: 'Lekki Phase 1, Lagos',
    quote: '₦55,000',
    escrowAmount: '₦55,000',
    currentStep: 1, // Work in Progress
    startDate: 'Mar 14, 2026',
    dueDate: 'Mar 18, 2026',
    messages: 3,
    description:
      'Water pipe burst behind the wall in the master bathroom. The pipe is behind the toilet wall. Main valve has been shut off. The client needs emergency repair before structural damage spreads.',
    specs: [
      'Pipe size: 15mm',
      'Wall: concrete & ceramic tile',
      'Water shut off at main',
      '3rd floor with elevator access',
    ],
    images: [
      {
        src: 'https://images.unsplash.com/photo-1566447695072-9f6cc2c84fb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
        label: 'Burst pipe area',
      },
      {
        src: 'https://images.unsplash.com/photo-1676210134050-6f12c6898395?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
        label: 'Bathroom overview',
      },
    ],
    phases: [
      { label: 'Diagnosis / Inspection', status: 'completed' as const, date: 'Mar 14, 2026' },
      { label: 'Work in Progress', status: 'active' as const, date: 'Mar 15, 2026' },
      { label: 'Client Verification', status: 'pending' as const, date: 'Pending' },
      { label: 'Payout Released', status: 'pending' as const, date: 'Pending' },
    ],
  },
  {
    id: 2,
    serviceType: 'Legal Services',
    icon: Scale,
    title: 'Title search & verification — Banana Island',
    client: 'Mr. Adebayo',
    clientInitial: 'MA',
    location: 'Banana Island, Lagos',
    quote: '₦200,000',
    escrowAmount: '₦200,000',
    currentStep: 1,
    startDate: 'Mar 12, 2026',
    dueDate: 'Mar 25, 2026',
    messages: 7,
    description:
      'Comprehensive title search and C of O verification for a 1200sqm plot at Banana Island. Client needs clear title history and any encumbrance report.',
    specs: [
      'Plot: 1200sqm, Banana Island',
      'Document: C of O + Survey Plan',
      'Deliverable: Full Report PDF',
      'Timeline: 14 working days',
    ],
    images: [],
    phases: [
      { label: 'Document Collection', status: 'completed' as const, date: 'Mar 12, 2026' },
      { label: 'Land Registry Search', status: 'active' as const, date: 'Mar 14, 2026' },
      { label: 'Report Preparation', status: 'pending' as const, date: 'Pending' },
      { label: 'Payout Released', status: 'pending' as const, date: 'Pending' },
    ],
  },
  {
    id: 3,
    serviceType: 'AC Maintenance',
    icon: Wrench,
    title: 'AC servicing — 4 split units',
    client: 'Zenith Gardens Estate',
    clientInitial: 'ZG',
    location: 'Ikeja GRA, Lagos',
    quote: '₦95,000',
    escrowAmount: '₦95,000',
    currentStep: 3, // Payment Released
    startDate: 'Mar 8, 2026',
    dueDate: 'Mar 10, 2026',
    messages: 0,
    description:
      'Routine servicing and gas refill for 4 split AC units across 2 floors of an estate building. All units need full cleaning, filter change and refrigerant check.',
    specs: ['4 Split AC units', '2 floors', 'Gas refill included', 'Service report required'],
    images: [],
    phases: [
      { label: 'Site Inspection', status: 'completed' as const, date: 'Mar 8, 2026' },
      { label: 'Servicing & Refill', status: 'completed' as const, date: 'Mar 9, 2026' },
      { label: 'Client Verified', status: 'completed' as const, date: 'Mar 10, 2026' },
      { label: 'Payout Released', status: 'paid' as const, date: 'Mar 10, 2026' },
    ],
  },
  {
    id: 4,
    serviceType: 'Painting',
    icon: Paintbrush,
    title: '3-bedroom flat repaint',
    client: 'Chukwudi Properties',
    clientInitial: 'CP',
    location: 'Victoria Island, Lagos',
    quote: '₦160,000',
    escrowAmount: '₦160,000',
    currentStep: 0, // Quote Accepted
    startDate: 'Mar 15, 2026',
    dueDate: 'Mar 28, 2026',
    messages: 1,
    description:
      'Full interior repaint of 3-bedroom flat. Tenant just moved out. Walls need prep, priming and two coats of emulsion. All paintwork to be completed within 2 weeks.',
    specs: ['3 bedrooms + 2 bathrooms', 'Prep + prime + 2 coats', 'Client provides paint brand preference', 'Drop cloths required'],
    images: [],
    phases: [
      { label: 'Site Inspection', status: 'active' as const, date: 'Mar 15, 2026' },
      { label: 'Work in Progress', status: 'pending' as const, date: 'Pending' },
      { label: 'Client Verification', status: 'pending' as const, date: 'Pending' },
      { label: 'Payout Released', status: 'pending' as const, date: 'Pending' },
    ],
  },
];

type FilterType = 'all' | 'active' | 'completed';

// ─── Workspace Panel ─────────────────────────────────────────────────────────
const WorkspacePanel: React.FC<{
  job: typeof activeJobs[0];
  onBack: () => void;
}> = ({ job, onBack }) => {
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [markedComplete, setMarkedComplete] = useState(false);
  const Icon = job.icon;

  const currentPhase = job.phases.find((p) => p.status === 'active') || job.phases[0];
  const isCompleted = job.currentStep === 3;

  const handleMarkComplete = () => {
    setMarkingComplete(true);
    setTimeout(() => {
      setMarkingComplete(false);
      setMarkedComplete(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Icon className="w-4 h-4 text-primary shrink-0" />
            <p className="text-slate-900 font-black text-sm truncate">{job.title}</p>
          </div>
          {isCompleted ? (
            <StatusChip label="JOB PAID & CLOSED" variant="paid" />
          ) : (
            <StatusChip label="IN ESCROW" variant="escrow" />
          )}
        </div>
      </div>

      {/* Escrow Signal */}
      {!isCompleted && !markedComplete && (
        <div className="bg-green-50 border-b border-green-200 px-6 py-3 flex items-center gap-3">
          <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
          <p className="text-green-800 text-xs font-bold">
            Payment Secured — Safe to Start.{' '}
            <span className="font-medium text-green-700">
              Houzii is holding {job.escrowAmount}. Released after client verifies work.
            </span>
          </p>
        </div>
      )}

      {markedComplete && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-3 flex items-center gap-3">
          <Clock className="w-4 h-4 text-blue-500 shrink-0" />
          <p className="text-blue-800 text-xs font-bold">
            ● AWAITING SEEKER VERIFICATION —{' '}
            <span className="font-medium">Client has been notified to verify your work.</span>
          </p>
        </div>
      )}

      {/* Split-Screen Layout */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-120px)]">
          {/* LEFT: Job Info */}
          <div className="lg:w-1/2 border-r border-slate-200 bg-white px-6 py-6 space-y-6">
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Client</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {job.clientInitial}
                </div>
                <div>
                  <p className="text-slate-800 font-bold text-sm">{job.client}</p>
                  <p className="text-slate-400 text-xs font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3" />{job.location}
                  </p>
                </div>
                <div className="ml-auto">
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Agreed</p>
                  <p className="text-slate-900 font-black text-base">{job.quote}</p>
                </div>
              </div>
            </div>

            {/* Original Description */}
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                Client's Description
              </p>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-slate-600 text-sm font-medium leading-relaxed">{job.description}</p>
              </div>
            </div>

            {/* Specs */}
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                Job Specs / Inventory
              </p>
              <div className="space-y-1.5">
                {job.specs.map((spec, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                    {spec}
                  </div>
                ))}
              </div>
            </div>

            {/* Seeker Images */}
            {job.images.length > 0 && (
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-3">
                  Images Uploaded by Client
                </p>
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {job.images.map((img, i) => (
                    <div key={i} className="relative rounded-xl overflow-hidden shrink-0 w-32 h-24">
                      <ImageWithFallback
                        src={img.src}
                        alt={img.label}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-gradient-to-t from-black/60">
                        <p className="text-white text-[9px] font-bold">{img.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline dates */}
            <div className="flex items-center gap-6 pt-3 border-t border-slate-100">
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Start Date</p>
                <p className="text-slate-800 font-bold text-sm">{job.startDate}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Due Date</p>
                <p className="text-slate-800 font-bold text-sm">{job.dueDate}</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Work Log */}
          <div className="lg:w-1/2 px-6 py-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-900 font-black text-base">Work Log</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary/5 hover:bg-primary/10 text-primary rounded-full text-xs font-bold transition-all">
                <MessageSquare className="w-3.5 h-3.5" />
                Job Chat
                {job.messages > 0 && (
                  <span className="w-4 h-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">
                    {job.messages}
                  </span>
                )}
              </button>
            </div>

            {/* Phase Cards */}
            <div className="space-y-3">
              {job.phases.map((phase, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={`rounded-xl p-4 border ${
                    phase.status === 'completed'
                      ? 'bg-green-50 border-green-200'
                      : phase.status === 'active'
                      ? 'bg-orange-50 border-orange-200'
                      : phase.status === 'paid'
                      ? 'bg-[#7B2D42]/5 border-[#7B2D42]/15'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        phase.status === 'completed'
                          ? 'bg-green-500'
                          : phase.status === 'active'
                          ? 'bg-orange-400'
                          : phase.status === 'paid'
                          ? 'bg-[#7B2D42]'
                          : 'bg-slate-200'
                      }`}>
                        {phase.status === 'completed' || phase.status === 'paid' ? (
                          <Check className="w-4 h-4 text-white" />
                        ) : phase.status === 'active' ? (
                          <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-white" />
                        )}
                      </div>
                      <div>
                        <p className={`font-bold text-sm ${
                          phase.status === 'completed' ? 'text-green-800'
                          : phase.status === 'active' ? 'text-orange-700'
                          : phase.status === 'paid' ? 'text-[#7B2D42]'
                          : 'text-slate-400'
                        }`}>
                          {phase.label}
                        </p>
                        <p className="text-slate-400 text-[10px] font-medium">{phase.date}</p>
                      </div>
                    </div>
                    <StatusChip
                      label={
                        phase.status === 'completed' ? '● COMPLETED'
                        : phase.status === 'active' ? '● IN PROGRESS'
                        : phase.status === 'paid' ? '● PAID'
                        : '● PENDING'
                      }
                      variant={
                        phase.status === 'completed' ? 'completed'
                        : phase.status === 'active' ? 'active'
                        : phase.status === 'paid' ? 'paid'
                        : 'pending'
                      }
                    />
                  </div>

                  {/* Active Phase Actions */}
                  {phase.status === 'active' && !isCompleted && !markedComplete && (
                    <div className="mt-4 pt-3 border-t border-orange-200 flex flex-col gap-2">
                      {!photoUploaded ? (
                        <button
                          onClick={() => setPhotoUploaded(true)}
                          className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-200 text-blue-600 rounded-full text-xs font-bold hover:bg-blue-100 transition-colors w-fit"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          Upload Progress Photo
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full w-fit">
                          <ImageIcon className="w-3.5 h-3.5 text-green-500" />
                          <span className="text-green-600 text-xs font-bold">Photo shared with client</span>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Primary Action */}
            {!isCompleted && !markedComplete && (
              <motion.button
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={handleMarkComplete}
                disabled={markingComplete}
                className="w-full py-4 bg-[#7B2D42] hover:bg-[#7B1C3E] disabled:opacity-70 text-white rounded-xl font-black text-sm transition-all shadow-lg shadow-primary/20 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {markingComplete ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Mark Work as Complete — Request Payout
                  </>
                )}
              </motion.button>
            )}

            {markedComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center"
              >
                <StatusChip label="AWAITING SEEKER VERIFICATION" variant="awaiting" />
                <p className="text-blue-800 font-bold text-sm mt-3">
                  Work submitted for verification.
                </p>
                <p className="text-blue-600 text-xs font-medium mt-1">
                  {job.quote} will be released to your wallet once the client confirms.
                </p>
              </motion.div>
            )}

            {isCompleted && (
              <div className="bg-[#7B2D42]/5 border border-[#7B2D42]/15 rounded-xl p-5 text-center">
                <StatusChip label="JOB PAID & CLOSED" variant="paid" />
                <p className="text-slate-800 font-bold text-sm mt-3">
                  {job.quote} paid to your wallet.
                </p>
                <p className="text-slate-500 text-xs font-medium mt-1">
                  This job has been completed successfully.
                </p>
              </div>
            )}

            {/* Human Oracle Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <CircleAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-800 text-xs font-bold mb-1">Houzii Human Oracle</p>
                  <p className="text-amber-600 text-xs font-medium">
                    When you mark work as complete, a Houzii reviewer confirms the work before payment is released. This protects both you and your client.
                  </p>
                </div>
              </div>
            </div>

            {/* Safety Banner */}
            <div className="bg-[#7B2D42]/5 border border-[#7B2D42]/15 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-[#7B2D42] shrink-0 mt-0.5" />
              <p className="text-[#7B2D42]/75 text-xs font-medium leading-relaxed">
                Never accept cash outside the app. Your payment is only guaranteed when Escrow is funded.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main: Job Management ─────────────────────────────────────────────────────
export const JobManagement: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedJob, setSelectedJob] = useState<typeof activeJobs[0] | null>(null);

  const filtered = activeJobs.filter((j) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return j.currentStep === 3;
    return j.currentStep < 3;
  });

  // Show workspace if job is selected
  if (selectedJob) {
    return <WorkspacePanel job={selectedJob} onBack={() => setSelectedJob(null)} />;
  }

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6 border-b border-slate-100">
        <h2 className="text-slate-900 font-black text-2xl mb-1">My Active Jobs</h2>
        <p className="text-slate-400 font-medium text-sm">
          Track milestones, manage deliverables & request payout
        </p>
      </div>

      <div className="px-6 pt-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Active Jobs', value: activeJobs.filter((j) => j.currentStep < 3).length.toString(), color: 'text-primary', bg: 'bg-primary/5', border: 'border-primary/10' },
            { label: 'Completed', value: activeJobs.filter((j) => j.currentStep === 3).length.toString(), color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
            { label: 'Total Value', value: '₦510K', color: 'text-slate-800', bg: 'bg-slate-50', border: 'border-slate-200' },
            { label: 'Avg. Rating', value: '4.9★', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`${stat.bg} border ${stat.border} rounded-xl p-4`}
            >
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
              <p className={`${stat.color} font-black text-xl`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all capitalize ${
                filter === f
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              {f === 'all' ? 'All Jobs' : f}
            </button>
          ))}
        </div>

        {/* Job Cards */}
        <div className="space-y-4">
          {filtered.map((job, i) => {
            const Icon = job.icon;
            const isCompleted = job.currentStep === 3;
            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all"
              >
                {/* Title Row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-slate-800 font-bold text-sm mb-1">{job.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-slate-400 font-medium flex-wrap">
                        <span>{job.client}</span>
                        <span className="text-slate-200">|</span>
                        <span>{job.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-primary font-black text-sm">{job.quote}</span>
                    {isCompleted && (
                      <div className="mt-1">
                        <StatusChip label="PAID" variant="paid" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Milestone Progress Bar */}
                <div className="relative mb-5">
                  <div className="flex items-center justify-between relative">
                    <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-100 z-0" />
                    <div
                      className="absolute top-4 left-4 h-0.5 bg-primary z-0 transition-all duration-500"
                      style={{
                        width: `${(job.currentStep / (milestoneSteps.length - 1)) * 100}%`,
                        maxWidth: 'calc(100% - 32px)',
                      }}
                    />
                    {milestoneSteps.map((step, si) => {
                      const isComplete = si <= job.currentStep;
                      const isCurrent = si === job.currentStep;
                      return (
                        <div key={step.key} className="relative z-10 flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                              isComplete
                                ? isCurrent && si < 3
                                  ? 'bg-primary border-primary text-white'
                                  : 'bg-primary border-primary text-white'
                                : 'bg-white border-slate-200 text-slate-300'
                            }`}
                          >
                            {isComplete ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Clock className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <p
                            className={`text-[9px] font-bold mt-1.5 text-center max-w-[70px] ${
                              isComplete ? 'text-slate-700' : 'text-slate-300'
                            }`}
                          >
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100 flex-wrap">
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary/5 hover:bg-primary/10 text-primary rounded-full text-xs font-bold transition-all">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Job Chat
                    {job.messages > 0 && (
                      <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                        {job.messages}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setSelectedJob(job)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-full text-xs font-bold transition-all shadow-sm"
                  >
                    Open Workspace
                  </button>

                  <div className="ml-auto flex items-center gap-2 text-slate-300 text-[10px] font-medium">
                    <Clock className="w-3 h-3" />
                    Due: {job.dueDate}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Oracle info */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-5"
        >
          <div className="flex items-start gap-3">
            <CircleAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-800 text-sm font-bold mb-1">Houzii Human Oracle</p>
              <p className="text-amber-600 text-xs font-medium">
                When you mark a milestone as complete, a Houzii reviewer confirms the work before
                payment is released. This protects both you and your client.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
