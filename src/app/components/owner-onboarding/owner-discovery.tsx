import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight, ArrowLeft, Check, Home, Building2, MapPin,
  Search, DollarSign, Key, LayoutGrid, Mountain, Landmark, Users
} from 'lucide-react';

interface OwnerDiscoveryProps {
  onComplete: () => void;
  onBack: () => void;
}

const ownerGoals = [
  {
    id: 'rent',
    label: 'Rent out a Property',
    description: 'Find verified tenants and collect rent automatically',
    icon: Key,
    color: 'from-blue-50 to-blue-100',
    iconColor: 'text-blue-500',
  },
  {
    id: 'sell',
    label: 'Sell a Property',
    description: 'Connect with serious, pre-qualified buyers',
    icon: DollarSign,
    color: 'from-emerald-50 to-emerald-100',
    iconColor: 'text-emerald-500',
  },
  {
    id: 'portfolio',
    label: 'Manage a Portfolio',
    description: 'Oversee multiple properties from one dashboard',
    icon: LayoutGrid,
    color: 'from-purple-50 to-purple-100',
    iconColor: 'text-purple-500',
  },
];

const propertyTypes = [
  { id: 'duplex', label: 'Duplex', icon: Home },
  { id: 'flat', label: 'Flat / Apartment', icon: Building2 },
  { id: 'land', label: 'Land', icon: Mountain },
  { id: 'commercial', label: 'Commercial', icon: Landmark },
];

const locations = [
  'Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Enugu',
  'Calabar', 'Benin City', 'Kaduna', 'Kano', 'Warri'
];

export const OwnerDiscovery: React.FC<OwnerDiscoveryProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState('');
  const [selectedPropertyType, setSelectedPropertyType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [agentPreference, setAgentPreference] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const canProceed = () => {
    if (step === 1) return !!selectedGoal;
    if (step === 2) return !!selectedPropertyType && !!selectedLocation;
    if (step === 3) return !!agentPreference;
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

  const filteredLocations = locations.filter(loc =>
    loc.toLowerCase().includes(searchQuery.toLowerCase())
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
              key="owner-step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-2 inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full">
                <span className="text-sm">👋</span>
                <span className="text-slate-500 text-xs font-bold">Welcome, Owner!</span>
              </div>
              <h2 className="text-slate-900 font-black text-3xl mb-2 mt-4">What would you like to do?</h2>
              <p className="text-slate-400 font-medium mb-10">Choose the option that best fits your needs.</p>

              <div className="space-y-4">
                {ownerGoals.map((goal) => {
                  const Icon = goal.icon;
                  const isSelected = selectedGoal === goal.id;
                  return (
                    <motion.button
                      key={goal.id}
                      onClick={() => setSelectedGoal(goal.id)}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full p-6 rounded-2xl border transition-all flex items-center gap-5 text-left ${
                        isSelected
                          ? 'bg-primary/5 border-primary/30 shadow-lg shadow-primary/5'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                      }`}
                    >
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${goal.color} flex items-center justify-center shrink-0`}>
                        <Icon className={`w-7 h-7 ${isSelected ? 'text-primary' : goal.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-black text-xl ${isSelected ? 'text-primary' : 'text-slate-800'}`}>{goal.label}</h3>
                        <p className="text-slate-400 text-sm font-medium">{goal.description}</p>
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
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="owner-step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-slate-900 font-black text-3xl mb-2">Tell us about your first asset</h2>
              <p className="text-slate-400 font-medium mb-10">This helps us customize your dashboard experience.</p>

              {/* Property Type */}
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Home className="w-3.5 h-3.5" />
                Property Type
              </p>
              <div className="grid grid-cols-2 gap-4 mb-10">
                {propertyTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedPropertyType === type.id;
                  return (
                    <motion.button
                      key={type.id}
                      onClick={() => setSelectedPropertyType(type.id)}
                      whileTap={{ scale: 0.95 }}
                      className={`p-5 rounded-2xl border flex flex-col items-center gap-3 transition-all ${
                        isSelected
                          ? 'bg-primary/5 border-primary/30 shadow-lg shadow-primary/5'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        isSelected ? 'bg-primary/10' : 'bg-slate-50'
                      }`}>
                        <Icon className={`w-6 h-6 ${isSelected ? 'text-primary' : 'text-slate-400'}`} />
                      </div>
                      <span className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-slate-600'}`}>
                        {type.label}
                      </span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                        >
                          <Check className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Location */}
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                Location
              </p>

              <div className="relative mb-6">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a city..."
                  className="w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-full text-slate-900 placeholder-slate-300 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                {filteredLocations.map((loc) => {
                  const isSelected = selectedLocation === loc;
                  return (
                    <motion.button
                      key={loc}
                      onClick={() => setSelectedLocation(loc)}
                      whileTap={{ scale: 0.95 }}
                      className={`px-6 py-3 rounded-full border font-bold text-sm transition-all ${
                        isSelected
                          ? 'bg-primary text-white border-primary shadow-lg shadow-primary/15'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:shadow-sm'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 inline mr-2" />}
                      {loc}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="owner-step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-slate-900 font-black text-3xl mb-2">Do you have an agent?</h2>
              <p className="text-slate-400 font-medium mb-10">Choose how you'd like to manage your listing.</p>

              <div className="space-y-4">
                <motion.button
                  onClick={() => setAgentPreference('own')}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-6 rounded-2xl border transition-all flex items-center gap-5 text-left ${
                    agentPreference === 'own'
                      ? 'bg-primary/5 border-primary/30 shadow-lg shadow-primary/5'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center shrink-0`}>
                    <Users className={`w-7 h-7 ${agentPreference === 'own' ? 'text-primary' : 'text-amber-500'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-black text-xl ${agentPreference === 'own' ? 'text-primary' : 'text-slate-800'}`}>Use my Agent</h3>
                    <p className="text-slate-400 text-sm font-medium">I already have an agent I work with</p>
                  </div>
                  {agentPreference === 'own' && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </motion.button>

                <motion.button
                  onClick={() => setAgentPreference('match')}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-6 rounded-2xl border transition-all flex items-center gap-5 text-left ${
                    agentPreference === 'match'
                      ? 'bg-primary/5 border-primary/30 shadow-lg shadow-primary/5'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center shrink-0`}>
                    <Search className={`w-7 h-7 ${agentPreference === 'match' ? 'text-primary' : 'text-green-500'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-black text-xl ${agentPreference === 'match' ? 'text-primary' : 'text-slate-800'}`}>Find me an Agent</h3>
                    <p className="text-slate-400 text-sm font-medium">Let Houzii match you with a Top-Rated Professional</p>
                  </div>
                  {agentPreference === 'match' && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              </div>

              {agentPreference === 'match' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 bg-green-50 border border-green-200 rounded-2xl p-5"
                >
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-green-800 text-sm font-bold mb-1">Smart Agent Matching</p>
                      <p className="text-green-600 text-xs font-medium">
                        We'll analyze your property type and location to connect you with top-performing, verified agents in your area.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
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
