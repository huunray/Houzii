import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, FileText, AlertTriangle,
  CheckCircle2, Pen, ArrowRight,
  Download, Gavel, Sparkles, MessageSquare, ShieldCheck, XCircle, CreditCard
} from 'lucide-react';
import {
  LeaseComment,
  CommentPopover,
  ClauseCommentTrigger,
  CommentsPanel,
  UnresolvedGate,
} from './lease-comments';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';

interface LeaseExecutionSuiteProps {
  propertyTitle: string;
  agentName: string;
  rent: string;
  onClose: () => void;
  onSigned: () => void;
  readOnly?: boolean;
  /** 'review' = accept/decline before payment, 'sign' = sign-only after payment */
  mode?: 'review' | 'sign';
  onAccept?: () => void;
  onDecline?: () => void;
}


const leaseHighlights = [
  { id: 1, label: 'Monthly Rent', value: '₦375,000/mo', icon: '💰', detail: 'Payable on or before the 5th of each month' },
  { id: 2, label: 'Caution Deposit', value: '₦750,000 (Refundable)', icon: '🔒', detail: 'Returned within 30 days of lease end, subject to property condition' },
  { id: 3, label: 'Termination Notice', value: '3 Months', icon: '📅', detail: 'Either party must give 3 months written notice' },
  { id: 4, label: 'No Commercial Use', value: 'Residential Only', icon: '🏠', detail: 'Property shall not be used for commercial or business purposes' },
  { id: 5, label: 'Maintenance', value: 'Tenant Responsible', icon: '🔧', detail: 'Minor repairs under ₦50,000 are tenant responsibility' },
];

const leaseClauses = [
  { index: 1, label: 'PARTIES', getContent: (agentName: string, _pt: string, _rent: string) => `This Agreement is entered into between the Landlord, represented by Agent ${agentName} ("the Agent"), and the Tenant, Adaeze Okonkwo ("the Tenant").` },
  { index: 2, label: 'PROPERTY', getContent: (_an: string, propertyTitle: string) => `The premises known as ${propertyTitle}, located at Victoria Island, Lagos, Nigeria.` },
  { index: 3, label: 'TERM', getContent: () => 'The tenancy shall commence from the date of execution and shall be for a period of twelve (12) calendar months.' },
  { index: 4, label: 'RENT', getContent: (_an: string, _pt: string, rent: string) => `The annual rent shall be ${rent}, payable monthly at ₦375,000 on or before the 5th day of each month.` },
  { index: 5, label: 'CAUTION DEPOSIT', getContent: () => 'A caution deposit of ₦750,000 shall be paid and held in escrow, refundable within 30 days of lease termination subject to satisfactory property inspection.' },
  { index: 6, label: 'USE OF PREMISES', getContent: () => 'The premises shall be used solely for residential purposes. No commercial or business activity is permitted.' },
  { index: 7, label: 'MAINTENANCE', getContent: () => 'The Tenant shall be responsible for minor repairs not exceeding ₦50,000. Major structural repairs remain the Landlord\'s responsibility.' },
  { index: 8, label: 'TERMINATION', getContent: () => 'Either party may terminate this agreement by providing three (3) months written notice.' },
  { index: 9, label: 'SUBLETTING', getContent: () => 'The Tenant shall not sublet, assign, or transfer the premises without written consent from the Landlord.' },
  { index: 10, label: 'GOVERNING LAW', getContent: () => 'This agreement shall be governed by the laws of Lagos State, Nigeria.' },
];

type SignatureMode = 'type' | 'draw' | 'upload';

