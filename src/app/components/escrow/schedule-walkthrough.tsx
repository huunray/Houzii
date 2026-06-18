import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  X, CalendarDays, Clock, Lightbulb, ArrowRight,
  Users, Droplets, Key, FileText, ChevronDown
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ScheduleWalkthroughProps {
  propertyTitle: string;
  agentName: string;
  onClose: () => void;
  onPropose: (date: Date, timeSlot: string) => void;
}

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
];

const hintGuide = [
  {
    emoji: '🤝',
    title: 'The Meeting',
    description: 'You and the Agent will meet at the property.',
    icon: Users,
  },
  {
    emoji: '🔍',
    title: 'The Inspection',
    description: 'You will check the light, water, and locks.',
    icon: Droplets,
  },
  {
    emoji: '📝',
    title: 'The Signing',
    description: 'You will sign the physical tenancy agreement.',
    icon: FileText,
  },
  {
    emoji: '🔑',
    title: 'The Release',
    description: 'Only slide to \'Release Funds\' once you have the keys in hand.',
    icon: Key,
  },
];

export const ScheduleWalkthrough: React.FC<ScheduleWalkthroughProps> = ({
  propertyTitle,
  agentName,
  onClose,
  onPropose,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [showHints, setShowHints] = useState(false);

  const canPropose = selectedDate && selectedTime;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl bg-white flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[hsl(var(--navy))] px-6 pt-6 pb-5 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <CalendarDays className="w-4 h-4 text-[hsl(var(--escrow-green))]" />
          </div>
          <h1 className="text-white font-black text-xl">Arrange Your Handover</h1>
          <p className="text-white/40 text-sm font-medium mt-1">
            {propertyTitle} • with {agentName}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Date Picker */}
          <div>
            <label className="text-slate-600 text-[11px] font-bold uppercase tracking-wider mb-3 block">
              Select Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    'w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold flex items-center justify-between hover:border-slate-300 transition-all',
                    selectedDate ? 'text-slate-900' : 'text-slate-400'
                  )}
                >
                  <span className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-slate-400" />
                    {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Pick a date'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[80]" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className={cn('p-3 pointer-events-auto')}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Slot Selector */}
          <div>
            <label className="text-slate-600 text-[11px] font-bold uppercase tracking-wider mb-3 block">
              Select Time Slot
            </label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all border-2 ${
                    selectedTime === slot
                      ? 'border-[hsl(var(--navy))] bg-[hsl(var(--navy))]/5 text-[hsl(var(--navy))]'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* What to Expect Hint Guide */}
          <div>
            <button
              onClick={() => setShowHints(!showHints)}
              className="flex items-center gap-2 text-sm font-bold text-[hsl(var(--escrow-amber))] mb-3 hover:underline"
            >
              <Lightbulb className="w-4 h-4" />
              What to Expect
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showHints ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showHints && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-3 pb-2">
                    {hintGuide.map((hint, i) => (
                      <motion.div
                        key={hint.title}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-3 bg-[hsl(var(--escrow-amber))]/5 border border-[hsl(var(--escrow-amber))]/15 rounded-xl p-3.5"
                      >
                        <span className="text-lg shrink-0">{hint.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800">{hint.title}</p>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">{hint.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-6 pb-6 pt-3 border-t border-slate-100 shrink-0">
          <button
            onClick={() => canPropose && onPropose(selectedDate!, selectedTime)}
            disabled={!canPropose}
            className={`w-full h-14 rounded-full font-bold text-sm shadow-lg transition-all active:scale-[0.98] active:bg-primary flex items-center justify-center gap-2 ${
              canPropose
                ? 'bg-primary text-white hover:bg-primary/90'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <Clock className="w-5 h-5" />
            Propose Handover Time
            {canPropose && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
