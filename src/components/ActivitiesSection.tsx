import React, { useState } from 'react';
import {
  Briefcase,
  Calendar,
  MapPin,
  CheckCircle2,
  ChevronRight,
  X,
  Sparkles,
} from 'lucide-react';
import { INITIAL_ACTIVITIES } from '../config/profileData';
import { ActivityItem } from '../types';

export const ActivitiesSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalItem, setActiveModalItem] = useState<ActivityItem | null>(null);

  // Derive unique categories present in the provided activities
  const availableCategories = Array.from(
    new Set(INITIAL_ACTIVITIES.map((act) => act.category))
  );

  const filteredActivities =
    selectedCategory === 'All'
      ? INITIAL_ACTIVITIES
      : INITIAL_ACTIVITIES.filter((act) => act.category === selectedCategory);

  return (
    <section
      id="activities"
      className="py-20 bg-gradient-to-b from-orange-50/40 via-white to-orange-50/30 border-b border-orange-200/80 relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-950 text-xs font-bold mb-3 border border-orange-300 shadow-xs">
            <Briefcase className="w-3.5 h-3.5 text-orange-600" />
            <span>पहल एवं सेवा कार्य • Initiatives & Social Engagement</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            कार्य एवं गतिविधियाँ (Activities)
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-medium">
            Ground initiatives focusing on student welfare, campus amenities, career support, and community service in Mathura.
          </p>
        </div>

        {/* Category Filters (only shown if there are multiple categories) */}
        {availableCategories.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shadow-xs ${
                selectedCategory === 'All'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/20'
                  : 'bg-white text-slate-700 hover:bg-orange-50 border border-orange-200'
              }`}
            >
              सभी गतिविधियाँ (All)
            </button>
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shadow-xs ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/20'
                    : 'bg-white text-slate-700 hover:bg-orange-50 border border-orange-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Clean Empty State or Populated Activities */}
        {filteredActivities.length === 0 ? (
          <div className="max-w-2xl mx-auto py-16 px-6 sm:px-10 text-center bg-white border border-orange-200/90 rounded-3xl shadow-sm relative overflow-hidden">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 shadow-xs mb-5">
              <Briefcase className="w-8 h-8 stroke-[1.75]" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 font-hindi tracking-tight mb-2">
              गतिविधियाँ एवं सेवा कार्य जल्द प्रकाशित होंगे
            </h3>

            <p className="text-base sm:text-lg text-slate-700 font-semibold mb-2">
              Official activities and verified initiatives will be listed here.
            </p>

            <p className="text-sm text-slate-500 font-medium max-w-md mx-auto leading-relaxed font-hindi">
              गतिविधियाँ एवं छात्र कल्याण कार्य काव्यांश कायस्थ (नगर मंत्री, चौमुहां–छाता–कोसी, मथुरा) द्वारा सत्यापन के पश्चात ही प्रकाशित की जाती हैं।
            </p>

            <div className="mt-8 pt-5 border-t border-orange-100/70">
              <span className="text-xs text-slate-400 font-medium font-hindi">
                अखिल भारतीय विद्यार्थी परिषद (ABVP) • चौमुहां–छाता–कोसी, मथुरा
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((act) => (
              <div
                key={act.id}
                className="bg-white rounded-2xl border border-orange-200 overflow-hidden shadow-xs hover:shadow-md hover:border-orange-400 transition duration-300 flex flex-col justify-between"
              >
                {act.photoUrl && (
                  <div className="h-48 bg-orange-50/80 relative overflow-hidden flex items-center justify-center border-b border-orange-100">
                    <img
                      src={act.photoUrl}
                      alt={act.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm border border-orange-300 text-orange-700 px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-xs">
                      {act.category}
                    </div>
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-2 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-orange-600" />
                        <span>{act.date}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-orange-600" />
                        <span className="truncate max-w-[150px]">{act.location}</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2.5 line-clamp-2 leading-snug">
                      {act.title}
                    </h3>

                    <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
                      {act.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-orange-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">
                      Mathura Region
                    </span>
                    <button
                      onClick={() => setActiveModalItem(act)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Details */}
        {activeModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 relative">
              <button
                onClick={() => setActiveModalItem(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-block px-3 py-1 rounded-md bg-orange-100 text-orange-800 text-xs font-bold mb-3">
                {activeModalItem.category}
              </div>

              <h3 className="text-2xl font-extrabold text-slate-900 mb-3">
                {activeModalItem.title}
              </h3>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 mb-6 pb-4 border-b border-slate-100">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  <span>{activeModalItem.date}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  <span>{activeModalItem.location}</span>
                </span>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
                <p>{activeModalItem.description}</p>

                {activeModalItem.keyOutcomes && activeModalItem.keyOutcomes.length > 0 && (
                  <div className="mt-4 p-4 rounded-xl bg-orange-50 border border-orange-200/80">
                    <h4 className="text-sm font-bold text-orange-950 mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-orange-600" />
                      <span>Key Highlights & Outcomes</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-orange-900">
                      {activeModalItem.keyOutcomes.map((point, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
