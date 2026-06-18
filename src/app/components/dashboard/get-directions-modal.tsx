import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, MapPin, Copy, CheckCircle, Navigation, ExternalLink,
  Clock, Landmark
} from 'lucide-react';

interface GetDirectionsModalProps {
  propertyTitle: string;
  address: string;
  landmark: string;
  inspectionDate: string;
  inspectionTime: string;
  coordinates: { lat: number; lng: number };
  onClose: () => void;
}

export const GetDirectionsModal: React.FC<GetDirectionsModalProps> = ({
  propertyTitle,
  address,
  landmark,
  inspectionDate,
  inspectionTime,
  coordinates,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`;
    window.open(url, '_blank');
  };

  const mapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3000!2d${coordinates.lng}!3d${coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sng!4v1`;

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
        className="relative w-full max-w-lg max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl bg-white flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[hsl(var(--navy))] px-6 pt-6 pb-5 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <Navigation className="w-4 h-4 text-[hsl(var(--escrow-green))]" />
          </div>
          <h1 className="text-white font-black text-xl">{propertyTitle}</h1>

          {/* Status Badge */}
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-[hsl(var(--escrow-green))]/15 border border-[hsl(var(--escrow-green))]/30 rounded-full">
            <CheckCircle className="w-3.5 h-3.5 text-[hsl(var(--escrow-green))]" />
            <span className="text-[10px] font-black text-[hsl(var(--escrow-green))] uppercase tracking-[0.12em]">
              Confirmed Inspection: {inspectionDate}, {inspectionTime}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {/* Address Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex-1">
                <label className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.15em] mb-2 block">
                  Property Address
                </label>
                <p className="text-slate-900 font-black text-base leading-snug">
                  {address}
                </p>
              </div>
              <button
                onClick={handleCopyAddress}
                className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-all shrink-0 active:scale-95"
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4 text-[hsl(var(--escrow-green))]" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-400" />
                )}
              </button>
            </div>

            {/* Copied feedback */}
            <AnimatePresence>
              {copied && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-3 text-[11px] font-bold text-[hsl(var(--escrow-green))]"
                >
                  ✓ Address copied to clipboard
                </motion.div>
              )}
            </AnimatePresence>

            {/* Landmark Hint */}
            <div className="flex items-center gap-2.5 p-3 bg-amber-50/80 border border-amber-200/40 rounded-xl">
              <Landmark className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <span className="text-[9px] font-bold text-amber-500 uppercase tracking-[0.15em] block mb-0.5">
                  Nearby Landmark
                </span>
                <span className="text-xs font-bold text-slate-700">{landmark}</span>
              </div>
            </div>
          </motion.div>

          {/* Map Preview */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative"
          >
            <div className="aspect-[16/10] relative">
              <iframe
                title="Property Location"
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                className="grayscale-[30%]"
              />
              {/* Houzii Pin Overlay */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none z-10">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary shadow-lg shadow-primary/30 flex items-center justify-center border-2 border-white">
                    <MapPin className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-primary -mt-0.5" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Inspection Reminder */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/10 rounded-2xl"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900">
                {inspectionDate} at {inspectionTime}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                Arrive 5–10 minutes early to meet your agent on-site.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Footer CTA */}
        <div className="px-6 pb-6 pt-3 border-t border-slate-100 shrink-0 space-y-3">
          <button
            onClick={handleOpenMaps}
            className="w-full h-14 bg-primary hover:bg-primary/90 active:bg-primary text-primary-foreground rounded-full font-bold text-sm shadow-lg shadow-primary/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Navigation className="w-5 h-5" />
            Start Journey
            <ExternalLink className="w-4 h-4 opacity-60" />
          </button>
          <button
            onClick={handleOpenMaps}
            className="w-full text-center text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
          >
            Open in Google Maps
          </button>
        </div>
      </motion.div>
    </div>
  );
};
