import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown, User, LogIn, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import Group from "../../imports/Group1410124151";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const isLightPage = location.pathname === '/explore' || location.pathname.startsWith('/property/') || location.pathname === '/for-agents' || location.pathname === '/professional' || location.pathname === '/owners' || location.pathname === '/find-professionals';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Explore", path: "/explore" },
    { name: "Find professionals", path: "/find-professionals" },
    { name: "For Property Owners", path: "/owners" },
    { name: "For Agents", path: "/for-agents" },
    { name: "For Professional", path: "/professional" },
  ];

  const forceDarkText = isLightPage || scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-xl shadow-sm py-3" : isLightPage ? "bg-white/50 backdrop-blur-md py-3 border-b border-slate-200" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 relative">
        <div className="flex items-center justify-between">
          {/* Logo - Left Side */}
          <Link to="/" className="flex items-center gap-2 group relative z-10 h-7">
            <div className="h-7 w-auto relative" style={{ aspectRatio: '1378.66/461.842' }}>
              <Group scrolled={forceDarkText} />
            </div>
          </Link>

          {/* Desktop Main Nav - Absolutely Centered */}
          <div className="hidden lg:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-normal transition-colors relative group whitespace-nowrap ${
                  forceDarkText ? "text-slate-600 hover:text-primary" : "text-white/90 hover:text-white"
                }`}
              >
                {link.name === "Find professionals" ? "Find Professionals" : link.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full ${
                  forceDarkText ? "bg-primary" : "bg-white"
                }`} />
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-4 relative z-10">
            <button className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 transition-colors ${
              forceDarkText ? "text-slate-600 hover:text-primary" : "text-white/90 hover:text-white"
            }`}>
              Login
              <LogIn className="w-4 h-4" />
            </button>
            <button className="bg-primary text-white text-sm font-bold px-8 py-3 rounded-full hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 active:scale-95">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-slate-900 bg-white/50 backdrop-blur rounded-[24px] border border-slate-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-2xl overflow-hidden rounded-b-[32px]"
          >
            <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="text-xl font-bold text-slate-900 hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              <div className="flex flex-col gap-3 pt-4">
                <button className="w-full flex items-center justify-center gap-2 text-slate-900 font-bold py-4 border-2 border-slate-100 rounded-full">
                  <LogIn className="w-4 h-4" />
                  Login
                </button>
                <button className="w-full bg-primary text-white font-bold py-4 rounded-full shadow-xl shadow-primary/20">
                  Join Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};