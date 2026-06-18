import React, { useState } from 'react';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FileText, Users, Wallet, User,
  Bell, ShieldCheck, LogOut, MessageCircle, Activity
} from 'lucide-react';
import HouziiLogo from '../../../imports/Group1410124151';
import { CommandCenter } from './command-center';
import { AgentListings, type ListingDeal } from './agent-listings';
import { AgentLeads } from './agent-leads';
import { AgentWallet, type WalletCredit } from './agent-wallet';
import { AgentProfile } from './agent-profile';
import { AgentMessages } from './agent-messages';
import { AgentActivity } from './agent-activity/agent-activity';
import { TrustProvider, useTrust } from './trust-context';
import { Toaster } from 'sonner';
import type { SubmittedListing } from './listing-engine';
import type { TransactionStage } from './transaction/deal-progress-tracker';

interface AgentDashboardProps {
  userName: string;
  onNavigate: (tab: string) => void;
  activeTab: string;
}

const navItems = [
  { id: 'command-center', label: 'Command Center', icon: LayoutDashboard },
  { id: 'listings', label: 'My Listings', icon: FileText },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'leads', label: 'Leads / CRM', icon: Users },
  { id: 'messages', label: 'Messages', icon: MessageCircle },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'profile', label: 'Profile', icon: User },
];

export const AgentDashboard: React.FC<AgentDashboardProps> = ({ userName, onNavigate, activeTab }) => {
  return (
    <TrustProvider>
      <AgentDashboardInner userName={userName} onNavigate={onNavigate} activeTab={activeTab} />
      <Toaster position="top-center" richColors />
    </TrustProvider>
  );
};

const AgentDashboardInner: React.FC<AgentDashboardProps> = ({ userName, onNavigate, activeTab }) => {
  const navigate = useNavigate();
  const { trust } = useTrust();
  const [submittedListings, setSubmittedListings] = useState<SubmittedListing[]>([]);
  const [deals, setDeals] = useState<ListingDeal[]>([]);
  const [walletCredits, setWalletCredits] = useState<WalletCredit[]>([]);

  const handleListingSubmit = (listing: SubmittedListing) => {
    setSubmittedListings(prev => [listing, ...prev]);
  };

  const handleDealCreated = (deal: ListingDeal) => {
    setDeals(prev => [deal, ...prev]);
  };

  const handleDealStageUpdate = (listingId: number | string, stage: TransactionStage) => {
    setDeals(prev => prev.map(d =>
      d.listingId === listingId ? { ...d, stage } : d
    ));

    // If payout, add wallet credit
    if (stage === 'payout') {
      const deal = deals.find(d => d.listingId === listingId);
      if (deal) {
        setWalletCredits(prev => [{
          id: Date.now(),
          label: `Commission`,
          amount: '₦450,000',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          property: deal.applicant.name,
        }, ...prev]);
      }
    }
  };

  const tierBadgeConfig = trust.tier === 3
    ? { bg: 'bg-green-50', border: 'border-green-200', iconColor: 'text-green-500', textColor: 'text-green-700', subColor: 'text-green-500', label: `Tier 3 Verified`, sub: 'Full Access' }
    : trust.tier === 2
    ? { bg: 'bg-blue-50', border: 'border-blue-200', iconColor: 'text-blue-500', textColor: 'text-blue-700', subColor: 'text-blue-500', label: `Tier 2 Pro`, sub: 'Can List Properties' }
    : { bg: 'bg-amber-50', border: 'border-amber-200', iconColor: 'text-amber-500', textColor: 'text-amber-700', subColor: 'text-amber-500', label: `Tier 1 Basic`, sub: 'Verification Needed' };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Side Navigation - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 fixed top-0 left-0 bottom-0 z-50">
        {/* Logo */}
        <div className="px-6 pt-7 pb-6 border-b border-slate-100">
          <div className="h-7 w-auto relative" style={{ aspectRatio: '1378.66/461.842' }}>
            <HouziiLogo scrolled />
          </div>
        </div>

        {/* Agent badge */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-3 px-4 py-3 bg-primary/5 border border-primary/10 rounded-xl">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-primary-foreground font-bold text-xs">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-slate-800 text-xs font-black">{userName}</p>
              <p className="text-primary text-[10px] font-bold">Independent Agent</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className={`text-sm ${isActive ? 'font-black' : 'font-bold'}`}>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeAgentTab"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Trust Badge & Logout */}
        <div className="px-4 pb-6 space-y-3">
          <div className={`flex items-center gap-3 px-4 py-3 ${tierBadgeConfig.bg} border ${tierBadgeConfig.border} rounded-xl`}>
            <ShieldCheck className={`w-5 h-5 ${tierBadgeConfig.iconColor}`} />
            <div>
              <p className={`${tierBadgeConfig.textColor} text-xs font-black`}>{tierBadgeConfig.label}</p>
              <p className={`${tierBadgeConfig.subColor} text-[10px] font-bold`}>{tierBadgeConfig.sub}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:text-red-600 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-bold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 lg:ml-64 ${activeTab === 'messages' ? 'pb-0 lg:pb-0' : 'pb-24 lg:pb-6'}`}>
        {/* Top Bar */}
        <div className="bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between lg:hidden">
          <div className="h-6 w-auto relative" style={{ aspectRatio: '1378.66/461.842' }}>
            <HouziiLogo scrolled />
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 ${tierBadgeConfig.bg} border ${tierBadgeConfig.border} rounded-full`}>
              <ShieldCheck className={`w-3.5 h-3.5 ${tierBadgeConfig.iconColor}`} />
              <span className={`${tierBadgeConfig.textColor} text-[10px] font-black`}>T{trust.tier}</span>
            </div>
            <button className="relative p-2 bg-slate-50 border border-slate-200 rounded-full text-slate-400">
              <Bell className="w-4 h-4" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
          </div>
        </div>

        {/* Content Panels */}
        {activeTab === 'command-center' && <CommandCenter userName={userName} onListingSubmit={handleListingSubmit} onNavigate={onNavigate} />}
        {activeTab === 'listings' && (
          <AgentListings
            submittedListings={submittedListings}
            onListingSubmit={handleListingSubmit}
            deals={deals}
            onDealCreated={handleDealCreated}
            onDealStageUpdate={handleDealStageUpdate}
          />
        )}
        {activeTab === 'activity' && <AgentActivity deals={deals} onDealStageUpdate={handleDealStageUpdate} />}
        {activeTab === 'leads' && <AgentLeads />}
        {activeTab === 'messages' && <AgentMessages />}
        {activeTab === 'wallet' && <AgentWallet dealCredits={walletCredits} />}
        {activeTab === 'profile' && <AgentProfile />}

        {/* Bottom Navigation - Mobile */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-2 py-2 z-50 lg:hidden">
          <div className="flex items-center justify-around max-w-lg mx-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all ${
                    isActive ? 'text-primary' : 'text-slate-300 hover:text-slate-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[9px] font-bold">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeAgentMobileTab"
                      className="w-1 h-1 rounded-full bg-primary"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
