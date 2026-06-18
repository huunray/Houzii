import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home, Building2, Calendar, MapPin, Search,
  ArrowRight, ArrowLeft, Check, Layers, Crown, Mountain
} from 'lucide-react';

interface DiscoveryCuratorProps {
  onComplete: (preferences: {
    goal: string;
    locations: string[];
    propertyTypes: string[];
  }) => void;
  onBack: () => void;
}

const goals = [
  { id: 'rent', label: 'Rent', description: 'Find your next rental home', icon: Home, color: 'from-blue-50 to-blue-100', iconColor: 'text-blue-500' },
  { id: 'buy', label: 'Buy', description: 'Purchase your dream property', icon: Building2, color: 'from-emerald-50 to-emerald-100', iconColor: 'text-emerald-500' },
  { id: 'shortlet', label: 'Shortlet', description: 'Short-term luxury stays', icon: Calendar, color: 'from-purple-50 to-purple-100', iconColor: 'text-purple-500' },
];

const popularCities = ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Enugu', 'Calabar', 'Benin City', 'Kaduna'];

const propertyTypes = [
  { id: 'apartment', label: 'Apartment', icon: Building2 },
  { id: 'duplex', label: 'Detached Duplex', icon: Home },
  { id: 'penthouse', label: 'Penthouse', icon: Crown },
  { id: 'land', label: 'Land', icon: Mountain },
  { id: 'terrace', label: 'Terrace', icon: Layers },
  { id: 'studio', label: 'Studio', icon: Building2 },
];

export const DiscoveryCurator: React.FC<DiscoveryCuratorProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const toggleLocation = (city: string) => {
    setSelectedLocations(prev =>
      prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]
    );
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const canProceed = () => {
    if (step === 1) return !!selectedGoal;
    if (step === 2) return selectedLocations.length > 0;
    if (step === 3) return selectedTypes.length > 0;
    return false;
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete({
        goal: selectedGoal,
        locations: selectedLocations,
        propertyTypes: selectedTypes,
      });
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
            onClick={() => onComplete({ goal: selectedGoal || 'rent', locations: selectedLocations, propertyTypes: selectedTypes })}
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
              <h2 className="text-slate-900 font-black text-3xl mb-2">Let's Curate Your Experience</h2>
              <p className="text-slate-400 font-medium mb-10">What is your primary goal?</p>

              <div className="space-y-4">
                {goals.map((goal) => {
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
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-slate-900 font-black text-3xl mb-2">Where are you looking?</h2>
              <p className="text-slate-400 font-medium mb-8">Select one or more cities</p>

              {/* Search Bar */}
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
                  const isSelected = selectedLocations.includes(city);
                  return (
                    <motion.button
                      key={city}
                      onClick={() => toggleLocation(city)}
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
              <h2 className="text-slate-900 font-black text-3xl mb-2">What type of home fits your vibe?</h2>
              <p className="text-slate-400 font-medium mb-10">Select all that interest you</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {propertyTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedTypes.includes(type.id);
                  return (
                    <motion.button
                      key={type.id}
                      onClick={() => toggleType(type.id)}
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
                        {type.label}
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
