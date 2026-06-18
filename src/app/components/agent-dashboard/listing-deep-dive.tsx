import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import {
  ChevronLeft, Briefcase, MapPin, Heart, Check, Clock,
  FileText, MessageSquare, Upload, Edit3, Send, Calendar,
  DollarSign, Home, CheckCircle, AlertCircle, Trash2, PenTool,
  Type as TypeIcon, Image as ImageIcon, Shield, Mail, Phone,
  Eye, Activity, X, BookOpen, ArrowRight, Bookmark, Lock, ShieldCheck,
  Download, Wallet, Building2, Users, PenLine
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export type DealStage = 'agreement' | 'vetting' | 'payment' | 'lease-signing' | 'handover' | 'payout';
type LeaseMode = 'digital' | 'manual' | null;
type SignatureMode = 'type' | 'draw' | 'upload';

interface Applicant {
  id: number;
  name: string;
  avatar: string;
  profession: string;
  employer: string;
  workAddress: string;
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  matchScore: number;
  email: string;
  phone: string;
  verified: boolean;
}

interface Comment {
  id: number;
  author: 'agent' | 'seeker';
  text: string;
  timestamp: string;
  resolved: boolean;
  clause: string;
}

export interface Listing {
  id: number;
  title: string;
  location: string;
  price: string;
  image: string;
  beds: number;
  baths: number;
  views: number;
  inquiries: number;
  dealStage?: DealStage;
}

interface CommandCenterProps {
  listing: Listing;
  onBack: () => void;
}

const mockApplicants: Applicant[] = [
  {
    id: 1,
    name: 'Adaeze Okonkwo',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    profession: 'Software Engineer',
    employer: 'Andela',
    workAddress: 'Plot 54, Ademola Adetokunbo Crescent, Victoria Island',
    maritalStatus: 'Single',
    matchScore: 94,
    email: 'adaeze.okonkwo@email.com',
    phone: '+234 801 234 5678',
    verified: true,
  },
  {
    id: 2,
    name: 'Chukwudi Eze',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    profession: 'Investment Banker',
    employer: 'GTBank',
    workAddress: 'GTBank Tower, Plot 635 Akin Adesola Street, VI',
    maritalStatus: 'Married',
    matchScore: 87,
    email: 'c.eze@email.com',
    phone: '+234 802 345 6789',
    verified: true,
  },
  {
    id: 3,
    name: 'Fatima Mohammed',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    profession: 'Doctor',
    employer: 'Lagos University Teaching Hospital',
    workAddress: 'Idi-Araba, Lagos',
    maritalStatus: 'Single',
    matchScore: 82,
    email: 'f.mohammed@email.com',
    phone: '+234 803 456 7890',
    verified: false,
  },
];

const STAGES: { id: DealStage; label: string; short: string }[] = [
  { id: 'agreement',    label: 'Lease Agreement',   short: 'Agreement' },
  { id: 'vetting',      label: 'Applicant Vetting', short: 'Vetting'   },
  { id: 'payment',      label: 'Payment & Escrow',  short: 'Payment'   },
  { id: 'lease-signing',label: 'Lease Signing',     short: 'Signing'   },
  { id: 'handover',     label: 'Handover',           short: 'Handover'  },
  { id: 'payout',       label: 'Agent Payout',       short: 'Payout'    },
];

const EditSectionHeader = ({ num, title, editCount }: { num: number; title: string; editCount: number }) => (
  <div className="flex items-center gap-3 px-6 pt-3 pb-2">
    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black flex items-center justify-center shrink-0">{num}</span>
    <span className="text-xs font-black text-slate-700 uppercase tracking-wider">{title}</span>
    {editCount > 0 ? (
      <span className="ml-auto text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">{editCount} editable</span>
    ) : (
      <span className="ml-auto flex items-center gap-1 text-[10px] font-bold text-slate-300"><Lock className="w-2.5 h-2.5" /> locked</span>
    )}
  </div>
);

const EditLockedRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center gap-3 mx-6 px-4 py-2.5 bg-slate-50 rounded-xl mb-1.5">
    <span className="text-[11px] font-bold text-slate-400 w-36 shrink-0">{label}</span>
    <span className="text-[11px] font-bold text-slate-500 flex-1 truncate">{value}</span>
    <Lock className="w-3 h-3 text-slate-300 shrink-0" />
  </div>
);

const EditableRow = ({ label, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) => (
  <div className="mx-6 mb-1.5">
    <div className="border border-[#7B2D42]/25 bg-[#7B2D42]/[0.03] rounded-xl px-4 py-2.5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-black text-[#7B2D42] uppercase tracking-wide">{label}</span>
        <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> editable</span>
      </div>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} className="w-full text-sm font-bold text-slate-800 bg-transparent focus:outline-none resize-none" />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)} className="w-full text-sm font-bold text-slate-800 bg-transparent focus:outline-none" />
      )}
    </div>
  </div>
);

