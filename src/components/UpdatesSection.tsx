import React, { useState } from 'react';
import {
  Bell,
  Search,
  Calendar,
  Tag,
  ArrowRight,
  ExternalLink,
  X,
  FileText,
} from 'lucide-react';
import { INITIAL_UPDATES } from '../config/profileData';
import { UpdatePost, UpdateCategory } from '../types';

export const UpdatesSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePost, setActivePost] = useState<UpdatePost | null>(null);

  const categories: UpdateCategory[] = [
    'Activity Update',
    'Event Announcement',
    'Student Information',
    'Public Notice',
    'Important Update',
  ];

  const filteredPosts = INITIAL_UPDATES.filter((post) => {
    const matchesCat = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section id="updates" className="relative py-20 bg-gradient-to-b from-white via-orange-50/20 to-white border-b border-orange-200/80 overflow-hidden">
      {/* Subtle ABVP Watermark */}
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8 w-60 h-60 sm:w-80 sm:h-80 opacity-15 sm:opacity-20 pointer-events-none select-none z-0">
        <img src="/abvp-logo.png" alt="ABVP Watermark" className="w-full h-full object-contain rotate-12 filter drop-shadow-[0_0_35px_rgba(249,115,22,0.25)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-900 text-xs font-bold mb-3 border border-orange-300 shadow-xs">
            <Bell className="w-3.5 h-3.5 text-orange-600" />
            <span>नवीनतम सूचनाएं एवं समाचार • Notices & Announcements</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Updates & News (समाचार एवं अपडेट्स)
          </h2>
          <p className="mt-3 text-base text-slate-600 font-medium">
            Timely student notices, examination guidance, upcoming social camps, and youth information in Mathura.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="max-w-4xl mx-auto mb-10 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-orange-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search notices, exams, scholarships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-orange-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition shadow-xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto justify-center sm:justify-start">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                selectedCategory === 'All'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/20'
                  : 'bg-white border border-orange-200 text-slate-700 hover:bg-orange-50'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/20'
                    : 'bg-white border border-orange-200 text-slate-700 hover:bg-orange-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Updates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.length === 0 ? (
            <div className="col-span-3 text-center py-12 text-slate-400 text-sm font-medium">
              No updates match your search. Try adjusting the filter.
            </div>
          ) : (
            filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl border border-orange-200 p-6 flex flex-col justify-between hover:shadow-md hover:border-orange-300 transition duration-200 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-900 text-[11px] font-bold border border-orange-300">
                      {post.category}
                    </span>
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-orange-500" />
                      <span>{post.date}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-950 mb-2 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4 font-medium">
                    {post.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-orange-100 flex items-center justify-between">
                  <button
                    onClick={() => setActivePost(post)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700"
                  >
                    <span>Read Full Update</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] text-slate-400 font-medium">Public Release</span>
                </div>
              </article>
            ))
          )}
        </div>

        {/* Read More Modal */}
        {activePost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl border border-orange-200">
              <button
                onClick={() => setActivePost(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-orange-50 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-bold mb-3 border border-orange-300">
                {activePost.category}
              </div>

              <h3 className="text-2xl font-black text-slate-950 mb-2">
                {activePost.title}
              </h3>

              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-6 pb-3 border-b border-orange-100">
                <Calendar className="w-3.5 h-3.5 text-orange-600" />
                <span>Published: {activePost.date}</span>
                <span>•</span>
                <span>Mathura Nagar</span>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
                <p className="font-bold text-slate-900 bg-orange-50 p-3.5 rounded-xl border-l-4 border-orange-500">
                  {activePost.summary}
                </p>
                <p>{activePost.description}</p>
              </div>

              <div className="mt-8 pt-4 border-t border-orange-100 flex justify-end">
                <button
                  onClick={() => setActivePost(null)}
                  className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20"
                >
                  Close Notice
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
