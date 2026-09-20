import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Calendar,
  MapPin,
  X,
  Maximize2,
  Camera,
  PlusCircle,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GalleryItem, GalleryCategory } from '../types';

export const GallerySection: React.FC = () => {
  const { galleryItems, adminToken, setIsAdminOpen } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);

  const categories: GalleryCategory[] = [
    'ABVP Activities',
    'Student Activities',
    'Public Interaction',
    'Social Activities',
    'Events',
    'Personal / Professional',
  ];

  // Only display genuine items. Filter by category if selected.
  const filteredGallery =
    selectedCategory === 'All'
      ? galleryItems
      : galleryItems.filter((item) => item.category === selectedCategory);

  return (
    <section
      id="gallery"
      className="py-20 bg-gradient-to-b from-white via-orange-50/25 to-white border-b border-orange-200/80 relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-950 text-xs font-bold mb-3 border border-orange-300 shadow-xs">
            <ImageIcon className="w-3.5 h-3.5 text-orange-600" />
            <span>छायाचित्र दीर्घा • Visual Archive</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Gallery (गतिविधि छायाचित्र)
          </h2>
          <p className="mt-3 text-base text-slate-600 font-medium">
            Official photographic records of student welfare, campus initiatives, and public service moments in Mathura.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shadow-xs ${
              selectedCategory === 'All'
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/20'
                : 'bg-white text-slate-700 hover:bg-orange-50 border border-orange-200'
            }`}
          >
            All Photos {galleryItems.length > 0 && `(${galleryItems.length})`}
          </button>
          {categories.map((cat) => {
            const count = galleryItems.filter((i) => i.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shadow-xs ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/20'
                    : 'bg-white text-slate-700 hover:bg-orange-50 border border-orange-200'
                }`}
              >
                {cat} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>

        {/* EMPTY GALLERY STATE: Displayed when no genuine photos have been uploaded */}
        {filteredGallery.length === 0 ? (
          <div
            id="empty-gallery-container"
            className="max-w-2xl mx-auto py-16 px-6 sm:px-10 text-center bg-white border border-orange-200/90 rounded-3xl shadow-sm relative overflow-hidden"
          >
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-orange-100 to-amber-50 border border-orange-200 flex items-center justify-center text-orange-600 shadow-xs mb-6">
              <Camera className="w-10 h-10 stroke-[1.75]" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold mb-3 font-hindi">
              <CheckCircle2 className="w-3.5 h-3.5 text-orange-600" />
              <span>अधिकृत छायाचित्र संग्रह</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 font-hindi tracking-tight mb-2">
              गतिविधियों की तस्वीरें जल्द उपलब्ध होंगी
            </h3>

            <p className="text-base sm:text-lg text-slate-700 font-semibold mb-1">
              Activities and public-service moments will be added here.
            </p>

            <p className="text-sm text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
              Real moments and activities will be added here as genuine photographs are verified and uploaded.
            </p>

            {/* Admin shortcut if logged in */}
            {adminToken ? (
              <div className="mt-8 pt-6 border-t border-orange-100 flex flex-col sm:flex-row items-center justify-center gap-3">
                <span className="text-xs font-semibold text-slate-600">Logged in as Administrator:</span>
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Open Admin Gallery to Upload Photos</span>
                </button>
              </div>
            ) : (
              <div className="mt-8 pt-5 border-t border-orange-100/70">
                <span className="text-xs text-slate-400 font-medium font-hindi">
                  काव्यांश कायस्थ • नगर मंत्री, चौमुहां-छाता-कोसी क्षेत्र, मथुरा • अखिल भारतीय विद्यार्थी परिषद (ABVP)
                </span>
              </div>
            )}
          </div>
        ) : (
          /* POPULATED GALLERY GRID (Only Genuine Admin Uploads) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveImage(item)}
                className="group cursor-pointer bg-white rounded-2xl border border-orange-200 overflow-hidden shadow-xs hover:shadow-lg hover:border-orange-400 transition duration-300 flex flex-col justify-between"
              >
                {/* Photo Display */}
                <div className="relative h-60 bg-slate-100 overflow-hidden flex items-center justify-center border-b border-orange-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm border border-orange-300 text-orange-800 px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-xs">
                    {item.category}
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center backdrop-blur-xs">
                    <span className="p-3 bg-white text-orange-600 rounded-full shadow-lg transform group-hover:scale-110 transition duration-200">
                      <Maximize2 className="w-5 h-5" />
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-2 font-medium">
                      {item.date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-orange-600" />
                          <span>{item.date}</span>
                        </span>
                      )}
                      {item.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-orange-600" />
                          <span className="truncate max-w-[150px]">{item.location}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-slate-950 text-base mb-2 leading-snug line-clamp-2">
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mb-3">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-orange-100 flex items-center justify-between text-xs text-orange-600 font-bold">
                    <span className="inline-flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Full Image</span>
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium font-hindi">
                      चौमुहां–छाता–कोसी, मथुरा
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox / Modal for genuine photo viewing */}
        {activeImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full p-6 sm:p-8 text-slate-900 relative shadow-2xl max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setActiveImage(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-block px-3 py-1 rounded-lg bg-orange-100 text-orange-800 text-xs font-bold mb-3 border border-orange-200">
                {activeImage.category}
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-950 mb-2 leading-tight">
                {activeImage.title}
              </h3>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium mb-4">
                {activeImage.date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    <span>{activeImage.date}</span>
                  </span>
                )}
                {activeImage.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-orange-600" />
                    <span>{activeImage.location}</span>
                  </span>
                )}
              </div>

              {/* Full Image */}
              <div className="rounded-xl mb-4 overflow-hidden border border-slate-200 bg-slate-950 flex items-center justify-center max-h-[60vh]">
                <img
                  src={activeImage.imageUrl}
                  alt={activeImage.title}
                  className="w-full h-auto max-h-[60vh] object-contain mx-auto"
                />
              </div>

              {activeImage.description && (
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-6 bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                  {activeImage.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-500 font-medium">
                  Official Public Service Archive • Mathura
                </span>
                <button
                  onClick={() => setActiveImage(null)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition"
                >
                  Close Photo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
