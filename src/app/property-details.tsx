import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, Bed, Bath, Maximize, Clock, ShieldCheck, 
  ChevronLeft, Share2, Heart, CheckCircle, User, 
  Phone, MessageSquare, Calendar, Star, Info, 
  ArrowRight, X, Sparkles, Shield, Grid
} from 'lucide-react';
import { MOCK_PROPERTIES, Property } from './data';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { Navbar } from './components/navbar';
import { Footer } from './components/footer';

export const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  useEffect(() => {
    const found = MOCK_PROPERTIES.find(p => p.id === Number(id));
    if (found) {
      setProperty(found);
    } else {
      navigate('/explore');
    }
    window.scrollTo(0, 0);
  }, [id, navigate]);

  if (!property) return null;

  const handleRestrictedAction = () => {
    setShowSignupModal(true);
  };

  const images = property.gallery || [property.image, property.image, property.image];

  return (
    <div className="min-h-screen bg-[#F8F9FA] selection:bg-primary selection:text-white font-['Urbanist']">
      <Navbar />
      
      {/* Back Button & Top Actions */}
      <div className="pt-24 pb-6 container mx-auto px-4 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-bold group"
        >
          <div className="p-2 bg-white rounded-full shadow-sm border border-slate-100 group-hover:-translate-x-1 transition-transform">
            <ChevronLeft className="w-5 h-5" />
          </div>
          Back to Results
        </button>
        <div className="flex gap-3">
          <button className="p-3 bg-white rounded-full shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">
            <Share2 className="w-5 h-5 text-slate-600" />
          </button>
          <button 
            onClick={handleRestrictedAction}
            className="p-3 bg-white rounded-full shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors group"
          >
            <Heart className="w-5 h-5 text-slate-600 group-hover:text-red-500 transition-colors" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-20">
        {/* Gallery Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10 h-[300px] md:h-[480px] relative">
          <div className="lg:col-span-2 rounded-[24px] overflow-hidden relative cursor-pointer group" onClick={() => setShowGallery(true)}>
            <ImageWithFallback 
              src={images[0]} 
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            
            {/* Badges on Gallery */}
            <div className="absolute top-6 left-6 flex flex-col gap-3">
              {property.verified && (
                <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border border-white/20">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">Verified Listing</span>
                </div>
              )}
              <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border border-white/10">
                <Clock className="w-4 h-4 text-white" />
                <span className="text-xs font-bold text-white uppercase tracking-widest">{property.listedDate}</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:grid grid-cols-2 grid-rows-2 gap-4">
            {images.slice(1, 5).map((img, i) => (
              <div 
                key={i} 
                className={`rounded-[24px] overflow-hidden cursor-pointer relative group ${activeImage === i + 1 ? 'ring-2 ring-primary' : ''}`}
                onClick={() => {
                  setActiveImage(i + 1);
                  setShowGallery(true);
                }}
              >
                <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              </div>
            ))}
          </div>
          <button 
            onClick={() => setShowGallery(true)}
            className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-[24px] shadow-xl flex items-center gap-2 border border-white/20 hover:bg-white transition-all group z-10"
          >
            <Grid className="w-4 h-4 text-slate-900" />
            <span className="text-sm font-bold text-slate-900">Show all photos</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Column: Details */}
          <div className="flex-1 space-y-12">
            {/* Title Block */}
            <section>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
                <div>
                  <div className="text-[12px] font-extrabold text-primary uppercase tracking-[0.2em] mb-3 bg-primary/10 px-3 py-1.5 rounded-md w-fit">
                    {property.propertyType} {property.type === 'Buy' ? 'for Sale' : property.type === 'Rent' ? 'for Rent' : 'Shortlet'}
                  </div>
                  <h1 className="font-black text-slate-900 mb-4 leading-tight text-[24px]">{property.title}</h1>
                  <div className="flex items-center gap-3 text-slate-500">
                    <MapPin className="w-5 h-5" />
                    <span className="font-semibold text-[16px]">{property.location}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-y border-slate-100 px-[0px] py-[8px]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[24px] bg-slate-50 flex items-center justify-center border border-slate-100">
                    <Bed className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-slate-900 leading-none">{property.bedrooms}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Bedrooms</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[24px] bg-slate-50 flex items-center justify-center border border-slate-100">
                    <Bath className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-slate-900 leading-none">{property.bathrooms}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Bathrooms</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[24px] bg-slate-50 flex items-center justify-center border border-slate-100">
                    <Maximize className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-slate-900 leading-none">{property.landSize}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Area Size</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[24px] bg-slate-50 flex items-center justify-center border border-slate-100">
                    <CheckCircle className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-slate-900 leading-none">{property.verified ? 'Verified' : 'Pending'}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Status</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Houzii Trust Section */}
            <section className="bg-primary/5 rounded-[24px] p-8 border border-primary/10 relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
              <div className="relative flex flex-col md:flex-row items-center gap-8">
                <div className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center shrink-0 border-2 border-primary/20">
                  <ShieldCheck className="w-10 h-10 text-primary" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-black text-slate-900 mb-2">Houzii Verified Listing</h3>
                  <p className="text-slate-600 mb-4 max-w-md font-medium">This property has passed our rigorous multi-point verification check to ensure absolute transparency and trust.</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                      <CheckCircle className="w-4 h-4 text-green-500" /> Agent Identity Verified
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                      <CheckCircle className="w-4 h-4 text-green-500" /> Documents Reviewed
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                      <CheckCircle className="w-4 h-4 text-green-500" /> Property Verified
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* About Section */}
            <section>
              <h3 className="text-[20px] font-black text-slate-900 mb-6 flex items-center gap-3">
                <Info className="w-6 h-6 text-primary" />
                About This Property
              </h3>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-medium">
                {property.description || "No description provided for this property."}
              </div>
            </section>

            {/* Amenities Section */}
            <section>
              <h3 className="text-[20px] font-black text-slate-900 mb-6 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-primary" />
                Key Amenities
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(property.amenities || ["Security", "Electricity", "Water Supply", "Parking"]).map((amenity, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-[24px] border border-slate-100 shadow-sm hover:border-primary/20 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-sm font-bold text-slate-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Location Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[20px] font-black text-slate-900 flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-primary" />
                  Location
                </h3>
                <button className="text-sm font-bold text-primary hover:underline">View on Map</button>
              </div>
              <div className="aspect-[21/9] rounded-[24px] overflow-hidden bg-slate-100 border border-slate-200 relative group cursor-pointer">
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
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-[24px] border border-white/20 shadow-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm font-bold text-slate-800">{property.location}</span>
                  </div>
                  <button className="px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors">Get Directions</button>
                </div>
              </div>
            </section>

            {/* Similar Properties Section */}
            <section className="pt-10 border-t border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-slate-900 text-[20px]">Similar Properties</h3>
                <button 
                  onClick={() => navigate('/explore')}
                  className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MOCK_PROPERTIES
                  .filter(p => p.id !== property.id && p.type === property.type)
                  .slice(0, 2)
                  .map((prop) => (
                    <motion.div 
                      key={prop.id}
                      onClick={() => navigate(`/property/${prop.id}`)}
                      className="group bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-md hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col"
                    >
                      <div className="relative aspect-[3/2] overflow-hidden bg-slate-50">
                        <img src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        
                        {/* Top Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
                          {prop.verified && (
                            <div className="bg-white px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-slate-100">
                              <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">Verified</span>
                            </div>
                          )}
                          <div className="bg-slate-900 px-2.5 py-1 rounded-md text-[10px] font-bold text-white tracking-widest uppercase">
                            {prop.listedDate}
                          </div>
                        </div>
                        
                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleRestrictedAction(); }}
                            className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-slate-600 hover:text-red-500 transition-colors shadow-md border border-slate-100"
                          >
                            <Heart className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="text-xs font-semibold">{prop.location}</span>
                          </div>
                        </div>
                        
                        <h3 className="text-[17px] font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors line-clamp-1">
                          {prop.title}
                        </h3>
                        
                        <div className="flex flex-wrap gap-y-3 gap-x-4 mb-4 pb-4 border-b border-slate-100">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Bed className="w-4 h-4" />
                            <span className="text-sm font-bold">{prop.bedrooms} <span className="font-normal text-xs text-slate-500">Beds</span></span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Bath className="w-4 h-4" />
                            <span className="text-sm font-bold">{prop.bathrooms} <span className="font-normal text-xs text-slate-500">Baths</span></span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Maximize className="w-4 h-4" />
                            <span className="text-sm font-bold">{prop.landSize}</span>
                          </div>
                        </div>
                        
                        <div className="mt-auto pt-1 flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest mb-2 bg-primary/5 w-fit px-2 py-0.5 rounded-md">{prop.propertyType}</span>
                            <span className="text-xl font-black text-slate-900 leading-none">{prop.price}</span>
                          </div>
                          
                          {/* Agent Avatar Badge */}
                          <div className="w-10 h-10 rounded-full border-2 border-white shadow-lg overflow-hidden shrink-0 group-hover:scale-110 transition-transform">
                            <img src={prop.agent?.avatar} alt="Agent" className="w-full h-full object-cover" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </section>
          </div>

          {/* Right Column: Sticky Action Panel */}
          <div className="w-full lg:w-[400px]">
            <div className="sticky top-28 space-y-6">
              {/* Pricing & Booking Card */}
              <div className="bg-white rounded-[24px] p-8 border border-slate-200 shadow-2xl shadow-slate-200/50">
                <div className="mb-8">
                  <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
                    {property.type === 'Buy' ? 'Property Price' : property.type === 'Rent' ? 'Annual Rent' : 'Nightly Price'}
                  </div>
                  <div className="font-black text-slate-900 text-[24px]">{property.price}</div>
                  {property.type === 'Buy' && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-[24px] border border-slate-100 flex items-center gap-3">
                      <Info className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-bold text-slate-600">Estimate: ₦1.2M / mo</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {property.type === 'Shortlet' && (
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Check-in</label>
                        <div className="p-3 bg-slate-50 rounded-[24px] border border-slate-100 text-sm font-bold text-slate-700 flex items-center justify-between">
                          Add Date <Calendar className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Check-out</label>
                        <div className="p-3 bg-slate-50 rounded-[24px] border border-slate-100 text-sm font-bold text-slate-700 flex items-center justify-between">
                          Add Date <Calendar className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={handleRestrictedAction}
                    className="w-full h-12 bg-primary hover:bg-primary-dark text-white rounded-full font-medium shadow-lg shadow-primary/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-[16px]"
                  >
                    {property.type === 'Shortlet' ? 'Book Now' : property.type === 'Rent' ? 'Apply to Rent' : 'Make an Offer'}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleRestrictedAction}
                    className="w-full h-12 bg-white border-2 border-slate-100 hover:border-primary/20 hover:bg-slate-50 text-slate-700 rounded-full font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-5 h-5" />
                    Schedule Viewing
                  </button>
                </div>

                {property.type === 'Rent' && property.rentBreakdown && (
                  <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
                    <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest">Fee Breakdown</h4>
                    {Object.entries(property.rentBreakdown).map(([label, val]) => (
                      <div key={label} className="flex justify-between items-center text-sm font-medium">
                        <span className="text-slate-500 capitalize">{label.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-slate-900 font-bold">{val}</span>
                      </div>
                    ))}
                  </div>
                )}

                {property.type === 'Shortlet' && property.houseRules && (
                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest">House Rules</h4>
                    <ul className="space-y-2">
                      {property.houseRules.map((rule, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm font-medium text-slate-600">
                          <CheckCircle className="w-4 h-4 text-slate-300" /> {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Agent Card */}
              <div className="bg-white rounded-[24px] p-6 border border-slate-200 shadow-xl shadow-slate-200/30">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <img src={property.agent?.avatar} alt={property.agent?.name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <ShieldCheck className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900">{property.agent?.name}</h4>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{property.agent?.agency}</div>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                      <span className="text-[10px] font-bold text-slate-400 ml-1">(42 Reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Agent Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6 pb-6 border-b border-slate-100">
                  <div className="text-center">
                    <div className="text-lg font-black text-slate-900 mb-1">4.8</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-black text-slate-900 mb-1">24</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Listings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-black text-slate-900 mb-1">30 mins</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Response Time</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={handleRestrictedAction}
                    className="py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-[24px] font-bold text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" /> Call
                  </button>
                  <button 
                    onClick={handleRestrictedAction}
                    className="py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-[24px] font-bold text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" /> Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Signup Gating Modal */}
      <AnimatePresence>
        {showSignupModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowSignupModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[24px] overflow-hidden shadow-2xl"
            >
              <div className="relative aspect-video w-full">
                <img 
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1000" 
                  alt="Signup" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
                <button 
                  onClick={() => setShowSignupModal(false)}
                  className="absolute top-6 right-6 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-white/20 text-slate-900 hover:scale-110 transition-transform"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-10 -mt-20 relative bg-white rounded-t-[24px] text-center">
                <div className="w-20 h-20 rounded-[24px] bg-primary flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20 -mt-16 relative z-10">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4">Join Houzii to Continue</h3>
                <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium">Create a free account to contact verified agents, save properties, and schedule viewings instantly.</p>
                
                <div className="space-y-4">
                  <button 
                    onClick={() => navigate('/onboarding')}
                    className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-full font-black text-lg shadow-lg shadow-primary/25 transition-all active:scale-[0.98]"
                  >
                    Get started
                  </button>
                  <button className="w-full py-4 bg-white border-2 border-slate-100 hover:border-slate-200 text-slate-700 rounded-full font-bold transition-all flex items-center justify-center gap-3">
                    <img src="https://www.google.com/favicon.ico" alt="" className="w-5 h-5" />
                    Continue with Google
                  </button>
                </div>
                
                <p className="mt-8 text-sm font-bold text-slate-400">
                  Already have an account? <button className="text-primary hover:underline">Login</button>
                </p>

                <div className="mt-10 grid grid-cols-2 gap-4 border-t border-slate-50 pt-8">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                      <Shield className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secure Transactions</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Listings</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Fullscreen Gallery Overlay */}
      <AnimatePresence>
        {showGallery && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-slate-950 flex flex-col"
          >
            <div className="p-6 flex items-center justify-between">
              <div className="text-white font-bold">
                {activeImage + 1} / {images.length}
              </div>
              <button 
                onClick={() => setShowGallery(false)}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 relative flex items-center justify-center px-10">
              <img src={images[activeImage]} alt="" className="max-w-full max-h-[80vh] object-contain rounded-[24px]" />
            </div>
            <div className="p-10 overflow-x-auto flex gap-4 scrollbar-hide">
              {images.map((img, i) => (
                <div 
                  key={i} 
                  className={`w-32 h-20 rounded-[24px] overflow-hidden cursor-pointer shrink-0 transition-all ${activeImage === i ? 'ring-4 ring-primary scale-110' : 'opacity-40 grayscale hover:opacity-100 hover:grayscale-0'}`}
                  onClick={() => setActiveImage(i)}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};