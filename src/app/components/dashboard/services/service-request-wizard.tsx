import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ArrowRight, ArrowLeft, Camera, Upload, Trash2, Check,
  Truck, MapPin, Building2, ChevronUp, ChevronDown,
} from 'lucide-react';
import {
  SERVICE_CATEGORIES, ServiceCategoryId, MovingFormData, GeneralFormData, ServiceFormData,
} from './service-types';

interface ServiceRequestWizardProps {
  selectedCategories: ServiceCategoryId[];
  propertyTitle: string;
  onClose: () => void;
  onSubmit: (requests: { category: ServiceCategoryId; form: ServiceFormData }[]) => void;
}

const INVENTORY_OPTIONS = [
  'Bed', 'Sofa', 'Fridge', 'TV', 'Wardrobe', 'Dining Table',
  'Washing Machine', 'Cooker', 'Microwave', 'Bookshelf', 'Desk',
];

const FLOOR_OPTIONS = ['Ground', '1st', '2nd', '3rd', '4th', '5th', '6th+'];

const initialMoving = (): MovingFormData => ({
  pickupLocation: '',
  destination: '',
  inventory: [],
  floorLevel: 'Ground',
  liftAvailable: null,
  mediaCount: 0,
  budget: '',
});

const initialGeneral = (): GeneralFormData => ({
  description: '',
  mediaCount: 0,
  budgetMode: 'bid',
  fixedBudget: '',
});

