import { motion } from 'motion/react';
import {
  TrendingUp, MessageCircle, Phone, ChevronRight,
  Wallet, ShieldCheck, ArrowUpRight, ArrowDownRight, Clock, Star,
  User, Bell, Plus, Eye, CalendarCheck, Megaphone, Activity, CircleCheck, Shield
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { ListingEngine } from './listing-engine';
import { TrustTracker, Tier2VerificationModal } from './trust-verification';
import { useTrust } from './trust-context';
import { AdminBlueprintModal } from './admin-blueprint-modal';

const analyticsData = [
  { day: 'Mar 1', views: 120, inquiries: 18 },
  { day: 'Mar 5', views: 180, inquiries: 32 },
  { day: 'Mar 9', views: 240, inquiries: 28 },
  { day: 'Mar 13', views: 200, inquiries: 45 },
  { day: 'Mar 17', views: 310, inquiries: 52 },
  { day: 'Mar 21', views: 280, inquiries: 48 },
  { day: 'Mar 25', views: 350, inquiries: 65 },
  { day: 'Mar 30', views: 420, inquiries: 78 },
];

const leads = [
  { id: 1, name: 'Chinedu Okafor', avatar: 'CO', property: '3-Bed Apartment, Lekki Phase 1', time: '2 hours ago', status: 'hot' },
  { id: 2, name: 'Amina Ibrahim', avatar: 'AI', property: 'Land (500sqm), Banana Island', time: '4 hours ago', status: 'warm' },
  { id: 3, name: 'David Adeyemi', avatar: 'DA', property: 'Penthouse Suite, Victoria Island', time: '6 hours ago', status: 'hot' },
  { id: 4, name: 'Blessing Eze', avatar: 'BE', property: '4-Bed Duplex, Ikoyi', time: '1 day ago', status: 'warm' },
];

const recentActivities = [
  { id: 1, text: 'New inquiry on 3-Bed Lekki Phase 1', time: '15 min ago', icon: MessageCircle, color: 'text-blue-500 bg-blue-50' },
  { id: 2, text: 'Listing approved: Duplex, Ikoyi', time: '1 hour ago', icon: CircleCheck, color: 'text-green-500 bg-green-50' },
  { id: 3, text: 'Commission credited: ₦450,000', time: '3 hours ago', icon: Wallet, color: 'text-emerald-500 bg-emerald-50' },
  { id: 4, text: 'Viewing scheduled with Amina I.', time: '5 hours ago', icon: CalendarCheck, color: 'text-purple-500 bg-purple-50' },
  { id: 5, text: 'Lead upgraded to Hot: David A.', time: '6 hours ago', icon: TrendingUp, color: 'text-red-500 bg-red-50' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100 text-xs">
        <p className="text-slate-500 font-bold mb-1">{label}</p>
        <p className="text-primary font-bold">Views: {payload[0]?.value}</p>
        <p className="text-blue-500 font-bold">Inquiries: {payload[1]?.value}</p>
      </div>
    );
  }
  return null;
};

