import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, CalendarDays, CheckCircle, Bell
} from 'lucide-react';

interface Notification {
  id: number;
  type: 'inspection_confirmed' | 'inspection_request' | 'general';
  title: string;
  body: string;
  time: string;
  read: boolean;
  property?: string;
  date?: string;
  timeSlot?: string;
  agentName?: string;
}

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
  onNotificationAction?: (id: number) => void;
}

export type { Notification };

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  open,
  onClose,
  notifications,
  onNotificationAction,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-16 right-4 lg:right-8 z-[61] w-[380px] max-h-[70vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                <h3 className="font-black text-slate-900 text-sm">Notifications</h3>
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded-full">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-16 text-center">
                  <Bell className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-400">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {notifications.map((notif, i) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer ${
                        !notif.read ? 'bg-primary/[0.02]' : ''
                      }`}
                      onClick={() => onNotificationAction?.(notif.id)}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center ${
                          notif.type === 'inspection_confirmed'
                            ? 'bg-[hsl(var(--escrow-green))]/10'
                            : 'bg-primary/10'
                        }`}>
                          {notif.type === 'inspection_confirmed' ? (
                            <CheckCircle className="w-4 h-4 text-[hsl(var(--escrow-green))]" />
                          ) : (
                            <CalendarDays className="w-4 h-4 text-primary" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-slate-900 mb-0.5">{notif.title}</p>
                          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{notif.body}</p>

                          {notif.date && notif.timeSlot && (
                            <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                              <CalendarDays className="w-3 h-3 text-slate-400" />
                              <span className="text-[10px] font-bold text-slate-600">
                                {notif.date} at {notif.timeSlot}
                              </span>
                            </div>
                          )}

                          <p className="text-[10px] text-slate-300 font-bold mt-1.5">{notif.time}</p>
                        </div>

                        {/* Unread dot */}
                        {!notif.read && (
                          <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
