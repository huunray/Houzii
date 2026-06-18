import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck, Star, MapPin, Calendar, Camera,
  Pencil, Briefcase, Award,
  CheckCircle2, Lock, Zap, Plus
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

const portfolioImages = [
  { id: 1, src: 'https://images.unsplash.com/photo-1635221798248-8a3452ad07cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwbHVtYmVyJTIwZml4aW5nJTIwc2luayUyMHdvcmt8ZW58MXx8fHwxNzczNzA1NjA5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', label: 'Plumbing Repair - Lekki' },
  { id: 2, src: 'https://images.unsplash.com/photo-1761353854312-a5df7c9d3bf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiYXRocm9vbSUyMHJlbm92YXRpb24lMjBjb21wbGV0ZWR8ZW58MXx8fHwxNzczNzA1NjEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', label: 'Bathroom Renovation - VI' },
  { id: 3, src: 'https://images.unsplash.com/photo-1467733238130-bb6846885316?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpY2FsJTIwd2lyaW5nJTIwaW5zdGFsbGF0aW9uJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MzY3ODA5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', label: 'Electrical Install - Ikeja' },
  { id: 4, src: 'https://images.unsplash.com/photo-1689263132692-f6f3810ae8d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3VzZSUyMHBhaW50aW5nJTIwaW50ZXJpb3IlMjBmcmVzaGx5JTIwcGFpbnRlZHxlbnwxfHx8fDE3NzM3MDU2MTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', label: 'Interior Paint - Abuja' },
];

const reviews = [
  {
    id: 1,
    client: 'Mrs. Ogundimu',
    rating: 5,
    comment: 'Excellent work! The pipe repair was done quickly and professionally. Will definitely hire again.',
    date: 'Mar 12, 2026',
    jobType: 'Plumbing Repair',
    paidViaHouzii: true,
  },
  {
    id: 2,
    client: 'Mr. Adebayo',
    rating: 5,
    comment: 'Very thorough title search. Found a discrepancy that could have cost me millions. Truly professional.',
    date: 'Mar 5, 2026',
    jobType: 'Title Verification',
    paidViaHouzii: true,
  },
  {
    id: 3,
    client: 'Zenith Gardens Estate',
    rating: 4,
    comment: 'Great AC servicing. All 4 units running perfectly. Only concern was slight delay on arrival.',
    date: 'Feb 28, 2026',
    jobType: 'AC Servicing',
    paidViaHouzii: true,
  },
];

const serviceAreas = [
  'Lekki', 'Victoria Island', 'Ikoyi', 'Ikeja GRA',
  'Surulere', 'Abuja Central', 'Wuse 2', 'Maitama', 'Banana Island'
];