export const ServiceRequestWizard: React.FC<ServiceRequestWizardProps> = ({
  selectedCategories,
  propertyTitle,
  onClose,
  onSubmit,
}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [forms, setForms] = useState<Record<ServiceCategoryId, ServiceFormData>>(() => {
    const initial: Partial<Record<ServiceCategoryId, ServiceFormData>> = {};
    selectedCategories.forEach((id) => {
      initial[id] =
        id === 'moving'
          ? { type: 'moving', data: initialMoving() }
          : { type: 'general', data: initialGeneral() };
    });
    return initial as Record<ServiceCategoryId, ServiceFormData>;
  });

  const currentId = selectedCategories[stepIndex];
  const currentCat = useMemo(
    () => SERVICE_CATEGORIES.find((c) => c.id === currentId)!,
    [currentId],
  );
  const total = selectedCategories.length;
  const isLast = stepIndex === total - 1;
  const currentForm = forms[currentId];

  const updateMoving = (patch: Partial<MovingFormData>) => {
    setForms((prev) => {
      const f = prev[currentId];
      if (f.type !== 'moving') return prev;
      return { ...prev, [currentId]: { type: 'moving', data: { ...f.data, ...patch } } };
    });
  };

  const updateGeneral = (patch: Partial<GeneralFormData>) => {
    setForms((prev) => {
      const f = prev[currentId];
      if (f.type !== 'general') return prev;
      return { ...prev, [currentId]: { type: 'general', data: { ...f.data, ...patch } } };
    });
  };

  const isCurrentValid = (): boolean => {
    if (currentForm.type === 'moving') {
      const d = currentForm.data;
      return Boolean(
        d.pickupLocation &&
          d.destination &&
          d.inventory.length > 0 &&
          d.liftAvailable &&
          d.mediaCount > 0 &&
          d.budget.trim(),
      );
    }
    const d = currentForm.data;
    if (!d.description.trim()) return false;
    if (d.budgetMode === 'fixed' && !d.fixedBudget?.trim()) return false;
    return true;
  };

  const handleNext = () => {
    if (isLast) {
      onSubmit(
        selectedCategories.map((id) => ({ category: id, form: forms[id] })),
      );
      return;
    }
    setStepIndex(stepIndex + 1);
  };

  const handleBack = () => {
    if (stepIndex === 0) return;
    setStepIndex(stepIndex - 1);
  };

  const Icon = currentCat.icon;

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
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${currentCat.accent.iconBg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${currentCat.accent.icon}`} />
              </div>
              <div>
                <h3 className="text-slate-900 font-black text-sm">
                  {currentCat.label} Request
                </h3>
                <p className="text-slate-400 text-[10px] font-bold">
                  Service {stepIndex + 1} of {total} • {propertyTitle}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Step indicator */}
          <div className="flex gap-1.5">
            {selectedCategories.map((id, i) => (
              <div
                key={id}
                className={`flex-1 h-1.5 rounded-full transition-all ${
                  i <= stepIndex ? 'bg-primary' : 'bg-slate-100'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentForm.type === 'moving' ? (
                <MovingForm data={currentForm.data} update={updateMoving} />
              ) : (
                <GeneralForm
                  data={currentForm.data}
                  update={updateGeneral}
                  categoryLabel={currentCat.label}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 shrink-0 flex items-center gap-3">
          {stepIndex > 0 ? (
            <button
              onClick={handleBack}
              className="h-11 px-4 rounded-full text-slate-500 hover:text-slate-700 text-sm font-bold transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <button
              onClick={onClose}
              className="h-11 px-4 rounded-full text-slate-500 hover:text-slate-700 text-sm font-bold transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!isCurrentValid()}
            className="flex-1 h-11 bg-primary hover:bg-primary-dark text-white rounded-full font-bold text-sm shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {isLast ? (
              <>
                <Check className="w-4 h-4" /> Submit {total > 1 ? `${total} Requests` : 'Request'}
              </>
            ) : (
              <>
                Next <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Moving Form ──────────────────────────────────────────────────────────────

const MovingForm: React.FC<{
  data: MovingFormData;
  update: (patch: Partial<MovingFormData>) => void;
}> = ({ data, update }) => {
  const [inventoryOpen, setInventoryOpen] = useState(false);

  const toggleItem = (item: string) =>
    update({
      inventory: data.inventory.includes(item)
        ? data.inventory.filter((x) => x !== item)
        : [...data.inventory, item],
    });

  return (
    <div className="space-y-5">
      <div>
        <h4 className="text-slate-900 font-black text-lg mb-1 flex items-center gap-2">
          <Truck className="w-5 h-5 text-amber-500" /> Tell us about your move
        </h4>
        <p className="text-slate-400 text-xs font-medium">
          The more accurate, the better the bid.
        </p>
      </div>

      {/* Pickup */}
      <div>
        <label className="text-slate-600 text-[11px] font-bold uppercase tracking-wider mb-2 block">
          Pickup Location
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={data.pickupLocation}
            onChange={(e) => update({ pickupLocation: e.target.value })}
            placeholder="e.g. 14 Adeola Odeku, Victoria Island"
            className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/5"
          />
        </div>
      </div>

      {/* Destination */}
      <div>
        <label className="text-slate-600 text-[11px] font-bold uppercase tracking-wider mb-2 block">
          Destination
        </label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={data.destination}
            onChange={(e) => update({ destination: e.target.value })}
            placeholder="Your new address"
            className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/5"
          />
        </div>
      </div>

      {/* Inventory */}
      <div>
        <label className="text-slate-600 text-[11px] font-bold uppercase tracking-wider mb-2 block">
          Inventory ({data.inventory.length} items)
        </label>
        <button
          type="button"
          onClick={() => setInventoryOpen(!inventoryOpen)}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 flex items-center justify-between hover:border-slate-300 transition-all"
        >
          <span className={data.inventory.length === 0 ? 'text-slate-400' : ''}>
            {data.inventory.length === 0 ? 'Select items to move' : data.inventory.slice(0, 3).join(', ') + (data.inventory.length > 3 ? `, +${data.inventory.length - 3}` : '')}
          </span>
          {inventoryOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        <AnimatePresence>
          {inventoryOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-1.5 mt-2 p-2 bg-white border border-slate-200 rounded-xl">
                {INVENTORY_OPTIONS.map((item) => {
                  const checked = data.inventory.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleItem(item)}
                      className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-bold transition-all ${
                        checked
                          ? 'bg-primary/10 text-primary'
                          : 'text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                          checked ? 'bg-primary border-primary' : 'border-slate-300'
                        }`}
                      >
                        {checked && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                      </div>
                      {item}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floor & lift */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-slate-600 text-[11px] font-bold uppercase tracking-wider mb-2 block">
            Floor Level
          </label>
          <select
            value={data.floorLevel}
            onChange={(e) => update({ floorLevel: e.target.value })}
            className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/5"
          >
            {FLOOR_OPTIONS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-slate-600 text-[11px] font-bold uppercase tracking-wider mb-2 block">
            Lift Available?
          </label>
          <div className="flex bg-slate-100 rounded-xl p-1 h-12">
            {(['yes', 'no'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => update({ liftAvailable: v })}
                className={`flex-1 rounded-lg text-xs font-bold uppercase transition-all ${
                  data.liftAvailable === v
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-slate-400'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Photos / Video — mandatory */}
      <div>
        <label className="text-slate-600 text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
          Photos / Video <span className="text-[hsl(var(--escrow-red))]">*</span>
        </label>
        <p className="text-slate-400 text-[11px] font-medium mb-2">
          Pros provide better bids when they see your items.
        </p>

        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: data.mediaCount }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 border border-slate-200 relative overflow-hidden flex items-center justify-center"
            >
              <Camera className="w-5 h-5 text-slate-500" />
              <button
                type="button"
                onClick={() => update({ mediaCount: Math.max(0, data.mediaCount - 1) })}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                <Trash2 className="w-2.5 h-2.5 text-white" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => update({ mediaCount: data.mediaCount + 1 })}
            className="aspect-square rounded-xl bg-slate-50 border-2 border-dashed border-slate-300 hover:border-primary/40 hover:bg-primary/5 flex flex-col items-center justify-center gap-1 transition-all group"
          >
            <Upload className="w-5 h-5 text-slate-400 group-hover:text-primary" />
            <span className="text-[10px] font-bold text-slate-400 group-hover:text-primary">
              Upload
            </span>
          </button>
        </div>
      </div>

      {/* Budget — mandatory */}
      <div>
        <label className="text-slate-600 text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
          What is your budget for this move? <span className="text-[hsl(var(--escrow-red))]">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">
            ₦
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={data.budget}
            onChange={(e) => update({ budget: e.target.value })}
            placeholder="e.g. 150,000"
            className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/5"
          />
        </div>
        <p className="text-slate-400 text-[11px] font-medium mt-1.5">
          Pros will try to match or beat this price.
        </p>
      </div>
    </div>
  );
};

// ─── General Service Form ─────────────────────────────────────────────────────

const GeneralForm: React.FC<{
  data: GeneralFormData;
  update: (patch: Partial<GeneralFormData>) => void;
  categoryLabel: string;
}> = ({ data, update, categoryLabel }) => {
  const placeholderHint =
    categoryLabel === 'Electrician'
      ? 'e.g. Living room socket is burnt and the fuse trips when AC is on.'
      : categoryLabel === 'Plumber'
      ? 'e.g. Kitchen sink leaking under the cabinet, water collects in the morning.'
      : `Describe what you need from a ${categoryLabel.toLowerCase()}…`;

  const uploadHint =
    categoryLabel === 'Electrician'
      ? 'Take a picture of the burnt socket and the fuse box.'
      : categoryLabel === 'Plumber'
      ? 'Snap a photo of the leak and the affected pipework.'
      : 'Add photos or a short video of the issue.';

  return (
    <div className="space-y-5">
      <div>
        <h4 className="text-slate-900 font-black text-lg mb-1">
          Describe your {categoryLabel.toLowerCase()} need
        </h4>
        <p className="text-slate-400 text-xs font-medium">
          Pros use this to send accurate inspection bids.
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="text-slate-600 text-[11px] font-bold uppercase tracking-wider mb-2 block">
          Describe the issue in your own words
        </label>
        <textarea
          value={data.description}
          onChange={(e) => update({ description: e.target.value })}
          placeholder={placeholderHint}
          rows={4}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/5 resize-none"
        />
      </div>

      {/* Mandatory media */}
      <div>
        <label className="text-slate-600 text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
          Photos / Video <span className="text-[hsl(var(--escrow-red))]">*</span>
        </label>
        <p className="text-slate-400 text-[11px] font-medium mb-2">{uploadHint}</p>

        <div className="grid grid-cols-3 gap-2">
          {/* Existing mock items */}
          {Array.from({ length: data.mediaCount }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 border border-slate-200 relative overflow-hidden flex items-center justify-center"
            >
              <Camera className="w-5 h-5 text-slate-500" />
              <button
                type="button"
                onClick={() => update({ mediaCount: Math.max(0, data.mediaCount - 1) })}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                <Trash2 className="w-2.5 h-2.5 text-white" />
              </button>
            </div>
          ))}

          {/* Upload tile */}
          <button
            type="button"
            onClick={() => update({ mediaCount: data.mediaCount + 1 })}
            className="aspect-square rounded-xl bg-slate-50 border-2 border-dashed border-slate-300 hover:border-primary/40 hover:bg-primary/5 flex flex-col items-center justify-center gap-1 transition-all group"
          >
            <Upload className="w-5 h-5 text-slate-400 group-hover:text-primary" />
            <span className="text-[10px] font-bold text-slate-400 group-hover:text-primary">
              Upload
            </span>
          </button>
        </div>
      </div>

      {/* Budget Toggle */}
      <div>
        <label className="text-slate-600 text-[11px] font-bold uppercase tracking-wider mb-2 block">
          Budget Preference
        </label>
        <div className="flex bg-slate-100 rounded-xl p-1 h-12 mb-3">
          {([
            { id: 'bid' as const, label: 'Bid Based' },
            { id: 'fixed' as const, label: 'Fixed Budget' },
          ]).map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => update({ budgetMode: opt.id })}
              className={`flex-1 rounded-lg text-xs font-bold transition-all ${
                data.budgetMode === opt.id
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-slate-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {data.budgetMode === 'fixed' ? (
          <div className="space-y-2">
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
              <p className="text-amber-800 text-[11px] font-bold leading-snug">
                Recommended only if you are 100% sure of the work needed.
              </p>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">
                ₦
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={data.fixedBudget || ''}
                onChange={(e) => update({ fixedBudget: e.target.value })}
                placeholder="e.g. 50,000"
                className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/5"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 text-primary text-[10px] font-black uppercase tracking-wider mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Diagnosis Fee (Recommended)
              </span>
              <p className="text-slate-700 text-xs font-medium leading-snug">
                Pros will bid a small inspection fee to diagnose the true issue.
                You'll get the guaranteed project cost after the visit.
              </p>
            </div>

            {/* 2-stage milestone infographic */}
            <div className="flex items-center gap-2">
              <div className="flex-1 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-[10px] font-black flex items-center justify-center">1</span>
                  <span className="text-slate-700 text-[11px] font-black uppercase tracking-wider">Inspect</span>
                </div>
                <p className="text-slate-400 text-[10px] font-bold">₦ Small fee</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />
              <div className="flex-1 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-[10px] font-black flex items-center justify-center">2</span>
                  <span className="text-slate-700 text-[11px] font-black uppercase tracking-wider">Repair</span>
                </div>
                <p className="text-slate-400 text-[10px] font-bold">₦₦ Agreed quote</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
