import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight, ArrowLeft, Check, MapPin, Search,
  Scale, Compass, Wrench, Paintbrush, Zap, Droplets,
  HardHat, Shield, FileSearch, Hammer, Building, User
} from 'lucide-react';

interface ProDiscoveryProps {
  onComplete: () => void;
  onBack: () => void;
}

const serviceCategories = [
  { id: 'legal', label: 'Legal Services', description: 'Property law, documentation & conveyancing', icon: Scale, color: 'from-indigo-50 to-indigo-100', iconColor: 'text-indigo-500' },
  { id: 'surveying', label: 'Surveying', description: 'Land surveying, mapping & boundary marking', icon: Compass, color: 'from-emerald-50 to-emerald-100', iconColor: 'text-emerald-500' },
  { id: 'maintenance', label: 'Maintenance', description: 'General repairs, servicing & upkeep', icon: Wrench, color: 'from-amber-50 to-amber-100', iconColor: 'text-amber-500' },
  { id: 'painting', label: 'Painting & Finishing', description: 'Interior/exterior painting & wall treatments', icon: Paintbrush, color: 'from-pink-50 to-pink-100', iconColor: 'text-pink-500' },
  { id: 'electrical', label: 'Electrical', description: 'Wiring, installations & power systems', icon: Zap, color: 'from-yellow-50 to-yellow-100', iconColor: 'text-yellow-600' },
  { id: 'plumbing', label: 'Plumbing', description: 'Pipes, water systems & drainage', icon: Droplets, color: 'from-blue-50 to-blue-100', iconColor: 'text-blue-500' },
  { id: 'construction', label: 'Construction', description: 'Building, renovations & structural work', icon: HardHat, color: 'from-orange-50 to-orange-100', iconColor: 'text-orange-500' },
  { id: 'security', label: 'Security Systems', description: 'CCTV, alarms & access control', icon: Shield, color: 'from-red-50 to-red-100', iconColor: 'text-red-500' },
  { id: 'inspection', label: 'Property Inspection', description: 'Building reports, valuations & due diligence', icon: FileSearch, color: 'from-teal-50 to-teal-100', iconColor: 'text-teal-500' },
  { id: 'carpentry', label: 'Carpentry & Joinery', description: 'Custom furniture, doors & woodwork', icon: Hammer, color: 'from-stone-50 to-stone-200', iconColor: 'text-stone-600' },
];

const businessTypes = [
  {
    id: 'individual',
    label: 'Individual Artisan',
    description: 'I work independently as a skilled professional',
    icon: User,
    color: 'from-blue-50 to-blue-100',
    iconColor: 'text-blue-500',
  },
  {
    id: 'firm',
    label: 'Registered Firm',
    description: 'I represent or own a registered business/company',
    icon: Building,
    color: 'from-emerald-50 to-emerald-100',
    iconColor: 'text-emerald-500',
  },
];

const popularAreas = [
  'Lagos Island', 'Lekki', 'Victoria Island', 'Ikeja', 'Surulere',
  'Abuja (Central)', 'Wuse', 'Garki', 'Gwarinpa', 'Port Harcourt',
  'Ibadan', 'Enugu', 'Calabar', 'Benin City', 'Kaduna',
];

