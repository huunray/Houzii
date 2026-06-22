import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, MapPin, Clock,
  ChevronRight, Calendar, Eye, User, AlertCircle,
  ArrowRight, Lock, Navigation
} from 'lucide-react';
import { MoveInChecklist } from '../escrow/move-in-checklist';
import { ScheduleWalkthrough } from '../escrow/schedule-walkthrough';
import { SeekerClosingChecklist } from './seeker-closing-checklist';
import { GetDirectionsModal } from './get-directions-modal';
import { RentalApplicationModal } from './rental-application-modal';



const inspections = [
  {
    id: 1,
    property: '3 Bed Apartment - Lekki Phase 1',
    location: 'Lekki Phase 1, Lagos',
    date: 'Mar 18, 2026',
    time: '10:00 AM',
    status: 'upcoming',
    agent: 'Chinedu Okafor',
  },
  {
    id: 2,
    property: '2 Bed Flat - Victoria Island',
    location: 'Victoria Island, Lagos',
    date: 'Mar 15, 2026',
    time: '2:00 PM',
    status: 'completed',
    agent: 'Fatima Hassan',
  },
];

const todoItems = [
  {
    id: 4,
    type: 'confirmed_inspection' as const,
    title: 'Confirmed Inspection',
    description: 'Agent Joy Adeyemi confirmed your viewing for 2 Bed Serviced Apartment — Mar 18 at 10:00 AM.',
    property: '2 Bed Serviced Apartment - Victoria Island',
    propertyId: 2,
    viewingDate: 'Mar 18, 2026 · 10:00 AM',
    urgent: false,
  },
  {
    id: 1,
    type: 'closing' as const,
    title: 'Review & Sign Closing Documents',
    description: 'Action Required: Review evidence uploads, sign your Tenancy Agreement, and verify the handover.',
    property: '3 Bedroom Luxury Apartment',
    urgent: true,
  },
  {
    id: 2,
    type: 'walkthrough' as const,
    title: 'Propose a Walkthrough Date',
    description: 'Action Required: Propose a date for your final walkthrough and key handover.',
    property: '3 Bedroom Luxury Apartment',
    urgent: true,
  },
  {
    id: 3,
    type: 'release' as const,
    title: 'Confirm Key Handover',
    description: 'Agent Joy A. has marked the handover as complete. Confirm receipt of keys to release funds.',
    property: '3 Bedroom Luxury Apartment',
    amount: '₦11.6M',
    agentName: 'Joy A.',
    urgent: true,
  },
];

const recentActivity = [
  { id: 1, emoji: '✅', text: 'You secured ₦11.6M in Houzii Escrow.', time: '2 hours ago' },
  { id: 2, emoji: '📩', text: 'You proposed a handover for April 5th, 10:00 AM.', time: '1 hour ago' },
  { id: 3, emoji: '🤝', text: 'Agent Joy A. has acknowledged the funds and confirmed the walkthrough date.', time: '45 min ago' },
  { id: 4, emoji: '🔔', text: 'Agent Joy A. has signaled that the handover is complete.', time: 'Just now' },
];

interface ActivityPanelProps {
  onViewProperty?: (propertyId: number, viewingDate?: string) => void;
}

