import React, { useEffect, useState } from 'react';
import { CheckCircle2, Home, PlusCircle, ShieldCheck, ArrowLeft, Phone, Mail } from 'lucide-react';

interface LastIssueInfo {
  ticketNumber?: string;
  fullName?: string;
  category?: string;
  title?: string;
  date?: string;
}

export const IssueSubmittedPage: React.FC = () => {
  const [issueInfo, setIssueInfo] = useState<LastIssueInfo | null>(null);

  useEffect(() => {
    // Scroll to top upon landing
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Load ticket if stored in sessionStorage or query param
    try {
      const stored = sessionStorage.getItem('abvp_last_submitted_issue');
      if (stored) {
        setIssueInfo(JSON.parse(stored));
      }
    } catch {
      // Ignore parse error
    }
  }, []);

  const goToHome = () => {
    window.location.href = '/';
  };

  const submitAnother = () => {
    window.location.href = '/#raise-issue';
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      {/* Top Header Bar */}
      <header className="relative z-10 border-b border-orange-200/80 bg-white/90 backdrop-blur-md shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-3 group"
          >
            <img
              src="/abvp-logo.png"
              alt="ABVP Emblem"
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain group-hover:scale-105 transition-transform"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-black tracking-wide text-orange-600 uppercase">
                  अखिल भारतीय विद्यार्थी परिषद
                </span>
                <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  मथुरा महानगर
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                छात्र अधिकार एवं जनसमस्या निवारण प्रकोष्ठ
              </p>
            </div>
          </a>

          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-orange-600 transition px-3 py-1.5 rounded-lg hover:bg-orange-50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>वापस मुख्य पृष्ठ</span>
          </a>
        </div>
      </header>

      {/* Main Content Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 p-6 sm:p-10 text-center animate-in fade-in zoom-in-95 duration-300">
          
          {/* Big Green Success Checkmark Badge */}
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-50 border-4 border-emerald-100 text-emerald-600 mb-6 shadow-sm">
            <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14 stroke-[2.25]" />
          </div>

          {/* Primary Required Headings */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-snug">
            आपकी समस्या सफलतापूर्वक प्राप्त हो गई है
          </h1>

          <p className="text-base sm:text-lg text-slate-600 mt-4 leading-relaxed max-w-xl mx-auto font-normal">
            धन्यवाद। आपकी दी गई जानकारी प्राप्त हो गई है। आवश्यक होने पर आपसे संपर्क किया जाएगा।
          </p>

          {/* Reference ID Ticket Details (if submitted in this session) */}
          {issueInfo?.ticketNumber && (
            <div className="my-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-left max-w-md mx-auto">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                  कार्यालय संदर्भ संख्या (Ticket ID)
                </span>
                <span className="text-[11px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                  पंजीकृत (Registered)
                </span>
              </div>
              <div className="font-mono text-lg sm:text-xl font-black text-orange-700 tracking-wide">
                {issueInfo.ticketNumber}
              </div>
              {issueInfo.title && (
                <div className="text-xs text-slate-700 mt-1 truncate">
                  <strong>विषय:</strong> {issueInfo.title}
                </div>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="w-full h-px bg-slate-100 my-8" />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
            {/* [होम पेज पर जाएं] */}
            <button
              id="btn-go-home"
              type="button"
              onClick={goToHome}
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold text-sm sm:text-base shadow-md shadow-orange-600/20 hover:shadow-lg transition-all"
            >
              <Home className="w-4 h-4" />
              <span>होम पेज पर जाएं</span>
            </button>

            {/* [एक और समस्या बताएं] */}
            <button
              id="btn-submit-another"
              type="button"
              onClick={submitAnother}
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold text-sm sm:text-base border border-slate-200 transition-all"
            >
              <PlusCircle className="w-4 h-4 text-orange-600" />
              <span>एक और समस्या बताएं</span>
            </button>
          </div>

          {/* Privacy Note */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>आपकी व्यक्तिगत जानकारी सार्वजनिक रूप से प्रदर्शित नहीं की जाएगी।</span>
          </div>

          {/* Contact Helpline info */}
          <div className="mt-4 text-[11px] text-slate-400">
            काव्यंश कायस्थ (नगर मंत्री, चौमुहां-छाता-कोसी क्षेत्र, मथुरा) • हेल्पलाइन: +91 63950 14760
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-xs text-slate-400 border-t border-orange-100/60 bg-white/60">
        © 2026 अखिल भारतीय विद्यार्थी परिषद (ABVP) मथुरा महानगर इकाई. सर्वाधिकार सुरक्षित.
      </footer>
    </div>
  );
};