export const ProDiscovery: React.FC<ProDiscoveryProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [businessType, setBusinessType] = useState('');
  const [firmName, setFirmName] = useState('');
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const toggleService = (id: string) => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const toggleArea = (area: string) => {
    setSelectedAreas(prev =>
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  const canProceed = () => {
    if (step === 1) return selectedServices.length > 0;
    if (step === 2) return !!businessType;
    if (step === 3) return selectedAreas.length > 0;
    if (step === 4) return true;
    return false;
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  const filteredAreas = popularAreas.filter(area =>
    area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedServiceLabels = serviceCategories
    .filter(s => selectedServices.includes(s.id))
    .map(s => s.label);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            className="p-2 rounded-full bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-slate-400 text-sm font-bold">Step {step} of {totalSteps}</span>
          <button
            onClick={onComplete}
            className="text-slate-400 text-sm font-bold hover:text-slate-600 transition-colors"
          >
            Skip
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* Step 1: Role Selection */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-2 inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full">
                <span className="text-sm">👋</span>
                <span className="text-slate-500 text-xs font-bold">Welcome, Professional!</span>
              </div>
              <h2 className="text-slate-900 font-black text-3xl mb-2 mt-4">Which professional service do you provide?</h2>
              <p className="text-slate-400 font-medium mb-8">Select one or more categories that match your expertise.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {serviceCategories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedServices.includes(cat.id);
                  return (
                    <motion.button
                      key={cat.id}
                      onClick={() => toggleService(cat.id)}
                      whileTap={{ scale: 0.97 }}
                      className={`p-4 rounded-2xl border transition-all flex items-center gap-4 text-left ${
                        isSelected
                          ? 'bg-primary/5 border-primary/30 shadow-lg shadow-primary/5'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center shrink-0`}>
                        <Icon className={`w-6 h-6 ${isSelected ? 'text-primary' : cat.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-bold text-sm ${isSelected ? 'text-primary' : 'text-slate-800'}`}>{cat.label}</h3>
                        <p className="text-slate-400 text-[11px] font-medium truncate">{cat.description}</p>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0"
                        >
                          <Check className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 2: Business Identity */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-slate-900 font-black text-3xl mb-2">How do you operate?</h2>
              <p className="text-slate-400 font-medium mb-10">Are you an individual artisan or a registered firm?</p>

              <div className="space-y-4">
                {businessTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = businessType === type.id;
                  return (
                    <motion.button
                      key={type.id}
                      onClick={() => setBusinessType(type.id)}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full p-6 rounded-2xl border transition-all flex items-center gap-5 text-left ${
                        isSelected
                          ? 'bg-primary/5 border-primary/30 shadow-lg shadow-primary/5'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                      }`}
                    >
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center shrink-0`}>
                        <Icon className={`w-7 h-7 ${isSelected ? 'text-primary' : type.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-black text-xl ${isSelected ? 'text-primary' : 'text-slate-800'}`}>{type.label}</h3>
                        <p className="text-slate-400 text-sm font-medium">{type.description}</p>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0"
                        >
                          <Check className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {businessType === 'firm' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6"
                >
                  <label className="text-slate-600 text-sm font-bold mb-2 block">Firm / Business Name</label>
                  <input
                    type="text"
                    value={firmName}
                    onChange={(e) => setFirmName(e.target.value)}
                    placeholder="e.g. Ace Plumbing Solutions Ltd"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-300 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Step 3: Territory */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-slate-900 font-black text-3xl mb-2">Which areas do you cover?</h2>
              <p className="text-slate-400 font-medium mb-8">Select the neighborhoods and cities where you can take jobs.</p>

              {/* Map-like visual */}
              <div className="relative mb-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 p-6 overflow-hidden">
                <div className="absolute top-3 right-3 w-16 h-16 bg-primary/5 rounded-full blur-2xl" />
                <div className="absolute bottom-3 left-3 w-12 h-12 bg-blue-500/5 rounded-full blur-xl" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-slate-700 font-bold text-sm">Service Coverage</p>
                    <p className="text-slate-400 text-xs font-medium">{selectedAreas.length} {selectedAreas.length === 1 ? 'area' : 'areas'} selected</p>
                  </div>
                </div>
                {selectedAreas.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedAreas.map(area => (
                      <span key={area} className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {area}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Search */}
              <div className="relative mb-8">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for an area..."
                  className="w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-full text-slate-900 placeholder-slate-300 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>

              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                Popular Areas
              </p>

              <div className="flex flex-wrap gap-3">
                {filteredAreas.map((area) => {
                  const isSelected = selectedAreas.includes(area);
                  return (
                    <motion.button
                      key={area}
                      onClick={() => toggleArea(area)}
                      whileTap={{ scale: 0.95 }}
                      className={`px-5 py-3 rounded-full border font-bold text-sm transition-all ${
                        isSelected
                          ? 'bg-primary text-white border-primary shadow-lg shadow-primary/15'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:shadow-sm'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 inline mr-2" />}
                      {area}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 4: Tiered Hook / Success */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-24 h-24 rounded-3xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 flex items-center justify-center mx-auto mb-8"
              >
                <Check className="w-12 h-12 text-green-500" />
              </motion.div>

              <h2 className="text-slate-900 font-black text-3xl mb-3">Profile Created!</h2>
              <p className="text-slate-400 font-medium mb-8 max-w-md mx-auto">
                You can now browse service requests in your area. Your expertise is ready to be matched with clients.
              </p>

              {/* What you can do */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-6 text-left max-w-md mx-auto">
                <h3 className="text-slate-700 font-bold text-sm mb-4">What you can do now</h3>
                <div className="space-y-3">
                  {[
                    'Browse service requests from verified clients',
                    'View job details, locations & urgency levels',
                    'Set up your professional portfolio',
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-green-500" />
                      </div>
                      <span className="text-slate-500 text-sm font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tier upgrade notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-left max-w-md mx-auto">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-800 text-sm font-bold mb-1">Unlock Quotes & Payments</p>
                    <p className="text-amber-600 text-xs font-medium">
                      To send quotes and receive payments, we'll verify your professional license/ID in the Trust Center. This unlocks Tier 2 and milestone-based escrow protection.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Action */}
      <div className="px-6 pb-8 max-w-2xl mx-auto w-full">
        <motion.button
          onClick={handleNext}
          disabled={!canProceed()}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-4 rounded-full font-black text-lg transition-all flex items-center justify-center gap-2 ${
            canProceed()
              ? 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/25'
              : 'bg-slate-100 text-slate-300 cursor-not-allowed'
          }`}
        >
          {step === totalSteps ? 'Enter Workroom' : 'Continue'}
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};
