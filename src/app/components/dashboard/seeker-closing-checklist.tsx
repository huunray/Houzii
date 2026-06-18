import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Eye, Download, FileText, Lock, CheckCircle2,
  ChevronRight, Shield, Clock, ArrowRight,
  PenTool, Calendar, AlertTriangle, Zap,
  Type, Image, Upload, Info, X
} from 'lucide-react';

type Pipeline = 'rental' | 'sale';
type SigningPath = 'digital' | 'manual';
type SignMethod = 'type' | 'draw' | 'upload';

interface ClosingDeal {
  id: number;
  pipeline: Pipeline;
  property: string;
  amount: string;
  agentName: string;
  agentSigningPath: SigningPath;
  walkthroughDate?: string;
  oracleVerified?: boolean;
  agentHandoverComplete?: boolean;
}

interface Props {
  deal: ClosingDeal;
  onClose: () => void;
  onReleaseFunds: () => void;
}

interface EvidenceDoc {
  id: string;
  label: string;
  uploaded: boolean;
}

const rentalEvidence: EvidenceDoc[] = [
  { id: 'phcn', label: 'PHCN / Utility Meter Card', uploaded: true },
  { id: 'house-rules', label: 'House Rules PDF', uploaded: true },
  { id: 'rent-receipt', label: 'Rent Receipt', uploaded: false },
];

const saleEvidence: EvidenceDoc[] = [
  { id: 'survey-plan', label: 'Survey Plan', uploaded: true },
  { id: 'family-receipt', label: 'Family Receipt', uploaded: true },
  { id: 'cof-o', label: 'Certificate of Occupancy (C of O)', uploaded: false },
];

const progressSteps = {
  rental: ['Payment Confirmed', 'Documents Verified', 'Handover'],
  sale: ['Payment Confirmed', 'Oracle Verified', 'Documents Signed', 'Handover'],
};

const scriptFonts = [
  { name: 'Elegant Script', style: 'font-serif italic' },
  { name: 'Bold Signature', style: 'font-serif font-bold' },
  { name: 'Classic Hand', style: 'font-mono italic' },
];