export const CommandCenter: React.FC<{ userName?: string }> = ({ userName }) => {
  const [showListingEngine, setShowListingEngine] = useState(false);
  const [showTier2Modal, setShowTier2Modal] = useState(false);
  const [simulateEmpty, setSimulateEmpty] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const { trust, verifyIdentity } = useTrust();

  const handleAddListing = () => {
    if (trust.tier < 2) {
      setShowTier2Modal(true);
    } else {
      setShowListingEngine(true);
    }
  };

  const tierBadge = trust.tier === 3
    ? { bg: 'bg-green-50', border: 'border-green-200', color: 'text-green-500', textColor: 'text-green-600', label: 'T3' }
    : trust.tier === 2
    ? { bg: 'bg-blue-50', border: 'border-blue-200', color: 'text-blue-500', textColor: 'text-blue-600', label: 'T2' }
    : { bg: 'bg-amber-50', border: 'border-amber-200', color: 'text-amber-500', textColor: 'text-amber-600', label: 'T1' };

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 shadow-sm">
              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                <User className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold">Good evening</p>
              <p className="text-slate-900 font-black text-lg">{userName || 'Agent'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAdminModal(true)}
              className="px-3 py-1.5 text-xs font-bold rounded-full border bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Shield className="w-3.5 h-3.5 text-primary" />
              Admin Spec
            </button>
            <button
              id="simulate-empty-btn"
              onClick={() => setSimulateEmpty(prev => !prev)}
              className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-all flex items-center gap-1.5 ${
                simulateEmpty
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              {simulateEmpty ? 'Real' : 'Empty'}
            </button>
            <div className={`hidden items-center gap-2 px-3 py-1.5 ${tierBadge.bg} border ${tierBadge.border} rounded-full`}>
              <ShieldCheck className={`w-4 h-4 ${tierBadge.color}`} />
              <span className={`${tierBadge.textColor} text-xs font-black`}>{tierBadge.label}</span>
            </div>
            <button className="relative p-2.5 bg-slate-50 border border-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </button>
          </div>
        </div>
      </div>

      {/* Trust Tracker */}
      <TrustTracker />

      {/* Stat Cards */}
      <div className="px-6 pt-6 grid grid-cols-3 gap-3">
        {[
          { label: 'Active Listings', value: simulateEmpty ? '0' : '12', trend: simulateEmpty ? null : '+3', positive: true },
          { label: 'Total Leads', value: simulateEmpty ? '0' : '48', trend: simulateEmpty ? null : '+15', positive: true },
          { label: 'Conversion Rate', value: simulateEmpty ? '0%' : '18%', trend: simulateEmpty ? null : '+2%', positive: true },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            className="bg-white border border-slate-200 rounded-xl p-4"
          >
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-slate-900 font-black text-xl">{stat.value}</p>
            {stat.trend && (
              <div className="flex items-center gap-1 mt-1">
                {stat.positive ? (
                  <ArrowUpRight className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
                )}
                <span className={`text-xs font-bold ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>{stat.trend}</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="px-6 pt-8 pb-2">
        <h3 className="text-slate-900 font-black text-lg mb-4">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Add Listing', icon: Plus, color: 'bg-primary/10 text-primary' },
            { label: 'View Wallet', icon: Wallet, color: 'bg-emerald-50 text-emerald-600' },
            { label: 'Schedule View', icon: CalendarCheck, color: 'bg-blue-50 text-blue-600' },
            { label: 'Generate Marketing', icon: Megaphone, color: 'bg-amber-50 text-amber-600' },
          ].map((action, i) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              onClick={action.label === 'Add Listing' ? handleAddListing : undefined}
              className="flex flex-col items-center gap-2 p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-slate-300 transition-all"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${action.color}`}>
                <action.icon className="w-5 h-5" />
              </div>
              <span className="text-slate-600 text-[11px] font-bold text-center leading-tight">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Follow-ups & Recent Activities */}
      <div className="px-6 mt-10 grid grid-cols-2 gap-5">
        {/* Today's Follow-ups - Left */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-slate-900 font-black text-lg">Today's Follow-ups</h3>
            {!simulateEmpty && (
              <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="space-y-3">
            {simulateEmpty ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center flex flex-col items-center justify-center min-h-[340px]"
              >
                <div className="w-12 h-12 rounded-full bg-[#591C2B]/10 flex items-center justify-center text-primary mb-4 animate-pulse">
                  <User className="w-6 h-6" />
                </div>
                <h4 className="text-slate-800 font-bold text-base mb-1">Your Inbox is Calm</h4>
                <p className="text-slate-500 text-xs text-center max-w-[220px] mb-5">
                  No pending follow-ups today. Post a hard listing to find active interest.
                </p>
                <button
                  onClick={handleAddListing}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#591C2B] hover:bg-[#3D111D] rounded-full transition-colors flex items-center gap-1.5 shadow-sm hover:shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  Post Listing
                </button>
              </motion.div>
            ) : (
              leads.map((lead, i) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 ${
                      lead.status === 'hot' ? 'bg-gradient-to-br from-red-400 to-primary' : 'bg-gradient-to-br from-blue-400 to-blue-600'
                    }`}>
                      {lead.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-slate-800 font-bold text-sm truncate">{lead.name}</h4>
                        {lead.status === 'hot' && (
                          <span className="px-2 py-0.5 bg-red-50 text-red-500 text-[10px] font-black rounded-full uppercase">Hot</span>
                        )}
                      </div>
                      <p className="text-slate-400 text-xs font-medium truncate flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400" />
                        {lead.property}
                      </p>
                      <p className="text-slate-300 text-[10px] font-medium mt-0.5">{lead.time}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600 hover:bg-green-100 transition-colors" title="WhatsApp">
                        <MessageCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activities - Right */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-slate-900 font-black text-lg">Recent Activities</h3>
            {!simulateEmpty && (
              <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="space-y-3">
            {simulateEmpty ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center flex flex-col items-center justify-center min-h-[340px]"
              >
                <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-4 animate-pulse">
                  <Activity className="w-6 h-6 text-slate-400" />
                </div>
                <h4 className="text-slate-800 font-bold text-base mb-1">No Recent Activity</h4>
                <p className="text-slate-500 text-xs text-center max-w-[220px]">
                  No recent activity logged. Seeker engagement will be shown here.
                </p>
              </motion.div>
            ) : (
              recentActivities.map((activity, i) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${activity.color}`}>
                      <activity.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-800 font-bold text-sm truncate">{activity.text}</p>
                      <p className="text-slate-300 text-[10px] font-medium mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Performance Analytics */}
      <div className="px-6 mb-8 mt-10">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-slate-900 font-black text-lg">Performance Analytics</h3>
          <span className="text-slate-400 text-xs font-bold">Last 30 days</span>
        </div>

        {simulateEmpty ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[220px]"
          >
            <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-4 animate-pulse">
              <TrendingUp className="w-6 h-6 text-[#591C2B]" />
            </div>
            <h4 className="text-slate-800 font-bold text-base mb-1">Compiling Insights</h4>
            <p className="text-slate-500 text-xs text-center max-w-sm">
              No view or inquiry trends yet. Insights will appear once seekers view your properties.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-slate-200 rounded-2xl p-5"
          >
            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-slate-500 text-xs font-bold">Views</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-slate-500 text-xs font-bold">Inquiries</span>
              </div>
            </div>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData}>
                  <XAxis key="xaxis" dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis key="yaxis" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip key="tooltip" content={<CustomTooltip />} />
                  <Line key="line-views" type="monotone" dataKey="views" stroke="#7B2D42" strokeWidth={2.5} dot={false} />
                  <Line key="line-inquiries" type="monotone" dataKey="inquiries" stroke="#3B82F6" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-slate-600 text-xs font-bold">Market Demand: Lekki, Lagos</span>
              </div>
              <div className="flex items-center gap-1 text-green-500">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span className="text-xs font-black">+12.4%</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Listing Engine */}
      {showListingEngine && (
        <ListingEngine isOpen={showListingEngine} onClose={() => setShowListingEngine(false)} userName={userName} />
      )}

      {/* Tier 2 Verification Modal */}
      <Tier2VerificationModal
        isOpen={showTier2Modal}
        onClose={() => setShowTier2Modal(false)}
        onStartVerification={() => {
          setShowTier2Modal(false);
          verifyIdentity();
        }}
      />

      {/* Admin Blueprint Modal */}
      <AdminBlueprintModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
      />
    </div>
  );
};