export const ActivityPanel: React.FC<ActivityPanelProps> = ({ onViewProperty }) => {
  const [currentTab, setCurrentTab] = useState<'todo' | 'offers' | 'inspections'>('todo');
  const [showMoveInVerification, setShowMoveInVerification] = useState(false);
  const [showScheduleWalkthrough, setShowScheduleWalkthrough] = useState(false);
  const [showClosingChecklist, setShowClosingChecklist] = useState(false);
  const [showGetDirections, setShowGetDirections] = useState(false);
  const [showRentalApplication, setShowRentalApplication] = useState(false);

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
            Track your offers, inspections, and escrow milestones
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="mt-5 flex gap-1 bg-slate-100 rounded-xl p-1 h-11">
          {[
            { id: 'todo' as const, label: 'To-Do', count: todoItems.length },
            { id: 'offers' as const, label: 'Recent Activities', count: recentActivity.length },
            { id: 'inspections' as const, label: 'Inspections', count: inspections.length },
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
          {currentTab === 'todo' ? (
            <motion.div
              key="todo"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              {/* Priority Actions */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-4 h-4 text-[hsl(var(--escrow-amber))]" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                    Priority Actions
                  </span>
                </div>

                <div className="space-y-4">
                  {todoItems.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all"
                    >
                      <div className="p-5">
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            item.type === 'release'
                              ? 'bg-[hsl(var(--escrow-green))]/10'
                              : item.type === 'closing'
                              ? 'bg-primary/10'
                              : item.type === 'confirmed_inspection'
                              ? 'bg-[hsl(var(--escrow-green))]/10'
                              : 'bg-[hsl(var(--escrow-amber))]/10'
                          }`}>
                            {item.type === 'release' ? (
                              <Lock className="w-5 h-5 text-[hsl(var(--escrow-green))]" />
                            ) : item.type === 'closing' ? (
                              <Shield className="w-5 h-5 text-primary" />
                            ) : item.type === 'confirmed_inspection' ? (
                              <MapPin className="w-5 h-5 text-[hsl(var(--escrow-green))]" />
                            ) : (
                              <Calendar className="w-5 h-5 text-[hsl(var(--escrow-amber))]" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-slate-900 font-bold text-sm">{item.title}</h4>
                              {item.urgent ? (
                                <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full ${
                                  item.type === 'release'
                                    ? 'bg-[hsl(var(--escrow-red))]/10 text-[hsl(var(--escrow-red))]'
                                    : item.type === 'closing'
                                    ? 'bg-primary/10 text-primary'
                                    : 'bg-amber-100 text-amber-600'
                                }`}>
                                  {item.type === 'release' ? 'Urgent' : item.type === 'closing' ? 'Action' : 'Important'}
                                </span>
                              ) : item.type === 'confirmed_inspection' ? (
                                <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-[hsl(var(--escrow-green))]/10 text-[hsl(var(--escrow-green))]">
                                  Confirmed
                                </span>
                              ) : null}
                            </div>
                            <p className="text-slate-500 text-xs font-medium leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        {/* CTA */}
                        {item.type === 'release' ? (
                          <button
                            onClick={() => setShowMoveInVerification(true)}
                            className="h-11 px-6 bg-primary hover:brightness-110 active:bg-primary text-white rounded-full font-bold text-sm shadow-md shadow-primary/20 transition-all active:scale-[0.98] flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Review Now
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        ) : item.type === 'closing' ? (
                          <button
                            onClick={() => setShowClosingChecklist(true)}
                            className="h-11 px-6 bg-primary hover:brightness-110 active:bg-primary text-white rounded-full font-bold text-sm shadow-md shadow-primary/20 transition-all active:scale-[0.98] flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Review & Sign
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        ) : item.type === 'confirmed_inspection' ? (
                          <div className="flex items-center gap-3 flex-wrap">
                            <button
                              onClick={() => setShowGetDirections(true)}
                              className="h-11 px-6 border-2 border-primary text-primary hover:bg-primary/5 rounded-full font-bold text-sm transition-all active:scale-[0.98] flex items-center gap-2"
                            >
                              <Navigation className="w-4 h-4" />
                              Get Directions
                            </button>
                            <button
                              onClick={() => onViewProperty?.(item.propertyId || 1, item.viewingDate)}
                              className="h-11 px-6 text-primary hover:bg-primary/5 rounded-full font-bold text-sm transition-all active:scale-[0.98] flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Property
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setShowScheduleWalkthrough(true)} className="h-11 px-6 border-2 border-primary text-primary hover:bg-primary/5 rounded-full font-bold text-sm transition-all active:scale-[0.98] flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Schedule Walkthrough
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

            </motion.div>
          ) : currentTab === 'offers' ? (
            <motion.div
              key="offers"
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
                {recentActivity.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-start gap-3 px-5 py-4 ${
                      i < recentActivity.length - 1 ? 'border-b border-slate-100' : ''
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
          ) : (
            <motion.div
              key="inspections"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-4"
            >
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Move-In Verification Modal */}
      <AnimatePresence>
        {showMoveInVerification && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowMoveInVerification(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="overflow-y-auto max-h-[90vh]">
                <MoveInChecklist
                  agentName="Joy A."
                  propertyTitle="3 Bedroom Luxury Apartment"
                  amount="₦11,600,000"
                  onBack={() => setShowMoveInVerification(false)}
                  onReleaseFunds={() => setShowMoveInVerification(false)}
                  onDisputeSubmitted={() => setShowMoveInVerification(false)}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Schedule Walkthrough Modal */}
      {showScheduleWalkthrough && (
        <ScheduleWalkthrough
          propertyTitle="3 Bedroom Luxury Apartment"
          agentName="Joy A."
          onClose={() => setShowScheduleWalkthrough(false)}
          onPropose={() => setShowScheduleWalkthrough(false)}
        />
      )}

      {/* Seeker Closing Checklist Modal */}
      {showClosingChecklist && (
        <SeekerClosingChecklist
          deal={{
            id: 1,
            pipeline: 'rental',
            property: '3 Bedroom Luxury Apartment',
            amount: '₦11,600,000',
            agentName: 'Joy A.',
            agentSigningPath: 'digital',
            walkthroughDate: 'April 5, 2026 · 10:00 AM',
            oracleVerified: true,
            agentHandoverComplete: true,
          }}
          onClose={() => setShowClosingChecklist(false)}
          onReleaseFunds={() => setShowClosingChecklist(false)}
        />
      )}

      {/* Get Directions Modal */}
      <AnimatePresence>
        {showGetDirections && (
          <GetDirectionsModal
            propertyTitle="3 Bed Apartment - Lekki Phase 1"
            address="12 Admiralty Way, Lekki Phase 1, Lagos, Nigeria"
            landmark="Opposite GTBank, beside Lekki Coliseum"
            inspectionDate="Mar 18, 2026"
            inspectionTime="10:00 AM"
            coordinates={{ lat: 6.4281, lng: 3.4219 }}
            onClose={() => setShowGetDirections(false)}
          />
        )}
      </AnimatePresence>

      {/* Rental Application Modal */}
      <AnimatePresence>
        {showRentalApplication && (
          <RentalApplicationModal
            propertyTitle="2 Bed Serviced Apartment"
            propertyLocation="Victoria Island, Lagos"
            agentName="Joy Adeyemi"
            onClose={() => setShowRentalApplication(false)}
            onSubmit={() => setShowRentalApplication(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
