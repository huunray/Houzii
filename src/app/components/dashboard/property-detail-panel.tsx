import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin, Bed, Bath, Maximize, Clock, ShieldCheck,
  ChevronLeft, Share2, Heart, CheckCircle, User,
  Phone, MessageSquare, Calendar, Star, Info,
  ArrowRight, X, Sparkles, Grid
} from 'lucide-react';
import { MOCK_PROPERTIES, Property } from '../../data';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface PropertyDetailPanelProps {
  propertyId: number;
  onBack: () => void;
  onViewProperty: (id: number) => void;
}

export const PropertyDetailPanel: React.FC<PropertyDetailPanelProps> = ({ propertyId, onBack, onViewProperty }) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const found = MOCK_PROPERTIES.find(p => p.id === propertyId);
    if (found) {
      setProperty(found);
    }
    setActiveImage(0);
    setShowGallery(false);
  }, [propertyId]);

  if (!property) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-400 font-bold">Property not found</p>
      </div>
    );
  }

  const images = property.gallery || [property.image, property.image, property.image];

  return (
    <div className="pb-6">
      {/* Header with Back */}
      <div className="bg-white px-6 pt-6 pb-4 border-b border-slate-100 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-bold group"
          >
            <div className="p-2 bg-slate-50 rounded-full border border-slate-100 group-hover:-translate-x-1 transition-transform">
              <ChevronLeft className="w-5 h-5" />
            </div>
            Back
          </button>
          <div className="flex gap-3">
            <button className="p-2.5 bg-white rounded-full shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">
              <Share2 className="w-4 h-4 text-slate-600" />
            </button>
            <button
              onClick={() => setLiked(!liked)}
              className="p-2.5 bg-white rounded-full shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors group"
            >
              <Heart className={`w-4 h-4 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-slate-600 group-hover:text-red-500'}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Gallery Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-8 h-[240px] md:h-[360px] relative">
          <div
            className="lg:col-span-2 rounded-[20px] overflow-hidden relative cursor-pointer group"
            onClick={() => setShowGallery(true)}
          >
            <ImageWithFallback
              src={images[0]}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {property.verified && (
                <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 border border-white/20">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Verified</span>
                </div>
              )}
              <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 border border-white/10">
                <Clock className="w-3.5 h-3.5 text-white" />
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">{property.listedDate}</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:grid grid-cols-2 grid-rows-2 gap-3">
            {images.slice(1, 5).map((img, i) => (
              <div
                key={i}
                className={`rounded-[20px] overflow-hidden cursor-pointer relative group ${activeImage === i + 1 ? 'ring-2 ring-primary' : ''}`}
                onClick={() => {
                  setActiveImage(i + 1);
                  setShowGallery(true);
                }}
              >
                <ImageWithFallback src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowGallery(true)}
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-xl flex items-center gap-2 border border-white/20 hover:bg-white transition-all z-10"
          >
            <Grid className="w-4 h-4 text-slate-900" />
            <span className="text-xs font-bold text-slate-900">Show all photos</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Details */}
          <div className="flex-1 space-y-10">
            {/* Title Block */}
            <section>
              <div className="mb-5">
                <div className="text-[11px] font-extrabold text-primary uppercase tracking-[0.2em] mb-2.5 bg-primary/10 px-3 py-1.5 rounded-md w-fit">
                  {property.propertyType} {property.type === 'Buy' ? 'for Sale' : property.type === 'Rent' ? 'for Rent' : 'Shortlet'}
                </div>
                <h1 className="font-black text-slate-900 mb-3 leading-tight text-[22px]">{property.title}</h1>
                <div className="flex items-center gap-2 text-slate-500">
                  <MapPin className="w-4 h-4" />
                  <span className="font-semibold text-sm">{property.location}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border-y border-slate-100 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
                    <Bed className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-base font-black text-slate-900 leading-none">{property.bedrooms}</div>
                    <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Bedrooms</div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
                    <Bath className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-base font-black text-slate-900 leading-none">{property.bathrooms}</div>
                    <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Bathrooms</div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
                    <Maximize className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-base font-black text-slate-900 leading-none">{property.landSize}</div>
                    <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Area Size</div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
                    <CheckCircle className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-base font-black text-slate-900 leading-none">{property.verified ? 'Verified' : 'Pending'}</div>
                    <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Status</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Houzii Trust Section */}
            {property.verified && (
              <section className="bg-primary/5 rounded-[20px] p-6 border border-primary/10 relative overflow-hidden group">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                <div className="relative flex flex-col md:flex-row items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center shrink-0 border-2 border-primary/20">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-lg font-black text-slate-900 mb-1.5">Houzii Verified Listing</h3>
                    <p className="text-slate-600 mb-3 max-w-md font-medium text-sm">This property has passed our rigorous multi-point verification check.</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500" /> Agent Identity Verified
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500" /> Documents Reviewed
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500" /> Property Verified
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* About Section */}
            <section>
              <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2.5">
                <Info className="w-5 h-5 text-primary" />
                About This Property
              </h3>
              <div className="text-slate-600 leading-relaxed font-medium text-sm">
                {property.description || "This is a well-maintained property located in a prime area with excellent access to major roads, schools, and amenities. The property features modern finishes and is perfect for families or investors looking for value in a growing neighborhood."}
              </div>
            </section>

            {/* Amenities Section */}
            <section>
              <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-primary" />
                Key Amenities
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {(property.amenities || ["24/7 Security", "Electricity", "Water Supply", "Parking Space", "Gated Community", "Paved Roads"]).map((amenity, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-3.5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-primary/20 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    <span className="text-xs font-bold text-slate-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Location Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2.5">
                  <MapPin className="w-5 h-5 text-primary" />
                  Location
                </h3>
                <button className="text-xs font-bold text-primary hover:underline">View on Map</button>
              </div>
              <div className="aspect-[21/9] rounded-[20px] overflow-hidden bg-slate-100 border border-slate-200 relative group cursor-pointer">
                <iframe
                  title="Property Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126844.06232598687!2d3.3106574999999995!3d6.536965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2sus!4v1709664535353!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  className="grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-transparent transition-colors pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">{property.location}</span>
                  </div>
                  <button className="px-3 py-1.5 bg-slate-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors">Get Directions</button>
                </div>
              </div>
            </section>

            {/* Similar Properties */}
            <section className="pt-8 border-t border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-slate-900 text-lg">Similar Properties</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {MOCK_PROPERTIES
                  .filter(p => p.id !== property.id && p.type === property.type)
                  .slice(0, 2)
                  .map((prop) => (
                    <motion.div
                      key={prop.id}
                      onClick={() => onViewProperty(prop.id)}
                      className="group bg-white rounded-[20px] border border-slate-200 overflow-hidden shadow-md hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col"
                    >
                      <div className="relative aspect-[3/2] overflow-hidden bg-slate-50">
                        <ImageWithFallback src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute top-3 left-3 flex flex-col gap-2 items-start">
                          {prop.verified && (
                            <div className="bg-white px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 border border-slate-100">
                              <ShieldCheck className="w-3 h-3 text-green-500" />
                              <span className="text-[9px] font-bold text-slate-700 uppercase tracking-wide">Verified</span>
                            </div>
                          )}
                          <div className="bg-slate-900 px-2 py-0.5 rounded-md text-[9px] font-bold text-white tracking-widest uppercase">
                            {prop.listedDate}
                          </div>
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex items-center gap-1.5 text-slate-500 mb-1.5">
                          <MapPin className="w-3 h-3" />
                          <span className="text-[11px] font-semibold">{prop.location}</span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors line-clamp-1">
                          {prop.title}
                        </h3>
                        <div className="flex gap-3 mb-3 pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-1 text-slate-600">
                            <Bed className="w-3.5 h-3.5" />
                            <span className="text-xs font-semibold">{prop.bedrooms}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-600">
                            <Bath className="w-3.5 h-3.5" />
                            <span className="text-xs font-semibold">{prop.bathrooms}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-600">
                            <Maximize className="w-3.5 h-3.5" />
                            <span className="text-xs font-semibold">{prop.landSize}</span>
                          </div>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div>
                            <span className="text-[9px] font-extrabold text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-md">{prop.propertyType}</span>
                            <div className="text-base font-black text-slate-900 leading-none mt-1.5">{prop.price}</div>
                          </div>
                          {prop.agent && (
                            <div className="w-8 h-8 rounded-full border-2 border-white shadow-lg overflow-hidden shrink-0">
                              <ImageWithFallback src={prop.agent.avatar} alt="Agent" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </section>
          </div>

          {/* Right Column: Sticky Action Panel */}
          <div className="w-full lg:w-[360px] shrink-0">
            <div className="lg:sticky lg:top-20 space-y-5">
              {/* Pricing & Booking Card */}
              <div className="bg-white rounded-[20px] p-6 border border-slate-200 shadow-xl shadow-slate-200/30">
                <div className="mb-6">
                  <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                    {property.type === 'Buy' ? 'Property Price' : property.type === 'Rent' ? 'Annual Rent' : 'Nightly Price'}
                  </div>
                  <div className="font-black text-slate-900 text-[22px]">{property.price}</div>
                  {property.type === 'Buy' && (
                    <div className="mt-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
                      <Info className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[11px] font-bold text-slate-600">Estimate: ₦1.2M / mo</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {property.type === 'Shortlet' && (
                    <div className="grid grid-cols-2 gap-2.5 mb-5">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">Check-in</label>
                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs font-bold text-slate-700 flex items-center justify-between">
                          Add Date <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">Check-out</label>
                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs font-bold text-slate-700 flex items-center justify-between">
                          Add Date <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  )}

                  <button className="w-full h-11 bg-primary hover:bg-[#5a1824] text-white rounded-full font-bold text-sm shadow-lg shadow-primary/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                    {property.type === 'Shortlet' ? 'Book Now' : property.type === 'Rent' ? 'Apply to Rent' : 'Make an Offer'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button className="w-full h-11 bg-white border-2 border-slate-100 hover:border-primary/20 hover:bg-slate-50 text-slate-700 rounded-full font-semibold text-sm transition-all flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Schedule Viewing
                  </button>
                </div>

                {property.type === 'Rent' && property.rentBreakdown && (
                  <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5">
                    <h4 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-widest">Fee Breakdown</h4>
                    {Object.entries(property.rentBreakdown).map(([label, val]) => (
                      <div key={label} className="flex justify-between items-center text-sm font-medium">
                        <span className="text-slate-500 capitalize">{label.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-slate-900 font-bold">{val}</span>
                      </div>
                    ))}
                  </div>
                )}

                {property.type === 'Shortlet' && property.houseRules && (
                  <div className="mt-6 pt-5 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-widest">House Rules</h4>
                    <ul className="space-y-1.5">
                      {property.houseRules.map((rule, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                          <CheckCircle className="w-3.5 h-3.5 text-slate-300" /> {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Agent Card */}
              {property.agent && (
                <div className="bg-white rounded-[20px] p-5 border border-slate-200 shadow-xl shadow-slate-200/30">
                  <div className="flex items-center gap-3.5 mb-5">
                    <div className="relative">
                      <ImageWithFallback src={property.agent.avatar} alt={property.agent.name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md" />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <ShieldCheck className="w-2.5 h-2.5 text-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900">{property.agent.name}</h4>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{property.agent.agency}</div>
                      <div className="flex items-center gap-1 mt-0.5">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />)}
                        <span className="text-[9px] font-bold text-slate-400 ml-1">(42 Reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Agent Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-5 pb-5 border-b border-slate-100">
                    <div className="text-center">
                      <div className="text-base font-black text-slate-900 mb-0.5">4.8</div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-base font-black text-slate-900 mb-0.5">24</div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Listings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-base font-black text-slate-900 mb-0.5">30m</div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Response</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button className="py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" /> Call
                    </button>
                    <button className="py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" /> Message
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[100] flex flex-col"
          >
            <div className="flex items-center justify-between p-4">
              <span className="text-white/60 font-bold text-sm">{activeImage + 1} / {images.length}</span>
              <button
                onClick={() => setShowGallery(false)}
                className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center px-4">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-4xl w-full aspect-[16/10] rounded-2xl overflow-hidden"
              >
                <ImageWithFallback src={images[activeImage]} alt="" className="w-full h-full object-cover" />
              </motion.div>
            </div>
            <div className="p-4 flex gap-2 justify-center overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                    i === activeImage ? 'border-primary scale-110' : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  <ImageWithFallback src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
