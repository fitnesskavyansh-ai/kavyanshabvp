import React from 'react';
import {
  ShieldCheck,
  Heart,
  ExternalLink,
  ChevronUp,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { profile, setActivePolicyModal } = useApp();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-white text-slate-600 border-t border-orange-200 text-xs overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Col 1: Identity */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500 shadow-sm flex items-center justify-center flex-shrink-0 bg-white ring-2 ring-orange-100">
                <img
                  src={profile.photoUrl || '/kavyansh-kayastha.jpg'}
                  alt={profile.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 leading-tight font-hindi">
                  काव्यांश कायस्थ
                </h3>
                <p className="text-xs text-orange-600 font-bold font-hindi">
                  {profile.role || 'नगर मंत्री, चौमुहां–छाता–कोसी, मथुरा'}
                </p>
                <p className="text-[11px] text-slate-500 font-medium font-hindi">
                  अखिल भारतीय विद्यार्थी परिषद (ABVP)
                </p>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed text-xs max-w-sm font-medium">
              Official personal portfolio and public contact platform for student welfare,
              campus grievance redressal, and youth empowerment in Mathura, Uttar Pradesh.
            </p>

            <div className="flex flex-col gap-1.5 pt-2 text-xs font-semibold">
              <a
                href={`tel:${(profile.phone || '6395014760').replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 text-slate-800 hover:text-orange-600 transition"
              >
                <div className="w-5 h-5 rounded-md bg-orange-100 flex items-center justify-center text-orange-600 flex-shrink-0">
                  <Phone className="w-3 h-3" />
                </div>
                <span>Call Kavyansh Kayastha: {profile.phone || '+91 63950 14760'}</span>
              </a>

              <a
                href={`mailto:${profile.email || 'kavyanshkayasthabvp@gmail.com'}`}
                className="inline-flex items-center gap-2 text-slate-800 hover:text-orange-600 transition"
              >
                <div className="w-5 h-5 rounded-md bg-orange-100 flex items-center justify-center text-orange-600 flex-shrink-0">
                  <Mail className="w-3 h-3" />
                </div>
                <span>{profile.email || 'kavyanshkayasthabvp@gmail.com'}</span>
              </a>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href={profile.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-600 border border-pink-200 hover:border-pink-400 flex items-center justify-center transition shadow-xs"
                title="Follow Kavyansh on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={profile.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 hover:border-blue-400 flex items-center justify-center transition shadow-xs"
                title="Connect with Kavyansh on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={profile.socials.twitterX}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 hover:border-slate-500 flex items-center justify-center transition shadow-xs"
                title="Follow Kavyansh on X (Twitter)"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] text-slate-600 font-semibold">
                Mathura Nagar Ikai • Non-commercial Public Service
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Quick Navigation
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              <a href="#home" className="text-slate-600 hover:text-orange-600 transition">
                Home
              </a>
              <a href="#about" className="text-slate-600 hover:text-orange-600 transition">
                About Me
              </a>
              <a href="#journey" className="text-slate-600 hover:text-orange-600 transition">
                My Journey
              </a>
              <a href="#activities" className="text-slate-600 hover:text-orange-600 transition">
                कार्य एवं गतिविधियाँ
              </a>
              <a href="#raise-issue" className="text-orange-600 hover:underline font-bold">
                Raise an Issue (समस्या बताएं)
              </a>
              <a href="#gallery" className="text-slate-600 hover:text-orange-600 transition">
                Gallery
              </a>
              <a href="#updates" className="text-slate-600 hover:text-orange-600 transition">
                Updates & News
              </a>
              <a href="#vision" className="text-slate-600 hover:text-orange-600 transition">
                दृष्टिकोण (Vision)
              </a>
              <a href="#resources" className="text-slate-600 hover:text-orange-600 transition">
                Student Resources
              </a>
              <a href="#contact" className="text-slate-600 hover:text-orange-600 transition">
                Contact Me
              </a>
            </div>
          </div>

          {/* Col 3: Policies & Disclaimer */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Trust & Transparency
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button
                  onClick={() => setActivePolicyModal('privacy')}
                  className="text-slate-600 hover:text-orange-600 transition text-left"
                >
                  Privacy Policy (गोपनीयता नीति)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicyModal('terms')}
                  className="text-slate-600 hover:text-orange-600 transition text-left"
                >
                  Terms of Public Use (नियम एवं शर्तें)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicyModal('submission')}
                  className="text-slate-600 hover:text-orange-600 transition text-left"
                >
                  Data / Issue Submission Policy
                </button>
              </li>
            </ul>

            <div className="pt-2 text-[11px] text-slate-500 leading-relaxed border-t border-orange-100 font-hindi">
              यह काव्यांश कायस्थ की व्यक्तिगत वेबसाइट है। यह ABVP का आधिकारिक पोर्टल नहीं है।
            </div>
          </div>
        </div>

        {/* Official Disclaimer Banner */}
        <div className="mt-10 p-4 rounded-2xl bg-orange-50/70 border border-orange-200 text-center shadow-xs">
          <p className="text-xs sm:text-sm text-slate-700 font-hindi leading-relaxed">
            <strong className="font-bold text-slate-900">अस्वीकरण (Disclaimer):</strong> यह काव्यांश कायस्थ की व्यक्तिगत वेबसाइट है। यह अखिल भारतीय विद्यार्थी परिषद (ABVP) का आधिकारिक पोर्टल नहीं है।
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-orange-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-slate-500 text-center sm:text-left font-medium font-hindi">
            Copyright © {currentYear} काव्यांश कायस्थ. All rights reserved. • नगर मंत्री, चौमुहां–छाता–कोसी, मथुरा (अखिल भारतीय विद्यार्थी परिषद - ABVP).
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-orange-600 bg-orange-50 hover:bg-orange-100 px-3.5 py-1.5 rounded-xl border border-orange-200 font-bold transition shadow-xs"
            >
              <span>Back to Top</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
