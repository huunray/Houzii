import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck, MapPin, Bed, Bath, Eye, MessageCircle,
  MoreVertical, Instagram, FileText, Share2, X, AlertCircle, ChevronRight,
  Plus, Calendar, Pencil, CalendarDays, Trash2
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { ListingCommandCenter, type DealStage, type Listing } from './listing-deep-dive';

type ListingTab = 'active' | 'pending' | 'closed' | 'draft' | 'reserved';

type FullListing = Listing & {
  status: 'active' | 'pending' | 'closed';
  verified?: boolean;
};

const listings: FullListing[] = [
  {
    id: 1,
    title: '3 Bedroom Luxury Apartment',
    location: 'Lekki Phase 1, Lagos',
    price: '₦4.5M/yr',
    image: 'https://images.unsplash.com/photo-1633119712778-30d94755de54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBMYWdvcyUyMGludGVyaW9yJTIwZGVzaWdufGVufDF8fHx8MTc3MzYyNjcyMnww&ixlib=rb-4.1.0&q=80&w=1080',
    beds: 3,
    baths: 3,
    views: 234,
    inquiries: 18,
    status: 'active',
    verified: true,
    dealStage: 'agreement',
  },
  {
    id: 2,
    title: 'Modern 4-Bed Duplex',
    location: 'Banana Island, Lagos',
    price: '₦285M',
    image: 'https://images.unsplash.com/photo-1622015663084-307d19eabbbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yJTIwZ2FyZGVuJTIwdHJvcGljYWx8ZW58MXx8fHwxNzczNjI2NzIzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    beds: 4,
    baths: 5,
    views: 456,
    inquiries: 32,
    status: 'active',
    verified: true,
    dealStage: 'agreement',
  },
  {
    id: 3,
    title: 'Penthouse Suite',
    location: 'Victoria Island, Lagos',
    price: '₦120K/night',
    image: 'https://images.unsplash.com/photo-1770254386076-1997b2e90365?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwZW50aG91c2UlMjB0ZXJyYWNlJTIwY2l0eSUyMHZpZXd8ZW58MXx8fHwxNzczNjI2NjA5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    beds: 2,
    baths: 2,
    views: 89,
    inquiries: 5,
    status: 'pending',
    verified: false,
  },
  {
    id: 4,
    title: '5-Bed Mansion with Pool',
    location: 'Ikoyi, Lagos',
    price: '₦450M',
    image: 'https://images.unsplash.com/photo-1543414347-1c348021f279?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBhcGFydG1lbnQlMjBidWlsZGluZyUyMGV4dGVyaW9yJTIwTGFnb3N8ZW58MXx8fHwxNzczNzAyODQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    beds: 5,
    baths: 6,
    views: 678,
    inquiries: 45,
    status: 'closed',
    verified: true,
  },
];

/* ─── Status chip config per deal stage ─── */
interface ChipConfig {
  label: string;
  dot: string;
  border: string;
  text: string;
  bg: string;
}

const getStageChip = (stage: DealStage): ChipConfig => {
  switch (stage) {
    case 'vetting':
      return { label: 'Review Applicants', dot: 'bg-[#7B2D42]', border: 'border-[#7B2D42]', text: 'text-[#7B2D42]', bg: 'bg-[#7B2D42]/12' };
    case 'agreement':
      return { label: 'Lease Negotiation', dot: 'bg-[#1E3A5F]', border: 'border-[#1E3A5F]', text: 'text-[#1E3A5F]', bg: 'bg-[#1E3A5F]/12' };
    case 'payment':
      return { label: 'Awaiting Payment', dot: 'bg-orange-500', border: 'border-orange-500', text: 'text-orange-600', bg: 'bg-orange-500/12' };
    case 'handover':
      return { label: 'Schedule Handover', dot: 'bg-indigo-500', border: 'border-indigo-500', text: 'text-indigo-600', bg: 'bg-indigo-500/12' };
    case 'payout':
      return { label: 'Ready for Payout', dot: 'bg-green-600', border: 'border-green-600', text: 'text-green-700', bg: 'bg-green-600/12' };
  }
};

