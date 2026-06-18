import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { OwnerCreateAccount } from './components/owner-onboarding/owner-create-account';
import { OwnerDiscovery } from './components/owner-onboarding/owner-discovery';
import { OwnerWelcome } from './components/owner-onboarding/owner-welcome';
import { OwnerDashboard } from './components/owner-dashboard/owner-dashboard';

type Screen = 'create-account' | 'discovery' | 'welcome' | 'dashboard';

export const OwnerOnboarding = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState<Screen>('create-account');
  const [userName, setUserName] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleAccountCreated = (data: { fullName: string; email: string; phone: string }) => {
    setUserName(data.fullName || 'Owner');
    setCurrentScreen('discovery');
  };

  const handleDiscoveryComplete = () => {
    setCurrentScreen('welcome');
  };

  const handleGoToDashboard = () => {
    setCurrentScreen('dashboard');
    setActiveTab('dashboard');
  };

  const handleNavigation = (tab: string) => {
    setActiveTab(tab);
    setCurrentScreen('dashboard');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'create-account':
        return (
          <motion.div
            key="owner-create-account"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <OwnerCreateAccount
              onContinue={handleAccountCreated}
              onLogin={() => navigate('/')}
            />
          </motion.div>
        );
      case 'discovery':
        return (
          <motion.div
            key="owner-discovery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <OwnerDiscovery
              onComplete={handleDiscoveryComplete}
              onBack={() => setCurrentScreen('create-account')}
            />
          </motion.div>
        );
      case 'welcome':
        return (
          <motion.div
            key="owner-welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <OwnerWelcome
              userName={userName.split(' ')[0]}
              onGoToDashboard={handleGoToDashboard}
            />
          </motion.div>
        );
      case 'dashboard':
        return (
          <motion.div
            key="owner-dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <OwnerDashboard
              userName={userName.split(' ')[0] || 'Owner'}
              onNavigate={handleNavigation}
              activeTab={activeTab}
            />
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white font-['Urbanist']">
      <AnimatePresence mode="wait">
        {renderScreen()}
      </AnimatePresence>
    </div>
  );
};