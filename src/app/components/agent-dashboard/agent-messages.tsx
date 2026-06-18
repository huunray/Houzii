import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Phone, Video, MoreVertical, Send, Paperclip,
  Calendar, FileText, Wallet, ShieldCheck, MapPin, Bed,
  Bath, Square, ChevronLeft, Sparkles, Clock, CheckCheck,
  Check, Flame, Eye, Tag, X, Mic, Image as ImageIcon,
  CircleCheck, CircleX, Building2, ArrowRight, Zap,
  MessageCircle, Star, Lock, TrendingUp, Users,
  DollarSign, Percent, BarChart3, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────
interface PropertyCard {
  id: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  sqm: number;
  image: string;
  type: string;
}

interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  initials: string;
  lastMessage: string;
  time: string;
  unread: number;
  status: 'hot' | 'viewing' | 'offer' | 'cold';
  trustTier: 1 | 2 | 3;
  lockedFunds: boolean;
  property: PropertyCard;
  online: boolean;
}

type MessageType = 'text' | 'inspection-card' | 'ai-nudge' | 'system' | 'offer-card';

interface ChatMessage {
  id: string;
  sender: 'agent' | 'seeker' | 'system';
  type: MessageType;
  text?: string;
  time: string;
  read?: boolean;
  inspectionData?: {
    date: string;
    time: string;
    address: string;
    status: 'upcoming' | 'completed' | 'no-show';
  };
  nudgeData?: {
    hint: string;
    action: string;
    budget?: string;
    listingPrice?: string;
  };
  offerData?: {
    amount: string;
    original: string;
    discount: string;
    status: 'pending' | 'accepted' | 'rejected';
  };
}

// ─── Mock Data ───────────────────────────────────────────────────────
const MOCK_PROPERTIES: PropertyCard[] = [
  { id: 'p1', title: '3-Bed Luxury Flat', location: 'Lekki Phase 1, Lagos', price: '₦4.8M', beds: 3, baths: 2, sqm: 145, image: '', type: 'Rental' },
  { id: 'p2', title: '4-Bed Detached Duplex', location: 'Maitama, Abuja', price: '₦85M', beds: 4, baths: 4, sqm: 320, image: '', type: 'Sale' },
  { id: 'p3', title: '2-Bed Serviced Apartment', location: 'Victoria Island, Lagos', price: '₦3.2M', beds: 2, baths: 2, sqm: 95, image: '', type: 'Rental' },
  { id: 'p4', title: '5-Bed Smart Home', location: 'Banana Island, Lagos', price: '₦250M', beds: 5, baths: 5, sqm: 550, image: '', type: 'Sale' },
];

const MOCK_CONTACTS: ChatContact[] = [
  {
    id: 'c1', name: 'Chioma Adebayo', avatar: '', initials: 'CA',
    lastMessage: 'Is the service charge included in the ₦4.8M?',
    time: '2m ago', unread: 3, status: 'hot', trustTier: 2, lockedFunds: true,
    property: MOCK_PROPERTIES[0], online: true,
  },
  {
    id: 'c2', name: 'Ibrahim Musa', avatar: '', initials: 'IM',
    lastMessage: 'I\'d like to schedule a viewing this weekend',
    time: '15m ago', unread: 1, status: 'viewing', trustTier: 2, lockedFunds: false,
    property: MOCK_PROPERTIES[1], online: true,
  },
  {
    id: 'c3', name: 'Aisha Bello', avatar: '', initials: 'AB',
    lastMessage: 'Can we negotiate the price a bit?',
    time: '1h ago', unread: 0, status: 'offer', trustTier: 3, lockedFunds: true,
    property: MOCK_PROPERTIES[2], online: false,
  },
  {
    id: 'c4', name: 'Emeka Okafor', avatar: '', initials: 'EO',
    lastMessage: 'What documents do I need for C of O verification?',
    time: '3h ago', unread: 0, status: 'cold', trustTier: 1, lockedFunds: false,
    property: MOCK_PROPERTIES[3], online: false,
  },
  {
    id: 'c5', name: 'Fatima Yusuf', avatar: '', initials: 'FY',
    lastMessage: 'Thanks! I\'ll confirm after my inspection tomorrow.',
    time: '5h ago', unread: 0, status: 'viewing', trustTier: 2, lockedFunds: true,
    property: MOCK_PROPERTIES[0], online: false,
  },
];

