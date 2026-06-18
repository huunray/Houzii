import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2, MapPin, Search, ArrowRight, ArrowLeft, Check,
  Users, Briefcase, Home, Store, Palmtree, Mountain
} from 'lucide-react';

interface AgentDiscoveryProps {
  onComplete: () => void;
  onBack: () => void;
}

const agentTypes = [
  {
    id: 'independent',
    label: 'Independent Agent',
    description: 'I work independently and manage my own listings',
    icon: Briefcase,
    color: 'from-blue-50 to-blue-100',
    iconColor: 'text-blue-500',
  },
  {
    id: 'brokerage',
    label: 'Part of a Brokerage',
    description: 'I work under a registered real estate brokerage',
    icon: Building2,
    color: 'from-emerald-50 to-emerald-100',
    iconColor: 'text-emerald-500',
  },
];

const popularCities = ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Enugu', 'Calabar', 'Benin City', 'Kaduna', 'Kano', 'Warri'];

const specialties = [
  { id: 'residential', label: 'Residential', icon: Home },
  { id: 'commercial', label: 'Commercial', icon: Store },
  { id: 'shortlets', label: 'Shortlets', icon: Palmtree },
  { id: 'land', label: 'Land', icon: Mountain },
];

export const AgentDiscovery: React.FC<AgentDiscoveryProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState('');
  const [brokerageName, setBrokerageName] = useState('');
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const toggleCity = (city: string) => {
    setSelectedCities(prev =>
      prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]
    );
  };

  const toggleSpecialty = (id: string) => {
    setSelectedSpecialties(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const canProceed = () => {
    if (step === 1) return !!selectedType;
    if (step === 2) return selectedCities.length > 0;
    if (step === 3) return selectedSpecialties.length > 0;
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

  const filteredCities = popularCities.filter(city =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
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
              <h2 className="text-slate-900 font-black text-3xl mb-2 mt-4">Tell us about yourself</h2>
              <p className="text-slate-400 font-medium mb-10">Are you an independent agent or part of a brokerage?</p>

              <div className="space-y-4">
                {agentTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedType === type.id;
                  return (
                    <motion.button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
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

              {selectedType === 'brokerage' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6"
                >
                  <label className="text-slate-600 text-sm font-bold mb-2 block">Brokerage Name</label>
                  <input
                    type="text"
                    value={brokerageName}
                    onChange={(e) => setBrokerageName(e.target.value)}
                    placeholder="e.g. Alpha Mead Group"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-300 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </motion.div>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-slate-900 font-black text-3xl mb-2">What's your territory?</h2>
              <p className="text-slate-400 font-medium mb-8">Select the cities where you operate</p>

              {/* Map-like visual */}
              <div className="relative mb-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 p-6 overflow-hidden">
                <div className="absolute top-3 right-3 w-16 h-16 bg-primary/5 rounded-full blur-2xl" />
                <div className="absolute bottom-3 left-3 w-12 h-12 bg-blue-500/5 rounded-full blur-xl" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-slate-700 font-bold text-sm">Territory Coverage</p>
                    <p className="text-slate-400 text-xs font-medium">{selectedCities.length} {selectedCities.length === 1 ? 'city' : 'cities'} selected</p>
                  </div>
                </div>
                {selectedCities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedCities.map(city => (
                      <span key={city} className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {city}
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
                  placeholder="Search for a city..."
                  className="w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-full text-slate-900 placeholder-slate-300 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>

              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                Popular Cities
              </p>

              <div className="flex flex-wrap gap-3">
                {filteredCities.map((city) => {
                  const isSelected = selectedCities.includes(city);
                  return (
                    <motion.button
                      key={city}
                      onClick={() => toggleCity(city)}
                      whileTap={{ scale: 0.95 }}
                      className={`px-6 py-3 rounded-full border font-bold text-sm transition-all ${
                        isSelected
                          ? 'bg-primary text-white border-primary shadow-lg shadow-primary/15'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:shadow-sm'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 inline mr-2" />}
                      {city}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-slate-900 font-black text-3xl mb-2">What's your specialty?</h2>
              <p className="text-slate-400 font-medium mb-10">Select all property types you deal in</p>

              <div className="grid grid-cols-2 gap-4">
                {specialties.map((spec) => {
                  const Icon = spec.icon;
                  const isSelected = selectedSpecialties.includes(spec.id);
                  return (
                    <motion.button
                      key={spec.id}
                      onClick={() => toggleSpecialty(spec.id)}
                      whileTap={{ scale: 0.95 }}
                      className={`p-6 rounded-2xl border flex flex-col items-center gap-3 transition-all ${
                        isSelected
                          ? 'bg-primary/5 border-primary/30 shadow-lg shadow-primary/5'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        isSelected ? 'bg-primary/10' : 'bg-slate-50'
                      }`}>
                        <Icon className={`w-7 h-7 ${isSelected ? 'text-primary' : 'text-slate-400'}`} />
                      </div>
                      <span className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-slate-600'}`}>
                        {spec.label}
                      </span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
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
          {step === totalSteps ? 'Complete Setup' : 'Continue'}
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};
