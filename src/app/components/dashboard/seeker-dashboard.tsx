import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Home, Search, Activity, Wallet, User, Bell,
  ShieldCheck, MapPin, Bed, Bath, Heart, Star,
  Scale, FileSearch, Ruler, ChevronRight, MessageCircle,
  ArrowRight, Maximize, Shield, LogOut, Share2, Sparkles, Users, HelpCircle,
  ClipboardList, X, Plus, Minus, ChevronDown, Zap, Lock, Info,
  Droplets, Wifi, Car, Dumbbell, Trees, ShieldAlert, Flame, Wind, Dog,
  Building2, FileSignature, CreditCard, CalendarCheck, KeyRound, CheckCircle2
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import HouziiLogo from '../../../imports/Group1410124151';
import { ExplorePanel } from './explore-panel';
import { ProfessionalsPanel } from './professionals-panel';
import { ActivityPanel } from './activity-panel';
import { FavouritesPanel } from './favourites-panel';
import { PropertyDetailPanel } from './property-detail-panel';
import { NotificationPanel, type Notification } from './notification-panel';
import { MyPropertiesPanel } from './my-properties-panel';
import { LeaseExecutionSuite } from './lease-execution-suite';
import { PaymentGate48h } from './payment-gate-48h';
import { HandoverVerification } from './handover-verification';
import { EscrowFlow } from '../escrow/escrow-flow';
import { ScheduleWalkthrough } from '../escrow/schedule-walkthrough';
import { MoveInChecklist } from '../escrow/move-in-checklist';
import { HandoverDecisionModal } from './handover-decision-modal';
import { GetSettledModal } from './services/get-settled-modal';
import { ServiceRequestWizard } from './services/service-request-wizard';
import { MyServicesPanel } from './services/my-services-panel';
import {
  MOCK_SERVICE_REQUESTS,
  type ServiceRequest,
  type ServiceCategoryId,
  type ServiceFormData,
} from './services/service-types';
import { Wrench } from 'lucide-react';
import { toast } from 'sonner';
interface SeekerDashboardProps {
  userName: string;
  onNavigate: (screen: string) => void;
  activeTab: string;
}

const handpickedProperties = [
  {
    id: 1,
    title: '3 Bedroom Luxury Apartment',
    location: 'Lekki Phase 1, Lagos',
    price: '₦4.5M/yr',
    image: 'https://images.unsplash.com/photo-1633119712778-30d94755de54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBMYWdvcyUyMGludGVyaW9yJTIwZGVzaWdufGVufDF8fHx8MTc3MzYyNjcyMnww&ixlib=rb-4.1.0&q=80&w=1080',
    beds: 3,
    baths: 3,
    type: 'Apartment',
    verified: true,
    tag: 'Verified',
  },
  {
    id: 2,
    title: 'Modern 4-Bed Duplex',
    location: 'Banana Island, Lagos',
    price: '₦285M',
    image: 'https://images.unsplash.com/photo-1622015663084-307d19eabbbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yJTIwZ2FyZGVuJTIwdHJvcGljYWx8ZW58MXx8fHwxNzczNjI2NzIzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    beds: 4,
    baths: 5,
    type: 'Duplex',
    verified: true,
    tag: 'Hot Deal',
  },
  {
    id: 3,
    title: 'Penthouse Suite',
    location: 'Victoria Island, Lagos',
    price: '₦120K/night',
    image: 'https://images.unsplash.com/photo-1770254386076-1997b2e90365?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwZW50aG91c2UlMjB0ZXJyYWNlJTIwY2l0eSUyMHZpZXd8ZW58MXx8fHwxNzczNjI2NjA5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    beds: 2,
    baths: 2,
    type: 'Penthouse',
    verified: true,
    tag: 'Exclusive',
  },
];

const quickServices = [
  { id: 'property-order', label: 'Property Order', icon: ClipboardList, color: 'from-rose-50 to-rose-100', iconColor: 'text-rose-500' },
  { id: 'land-title', label: 'Verify a Land Title', icon: FileSearch, color: 'from-emerald-50 to-emerald-100', iconColor: 'text-emerald-500' },
  { id: 'surveyor', label: 'Hire a Surveyor', icon: Ruler, color: 'from-purple-50 to-purple-100', iconColor: 'text-purple-500' },
];