export const ProPortfolio: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'bio' | 'portfolio' | 'reviews'>('bio');

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-slate-900 font-black text-2xl mb-1">Public Profile</h2>
            <p className="text-slate-400 font-medium text-sm">Your professional portfolio visible to clients</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary/5 hover:bg-primary/10 text-primary rounded-full text-xs font-bold transition-all">
            <Pencil className="w-3.5 h-3.5" />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="px-6 pt-6">
        {/* ── VERIFICATION BADGE AREA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-50 to-green-50 border-2 border-green-300 rounded-2xl p-5 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              <h3 className="text-slate-900 font-black text-sm">Verification & KYC Status</h3>
            </div>
            <span className="px-3 py-1 bg-green-100 border border-green-300 text-green-700 text-xs font-black rounded-full">
              Houzii Verified
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {[
              { label: 'Identity Verified', sub: 'NIN + BVN confirmed', done: true },
              { label: 'Professional License', sub: 'Plumbing Assoc. of Nigeria', done: true },
              { label: 'Address Verification', sub: 'Utility bill uploaded', done: true },
              { label: 'Background Check', sub: 'Complete Tier 2 to unlock', done: false, cta: 'Upgrade to Tier 2' },
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${item.done ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${item.done ? 'bg-green-500' : 'bg-amber-100'}`}>
                  {item.done ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : (
                    <Lock className="w-4 h-4 text-amber-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold ${item.done ? 'text-green-800' : 'text-amber-800'}`}>{item.label}</p>
                  <p className={`text-xs font-medium ${item.done ? 'text-green-600' : 'text-amber-600'}`}>{item.sub}</p>
                </div>
                {!item.done && item.cta && (
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 text-white rounded-full text-[10px] font-black shrink-0">
                    <Zap className="w-3 h-3" />
                    {item.cta}
                  </button>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/3 rounded-full blur-3xl" />
          <div className="flex items-start gap-5 relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-black text-2xl shrink-0">
              AO
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-slate-900 font-black text-xl">Adekunle Okafor</h3>
                <ShieldCheck className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-primary text-sm font-bold mb-2">Multi-Service Professional</p>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                  <MapPin className="w-3.5 h-3.5" />
                  Lagos & Abuja
                </div>
                <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  Member since 2024
                </div>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  4.9 (32 reviews)
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-5 flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span className="text-green-600 text-xs font-black">Houzii Verified</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/15 rounded-full">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-primary text-xs font-black">2 Years on Platform</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full">
              <Briefcase className="w-4 h-4 text-amber-500" />
              <span className="text-amber-600 text-xs font-black">47 Jobs Completed</span>
            </div>
          </div>
        </motion.div>

        {/* Section Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {([
            { id: 'bio' as const, label: 'Bio & Experience' },
            { id: 'portfolio' as const, label: 'Portfolio' },
            { id: 'reviews' as const, label: 'Reviews' },
          ]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all shrink-0 ${
                activeSection === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bio Section */}
        {activeSection === 'bio' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="text-slate-900 font-bold text-sm mb-3">About Me</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Licensed multi-service professional with 8+ years of experience in plumbing, electrical, and general maintenance. 
                I specialize in both residential and commercial properties across Lagos and Abuja. My approach prioritizes quality 
                craftsmanship, transparent pricing, and timely delivery. All work comes with a warranty guarantee.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="text-slate-900 font-bold text-sm mb-4">Expertise & Certifications</h3>
              <div className="space-y-3">
                {[
                  { label: 'Licensed Plumber', org: 'Plumbing Association of Nigeria', year: '2018' },
                  { label: 'Certified Electrician', org: 'NESREA Certification', year: '2019' },
                  { label: 'Safety & Health', org: 'HSE Level 3 Certificate', year: '2020' },
                ].map((cert, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-800 text-sm font-bold">{cert.label}</p>
                      <p className="text-slate-400 text-xs font-medium">{cert.org} - {cert.year}</p>
                    </div>
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                  </div>
                ))}
              </div>
            </div>

            {/* Service Areas Tag Cloud */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-900 font-bold text-sm">Service Areas</h3>
                <button className="flex items-center gap-1 text-primary text-xs font-bold hover:underline">
                  <Plus className="w-3.5 h-3.5" />
                  Add Area
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {serviceAreas.map((area) => (
                  <span
                    key={area}
                    className="px-3 py-1.5 bg-primary/5 text-primary text-xs font-bold rounded-full border border-primary/15 hover:bg-primary/10 transition-colors cursor-default"
                  >
                    📍 {area}
                  </span>
                ))}
              </div>
              <p className="text-slate-400 text-[10px] font-medium mt-3">
                Clients within these areas can find your profile in search results.
              </p>
            </div>
          </motion.div>
        )}

        {/* Portfolio Section */}
        {activeSection === 'portfolio' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid grid-cols-2 gap-4">
              {portfolioImages.map((img, i) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative rounded-2xl overflow-hidden aspect-square group cursor-pointer"
                >
                  <ImageWithFallback
                    src={img.src}
                    alt={img.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-bold">{img.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <button className="mt-4 w-full py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-sm font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
              <Camera className="w-4 h-4" />
              Add More Work Photos
            </button>
          </motion.div>
        )}

        {/* Reviews Section */}
        {activeSection === 'reviews' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Review summary */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-5 mb-2">
              <div className="text-center">
                <p className="text-slate-900 font-black text-4xl">4.9</p>
                <div className="flex items-center gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-400 text-xs font-medium mt-1">32 reviews</p>
              </div>
              <div className="flex-1 space-y-1.5">
                {[
                  { stars: 5, count: 28, pct: 88 },
                  { stars: 4, count: 3, pct: 9 },
                  { stars: 3, count: 1, pct: 3 },
                  { stars: 2, count: 0, pct: 0 },
                  { stars: 1, count: 0, pct: 0 },
                ].map((row) => (
                  <div key={row.stars} className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 w-3">{row.stars}</span>
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${row.pct}%` }} />
                    </div>
                    <span className="text-[10px] font-medium text-slate-300 w-4">{row.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {reviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white border border-slate-200 rounded-2xl p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm">
                      {review.client.charAt(0)}
                    </div>
                    <div>
                      <p className="text-slate-800 text-sm font-bold">{review.client}</p>
                      <p className="text-slate-400 text-xs font-medium">{review.jobType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-slate-500 text-sm font-medium mb-3">{review.comment}</p>
                <div className="flex items-center gap-3">
                  <span className="text-slate-300 text-xs font-medium">{review.date}</span>
                  {review.paidViaHouzii && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 border border-green-200 rounded-full">
                      <ShieldCheck className="w-3 h-3 text-green-500" />
                      <span className="text-green-600 text-[10px] font-bold">Paid via Houzii</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};