const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  c1: [
    { id: 'm1', sender: 'seeker', type: 'text', text: 'Hi! I saw your listing for the 3-Bed Luxury Flat in Lekki Phase 1. Is it still available?', time: '10:30 AM', read: true },
    { id: 'm2', sender: 'agent', type: 'text', text: 'Hello Chioma! Yes, the property is still available. It\'s a beautiful unit with modern finishes and 24/7 power supply.', time: '10:32 AM', read: true },
    { id: 'm3', sender: 'seeker', type: 'text', text: 'That sounds great! What about parking? And is the estate gated?', time: '10:35 AM', read: true },
    { id: 'm4', sender: 'agent', type: 'text', text: 'Yes, it comes with 2 dedicated parking spaces. The estate is fully gated with 24/7 security, CCTV, and a manned gatehouse.', time: '10:37 AM', read: true },
    {
      id: 'm5', sender: 'system', type: 'inspection-card',
      time: '10:45 AM',
      inspectionData: { date: 'March 25, 2026', time: '10:00 AM', address: 'Block C, Unit 12, Lekki Gardens Estate, Lekki Phase 1', status: 'upcoming' },
    },
    { id: 'm6', sender: 'seeker', type: 'text', text: 'Is the service charge included in the ₦4.8M?', time: '11:02 AM', read: false },
    {
      id: 'm7', sender: 'system', type: 'ai-nudge',
      time: '11:02 AM',
      nudgeData: {
        hint: 'This seeker has a budget of ₦4.5M and has locked funds. Your listing is ₦4.8M. Consider offering a 5% discount (₦4.56M) to close this deal quickly.',
        action: 'Send Discounted Offer',
        budget: '₦4.5M',
        listingPrice: '₦4.8M',
      },
    },
  ],
  c2: [
    { id: 'm1', sender: 'seeker', type: 'text', text: 'Good morning! Is the 4-Bed Duplex in Maitama still on the market?', time: '9:00 AM', read: true },
    { id: 'm2', sender: 'agent', type: 'text', text: 'Good morning Ibrahim! Yes, it\'s available. It\'s a stunning property with a private garden and boys\' quarters.', time: '9:05 AM', read: true },
    { id: 'm3', sender: 'seeker', type: 'text', text: 'I\'d like to schedule a viewing this weekend', time: '9:15 AM', read: false },
  ],
  c3: [
    { id: 'm1', sender: 'seeker', type: 'text', text: 'I love the 2-Bed apartment on VI! But ₦3.2M is slightly above my budget.', time: '8:00 AM', read: true },
    { id: 'm2', sender: 'agent', type: 'text', text: 'I understand, Aisha. What budget range are you working with?', time: '8:10 AM', read: true },
    { id: 'm3', sender: 'seeker', type: 'text', text: 'Can we negotiate the price a bit? I\'m thinking ₦2.8M', time: '8:20 AM', read: true },
    {
      id: 'm4', sender: 'agent', type: 'offer-card',
      time: '8:30 AM',
      offerData: { amount: '₦3.0M', original: '₦3.2M', discount: '6.25%', status: 'pending' },
    },
  ],
  c4: [
    { id: 'm1', sender: 'seeker', type: 'text', text: 'What documents do I need for C of O verification?', time: '6:00 AM', read: true },
    { id: 'm2', sender: 'agent', type: 'text', text: 'For C of O verification, you\'ll need: Survey Plan, Tax Clearance Certificate, Building Plan Approval, and proof of ownership. I can guide you through each step.', time: '6:15 AM', read: true },
  ],
  c5: [
    { id: 'm1', sender: 'seeker', type: 'text', text: 'Thanks! I\'ll confirm after my inspection tomorrow.', time: '3:00 PM', read: true },
  ],
};