export const LeaseExecutionSuite: React.FC<LeaseExecutionSuiteProps> = ({
  propertyTitle,
  agentName,
  rent,
  onClose,
  onSigned,
  readOnly = false,
  mode = 'review',
  onAccept,
  onDecline,
}) => {
  const [step, setStep] = useState<'review' | 'sign' | 'success'>(mode === 'sign' ? 'sign' : 'review');
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(mode === 'sign');
  const [signatureMode, setSignatureMode] = useState<SignatureMode>('type');
  const [typedSignature, setTypedSignature] = useState('');
  const [showLawyerPopup, setShowLawyerPopup] = useState(false);
  const [showDeclineConfirm, setShowDeclineConfirm] = useState(false);


  // Comment system state
  const [comments, setComments] = useState<LeaseComment[]>([]);
  const [activeCommentClause, setActiveCommentClause] = useState<number | null>(null);
  // Comment popover positioned inline relative to clause
  const [sidebarMode, setSidebarMode] = useState<'highlights' | 'comments'>('highlights');

  const unresolvedCount = comments.filter(c => !c.resolved).length;
  const canSign = hasScrolledToEnd && unresolvedCount === 0;

  const getCommentsForClause = (clauseIdx: number) => comments.filter(c => c.clauseIndex === clauseIdx);

  const handleClauseComment = (clauseIdx: number) => {
    if (readOnly) return;
    setActiveCommentClause(prev => prev === clauseIdx ? null : clauseIdx);
    if (sidebarMode !== 'comments' && comments.length > 0) setSidebarMode('comments');
  };

  const addComment = (clauseIndex: number, clauseLabel: string, text: string) => {
    const newComment: LeaseComment = {
      id: `c-${Date.now()}`,
      clauseIndex,
      clauseLabel,
      author: 'seeker',
      authorName: 'Adaeze Okonkwo',
      text,
      timestamp: new Date(),
      resolved: false,
      replies: [],
    };
    setComments(prev => [...prev, newComment]);
    setSidebarMode('comments');
  };

  const resolveComment = (commentId: string) => {
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, resolved: true } : c));
  };

  const deleteComment = (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  const replyToComment = (commentId: string, text: string) => {
    setComments(prev => prev.map(c => c.id === commentId ? {
      ...c,
      replies: [...c.replies, {
        id: `r-${Date.now()}`,
        author: 'seeker' as const,
        authorName: 'Adaeze Okonkwo',
        text,
        timestamp: new Date(),
      }],
    } : c));
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
      setHasScrolledToEnd(true);
    }
  };

  const handleSign = () => {
    setStep('success');
    setTimeout(() => {
      onSigned();
    }, 3000);
  };

  return (
    <TooltipProvider>
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl bg-white flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <AnimatePresence mode="wait">
            {step === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 px-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                  className="w-20 h-20 rounded-full bg-[hsl(var(--escrow-green))]/10 flex items-center justify-center mb-5"
                >
                  <CheckCircle2 className="w-10 h-10 text-[hsl(var(--escrow-green))]" />
                </motion.div>
                <h3 className="text-slate-900 font-black text-xl mb-2 text-center">Lease Signed!</h3>
                <p className="text-slate-400 text-sm font-medium text-center max-w-sm">
                  {mode === 'sign'
                    ? 'Both signatures are now on file. Next step: book your handover date with the agent.'
                    : 'Your lease agreement has been digitally signed.'}
                </p>

              </motion.div>
            ) : step === 'sign' ? (
              <motion.div key="sign" className="flex flex-col h-full max-h-[90vh]">
                {/* Sign Header */}
                <div className="bg-[hsl(var(--navy))] px-6 pt-6 pb-5 shrink-0">
                  <button
                    onClick={() => mode === 'sign' ? onClose() : setStep('review')}
                    className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                  <div className="flex items-center gap-2 mb-2">
                    <Pen className="w-4 h-4 text-[hsl(var(--escrow-green))]" />
                  </div>
                  <h1 className="text-white font-black text-xl">Sign Your Lease</h1>
                  <p className="text-white/40 text-sm font-medium mt-1">{propertyTitle}</p>
                  {mode === 'sign' && (
                    <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[hsl(var(--escrow-green))]/15 border border-[hsl(var(--escrow-green))]/30">
                      <CheckCircle2 className="w-3 h-3 text-[hsl(var(--escrow-green))]" />
                      <span className="text-[hsl(var(--escrow-green))] text-[10px] font-black uppercase tracking-wider">
                        Agent {agentName} has signed
                      </span>
                    </div>
                  )}
                </div>


                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                  {/* Signature Mode Toggle */}
                  <div className="flex gap-2 bg-slate-100 rounded-xl p-1">
                    {(['type', 'draw', 'upload'] as SignatureMode[]).map(mode => (
                      <button
                        key={mode}
                        onClick={() => setSignatureMode(mode)}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all capitalize ${
                          signatureMode === mode ? 'bg-white text-primary shadow-sm' : 'text-slate-400'
                        }`}
                      >
                        {mode === 'type' ? '✍️ Type' : mode === 'draw' ? '🖊️ Draw' : '📷 Upload'}
                      </button>
                    ))}
                  </div>

                  {signatureMode === 'type' && (
                    <div>
                      <label className="text-slate-600 text-[11px] font-bold uppercase tracking-wider mb-2 block">
                        Type Your Full Legal Name
                      </label>
                      <input
                        type="text"
                        value={typedSignature}
                        onChange={e => setTypedSignature(e.target.value)}
                        placeholder="e.g. Adaeze Okonkwo"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/5"
                      />
                      {typedSignature && (
                        <div className="mt-4 p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                          <p className="text-3xl font-serif italic text-slate-800">{typedSignature}</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-wider">Digital Signature Preview</p>
                        </div>
                      )}
                    </div>
                  )}

                  {signatureMode === 'draw' && (
                    <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl text-center">
                      <Pen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm font-medium">Draw your signature here</p>
                      <p className="text-slate-300 text-xs font-medium mt-1">Use your finger or stylus</p>
                    </div>
                  )}

                  {signatureMode === 'upload' && (
                    <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl text-center">
                      <Download className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm font-medium">Upload a photo of your signature</p>
                      <button className="mt-3 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:border-slate-300 transition-all">
                        Choose File
                      </button>
                    </div>
                  )}

                  {/* Legal Agreement */}
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-amber-700 text-xs font-medium">
                      By signing, you agree to the terms outlined in the Tenancy Agreement for {propertyTitle}. This is a legally binding digital signature.
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 pt-3 border-t border-slate-100 shrink-0">
                  <button
                    onClick={handleSign}
                    disabled={signatureMode === 'type' && !typedSignature}
                    className={`w-full h-14 rounded-full font-bold text-sm shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                      (signatureMode === 'type' && typedSignature) || signatureMode !== 'type'
                        ? 'bg-primary text-white hover:bg-primary/90'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    }`}
                  >
                    <Pen className="w-5 h-5" />
                    Sign & Submit
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="review" className="flex flex-col lg:flex-row h-full max-h-[90vh]">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 border border-slate-200 flex items-center justify-center hover:bg-white transition-colors"
                >
                  <X className="w-4 h-4 text-slate-600" />
                </button>

                {/* Main - PDF Viewer with Commentable Clauses */}
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="bg-[hsl(var(--navy))] px-6 pt-6 pb-4 shrink-0">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-[hsl(var(--escrow-green))]" />
                    </div>
                    <h1 className="text-white font-black text-xl">Lease Agreement</h1>
                    <p className="text-white/40 text-sm font-medium mt-1">{propertyTitle} • Agent {agentName}</p>
                  </div>
                  
                  <div
                    className="flex-1 overflow-y-auto bg-slate-50 p-6"
                    onScroll={handleScroll}
                  >
                    {/* Simulated PDF with commentable clauses */}
                    <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm max-w-2xl mx-auto space-y-6 relative">
                      <div className="text-center border-b border-slate-200 pb-6">
                        <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider">Tenancy Agreement</h2>
                        <p className="text-slate-400 text-xs font-medium mt-1">Between Landlord (via Agent) and Tenant</p>
                      </div>
                      
                      <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                        {leaseClauses.map(clause => {
                          const clauseComments = getCommentsForClause(clause.index);
                          const hasUnresolved = clauseComments.some(c => !c.resolved);
                          const hasComments = clauseComments.length > 0;

                          return (
                            <div key={clause.index} className="group relative">
                              <div className={`flex items-start gap-1 transition-colors rounded-lg px-2 py-1.5 -mx-2 ${
                                hasComments
                                  ? hasUnresolved
                                    ? 'bg-primary/[0.04] border-l-2 border-primary/30'
                                    : 'bg-[hsl(var(--escrow-green))]/[0.03] border-l-2 border-[hsl(var(--escrow-green))]/20'
                                  : 'hover:bg-slate-50'
                              }`}>
                                <p className="flex-1">
                                  <span className="font-bold text-slate-800">{clause.index}. {clause.label}:</span>{' '}
                                  {clause.getContent(agentName, propertyTitle, rent)}
                                </p>
                                {!readOnly && (
                                  <ClauseCommentTrigger
                                    onClick={() => handleClauseComment(clause.index)}
                                    hasComments={hasComments}
                                    unresolvedCount={clauseComments.filter(c => !c.resolved).length}
                                  />
                                )}
                              </div>

                              {/* Inline comment popover */}
                              <AnimatePresence>
                                {activeCommentClause === clause.index && (
                                  <CommentPopover
                                    clauseIndex={clause.index}
                                    clauseLabel={clause.label}
                                    position={{ top: 0, left: 0 }}
                                    onSubmit={addComment}
                                    onClose={() => setActiveCommentClause(null)}
                                  />
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>

                      <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Landlord / Agent</p>
                          <div className="h-16 border-b-2 border-slate-300 flex items-end pb-1">
                            <p className="text-slate-800 font-serif italic text-lg">{agentName}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Tenant</p>
                          <div className="h-16 border-b-2 border-dashed border-slate-300 flex items-end pb-1">
                            <p className="text-slate-300 text-sm font-medium">Sign here →</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-200 bg-white flex flex-col shrink-0">
                  {/* Sidebar tab toggle */}
                  <div className="px-4 pt-4 pb-0 shrink-0">
                    <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
                      <button
                        onClick={() => setSidebarMode('highlights')}
                        className={`flex-1 py-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                          sidebarMode === 'highlights' ? 'bg-white text-primary shadow-sm' : 'text-slate-400'
                        }`}
                      >
                        <Sparkles className="w-3 h-3" /> Highlights
                      </button>
                      <button
                        onClick={() => setSidebarMode('comments')}
                        className={`flex-1 py-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                          sidebarMode === 'comments' ? 'bg-white text-primary shadow-sm' : 'text-slate-400'
                        }`}
                      >
                        <MessageSquare className="w-3 h-3" /> Comments
                        {unresolvedCount > 0 && (
                          <span className="w-4 h-4 rounded-full bg-primary text-white text-[9px] font-black flex items-center justify-center">
                            {unresolvedCount}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {sidebarMode === 'highlights' ? (
                    <>
                      <div className="px-5 pt-4 pb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="w-4 h-4 text-primary fill-primary/20" />
                          <h3 className="text-slate-900 font-black text-sm">Houzii Highlights</h3>
                        </div>
                        <p className="text-slate-400 text-[10px] font-medium">Key clauses at a glance</p>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {leaseHighlights.map((hl, i) => (
                          <motion.div
                            key={hl.id}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl"
                          >
                            <div className="flex items-start gap-2.5">
                              <span className="text-lg">{hl.icon}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{hl.label}</p>
                                <p className="text-sm font-black text-slate-800 mt-0.5">{hl.value}</p>
                                <p className="text-[10px] text-slate-400 font-medium mt-1">{hl.detail}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <CommentsPanel
                      comments={comments}
                      onResolve={resolveComment}
                      onDelete={deleteComment}
                      onReply={replyToComment}
                      currentUser="seeker"
                    />
                  )}

                  {/* Actions */}
                  {readOnly ? (
                    <div className="p-4 border-t border-slate-100">
                      <div className="flex items-center gap-2 p-3 bg-[hsl(var(--escrow-green))]/10 rounded-xl border border-[hsl(var(--escrow-green))]/20">
                        <CheckCircle2 className="w-4 h-4 text-[hsl(var(--escrow-green))]" />
                        <div>
                          <p className="text-[hsl(var(--escrow-green))] font-bold text-xs">Lease Signed & Executed</p>
                          <p className="text-slate-500 text-[10px] font-medium">Both parties have signed this agreement</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 border-t border-slate-100 space-y-2">
                      {unresolvedCount > 0 && <UnresolvedGate count={unresolvedCount} />}
                      <button
                        onClick={() => setShowLawyerPopup(true)}
                        className="w-full h-10 border-2 border-[hsl(var(--escrow-amber))] text-[hsl(var(--escrow-amber))] rounded-xl font-bold text-xs transition-all hover:bg-[hsl(var(--escrow-amber))]/5 flex items-center justify-center gap-1.5"
                      >
                        <Gavel className="w-3.5 h-3.5" />
                        Request Lawyer Review
                      </button>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="block">
                            <button
                              onClick={() => onAccept?.()}
                              disabled={!canSign || !onAccept}
                              className={`w-full h-12 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                                canSign
                                  ? 'bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20'
                                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              <ShieldCheck className="w-4 h-4" />
                              {!hasScrolledToEnd ? 'Read Full Lease First' : canSign ? 'Accept Lease & Proceed to Payment' : 'Resolve Comments First'}
                              {canSign && <ArrowRight className="w-4 h-4" />}
                            </button>
                          </span>
                        </TooltipTrigger>
                        {!canSign && unresolvedCount > 0 && (
                          <TooltipContent side="top">
                            <p className="text-xs font-medium">Please resolve all comments before accepting.</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                      <button
                        onClick={() => setShowDeclineConfirm(true)}
                        className="w-full h-10 border border-slate-200 text-slate-500 rounded-xl font-bold text-xs transition-all hover:bg-slate-50 hover:text-[hsl(var(--escrow-red))] hover:border-[hsl(var(--escrow-red))]/30 flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Decline Lease
                      </button>
                      {!hasScrolledToEnd && (
                        <p className="text-[10px] text-slate-400 font-medium text-center">Scroll to the end of the lease to continue</p>
                      )}
                    </div>
                  )}

                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Lawyer Popup */}
          <AnimatePresence>
            {showLawyerPopup && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 flex items-center justify-center p-6 z-10"
                onClick={() => setShowLawyerPopup(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[hsl(var(--escrow-amber))]/10 flex items-center justify-center">
                      <Gavel className="w-5 h-5 text-[hsl(var(--escrow-amber))]" />
                    </div>
                    <div>
                      <h4 className="text-slate-900 font-black text-sm">Houzii Legal Partners</h4>
                      <p className="text-slate-400 text-[10px] font-medium">Expert review within 24 hours</p>
                    </div>
                  </div>
                  <p className="text-slate-500 text-xs font-medium mb-5">
                    A verified Houzii legal partner will review your lease agreement and highlight any concerns. Standard review fee: ₦25,000.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowLawyerPopup(false)}
                      className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setShowLawyerPopup(false)}
                      className="flex-1 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-all"
                    >
                      Request Review
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Decline Confirmation Popup */}
          <AnimatePresence>
            {showDeclineConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 flex items-center justify-center p-6 z-10"
                onClick={() => setShowDeclineConfirm(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[hsl(var(--escrow-red))]/10 flex items-center justify-center">
                      <XCircle className="w-5 h-5 text-[hsl(var(--escrow-red))]" />
                    </div>
                    <div>
                      <h4 className="text-slate-900 font-black text-sm">Decline this lease?</h4>
                      <p className="text-slate-400 text-[10px] font-medium">You're saying you're no longer interested</p>
                    </div>
                  </div>
                  <p className="text-slate-500 text-xs font-medium mb-5">
                    Declining will withdraw your application for <span className="font-bold text-slate-700">{propertyTitle}</span>.
                    The agent will be notified and the property released to other seekers. This action can't be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeclineConfirm(false)}
                      className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all"
                    >
                      Keep Reviewing
                    </button>
                    <button
                      onClick={() => {
                        setShowDeclineConfirm(false);
                        onDecline?.();
                      }}
                      className="flex-1 py-2.5 bg-[hsl(var(--escrow-red))] text-white rounded-xl text-xs font-bold hover:brightness-110 transition-all"
                    >
                      Yes, Decline
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>
    </TooltipProvider>
  );
};