export const SeekerDashboard: React.FC<SeekerDashboardProps> = ({ userName, onNavigate, activeTab }) => {
  const navigate = useNavigate();
  const [likedProperties, setLikedProperties] = useState<number[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const mockNotifications: Notification[] = [
    {
      id: 1,
      type: 'inspection_confirmed',
      title: 'Inspection Confirmed! 🎉',
      body: 'Great news! Agent Chinedu Okafor has accepted your inspection request for 3 Bedroom Luxury Apartment. See you on Mar 18 at 10:00 AM!',
      time: '5 min ago',
      read: false,
      property: '3 Bedroom Luxury Apartment',
      date: 'Mar 18, 2026',
      timeSlot: '10:00 AM',
      agentName: 'Chinedu Okafor',
    },
    {
      id: 2,
      type: 'inspection_request',
      title: 'Viewing Request Sent',
      body: 'Your viewing request for Modern 4-Bed Duplex has been sent to Agent Fatima Hassan. You\'ll be notified once confirmed.',
      time: '2 hours ago',
      read: true,
      property: 'Modern 4-Bed Duplex',
      agentName: 'Fatima Hassan',
    },
    {
      id: 3,
      type: 'general',
      title: 'Escrow Funded',
      body: 'You secured ₦11.6M in Houzii Escrow for 3 Bedroom Luxury Apartment.',
      time: '1 day ago',
      read: true,
    },
  ];

  // Property Order Wizard State
  const [showPropertyOrder, setShowPropertyOrder] = useState(false);
  const [orderStep, setOrderStep] = useState(1);
  const [orderSuccess, setOrderSuccess] = useState(false);
  // Step 1: Specs
  const [orderIntent, setOrderIntent] = useState<'rent' | 'buy'>('rent');
  const [orderPropertyType, setOrderPropertyType] = useState('Apartment');
  const [orderPropertyTypeOpen, setOrderPropertyTypeOpen] = useState(false);
  const [orderBedrooms, setOrderBedrooms] = useState(2);
  const [orderBathrooms, setOrderBathrooms] = useState(2);
  const [orderAmenities, setOrderAmenities] = useState<string[]>(['24/7 Power']);
  // Step 2: Location & Budget
  const [orderLocation, setOrderLocation] = useState('');
  const [orderBudget, setOrderBudget] = useState('');
  // Step 3: Commitment
  const [orderLockAmount, setOrderLockAmount] = useState('');
  const MOCK_WALLET_BALANCE = 150000; // ₦150K mock balance

  const PROPERTY_TYPES = ['Apartment', 'Duplex', 'Bungalow', 'Penthouse', 'Studio', 'Terrace', 'Commercial', 'Land'];
  const AMENITIES = [
    { id: '24/7 Power', icon: Zap, label: '24/7 Power' },
    { id: 'Pool', icon: Droplets, label: 'Pool' },
    { id: 'Security', icon: ShieldAlert, label: 'Security' },
    { id: 'Gym', icon: Dumbbell, label: 'Gym' },
    { id: 'Parking', icon: Car, label: 'Parking' },
    { id: 'Garden', icon: Trees, label: 'Garden' },
    { id: 'Internet', icon: Wifi, label: 'Internet' },
    { id: 'Gas', icon: Flame, label: 'Gas' },
    { id: 'AC', icon: Wind, label: 'AC' },
    { id: 'Pet Friendly', icon: Dog, label: 'Pet Friendly' },
  ];

  const PRICE_GUIDES: Record<string, Record<string, string>> = {
    'Lekki': { 'Apartment': '₦2.5M - ₦6M/yr', 'Duplex': '₦80M - ₦250M', 'Penthouse': '₦8M - ₦15M/yr' },
    'Victoria Island': { 'Apartment': '₦3M - ₦8M/yr', 'Duplex': '₦120M - ₦350M', 'Penthouse': '₦10M - ₦20M/yr' },
    'Ikoyi': { 'Apartment': '₦4M - ₦12M/yr', 'Duplex': '₦150M - ₦500M', 'Penthouse': '₦15M - ₦30M/yr' },
    'Surulere': { 'Apartment': '₦1M - ₦3M/yr', 'Duplex': '₦40M - ₦100M' },
    'Ajah': { 'Apartment': '₦800K - ₦2.5M/yr', 'Duplex': '₦30M - ₦80M' },
  };

  const getPriceGuide = () => {
    const loc = Object.keys(PRICE_GUIDES).find(k => orderLocation.toLowerCase().includes(k.toLowerCase()));
    if (!loc) return null;
    return PRICE_GUIDES[loc][orderPropertyType] || PRICE_GUIDES[loc]['Apartment'] || null;
  };

  const parseLockAmount = (): number => {
    const cleaned = orderLockAmount.replace(/[^0-9.]/g, '');
    const num = parseFloat(cleaned);
    if (isNaN(num)) return 0;
    if (orderLockAmount.toLowerCase().includes('m')) return num * 1_000_000;
    if (orderLockAmount.toLowerCase().includes('k')) return num * 1_000;
    return num;
  };

  const needsTopUp = parseLockAmount() > MOCK_WALLET_BALANCE;

  const resetPropertyOrder = () => {
    setOrderStep(1);
    setOrderSuccess(false);
    setOrderIntent('rent');
    setOrderPropertyType('Apartment');
    setOrderBedrooms(2);
    setOrderBathrooms(2);
    setOrderAmenities(['24/7 Power']);
    setOrderLocation('');
    setOrderBudget('');
    setOrderLockAmount('');
  };

  const handlePlaceOrder = () => {
    setOrderSuccess(true);
    setTimeout(() => {
      setShowPropertyOrder(false);
      resetPropertyOrder();
    }, 2500);
  };

  const toggleLike = (id: number) => {
    setLikedProperties(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // Rental Transaction Suite modals
  const [showLeaseExecution, setShowLeaseExecution] = useState(false);
  const [showSignLease, setShowSignLease] = useState(false);
  const [showPaymentGate, setShowPaymentGate] = useState(false);
  const [showHandoverVerification, setShowHandoverVerification] = useState(false);
  const [showEscrowPayment, setShowEscrowPayment] = useState(false);
  const [signedApplicationIds, setSignedApplicationIds] = useState<number[]>([]);
  const [viewingSignedLease, setViewingSignedLease] = useState(false);
  
  // Handover flow state
  const [showScheduleWalkthrough, setShowScheduleWalkthrough] = useState(false);
  const [showHandoverDecision, setShowHandoverDecision] = useState(false);
  const [showMoveInChecklist, setShowMoveInChecklist] = useState(false);
  const [applicationStatuses, setApplicationStatuses] = useState<Record<number, 'reviewing' | 'lease_ready' | 'lease_declined' | 'awaiting_payment' | 'payment_complete' | 'lease_signed' | 'awaiting_handover' | 'handover_ready' | 'verifying' | 'deal_closed' | 'move_in_scheduled'>>({});


  // ─── My Services state ───
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(MOCK_SERVICE_REQUESTS);
  const [showGetSettled, setShowGetSettled] = useState(false);
  const [getSettledPropertyTitle, setGetSettledPropertyTitle] = useState('2 Bed Serviced Apartment, Victoria Island');
  const [wizardSelection, setWizardSelection] = useState<ServiceCategoryId[] | null>(null);

  const handleSubmitServiceRequests = (
    submissions: { category: ServiceCategoryId; form: ServiceFormData }[],
  ) => {
    const created: ServiceRequest[] = submissions.map((s, i) => ({
      id: Date.now() + i,
      category: s.category,
      propertyTitle: getSettledPropertyTitle,
      createdAt: 'Just now',
      status: 'awaiting_bids',
      bids: [],
      form: s.form,
    }));
    setServiceRequests((prev) => [...created, ...prev]);
    setWizardSelection(null);
    toast.success(
      created.length > 1 ? `${created.length} service requests posted!` : 'Request posted!',
      { description: "Verified pros are sending bids — we'll notify you." },
    );
    onNavigate('my-services');
  };

  const handleAcceptBid = (requestId: number, bidId: number) => {
    setServiceRequests((prev) =>
      prev.map((r) => {
        if (r.id !== requestId) return r;
        const bid = r.bids.find((b) => b.id === bidId);
        const requiresInspection = ['painter', 'security', 'electrician', 'plumber'].includes(r.category);
        return {
          ...r,
          acceptedBidId: bidId,
          escrowAmount: bid?.amount,
          status: requiresInspection ? 'awaiting_inspection' : 'in_escrow',
        };
      }),
    );
    toast.success('Bid accepted', { description: 'Funds locked in escrow.' });
  };

  const handleApproveWork = (requestId: number) => {
    setServiceRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'completed' } : r)),
    );
    toast.success('Funds released', { description: 'Thanks for confirming. Pro has been paid.' });
  };

  const handleDisputeWork = (requestId: number) => {
    setServiceRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'disputed' } : r)),
    );
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: Search },
    { id: 'my-properties', label: 'My Properties', icon: Building2 },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'favourites', label: 'Favourites', icon: Heart },
    { id: 'professionals', label: 'Find Professionals', icon: Users },
    { id: 'my-services', label: 'My Services', icon: Wrench },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'support', label: 'Support', icon: HelpCircle },
  ];

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

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || 
              (activeTab.startsWith('property-detail:') && item.id === (sessionStorage.getItem('houzii_prev_tab') || 'explore'));
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
                    layoutId="activeSideTab"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Trust Badge at Bottom */}
        <div className="px-4 pb-6 space-y-3">
          <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-green-700 text-xs font-black">Tier 1 Verified</p>
              <p className="text-green-500 text-[10px] font-bold">Basic KYC Complete</p>
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
        {activeTab.startsWith('property-detail:') ? (
          <PropertyDetailPanel
            propertyId={Number(activeTab.split(':')[1])}
            onBack={() => { sessionStorage.removeItem('houzii_viewing_date'); onNavigate(sessionStorage.getItem('houzii_prev_tab') || 'explore'); }}
            onViewProperty={(id) => onNavigate(`property-detail:${id}`)}
          />
        ) : activeTab === 'explore' ? (
          <ExplorePanel onViewProperty={(id) => {
            sessionStorage.setItem('houzii_prev_tab', 'explore');
            onNavigate(`property-detail:${id}`);
          }} />
        ) : activeTab === 'professionals' ? (
          <ProfessionalsPanel />
        ) : activeTab === 'activity' ? (
          <ActivityPanel onViewProperty={(id, viewingDate) => {
            sessionStorage.setItem('houzii_prev_tab', 'activity');
            if (viewingDate) sessionStorage.setItem('houzii_viewing_date', viewingDate);
            onNavigate(`property-detail:${id}`);
          }} />
        ) : activeTab === 'my-properties' ? (
          <MyPropertiesPanel
            onViewLease={() => { setViewingSignedLease(false); setShowLeaseExecution(true); }}
            onViewSignedLease={() => {
              setViewingSignedLease(true);
              setShowLeaseExecution(true);
            }}
            onPayment={() => setShowPaymentGate(true)}
            onSignLease={() => setShowSignLease(true)}
            onScheduleHandover={() => setShowScheduleWalkthrough(true)}
            onReviewVerify={() => setShowHandoverDecision(true)}
            onGetSettled={(title) => {
              setGetSettledPropertyTitle(title);
              setShowGetSettled(true);
            }}
            signedApplicationIds={signedApplicationIds}
            applicationStatuses={applicationStatuses}
          />

        ) : activeTab === 'my-services' ? (
          <MyServicesPanel
            requests={serviceRequests}
            onNewRequest={() => setShowGetSettled(true)}
            onAcceptBid={handleAcceptBid}
            onApprove={handleApproveWork}
            onDispute={handleDisputeWork}
          />
        ) : activeTab === 'favourites' ? (
          <FavouritesPanel onNavigate={onNavigate} onViewProperty={(id) => {
            sessionStorage.setItem('houzii_prev_tab', 'favourites');
            onNavigate(`property-detail:${id}`);
          }} />
        ) : (
        <>
        {/* Header */}
        <div className="bg-white px-6 pt-8 pb-6 border-b border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 shadow-sm">
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <User className="w-6 h-6" />
                </div>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-bold">Good evening</p>
                <p className="text-slate-900 font-black text-lg">{userName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Trust Score */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span className="text-green-600 text-xs font-black">T1</span>
              </div>
              <button
                onClick={() => setShowNotifications(true)}
                className="relative p-2.5 bg-slate-50 border border-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {mockNotifications.filter(n => !n.read).length > 0 && (
                  <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
                )}
              </button>
            </div>
          </div>

          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-slate-900 font-black text-2xl mb-1">Here are your top matches</h2>
            <p className="text-slate-400 font-medium flex items-center gap-1">
              <MapPin className="w-4 h-4" /> in Lekki, Lagos
            </p>
          </motion.div>
        </div>

        {/* Next Action Card — surfaces highest-priority deal task */}
        {(() => {
          const statusMap = {
            reviewing: {
              label: 'Application In Review',
              title: 'Sit tight — agent is reviewing',
              body: 'We\'ll alert you as soon as the agent accepts and the lease is ready to review.',
              cta: 'View Status',
              icon: ClipboardList,
              onClick: () => onNavigate('my-properties'),
            },
            lease_ready: {
              label: 'Application Accepted',
              title: 'Review your lease — accept or decline',
              body: 'Your agent has prepared the lease. Review the terms, comment on clauses, then accept to proceed to payment or decline if you\'re no longer interested.',
              cta: 'Review Lease',
              icon: FileSignature,
              onClick: () => { setViewingSignedLease(false); setShowLeaseExecution(true); },
            },
            lease_declined: {
              label: 'Lease Declined',
              title: 'Application withdrawn',
              body: 'You declined this lease. Keep exploring — we\'ll surface better matches for you.',
              cta: 'Explore Homes',
              icon: ClipboardList,
              onClick: () => onNavigate('explore'),
            },
            awaiting_payment: {
              label: 'Lease Accepted · 48h',
              title: 'Fund escrow to secure the home',
              body: 'You have 48 hours to pay into Houzii Secure Escrow. After payment you\'ll sign the lease (the agent has already signed).',
              cta: 'Make Payment',
              icon: CreditCard,
              onClick: () => setShowPaymentGate(true),
            },
            payment_complete: {
              label: 'Payment Confirmed',
              title: 'Sign your lease',
              body: 'Escrow is funded and Agent Joy Adeyemi has already signed the lease. Add your signature to lock in the deal.',
              cta: 'Sign Lease',
              icon: FileSignature,
              onClick: () => setShowSignLease(true),
            },
            lease_signed: {
              label: 'Lease Signed',
              title: 'Schedule your handover walkthrough',
              body: 'Both parties have signed. Propose a date with your agent to inspect the property and pick up the keys.',
              cta: 'Schedule Handover',
              icon: CalendarCheck,
              onClick: () => setShowScheduleWalkthrough(true),
            },
            move_in_scheduled: {
              label: 'Escrow Funded',
              title: 'Schedule your handover walkthrough',
              body: 'Funds are locked. Lock in a date with your agent to inspect the property and pick up the keys.',
              cta: 'Schedule Handover',
              icon: CalendarCheck,
              onClick: () => setShowScheduleWalkthrough(true),
            },
            awaiting_handover: {
              label: 'Awaiting Agent',
              title: 'Waiting for agent to confirm handover',
              body: 'We\'ve sent your proposed handover date. We\'ll alert you the moment the agent confirms.',
              cta: 'View Details',
              icon: CalendarCheck,
              onClick: () => onNavigate('my-properties'),
            },
            handover_ready: {
              label: 'Agent Confirmed · Handover Day',
              title: 'Verify the home & release funds',
              body: 'Your agent has confirmed the handover. Walk through the property — once it checks out, funds release.',
              cta: 'Verify Handover',
              icon: KeyRound,
              onClick: () => setShowHandoverDecision(true),
            },
            verifying: {
              label: 'Verifying Handover',
              title: 'Complete your move-in checklist',
              body: 'Walk through the property and confirm everything checks out to release funds.',
              cta: 'Continue Check',
              icon: KeyRound,
              onClick: () => setShowMoveInChecklist(true),
            },
            deal_closed: {
              label: 'Deal Closed',
              title: 'Welcome home — get settled',
              body: 'Funds released. Book trusted pros for cleaning, internet, security, and more.',
              cta: 'Get Settled',
              icon: CheckCircle2,
              onClick: () => setShowGetSettled(true),
            },
          } as const;

          // Highest-priority status wins (latest stage first)
          const priority: Array<keyof typeof statusMap> = [
            'verifying', 'handover_ready', 'awaiting_handover', 'lease_signed', 'move_in_scheduled',
            'payment_complete', 'awaiting_payment', 'lease_ready', 'reviewing', 'lease_declined', 'deal_closed',
          ];
          const statuses = Object.values(applicationStatuses);
          const next = priority.find(p => statuses.includes(p as never)) ?? 'lease_ready';
          const action = statusMap[next];
          const Icon = action.icon;


          return (
            <div className="px-6 pt-6">
              <motion.button
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onClick={action.onClick}
                className="group relative w-full text-left rounded-2xl overflow-hidden bg-orange-50 border border-orange-200/70 p-5 hover:bg-orange-100/70 hover:border-orange-300 transition-all"
              >
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-orange-200/40 rounded-full blur-3xl" />
                <div className="relative flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 rounded-full text-[10px] font-black text-primary uppercase tracking-wider">
                        <Sparkles className="w-3 h-3" /> Next Step
                      </span>
                      <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{action.label}</span>
                    </div>
                    <h3 className="text-slate-900 font-black text-base md:text-lg mb-1 leading-tight">{action.title}</h3>
                    <p className="text-slate-500 text-xs md:text-sm font-medium mb-3 line-clamp-2">{action.body}</p>
                    <div className="inline-flex items-center gap-1.5 text-primary text-xs font-black group-hover:gap-2.5 transition-all">
                      {action.cta} <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </motion.button>
            </div>
          );
        })()}

        {/* Handpicked Properties - Horizontal Scroll */}
        <div className="mb-8 pt-6">
          <div className="flex items-center justify-between px-6 mb-5">
            <h3 className="text-slate-900 font-black text-lg">Handpicked for You</h3>
            <button
              onClick={() => onNavigate('explore')}
              className="text-primary text-sm font-bold flex items-center gap-1 hover:underline"
            >
              See All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-4">
            {handpickedProperties.map((property, i) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onClick={() => {
                  sessionStorage.setItem('houzii_prev_tab', 'home');
                  onNavigate(`property-detail:${property.id}`);
                }}
                className="group bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-md hover:shadow-2xl hover:shadow-slate-200/50 transition-all hover:-translate-y-1.5 cursor-pointer"
              >
                <div className="relative aspect-[3/2] overflow-hidden">
                  <ImageWithFallback
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-white px-3 py-1.5 rounded-full shadow-md border border-slate-100">
                    <span className="text-[10px] font-bold text-primary flex items-center gap-1 uppercase tracking-wide">
                      <Sparkles className="w-3 h-3 fill-primary/20" />
                      {property.tag}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleLike(property.id); }}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-600 hover:text-red-500 transition-colors shadow-md border border-slate-100"
                    >
                      <Heart className={`w-4 h-4 ${likedProperties.includes(property.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                    <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-600 hover:text-primary transition-colors shadow-md border border-slate-100">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{property.location}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors line-clamp-1">
                    {property.title}
                  </h3>

                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Bed className="w-4 h-4" />
                        <span className="text-sm font-semibold">{property.beds} <span className="font-normal text-xs text-slate-500">Beds</span></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Bath className="w-4 h-4" />
                        <span className="text-sm font-semibold">{property.baths} <span className="font-normal text-xs text-slate-500">Baths</span></span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-2.5 py-1 rounded-md">
                      {property.type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-slate-900 leading-none">{property.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Services */}
        <div className="px-6 mb-8">
          <h3 className="text-slate-900 font-black text-lg mb-5">Quick Services</h3>
          <div className="grid grid-cols-3 gap-3">
            {quickServices.map((service, i) => {
              const Icon = service.icon;
              return (
                <motion.button
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  onClick={() => service.id === 'property-order' && setShowPropertyOrder(true)}
                  className="p-5 bg-white border border-slate-200 rounded-2xl flex flex-col items-center gap-3 hover:shadow-md hover:border-slate-300 transition-all group"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${service.iconColor}`} />
                  </div>
                  <span className="text-slate-600 text-xs font-bold text-center">{service.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Community Trust Widget */}
        <div className="px-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-primary/5 to-primary/[0.02] border border-primary/15 rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
            <div className="relative flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="text-slate-800 font-bold text-sm mb-1">Community Trust</h4>
                <p className="text-slate-400 text-xs font-medium mb-4">
                  Rate your current living experience anonymously to boost your seeker priority score.
                </p>
                <button className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-full text-xs font-bold transition-colors flex items-center gap-1 shadow-sm shadow-primary/15">
                  Rate Now <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
        </>
        )}

        {/* Bottom Navigation - Mobile Only */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-2 py-2 z-50 lg:hidden">
          <div className="flex items-center justify-around max-w-lg mx-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || 
                (activeTab.startsWith('property-detail:') && item.id === (sessionStorage.getItem('houzii_prev_tab') || 'explore'));
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${
                    isActive ? 'text-primary' : 'text-slate-300 hover:text-slate-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-bold">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="w-1 h-1 rounded-full bg-primary"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══ Property Order Wizard Modal ═══ */}
      <AnimatePresence>
        {showPropertyOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
            onClick={() => { setShowPropertyOrder(false); resetPropertyOrder(); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Success State */}
              {orderSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 px-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                    className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5"
                  >
                    <ShieldCheck className="w-10 h-10 text-green-500" />
                  </motion.div>
                  <h3 className="text-slate-900 font-black text-xl mb-2">Order Placed!</h3>
                  <p className="text-slate-400 text-sm font-medium text-center">Your property order is now live. Verified agents will start matching properties for you.</p>
                </motion.div>
              ) : (
                <>
                  {/* Header */}
                  <div className="px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                          <ClipboardList className="w-5 h-5 text-rose-500" />
                        </div>
                        <div>
                          <h3 className="text-slate-900 font-black text-sm">Property Order</h3>
                          <p className="text-slate-400 text-[10px] font-medium">Step {orderStep} of 3</p>
                        </div>
                      </div>
                      <button onClick={() => { setShowPropertyOrder(false); resetPropertyOrder(); }} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    {/* Progress */}
                    <div className="flex gap-2">
                      {[1, 2, 3].map(s => (
                        <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${s <= orderStep ? 'bg-primary' : 'bg-slate-100'}`} />
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto px-6 py-5">
                    <AnimatePresence mode="wait">
                      {/* ── Step 1: Property Specs ── */}
                      {orderStep === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                          <div>
                            <h4 className="text-slate-900 font-black text-lg mb-1">Property Specs</h4>
                            <p className="text-slate-400 text-xs font-medium">Tell us exactly what you're looking for.</p>
                          </div>

                          {/* Intent Toggle */}
                          <div>
                            <label className="text-slate-600 text-[11px] font-bold uppercase tracking-wider mb-2 block">Intent</label>
                            <div className="flex bg-slate-100 rounded-xl p-1">
                              {(['rent', 'buy'] as const).map(intent => (
                                <button
                                  key={intent}
                                  onClick={() => setOrderIntent(intent)}
                                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                                    orderIntent === intent ? 'bg-white text-primary shadow-sm' : 'text-slate-400'
                                  }`}
                                >
                                  {intent === 'rent' ? 'Rent' : 'Buy'}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Property Type Dropdown */}
                          <div className="relative">
                            <label className="text-slate-600 text-[11px] font-bold uppercase tracking-wider mb-2 block">Property Type</label>
                            <button
                              onClick={() => setOrderPropertyTypeOpen(!orderPropertyTypeOpen)}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 flex items-center justify-between hover:border-slate-300 transition-all"
                            >
                              {orderPropertyType}
                              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${orderPropertyTypeOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>
                              {orderPropertyTypeOpen && (
                                <motion.div
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -5 }}
                                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-10 overflow-hidden max-h-48 overflow-y-auto"
                                >
                                  {PROPERTY_TYPES.map(t => (
                                    <button
                                      key={t}
                                      onClick={() => { setOrderPropertyType(t); setOrderPropertyTypeOpen(false); }}
                                      className={`w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-slate-50 transition-colors ${
                                        orderPropertyType === t ? 'text-primary font-bold bg-primary/5' : 'text-slate-600'
                                      }`}
                                    >
                                      {t}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Bedrooms & Bathrooms Steppers */}
                          <div className="grid grid-cols-2 gap-4">
                            {[
                              { label: 'Bedrooms', value: orderBedrooms, set: setOrderBedrooms, icon: Bed },
                              { label: 'Bathrooms', value: orderBathrooms, set: setOrderBathrooms, icon: Bath },
                            ].map(item => (
                              <div key={item.label}>
                                <label className="text-slate-600 text-[11px] font-bold uppercase tracking-wider mb-2 block">{item.label}</label>
                                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                                  <button
                                    onClick={() => item.set(Math.max(0, item.value - 1))}
                                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <div className="flex-1 text-center">
                                    <span className="text-slate-900 font-black text-lg">{item.value}</span>
                                  </div>
                                  <button
                                    onClick={() => item.set(item.value + 1)}
                                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Must-Haves Amenities */}
                          <div>
                            <label className="text-slate-600 text-[11px] font-bold uppercase tracking-wider mb-2 block">Must-Haves</label>
                            <div className="flex flex-wrap gap-2">
                              {AMENITIES.map(a => {
                                const AIcon = a.icon;
                                const selected = orderAmenities.includes(a.id);
                                return (
                                  <button
                                    key={a.id}
                                    onClick={() => setOrderAmenities(prev => selected ? prev.filter(x => x !== a.id) : [...prev, a.id])}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold border transition-all ${
                                      selected
                                        ? 'bg-primary/10 border-primary/20 text-primary'
                                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                                    }`}
                                  >
                                    <AIcon className="w-3.5 h-3.5" />
                                    {a.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* ── Step 2: Location & Budget ── */}
                      {orderStep === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                          <div>
                            <h4 className="text-slate-900 font-black text-lg mb-1">Location & Budget</h4>
                            <p className="text-slate-400 text-xs font-medium">Where and how much?</p>
                          </div>

                          {/* Location */}
                          <div>
                            <label className="text-slate-600 text-[11px] font-bold uppercase tracking-wider mb-2 block">Preferred Location</label>
                            <div className="relative">
                              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                              <input
                                type="text"
                                value={orderLocation}
                                onChange={e => setOrderLocation(e.target.value)}
                                placeholder="e.g. Lekki Phase 1, Lagos"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/5"
                              />
                            </div>
                          </div>

                          {/* Budget */}
                          <div>
                            <label className="text-slate-600 text-[11px] font-bold uppercase tracking-wider mb-2 block">Budget</label>
                            <div className="relative">
                              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">&#8358;</span>
                              <input
                                type="text"
                                value={orderBudget}
                                onChange={e => setOrderBudget(e.target.value)}
                                placeholder="e.g. 4.5M/yr or 250M"
                                className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/5"
                              />
                            </div>
                          </div>

                          {/* Smart Price Advisor */}
                          {orderLocation && getPriceGuide() && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-4 bg-blue-50 border border-blue-100 rounded-2xl"
                            >
                              <div className="flex items-start gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                                  <Sparkles className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                  <p className="text-blue-800 text-[11px] font-black mb-0.5">Houzii Guide</p>
                                  <p className="text-blue-600 text-xs font-medium">
                                    Average price for a <span className="font-bold">{orderPropertyType}</span> in{' '}
                                    <span className="font-bold">{orderLocation}</span> is{' '}
                                    <span className="font-black">{getPriceGuide()}</span>
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {/* Summary so far */}
                          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Your Order Summary</p>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600">
                                {orderIntent === 'rent' ? 'Rent' : 'Buy'}
                              </span>
                              <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600">
                                {orderPropertyType}
                              </span>
                              <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 flex items-center gap-1">
                                <Bed className="w-3 h-3" /> {orderBedrooms}
                              </span>
                              <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 flex items-center gap-1">
                                <Bath className="w-3 h-3" /> {orderBathrooms}
                              </span>
                              {orderAmenities.map(a => (
                                <span key={a} className="px-2.5 py-1 bg-primary/5 border border-primary/10 rounded-lg text-[10px] font-bold text-primary">{a}</span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* ── Step 3: Commitment ── */}
                      {orderStep === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                          <div>
                            <h4 className="text-slate-900 font-black text-lg mb-1">Lock Your Commitment</h4>
                            <p className="text-slate-400 text-xs font-medium">Show agents you're serious.</p>
                          </div>

                          {/* Wallet Balance */}
                          <div className="p-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl">
                            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-1">Wallet Balance</p>
                            <p className="text-white font-black text-2xl">&#8358;150,000</p>
                            <p className="text-slate-400 text-[10px] font-medium mt-1">Available for locking</p>
                          </div>

                          {/* Lock Amount */}
                          <div>
                            <label className="text-slate-600 text-[11px] font-bold uppercase tracking-wider mb-2 block">Amount to Lock</label>
                            <div className="relative">
                              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">&#8358;</span>
                              <input
                                type="text"
                                value={orderLockAmount}
                                onChange={e => setOrderLockAmount(e.target.value)}
                                placeholder="e.g. 100K or 4.5M"
                                className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/5"
                              />
                            </div>
                          </div>

                          {/* Top-up warning */}
                          {orderLockAmount && needsTopUp && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2"
                            >
                              <Info className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                              <div>
                                <p className="text-amber-700 text-[11px] font-bold">Insufficient balance</p>
                                <p className="text-amber-600 text-[10px] font-medium">You need to top up your wallet to lock this amount. The button below will redirect you.</p>
                              </div>
                            </motion.div>
                          )}

                          {/* Info Card */}
                          <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-2.5">
                            <Lock className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                            <p className="text-blue-700 text-xs font-medium">
                              Locked funds remain in your wallet but are reserved for this order to prove your readiness to agents. You can unlock anytime.
                            </p>
                          </div>

                          {/* Full Summary */}
                          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2.5">
                            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Order Overview</p>
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-400 font-medium">Intent</span>
                                <span className="text-slate-800 font-bold">{orderIntent === 'rent' ? 'Rent' : 'Buy'}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-400 font-medium">Type</span>
                                <span className="text-slate-800 font-bold">{orderPropertyType}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-400 font-medium">Specs</span>
                                <span className="text-slate-800 font-bold">{orderBedrooms} Bed / {orderBathrooms} Bath</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-400 font-medium">Location</span>
                                <span className="text-slate-800 font-bold">{orderLocation || '\u2014'}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-400 font-medium">Budget</span>
                                <span className="text-primary font-black">&#8358;{orderBudget || '\u2014'}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-400 font-medium">Must-Haves</span>
                                <span className="text-slate-800 font-bold">{orderAmenities.length} selected</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 border-t border-slate-100 shrink-0 flex gap-3">
                    {orderStep > 1 && (
                      <button
                        onClick={() => setOrderStep(orderStep - 1)}
                        className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all"
                      >
                        Back
                      </button>
                    )}
                    {orderStep < 3 ? (
                      <button
                        onClick={() => setOrderStep(orderStep + 1)}
                        className="flex-1 py-3 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                        style={{ backgroundColor: '#6D1D2C' }}
                      >
                        Continue <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={handlePlaceOrder}
                        disabled={!orderLockAmount}
                        className="flex-1 py-3 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-40"
                        style={{ backgroundColor: needsTopUp ? '#D97706' : '#6D1D2C' }}
                      >
                        {needsTopUp ? (
                          <>
                            <Wallet className="w-3.5 h-3.5" />
                            Top Up & Place Order
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            Place Order
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rental Transaction Suite Modals */}
      <AnimatePresence>
        {showLeaseExecution && (
          <LeaseExecutionSuite
            propertyTitle="2 Bed Serviced Apartment"
            agentName="Joy Adeyemi"
            rent="₦4,500,000/yr"
            mode="review"
            onClose={() => {
              setShowLeaseExecution(false);
              setViewingSignedLease(false);
            }}
            onAccept={() => {
              setShowLeaseExecution(false);
              setApplicationStatuses(prev => ({ ...prev, 1: 'awaiting_payment' }));
              toast.success('Lease Accepted!', {
                description: 'Next step: fund escrow within 48 hours. You\'ll sign the lease after payment.',
                duration: 5000,
              });
              setTimeout(() => setShowPaymentGate(true), 400);
            }}
            onDecline={() => {
              setShowLeaseExecution(false);
              setApplicationStatuses(prev => ({ ...prev, 1: 'lease_declined' }));
              toast.error('Application Withdrawn', {
                description: 'You\'ve declined this lease. The agent has been notified.',
                duration: 5000,
              });
            }}
            onSigned={() => {}}
            readOnly={viewingSignedLease}
          />
        )}
      </AnimatePresence>

      {/* Lease Sign Modal — opens after payment (agent has already signed) */}
      <AnimatePresence>
        {showSignLease && (
          <LeaseExecutionSuite
            propertyTitle="2 Bed Serviced Apartment"
            agentName="Joy Adeyemi"
            rent="₦4,500,000/yr"
            mode="sign"
            onClose={() => setShowSignLease(false)}
            onSigned={() => {
              setShowSignLease(false);
              setSignedApplicationIds(prev => prev.includes(1) ? prev : [...prev, 1]);
              setApplicationStatuses(prev => ({ ...prev, 1: 'lease_signed' }));
              toast.success('Lease Signed!', {
                description: 'Both signatures are on file. Next: schedule your handover walkthrough.',
                duration: 5000,
              });
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPaymentGate && (
          <PaymentGate48h
            propertyTitle="2 Bed Serviced Apartment"
            amount="₦4,500,000"
            onClose={() => setShowPaymentGate(false)}
            onProceedToPayment={() => {
              setShowPaymentGate(false);
              setShowEscrowPayment(true);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEscrowPayment && (
          <EscrowFlow
            property={{
              title: '2 Bed Serviced Apartment',
              location: 'Victoria Island, Lagos',
              image: '/placeholder.svg',
              price: '₦4,500,000',
              agent: { name: 'Joy Adeyemi' },
              rentBreakdown: {
                rent: '₦3,500,000',
                serviceCharge: '₦500,000',
                agencyFee: '₦250,000',
                legalFee: '₦100,000',
                cautionFee: '₦150,000',
              },
            }}
            onClose={() => {
              setShowEscrowPayment(false);
              // After payment, transition to payment_complete so seeker signs the lease next
              setApplicationStatuses(prev => ({ ...prev, 1: 'payment_complete' }));
              toast.success('Payment Confirmed!', {
                description: 'Escrow secured. Now sign the lease — Agent Joy Adeyemi has already signed.',
                duration: 5000,
              });
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHandoverVerification && (
          <HandoverVerification
            propertyTitle="2 Bed Serviced Apartment"
            agentName="Joy Adeyemi"
            amount="₦4,500,000"
            onClose={() => setShowHandoverVerification(false)}
            onReleaseFunds={() => setShowHandoverVerification(false)}
            onDispute={() => {}}
          />
        )}
      </AnimatePresence>


      {/* Schedule Walkthrough (Arrange Your Handover) */}
      <AnimatePresence>
        {showScheduleWalkthrough && (
          <ScheduleWalkthrough
            propertyTitle="2 Bed Serviced Apartment"
            agentName="Joy Adeyemi"
            onClose={() => setShowScheduleWalkthrough(false)}
            onPropose={() => {
              setShowScheduleWalkthrough(false);
              setApplicationStatuses(prev => ({ ...prev, 1: 'awaiting_handover' }));
              toast.success('Request Sent!', {
                description: 'Agent Joy Adeyemi has been notified. We\'ll alert you once they approve the time or suggest an alternative.',
                duration: 5000,
              });
            }}
          />
        )}
      </AnimatePresence>

      {/* Handover Decision Modal (Agent triggered handover) */}
      <AnimatePresence>
        {showHandoverDecision && (
          <HandoverDecisionModal
            propertyTitle="2 Bed Serviced Apartment"
            agentName="Joy Adeyemi"
            onClose={() => setShowHandoverDecision(false)}
            onReviewVerify={() => {
              setShowHandoverDecision(false);
              setShowMoveInChecklist(true);
            }}
            onDispute={() => {
              setShowHandoverDecision(false);
              // Could open dispute form here
            }}
          />
        )}
      </AnimatePresence>

      {/* Move-In Checklist (Everything Check Out?) */}
      <AnimatePresence>
        {showMoveInChecklist && (
          <div className="fixed inset-0 z-[70]">
            <MoveInChecklist
              agentName="Joy Adeyemi"
              propertyTitle="2 Bed Serviced Apartment"
              amount="₦4,500,000"
              onBack={() => setShowMoveInChecklist(false)}
              onReleaseFunds={() => {
                setShowMoveInChecklist(false);
                setApplicationStatuses(prev => ({ ...prev, 1: 'deal_closed' }));
                toast.success('Funds Released!', {
                  description: '₦4,500,000 has been released to Agent Joy Adeyemi. Deal closed successfully.',
                  duration: 5000,
                });
                // Auto-trigger Get Settled recommendation modal
                setGetSettledPropertyTitle('2 Bed Serviced Apartment, Victoria Island');
                setTimeout(() => setShowGetSettled(true), 800);
              }}
              onDisputeSubmitted={() => {
                setShowMoveInChecklist(false);
                toast.error('Dispute Filed', {
                  description: 'Escrow has been frozen. The Houzii Human Oracle team will review within 24 hours.',
                  duration: 5000,
                });
              }}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Get Settled Recommendation Modal */}
      <AnimatePresence>
        {showGetSettled && (
          <GetSettledModal
            propertyTitle={getSettledPropertyTitle}
            onClose={() => setShowGetSettled(false)}
            onContinue={(selected) => {
              setShowGetSettled(false);
              setWizardSelection(selected);
            }}
          />
        )}
      </AnimatePresence>

      {/* Service Request Wizard */}
      <AnimatePresence>
        {wizardSelection && wizardSelection.length > 0 && (
          <ServiceRequestWizard
            selectedCategories={wizardSelection}
            propertyTitle={getSettledPropertyTitle}
            onClose={() => setWizardSelection(null)}
            onSubmit={handleSubmitServiceRequests}
          />
        )}
      </AnimatePresence>

      <NotificationPanel
        open={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={mockNotifications}
      />
    </div>
  );
};