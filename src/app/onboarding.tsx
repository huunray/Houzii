import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { CreateAccount } from './components/onboarding/create-account';
import { DiscoveryCurator } from './components/onboarding/discovery-curator';
import { WelcomeScreen } from './components/onboarding/welcome-screen';
import { SeekerDashboard } from './components/dashboard/seeker-dashboard';
import { ActivityEscrow } from './components/dashboard/activity-escrow';

type Screen = 'create-account' | 'discovery' | 'welcome' | 'dashboard' | 'activity';

export const Onboarding = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState<Screen>('create-account');
  const [userName, setUserName] = useState('');
  const [activeTab, setActiveTab] = useState('home');

  const handleAccountCreated = (data: { fullName: string; email: string; phone: string }) => {
    setUserName(data.fullName || 'User');
    setCurrentScreen('discovery');
  };

  const handleDiscoveryComplete = () => {
    setCurrentScreen('welcome');
  };

  const handleGoToDashboard = () => {
    setCurrentScreen('dashboard');
    setActiveTab('home');
  };

  const handleNavigation = (screen: string) => {
    setActiveTab(screen);
    setCurrentScreen('dashboard');
  };

  return (
    <div className="min-h-screen bg-white font-['Urbanist']">
      <AnimatePresence mode="wait">
        {currentScreen === 'create-account' && (
          <motion.div
            key="create-account"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CreateAccount
              onContinue={handleAccountCreated}
              onLogin={() => navigate('/')}
            />
          </motion.div>
        )}

        {currentScreen === 'discovery' && (
          <motion.div
            key="discovery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DiscoveryCurator
              onComplete={handleDiscoveryComplete}
              onBack={() => setCurrentScreen('create-account')}
            />
          </motion.div>
        )}

        {currentScreen === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <WelcomeScreen
              userName={userName.split(' ')[0]}
              onGoToDashboard={handleGoToDashboard}
              onSwitchRole={() => navigate('/owners')}
            />
          </motion.div>
        )}

        {currentScreen === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SeekerDashboard
              userName={userName.split(' ')[0] || 'User'}
              onNavigate={handleNavigation}
              activeTab={activeTab}
            />
          </motion.div>
        )}

        {currentScreen === 'activity' && (
          <motion.div
            key="activity"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ActivityEscrow
              onNavigate={handleNavigation}
              activeTab={activeTab}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};