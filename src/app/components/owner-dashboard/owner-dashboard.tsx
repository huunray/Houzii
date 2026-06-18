import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Home, Users, Wallet, User,
  Bell, ShieldCheck, LogOut, Wrench
} from 'lucide-react';
import HouziiLogo from '../../../imports/Group1410124151';
import { PortfolioDashboard } from './portfolio-dashboard';
import { TenantOffers } from './tenant-offers';
import { MaintenanceTracker } from './maintenance-tracker';
import { OwnerWallet } from './owner-wallet';
import { OwnerProfile } from './owner-profile';

interface OwnerDashboardProps {
  userName: string;
  onNavigate: (tab: string) => void;
  activeTab: string;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'assets', label: 'My Assets', icon: Home },
  { id: 'tenants', label: 'Tenants/Offers', icon: Users },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'profile', label: 'Profile', icon: User },
];

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ userName, onNavigate, activeTab }) => {
  const navigate = useNavigate();

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

        {/* Owner badge */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-3 px-4 py-3 bg-primary/5 border border-primary/10 rounded-xl">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-xs">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-slate-800 text-xs font-black">{userName}</p>
              <p className="text-primary text-[10px] font-bold">Property Owner</p>
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
                    layoutId="activeOwnerTab"
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
              <p className="text-green-700 text-xs font-black">Tier 1 Active</p>
              <p className="text-green-500 text-[10px] font-bold">Basic Verified</p>
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
      <div className="flex-1 lg:ml-64 pb-24 lg:pb-6">
        {/* Top Bar - Mobile */}
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
              <div className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
          </div>
        </div>

        {/* Content Panels */}
        {(activeTab === 'dashboard' || activeTab === 'assets') && <PortfolioDashboard />}
        {activeTab === 'tenants' && <TenantOffers />}
        {activeTab === 'maintenance' && <MaintenanceTracker />}
        {activeTab === 'wallet' && <OwnerWallet />}
        {activeTab === 'profile' && <OwnerProfile />}

        {/* Bottom Navigation - Mobile */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-2 py-2 z-50 lg:hidden">
          <div className="flex items-center justify-around max-w-lg mx-auto">
            {navItems.filter(n => n.id !== 'maintenance').map((item) => {
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
                      layoutId="activeOwnerMobileTab"
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