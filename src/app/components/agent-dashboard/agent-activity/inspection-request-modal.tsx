import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  X, CheckCircle2, Calendar, Clock, User,
  MapPin, MessageCircle, ArrowRight, Shield
} from 'lucide-react';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface InspectionRequest {
  id: number;
  property: string;
  location: string;
  image: string;
  seekerName: string;
  requestedDate: string;
  requestedTime: string;
  funded: boolean;
}

interface InspectionRequestModalProps {
  request: InspectionRequest;
  onClose: () => void;
  onAccept: (request: InspectionRequest) => void;
  onReschedule: (request: InspectionRequest, date: Date, time: string) => void;
  onMessage: (request: InspectionRequest) => void;
}

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
];

export const InspectionRequestModal: React.FC<InspectionRequestModalProps> = ({
  request, onClose, onAccept, onReschedule, onMessage
}) => {
  const [showReschedule, setShowReschedule] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="text-slate-900 font-black text-lg">Respond to Request</h3>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* Property + Seeker Info */}
          <div className="flex gap-3">
            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-sm">
              <img src={request.image} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-slate-900 font-bold text-sm truncate">{request.property}</h4>
              <p className="text-slate-400 text-xs font-medium flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" /> {request.location}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-3 h-3 text-primary" />
                </div>
                <span className="text-slate-600 text-xs font-bold">{request.seekerName}</span>
                <button
                  onClick={() => onMessage(request)}
                  className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors ml-1"
                  title="Message seeker"
                >
                  <MessageCircle className="w-3 h-3 text-slate-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Requested Time */}
          <div className="mt-4 flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-bold">{request.requestedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-bold">{request.requestedTime}</span>
            </div>
          </div>

          {/* Priority Badge */}
          {request.funded && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-300 rounded-xl">
              <Shield className="w-4 h-4 text-amber-500" />
              <span className="text-amber-700 text-xs font-bold">Priority Prospect — Escrow Funded</span>
            </div>
          )}
        </div>

        {/* Decision Paths */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {!showReschedule ? (
              <motion.div
                key="actions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {/* Path A: Accept */}
                <button
                  onClick={() => onAccept(request)}
                  className="w-full h-12 bg-primary hover:brightness-110 text-white rounded-xl font-bold text-sm shadow-md shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Accept & Confirm
                </button>
                <p className="text-slate-400 text-[11px] font-medium text-center px-4">
                  This will add the viewing to your 'Inspections' calendar and notify the seeker.
                </p>

                {/* Path B: Reschedule */}
                <button
                  onClick={() => setShowReschedule(true)}
                  className="w-full h-12 border-2 border-primary text-primary hover:bg-primary/5 rounded-xl font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Propose New Time
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="reschedule"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-slate-900 font-bold text-sm">Propose a New Time</h4>
                  <button onClick={() => setShowReschedule(false)} className="text-primary text-xs font-bold hover:underline">
                    Back
                  </button>
                </div>

                {/* Date Picker */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <CalendarPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className={cn("p-3 pointer-events-auto w-full")}
                  />
                </div>

                {/* Time Picker */}
                {selectedDate && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="text-slate-500 text-xs font-bold mb-2">Select Time</p>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-2 rounded-lg text-xs font-bold transition-all ${
                            selectedTime === time
                              ? 'bg-primary text-white shadow-sm'
                              : 'bg-slate-50 text-slate-500 border border-slate-200 hover:border-primary/30'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Send Proposal */}
                <button
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => selectedDate && onReschedule(request, selectedDate, selectedTime)}
                  className="w-full h-12 bg-primary hover:brightness-110 text-white rounded-xl font-bold text-sm shadow-md shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none"
                >
                  Send Proposed Time
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};
