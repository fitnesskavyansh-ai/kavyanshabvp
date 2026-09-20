import React from 'react';
import {
  Compass,
  BookOpen,
  Users,
  Briefcase,
  Award,
  ArrowRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { JourneyMilestone } from '../types';

export const JourneySection: React.FC = () => {
  const { journeyEntries } = useApp();

  // Only display published items on public website
  const publishedEntries = journeyEntries.filter((item) => item.isPublished !== false);

  // Icon selector based on category / title / status
  const getEntryIcon = (item: JourneyMilestone, isCurrent: boolean) => {
    if (isCurrent) {
      return <Award className="w-5 h-5 text-white" />;
    }
    const cat = (item.category || '').toLowerCase();
    const title = (item.title || '').toLowerCase();
    const english = (item.englishLabel || '').toLowerCase();

    if (cat.includes('abvp') || english.includes('begins')) {
      return <Compass className="w-4 h-4 text-orange-400" />;
    }
    if (english.includes('understanding') || title.includes('समझने') || cat.includes('learning')) {
      return <BookOpen className="w-4 h-4 text-amber-300" />;
    }
    if (english.includes('participation') || title.includes('सहभागिता') || cat.includes('participation')) {
      return <Users className="w-4 h-4 text-blue-300" />;
    }
    if (english.includes('responsibility') || title.includes('जिम्मेदारी') || title.includes('दायित्व')) {
      return <Briefcase className="w-4 h-4 text-amber-400" />;
    }
    return <Briefcase className="w-4 h-4 text-orange-300" />;
  };

  return (
    <section id="journey" className="relative py-16 sm:py-24 bg-gradient-to-b from-[#faf8f5] via-white to-[#faf8f5] border-b border-orange-200/80 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-900 text-xs font-bold mb-3 border border-orange-300 shadow-xs">
            <span className="font-hindi font-bold">मेरी यात्रा • My Journey</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            मेरी यात्रा <span className="text-slate-400 font-light block sm:inline sm:ml-2 text-2xl sm:text-4xl">/ My Journey</span>
          </h2>

          <p className="mt-3 text-base sm:text-lg text-slate-600 font-hindi font-medium max-w-2xl mx-auto leading-relaxed">
            &ldquo;ABVP के साथ मेरी संगठनात्मक यात्रा और वर्तमान दायित्व&rdquo;
          </p>
        </div>

        {/* Vertical Timeline Container */}
        <div className="relative">
          {/* Continuous vertical line running through the markers */}
          <div className="absolute left-4 sm:left-44 top-4 bottom-6 w-0.5 bg-gradient-to-b from-orange-400 via-orange-200 to-orange-400" />

          <div className="space-y-10 sm:space-y-14">
            {publishedEntries.map((item, index) => {
              const isCurrent =
                item.isCurrentResponsibility ||
                item.status === 'CURRENT' ||
                item.category === 'Current Responsibility' ||
                item.title.includes('नगर मंत्री');

              return (
                <div
                  key={item.id || `journey-${index}`}
                  className="relative flex flex-col sm:flex-row items-start group"
                >
                  {/* DESKTOP LEFT COLUMN: DATE LABEL (Right-aligned against timeline spine) */}
                  <div className="hidden sm:flex sm:w-40 sm:pr-8 flex-col items-end pt-1 flex-shrink-0 text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-lg text-xs font-bold tracking-wide transition ${
                        isCurrent
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/20'
                          : 'bg-white border border-orange-200 text-slate-800 shadow-xs group-hover:border-orange-400'
                      }`}
                    >
                      {item.yearOrDate}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mt-1.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Key Milestone</span>
                      </span>
                    )}
                  </div>

                  {/* TIMELINE MARKER NODE */}
                  <div className="absolute left-4 sm:left-44 -translate-x-1/2 top-1.5 z-10">
                    <div
                      className={`rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
                        isCurrent
                          ? 'w-11 h-11 bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-600 ring-4 ring-orange-200 text-white animate-pulse'
                          : 'w-8 h-8 bg-white border-2 border-orange-500 text-orange-600 group-hover:bg-orange-600 group-hover:text-white group-hover:scale-110 shadow-xs'
                      }`}
                    >
                      {getEntryIcon(item, isCurrent)}
                    </div>
                  </div>

                  {/* JOURNEY CARD (Right side of timeline) */}
                  <div className="w-full pl-10 sm:pl-10">
                    {/* MOBILE ONLY: DATE HEADER ABOVE CARD */}
                    <div className="sm:hidden flex items-center gap-2 mb-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold ${
                          isCurrent
                            ? 'bg-orange-600 text-white border border-orange-700'
                            : 'bg-orange-100 text-orange-900 border border-orange-200'
                        }`}
                      >
                        <Calendar className="w-3 h-3" />
                        <span>{item.yearOrDate}</span>
                      </span>

                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-orange-600 text-white">
                          CURRENT
                        </span>
                      )}
                    </div>

                    {/* MAIN CARD BODY */}
                    <div
                      className={`relative rounded-2xl transition-all duration-200 overflow-hidden ${
                        isCurrent
                          ? 'bg-white border-2 border-orange-500 shadow-lg shadow-orange-500/10 p-6 sm:p-7'
                          : 'bg-white border border-orange-200 hover:border-orange-300 shadow-xs hover:shadow-md p-5 sm:p-6'
                      }`}
                    >
                      {/* Top saffron accent bar */}
                      {isCurrent && (
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600" />
                      )}

                      {/* Header Row: Hindi Title, English Label, and Status Badges */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                        <div>
                          {/* Hindi Primary Title */}
                          <h3
                            className={`font-hindi font-black tracking-tight ${
                              isCurrent
                                ? 'text-2xl sm:text-3xl text-slate-950 flex items-center gap-2.5 flex-wrap'
                                : 'text-xl sm:text-2xl text-slate-900'
                            }`}
                          >
                            <span>{item.title}</span>
                            {isCurrent && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-900 border border-orange-300 font-sans">
                                <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
                                <span>Mathura</span>
                              </span>
                            )}
                          </h3>

                          {/* English Sub-Label */}
                          {item.englishLabel && (
                            <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider mt-0.5 flex items-center gap-1.5">
                              <span>{item.englishLabel}</span>
                            </p>
                          )}
                        </div>

                        {/* Badges / Pill Tags */}
                        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap sm:justify-end">
                          {isCurrent ? (
                            <>
                              {/* 1. "वर्तमान दायित्व" badge */}
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-orange-600 text-white shadow-xs font-hindi">
                                <Sparkles className="w-3 h-3" />
                                <span>वर्तमान दायित्व</span>
                              </span>

                              {/* 2. "CURRENT" badge */}
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-orange-100 text-orange-900 border border-orange-300 shadow-2xs tracking-wider">
                                CURRENT
                              </span>

                              {/* 3. "Since 9 September 2026" label */}
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 text-orange-800 border border-orange-200">
                                Since 9 September 2026
                              </span>
                            </>
                          ) : (
                            item.status && (
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-50 text-orange-800 border border-orange-200">
                                {item.status}
                              </span>
                            )
                          )}
                        </div>
                      </div>

                      {/* Description Paragraph (Hindi) */}
                      <p
                        className={`leading-relaxed font-hindi ${
                          isCurrent
                            ? 'text-slate-800 text-base sm:text-lg font-medium bg-orange-50/70 p-4 rounded-xl border border-orange-200 mt-3'
                            : 'text-slate-700 text-sm sm:text-base mt-2 font-medium'
                        }`}
                      >
                        {item.description}
                      </p>

                      {/* Optional Location / Category Meta Tag */}
                      <div className="mt-4 pt-3 border-t border-orange-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-orange-500"></span>
                          <span>Category: <strong className="text-slate-800">{item.category}</strong></span>
                        </div>

                        {item.location && (
                          <div className="flex items-center gap-1 text-slate-600 font-semibold">
                            <MapPin className="w-3.5 h-3.5 text-orange-600" />
                            <span>{item.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Optional Photo Attachment */}
                      {item.photoUrl && (
                        <div className="mt-4 rounded-xl overflow-hidden border border-orange-200 max-h-64 shadow-xs">
                          <img
                            src={item.photoUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Contextual Note */}
        <div className="mt-16 text-center max-w-xl mx-auto">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white border border-orange-200 text-xs text-slate-600 shadow-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-hindi text-slate-700">
              अखिल भारतीय विद्यार्थी परिषद (ABVP) • नगर इकाई, मथुरा
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
