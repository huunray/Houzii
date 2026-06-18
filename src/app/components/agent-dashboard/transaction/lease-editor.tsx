import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, FileText, Plus, Pencil, Check, Trash2, Upload, Eye,
  ArrowRight, Shield, ChevronRight, AlertCircle
} from 'lucide-react';
import { DealProgressTracker } from './deal-progress-tracker';

interface LeaseClause {
  id: number;
  label: string;
  value: string;
  editable: boolean;
  isCustom?: boolean;
}

interface LeaseEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToSign: () => void;
  propertyTitle: string;
  seekerName: string;
  amount: string;
}

const defaultClauses: LeaseClause[] = [
  { id: 1, label: 'Annual Rent', value: '₦4,500,000 per annum', editable: true },
  { id: 2, label: 'Caution Fee', value: '₦500,000 (Refundable)', editable: true },
  { id: 3, label: 'Service Charge', value: '₦350,000 per annum', editable: true },
  { id: 4, label: 'Agreement Fee', value: '₦150,000 (Non-refundable)', editable: true },
  { id: 5, label: 'Notice Period', value: '3 months written notice', editable: true },
  { id: 6, label: 'Duration', value: '12 months', editable: true },
  { id: 7, label: 'Commencement Date', value: 'Upon payment confirmation', editable: true },
  { id: 8, label: 'Permitted Use', value: 'Residential use only', editable: true },
];