const QUICK_REPLIES = [
  'Yes, the property is still available!',
  'The service charge is ₦X per annum.',
  'The title is a Certificate of Occupancy (C of O).',
  'I can schedule an inspection for you this week.',
  'Let me send you a detailed brochure.',
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  hot: { label: 'Hot Lead', color: 'text-red-600', bg: 'bg-red-50 border-red-100', icon: Flame },
  viewing: { label: 'Viewing Set', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100', icon: Eye },
  offer: { label: 'Offer Made', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100', icon: Tag },
  cold: { label: 'New', color: 'text-slate-500', bg: 'bg-slate-50 border-slate-100', icon: MessageCircle },
};

// ─── Component ───────────────────────────────────────────────────────
export const AgentMessages: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>('c1');
  const [showInbox, setShowInbox] = useState(true);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(MOCK_MESSAGES);
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [showPropertyCard, setShowPropertyCard] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showMarketInsight, setShowMarketInsight] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('2026-03-28');
  const [scheduleTime, setScheduleTime] = useState('10:00');
  const [offerAmount, setOfferAmount] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentType, setPaymentType] = useState<'deposit' | 'rent' | 'full'>('deposit');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeContact = MOCK_CONTACTS.find(c => c.id === selectedChat);
  const activeMessages = selectedChat ? (messages[selectedChat] || []) : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length]);

  const filteredContacts = MOCK_CONTACTS.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.property.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = () => {
    if (!messageInput.trim() || !selectedChat) return;
    const newMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      sender: 'agent',
      type: 'text',
      text: messageInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMsg],
    }));
    setMessageInput('');
    setShowQuickReplies(false);
  };

  const handleSelectChat = (id: string) => {
    setSelectedChat(id);
    setShowInbox(false);
    setShowPropertyCard(false);
    setShowQuickReplies(false);
  };

  const handleInspectionAction = (chatId: string, msgId: string, result: 'success' | 'no-show') => {
    setMessages(prev => ({
      ...prev,
      [chatId]: prev[chatId].map(m =>
        m.id === msgId && m.inspectionData
          ? { ...m, inspectionData: { ...m.inspectionData, status: result === 'success' ? 'completed' : 'no-show' as const } }
          : m
      ),
    }));
    // Add system message
    const followUp: ChatMessage = {
      id: `m_${Date.now()}`,
      sender: 'system',
      type: 'text',
      text: result === 'success'
        ? '✅ Inspection marked successful. Next step: Prepare Sales/Rental Agreement.'
        : '❌ Inspection marked as no-show. Lead status updated.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => ({
      ...prev,
      [chatId]: [...prev[chatId], followUp],
    }));
  };

  const handleSendDiscountOffer = () => {
    if (!selectedChat) return;
    const offer: ChatMessage = {
      id: `m_${Date.now()}`,
      sender: 'agent',
      type: 'offer-card',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      offerData: { amount: '₦4.56M', original: '₦4.8M', discount: '5%', status: 'pending' },
    };
    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), offer],
    }));
  };

  const handleScheduleInspection = () => {
    if (!selectedChat || !activeContact) return;
    const dateObj = new Date(scheduleDate);
    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const [h, m] = scheduleTime.split(':');
    const hour = parseInt(h);
    const formattedTime = `${hour > 12 ? hour - 12 : hour}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;

    const inspMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      sender: 'system',
      type: 'inspection-card',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      inspectionData: {
        date: formattedDate,
        time: formattedTime,
        address: activeContact.property.location,
        status: 'upcoming',
      },
    };
    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), inspMsg],
    }));
    setShowScheduleModal(false);
  };

  const handleSendOffer = () => {
    if (!selectedChat || !activeContact || !offerAmount.trim()) return;
    const originalPrice = activeContact.property.price;
    const originalNum = parseFloat(originalPrice.replace(/[₦,M]/g, ''));
    const offerNum = parseFloat(offerAmount.replace(/[₦,M]/g, ''));
    const discount = originalNum > 0 ? (((originalNum - offerNum) / originalNum) * 100).toFixed(1) : '0';

    const offerMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      sender: 'agent',
      type: 'offer-card',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      offerData: {
        amount: `₦${offerAmount}`,
        original: originalPrice,
        discount: `${discount}%`,
        status: 'pending',
      },
    };
    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), offerMsg],
    }));
    setOfferAmount('');
    setShowOfferModal(false);
  };

  const handleRequestPayment = () => {
    if (!selectedChat || !activeContact || !paymentAmount.trim()) return;
    const typeLabel = paymentType === 'deposit' ? 'Deposit' : paymentType === 'rent' ? 'Rent Payment' : 'Full Payment';
    const payMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      sender: 'agent',
      type: 'text',
      text: `💳 Payment Request: ${typeLabel} of ₦${paymentAmount} for ${activeContact.property.title}. Please proceed via Houzii Escrow to secure this transaction.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), payMsg],
    }));
    setPaymentAmount('');
    setShowPaymentModal(false);
  };

  // ─── Inbox Sidebar ─────────────────────────────────────────────────
  const InboxSidebar = () => (
    <div className={`${selectedChat && !showInbox ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-[340px] xl:w-[380px] bg-white border-r border-slate-100 shrink-0 h-full`}>
      {/* Inbox Header */}
      <div className="px-5 pt-6 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-slate-900 font-black text-lg">Messages</h2>
            <p className="text-slate-400 text-[10px] font-bold">{MOCK_CONTACTS.length} conversations</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-600 text-[10px] font-bold">{MOCK_CONTACTS.filter(c => c.online).length} online</span>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search chats or properties..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/5 transition-all"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.map((contact, i) => {
          const isActive = selectedChat === contact.id;
          const statusCfg = STATUS_CONFIG[contact.status];
          const StatusIcon = statusCfg.icon;
          return (
            <motion.button
              key={contact.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => handleSelectChat(contact.id)}
              className={`w-full px-5 py-4 flex items-start gap-3 border-b border-slate-50 transition-all text-left ${
                isActive ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-slate-50'
              }`}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-sm ${
                  isActive ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {contact.initials}
                </div>
                {contact.online && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white" />
                )}
                {contact.lockedFunds && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center border-2 border-white">
                    <ShieldCheck className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-slate-800 text-sm font-black truncate">{contact.name}</span>
                  <span className="text-slate-400 text-[10px] font-bold shrink-0 ml-2">{contact.time}</span>
                </div>
                {/* Property tag */}
                <div className="flex items-center gap-1 mb-1">
                  <Building2 className="w-3 h-3 text-slate-300" />
                  <span className="text-[10px] font-bold text-slate-400 truncate">{contact.property.beds}-Bed, {contact.property.location.split(',')[0]}</span>
                </div>
                <p className="text-slate-400 text-[11px] font-medium truncate">{contact.lastMessage}</p>
                {/* Status + unread */}
                <div className="flex items-center justify-between mt-1.5">
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black border ${statusCfg.bg} ${statusCfg.color}`}>
                    <StatusIcon className="w-2.5 h-2.5" />
                    {statusCfg.label}
                  </div>
                  {contact.unread > 0 && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-white text-[9px] font-black">{contact.unread}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );

  // ─── Chat Window ───────────────────────────────────────────────────
  const ChatWindow = () => {
    if (!activeContact) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 p-8">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <MessageCircle className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-slate-800 font-black text-lg mb-1">Transaction Chat</h3>
          <p className="text-slate-400 text-xs font-medium text-center max-w-xs">Select a conversation to start closing deals. Every chat is linked to a specific property.</p>
        </div>
      );
    }

    const tierColors = activeContact.trustTier === 3
      ? 'bg-green-50 text-green-700 border-green-200'
      : activeContact.trustTier === 2
      ? 'bg-blue-50 text-blue-700 border-blue-200'
      : 'bg-amber-50 text-amber-700 border-amber-200';

    return (
      <div className="flex-1 flex flex-col bg-slate-50 h-full min-w-0">
        {/* Chat Header */}
        <div className="bg-white border-b border-slate-100 px-4 lg:px-6 py-3">
          <div className="flex items-center gap-3">
            {/* Back button mobile */}
            <button
              onClick={() => { setShowInbox(true); setSelectedChat(null); }}
              className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Avatar */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-black text-sm">
                {activeContact.initials}
              </div>
              {activeContact.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
              )}
            </div>

            {/* Name + Trust */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-slate-900 font-black text-sm truncate">{activeContact.name}</h3>
                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black border ${tierColors}`}>
                  <ShieldCheck className="w-3 h-3" />
                  Tier {activeContact.trustTier}
                </div>
                {activeContact.lockedFunds && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-green-50 text-green-700 border border-green-200">
                    <Lock className="w-3 h-3" />
                    Funds Locked
                  </div>
                )}
              </div>
              <p className="text-slate-400 text-[10px] font-medium">
                {activeContact.online ? 'Online now' : `Last seen ${activeContact.time}`}
              </p>
            </div>

            {/* Property card toggle */}
            <button
              onClick={() => setShowPropertyCard(!showPropertyCard)}
              className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-bold border transition-all ${
                showPropertyCard ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              {activeContact.property.beds}-Bed, {activeContact.property.location.split(',')[0]}
            </button>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                <Phone className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                <Video className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Smart Action Ribbon */}
          <div className="flex items-center gap-2 mt-3 pb-1 overflow-x-auto scrollbar-hide">
            <button onClick={() => setShowScheduleModal(true)} className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-xl text-blue-700 text-[11px] font-bold transition-all shrink-0">
              <Calendar className="w-3.5 h-3.5" />
              Schedule Inspection
            </button>
            <button onClick={() => setShowOfferModal(true)} className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-100 rounded-xl text-amber-700 text-[11px] font-bold transition-all shrink-0">
              <FileText className="w-3.5 h-3.5" />
              Send Offer / Agreement
            </button>
            <button onClick={() => setShowPaymentModal(true)} className="flex items-center gap-1.5 px-3.5 py-2 bg-green-50 hover:bg-green-100 border border-green-100 rounded-xl text-green-700 text-[11px] font-bold transition-all shrink-0">
              <Wallet className="w-3.5 h-3.5" />
              Request Payment
            </button>
            <button onClick={() => setShowMarketInsight(true)} className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-50 hover:bg-purple-100 border border-purple-100 rounded-xl text-purple-700 text-[11px] font-bold transition-all shrink-0">
              <TrendingUp className="w-3.5 h-3.5" />
              Market Insight
            </button>
          </div>
        </div>

        {/* Property Card Dropdown */}
        <AnimatePresence>
          {showPropertyCard && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white border-b border-slate-100 overflow-hidden"
            >
              <div className="px-6 py-4 flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-slate-200 to-slate-100 flex items-center justify-center shrink-0">
                  <Building2 className="w-8 h-8 text-slate-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-slate-900 font-black text-sm">{activeContact.property.title}</h4>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-black">{activeContact.property.type}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 text-[11px] font-medium mb-2">
                    <MapPin className="w-3 h-3" />
                    {activeContact.property.location}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-primary font-black text-sm">{activeContact.property.price}</span>
                    <div className="flex items-center gap-3 text-slate-400 text-[10px] font-bold">
                      <span className="flex items-center gap-1"><Bed className="w-3 h-3" />{activeContact.property.beds}</span>
                      <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{activeContact.property.baths}</span>
                      <span className="flex items-center gap-1"><Square className="w-3 h-3" />{activeContact.property.sqm}m²</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowPropertyCard(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4 space-y-3">
          {activeMessages.map((msg, i) => {
            // ── System / Inspection Card ──
            if (msg.type === 'inspection-card' && msg.inspectionData) {
              const insp = msg.inspectionData;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center my-4"
                >
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm max-w-sm w-full">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-slate-900 text-xs font-black">Inspection Scheduled</p>
                        <p className="text-slate-400 text-[10px] font-medium">{insp.date} at {insp.time}</p>
                      </div>
                      <div className={`ml-auto px-2 py-0.5 rounded-full text-[9px] font-black ${
                        insp.status === 'upcoming' ? 'bg-blue-50 text-blue-600' :
                        insp.status === 'completed' ? 'bg-green-50 text-green-600' :
                        'bg-red-50 text-red-600'
                      }`}>
                        {insp.status === 'upcoming' ? 'Upcoming' : insp.status === 'completed' ? 'Completed' : 'No Show'}
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl mb-3">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <p className="text-slate-600 text-[11px] font-medium">{insp.address}</p>
                    </div>
                    {insp.status === 'upcoming' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleInspectionAction(selectedChat!, msg.id, 'success')}
                          className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all"
                        >
                          <CircleCheck className="w-3.5 h-3.5" />
                          Seeker Interested
                        </button>
                        <button
                          onClick={() => handleInspectionAction(selectedChat!, msg.id, 'no-show')}
                          className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all"
                        >
                          <CircleX className="w-3.5 h-3.5" />
                          No Show
                        </button>
                      </div>
                    )}
                    {insp.status === 'completed' && (
                      <div className="flex items-center gap-2 p-2.5 bg-green-50 border border-green-100 rounded-xl">
                        <CircleCheck className="w-4 h-4 text-green-500" />
                        <p className="text-green-700 text-[10px] font-bold">Next step: Prepare Sales Agreement</p>
                        <ArrowRight className="w-3 h-3 text-green-500 ml-auto" />
                      </div>
                    )}
                    {insp.status === 'no-show' && (
                      <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-100 rounded-xl">
                        <CircleX className="w-4 h-4 text-red-500" />
                        <p className="text-red-700 text-[10px] font-bold">Lead marked inactive. Follow up recommended.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            }

            // ── AI Nudge ──
            if (msg.type === 'ai-nudge' && msg.nudgeData) {
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center my-3"
                >
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/60 rounded-2xl p-4 max-w-sm w-full">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-blue-800 text-[11px] font-black">Houzii Intelligence</span>
                    </div>
                    <p className="text-blue-700 text-xs font-medium mb-3">{msg.nudgeData.hint}</p>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1 p-2 bg-white/70 rounded-lg text-center">
                        <p className="text-[9px] font-bold text-blue-400 uppercase">Seeker Budget</p>
                        <p className="text-blue-800 text-sm font-black">{msg.nudgeData.budget}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-blue-400" />
                      <div className="flex-1 p-2 bg-white/70 rounded-lg text-center">
                        <p className="text-[9px] font-bold text-blue-400 uppercase">Your Price</p>
                        <p className="text-blue-800 text-sm font-black">{msg.nudgeData.listingPrice}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleSendDiscountOffer}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      {msg.nudgeData.action}
                    </button>
                  </div>
                </motion.div>
              );
            }

            // ── Offer Card ──
            if (msg.type === 'offer-card' && msg.offerData) {
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'} my-3`}
                >
                  <div className="bg-gradient-to-br from-[#0A1128] to-[#142040] rounded-2xl p-4 max-w-[280px] w-full">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="w-4 h-4 text-amber-400" />
                      <span className="text-white text-[11px] font-black">Offer Sent</span>
                      <span className={`ml-auto px-2 py-0.5 rounded-full text-[9px] font-black ${
                        msg.offerData.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                        msg.offerData.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {msg.offerData.status.charAt(0).toUpperCase() + msg.offerData.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-white font-black text-xl">{msg.offerData.amount}</span>
                      <span className="text-slate-500 text-xs line-through">{msg.offerData.original}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-3">
                      <div className="px-2 py-0.5 bg-green-500/20 rounded-full">
                        <span className="text-green-400 text-[10px] font-bold">{msg.offerData.discount} discount</span>
                      </div>
                    </div>
                    <p className="text-slate-400 text-[10px] font-medium">{msg.time}</p>
                  </div>
                </motion.div>
              );
            }

            // ── System message ──
            if (msg.sender === 'system') {
              return (
                <div key={msg.id} className="flex justify-center my-2">
                  <p className="text-slate-400 text-[10px] font-bold bg-white px-4 py-1.5 rounded-full border border-slate-100">{msg.text}</p>
                </div>
              );
            }

            // ── Normal message bubble ──
            const isAgent = msg.sender === 'agent';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] lg:max-w-[60%] px-4 py-3 rounded-2xl ${
                  isAgent
                    ? 'bg-[#6D1D2C] text-white rounded-br-md'
                    : 'bg-white text-slate-800 border border-slate-100 rounded-bl-md shadow-sm'
                }`}>
                  <p className="text-[13px] font-medium">{msg.text}</p>
                  <div className={`flex items-center justify-end gap-1 mt-1 ${isAgent ? 'text-white/50' : 'text-slate-300'}`}>
                    <span className="text-[9px] font-bold">{msg.time}</span>
                    {isAgent && (msg.read ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />)}
                  </div>
                </div>
              </motion.div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <AnimatePresence>
          {showQuickReplies && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="px-4 lg:px-6 pb-2"
            >
              <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span className="text-slate-700 text-[10px] font-black">Smart Replies</span>
                  </div>
                  <button onClick={() => setShowQuickReplies(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-1.5">
                  {QUICK_REPLIES.map((reply, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setMessageInput(reply); setShowQuickReplies(false); }}
                      className="w-full text-left px-3 py-2 text-[11px] font-medium text-slate-600 hover:bg-primary/5 hover:text-primary rounded-lg transition-all"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message Input */}
        <div className="bg-white border-t border-slate-100 px-4 lg:px-6 py-3">
          <div className="flex items-end gap-2">
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                <Paperclip className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                <ImageIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/5 transition-all pr-10"
              />
              <button
                onClick={() => setShowQuickReplies(!showQuickReplies)}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
                  showQuickReplies ? 'text-primary bg-primary/10' : 'text-slate-400 hover:text-primary'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
              </button>
            </div>
            {messageInput.trim() ? (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={handleSend}
                className="p-2.5 bg-[#6D1D2C] hover:bg-[#5a1724] text-white rounded-xl transition-all shrink-0"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            ) : (
              <button className="p-2.5 rounded-xl text-slate-400 hover:bg-slate-100 transition-all shrink-0">
                <Mic className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ─── Main Layout ────────────────────────────────────────────────────
  return (
    <div className="h-[calc(100vh-64px)] lg:h-screen flex overflow-hidden relative">
      <InboxSidebar />
      <ChatWindow />

      {/* ─── Schedule Inspection Modal ─── */}
      <AnimatePresence>
        {showScheduleModal && activeContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setShowScheduleModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-slate-900 font-black text-sm">Schedule Inspection</h3>
                      <p className="text-slate-400 text-[10px] font-medium">for {activeContact.name}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowScheduleModal(false)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-slate-800 text-xs font-bold">{activeContact.property.title}</p>
                    <p className="text-slate-400 text-[10px] font-medium">{activeContact.property.location}</p>
                  </div>
                  <span className="ml-auto text-primary text-xs font-black">{activeContact.property.price}</span>
                </div>
                <div>
                  <label className="text-slate-600 text-[11px] font-bold mb-1.5 block">Date</label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={e => setScheduleDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="text-slate-600 text-[11px] font-bold mb-1.5 block">Time</label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={e => setScheduleTime(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowScheduleModal(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all">Cancel</button>
                  <button onClick={handleScheduleInspection} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all">
                    <Calendar className="w-3.5 h-3.5" />
                    Schedule
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Send Offer Modal ─── */}
      <AnimatePresence>
        {showOfferModal && activeContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setShowOfferModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-slate-900 font-black text-sm">Send Offer</h3>
                      <p className="text-slate-400 text-[10px] font-medium">to {activeContact.name}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowOfferModal(false)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-slate-800 text-xs font-bold">{activeContact.property.title}</p>
                    <p className="text-slate-400 text-[10px] font-medium">{activeContact.property.location}</p>
                  </div>
                  <span className="ml-auto text-primary text-xs font-black">{activeContact.property.price}</span>
                </div>
                <div>
                  <label className="text-slate-600 text-[11px] font-bold mb-1.5 block">Offer Amount (e.g. 4.5M)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">&#8358;</span>
                    <input
                      type="text"
                      value={offerAmount}
                      onChange={e => setOfferAmount(e.target.value)}
                      placeholder="4.5M"
                      className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100"
                    />
                  </div>
                </div>
                {offerAmount && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Percent className="w-3.5 h-3.5 text-amber-600" />
                      <p className="text-amber-700 text-[11px] font-bold">
                        {(() => {
                          const orig = parseFloat(activeContact.property.price.replace(/[^0-9.]/g, ''));
                          const off = parseFloat(offerAmount.replace(/[^0-9.]/g, ''));
                          if (isNaN(off) || orig === 0) return 'Enter a valid amount';
                          const disc = ((orig - off) / orig * 100).toFixed(1);
                          return `${parseFloat(disc) > 0 ? `${disc}% below` : `${Math.abs(parseFloat(disc)).toFixed(1)}% above`} listing price`;
                        })()}
                      </p>
                    </div>
                  </motion.div>
                )}
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowOfferModal(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all">Cancel</button>
                  <button
                    onClick={handleSendOffer}
                    disabled={!offerAmount.trim()}
                    className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-200 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send Offer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Request Payment Modal ─── */}
      <AnimatePresence>
        {showPaymentModal && activeContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setShowPaymentModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-slate-900 font-black text-sm">Request Payment</h3>
                      <p className="text-slate-400 text-[10px] font-medium">via Houzii Escrow</p>
                    </div>
                  </div>
                  <button onClick={() => setShowPaymentModal(false)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-slate-800 text-xs font-bold">{activeContact.property.title}</p>
                    <p className="text-slate-400 text-[10px] font-medium">For {activeContact.name}</p>
                  </div>
                </div>
                <div>
                  <label className="text-slate-600 text-[11px] font-bold mb-2 block">Payment Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {([['deposit', 'Deposit'], ['rent', 'Rent'], ['full', 'Full Payment']] as const).map(([val, label]) => (
                      <button
                        key={val}
                        onClick={() => setPaymentType(val)}
                        className={`py-2.5 px-3 rounded-xl text-[11px] font-bold border transition-all ${
                          paymentType === val
                            ? 'bg-green-50 border-green-200 text-green-700'
                            : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-slate-600 text-[11px] font-bold mb-1.5 block">Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">&#8358;</span>
                    <input
                      type="text"
                      value={paymentAmount}
                      onChange={e => setPaymentAmount(e.target.value)}
                      placeholder="1,500,000"
                      className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-green-300 focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                </div>
                <div className="p-3 bg-green-50 border border-green-100 rounded-xl flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <p className="text-green-700 text-[10px] font-medium">Payment is secured through Houzii Escrow. Funds are held safely until both parties confirm.</p>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowPaymentModal(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all">Cancel</button>
                  <button
                    onClick={handleRequestPayment}
                    disabled={!paymentAmount.trim()}
                    className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-200 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Wallet className="w-3.5 h-3.5" />
                    Request
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Market Insight Modal ─── */}
      <AnimatePresence>
        {showMarketInsight && activeContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setShowMarketInsight(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-slate-900 font-black text-sm">Market Intelligence</h3>
                      <p className="text-slate-400 text-[10px] font-medium">{activeContact.property.location}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowMarketInsight(false)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl">
                  <p className="text-purple-400 text-[9px] font-bold uppercase tracking-wider mb-1">Your Listing Price</p>
                  <p className="text-purple-900 font-black text-2xl mb-1">{activeContact.property.price}</p>
                  <p className="text-purple-600 text-[10px] font-medium">{activeContact.property.title}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-slate-400 text-[9px] font-bold uppercase mb-1">Avg. Area Price</p>
                    <p className="text-slate-900 font-black text-sm">{activeContact.property.type === 'Rental' ? '\u20A64.2M' : '\u20A678M'}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowUpRight className="w-3 h-3 text-green-500" />
                      <span className="text-green-600 text-[9px] font-bold">+8.3% YoY</span>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-slate-400 text-[9px] font-bold uppercase mb-1">Demand Index</p>
                    <p className="text-slate-900 font-black text-sm">High</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Flame className="w-3 h-3 text-red-500" />
                      <span className="text-red-600 text-[9px] font-bold">Top 15% area</span>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-slate-400 text-[9px] font-bold uppercase mb-1">Avg. Days on Market</p>
                    <p className="text-slate-900 font-black text-sm">23 days</p>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowDownRight className="w-3 h-3 text-green-500" />
                      <span className="text-green-600 text-[9px] font-bold">-5 days vs avg</span>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-slate-400 text-[9px] font-bold uppercase mb-1">Similar Listings</p>
                    <p className="text-slate-900 font-black text-sm">14 active</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Users className="w-3 h-3 text-blue-500" />
                      <span className="text-blue-600 text-[9px] font-bold">Moderate competition</span>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 rounded-xl">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-blue-800 text-[10px] font-black">Houzii Insight</span>
                  </div>
                  <p className="text-blue-700 text-[11px] font-medium">
                    Your listing is priced {activeContact.property.type === 'Rental' ? '14% above' : '9% above'} the area average.
                    Based on current demand, a 5-7% reduction could attract 3x more inquiries within the first week.
                  </p>
                </div>
                <button onClick={() => setShowMarketInsight(false)} className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all">
                  Got it
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};