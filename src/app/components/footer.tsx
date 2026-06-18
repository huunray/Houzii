import React from "react";
import { Send, MapPin, Phone, Mail, Instagram, Twitter, Facebook, Linkedin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Group from "../../imports/Group1410124151";

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-32 pb-16 overflow-hidden relative">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-24 pb-24 border-b border-white/10">
          <div className="lg:col-span-4 max-w-sm text-left">
            <Link to="/" className="flex items-center gap-2 mb-10 group h-8">
              <div className="h-8 w-auto relative" style={{ aspectRatio: '1378.66/461.842' }}>
                <Group scrolled={false} />
              </div>
            </Link>
            <p className="text-white/40 text-lg leading-relaxed mb-12 italic">
              "Building Africa's most trusted real estate ecosystem, 
              one verified property at a time."
            </p>
            <div className="flex items-center gap-4">
              {[Instagram, Twitter, Facebook, Linkedin].map((Icon, idx) => (
                <button
                  key={idx}
                  className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary transition-all hover:border-primary group"
                >
                  <Icon className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 text-left">
            <h4 className="text-xl font-bold mb-10 text-white">Platform</h4>
            <ul className="space-y-6">
              {[
                { name: "Explore Properties", path: "/explore" },
                { name: "Find Professionals", path: "/find-professionals" },
                { name: "For Property Owners", path: "/owners" },
                { name: "For Agents", path: "/for-agents" },
                { name: "For Professional", path: "/professional" }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-white/40 hover:text-accent transition-colors block group whitespace-nowrap">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 text-left">
            <h4 className="text-xl font-bold mb-10 text-white">Company</h4>
            <ul className="space-y-6">
              {["About Houzii", "Help Center", "Careers", "Contact", "Privacy Policy", "Terms"].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-white/40 hover:text-accent transition-colors block group whitespace-nowrap">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4 text-left">
            <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 backdrop-blur-md">
              <h4 className="text-2xl font-bold mb-6 text-white">Houzii Newsletter</h4>
              <p className="text-white/40 mb-10 text-sm leading-relaxed">
                Subscribe to get the latest property market insights and investment opportunities directly in your inbox.
              </p>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4 pr-14 text-sm focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-white outline-none group-hover:bg-white/10"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white hover:bg-primary transition-colors shadow-lg shadow-accent/20 group/btn">
                  <Send className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 text-left">
          <p className="text-white/30 text-sm font-medium">
            © {new Date().getFullYear()} Houzii Technologies Limited. All rights reserved.
          </p>
          <div className="flex flex-wrap md:flex-nowrap items-center gap-8 md:gap-12 text-sm font-bold text-white/50 uppercase tracking-widest">
            <span className="hover:text-accent cursor-pointer transition-colors">Nigeria</span>
          </div>
        </div>
      </div>
    </footer>
  );
};