export const AgentListings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ListingTab>('active');
  const [marketingSheet, setMarketingSheet] = useState<number | null>(null);
  const [commandListing, setCommandListing] = useState<FullListing | null>(null);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  /* ── When a listing is open, show the Command Center full-page ── */
  if (commandListing) {
    return (
      <ListingCommandCenter
        listing={commandListing}
        onBack={() => setCommandListing(null)}
      />
    );
  }

  const tabs: { id: ListingTab; label: string; count: number }[] = [
    { id: 'active', label: 'Active', count: (listings as any[]).filter(l => l.status === 'active').length },
    { id: 'pending', label: 'Pending Verification', count: (listings as any[]).filter(l => l.status === 'pending').length },
    { id: 'closed', label: 'Closed', count: (listings as any[]).filter(l => l.status === 'closed').length },
    { id: 'draft', label: 'Draft', count: 0 },
    { id: 'reserved', label: 'Reserved', count: 0 },
  ];

  const filteredListings = (listings as any[]).filter(l => l.status === activeTab);

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-4 border-b border-slate-100">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-slate-900 font-black text-2xl mb-1">My Listings</h2>
            <p className="text-slate-400 font-medium text-sm">Manage and market your property listings</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            Add Listing
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 pt-4 bg-white border-b border-slate-100">
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-primary/10 text-primary' : 'bg-slate-200 text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Listings */}
      <div className="px-6 pt-6 space-y-4">
        <AnimatePresence mode="wait">
          {filteredListings.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              {activeTab === 'draft' ? (
                <>
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-slate-900 font-bold text-lg mb-2">No drafts yet</h3>
                  <p className="text-slate-400 font-medium text-sm mb-6 max-w-sm mx-auto">
                    Start creating a listing and save it as a draft. You can come back and finish it later.
                  </p>
                  <button className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors shadow-sm">
                    <Plus className="w-4 h-4" />
                    Create New Listing
                  </button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-400 font-bold">No {activeTab} listings</p>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="listings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {filteredListings.map((listing: any, i: number) => {
                const chip = listing.dealStage ? getStageChip(listing.dealStage as DealStage) : null;
                return (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Image */}
                      <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0">
                        <ImageWithFallback
                          src={listing.image}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                        {/* Verified / Pending badge */}
                        <div className="absolute top-3 left-3">
                          {listing.verified ? (
                            <div className="flex items-center gap-1 px-2.5 py-1 bg-green-500 text-white rounded-full text-[10px] font-black uppercase">
                              <ShieldCheck className="w-3 h-3" /> Verified
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-500 text-white rounded-full text-[10px] font-black uppercase">
                              <AlertCircle className="w-3 h-3" /> Pending
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-5">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2 flex-wrap mb-1">
                              <h3 className="text-slate-900 font-bold text-base">{listing.title}</h3>
                              {/* ── Deal Stage Status Chip ── */}
                              {chip && (
                                <span className={`inline-flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-wide ${chip.bg} ${chip.border} ${chip.text}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${chip.dot}`} />
                                  {chip.label}
                                </span>
                              )}
                            </div>
                            <p className="text-slate-400 text-xs font-medium flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {listing.location}
                            </p>
                          </div>
                          <div className="relative ml-2 shrink-0">
                            <button
                              onClick={() => setOpenMenu(openMenu === listing.id ? null : listing.id)}
                              className="p-2 hover:bg-slate-50 rounded-lg transition-colors"
                            >
                              <MoreVertical className="w-4 h-4 text-slate-400" />
                            </button>
                            <AnimatePresence>
                              {openMenu === listing.id && (
                                <>
                                  <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                    transition={{ duration: 0.12 }}
                                    className="absolute right-0 top-full mt-1 z-20 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden min-w-[170px]"
                                  >
                                    <button
                                      onClick={() => { setCommandListing(listing); setOpenMenu(null); }}
                                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                                    >
                                      <Eye className="w-4 h-4 text-slate-400" /> View
                                    </button>
                                    <button
                                      onClick={() => setOpenMenu(null)}
                                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                                    >
                                      <Pencil className="w-4 h-4 text-slate-400" /> Edit
                                    </button>
                                    <button
                                      onClick={() => setOpenMenu(null)}
                                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                                    >
                                      <CalendarDays className="w-4 h-4 text-slate-400" /> Set Inspection Calendar
                                    </button>
                                    <div className="border-t border-slate-100" />
                                    <button
                                      onClick={() => setOpenMenu(null)}
                                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 font-semibold hover:bg-red-50 transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" /> Delist
                                    </button>
                                  </motion.div>
                                </>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        <p className="text-slate-900 font-black text-xl mb-3">{listing.price}</p>

                        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100 flex-wrap">
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Bed className="w-4 h-4" />
                            <span className="text-xs font-bold">{listing.beds} Beds</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Bath className="w-4 h-4" />
                            <span className="text-xs font-bold">{listing.baths} Baths</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Eye className="w-4 h-4" />
                            <span className="text-xs font-bold">{listing.views} views</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-xs font-bold">{listing.inquiries} inquiries</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                          {listing.status === 'active' && (
                            <button
                              onClick={() => setCommandListing(listing)}
                              className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-dark transition-colors flex items-center gap-1 shadow-sm"
                            >
                              <Eye className="w-3.5 h-3.5" /> View Details
                            </button>
                          )}
                          {!listing.verified && (
                            <button className="px-4 py-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-xs font-bold hover:bg-amber-100 transition-colors flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" /> Request Title Check
                            </button>
                          )}

                          {listing.status === 'closed' && (
                            <button
                              onClick={() => setCommandListing(listing)}
                              className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors flex items-center gap-1"
                            >
                              <FileText className="w-3.5 h-3.5" /> View Record
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Marketing Bottom Sheet */}
      <AnimatePresence>
        {marketingSheet !== null && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setMarketingSheet(null)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[24px] z-50 p-6 pb-10 max-w-lg mx-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-slate-900 font-black text-lg">Marketing Tools</h3>
                <button
                  onClick={() => setMarketingSheet(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { icon: Instagram, label: 'Generate IG Story', desc: 'Create a branded Instagram story template', color: 'from-pink-500 to-purple-600', textColor: 'text-white' },
                  { icon: FileText, label: 'Download PDF Flyer', desc: 'Professional property flyer for printing', color: 'from-blue-50 to-blue-100', textColor: 'text-blue-600' },
                  { icon: Share2, label: 'Share to MLS Network', desc: 'Broadcast to partner real estate networks', color: 'from-emerald-50 to-emerald-100', textColor: 'text-emerald-600' },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="w-full p-4 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all flex items-center gap-4 text-left"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0`}>
                        <Icon className={`w-6 h-6 ${item.textColor}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-slate-800 font-bold text-sm">{item.label}</h4>
                        <p className="text-slate-400 text-xs font-medium">{item.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};