export const SeekerClosingChecklist: React.FC<Props> = ({ deal, onClose, onReleaseFunds }) => {
  const isRental = deal.pipeline === 'rental';
  const isDigital = deal.agentSigningPath === 'digital';
  const evidenceDocs = isRental ? rentalEvidence : saleEvidence;
  const contractName = isRental ? 'Tenancy Agreement' : 'Deed of Assignment';

  const [viewedDocs, setViewedDocs] = useState<Set<string>>(new Set());
  const [currentView, setCurrentView] = useState<'dashboard' | 'pdf-preview' | 'signature' | 'handover'>('dashboard');
  const [hasReviewedContract, setHasReviewedContract] = useState(false);
  const [seekerSigned, setSeekerSigned] = useState(false);

  // Signature state
  const [signMethod, setSignMethod] = useState<SignMethod>('type');
  const [legalName, setLegalName] = useState('');
  const [selectedFont, setSelectedFont] = useState(0);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [uploadedSig, setUploadedSig] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const lastPos = React.useRef<{ x: number; y: number } | null>(null);

  // Handover verification
  const [executedDocViewed, setExecutedDocViewed] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [fundsReleased, setFundsReleased] = useState(false);

  const steps = progressSteps[deal.pipeline];
  const currentStep = seekerSigned ? (deal.agentHandoverComplete ? steps.length - 1 : steps.length - 2) : 1;

  const oracleBlocked = !isRental && !deal.oracleVerified;

  const handleViewDoc = (docId: string) => {
    setViewedDocs(prev => new Set([...prev, docId]));
  };

  const canSign = () => {
    if (!legalName.trim()) return false;
    if (signMethod === 'type') return true;
    if (signMethod === 'draw') return hasDrawn;
    if (signMethod === 'upload') return uploadedSig;
    return false;
  };

  const handleSign = () => {
    setSeekerSigned(true);
    setCurrentView('dashboard');
  };

  const handleSlideStart = () => {
    if (!executedDocViewed) return;
    setIsSliding(true);
  };

  const handleSlideMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isSliding) return;
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const progress = Math.max(0, Math.min(1, (clientX - rect.left - 30) / (rect.width - 60)));
    setSlideProgress(progress);
    if (progress >= 0.95) {
      setFundsReleased(true);
      setIsSliding(false);
      setTimeout(() => onReleaseFunds(), 1500);
    }
  };

  const handleSlideEnd = () => {
    if (!fundsReleased) {
      setSlideProgress(0);
    }
    setIsSliding(false);
  };

  // Drawing handlers
  const startDraw = React.useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    lastPos.current = { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  const drawOnCanvas = React.useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current || !lastPos.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.stroke();
    lastPos.current = { x: clientX - rect.left, y: clientY - rect.top };
    setHasDrawn(true);
  }, [isDrawing]);

  const endDraw = React.useCallback(() => {
    setIsDrawing(false);
    lastPos.current = null;
  }, []);

  // ─── PDF Preview View ───
  if (currentView === 'pdf-preview') {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setCurrentView('dashboard')} />
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative w-full max-w-lg max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
          <div className="px-6 pt-5 pb-4 border-b border-slate-100 shrink-0 flex items-center justify-between">
            <div>
              <h3 className="text-slate-900 font-black text-lg">{contractName}</h3>
              <p className="text-slate-400 text-sm font-medium">Review terms before signing</p>
            </div>
            <button onClick={() => { setHasReviewedContract(true); setCurrentView('dashboard'); }} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-primary" />
                <span className="text-sm font-bold text-slate-700">{contractName}.pdf</span>
              </div>
              <div className="space-y-3 text-xs text-slate-500 leading-relaxed">
                <p className="font-bold text-slate-700 text-sm">Sample Document Preview</p>
                <div className="h-px bg-slate-200" />
                <p><span className="font-bold text-slate-700">Property:</span> {deal.property}</p>
                <p><span className="font-bold text-slate-700">Amount:</span> {deal.amount}</p>
                <p><span className="font-bold text-slate-700">Agent:</span> {deal.agentName}</p>
                <div className="h-px bg-slate-200" />
                <p>This {isRental ? 'Tenancy Agreement' : 'Deed of Assignment'} is entered into between the parties mentioned above for the transfer of {isRental ? 'tenancy rights' : 'ownership'} of the property described herein...</p>
                <p>TERMS AND CONDITIONS: The {isRental ? 'Tenant' : 'Buyer'} agrees to abide by all regulations set forth in this document. The {isRental ? 'Landlord' : 'Seller'} warrants that the property is free of all encumbrances...</p>
                <p>PAYMENT: The total sum of {deal.amount} has been secured in Houzii Escrow and will be released upon successful completion of all closing milestones...</p>
                {!isRental && <p>TITLE VERIFICATION: The Houzii Oracle has verified the authenticity and legal standing of all title documents associated with this property...</p>}
              </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-slate-100 shrink-0">
            <button
              onClick={() => { setHasReviewedContract(true); setCurrentView('dashboard'); }}
              className="w-full h-12 rounded-full bg-primary text-white font-bold text-sm shadow-md shadow-primary/20 hover:brightness-110 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              I've Reviewed the Terms
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Signature View ───
  if (currentView === 'signature') {
    const sigTabs: { id: SignMethod; label: string; icon: React.ReactNode }[] = [
      { id: 'type', label: 'Type', icon: <Type className="w-4 h-4" /> },
      { id: 'draw', label: 'Draw', icon: <PenTool className="w-4 h-4" /> },
      { id: 'upload', label: 'Upload', icon: <Image className="w-4 h-4" /> },
    ];

    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCurrentView('dashboard')} />
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
          <div className="px-6 pt-5 pb-4 border-b border-slate-100 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-slate-900 font-black text-lg">Sign {contractName}</h3>
              <button onClick={() => setCurrentView('dashboard')} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-slate-400 text-sm font-medium">Your digital signature is legally binding</p>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Legal Name */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block">Full Legal Name (Must Match KYC)</label>
              <input
                type="text"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                placeholder="Enter your full legal name"
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-full text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            {/* Method Tabs */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 block">Signature Method</label>
              <div className="flex gap-2 bg-slate-100 rounded-full p-1">
                {sigTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSignMethod(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full font-bold text-xs transition-all ${
                      signMethod === tab.id ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Signature Area */}
            {signMethod === 'type' && (
              <div className="space-y-3">
                {scriptFonts.map((font, i) => (
                  <button key={i} onClick={() => setSelectedFont(i)} className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${selectedFont === i ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary/30'}`}>
                    <p className="text-[10px] text-slate-400 font-bold mb-1">{font.name}</p>
                    <p className={`text-2xl text-slate-900 ${font.style}`}>{legalName || 'Your Name'}</p>
                  </button>
                ))}
              </div>
            )}

            {signMethod === 'draw' && (
              <div>
                <div className="relative border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden bg-white">
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={200}
                    className="w-full h-[200px] cursor-crosshair touch-none"
                    onMouseDown={startDraw}
                    onMouseMove={drawOnCanvas}
                    onMouseUp={endDraw}
                    onMouseLeave={endDraw}
                    onTouchStart={startDraw}
                    onTouchMove={drawOnCanvas}
                    onTouchEnd={endDraw}
                  />
                  {!hasDrawn && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <p className="text-slate-300 text-sm font-bold">Draw your signature here</p>
                    </div>
                  )}
                </div>
                {hasDrawn && (
                  <button onClick={() => { const ctx = canvasRef.current?.getContext('2d'); if (ctx) ctx.clearRect(0, 0, 400, 200); setHasDrawn(false); }} className="mt-2 text-xs text-primary font-bold hover:underline">Clear & Redo</button>
                )}
              </div>
            )}

            {signMethod === 'upload' && (
              <div>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary/30 transition-all" onClick={() => setUploadedSig(true)}>
                  {uploadedSig ? (
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6 text-[hsl(var(--escrow-green))]" />
                      <span className="text-[hsl(var(--escrow-green))] font-bold text-sm">Signature uploaded</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-slate-300 mb-3" />
                      <p className="text-slate-500 text-sm font-bold mb-1">Upload signature image</p>
                      <p className="text-slate-400 text-xs text-center">Photo of your signature on white paper</p>
                    </>
                  )}
                </div>
                <div className="mt-3 flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-2xl">
                  <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-blue-600 text-[11px] font-bold leading-relaxed">Sign on a plain white paper in a well-lit room. Use a dark pen for best results.</p>
                </div>
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-slate-100 shrink-0">
            <button
              onClick={handleSign}
              disabled={!canSign()}
              className={`w-full h-12 rounded-full font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                canSign() ? 'bg-primary hover:brightness-110 text-white shadow-md shadow-primary/20' : 'bg-slate-100 text-slate-300 cursor-not-allowed'
              }`}
            >
              <PenTool className="w-4 h-4" />
              Sign & Confirm
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Handover Verification View ───
  if (currentView === 'handover') {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setCurrentView('dashboard')} />
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative w-full max-w-lg max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
          <div className="px-6 pt-5 pb-4 border-b border-slate-100 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-[hsl(var(--escrow-green))]" />
                  <span className="text-[10px] font-bold text-[hsl(var(--escrow-green))] uppercase tracking-[0.2em]">Final Verification</span>
                </div>
                <h3 className="text-slate-900 font-black text-lg">Confirm Handover & Release</h3>
              </div>
              <button onClick={() => setCurrentView('dashboard')} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-slate-400 text-sm font-medium">{deal.property} · {deal.amount} in escrow</p>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Agent completed handover notification */}
            <div className="bg-[hsl(var(--escrow-green))]/5 border border-[hsl(var(--escrow-green))]/20 rounded-2xl p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[hsl(var(--escrow-green))]/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-[hsl(var(--escrow-green))]" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Agent {deal.agentName} has marked handover as complete</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Review the executed documents before releasing funds</p>
              </div>
            </div>

            {/* Executed documents */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Executed Documents</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{contractName} (Executed)</p>
                      <p className="text-[11px] text-slate-400 font-medium">Signed by both parties</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setExecutedDocViewed(true)}
                    className={`h-9 px-4 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                      executedDocViewed
                        ? 'bg-[hsl(var(--escrow-green))]/10 text-[hsl(var(--escrow-green))] border border-[hsl(var(--escrow-green))]/20'
                        : 'bg-primary text-white hover:brightness-110'
                    }`}
                  >
                    {executedDocViewed ? <><CheckCircle2 className="w-3.5 h-3.5" /> Viewed</> : <><Eye className="w-3.5 h-3.5" /> View</>}
                  </button>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-amber-700 text-xs font-bold leading-relaxed">
                By sliding to confirm, you verify that you have received all original documents and physical possession of the property. Funds ({deal.amount}) will be released to Agent {deal.agentName}.
              </p>
            </div>
          </div>

          {/* Slide to Release */}
          <div className="px-6 py-5 border-t border-slate-100 shrink-0">
            {fundsReleased ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-14 rounded-full bg-[hsl(var(--escrow-green))] flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span className="text-white font-black text-sm">Funds Released!</span>
              </motion.div>
            ) : (
              <div
                className={`relative h-14 rounded-full overflow-hidden select-none ${
                  executedDocViewed ? 'bg-[hsl(var(--escrow-green))]/10 border-2 border-[hsl(var(--escrow-green))]/30' : 'bg-slate-100 border-2 border-slate-200'
                }`}
                onMouseMove={handleSlideMove}
                onMouseUp={handleSlideEnd}
                onMouseLeave={handleSlideEnd}
                onTouchMove={handleSlideMove}
                onTouchEnd={handleSlideEnd}
              >
                {/* Track fill */}
                <div
                  className="absolute inset-y-0 left-0 bg-[hsl(var(--escrow-green))]/20 rounded-full transition-none"
                  style={{ width: `${slideProgress * 100}%` }}
                />
                {/* Label */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className={`text-xs font-bold ${executedDocViewed ? 'text-[hsl(var(--escrow-green))]' : 'text-slate-400'}`}>
                    {executedDocViewed ? 'Slide to Confirm Move-in & Release Funds →' : 'View executed documents first'}
                  </span>
                </div>
                {/* Thumb */}
                {executedDocViewed && (
                  <div
                    className="absolute top-1 bottom-1 w-12 rounded-full bg-[hsl(var(--escrow-green))] shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing"
                    style={{ left: `${Math.max(4, slideProgress * (100 - 15))}%`, transition: isSliding ? 'none' : 'left 0.3s ease' }}
                    onMouseDown={handleSlideStart}
                    onTouchStart={handleSlideStart}
                  >
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Main Dashboard View ───
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[hsl(var(--navy))] px-6 pt-5 pb-5 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-[hsl(var(--escrow-green))]" />
                <span className="text-[10px] font-bold text-[hsl(var(--escrow-green))] uppercase tracking-[0.2em]">Closing Dashboard</span>
              </div>
              <h3 className="text-white font-black text-lg">{deal.property}</h3>
              <p className="text-white/40 text-sm font-medium mt-0.5">{deal.amount} in escrow · Agent {deal.agentName}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-1 mt-4">
            {steps.map((step, i) => (
              <div key={step} className="flex-1">
                <div className={`h-1.5 rounded-full transition-all ${i <= currentStep ? 'bg-[hsl(var(--escrow-green))]' : 'bg-white/15'}`} />
                <p className={`text-[9px] font-bold mt-1.5 ${i <= currentStep ? 'text-[hsl(var(--escrow-green))]' : 'text-white/30'}`}>{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Pipeline badge */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            isRental ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-amber-50 text-amber-600 border border-amber-200'
          }`}>
            {isRental ? '🔑 Rental Closing' : '🏷️ Sale Closing'}
          </div>

          {/* Oracle Gate for Sales */}
          {!isRental && (
            <div className={`rounded-2xl p-4 flex items-start gap-3 border ${
              deal.oracleVerified
                ? 'bg-[hsl(var(--escrow-green))]/5 border-[hsl(var(--escrow-green))]/20'
                : 'bg-amber-50 border-amber-200'
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                deal.oracleVerified ? 'bg-[hsl(var(--escrow-green))]/10' : 'bg-amber-100'
              }`}>
                {deal.oracleVerified ? (
                  <CheckCircle2 className="w-5 h-5 text-[hsl(var(--escrow-green))]" />
                ) : (
                  <Lock className="w-5 h-5 text-amber-500" />
                )}
              </div>
              <div>
                <p className={`text-sm font-bold ${deal.oracleVerified ? 'text-[hsl(var(--escrow-green))]' : 'text-amber-700'}`}>
                  {deal.oracleVerified ? 'Oracle Verified ✓' : 'Deed of Assignment: Awaiting Oracle Verification'}
                </p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {deal.oracleVerified
                    ? 'Title documents have been verified by the Houzii Oracle. You may proceed.'
                    : 'You cannot view or sign until the Houzii Oracle confirms the title is clean.'}
                </p>
              </div>
            </div>
          )}

          {/* Evidence Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-4 h-4 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Promised Documents</span>
            </div>

            <div className="space-y-3">
              {evidenceDocs.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${doc.uploaded ? 'bg-[hsl(var(--escrow-green))]/10' : 'bg-white'}`}>
                      {doc.uploaded ? <CheckCircle2 className="w-4 h-4 text-[hsl(var(--escrow-green))]" /> : <Clock className="w-4 h-4 text-slate-300" />}
                    </div>
                    <div>
                      <span className={`text-sm font-bold ${doc.uploaded ? 'text-slate-700' : 'text-slate-400'}`}>{doc.label}</span>
                      {!doc.uploaded && <p className="text-[10px] text-slate-400 font-medium">Pending agent upload</p>}
                    </div>
                  </div>
                  {doc.uploaded && (
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleViewDoc(doc.id)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${viewedDocs.has(doc.id) ? 'bg-[hsl(var(--escrow-green))]/10 text-[hsl(var(--escrow-green))]' : 'bg-white border border-slate-200 text-slate-400 hover:text-primary hover:border-primary'}`}>
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-primary hover:border-primary flex items-center justify-center transition-all">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Legal / Contract Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <PenTool className="w-4 h-4 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Legal Contract</span>
            </div>

            <div className={`bg-white border rounded-2xl overflow-hidden ${oracleBlocked ? 'border-amber-200 opacity-60' : 'border-slate-200'}`}>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-slate-900 font-bold text-sm">{contractName}</h5>
                    <p className="text-slate-400 text-[11px] font-medium">
                      {seekerSigned ? 'Signed ✓' : isDigital ? 'Digital signature required' : `Physical signing on ${deal.walkthroughDate || 'scheduled date'}`}
                    </p>
                  </div>
                  {seekerSigned && (
                    <div className="w-8 h-8 rounded-full bg-[hsl(var(--escrow-green))]/10 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-[hsl(var(--escrow-green))]" />
                    </div>
                  )}
                </div>

                {oracleBlocked ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-500" />
                    <p className="text-amber-600 text-xs font-bold">Blocked until Oracle verifies title</p>
                  </div>
                ) : !seekerSigned ? (
                  <div className="space-y-3">
                    {/* Read Terms CTA */}
                    <button
                      onClick={() => setCurrentView('pdf-preview')}
                      className={`w-full h-11 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                        hasReviewedContract
                          ? 'bg-[hsl(var(--escrow-green))]/10 text-[hsl(var(--escrow-green))] border border-[hsl(var(--escrow-green))]/20'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {hasReviewedContract ? <><CheckCircle2 className="w-4 h-4" /> Terms Reviewed</> : <><Eye className="w-4 h-4" /> Read Terms</>}
                    </button>

                    {/* Digital Path - Sign CTA */}
                    {isDigital && hasReviewedContract && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <button
                          onClick={() => setCurrentView('signature')}
                          className="w-full h-11 rounded-full bg-primary text-white font-bold text-sm shadow-md shadow-primary/20 hover:brightness-110 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                          <Zap className="w-4 h-4" />
                          Sign {contractName}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </motion.div>
                    )}

                    {/* Manual Path - Info */}
                    {!isDigital && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4 text-amber-500" />
                          <span className="text-amber-700 text-xs font-bold">Physical Signing Required</span>
                        </div>
                        <p className="text-amber-600 text-[11px] font-medium leading-relaxed">
                          This document will be signed on your scheduled Walkthrough Date: <span className="font-bold">{deal.walkthroughDate || 'TBD'}</span>. You can download a draft for your lawyer now.
                        </p>
                        <button className="mt-2 h-9 px-4 rounded-full bg-white border border-amber-200 text-amber-700 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-50 transition-all">
                          <Download className="w-3.5 h-3.5" />
                          Preview Draft Copy
                        </button>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Handover Verification (appears after signing + agent marks complete) */}
          {seekerSigned && deal.agentHandoverComplete && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-[hsl(var(--escrow-green))]" />
                <span className="text-[10px] font-bold text-[hsl(var(--escrow-green))] uppercase tracking-[0.2em]">Handover Verification</span>
              </div>
              <div className="bg-[hsl(var(--escrow-green))]/5 border border-[hsl(var(--escrow-green))]/20 rounded-2xl p-4">
                <p className="text-sm font-bold text-slate-900 mb-1">Agent has uploaded the final signed documents</p>
                <p className="text-xs text-slate-500 font-medium mb-3">Review the executed copy before releasing funds.</p>
                <button
                  onClick={() => setCurrentView('handover')}
                  className="h-11 px-6 rounded-full bg-[hsl(var(--escrow-green))] text-white font-bold text-sm shadow-md shadow-[hsl(var(--escrow-green))]/20 hover:brightness-110 transition-all active:scale-[0.98] flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Verify & Release Funds
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Audit Trail Note */}
        <div className="px-6 py-3 border-t border-slate-100 shrink-0 bg-slate-50">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <p className="text-[10px] text-slate-400 font-bold">All documents are saved to your Houzii Wallet for permanent legal records</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