export const ListingCommandCenter: React.FC<CommandCenterProps> = ({ listing, onBack }) => {
  const initialStage: DealStage = listing.dealStage || 'agreement';
  const preAccepted = initialStage !== 'agreement' && initialStage !== 'vetting';

  const [currentStage, setCurrentStage] = useState<DealStage>(initialStage);
  const [viewingStage, setViewingStage] = useState<DealStage>(initialStage);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [acceptedApplicants, setAcceptedApplicants] = useState<Applicant[]>(
    preAccepted ? [mockApplicants[0]] : []
  );
  const [lockedApplicant, setLockedApplicant] = useState<Applicant | null>(
    preAccepted ? mockApplicants[0] : null
  );
  const [leaseReviewStatus, setLeaseReviewStatus] = useState<Record<number, 'pending' | 'viewed' | 'accepted' | 'declined'>>(
    preAccepted ? { [mockApplicants[0].id]: 'accepted' } : {}
  );
  const [applicantSigned, setApplicantSigned] = useState(preAccepted);
  const [agentHandoverConfirmed, setAgentHandoverConfirmed] = useState(false);
  const [tenantConfirmed, setTenantConfirmed] = useState(false);
  const [leaseMode, setLeaseMode] = useState<LeaseMode>(preAccepted ? 'digital' : null);
  const [uploadedLease, setUploadedLease] = useState<{name: string, size: string} | null>(
    preAccepted ? { name: 'Lagos_Tenancy_Agreement_Draft.pdf', size: '2.4 MB' } : null
  );
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [selectedClause, setSelectedClause] = useState<string | null>(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureMode, setSignatureMode] = useState<SignatureMode>('type');
  const [signatureName, setSignatureName] = useState('');
  const [agentSigned, setAgentSigned] = useState(preAccepted);
  const [leaseSent, setLeaseSent] = useState(preAccepted);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showAgreementPreviewModal, setShowAgreementPreviewModal] = useState(false);
  const [applicantToApprove, setApplicantToApprove] = useState<Applicant | null>(null);
  const [showDelistModal, setShowDelistModal] = useState(false);
  const [delistReason, setDelistReason] = useState('');
  const [delistOther, setDelistOther] = useState('');
  const [delistConfirmed, setDelistConfirmed] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [draftSchedule, setDraftSchedule] = useState<Record<string, { from: string; to: string }>>({});
  const [savedSchedule, setSavedSchedule] = useState<Record<string, { from: string; to: string }>>({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [editView, setEditView] = useState<'all' | 'editable'>('all');
  const [editPrice, setEditPrice] = useState(listing.price);
  const [editServiceCharge, setEditServiceCharge] = useState('₦150,000/yr');
  const [editCommission, setEditCommission] = useState('5%');
  const [editLegalFees, setEditLegalFees] = useState('₦50,000');
  const [editCautionDeposit, setEditCautionDeposit] = useState('₦450,000');
  const [editDescription, setEditDescription] = useState('Spacious and well-maintained property in a prime location. Features modern finishes throughout, 24/7 security, and ample parking space. Located within a serene gated estate.');
  const [editAmendment, setEditAmendment] = useState('');
  const [handoverDate, setHandoverDate] = useState<string | null>(null);
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  const currentStageIndex = STAGES.findIndex(s => s.id === currentStage);
  const viewingStageIndex = STAGES.findIndex(s => s.id === viewingStage);
  const isAuditMode = viewingStage !== currentStage;

  const handleStageClick = (stage: DealStage, index: number) => {
    if (index <= currentStageIndex) setViewingStage(stage);
  };

  const handleAcceptApplicant = (applicant: Applicant) => {
    if (acceptedApplicants.some(a => a.id === applicant.id)) {
      setAcceptedApplicants(prev => prev.filter(a => a.id !== applicant.id));
      setSelectedApplicant(null);
      toast.info(`Removed ${applicant.name} from approved applicants.`);
    } else {
      setApplicantToApprove(applicant);
      setSelectedApplicant(null);
      setShowApprovalModal(true);
    }
  };

  const handleSendLeaseToAll = () => {
    const status: Record<number, 'pending' | 'viewed' | 'accepted' | 'declined'> = {};
    acceptedApplicants.forEach((a, i) => {
      status[a.id] = i === 0 ? 'accepted' : i === 1 ? 'viewed' : 'pending';
    });
    setLeaseReviewStatus(status);
    setLeaseSent(true);
  };

  const allCommentsResolved = comments.length === 0 || comments.every(c => c.resolved);

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedClause) return;
    setComments(prev => [...prev, {
      id: Date.now(), author: 'agent', text: newComment,
      timestamp: new Date().toISOString(), resolved: false, clause: selectedClause,
    }]);
    setNewComment('');
  };

  const handleAcknowledgePayment = () => {
    const payer = acceptedApplicants.find(a => leaseReviewStatus[a.id] === 'accepted') || acceptedApplicants[0];
    setLockedApplicant(payer ?? null);
    setCurrentStage('lease-signing');
    setViewingStage('lease-signing');
  };

  const handleProceedToHandover = () => {
    setCurrentStage('handover');
    setViewingStage('handover');
  };

  const handleAcceptHandover = () => setHandoverDate('Saturday, May 3rd, 2026 at 10:00 AM');

  const handleAgentConfirmHandover = () => {
    setAgentHandoverConfirmed(true);
    setCurrentStage('payout');
    setViewingStage('payout');
    setShowPayoutModal(false);
  };

  const tenantName = lockedApplicant?.name || acceptedApplicants[0]?.name || 'Adaeze Okonkwo';

  const leaseContent = [
    { clause: '1. PARTIES', text: `This Agreement is entered into between the Landlord, represented by Agent Joy Adeyemi ("the Agent") and the Tenant, ${tenantName} ("the Tenant").` },
    { clause: '2. PROPERTY', text: `The premises known as ${listing.title}, located at ${listing.location}, Lagos.` },
    { clause: '3. TERM', text: 'The tenancy shall commence from the date of execution and shall be for a period of twelve (12) calendar months.' },
    { clause: '4. RENT', text: `This annual rent shall be ${listing.price}; payable monthly on or before the 5th day of each month.` },
    { clause: '5. CAUTION DEPOSIT', text: 'A caution deposit shall be paid and held in escrow, refundable within 30 days of lease termination subject to satisfactory property inspection.' },
    { clause: '6. USE OF PREMISES', text: 'The premises shall be used solely for residential purposes. No commercial or business activity is permitted.' },
  ];

  const activityLog = [
    { icon: Eye, text: `${tenantName.split(' ')[0]} viewed lease agreement`, time: '2 hours ago', color: 'text-blue-600 bg-blue-50' },
    { icon: Send, text: `Lease sent to ${acceptedApplicants.length || 1} accepted applicant(s)`, time: '4 hours ago', color: 'text-green-600 bg-green-50' },
    { icon: CheckCircle, text: `Payment received — deal locked for ${tenantName.split(' ')[0]}`, time: '6 hours ago', color: 'text-primary bg-primary/10' },
    { icon: FileText, text: `${mockApplicants.length} applicants reviewed & vetted`, time: '8 hours ago', color: 'text-slate-600 bg-slate-100' },
  ];

  return (
    <div className="min-h-full bg-slate-50">

      {/* ── Delist Success Toast ── */}
      <AnimatePresence>
        {delistConfirmed && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-white/10 max-w-sm w-full mx-4"
          >
            <span className="w-7 h-7 rounded-full bg-red-500/20 border border-red-400/30 flex items-center justify-center shrink-0">
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black leading-snug">Listing removed</p>
              <p className="text-white/50 text-xs font-medium mt-0.5 truncate">"{listing.title}" has been delisted and is no longer visible to seekers.</p>
            </div>
            <button onClick={() => setDelistConfirmed(false)} className="shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-3.5 h-3.5 text-white/40" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Command Header (dark, non-sticky) ── */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-6 pt-6 pb-6">
        {/* Back + Actions row */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-bold">Back to All Listings</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Edit — labelled primary action + modal */}
            <>
              <button
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 border border-white/20 text-white rounded-lg text-xs font-bold transition-colors backdrop-blur-sm"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>

              <AnimatePresence>
                {showEditModal && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
                    onClick={e => { if (e.target === e.currentTarget) setShowEditModal(false); }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 40 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white w-full sm:max-w-xl rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col"
                    >
                      {/* ── Header ── */}
                      <div className="px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h2 className="text-slate-900 font-black text-lg">Listing Details</h2>
                            <p className="text-slate-400 text-sm mt-0.5">Review everything you submitted. Editable fields are highlighted.</p>
                          </div>
                          <button onClick={() => setShowEditModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors ml-3 shrink-0">
                            <X className="w-4 h-4 text-slate-400" />
                          </button>
                        </div>
                        {/* View toggle */}
                        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                          {(['all', 'editable'] as const).map(v => (
                            <button
                              key={v}
                              onClick={() => setEditView(v)}
                              className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all ${
                                editView === v ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                              }`}
                            >
                              {v === 'all' ? 'All Details' : '✏️ Editable Only'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* ── Scrollable body ── */}
                      <div className="overflow-y-auto flex-1 py-4 space-y-1">

                        {/* ── Step 1: Listing Basics ── */}
                        {editView === 'all' && (
                          <div>
                            <EditSectionHeader num={1} title="Listing Basics" editCount={0} />
                            <EditLockedRow label="Property Title" value={listing.title} />
                            <EditLockedRow label="Listing Type" value="For Rent" />
                            <EditLockedRow label="Property Type" value="Apartment" />
                            <EditLockedRow label="Listing ID" value={`#HZ-${String(listing.id).padStart(5, '0')}`} />
                          </div>
                        )}

                        {/* ── Step 2: Location ── */}
                        {editView === 'all' && (
                          <div>
                            <EditSectionHeader num={2} title="Location" editCount={0} />
                            <EditLockedRow label="Full Address" value={listing.location} />
                            <EditLockedRow label="State" value="Lagos" />
                            <EditLockedRow label="LGA / Area" value="Eti-Osa LGA" />
                            <EditLockedRow label="Nearest Landmark" value="Lekki Phase 1 Roundabout" />
                          </div>
                        )}

                        {/* ── Step 3: Pricing & Fees ── */}
                        <div>
                          <EditSectionHeader num={3} title="Pricing & Fees" editCount={5} />
                          <EditableRow label="Annual Rent" value={editPrice} onChange={setEditPrice} />
                          <EditableRow label="Service Charge" value={editServiceCharge} onChange={setEditServiceCharge} />
                          <EditableRow label="Agent Commission" value={editCommission} onChange={setEditCommission} />
                          <EditableRow label="Legal Fees" value={editLegalFees} onChange={setEditLegalFees} />
                          <EditableRow label="Caution Deposit" value={editCautionDeposit} onChange={setEditCautionDeposit} />
                        </div>

                        {/* ── Step 4: Property Features ── */}
                        {editView === 'all' && (
                          <div>
                            <EditSectionHeader num={4} title="Property Features" editCount={0} />
                            <EditLockedRow label="Bedrooms" value={`${listing.beds}`} />
                            <EditLockedRow label="Bathrooms" value={`${listing.baths}`} />
                            <EditLockedRow label="Toilets" value="4" />
                            <EditLockedRow label="Total Size" value="180 sqm" />
                            <EditLockedRow label="Parking Spaces" value="2" />
                            <EditLockedRow label="Furnishing" value="Semi-Furnished" />
                            <EditLockedRow label="Floor Level" value="3rd Floor" />
                          </div>
                        )}

                        {/* ── Step 5: Amenities ── */}
                        {editView === 'all' && (
                          <div>
                            <EditSectionHeader num={5} title="Amenities" editCount={0} />
                            <div className="mx-6 flex flex-wrap gap-2 pb-2">
                              {['Swimming Pool', '24/7 Security', 'Gym', 'CCTV', 'Generator', 'Water Supply', 'Gated Estate', 'Parking', 'Internet Ready', 'Air Conditioning'].map(a => (
                                <span key={a} className="flex items-center gap-1 px-3 py-1 bg-slate-100 rounded-full text-[11px] font-bold text-slate-500">
                                  <Check className="w-2.5 h-2.5 text-slate-400" />{a}
                                </span>
                              ))}
                              <span className="flex items-center gap-1 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[11px] font-bold text-slate-300">
                                <Lock className="w-2.5 h-2.5" /> locked
                              </span>
                            </div>
                          </div>
                        )}

                        {/* ── Step 6: Description ── */}
                        <div>
                          <EditSectionHeader num={6} title="Property Description" editCount={1} />
                          <EditableRow label="Description" value={editDescription} onChange={setEditDescription} multiline />
                        </div>

                        {/* ── Step 7: Landlord Details ── */}
                        {editView === 'all' && (
                          <div>
                            <EditSectionHeader num={7} title="Landlord / Owner Details" editCount={0} />
                            <EditLockedRow label="Full Name" value="Mr. Emeka Okafor" />
                            <EditLockedRow label="Phone" value="+234 801 234 5678" />
                            <EditLockedRow label="Email" value="e.okafor@email.com" />
                            <EditLockedRow label="Bank" value="First Bank Nigeria" />
                            <EditLockedRow label="Account Number" value="••• ••• 4521" />
                          </div>
                        )}

                        {/* ── Amendment Note ── */}
                        <div className="px-6 pt-3 pb-2">
                          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                            <label className="text-[10px] font-black text-amber-700 uppercase tracking-wide mb-1 block">Amendment Note — optional</label>
                            <p className="text-[11px] text-amber-600/70 mb-2">Briefly describe what you changed and why. This gets logged on the listing record.</p>
                            <textarea
                              value={editAmendment}
                              onChange={e => setEditAmendment(e.target.value)}
                              rows={2}
                              placeholder="e.g. Price adjusted to reflect current market rates…"
                              className="w-full text-sm text-slate-700 placeholder:text-amber-300 bg-transparent focus:outline-none resize-none"
                            />
                          </div>
                        </div>

                        {editView === 'all' && (
                          <p className="text-[10px] text-slate-400 text-center pb-2">
                            Need to update a locked field? <span className="text-[#7B2D42] font-bold">Contact Houzii support</span>
                          </p>
                        )}
                      </div>

                      {/* ── Footer ── */}
                      <div className="px-6 pb-6 pt-4 flex items-center gap-3 border-t border-slate-100 shrink-0">
                        <button
                          onClick={() => setShowEditModal(false)}
                          className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => setShowEditModal(false)}
                          className="flex-1 py-2.5 rounded-xl bg-[#7B2D42] text-white text-sm font-bold hover:bg-[#6a2538] transition-colors"
                        >
                          Save Changes
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>

            {/* Set Inspection Calendar — icon with tooltip + modal */}
            <div className="relative group/cal">
              <button
                onClick={() => { setDraftSchedule({ ...savedSchedule }); setShowCalendarModal(true); }}
                className={`p-1.5 border rounded-lg transition-colors backdrop-blur-sm ${
                  Object.keys(savedSchedule).length > 0
                    ? 'bg-amber-400/20 border-amber-400/30 text-amber-300'
                    : 'bg-white/10 hover:bg-white/20 border-white/15 text-white/70 hover:text-white'
                }`}
              >
                <Calendar className="w-4 h-4" />
              </button>
              <span className="absolute right-0 top-full mt-1.5 whitespace-nowrap bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover/cal:opacity-100 transition-opacity pointer-events-none z-10 border border-white/10">
                {Object.keys(savedSchedule).length > 0 ? 'Edit Schedule' : 'Set Inspection Calendar'}
              </span>

              {/* Calendar Availability Modal */}
              <AnimatePresence>
                {showCalendarModal && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={e => { if (e.target === e.currentTarget) setShowCalendarModal(false); }}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 16 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 16 }}
                      transition={{ duration: 0.18 }}
                      className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                    >
                      {/* Modal header */}
                      <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-slate-100">
                        <div>
                          <h2 className="text-slate-900 font-black text-lg">Inspection Availability</h2>
                          <p className="text-slate-400 text-sm mt-0.5">Set the days and hours clients can book inspections</p>
                        </div>
                        <button onClick={() => setShowCalendarModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors ml-3 shrink-0">
                          <X className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>

                      {/* Day toggles */}
                      <div className="px-6 pt-5 pb-3">
                        <div className="flex items-baseline justify-between mb-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Days</p>
                          <p className="text-[10px] text-[#7B2D42] font-bold">Tap to select — pick as many as you need</p>
                        </div>
                        <div className="flex gap-2 flex-wrap mt-3">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                            const active = !!draftSchedule[day];
                            return (
                              <button
                                key={day}
                                onClick={() => setDraftSchedule(prev => {
                                  const next = { ...prev };
                                  if (next[day]) { delete next[day]; } else { next[day] = { from: '9:00 AM', to: '5:00 PM' }; }
                                  return next;
                                })}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all border ${
                                  active
                                    ? 'bg-[#7B2D42]/10 text-[#7B2D42] border-[#7B2D42]/30'
                                    : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-200 hover:text-slate-600'
                                }`}
                              >
                                <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all shrink-0 ${
                                  active ? 'bg-[#7B2D42] border-[#7B2D42]' : 'border-slate-300'
                                }`}>
                                  {active && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                                </span>
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Time ranges per active day */}
                      <div className="px-6 pb-2 max-h-56 overflow-y-auto">
                        {Object.keys(draftSchedule).length === 0 ? (
                          <p className="text-slate-300 text-sm text-center py-5">Select one or more days above to set your available hours</p>
                        ) : (
                          <div className="space-y-2 pt-1 pb-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Available Hours</p>
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].filter(d => !!draftSchedule[d]).map(day => {
                              const DAY_FULL: Record<string, string> = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday' };
                              const TIMES = ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'];
                              return (
                                <div key={day} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
                                  <span className="text-xs font-black text-slate-700 w-20 shrink-0">{DAY_FULL[day]}</span>
                                  <select
                                    value={draftSchedule[day].from}
                                    onChange={e => setDraftSchedule(prev => ({ ...prev, [day]: { ...prev[day], from: e.target.value } }))}
                                    className="flex-1 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#7B2D42]"
                                  >
                                    {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                                  </select>
                                  <span className="text-xs text-slate-400 font-bold shrink-0">to</span>
                                  <select
                                    value={draftSchedule[day].to}
                                    onChange={e => setDraftSchedule(prev => ({ ...prev, [day]: { ...prev[day], to: e.target.value } }))}
                                    className="flex-1 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#7B2D42]"
                                  >
                                    {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                                  </select>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="px-6 pb-6 pt-4 flex items-center gap-3 border-t border-slate-100">
                        <button
                          onClick={() => setShowCalendarModal(false)}
                          className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          disabled={Object.keys(draftSchedule).length === 0}
                          onClick={() => { setSavedSchedule(draftSchedule); setShowCalendarModal(false); }}
                          className="flex-1 py-2.5 rounded-xl bg-[#7B2D42] text-white text-sm font-bold hover:bg-[#6a2538] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Save Schedule
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Delist — icon with tooltip, destructive tint */}
            <div className="relative group/del">
              <button
                onClick={() => { setDelistReason(''); setDelistOther(''); setShowDelistModal(true); }}
                className="p-1.5 bg-red-500/10 hover:bg-red-500/25 border border-red-400/20 text-red-300 hover:text-red-200 rounded-lg transition-colors backdrop-blur-sm"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <span className="absolute right-0 top-full mt-1.5 whitespace-nowrap bg-slate-900 text-red-300 text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover/del:opacity-100 transition-opacity pointer-events-none z-10 border border-red-400/20">
                Delist Property
              </span>
            </div>

            {/* ── Delist Confirmation Modal ── */}
            <AnimatePresence>
              {showDelistModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                  onClick={e => { if (e.target === e.currentTarget) setShowDelistModal(false); }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 16 }}
                    transition={{ duration: 0.18 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                  >
                    {/* Modal header */}
                    <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-slate-100">
                      <div>
                        <h2 className="text-slate-900 font-black text-lg">Remove This Listing</h2>
                        <p className="text-slate-400 text-sm mt-0.5">Help us keep records accurate — what's the reason?</p>
                      </div>
                      <button onClick={() => setShowDelistModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors ml-3 shrink-0">
                        <X className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>

                    {/* Reason options */}
                    <div className="px-6 py-4 space-y-2">
                      {[
                        { id: 'rented_on',      label: 'Rented through Houzii',           sub: 'A tenant was found via the platform' },
                        { id: 'rented_off',     label: 'Rented or sold outside platform', sub: 'Deal was closed off-platform' },
                        { id: 'unavailable',    label: 'Property no longer available',    sub: 'Withdrawn from market indefinitely' },
                        { id: 'incorrect_info', label: 'Incorrect listing information',   sub: 'Listed in error or with wrong details' },
                        { id: 'other',          label: 'Other',                           sub: 'Tell us more below' },
                      ].map(opt => opt.id === 'rented_on' ? null : (
                        <button
                          key={opt.id}
                          onClick={() => setDelistReason(opt.id)}
                          className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                            delistReason === opt.id
                              ? 'border-red-400 bg-red-50'
                              : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <span className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                            delistReason === opt.id ? 'border-red-500 bg-red-500' : 'border-slate-300'
                          }`}>
                            {delistReason === opt.id && <span className="w-1.5 h-1.5 rounded-full bg-white block" />}
                          </span>
                          <div>
                            <p className={`text-sm font-bold ${delistReason === opt.id ? 'text-red-700' : 'text-slate-800'}`}>{opt.label}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{opt.sub}</p>
                          </div>
                        </button>
                      ))}

                      {/* Other textarea */}
                      <AnimatePresence>
                        {delistReason === 'other' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <textarea
                              value={delistOther}
                              onChange={e => setDelistOther(e.target.value)}
                              placeholder="Briefly describe why you're removing this listing…"
                              rows={3}
                              className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-red-400 focus:outline-none text-sm text-slate-800 placeholder:text-slate-300 resize-none"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Actions */}
                    <div className="px-6 pb-6 flex items-center gap-3">
                      <button
                        onClick={() => setShowDelistModal(false)}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        disabled={!delistReason || (delistReason === 'other' && !delistOther.trim())}
                        onClick={() => {
                          setShowDelistModal(false);
                          setDelistConfirmed(true);
                          setTimeout(() => setDelistConfirmed(false), 5000);
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Confirm Removal
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Approve Applicants Confirmation Modal ── */}
            <AnimatePresence>
              {showApprovalModal && applicantToApprove && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                  onClick={e => {
                    if (e.target === e.currentTarget) {
                      setShowApprovalModal(false);
                      setSelectedApplicant(applicantToApprove);
                    }
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 16 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col"
                  >
                    {/* Modal header with Maroon brand accent */}
                    <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-[#1E3A5F] px-6 py-5 flex items-center justify-between border-b border-slate-800">
                      <div>
                        <h2 className="text-white font-black text-lg m-0 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                          Approve applicant
                        </h2>
                        <p className="text-slate-400 text-xs mt-0.5 font-medium">Proceed with launching tenancy draft offer</p>
                      </div>
                      <button 
                        onClick={() => {
                          setShowApprovalModal(false);
                          setSelectedApplicant(applicantToApprove);
                        }} 
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
                      {/* Candidate badge */}
                      <div className="flex items-center gap-4 p-4 bg-[#1E3A5F]/5 border border-[#1E3A5F]/10 rounded-2xl">
                        <img src={applicantToApprove.avatar} alt="" className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-md shrink-0" />
                        <div>
                          <p className="text-primary font-black text-[10px] uppercase tracking-wider mb-0.5">Approved Candidate</p>
                          <p className="text-slate-900 font-extrabold text-base leading-tight mb-1">{applicantToApprove.name}</p>
                          <p className="text-slate-500 text-xs font-semibold">{applicantToApprove.profession} · Match: {applicantToApprove.matchScore}%</p>
                        </div>
                      </div>

                      {/* Timeline Sequence visual flow */}
                      <div className="space-y-4">
                        <p className="font-extrabold text-[#1E3A5F] text-xs uppercase tracking-wider mb-1">Tenancy Sequence Pipeline</p>
                        
                        <div className="relative pl-6 space-y-5">
                          {/* Dot line connector */}
                          <div className="absolute left-[3px] top-2 bottom-2 w-[1px] bg-slate-200 border-l border-dashed border-slate-300" />

                          {/* Step 1 */}
                          <div className="relative">
                            <div className="absolute -left-[27px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-blue-50" />
                            <div>
                              <h4 className="font-black text-slate-800 text-xs tracking-wide uppercase mb-0.5">1. Lease Offer Dispatch & Review</h4>
                              <p className="text-slate-500 text-[11px] font-semibold leading-relaxed">
                                The pre-filled tenancy lease draft will be delivered to <strong>{applicantToApprove.name}</strong> instantly. They can view, read, and accept or decline/negotiate.
                              </p>
                            </div>
                          </div>

                          {/* Step 2 */}
                          <div className="relative">
                            <div className="absolute -left-[27px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-amber-50" />
                            <div>
                              <h4 className="font-black text-slate-800 text-xs tracking-wide uppercase mb-0.5">2. Ready for Rent Payment</h4>
                              <p className="text-slate-500 text-[11px] font-semibold leading-relaxed">
                                Once terms are accepted, they status updates to **Ready for Payment**. Rent must be cleared via Houzii Escrow first for any signature permissions.
                              </p>
                            </div>
                          </div>

                          {/* Step 3 */}
                          <div className="relative">
                            <div className="absolute -left-[27px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-55" />
                            <div>
                              <h4 className="font-black text-slate-800 text-xs tracking-wide uppercase mb-0.5">3. First-to-Pay Sign & Lock</h4>
                              <p className="text-slate-500 text-[11px] font-semibold leading-relaxed">
                                <strong>Agreement is not signed until payment is made.</strong> Only the fastest applicant to settle payment unlocks co-signing capability, locking the property.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Lease Draft Preview Link */}
                      <button
                        onClick={() => setShowAgreementPreviewModal(true)}
                        className="w-full py-3 bg-slate-50 hover:bg-[#1E3A5F]/5 text-slate-700 text-xs font-black rounded-2xl border border-dashed border-slate-200 hover:border-[#1E3A5F]/20 transition-all flex items-center justify-center gap-2"
                      >
                        <FileText className="w-4 h-4 text-[#1E3A5F]" /> Preview Prepared Lease Agreement Draft
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="px-6 pb-6 pt-2 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
                      <button
                        onClick={() => {
                          setShowApprovalModal(false);
                          setSelectedApplicant(applicantToApprove);
                        }}
                        className="flex-1 py-3.5 rounded-2xl border border-slate-200 text-slate-600 text-xs font-black hover:bg-slate-100 transition-colors"
                      >
                        Back to Profile
                      </button>
                      <button
                        onClick={() => {
                          setAcceptedApplicants(prev => {
                            if (prev.some(a => a.id === applicantToApprove.id)) return prev;
                            return [...prev, applicantToApprove];
                          });
                          toast.success(`Success! Approved ${applicantToApprove.name} and sent contract offer.`);
                          setShowApprovalModal(false);
                          setApplicantToApprove(null);
                          setSelectedApplicant(null);
                        }}
                        className="flex-1 py-3.5 rounded-2xl bg-emerald-600 text-white text-xs font-black hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-200"
                      >
                        <CheckCircle className="w-4 h-4" /> Approve & Dispatch
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Property Snapshot */}
        <div className="flex items-start gap-4 mb-5">
          <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-white/10 shadow-xl">
            <ImageWithFallback src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-white font-black text-xl leading-tight mb-1">{listing.title}</h1>
            <p className="text-white/60 text-sm font-medium flex items-center gap-1.5 mb-2">
              <MapPin className="w-3.5 h-3.5 shrink-0" /> {listing.location}
            </p>
            <p className="text-amber-300 font-black text-xl">{listing.price}</p>

            {/* Saved availability chips */}
            {Object.keys(savedSchedule).length > 0 && (
              <div className="flex items-start gap-1.5 mt-2.5">
                <Calendar className="w-3 h-3 text-white/40 mt-0.5 shrink-0" />
                <div className="flex flex-wrap gap-1">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].filter(d => savedSchedule[d]).map(d => (
                    <span key={d} className="text-[10px] font-black text-white/80 bg-white/10 border border-white/10 px-2 py-0.5 rounded-full">
                      {d} <span className="text-white/40 font-medium">{savedSchedule[d].from}–{savedSchedule[d].to}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Stats Bar */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Eye,         label: 'Total Views',   value: listing.views.toLocaleString() },
            { icon: Bookmark,    label: 'Total Saves',   value: Math.floor(listing.views * 0.38).toLocaleString() },
            { icon: MessageSquare, label: 'Inquiries',   value: listing.inquiries.toLocaleString() },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center gap-3 border border-white/10">
                <Icon className="w-4 h-4 text-white/60 shrink-0" />
                <div>
                  <p className="text-white font-black text-lg leading-none">{stat.value}</p>
                  <p className="text-white/50 text-[10px] font-bold mt-0.5">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Stage Tracker (sticky) ── */}
      <div className="sticky top-0 bg-white border-b border-slate-200 z-10 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center max-w-4xl mx-auto">
            {STAGES.map((stage, index) => (
              <React.Fragment key={stage.id}>
                <button
                  onClick={() => handleStageClick(stage.id, index)}
                  disabled={index > currentStageIndex}
                  className={`flex flex-col items-center gap-1.5 min-w-[60px] transition-all ${
                    index <= currentStageIndex ? 'cursor-pointer' : 'cursor-not-allowed opacity-35'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all border-2 ${
                    viewingStage === stage.id
                      ? isAuditMode
                        ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-400/40'
                        : 'bg-primary border-primary text-white shadow-lg shadow-primary/30'
                      : index < currentStageIndex
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : index === currentStageIndex
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-slate-100 border-slate-200 text-slate-400'
                  }`}>
                    {index < currentStageIndex
                      ? <Check className="w-4 h-4" />
                      : index + 1
                    }
                  </div>
                  <span className={`text-[10px] font-black whitespace-nowrap ${
                    viewingStage === stage.id
                      ? isAuditMode ? 'text-amber-600' : 'text-primary'
                      : index < currentStageIndex
                      ? 'text-emerald-600'
                      : index === currentStageIndex
                      ? 'text-slate-600'
                      : 'text-slate-300'
                  }`}>
                    {stage.short}
                  </span>
                </button>
                {index < STAGES.length - 1 && (
                  <div className={`h-0.5 flex-1 -mt-5 mx-1.5 rounded-full transition-all ${
                    index < currentStageIndex ? 'bg-emerald-400' : 'bg-slate-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stage Workspace ── */}
      <div className="px-6 py-6 max-w-6xl mx-auto">

        {/* Audit Banner */}
        <AnimatePresence>
          {isAuditMode && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-5 flex items-center justify-between px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-amber-600 shrink-0" />
                <p className="text-amber-800 text-sm font-bold">
                  Audit View — <span className="font-black">{STAGES.find(s => s.id === viewingStage)?.label}</span> Stage
                </p>
              </div>
              <button
                onClick={() => setViewingStage(currentStage)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition-colors shrink-0 ml-4"
              >
                Return to Current <ArrowRight className="w-3 h-3" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">

          {/* ──────────── STAGE 2: VETTING ──────────── */}
          {viewingStage === 'vetting' && (
            <motion.div
              key="vetting"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              className="space-y-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-slate-900 font-black text-2xl mb-1">Applicant Vetting</h3>
                  <p className="text-slate-500 font-medium text-sm">
                    {isAuditMode
                      ? 'Audit view — review accepted applicant record'
                      : 'Review applicant profiles, approve candidates and track lease offer acceptance'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-bold text-slate-500">
                    <Users className="w-3.5 h-3.5" />
                    {mockApplicants.length} Applicants
                  </div>
                  {!isAuditMode && (
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-black border ${
                      acceptedApplicants.length >= 5
                        ? 'bg-red-50 border-red-200 text-red-600'
                        : acceptedApplicants.length > 0
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-slate-100 border-slate-200 text-slate-500'
                    }`}>
                      <span>{acceptedApplicants.length}/5 Accepted</span>
                      {acceptedApplicants.length >= 5 && <span className="text-[10px] font-black">· MAX REACHED</span>}
                    </div>
                  )}
                </div>
              </div>

              {/* Accepted applicants highlight in audit mode */}
              {isAuditMode && acceptedApplicants.length > 0 && (
                <div className="space-y-2">
                  {acceptedApplicants.map(a => (
                    <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-4 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-2xl">
                      <img src={a.avatar} alt={a.name} className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-300" />
                      <div className="flex-1">
                        <p className="text-emerald-700 text-xs font-black uppercase mb-0.5">Approved & Offered</p>
                        <p className="text-emerald-900 font-black text-base">{a.name}</p>
                        <p className="text-emerald-600 text-xs font-medium">{a.profession} · {a.employer}</p>
                      </div>
                      <p className="text-emerald-700 font-black text-lg">{a.matchScore}%</p>
                    </motion.div>
                  ))}
                </div>
              )}

              <div className="space-y-4">
                {mockApplicants.map((applicant, i) => {
                  const isAccepted = acceptedApplicants.some(a => a.id === applicant.id);
                  return (
                    <motion.div
                      key={applicant.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className={`bg-white border-2 rounded-2xl p-5 transition-all ${
                        isAccepted
                          ? 'border-emerald-300 shadow-lg shadow-emerald-100'
                          : 'border-slate-200 hover:border-primary/30 hover:shadow-lg'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img src={applicant.avatar} alt={applicant.name} className="w-16 h-16 rounded-xl object-cover" />
                          {isAccepted && (
                            <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-slate-900 font-bold text-lg">{applicant.name}</h4>
                            {applicant.verified && <Shield className="w-4 h-4 text-emerald-500" />}
                            {isAccepted && (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black">APPROVED</span>
                            )}
                          </div>
                          <p className="text-slate-500 text-sm font-medium">{applicant.profession} · {applicant.employer}</p>
                          <p className="text-slate-400 text-xs font-medium mt-0.5">{applicant.maritalStatus}</p>
                        </div>
                        <div className="text-center px-5">
                          <div className={`text-3xl font-black mb-0.5 ${isAccepted ? 'text-emerald-600' : 'text-primary'}`}>
                            {applicant.matchScore}%
                          </div>
                          <p className="text-xs font-bold text-slate-400">Match</p>
                        </div>
                        <button
                          onClick={() => setSelectedApplicant(applicant)}
                          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                            isAccepted
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                              : 'bg-primary/10 text-primary hover:bg-primary/20'
                          }`}
                        >
                          View Profile
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* ── Society: Engagement & Offer Status Tracker ── */}
              {acceptedApplicants.length > 0 && !isAuditMode && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden mt-8 shadow-sm"
                >
                  <div className="bg-[#1E3A5F]/10 border-b border-fold-slate-100 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#1E3A5F]" />
                      <div>
                        <h4 className="text-slate-900 font-extrabold text-base m-0">Tenancy Engagement Status</h4>
                        <p className="text-slate-400 text-[11px] font-medium mt-0.5">Real-time engagement tracking of approved applicants in this deal</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-[#1E3A5F]/10 border border-[#1E3A5F]/20 text-[#1E3A5F] rounded-full text-[10px] font-black uppercase">
                      Live Tracker
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider pb-3">
                            <th className="pb-3 pr-4 font-black">Applicant</th>
                            <th className="pb-3 px-4 font-black">Lease Offer Status</th>
                            <th className="pb-3 px-4 font-black">Offer Viewed</th>
                            <th className="pb-3 px-4 font-black">Offer Accepted</th>
                            <th className="pb-3 px-4 font-black">Payment Escrow</th>
                            <th className="pb-3 pl-4 text-right font-black">Simulate Tenant Response</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {acceptedApplicants.map(a => {
                            const status = leaseReviewStatus[a.id] ?? 'pending';
                            const hasViewed = status === 'viewed' || status === 'accepted';
                            const hasAccepted = status === 'accepted';
                            const isAwaitingPayment = hasAccepted;

                            return (
                              <tr key={a.id} className="text-sm">
                                <td className="py-4 pr-4">
                                  <div className="flex items-center gap-3">
                                    <img src={a.avatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                                    <div>
                                      <p className="text-slate-800 font-extrabold text-sm m-0">{a.name}</p>
                                      <p className="text-slate-400 text-xs m-0">{a.profession} · Match: {a.matchScore}%</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
                                    <Check className="w-3.5 h-3.5" /> Lease Sent
                                  </span>
                                </td>
                                <td className="py-4 px-4">
                                  {hasViewed ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
                                      <Eye className="w-3.5 h-3.5 text-blue-600" /> Viewed Offer
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 text-slate-400 rounded-full text-xs font-bold border border-slate-200">
                                      <Clock className="w-3.5 h-3.5 animate-pulse" /> Awaiting View
                                    </span>
                                  )}
                                </td>
                                <td className="py-4 px-4">
                                  {hasAccepted ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black border border-emerald-200">
                                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Terms Accepted
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 text-slate-400 rounded-full text-xs font-bold border border-slate-200">
                                      Awaiting Review
                                    </span>
                                  )}
                                </td>
                                <td className="py-4 px-4">
                                  {isAwaitingPayment ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-full text-xs font-black">
                                      Awaiting Payment
                                    </span>
                                  ) : hasAccepted ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-black">
                                      Paid (Escrow)
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 text-slate-400 rounded-full text-xs font-bold border border-slate-200">
                                      Pending Accept
                                    </span>
                                  )}
                                </td>
                                <td className="py-4 pl-4 text-right">
                                  <div className="flex justify-end gap-1.5">
                                    {!hasViewed && (
                                      <button
                                        onClick={() => {
                                          setLeaseReviewStatus(prev => ({ ...prev, [a.id]: 'viewed' }));
                                          toast.info(`${a.name} has opened and viewed the lease agreement offer!`);
                                        }}
                                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-[11px] rounded-lg transition-colors border border-blue-100"
                                      >
                                        Simulate View
                                      </button>
                                    )}
                                    {hasViewed && !hasAccepted && (
                                      <button
                                        onClick={() => {
                                          setLeaseReviewStatus(prev => ({ ...prev, [a.id]: 'accepted' }));
                                          toast.success(`${a.name} accepted lease terms! Listing is now ready for payment to secure lease lock.`);
                                        }}
                                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-black text-[11px] rounded-lg transition-colors border border-emerald-100"
                                      >
                                        Simulate Accept Terms
                                      </button>
                                    )}
                                    {hasAccepted && (
                                      <button
                                        onClick={() => {
                                          setLockedApplicant(a);
                                          setCurrentStage('payment');
                                          setViewingStage('payment');
                                          toast.success(`Payment from ${a.name} received in Escrow!`);
                                        }}
                                        className="px-2.5 py-1 bg-[#7B2D42]/10 hover:bg-[#7B2D42]/20 text-[#7B2D42] font-black text-[11px] rounded-lg transition-colors border border-[#7B2D42]/20 flex items-center gap-1"
                                      >
                                        <DollarSign className="w-3 h-3" /> Rent Paid →
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ──────────── STAGE 1: LEASE AGREEMENT ──────────── */}
          {viewingStage === 'agreement' && (
            <motion.div
              key="agreement"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-slate-900 font-black text-2xl mb-1">Tenancy Agreement Preparation</h3>
                <p className="text-slate-500 text-sm font-medium">Create and sign the tenancy agreement digitally or upload a manual copy before vetting applicants</p>
              </div>

              {!leaseMode ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setLeaseMode('digital')} className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 rounded-2xl text-left hover:border-primary/50 hover:shadow-xl transition-all">
                      <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                        <Edit3 className="w-7 h-7 text-primary" />
                      </div>
                      <h4 className="text-slate-900 font-black text-xl mb-2">Digital Generation</h4>
                      <p className="text-slate-600 font-medium text-sm">Use Houzii's smart template system to generate a customized, legally vetting tenancy agreement draft</p>
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setLeaseMode('manual')} className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-2xl text-left hover:border-slate-300 hover:shadow-xl transition-all">
                      <div className="w-14 h-14 bg-slate-200 rounded-xl flex items-center justify-center mb-4">
                        <Upload className="w-7 h-7 text-slate-600" />
                      </div>
                      <h4 className="text-slate-900 font-black text-xl mb-2">Manual Upload</h4>
                      <p className="text-slate-600 font-medium text-sm">Upload your pre-prepared offline tenancy agreement PDF or DOCX file directly</p>
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => { setLeaseMode(null); setUploadedLease(null); }}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <div>
                        <h4 className="text-slate-900 font-black text-xl">
                          {leaseMode === 'digital' ? 'Digital Lease Draft & Validation' : 'Manual Agreement Document Upload'}
                        </h4>
                        <p className="text-slate-500 text-xs font-medium">Review, comment or prepare custom templates for this tenancy</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-5" style={{ height: '520px' }}>
                    {/* Lease Document View */}
                    {leaseMode === 'digital' ? (
                      <div className="flex-1 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-1 overflow-hidden">
                        <div className="bg-white rounded-xl h-full overflow-y-auto p-8 border border-transparent font-serif">
                          <div className="text-center mb-8 pb-6 border-b-2 border-slate-200">
                            <h3 className="text-slate-900 font-black text-2xl mb-2">TENANCY AGREEMENT</h3>
                            <p className="text-slate-500 text-sm font-medium">Between Landlord (via Agent) and Tenant</p>
                          </div>
                          <div className="space-y-5">
                            {leaseContent.map((section, i) => (
                              <div
                                key={i}
                                className={`cursor-pointer p-4 rounded-xl transition-all ${
                                  selectedClause === section.clause
                                    ? 'bg-amber-50 ring-2 ring-amber-300'
                                    : 'hover:bg-slate-50'
                                }`}
                                onClick={() => setSelectedClause(section.clause)}
                              >
                                <p className="font-extrabold text-slate-900 mb-2 text-sm">{section.clause}</p>
                                <p className="text-slate-600 font-medium text-sm leading-relaxed">{section.text}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 flex flex-col justify-center items-center">
                        {!uploadedLease ? (
                          <div
                            onClick={() => {
                              setUploadedLease({ name: 'Lagos_Tenancy_Agreement_Draft.pdf', size: '2.4 MB' });
                              toast.success('Agreement document uploaded successfully! (Mockup)');
                            }}
                            className="cursor-pointer text-center max-w-sm space-y-4 hover:bg-slate-50 p-6 rounded-2xl border border-transparent hover:border-slate-100 transition-all"
                          >
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto animate-bounce-short">
                              <Upload className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                              <p className="text-slate-800 font-extrabold text-base">Drag & Drop Lease Agreement</p>
                              <p className="text-slate-400 text-xs mt-1">Accepts PDF, DOCX or TXT files up to 10MB</p>
                            </div>
                            <button className="px-4 py-2 bg-primary/10 text-primary font-black text-xs rounded-full hover:bg-primary/20 transition-all">
                              Browse Files
                            </button>
                          </div>
                        ) : (
                          <div className="w-full h-full flex flex-col justify-between">
                            <div className="space-y-6">
                              <div className="flex items-center gap-4 p-4 bg-emerald-50 border-2 border-emerald-100 rounded-2xl">
                                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                                  <FileText className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-slate-800 font-extrabold text-sm truncate">{uploadedLease.name}</p>
                                  <p className="text-slate-400 text-xs">{uploadedLease.size} · Uploaded just now</p>
                                </div>
                                <button
                                  onClick={() => setUploadedLease(null)}
                                  className="p-1 px-2.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold rounded-lg transition-colors shrink-0"
                                >
                                  Delete
                                </button>
                              </div>

                              <div className="p-5 border border-slate-100 rounded-2xl bg-slate-50 space-y-4">
                                <h4 className="text-slate-800 font-extrabold text-sm border-b border-slate-200 pb-2">Manual Agreement Details</h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Landlord Agent</label>
                                    <p className="text-xs font-extrabold text-slate-800">Joy Adeyemi</p>
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Property Listing</label>
                                    <p className="text-xs font-extrabold text-slate-800 truncate">{listing.title}</p>
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Rental Charge</label>
                                    <p className="text-xs font-extrabold text-slate-800">{listing.price} / year</p>
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Security Caution</label>
                                    <p className="text-xs font-extrabold text-emerald-600">₦250,000 (Escrowed)</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-100 mt-4">
                              <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
                              <span>This uploaded agreement will be securely compiled into the tenant digital wallet.</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Negotiation Panel for digital OR Agreement Checklist for manual */}
                    {leaseMode === 'digital' ? (
                      <div className="w-80 bg-slate-50 rounded-2xl border-2 border-slate-200 flex flex-col overflow-hidden">
                        <div className="p-4 bg-white border-b border-slate-200">
                          <p className="text-slate-800 font-black text-sm mb-3">Negotiation Panel</p>
                          <button className="w-full py-2 bg-primary/10 text-primary rounded-lg text-xs font-bold flex items-center justify-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5" /> Comments ({comments.filter(c => !c.resolved).length} open)
                          </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                          {comments.length === 0 ? (
                            <div className="text-center py-10">
                              <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                              <p className="text-slate-400 font-bold text-xs font-extrabold">No comments yet</p>
                              <p className="text-slate-300 text-[10px] mt-1">Click a clause to add feedback</p>
                            </div>
                          ) : (
                            comments.map(comment => (
                              <div key={comment.id} className={`p-3 rounded-xl border-2 ${comment.resolved ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200'}`}>
                                <div className="flex items-start justify-between mb-1">
                                  <span className="text-[10px] font-black text-slate-400 uppercase">{comment.clause}</span>
                                  {comment.resolved && <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                                </div>
                                <p className="text-slate-700 text-xs font-medium mb-2">{comment.text}</p>
                                <div className="flex gap-1.5">
                                  {!comment.resolved && (
                                    <button onClick={() => setComments(c => c.map(x => x.id === comment.id ? { ...x, resolved: true } : x))} className="flex-1 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-bold hover:bg-emerald-200 transition-colors">
                                      <Check className="w-3 h-3 inline mr-0.5" /> Resolve
                                    </button>
                                  )}
                                  <button onClick={() => setComments(c => c.filter(x => x.id !== comment.id))} className="px-2 py-1 bg-red-50 text-red-500 rounded-lg text-[10px] font-bold hover:bg-red-100 transition-colors">
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                        {selectedClause && !isAuditMode && (
                          <div className="p-4 border-t-2 border-slate-200 bg-white">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Comment on {selectedClause}</p>
                            <textarea
                              value={newComment}
                              onChange={e => setNewComment(e.target.value)}
                              placeholder="Type your feedback or suggestion..."
                              className="w-full p-2.5 border-2 border-slate-200 rounded-xl text-xs font-medium resize-none focus:outline-none focus:border-primary mb-2"
                              rows={3}
                            />
                            <button onClick={handleAddComment} className="w-full py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-dark transition-colors font-extrabold">
                              Add Comment
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-80 bg-slate-50 rounded-2xl border-2 border-slate-200 p-5 flex flex-col justify-between overflow-hidden">
                        <div className="space-y-4">
                          <h4 className="text-slate-800 font-black text-sm uppercase tracking-wide">Document Review List</h4>
                          <div className="space-y-3">
                            <div className="flex items-start gap-2.5">
                              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <div className="text-xs">
                                <p className="text-slate-700 font-extrabold">Governor's Consent Validated</p>
                                <p className="text-slate-400">Verifying property titles & tax ID compatibility</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2.5">
                              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <div className="text-xs">
                                <p className="text-slate-700 font-extrabold">Naira Payment Currency</p>
                                <p className="text-slate-400">Values in agreement correctly configured in NGN</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2.5">
                              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <div className="text-xs">
                                <p className="text-slate-700 font-extrabold">Escrow Security Clause</p>
                                <p className="text-slate-400">Integrated standard 24h tenancy vetting safety check</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                          <p className="text-primary font-bold text-xs text-center leading-relaxed">Need legal review? Our in-house Lagos tenancy lawyers can inspect files instantly.</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Bar */}
                  {!isAuditMode && (
                    <div className="mt-5 flex items-center justify-between">
                      {leaseMode === 'digital' && !allCommentsResolved ? (
                        <div className="flex-1 p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <p className="text-amber-800 text-sm font-bold">All comments must be resolved before signing the agreement</p>
                        </div>
                      ) : (
                        <div />
                      )}

                      {!agentSigned ? (
                        <button
                          onClick={() => setShowSignatureModal(true)}
                          disabled={leaseMode === 'digital' ? !allCommentsResolved : !uploadedLease}
                          className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0 ml-auto"
                        >
                          <PenTool className="w-4 h-4" /> Proceed to Sign Agreement
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setCurrentStage('vetting');
                            setViewingStage('vetting');
                            toast.success('Tenancy agreement signed & saved! Now starting applicant vetting.');
                          }}
                          className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2 shrink-0 ml-auto"
                        >
                          <CheckCircle className="w-4 h-4" /> Save Agreement & Proceed to Vetting Applicants →
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* ──────────── STAGE 3: PAYMENT ──────────── */}
          {viewingStage === 'payment' && (
            <motion.div key="payment" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} className="space-y-5">
              <div>
                <h3 className="text-slate-900 font-black text-2xl mb-1">Payment & Escrow</h3>
                <p className="text-slate-500 font-medium text-sm">
                  {isAuditMode ? 'Audit view — transaction record' : lockedApplicant ? `Deal locked for ${lockedApplicant.name.split(' ')[0]} — acknowledge to proceed` : `Awaiting payment from ${acceptedApplicants.length} accepted applicant${acceptedApplicants.length > 1 ? 's' : ''}`}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-5">
                <div className="col-span-2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 space-y-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1">Payment Status</p>
                      <h4 className="text-white font-black text-xl">
                        {lockedApplicant ? 'Payment Received — Deal Locked' : 'Awaiting Transfer to Escrow'}
                      </h4>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-black ${lockedApplicant ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300' : 'bg-orange-500/20 border border-orange-500/30 text-orange-300'}`}>
                      {lockedApplicant ? 'PAID' : 'PENDING'}
                    </span>
                  </div>

                  {/* Locked applicant banner */}
                  {lockedApplicant && (
                    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-3 p-4 bg-emerald-500/15 border border-emerald-400/30 rounded-xl">
                      <img src={lockedApplicant.avatar} alt="" className="w-11 h-11 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-emerald-300 text-[10px] font-black uppercase mb-0.5">Deal Locked</p>
                        <p className="text-white font-black text-base truncate">{lockedApplicant.name}</p>
                        <p className="text-white/50 text-xs truncate">{lockedApplicant.email}</p>
                      </div>
                      <span className="px-3 py-1.5 bg-emerald-500 text-white rounded-full text-xs font-black shrink-0">✓ LOCKED</span>
                    </motion.div>
                  )}


                  {!isAuditMode && lockedApplicant && (
                    <button onClick={handleAcknowledgePayment}
                      className="w-full py-3.5 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30">
                      <CheckCircle className="w-5 h-5" /> Acknowledge Payment & Proceed to Signing
                    </button>
                  )}
                </div>

                {/* Activity Log */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col">
                  <div className="flex items-center gap-2 mb-5">
                    <Activity className="w-4 h-4 text-primary" />
                    <h4 className="text-slate-900 font-black text-sm">Recent Activity</h4>
                  </div>
                  <div className="space-y-4 flex-1">
                    {activityLog.map((item, i) => {
                      const Icon = item.icon;
                      return (
                        <div key={i} className="flex items-start gap-3">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${item.color}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="text-slate-700 text-xs font-bold leading-snug">{item.text}</p>
                            <p className="text-slate-400 text-[10px] font-medium mt-0.5">{item.time}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ──────────── STAGE 4: LEASE SIGNING ──────────── */}
          {viewingStage === 'lease-signing' && (
            <motion.div key="lease-signing" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} className="space-y-6">
              <div>
                <h3 className="text-slate-900 font-black text-2xl mb-1">Lease Signing</h3>
                <p className="text-slate-500 font-medium text-sm">
                  {isAuditMode ? 'Audit view — signing record' : applicantSigned ? 'Tenant has signed the lease — confirm to proceed to handover' : `Waiting for ${lockedApplicant?.name?.split(' ')[0] || 'tenant'} to sign the lease agreement`}
                </p>
              </div>

              <div className="max-w-2xl space-y-5">
                {/* Locked tenant card */}
                {lockedApplicant && (
                  <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl">
                    <img src={lockedApplicant.avatar} alt="" className="w-14 h-14 rounded-xl object-cover border-2 border-white/20" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white/50 text-[10px] font-black uppercase mb-0.5">Locked Tenant</p>
                      <p className="text-white font-black text-lg">{lockedApplicant.name}</p>
                      <p className="text-white/60 text-sm">{lockedApplicant.profession} · {lockedApplicant.employer}</p>
                    </div>
                    <span className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-full text-xs font-black shrink-0">
                      ✓ Deal Locked
                    </span>
                  </div>
                )}

                {/* Signing status card */}
                <div className="rounded-2xl border-2 border-slate-200 bg-white p-6">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                      <PenLine className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-0.5">
                        <h4 className="text-slate-900 font-black text-lg">
                          {applicantSigned ? 'Lease Signed' : 'Awaiting Signature'}
                        </h4>
                        {applicantSigned && (
                          <span className="flex items-center gap-1 px-2.5 py-0.5 bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-full text-[10px] font-black shrink-0">
                            <Check className="w-2.5 h-2.5" strokeWidth={3} /> Signed
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 text-sm font-medium">
                        {applicantSigned
                          ? `${lockedApplicant?.name?.split(' ')[0] || 'Tenant'} has reviewed and signed the tenancy agreement`
                          : `The lease has been sent to ${lockedApplicant?.name || 'the tenant'} for review and signature`}
                      </p>
                    </div>
                  </div>

                  {/* Lease doc summary */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {[
                      { label: 'Property', value: listing.title },
                      { label: 'Annual Rent', value: listing.price },
                      { label: 'Term', value: '12 months' },
                      { label: 'Signed By', value: applicantSigned ? (lockedApplicant?.name || '—') : 'Pending' },
                    ].map(item => (
                      <div key={item.label} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">{item.label}</p>
                        <p className={`text-sm font-bold truncate ${applicantSigned && item.label === 'Signed By' ? 'text-emerald-600' : 'text-slate-700'}`}>{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {applicantSigned && (
                    <>
                      <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl mb-4">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <p className="text-slate-500 text-xs font-bold">
                          Digitally signed & timestamped — <span className="text-slate-700">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </p>
                      </div>
                      <div className="flex gap-3 mb-5">
                        <button
                          onClick={() => window.open('about:blank', '_blank')}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border-2 border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:border-primary/30 hover:text-primary transition-colors"
                        >
                          <Eye className="w-4 h-4" /> View Lease
                        </button>
                        <button
                          onClick={() => {
                            const a = document.createElement('a');
                            a.href = 'data:text/plain;charset=utf-8,SIGNED%20TENANCY%20AGREEMENT%0A%0AProperty%3A%20' + encodeURIComponent(listing.title) + '%0ATenant%3A%20' + encodeURIComponent(lockedApplicant?.name || tenantName) + '%0ADate%20Signed%3A%20' + new Date().toLocaleDateString();
                            a.download = 'signed-lease-' + listing.id + '.txt';
                            a.click();
                          }}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors"
                        >
                          <Download className="w-4 h-4" /> Download
                        </button>
                      </div>
                    </>
                  )}

                  {!isAuditMode && !applicantSigned && (
                    <button
                      onClick={() => setApplicantSigned(true)}
                      className="w-full py-2.5 border border-dashed border-slate-300 text-slate-400 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      ▷ Simulate Tenant Signed (Demo)
                    </button>
                  )}
                </div>

                {/* Proceed CTA */}
                {!isAuditMode && applicantSigned && (
                  <motion.button
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    onClick={handleProceedToHandover}
                    className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" /> Confirm Signing & Proceed to Handover
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}

          {/* ──────────── STAGE 5: HANDOVER ──────────── */}
          {viewingStage === 'handover' && (
            <motion.div
              key="handover"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-slate-900 font-black text-2xl mb-1">Handover Coordination</h3>
                <p className="text-slate-500 font-medium text-sm">Schedule and confirm property handover with the tenant</p>
              </div>

              {!handoverDate ? (
                <div className="max-w-2xl">
                  <div className="bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-2xl p-8">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-8 h-8 text-primary" />
                      </div>
                      <h4 className="text-slate-900 font-bold text-lg mb-1">Confirm Tenant's Proposed Handover</h4>
                      <p className="text-slate-500 text-sm font-medium">{lockedApplicant?.name || tenantName} has proposed the following date and time</p>
                    </div>
                    <div className="p-6 bg-white border-2 border-primary/20 rounded-xl mb-6 text-center">
                      <p className="text-3xl font-black text-primary mb-1">Saturday, May 3rd, 2026</p>
                      <p className="text-lg font-bold text-slate-500">10:00 AM</p>
                    </div>
                    {!isAuditMode && (
                      <div className="grid grid-cols-2 gap-4">
                        <button onClick={handleAcceptHandover} className="py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
                          <Check className="w-5 h-5" /> Confirm Schedule
                        </button>
                        <button className="py-4 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                          <Calendar className="w-5 h-5" /> Reschedule
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="max-w-2xl">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h4 className="text-slate-900 font-black text-xl mb-2">Handover Scheduled!</h4>
                    <p className="text-slate-600 font-medium">Property handover confirmed for Saturday, May 3rd, 2026 at 10:00 AM</p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl mb-6 text-center">
                    <p className="text-sm font-bold text-slate-700 mb-1">Added to Houzii Calendar</p>
                    <p className="text-xs text-slate-500">You'll receive a reminder 24 hours before</p>
                  </div>
                  {!isAuditMode && (
                    <button onClick={() => setShowPayoutModal(true)} className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                      <Home className="w-5 h-5" /> Mark Handover Complete
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* ──────────── STAGE 6: PAYOUT ──────────── */}
          {viewingStage === 'payout' && (
            <motion.div key="payout" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} className="space-y-6">
              <div>
                <h3 className="text-slate-900 font-black text-2xl mb-1">Agent Payout</h3>
                <p className="text-slate-500 font-medium text-sm">
                  {tenantConfirmed ? 'Deal complete — all parties have been credited' : 'Awaiting tenant confirmation of handover'}
                </p>
              </div>

              <div className="max-w-2xl">
                {!tenantConfirmed ? (
                  /* Sub-phase A: Awaiting tenant confirmation */
                  <motion.div key="awaiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                    <div className="flex items-start gap-4 p-6 bg-amber-50 border-2 border-amber-200 rounded-2xl">
                      <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                          className="w-6 h-6 rounded-full border-2 border-amber-300" style={{ borderTopColor: '#D97706' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-amber-700 text-[10px] font-black uppercase tracking-wider mb-0.5">Awaiting Confirmation</p>
                        <p className="text-amber-900 font-black text-lg">Handover Confirmation Pending</p>
                        <p className="text-amber-700 text-sm font-medium mt-1">
                          Waiting for <span className="font-black">{lockedApplicant?.name || tenantName}</span> to confirm the handover was satisfactory before funds are released.
                        </p>
                      </div>
                    </div>

                    {lockedApplicant && (
                      <div className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl">
                        <img src={lockedApplicant.avatar} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-400 text-[10px] font-black uppercase">Tenant</p>
                          <p className="text-slate-900 font-bold text-sm">{lockedApplicant.name}</p>
                        </div>
                        <span className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black">Pending</span>
                      </div>
                    )}

                    {!isAuditMode && (
                      <button
                        onClick={() => setTenantConfirmed(true)}
                        className="w-full py-2.5 border border-dashed border-slate-300 text-slate-400 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        ▷ Simulate Tenant Confirmed Handover (Demo)
                      </button>
                    )}
                  </motion.div>
                ) : (
                  /* Sub-phase B: Credits confirmed */
                  <motion.div key="confirmed" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} className="space-y-5">
                    {/* Hero */}
                    <div className="text-center pb-4">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-emerald-200">
                        <CheckCircle className="w-10 h-10 text-emerald-600" />
                      </motion.div>
                      <h3 className="text-slate-900 font-black text-3xl mb-1">Deal Closed! 🎉</h3>
                      <p className="text-slate-500 font-medium">Handover confirmed by {lockedApplicant?.name || tenantName}</p>
                    </div>

                    {/* Agent commission — wallet credit */}
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                      className="flex items-start gap-4 p-5 bg-emerald-50 border-2 border-emerald-200 rounded-2xl">
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                        <Wallet className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-emerald-700 text-[10px] font-black uppercase tracking-wider mb-0.5">Your Commission — Houzii Wallet</p>
                        <p className="text-emerald-900 font-black text-2xl">₦450,000</p>
                        <p className="text-emerald-600 text-xs font-medium mt-1">TXN: TXN-2026-AGNT-8472 · Credited instantly</p>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-500 text-white rounded-full text-[10px] font-black shrink-0">CREDITED</span>
                    </motion.div>

                    {/* Landlord payment — bank account */}
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                      className="flex items-start gap-4 p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                        <Building2 className="w-6 h-6 text-slate-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-wider mb-0.5">Landlord Payment — Bank Account</p>
                        <p className="text-slate-900 font-black text-2xl">₦4,050,000</p>
                        <p className="text-slate-500 text-xs font-medium mt-1">Mr. Emeka Okafor · First Bank ****4521</p>
                        <p className="text-slate-400 text-xs font-medium">TXN: TXN-2026-LAND-8473 · 1–2 business days</p>
                      </div>
                      <span className="px-2.5 py-1 bg-slate-600 text-white rounded-full text-[10px] font-black shrink-0">DISBURSED</span>
                    </motion.div>

                    {/* Actions */}
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                      className="flex gap-3">
                      <button className="flex-1 py-3.5 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                        <Wallet className="w-4 h-4" /> View Wallet
                      </button>
                      <button
                        onClick={() => {
                          const a = document.createElement('a');
                          a.href = 'data:text/plain;charset=utf-8,Houzii%20Transaction%20Receipt%0ATxn%3A%20TXN-2026-AGNT-8472%0AAmount%3A%20%E2%82%A6450%2C000%0ADate%3A%20' + new Date().toLocaleDateString();
                          a.download = 'houzii-receipt-TXN-2026-AGNT-8472.txt';
                          a.click();
                        }}
                        className="flex-1 py-3.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" /> Download Receipt
                      </button>
                      <button onClick={onBack} className="px-5 py-3.5 bg-slate-100 text-slate-500 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                        Back
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── Applicant Profile Modal (centered overlay) ── */}
      <AnimatePresence>
        {selectedApplicant && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setSelectedApplicant(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-6 py-5 rounded-t-3xl flex items-center justify-between sticky top-0 z-10">
                  <div className="flex items-center gap-3">
                    <img src={selectedApplicant.avatar} alt={selectedApplicant.name} className="w-12 h-12 rounded-xl object-cover border-2 border-white/20" />
                    <div>
                      <h3 className="text-white font-black text-lg">{selectedApplicant.name}</h3>
                      <p className="text-white/60 text-sm font-medium">{selectedApplicant.profession} · {selectedApplicant.employer}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedApplicant(null)} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  {/* Match Score + Contact */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-slate-900 font-black text-xl">{selectedApplicant.name}</h4>
                        {selectedApplicant.verified && (
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black">✓ Verified</span>
                        )}
                        {acceptedApplicants.some(a => a.id === selectedApplicant.id) && (
                          <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-black">Accepted</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                          <Mail className="w-3.5 h-3.5 text-slate-400" /> {selectedApplicant.email}
                        </span>
                        <span className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                          <Phone className="w-3.5 h-3.5 text-slate-400" /> {selectedApplicant.phone}
                        </span>
                      </div>
                    </div>
                    <div className="relative w-24 h-24 shrink-0">
                      <svg className="w-24 h-24 -rotate-90">
                        <circle cx="48" cy="48" r="38" stroke="#E2E8F0" strokeWidth="8" fill="none" />
                        <circle cx="48" cy="48" r="38" stroke="#7B2D42" strokeWidth="8" fill="none"
                          strokeDasharray={`${2 * Math.PI * 38}`}
                          strokeDashoffset={`${2 * Math.PI * 38 * (1 - selectedApplicant.matchScore / 100)}`}
                          strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-primary">{selectedApplicant.matchScore}%</span>
                        <span className="text-[9px] font-bold text-slate-400">Match</span>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-wider">Profession</label>
                      <div className="flex items-center gap-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                        <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="text-slate-700 font-bold text-sm">{selectedApplicant.profession}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-wider">Employer</label>
                      <div className="flex items-center gap-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                        <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="text-slate-700 font-bold text-sm">{selectedApplicant.employer}</span>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-wider">Work Address</label>
                      <div className="flex items-center gap-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="text-slate-700 font-bold text-sm">{selectedApplicant.workAddress}</span>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-wider">Marital Status</label>
                      <div className="flex">
                        <div className="p-3 bg-primary/10 text-primary border border-primary/20 rounded-xl font-bold text-sm flex items-center gap-2 px-5">
                          <Check className="w-4 h-4 text-primary shrink-0" />
                          <span>{selectedApplicant.maritalStatus}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  {!isAuditMode ? (
                    <div className="space-y-3">
                      {acceptedApplicants.length >= 5 && !acceptedApplicants.some(a => a.id === selectedApplicant.id) && (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
                          <p className="text-amber-700 text-xs font-bold">Maximum of 5 applicants can be accepted</p>
                        </div>
                      )}
                      
                      <button
                        onClick={() => setShowAgreementPreviewModal(true)}
                        className="w-full py-3 border border-slate-200 hover:border-[#1E3A5F]/30 hover:bg-[#1E3A5F]/5 text-slate-700 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2"
                      >
                        <FileText className="w-4 h-4 text-[#1E3A5F]" /> Preview Prepared Lease Agreement Draft
                      </button>

                      <button
                        onClick={() => handleAcceptApplicant(selectedApplicant)}
                        disabled={acceptedApplicants.length >= 5 && !acceptedApplicants.some(a => a.id === selectedApplicant.id)}
                        className={`w-full py-4 rounded-xl font-black text-base transition-colors shadow-lg disabled:opacity-40 disabled:cursor-not-allowed ${
                          acceptedApplicants.some(a => a.id === selectedApplicant.id)
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 shadow-none'
                            : 'bg-primary text-white hover:bg-primary-dark shadow-primary/20'
                        }`}
                      >
                        {acceptedApplicants.some(a => a.id === selectedApplicant.id) ? '✓ Accepted — Click to Remove' : 'Accept Applicant'}
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setSelectedApplicant(null)} className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                      Close Profile
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>


      {/* ── Signature Modal ── */}
      <AnimatePresence>
        {showSignatureModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-[60]" onClick={() => setShowSignatureModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 flex items-center justify-center z-[70] p-4">
              <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-6 py-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-black text-xl">Sign Lease Agreement</h3>
                    <p className="text-white/60 text-sm font-medium">{listing.title}</p>
                  </div>
                  <button onClick={() => setShowSignatureModal(false)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex gap-2 mb-5 p-1 bg-slate-100 rounded-xl">
                    {[{ id: 'type' as SignatureMode, label: 'Type', icon: TypeIcon }, { id: 'draw' as SignatureMode, label: 'Draw', icon: PenTool }, { id: 'upload' as SignatureMode, label: 'Upload', icon: ImageIcon }].map(mode => (
                      <button key={mode.id} onClick={() => setSignatureMode(mode.id)} className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${signatureMode === mode.id ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                        <mode.icon className="w-4 h-4" /> {mode.label}
                      </button>
                    ))}
                  </div>
                  {signatureMode === 'type' && (
                    <div className="mb-5">
                      <label className="block text-xs font-black text-slate-400 uppercase mb-2">Type your full legal name</label>
                      <input type="text" value={signatureName} onChange={e => setSignatureName(e.target.value)} placeholder="e.g. Adewale Oladapo" className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl font-medium focus:outline-none focus:border-primary" />
                      {signatureName && (
                        <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <p className="text-3xl font-serif text-slate-800 text-center">{signatureName}</p>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl mb-5">
                    <p className="text-amber-800 text-xs font-bold">⚠️ By signing, you agree to the terms in the Tenancy Agreement for {listing.title}. This is a legally binding digital signature.</p>
                  </div>
                  <button onClick={() => { setAgentSigned(true); setShowSignatureModal(false); }} disabled={signatureMode === 'type' && !signatureName} className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    <PenTool className="w-5 h-5" /> Sign & Submit
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Payout Confirmation Modal ── */}
      <AnimatePresence>
        {showPayoutModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-[60]" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 flex items-center justify-center z-[70] p-4">
              <div className="bg-white rounded-2xl w-full max-w-md p-8 text-center shadow-2xl">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-slate-900 font-black text-xl mb-2">Everything Check Out?</h3>
                <p className="text-slate-600 font-medium mb-6">Payout release initiated. Credited to wallet in 24hrs if no tenant dispute is raised.</p>
                <button onClick={handleAgentConfirmHandover} className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors mb-3">Confirm Handover Complete</button>
                <button onClick={() => setShowPayoutModal(false)} className="w-full py-3 text-slate-600 font-bold hover:text-slate-900 transition-colors">Cancel</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Lease Agreement Preview Modal ── */}
      <AnimatePresence>
        {showAgreementPreviewModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
              onClick={() => setShowAgreementPreviewModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 flex items-center justify-center z-[110] p-4"
            >
              <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-6 py-5 flex items-center justify-between shrink-0">
                  <div>
                    <h3 className="text-white font-black text-xl">Preview Tenancy Lease Agreement</h3>
                    <p className="text-white/60 text-sm font-medium">{listing.title}</p>
                  </div>
                  <button onClick={() => setShowAgreementPreviewModal(false)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-slate-50/50">
                  {uploadedLease ? (
                    <div className="flex flex-col items-center justify-center py-10 bg-emerald-50 border-2 border-dashed border-emerald-250 rounded-2xl p-6 text-center">
                      <FileText className="w-16 h-16 text-emerald-600 mb-3" />
                      <h4 className="text-slate-800 font-extrabold text-base mb-1">Uploaded agreement:</h4>
                      <p className="text-slate-900 font-black text-sm mb-4">{uploadedLease.name} ({uploadedLease.size})</p>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full border border-emerald-200">✓ System Validated Draft</span>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl p-6 font-serif shadow-sm border border-slate-100">
                      <div className="text-center mb-6 pb-4 border-b border-slate-200">
                        <h4 className="text-slate-900 font-black text-xl mb-1 text-center font-serif">TENANCY LEASE AGREEMENT</h4>
                        <p className="text-slate-500 text-xs font-medium text-center">Prepared Draft under Lagos State Rental Laws</p>
                      </div>
                      <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                        {leaseContent.map((clause, idx) => (
                          <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="font-extrabold text-[#7B2D42] text-xs mb-1 uppercase tracking-wide">{clause.clause}</p>
                            <p className="text-slate-600 font-medium text-xs leading-relaxed">{clause.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-[#1E3A5F]/5 border border-[#1E3A5F]/10 rounded-xl">
                    <h5 className="text-[#1E3A5F] font-black text-xs uppercase mb-1 tracking-wider">Tenant Signing & Lock Process</h5>
                    <p className="text-slate-600 text-[11px] font-bold leading-normal">
                      Once this candidate is approved, they will access the tenancy portal to sign this exact document draft. The rent payment stage opens immediately after endorsement. Whoever pays first secures and locks the lease.
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
                  <button onClick={() => setShowAgreementPreviewModal(false)} className="px-5 py-2.5 bg-primary text-white font-black text-xs rounded-full hover:bg-primary-dark transition-colors shadow-md">
                    Close Preview
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
