import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Clock, MapPin, ArrowRight, CheckCircle2, Key, FileText, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface Deal {
  id: number;
  pipeline: 'rental' | 'sale';
  property: string;
  location: string;
  amount: string;
  seekerName: string;
}

interface Props {
  deal: Deal;
  onClose: () => void;
  onScheduled: (date: Date, time: string) => void;
}

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
];

const rentalChecklist = [
  { icon: Key, label: 'Physical keys for all doors' },
  { icon: FileText, label: 'PHCN / Utility meter card' },
  { icon: Eye, label: 'House rules document' },
];

const saleChecklist = [
  { icon: FileText, label: 'Original C of O & Survey Plan' },
  { icon: FileText, label: 'Deed of Assignment (signed)' },
  { icon: MapPin, label: 'Boundary pillar markers' },
];

export const WalkthroughScheduler: React.FC<Props> = ({ deal, onClose, onScheduled }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const isRental = deal.pipeline === 'rental';
  const checklist = isRental ? rentalChecklist : saleChecklist;
  const canConfirm = selectedDate && selectedTime;

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onScheduled(selectedDate, selectedTime);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-slate-900 font-black text-lg">Schedule Final Walkthrough</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
            <MapPin className="w-3.5 h-3.5" />
            {deal.property} · {deal.location}
          </div>
          <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            isRental
              ? 'bg-blue-50 text-blue-600 border border-blue-200'
              : 'bg-amber-50 text-amber-600 border border-amber-200'
          }`}>
            {isRental ? '🔑 Rental Pipeline' : '🏷️ Sale Pipeline'}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Date Picker */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                Select Date
              </span>
            </div>
            <div className="flex justify-center bg-slate-50 border border-slate-200 rounded-2xl p-2">
              <CalendarPicker
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                className={cn("p-3 pointer-events-auto")}
              />
            </div>
            {selectedDate && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-primary text-xs font-bold text-center"
              >
                📅 {format(selectedDate, 'EEEE, MMMM do, yyyy')}
              </motion.p>
            )}
          </div>

          {/* Time Picker */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                Select Time
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`h-10 rounded-full text-xs font-bold transition-all ${
                    selectedTime === time
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'bg-slate-50 border border-slate-200 text-slate-600 hover:border-primary hover:text-primary'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* What to Bring Checklist */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                What to Bring
              </span>
            </div>
            <div className="space-y-2">
              {checklist.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-slate-700 text-sm font-bold">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Seeker Info */}
          <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl">
            <p className="text-primary text-xs font-bold mb-1">Meeting with</p>
            <p className="text-slate-900 text-sm font-black">{deal.seekerName}</p>
            <p className="text-slate-400 text-[11px] font-medium mt-1">
              {isRental
                ? 'Seeker will inspect the property and confirm move-in readiness.'
                : 'Seeker will inspect boundaries, landmarks, and verify possession.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 shrink-0 bg-white">
          <button
            onClick={canConfirm ? handleConfirm : undefined}
            disabled={!canConfirm}
            className={`w-full h-12 rounded-full font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
              canConfirm
                ? 'bg-primary hover:brightness-110 text-white shadow-md shadow-primary/20'
                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Confirm Walkthrough
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
