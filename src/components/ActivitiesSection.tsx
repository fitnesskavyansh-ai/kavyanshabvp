import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Calendar,
  MapPin,
  CheckCircle2,
  ChevronRight,
  X,
  Sparkles,
  Image as ImageIcon,
  Video,
  ExternalLink,
  Search,
} from 'lucide-react';
import { INITIAL_ACTIVITIES } from '../config/profileData';
import { ActivityItem } from '../types';
import { getPublishedActivities } from '../services/activityService';
import { isFirebaseConfigured } from '../lib/firebase';

export const ActivitiesSection: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalItem, setActiveModalItem] = useState<ActivityItem | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    async function loadActivities() {
      if (!isFirebaseConfigured()) {
        setLoading(false);
        return;
      }
      try {
        const publishedData = await getPublishedActivities();
        if (isMounted) {
          if (publishedData.length > 0) {
            setActivities(publishedData);
          } else {
            // Keep default/initial activities if none in Firestore
            setActivities(INITIAL_ACTIVITIES);
          }
        }
      } catch (err) {
        console.warn('[ActivitiesSection] Could not load from Firestore, using default view:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadActivities();
    return () => {
      isMounted = false;
    };
  }, []);

  // Derive unique categories present in the published activities
  const availableCategories = Array.from(
    new Set(activities.map((act) => act.category).filter(Boolean))
  );

  const filteredActivities = activities.filter((act) => {
    const matchesCat = selectedCategory === 'All' || act.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (act.location && act.location.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

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
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight font-hindi">
            कार्य एवं गतिविधियाँ (Activities)
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-medium">
            Ground initiatives focusing on student welfare, campus amenities, career support, and community service in Mathura.
          </p>
        </div>

        {/* Filters and Search Bar if activities exist */}
        {activities.length > 0 && (
          <div className="mb-10 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-xs ${
                  selectedCategory === 'All'
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm shadow-orange-500/20'
                    : 'bg-white text-slate-700 hover:bg-orange-50 border border-orange-200'
                }`}
              >
                सभी गतिविधियाँ (All)
              </button>
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-xs font-hindi ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm shadow-orange-500/20'
                      : 'bg-white text-slate-700 hover:bg-orange-50 border border-orange-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="खोजें (Search activities)..."
                className="w-full bg-white border border-orange-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 font-hindi"
              />
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs font-bold text-slate-500 font-hindi">
              गतिविधियाँ लोड हो रही हैं...
            </p>
          </div>
        ) : filteredActivities.length === 0 ? (
          /* Empty State */
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
              गतिविधियाँ एवं छात्र कल्याण कार्य काव्यांश कायस्थ (नगर मंत्री, चौमुहां-छाता-कोसी क्षेत्र, मथुरा) द्वारा सत्यापन के पश्चात ही प्रकाशित की जाती हैं।
            </p>

            <div className="mt-8 pt-5 border-t border-orange-100/70">
              <span className="text-xs text-slate-400 font-medium font-hindi">
                अखिल भारतीय विद्यार्थी परिषद (ABVP) • चौमुहां-छाता-कोसी क्षेत्र, मथुरा
              </span>
            </div>
          </div>
        ) : (
          /* Populated Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((act) => {
              const primaryPhoto =
                (act.photos && act.photos.length > 0 && act.photos[0]) ||
                act.photoUrl ||
                null;
              const photoCount = act.photos?.length || (act.photoUrl ? 1 : 0);

              return (
                <div
                  key={act.id}
                  className="bg-white rounded-2xl border border-orange-200 overflow-hidden shadow-xs hover:shadow-md hover:border-orange-400 transition duration-300 flex flex-col justify-between group"
                >
                  {/* Photo Banner */}
                  {primaryPhoto ? (
                    <div className="h-52 bg-slate-900 relative overflow-hidden flex items-center justify-center border-b border-orange-100 cursor-pointer"
                      onClick={() => {
                        setActiveModalItem(act);
                        setActivePhotoIdx(0);
                      }}
                    >
                      <img
                        src={primaryPhoto}
                        alt={act.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm border border-orange-300 text-orange-800 px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-xs font-hindi">
                        {act.category}
                      </div>
                      {photoCount > 1 && (
                        <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[11px] font-bold flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          <span>{photoCount} Photos</span>
                        </div>
                      )}
                      {act.video && (
                        <div className="absolute bottom-3 left-3 bg-red-600/90 text-white px-2 py-0.5 rounded-md text-[11px] font-bold flex items-center gap-1">
                          <Video className="w-3 h-3" />
                          <span>Video</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 bg-orange-50/50 border-b border-orange-100 flex items-center justify-between">
                      <span className="bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-md text-[11px] font-bold font-hindi">
                        {act.category}
                      </span>
                      {act.video && (
                        <span className="text-red-600 text-[11px] font-bold flex items-center gap-1">
                          <Video className="w-3 h-3" />
                          <span>Video Available</span>
                        </span>
                      )}
                    </div>
                  )}

                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mb-2 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-orange-600" />
                          <span>{act.date}</span>
                        </span>
                        {act.location && (
                          <span className="flex items-center gap-1 font-hindi">
                            <MapPin className="w-3.5 h-3.5 text-orange-600" />
                            <span className="truncate max-w-[150px]">{act.location}</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-black text-slate-900 mb-2 line-clamp-2 leading-snug font-hindi">
                        {act.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4 font-hindi">
                        {act.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-orange-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-hindi">
                        मथुरा • छात्र कल्याण
                      </span>
                      <button
                        onClick={() => {
                          setActiveModalItem(act);
                          setActivePhotoIdx(0);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 transition font-hindi"
                      >
                        <span>विवरण देखें (Details)</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Public Activity Detail Modal */}
        {activeModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-5 sm:p-7 relative my-auto">
              <button
                onClick={() => setActiveModalItem(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold mb-3 font-hindi">
                {activeModalItem.category}
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-950 mb-3 font-hindi">
                {activeModalItem.title}
              </h3>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 mb-5 pb-3 border-b border-slate-100 font-hindi">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  <span>{activeModalItem.date}</span>
                </span>
                {activeModalItem.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-orange-600" />
                    <span>{activeModalItem.location}</span>
                  </span>
                )}
              </div>

              {/* Photos Gallery View */}
              {activeModalItem.photos && activeModalItem.photos.length > 0 && (
                <div className="mb-5">
                  <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 max-h-80 sm:max-h-96 flex items-center justify-center">
                    <img
                      src={activeModalItem.photos[activePhotoIdx] || activeModalItem.photos[0]}
                      alt={activeModalItem.title}
                      className="w-full h-full object-contain max-h-80 sm:max-h-96"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {activeModalItem.photos.length > 1 && (
                    <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-1">
                      {activeModalItem.photos.map((photoUrl, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActivePhotoIdx(idx)}
                          className={`w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition ${
                            activePhotoIdx === idx
                              ? 'border-orange-500 scale-105 shadow'
                              : 'border-slate-200 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={photoUrl}
                            alt={`Photo ${idx + 1}`}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Video Player or Link */}
              {activeModalItem.video && (
                <div className="mb-5 p-4 bg-orange-50/70 border border-orange-200 rounded-2xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-orange-950 mb-2">
                    <Video className="w-4 h-4 text-orange-600" />
                    <span>संलग्न वीडियो (Attached Video)</span>
                  </div>
                  {activeModalItem.video.includes('youtube.com') || activeModalItem.video.includes('youtu.be') ? (
                    <div className="aspect-video rounded-xl overflow-hidden border border-orange-200">
                      <iframe
                        src={
                          activeModalItem.video.includes('watch?v=')
                            ? activeModalItem.video.replace('watch?v=', 'embed/')
                            : activeModalItem.video
                        }
                        title="Activity Video"
                        className="w-full h-full"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : activeModalItem.video.endsWith('.mp4') || activeModalItem.video.includes('firebasestorage') ? (
                    <video
                      src={activeModalItem.video}
                      controls
                      className="w-full rounded-xl max-h-72 bg-black"
                    ></video>
                  ) : (
                    <a
                      href={activeModalItem.video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 underline break-all"
                    >
                      <span>वीडियो लिंक खोलें</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}

              {/* Description */}
              <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed font-hindi whitespace-pre-line">
                <p>{activeModalItem.description}</p>

                {activeModalItem.keyOutcomes && activeModalItem.keyOutcomes.length > 0 && (
                  <div className="mt-4 p-4 rounded-xl bg-orange-50 border border-orange-200/80">
                    <h4 className="text-sm font-bold text-orange-950 mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-orange-600" />
                      <span>मुख्य उपलब्धियाँ एवं निष्कर्ष</span>
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

              <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl"
                >
                  बंद करें (Close)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
