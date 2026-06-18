import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  X, Type, PenTool, Upload, CheckCircle2,
  ChevronRight, Info, Image
} from 'lucide-react';

interface Props {
  pipeline: 'rental' | 'sale';
  onClose: () => void;
  onComplete: () => void;
}

type SignMethod = 'type' | 'draw' | 'upload';

const scriptFonts = [
  { name: 'Elegant Script', style: 'font-serif italic' },
  { name: 'Bold Signature', style: 'font-serif font-bold' },
  { name: 'Classic Hand', style: 'font-mono italic' },
];

export const SignatureWizard: React.FC<Props> = ({ pipeline, onClose, onComplete }) => {
  const [method, setMethod] = useState<SignMethod>('type');
  const [legalName, setLegalName] = useState('');
  const [selectedFont, setSelectedFont] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [documentUploaded, setDocumentUploaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const documentName = pipeline === 'rental' ? 'Tenancy Agreement' : 'Deed of Assignment';

  const startDraw = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    lastPos.current = { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current || !lastPos.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.stroke();
    lastPos.current = { x, y };
    setHasDrawn(true);
  }, [isDrawing]);

  const endDraw = useCallback(() => {
    setIsDrawing(false);
    lastPos.current = null;
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const canSign = () => {
    if (!legalName.trim()) return false;
    if (!documentUploaded) return false;
    if (method === 'type') return true;
    if (method === 'draw') return hasDrawn;
    if (method === 'upload') return !!uploadedImage;
    return false;
  };

  const tabs: { id: SignMethod; label: string; icon: React.ReactNode }[] = [
    { id: 'type', label: 'Type', icon: <Type className="w-4 h-4" /> },
    { id: 'draw', label: 'Draw', icon: <PenTool className="w-4 h-4" /> },
    { id: 'upload', label: 'Upload', icon: <Image className="w-4 h-4" /> },
  ];

  return (
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
        className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-slate-900 font-black text-lg">Digital Signature</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            Sign the {pipeline === 'rental' ? 'Tenancy Agreement' : 'Deed of Assignment'}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Identity Check */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block">
              Full Legal Name (Must Match KYC)
            </label>
            <input
              type="text"
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
              placeholder="Enter your full legal name"
              className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          {/* Document Upload */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block">
              Upload {documentName} (PDF)
            </label>
            {documentUploaded ? (
              <div className="flex items-center gap-3 p-4 bg-[hsl(var(--escrow-green))]/5 border border-[hsl(var(--escrow-green))]/20 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-[hsl(var(--escrow-green))]/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-[hsl(var(--escrow-green))]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{documentName}.pdf</p>
                  <p className="text-[11px] text-[hsl(var(--escrow-green))] font-bold">Document uploaded successfully</p>
                </div>
                <button
                  onClick={() => setDocumentUploaded(false)}
                  className="text-xs text-slate-400 font-bold hover:text-primary"
                >
                  Replace
                </button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-slate-200 rounded-xl p-5 flex items-center gap-4 cursor-pointer hover:border-primary/30 hover:bg-primary/[0.02] transition-all"
                onClick={() => setDocumentUploaded(true)}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                  <Upload className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700">{documentName}</p>
                  <p className="text-[11px] text-slate-400 font-medium">Tap to upload PDF document</p>
                </div>
              </div>
            )}
          </div>

          {/* Method Tabs */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 block">
              Signature Method
            </label>
            <div className="flex gap-2 bg-slate-100 rounded-xl p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setMethod(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg font-bold text-xs transition-all ${
                    method === tab.id
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Signature Area */}
          {method === 'type' && (
            <div className="space-y-3">
              {scriptFonts.map((font, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedFont(i)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    selectedFont === i
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-200 hover:border-primary/30'
                  }`}
                >
                  <p className="text-[10px] text-slate-400 font-bold mb-1">{font.name}</p>
                  <p className={`text-2xl text-slate-900 ${font.style}`}>
                    {legalName || 'Your Name'}
                  </p>
                </button>
              ))}
            </div>
          )}

          {method === 'draw' && (
            <div>
              <div className="relative border-2 border-dashed border-slate-200 rounded-xl overflow-hidden bg-white">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={200}
                  className="w-full h-[200px] cursor-crosshair touch-none"
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={endDraw}
                  onMouseLeave={endDraw}
                  onTouchStart={startDraw}
                  onTouchMove={draw}
                  onTouchEnd={endDraw}
                />
                {!hasDrawn && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="text-slate-300 text-sm font-bold">Draw your signature here</p>
                  </div>
                )}
              </div>
              {hasDrawn && (
                <button
                  onClick={clearCanvas}
                  className="mt-2 text-xs text-primary font-bold hover:underline"
                >
                  Clear & Redo
                </button>
              )}
            </div>
          )}

          {method === 'upload' && (
            <div>
              <div
                className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary/30 transition-all"
                onClick={() => {
                  // Simulate upload
                  setUploadedImage('signature.png');
                }}
              >
                {uploadedImage ? (
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[hsl(var(--escrow-green))]" />
                    <span className="text-[hsl(var(--escrow-green))] font-bold text-sm">Signature uploaded</span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-slate-300 mb-3" />
                    <p className="text-slate-500 text-sm font-bold mb-1">Upload signature image</p>
                    <p className="text-slate-400 text-xs text-center">Tap to select a photo</p>
                  </>
                )}
              </div>

              {/* Hint */}
              <div className="mt-3 flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-blue-600 text-[11px] font-bold leading-relaxed">
                  Sign on a plain white paper in a well-lit room for best results. Use high contrast (dark pen on white paper).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 shrink-0 bg-white">
          <button
            onClick={onComplete}
            disabled={!canSign()}
            className={`w-full h-12 rounded-xl font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
              canSign()
                ? 'bg-primary hover:brightness-110 text-white shadow-md shadow-primary/20'
                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
            }`}
          >
            <PenTool className="w-4 h-4" />
            Sign & Submit
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
