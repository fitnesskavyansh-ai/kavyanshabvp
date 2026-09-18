import React from 'react';
import {
  BookOpen,
  ExternalLink,
  ShieldCheck,
  Download,
  GraduationCap,
  HelpCircle,
  FileCheck,
  Building,
} from 'lucide-react';
import { INITIAL_RESOURCES } from '../config/profileData';

export const ResourcesSection: React.FC = () => {
  return (
    <section id="resources" className="relative py-20 bg-gradient-to-b from-[#faf8f5] via-white to-[#faf8f5] border-b border-orange-200/80 overflow-hidden">
      {/* Subtle ABVP Watermark */}
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8 w-60 h-60 sm:w-80 sm:h-80 opacity-15 sm:opacity-20 pointer-events-none select-none z-0">
        <img src="/abvp-logo.png" alt="ABVP Watermark" className="w-full h-full object-contain rotate-[-12deg] filter drop-shadow-[0_0_35px_rgba(249,115,22,0.25)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-900 text-xs font-bold mb-3 border border-orange-300 shadow-xs">
            <BookOpen className="w-3.5 h-3.5 text-orange-600" />
            <span>छात्रोपयोगी संसाधन • Student Resources & Links</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Documents & Important Links (महत्वपूर्ण लिंक)
          </h2>
          <p className="mt-3 text-base text-slate-600 font-medium">
            Verified official government portals, scholarship desks, examination grievance cells, and student helplines.
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INITIAL_RESOURCES.map((res) => (
            <div
              key={res.id}
              className="bg-white rounded-2xl border border-orange-200 p-6 flex flex-col justify-between hover:border-orange-400 hover:shadow-md transition duration-200 shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold text-orange-800 bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-300">
                    {res.category}
                  </span>
                  {res.tag && (
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">
                      {res.tag}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-950 text-base mb-2 leading-snug">
                  {res.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-medium">
                  {res.description}
                </p>
              </div>

              <div className="pt-4 border-t border-orange-100">
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-orange-50 hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 hover:text-white text-slate-800 text-xs font-bold py-2.5 px-4 rounded-xl border border-orange-200 transition duration-150 shadow-xs"
                >
                  <span>{res.buttonText}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Safe Browsing Notice */}
        <div className="mt-10 p-4 rounded-xl bg-white border border-orange-200 text-center text-xs text-slate-600 max-w-xl mx-auto flex items-center justify-center gap-2 shadow-xs font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>All external links open safely in a new tab (<code className="text-orange-700 font-bold">rel="noopener noreferrer"</code>) to official government / university portals.</span>
        </div>
      </div>
    </section>
  );
};
