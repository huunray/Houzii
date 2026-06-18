import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Upload, FileText, PenTool, CheckCircle2,
  Lock, Camera, ChevronRight, Zap, Clock
} from 'lucide-react';

interface Deal {
  id: number;
  pipeline: 'rental' | 'sale';
  property: string;
  amount: string;
  seekerName: string;
}

interface Props {
  deal: Deal;
  onClose: () => void;
  onOpenSignature: () => void;
  onSubmitAll: () => void;
}

interface DocSlot {
  id: string;
  label: string;
  type: 'evidence' | 'legal';
  uploaded: boolean;
}

const rentalEvidence: DocSlot[] = [
  { id: 'phcn', label: 'PHCN / Utility Meter Card', type: 'evidence', uploaded: false },
  { id: 'house-rules', label: 'House Rules PDF', type: 'evidence', uploaded: false },
  { id: 'rent-receipt', label: 'Rent Receipt', type: 'evidence', uploaded: false },
];

const rentalLegal: DocSlot[] = [
  { id: 'tenancy-agreement', label: 'Tenancy Agreement', type: 'legal', uploaded: false },
];

const saleEvidence: DocSlot[] = [
  { id: 'survey-plan', label: 'Survey Plan', type: 'evidence', uploaded: false },
  { id: 'family-receipt', label: 'Family Receipt', type: 'evidence', uploaded: false },
  { id: 'cof-o', label: 'Certificate of Occupancy (C of O)', type: 'evidence', uploaded: false },
];

const saleLegal: DocSlot[] = [
  { id: 'deed', label: 'Deed of Assignment', type: 'legal', uploaded: false },
  { id: 'governors-consent', label: "Governor's Consent", type: 'legal', uploaded: false },
];

export const AgentDocumentPortal: React.FC<Props> = ({ deal, onClose, onOpenSignature, onSubmitAll }) => {
  const isRental = deal.pipeline === 'rental';
  const evidenceDocs = isRental ? rentalEvidence : saleEvidence;
  const legalDocs = isRental ? rentalLegal : saleLegal;

  const [uploadedDocs, setUploadedDocs] = useState<Set<string>>(new Set());
  const [signingPath, setSigningPath] = useState<Record<string, 'digital' | 'manual' | null>>({});

  const handleUpload = (docId: string) => {
    setUploadedDocs(prev => new Set([...prev, docId]));
  };

  const selectPath = (docId: string, path: 'digital' | 'manual') => {
    setSigningPath(prev => ({ ...prev, [docId]: path }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
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
        className="relative w-full max-w-lg max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-slate-900 font-black text-lg">Document Portal</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            {deal.property} · {deal.seekerName}
          </p>
          <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            isRental
              ? 'bg-blue-50 text-blue-600 border border-blue-200'
              : 'bg-amber-50 text-amber-600 border border-amber-200'
          }`}>
            {isRental ? '🔑 Rental Pipeline' : '🏷️ Sale Pipeline'}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Evidence-Only Uploads */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Upload className="w-4 h-4 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                Evidence Uploads
              </span>
            </div>

            <div className="space-y-3">
              {evidenceDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      uploadedDocs.has(doc.id) ? 'bg-[hsl(var(--escrow-green))]/10' : 'bg-white'
                    }`}>
                      {uploadedDocs.has(doc.id) ? (
                        <CheckCircle2 className="w-4 h-4 text-[hsl(var(--escrow-green))]" />
                      ) : (
                        <FileText className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <span className={`text-sm font-bold ${uploadedDocs.has(doc.id) ? 'text-[hsl(var(--escrow-green))]' : 'text-slate-700'}`}>
                      {doc.label}
                    </span>
                  </div>
                  {!uploadedDocs.has(doc.id) ? (
                    <button
                      onClick={() => handleUpload(doc.id)}
                      className="h-8 px-4 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:border-primary hover:text-primary transition-all flex items-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      Upload
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-[hsl(var(--escrow-green))] uppercase">Done</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Legal Signatures */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <PenTool className="w-4 h-4 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                Legal Signatures
              </span>
            </div>

            <div className="space-y-4">
              {legalDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h5 className="text-slate-900 font-bold text-sm">{doc.label}</h5>
                        <p className="text-slate-400 text-[11px] font-medium">Choose signing method</p>
                      </div>
                    </div>

                    {/* Path selector */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => { selectPath(doc.id, 'digital'); onOpenSignature(); }}
                        className={`p-3 rounded-2xl border-2 transition-all text-left ${
                          signingPath[doc.id] === 'digital'
                            ? 'border-primary bg-primary/5'
                            : 'border-slate-200 hover:border-primary/30'
                        }`}
                      >
                        <Zap className="w-5 h-5 text-primary mb-2" />
                        <p className="text-slate-900 text-xs font-bold">Digital Path</p>
                        <p className="text-slate-400 text-[10px] font-medium mt-0.5">Sign now on Houzii. No printing needed.</p>
                      </button>
                      <button
                        onClick={() => selectPath(doc.id, 'manual')}
                        className={`p-3 rounded-2xl border-2 transition-all text-left ${
                          signingPath[doc.id] === 'manual'
                            ? 'border-primary bg-primary/5'
                            : 'border-slate-200 hover:border-primary/30'
                        }`}
                      >
                        <Clock className="w-5 h-5 text-amber-500 mb-2" />
                        <p className="text-slate-900 text-xs font-bold">Manual Path</p>
                        <p className="text-slate-400 text-[10px] font-medium mt-0.5">Sign on paper during the handover.</p>
                      </button>
                    </div>

                    {signingPath[doc.id] === 'manual' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl"
                      >
                        <p className="text-amber-600 text-xs font-bold">
                          📋 Waiting for Handover Meeting. Upload signed documents after the physical meeting.
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {/* Oracle lock for sale documents */}
                  {!isRental && (
                    <div className="px-4 py-3 bg-amber-50/50 border-t border-amber-200/50 flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-amber-600 text-[10px] font-bold">
                        Requires Human Oracle Verification before fund release
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 shrink-0 bg-white">
          {(() => {
            const allEvidenceUploaded = evidenceDocs.every(d => uploadedDocs.has(d.id));
            const allLegalSigned = legalDocs.every(d => signingPath[d.id] != null);
            const canSubmit = allEvidenceUploaded && allLegalSigned;
            return (
              <button
                onClick={canSubmit ? onSubmitAll : undefined}
                disabled={!canSubmit}
                className={`w-full h-12 rounded-full font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                  canSubmit
                    ? 'bg-primary hover:brightness-110 text-white shadow-md shadow-primary/20'
                    : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Submit All Documents
                <ChevronRight className="w-4 h-4" />
              </button>
            );
          })()}
        </div>
      </motion.div>
    </div>
  );
};