export const LeaseEditor: React.FC<LeaseEditorProps> = ({
  isOpen, onClose, onProceedToSign, propertyTitle, seekerName, amount
}) => {
  const [activeTab, setActiveTab] = useState<'digital' | 'manual'>('digital');
  const [clauses, setClauses] = useState<LeaseClause[]>(defaultClauses);
  const [editingClause, setEditingClause] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newClauseLabel, setNewClauseLabel] = useState('');
  const [newClauseValue, setNewClauseValue] = useState('');
  const [showAddClause, setShowAddClause] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewed, setPreviewed] = useState(false);

  const startEdit = (clause: LeaseClause) => {
    setEditingClause(clause.id);
    setEditValue(clause.value);
  };

  const saveEdit = (id: number) => {
    setClauses(prev => prev.map(c => c.id === id ? { ...c, value: editValue } : c));
    setEditingClause(null);
  };

  const addCustomClause = () => {
    if (!newClauseLabel.trim() || !newClauseValue.trim()) return;
    setClauses(prev => [...prev, {
      id: Date.now(), label: newClauseLabel, value: newClauseValue, editable: true, isCustom: true,
    }]);
    setNewClauseLabel('');
    setNewClauseValue('');
    setShowAddClause(false);
  };

  const removeClause = (id: number) => {
    setClauses(prev => prev.filter(c => c.id !== id));
  };

  const majorClauses = clauses.filter(c => ['Annual Rent', 'Caution Fee', 'Service Charge', 'Notice Period'].includes(c.label));

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-4xl mx-4 overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-slate-900 font-black text-lg">Lease Agreement</h2>
              <p className="text-slate-400 text-xs font-medium mt-0.5">{propertyTitle} · {seekerName}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <DealProgressTracker currentStage="agreement" />
        </div>

        {/* Tab Switch */}
        <div className="px-6 pt-4 border-b border-slate-100">
          <div className="flex gap-1 bg-slate-100 rounded-xl p-1 max-w-xs">
            {[
              { id: 'digital' as const, label: 'Houzii Digital Lease' },
              { id: 'manual' as const, label: 'Manual Upload' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab.id ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'digital' ? (
            <motion.div
              key="digital"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex"
            >
              {/* Main Editor */}
              <div className="flex-1 p-6 max-h-[60vh] overflow-y-auto">
                <div className="mb-5">
                  <h3 className="text-slate-900 font-bold text-sm mb-1 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Tenancy Agreement
                  </h3>
                  <p className="text-slate-400 text-xs">Edit clauses or add custom terms before signing.</p>
                </div>

                <div className="space-y-3">
                  {clauses.map((clause) => (
                    <div key={clause.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">{clause.label}</p>
                          {editingClause === clause.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="flex-1 text-sm font-medium text-slate-800 bg-white border border-primary/30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                autoFocus
                              />
                              <button onClick={() => saveEdit(clause.id)} className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center">
                                <Check className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <p className="text-slate-800 text-sm font-medium">{clause.value}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 ml-3 shrink-0">
                          {clause.editable && editingClause !== clause.id && (
                            <button onClick={() => startEdit(clause)} className="w-7 h-7 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg flex items-center justify-center transition-colors">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {clause.isCustom && (
                            <button onClick={() => removeClause(clause.id)} className="w-7 h-7 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg flex items-center justify-center transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add Custom Clause */}
                  {showAddClause ? (
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-3">
                      <input
                        value={newClauseLabel}
                        onChange={(e) => setNewClauseLabel(e.target.value)}
                        placeholder="Clause title (e.g., Pet Policy)"
                        className="w-full text-sm font-medium text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <input
                        value={newClauseValue}
                        onChange={(e) => setNewClauseValue(e.target.value)}
                        placeholder="Clause details"
                        className="w-full text-sm font-medium text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <div className="flex gap-2">
                        <button onClick={addCustomClause} className="h-9 px-4 bg-primary text-white rounded-lg text-xs font-bold flex items-center gap-1.5">
                          <Plus className="w-3.5 h-3.5" /> Add Clause
                        </button>
                        <button onClick={() => setShowAddClause(false)} className="h-9 px-4 text-slate-500 rounded-lg text-xs font-bold hover:bg-slate-100">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddClause(true)}
                      className="w-full h-11 border-2 border-dashed border-slate-200 text-slate-400 rounded-xl text-sm font-bold hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add Custom Clause
                    </button>
                  )}
                </div>

                {/* Proceed CTA */}
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <button
                    onClick={onProceedToSign}
                    className="w-full h-12 bg-primary text-white rounded-xl font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/20"
                  >
                    <Shield className="w-4 h-4" />
                    Proceed to Sign
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sticky Sidebar - Major Clauses */}
              <div className="w-72 border-l border-slate-100 bg-slate-50 p-5 max-h-[60vh] overflow-y-auto hidden md:block">
                <h4 className="text-slate-900 font-black text-sm mb-1">Houzii Highlights</h4>
                <p className="text-slate-400 text-[10px] font-medium mb-4">What the tenant will see</p>

                <div className="space-y-3">
                  {majorClauses.map(clause => (
                    <div key={clause.id} className="bg-white border border-slate-200 rounded-xl p-3">
                      <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-1">{clause.label}</p>
                      <p className="text-slate-800 text-sm font-bold">{clause.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 p-3 bg-[hsl(var(--escrow-green))]/5 border border-[hsl(var(--escrow-green))]/20 rounded-xl">
                  <p className="text-[hsl(var(--escrow-green))] text-[10px] font-bold flex items-center gap-1.5">
                    <Shield className="w-3 h-3" /> Houzii Trust Protected
                  </p>
                  <p className="text-slate-500 text-[10px] mt-1 leading-relaxed">
                    All funds are held securely in escrow until handover is confirmed by both parties.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="manual"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 max-h-[60vh] overflow-y-auto"
            >
              <h3 className="text-slate-900 font-bold text-sm mb-1 flex items-center gap-2">
                <Upload className="w-4 h-4 text-primary" /> Upload Pre-Signed Document
              </h3>
              <p className="text-slate-400 text-xs mb-5">Upload a PDF of your pre-signed lease agreement.</p>

              {/* Drop zone */}
              <div
                className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors ${
                  uploadedFile
                    ? 'border-[hsl(var(--escrow-green))] bg-[hsl(var(--escrow-green))]/5'
                    : 'border-slate-200 hover:border-primary'
                }`}
              >
                {uploadedFile ? (
                  <div>
                    <FileText className="w-10 h-10 text-[hsl(var(--escrow-green))] mx-auto mb-3" />
                    <p className="text-slate-800 font-bold text-sm">{uploadedFile.name}</p>
                    <p className="text-slate-400 text-xs mt-1">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    <button
                      onClick={() => { setUploadedFile(null); setPreviewed(false); }}
                      className="mt-3 text-red-500 text-xs font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <Upload className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600 font-bold text-sm">Drag & drop or click to upload</p>
                    <p className="text-slate-400 text-xs mt-1">PDF only, max 20MB</p>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) setUploadedFile(e.target.files[0]);
                      }}
                    />
                  </label>
                )}
              </div>

              {/* Safety Check */}
              {uploadedFile && !previewed && (
                <div className="mt-4 p-4 bg-[hsl(var(--escrow-amber))]/10 border border-[hsl(var(--escrow-amber))]/30 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[hsl(var(--escrow-amber))] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-slate-700 text-xs font-bold">Preview Required</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">You must preview the document before sending.</p>
                  </div>
                  <button
                    onClick={() => setPreviewed(true)}
                    className="shrink-0 h-8 px-4 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" /> Preview
                  </button>
                </div>
              )}

              {/* Send CTA */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <button
                  onClick={onProceedToSign}
                  disabled={!uploadedFile || !previewed}
                  className="w-full h-12 bg-primary text-white rounded-xl font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Shield className="w-4 h-4" />
                  Proceed to Sign & Send
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
