import React from 'react';
import {
  MapPin,
  GraduationCap,
  Users,
  Calendar,
  AlertCircle,
  MessageSquare,
  Compass,
  ArrowRight,
  Phone,
  ShieldCheck,
  Lock,
  Instagram,
  Facebook,
  Twitter,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HeroSection: React.FC = () => {
  const { profile } = useApp();
  const photoSrc = profile.photo || profile.photoUrl || '/kavyansh-kayastha.jpg';

  return (
    <section
      id="home"
      className="relative bg-gradient-to-b from-orange-50/70 via-white to-orange-50/40 text-slate-900 pt-12 pb-20 overflow-hidden border-b border-orange-200/80"
    >
      {/* Subtle Background Pattern in Warm Orange / White */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#ea580c_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* ABVP Official Seal Watermark in the Background Corner */}
      <div className="absolute -top-12 -right-12 sm:top-2 sm:right-4 md:right-8 lg:right-12 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 pointer-events-none select-none z-0 opacity-20 sm:opacity-25 hover:opacity-35 transition-all duration-700">
        <img
          src="/abvp-logo.png"
          alt="ABVP Emblem Watermark"
          className="w-full h-full object-contain filter drop-shadow-[0_0_45px_rgba(249,115,22,0.35)] rotate-6"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Profile Photo Column - Large Rounded Portrait with Navy + Saffron accents */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative">
              {/* Decorative saffron + navy ambient ring */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-slate-900/20 via-orange-500/20 to-amber-500/20 rounded-2xl blur-md"></div>

              {/* Centralized Official Permanent Profile Photo Card */}
              <div
                id="hero-profile-photo-container"
                className="relative w-72 h-84 sm:w-80 sm:h-96 rounded-2xl bg-white border border-slate-200 ring-4 ring-orange-500/15 overflow-hidden shadow-xl flex flex-col items-center justify-center text-center transition-all duration-300"
              >
                <img
                  src={photoSrc}
                  alt={profile.name}
                  className="w-full h-full object-cover object-top"
                />

                {/* Official ABVP Seal Stamp Badge Top-Left */}
                <div
                  className="absolute top-3 left-3 bg-white/95 backdrop-blur-md border border-orange-300 p-1.5 rounded-full shadow-md flex items-center justify-center z-10"
                  title="Akhil Bharatiya Vidyarthi Parishad"
                >
                  <img src="/abvp-logo.png" alt="ABVP Emblem" className="w-6 h-6 rounded-full" />
                </div>

                {/* Subtle Badge: "Locked & Verified Official Photo" */}
                <div className="absolute top-3 right-3 shadow-sm z-10">
                  <div className="bg-slate-950/90 backdrop-blur-md border border-emerald-500/50 text-emerald-300 px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 shadow-md">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>Locked & Permanent</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white border border-orange-200 text-slate-900 px-4 py-1 rounded-full text-xs font-bold shadow-md whitespace-nowrap flex items-center gap-2 ring-2 ring-orange-50 z-10">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-slate-800">Nagar Mantri • Mathura</span>
              </div>
            </div>

            {/* Permanent Lock Status Below Photo */}
            <div className="mt-7 flex flex-col items-center gap-1.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-300/80 text-emerald-900 text-xs font-bold shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>आधिकारिक तस्वीर लॉक एवं स्थायी (Permanently Locked)</span>
              </div>
              <p className="text-[11px] text-slate-500 text-center max-w-xs font-medium">
                Official verified photograph of {profile.name}, Nagar Mantri, Mathura.
              </p>
            </div>
          </div>

          {/* Profile Identity & Summary Column */}
          <div className="lg:col-span-7 flex flex-col space-y-6 text-center lg:text-left">
            {/* Tagline Badge with Official Emblem */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-orange-100/90 border border-orange-300 text-orange-950 text-xs font-bold w-fit mx-auto lg:mx-0 shadow-xs">
              <img src="/abvp-logo.png" alt="ABVP" className="w-4 h-4 rounded-full object-contain bg-white flex-shrink-0" />
              <span>अखिल भारतीय विद्यार्थी परिषद • Nagar Mantri, Mathura</span>
            </div>

            {/* Name & Role */}
            <div className="space-y-2">
              <div className="flex flex-col lg:flex-row items-center lg:items-baseline gap-2 lg:gap-3 justify-center lg:justify-start">
                <h1
                  id="hero-full-name"
                  className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-tight"
                >
                  {profile.name}
                </h1>
                {profile.communitySubtitle && (
                  <span className="text-sm sm:text-base font-semibold text-orange-800 font-hindi px-3 py-0.5 rounded-full bg-orange-100 border border-orange-300 shadow-xs">
                    {profile.communitySubtitle}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <p
                  id="hero-public-role"
                  className="text-xl sm:text-2xl font-extrabold text-orange-600"
                >
                  {profile.role}
                </p>

                {/* Organization Card with Official Emblem */}
                <div className="inline-flex items-center justify-center lg:justify-start gap-3 px-3.5 py-2 rounded-2xl bg-white border border-orange-200/90 shadow-xs w-fit mx-auto lg:mx-0">
                  <img
                    src="/abvp-logo.png"
                    alt="ABVP Official Emblem"
                    className="w-8 h-8 rounded-full shadow-xs flex-shrink-0 bg-white ring-2 ring-orange-200"
                  />
                  <div className="text-left">
                    <p
                      id="hero-organisation"
                      className="text-sm sm:text-base text-slate-950 font-black leading-tight"
                    >
                      {profile.organisation}
                    </p>
                    <p className="text-[11px] text-orange-700 font-semibold font-hindi leading-tight">
                      ज्ञान • शील • एकता
                    </p>
                  </div>
                </div>

                <p
                  id="hero-city-location"
                  className="text-sm text-slate-600 font-medium flex items-center justify-center lg:justify-start gap-1.5 pt-0.5"
                >
                  <MapPin className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <span>{profile.city}</span>
                </p>
              </div>
            </div>

            {/* Short Introduction Quote */}
            <div
              id="hero-short-intro"
              className="relative p-5 rounded-2xl bg-white border border-orange-200 text-slate-700 text-base sm:text-lg leading-relaxed shadow-sm font-normal"
            >
              <span className="text-orange-500 text-2xl font-serif mr-1">“</span>
              {profile.shortIntro}
              <span className="text-orange-500 text-2xl font-serif ml-1">”</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <a
                id="hero-btn-raise-issue"
                href="#raise-issue"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm sm:text-base px-6 py-3 rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all border border-orange-400"
              >
                <AlertCircle className="w-5 h-5" />
                <span>Raise an Issue (अपनी समस्या बताएं)</span>
              </a>

              <a
                id="hero-btn-contact"
                href="#contact"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-orange-50 text-slate-800 font-bold text-sm sm:text-base px-5 py-3 rounded-xl transition border border-orange-300 shadow-sm"
              >
                <MessageSquare className="w-4 h-4 text-orange-600" />
                <span>Contact Me</span>
              </a>

              <a
                id="hero-btn-call-helpline"
                href={`tel:${(profile.phone || '6395014760').replace(/\s+/g, '')}`}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-orange-50 text-slate-800 font-bold text-sm sm:text-base px-4 py-3 rounded-xl transition border border-orange-300 shadow-xs"
                title="Direct Helpline Call"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Call: {profile.phone || '+91 63950 14760'}</span>
              </a>

              <a
                id="hero-btn-journey"
                href="#journey"
                className="inline-flex items-center justify-center gap-1.5 text-slate-700 hover:text-orange-600 text-sm font-semibold px-4 py-3 rounded-xl hover:bg-orange-50 transition border border-orange-200/60"
              >
                <Compass className="w-4 h-4 text-orange-600" />
                <span>My Journey</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Social Media Connectivity Direct Links */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1">
              <span className="text-xs font-bold text-slate-600 mr-1">सोशल मीडिया:</span>
              <a
                id="hero-social-instagram"
                href={profile.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-50 via-rose-50 to-orange-50 hover:from-pink-100 hover:to-orange-100 text-slate-900 border border-pink-200 hover:border-pink-400 text-xs font-bold transition shadow-xs"
                title="Follow Kavyansh on Instagram"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-600" />
                <span>Instagram</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
              <a
                id="hero-social-facebook"
                href={profile.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-slate-900 border border-blue-200 hover:border-blue-400 text-xs font-bold transition shadow-xs"
                title="Connect with Kavyansh on Facebook"
              >
                <Facebook className="w-3.5 h-3.5 text-blue-600" />
                <span>Facebook</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
              <a
                id="hero-social-twitter"
                href={profile.socials.twitterX}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 hover:border-slate-500 text-xs font-bold transition shadow-xs"
                title="Follow Kavyansh on X (Twitter)"
              >
                <Twitter className="w-3.5 h-3.5 text-slate-800" />
                <span>X (Twitter)</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>

            {/* Trust-Oriented Indicator Section in Orange & White */}
            <div
              id="hero-trust-indicators"
              className="pt-6 border-t border-orange-200 grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              <div className="bg-white p-3.5 rounded-xl border border-orange-200 shadow-xs flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-[11px] text-slate-500 uppercase font-semibold">Location</p>
                  <p className="text-xs font-extrabold text-slate-900">Mathura</p>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-orange-200 shadow-xs flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-[11px] text-slate-500 uppercase font-semibold">Role</p>
                  <p className="text-xs font-extrabold text-slate-900">Student</p>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-orange-200 shadow-xs flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 flex-shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-[11px] text-slate-500 uppercase font-semibold">Domain</p>
                  <p className="text-xs font-extrabold text-slate-900">Public Service</p>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-orange-200 shadow-xs flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-[11px] text-slate-500 uppercase font-semibold">Active Since</p>
                  <p className="text-xs font-extrabold text-slate-900">{profile.joiningYear}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
