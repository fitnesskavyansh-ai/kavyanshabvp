import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  ShieldCheck,
  AlertCircle,
  PhoneCall,
  Lock,
  User,
  ExternalLink,
  Instagram,
  Facebook,
  Twitter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { profile, setIsAdminOpen, setIsIssueModalOpen } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About Me', href: '#about' },
    { name: 'My Journey', href: '#journey' },
    { name: 'कार्य व गतिविधियाँ', href: '#activities' },
    { name: 'शिकायत व सुझाव', href: '#complaint-center' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Updates', href: '#updates' },
    { name: 'दृष्टिकोण (Vision)', href: '#vision' },
    { name: 'Resources', href: '#resources' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-navbar-header"
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-orange-200 text-slate-800'
          : 'bg-white text-slate-800 border-b border-orange-200/80 shadow-xs'
      }`}
    >
      {/* Top Organization Bar in Vibrant Saffron Orange */}
      <div
        id="top-org-bar"
        className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white py-1.5 px-4 text-xs font-semibold tracking-wide shadow-xs"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span>अखिल भारतीय विद्यार्थी परिषद (ABVP) • नगर इकाई मथुरा</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-normal">
            <a
              href="tel:+916395014760"
              className="hidden sm:inline-flex items-center gap-1.5 text-white hover:text-amber-200 font-bold transition bg-black/20 hover:bg-black/35 px-2.5 py-0.5 rounded-md"
              title="Call Kavyansh Kayastha: 6395014760"
            >
              <PhoneCall className="w-3 h-3 text-amber-300" />
              <span>Call: +91 63950 14760</span>
            </a>

            {/* Direct Social Links in Top Org Bar */}
            <div className="flex items-center gap-1.5">
              <a
                href={profile.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded bg-black/20 hover:bg-pink-600/60 text-white transition flex items-center justify-center"
                title="Instagram Profile"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href={profile.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded bg-black/20 hover:bg-blue-600/60 text-white transition flex items-center justify-center"
                title="Facebook Page"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href={profile.socials.twitterX}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded bg-black/20 hover:bg-slate-900/60 text-white transition flex items-center justify-center"
                title="Twitter / X Handle"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
            </div>

            <button
              id="admin-portal-login-button"
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center gap-1.5 text-xs bg-black/20 hover:bg-black/35 px-2.5 py-0.5 rounded-md transition text-white font-medium cursor-pointer"
              title="Admin Portal for Grievances & Updates"
            >
              <Lock className="w-3 h-3 text-orange-200" />
              <span>Admin Login</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar in Pristine White with Orange Accents */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand / Identity */}
          <a
            id="brand-logo-link"
            href="#home"
            className="flex items-center gap-2.5 sm:gap-3.5 group focus:outline-none max-w-[80%] sm:max-w-none"
          >
            <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white border-2 border-orange-500 shadow-md flex items-center justify-center p-0.5 flex-shrink-0 group-hover:scale-105 transition-transform ring-2 ring-orange-100">
              <img
                src="/abvp-logo.png"
                alt="ABVP Official Emblem"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm sm:text-base md:text-lg font-black text-slate-900 tracking-tight leading-tight group-hover:text-orange-600 transition-colors font-hindi">
                काव्यांश कायस्थ
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-orange-600 leading-tight font-hindi mt-0.5">
                नगर मंत्री, चौमुहां–छाता–कोसी, मथुरा
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-tight font-hindi mt-0.5">
                अखिल भारतीय विद्यार्थी परिषद (ABVP)
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav id="desktop-nav" className="hidden xl:flex items-center gap-1 text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-slate-700 hover:text-orange-600 hover:bg-orange-50/80 px-2.5 py-1.5 rounded-lg transition-colors text-[13px] font-semibold"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action CTA & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              id="nav-raise-issue-button"
              onClick={() => {
                const el = document.getElementById('raise-issue');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setIsIssueModalOpen(true);
                }
              }}
              className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl shadow-md hover:shadow-orange-500/25 transition-all border border-orange-400"
            >
              <AlertCircle className="w-4 h-4" />
              <span>अपनी समस्या बताएं</span>
            </button>

            <a
              id="nav-contact-button"
              href="#contact"
              className="hidden md:inline-flex items-center gap-1.5 text-xs text-slate-700 hover:text-orange-600 bg-orange-50/80 hover:bg-orange-100/80 px-3 py-2 rounded-xl transition-colors border border-orange-200 font-semibold"
            >
              <PhoneCall className="w-3.5 h-3.5 text-orange-600" />
              <span>Contact</span>
            </a>

            {/* Mobile Hamburger */}
            <button
              id="mobile-menu-toggle-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-700 hover:text-orange-600 hover:bg-orange-50 transition-colors focus:outline-none border border-orange-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="xl:hidden bg-white border-b border-orange-200 px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-in slide-in-from-top-4 duration-200"
        >
          {/* Mobile Profile Area */}
          <div className="flex items-center gap-3 p-2.5 bg-orange-50/70 rounded-xl border border-orange-200">
            <div className="w-11 h-12 rounded-lg overflow-hidden border border-orange-300 bg-white flex-shrink-0">
              <img
                src={profile.photoUrl || '/kavyansh-kayastha.jpg'}
                alt={profile.name}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-black text-slate-900 truncate font-hindi">
                काव्यांश कायस्थ
              </div>
              <div className="text-[11px] font-bold text-orange-600 truncate font-hindi">
                {profile.role || 'नगर मंत्री, चौमुहां–छाता–कोसी, मथुरा'}
              </div>
              <div className="text-[10px] text-slate-500 truncate font-hindi">
                अखिल भारतीय विद्यार्थी परिषद (ABVP)
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-orange-100">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={handleNavClick}
                className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <div className="flex items-center justify-center gap-2 py-1.5 bg-orange-50/60 rounded-xl border border-orange-100">
              <span className="text-xs font-bold text-slate-600 mr-1">Connect:</span>
              <a
                href={profile.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white text-pink-700 text-xs font-bold border border-pink-200 shadow-xs"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-600" />
                <span>Instagram</span>
              </a>
              <a
                href={profile.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white text-blue-700 text-xs font-bold border border-blue-200 shadow-xs"
              >
                <Facebook className="w-3.5 h-3.5 text-blue-600" />
                <span>Facebook</span>
              </a>
              <a
                href={profile.socials.twitterX}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white text-slate-800 text-xs font-bold border border-slate-300 shadow-xs"
              >
                <Twitter className="w-3.5 h-3.5 text-slate-800" />
                <span>X</span>
              </a>
            </div>

            <a
              id="mobile-nav-call-helpline"
              href="tel:+916395014760"
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-orange-50 text-slate-800 font-bold py-2.5 px-4 rounded-xl border border-orange-300 shadow-xs text-sm transition"
            >
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              <span>Call Kavyansh Kayastha: +91 63950 14760</span>
            </a>

            <button
              id="mobile-raise-issue-button"
              onClick={() => {
                setMobileMenuOpen(false);
                const el = document.getElementById('raise-issue');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-2.5 px-4 rounded-xl shadow-md text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              <span>अपनी समस्या बताएं (Raise an Issue)</span>
            </button>
            <div className="flex items-center justify-between px-2 pt-1 text-xs text-slate-500">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAdminOpen(true);
                }}
                className="flex items-center gap-1 text-slate-600 hover:text-orange-600 font-semibold"
              >
                <Lock className="w-3.5 h-3.5 text-orange-500" />
                <span>Admin Login Portal</span>
              </button>
              <span className="font-medium text-slate-400">Mathura, UP</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
