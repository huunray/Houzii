import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ProCreateAccount } from './components/professional-onboarding/pro-create-account';
import { ProDiscovery } from './components/professional-onboarding/pro-discovery';
import { ProWelcome } from './components/professional-onboarding/pro-welcome';
import { ProDashboard } from './components/professional-dashboard/pro-dashboard';

type Screen = 'create-account' | 'discovery' | 'welcome' | 'dashboard';

export const ProfessionalOnboarding = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState<Screen>('create-account');
  const [userName, setUserName] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const handleAccountCreated = (data: { fullName: string; email: string; phone: string }) => {
    setUserName(data.fullName || 'Professional');
    setCurrentScreen('discovery');
  };

  const handleDiscoveryComplete = () => {
    setCurrentScreen('welcome');
  };

  const handleGoToDashboard = () => {
    setCurrentScreen('dashboard');
    setActiveTab('overview');
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
            key="pro-create-account"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProCreateAccount
              onContinue={handleAccountCreated}
              onLogin={() => navigate('/')}
            />
          </motion.div>
        );
      case 'discovery':
        return (
          <motion.div
            key="pro-discovery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProDiscovery
              onComplete={handleDiscoveryComplete}
              onBack={() => setCurrentScreen('create-account')}
            />
          </motion.div>
        );
      case 'welcome':
        return (
          <motion.div
            key="pro-welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProWelcome
              userName={userName.split(' ')[0]}
              onGoToDashboard={handleGoToDashboard}
            />
          </motion.div>
        );
      case 'dashboard':
        return (
          <motion.div
            key="pro-dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProDashboard
              userName={userName.split(' ')[0] || 'Professional'}
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