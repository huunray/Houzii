import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowRight, Home, Sparkles as SparklesIcon, Check } from 'lucide-react';
import { SERVICE_CATEGORIES, ServiceCategoryId } from './service-types';

interface GetSettledModalProps {
  propertyTitle: string;
  onClose: () => void;
  onContinue: (selected: ServiceCategoryId[]) => void;
}

export const GetSettledModal: React.FC<GetSettledModalProps> = ({
  propertyTitle,
  onClose,
  onContinue,
}) => {
  const [selected, setSelected] = useState<ServiceCategoryId[]>([]);
  const highPriority = SERVICE_CATEGORIES.filter(c => c.priority === 'high');
  const secondary = SERVICE_CATEGORIES.filter(c => c.priority === 'secondary');

  const toggle = (id: ServiceCategoryId) =>
    setSelected(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
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
        className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl bg-white max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-primary-dark px-6 pt-8 pb-7 text-center relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 14 }}
            className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center mx-auto mb-4"
          >
            <Home className="w-8 h-8 text-white" />
          </motion.div>

          <h1 className="text-white font-black text-2xl mb-1.5">
            Almost Home! <span className="inline-block">🎉</span>
          </h1>
          <p className="text-white/80 text-sm font-medium px-4">
            Need help getting settled into <span className="font-bold">{propertyTitle}</span>?
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* High-priority services */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <SparklesIcon className="w-4 h-4 text-primary" />
              <p className="text-slate-600 text-[11px] font-black uppercase tracking-wider">
                Most popular for new tenants
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {highPriority.map((cat, i) => {
                const Icon = cat.icon;
                const isSelected = selected.includes(cat.id);
                return (
                  <motion.button
                    key={cat.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    onClick={() => toggle(cat.id)}
                    className={`relative p-5 rounded-2xl border-2 text-left transition-all bg-gradient-to-br ${cat.accent.from} ${cat.accent.to} ${
                      isSelected
                        ? 'border-primary shadow-lg shadow-primary/15 scale-[1.02]'
                        : 'border-transparent hover:border-slate-200'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                      >
                        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                    <div className={`w-12 h-12 rounded-2xl ${cat.accent.iconBg} flex items-center justify-center mb-3`}>
                      <Icon className={`w-6 h-6 ${cat.accent.icon}`} />
                    </div>
                    <h3 className="text-slate-900 font-black text-sm mb-1">Book {cat.label}</h3>
                    <p className="text-slate-500 text-[11px] font-medium leading-snug">{cat.tagline}</p>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Secondary list */}
          <div>
            <p className="text-slate-400 text-[11px] font-black uppercase tracking-wider mb-3">
              Other services
            </p>
            <div className="grid grid-cols-2 gap-2">
              {secondary.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selected.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggle(cat.id)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all text-left ${
                      isSelected
                        ? 'bg-primary/5 border-primary/30 text-primary'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${cat.accent.iconBg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-4 h-4 ${cat.accent.icon}`} />
                    </div>
                    <span className="text-xs font-bold flex-1">{cat.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 shrink-0 flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-5 h-11 rounded-full text-slate-500 hover:text-slate-700 text-sm font-bold transition-colors"
          >
            Maybe later
          </button>
          <button
            onClick={() => onContinue(selected)}
            disabled={selected.length === 0}
            className="flex-1 h-11 bg-primary hover:bg-primary-dark text-white rounded-full font-bold text-sm shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          >
            Next {selected.length > 0 && <span className="px-2 py-0.5 rounded-full bg-white/20 text-[11px]">{selected.length}</span>}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
