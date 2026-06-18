import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Home, LayoutDashboard, Briefcase, User, Wallet,
  Bell, ShieldCheck, LogOut
} from 'lucide-react';
import HouziiLogo from '../../../imports/Group1410124151';
import { ProOverview } from './pro-overview';
import { JobsFeed } from './jobs-feed';
import { JobManagement } from './job-management';
import { JobLifecycle } from './job-lifecycle';
import { ProPortfolio } from './pro-portfolio';
import { ProWallet } from './pro-wallet';

interface ProDashboardProps {
  userName: string;
  onNavigate: (tab: string) => void;
  activeTab: string;
}

const navItems = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'jobs-feed', label: 'Jobs Feed', icon: LayoutDashboard },
  { id: 'active-jobs', label: 'My Jobs', icon: Briefcase },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'portfolio', label: 'Profile', icon: User },
];

export const ProDashboard: React.FC<ProDashboardProps> = ({
  userName,
  onNavigate,
  activeTab,
}) => {
  const navigate = useNavigate();
  const [showJobLifecycle, setShowJobLifecycle] = useState(false);

  // If Job Lifecycle sub-page is active, render it full-screen
  if (showJobLifecycle) {
    return (
      <JobLifecycle
        onBack={() => setShowJobLifecycle(false)}
        onGoToWallet={() => {
          setShowJobLifecycle(false);
          onNavigate('wallet');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* ── Side Navigation — Desktop ── */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 fixed top-0 left-0 bottom-0 z-50">
        {/* Logo */}
        <div className="px-6 pt-7 pb-6 border-b border-slate-100">
          <div className="h-7 w-auto relative" style={{ aspectRatio: '1378.66/461.842' }}>
            <HouziiLogo scrolled />
          </div>
        </div>

        {/* Professional badge */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-3 px-4 py-3 bg-primary/5 border border-primary/10 rounded-xl">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-xs">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-slate-800 text-xs font-black">{userName}</p>
              <p className="text-primary text-[10px] font-bold">Professional</p>
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
                <span className={`text-sm ${isActive ? 'font-black' : 'font-bold'}`}>
                  {item.label}
                </span>
                {item.id === 'jobs-feed' && !isActive && (
                  <span className="ml-auto flex items-center gap-1 px-1.5 py-0.5 bg-[#7B2D42]/10 border border-[#7B2D42]/20 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7B2D42] animate-pulse" />
                    <span className="text-[#7B2D42] text-[9px] font-black">2 ASAP</span>
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="activeProTab"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Trust Badge & Logout */}
        <div className="px-4 pb-6 space-y-3">
          <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-green-700 text-xs font-black">Tier 1 Verified</p>
              <p className="text-green-500 text-[10px] font-bold">Browse Access</p>
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

      {/* ── Main Content ── */}
      <div className="flex-1 lg:ml-64 pb-24 lg:pb-6">
        {/* Top Bar — Mobile */}
        <div className="bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between lg:hidden">
          <div className="h-6 w-auto relative" style={{ aspectRatio: '1378.66/461.842' }}>
            <HouziiLogo scrolled />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
              <span className="text-green-600 text-[10px] font-black">T1</span>
            </div>
            <button className="relative p-2 bg-slate-50 border border-slate-200 rounded-full text-slate-400">
              <Bell className="w-4 h-4" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-orange-400 rounded-full" />
            </button>
          </div>
        </div>

        {/* ── Content Panels ── */}
        {activeTab === 'overview' && (
          <ProOverview onNavigate={onNavigate} />
        )}
        {activeTab === 'jobs-feed' && (
          <JobsFeed onViewJob={() => setShowJobLifecycle(true)} />
        )}
        {activeTab === 'active-jobs' && (
          <JobManagement />
        )}
        {activeTab === 'portfolio' && <ProPortfolio />}
        {activeTab === 'wallet' && <ProWallet />}

        {/* ── Bottom Navigation — Mobile ── */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-2 py-2 z-50 lg:hidden">
          <div className="flex items-center justify-around max-w-lg mx-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex flex-col items-center gap-1 px-2 py-2 rounded-2xl transition-all ${
                    isActive ? 'text-primary' : 'text-slate-300 hover:text-slate-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[8px] font-bold leading-none">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeProMobileTab"
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