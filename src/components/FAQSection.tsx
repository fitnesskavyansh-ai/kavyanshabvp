import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { INITIAL_FAQS } from '../config/profileData';
import { useApp } from '../context/AppContext';

export const FAQSection: React.FC = () => {
  const { profile } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Substitute profile name dynamic in FAQ
  const faqs = INITIAL_FAQS.map((faq) => ({
    ...faq,
    question: faq.question.replace(/\[NAME\]/g, profile.name).replace(/\[FULL NAME\]/g, profile.name),
    answer: faq.answer
      .replace(/\[NAME\]/g, profile.name)
      .replace(/\[FULL NAME\]/g, profile.name)
      .replace(/\[DATE\]/g, profile.joiningDate)
      .replace(/\[JOINING YEAR\]/g, profile.joiningYear)
      .replace(/\[EMAIL\]/g, profile.email),
  }));

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-20 bg-gradient-to-b from-white via-orange-50/20 to-white border-b border-orange-200/80 overflow-hidden">
      {/* Subtle ABVP Watermark */}
      <div className="absolute top-6 right-6 w-60 h-60 sm:w-80 sm:h-80 opacity-15 sm:opacity-20 pointer-events-none select-none z-0">
        <img src="/abvp-logo.png" alt="ABVP Watermark" className="w-full h-full object-contain rotate-12 filter drop-shadow-[0_0_35px_rgba(249,115,22,0.25)]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-900 text-xs font-bold mb-3 border border-orange-300 shadow-xs">
            <HelpCircle className="w-3.5 h-3.5 text-orange-600" />
            <span>सामान्य प्रश्नोत्तर • Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Frequently Asked Questions (FAQ)
          </h2>
          <p className="mt-3 text-base text-slate-600 font-medium">
            Clear, factual answers regarding public service, student grievance submission, and privacy.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition duration-200 overflow-hidden shadow-xs ${
                  isOpen
                    ? 'border-orange-400 bg-orange-50/50 shadow-md shadow-orange-500/10'
                    : 'border-orange-200 bg-white hover:border-orange-300 hover:bg-orange-50/20'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-slate-950 text-sm sm:text-base">
                    {faq.question}
                  </span>
                  <span
                    className={`p-1.5 rounded-full transition ${
                      isOpen ? 'bg-orange-500 text-white rotate-180 shadow-xs' : 'text-orange-500 bg-orange-100'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm text-slate-700 leading-relaxed border-t border-orange-200/60 font-medium animate-in fade-in duration-150">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
