import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { AgentCreateAccount } from './components/agent-onboarding/agent-create-account';
import { AgentDiscovery } from './components/agent-onboarding/agent-discovery';
import { AgentWelcome } from './components/agent-onboarding/agent-welcome';
import { AgentDashboard } from './components/agent-dashboard/agent-dashboard';

type Screen = 'create-account' | 'discovery' | 'welcome' | 'dashboard';

export const AgentOnboarding = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState<Screen>('create-account');
  const [userName, setUserName] = useState('');
  const [activeTab, setActiveTab] = useState('command-center');

  const handleAccountCreated = (data: { fullName: string; email: string; phone: string; licenseNumber: string }) => {
    setUserName(data.fullName || 'Agent');
    setCurrentScreen('discovery');
  };

  const handleDiscoveryComplete = () => {
    setCurrentScreen('welcome');
  };

  const handleGoToDashboard = () => {
    setCurrentScreen('dashboard');
    setActiveTab('command-center');
  };

  const handleNavigation = (tab: string) => {
    setActiveTab(tab);
    setCurrentScreen('dashboard');
  };

  return (
    <div className="min-h-screen bg-white font-['Urbanist']">
      <AnimatePresence>
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {currentScreen === 'create-account' && (
            <AgentCreateAccount
              onContinue={handleAccountCreated}
              onLogin={() => navigate('/')}
            />
          )}
          {currentScreen === 'discovery' && (
            <AgentDiscovery
              onComplete={handleDiscoveryComplete}
              onBack={() => setCurrentScreen('create-account')}
            />
          )}
          {currentScreen === 'welcome' && (
            <AgentWelcome
              userName={userName.split(' ')[0]}
              onGoToDashboard={handleGoToDashboard}
            />
          )}
          {currentScreen === 'dashboard' && (
            <AgentDashboard
              userName={userName.split(' ')[0] || 'Agent'}
              onNavigate={handleNavigation}
              activeTab={activeTab}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};