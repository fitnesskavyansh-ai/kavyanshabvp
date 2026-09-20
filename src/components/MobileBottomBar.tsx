import React from 'react';
import { Phone, AlertCircle, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MobileBottomBar: React.FC = () => {
  const { profile } = useApp();
  const rawPhone = (profile.phone || '6395014760').replace(/[^0-9]/g, '');

  return (
    <div
      id="mobile-sticky-action-bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-orange-200 p-2.5 px-3 flex items-center gap-2 shadow-xl"
    >
      <a
        id="mobile-bottom-call-button"
        href={`tel:${profile.phone ? profile.phone.replace(/\s+/g, '') : '6395014760'}`}
        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-orange-50 active:bg-orange-100 text-slate-800 text-xs font-bold py-2.5 rounded-xl border border-orange-200 transition shadow-xs"
        title="Direct Call - Kavyansh Kayastha"
      >
        <Phone className="w-3.5 h-3.5 text-emerald-600" />
        <span>Call Kavyansh: 6395014760</span>
      </a>

      <a
        id="mobile-bottom-wa-button"
        href={`https://wa.me/${rawPhone}?text=${encodeURIComponent(
          'Namaste Kavyansh ji, main ABVP Mathura helpline ke madhyam se sampark kar raha/rahi hoon.'
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center p-2.5 bg-emerald-50 active:bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-200 shadow-xs transition"
        title="WhatsApp Message"
      >
        <MessageCircle className="w-4 h-4" />
      </a>

      <a
        id="mobile-bottom-raise-issue-button"
        href="#raise-issue"
        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 to-orange-600 active:from-orange-600 active:to-orange-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-md shadow-orange-500/20 transition"
      >
        <AlertCircle className="w-3.5 h-3.5" />
        <span>Raise Issue</span>
      </a>
    </div>
  );
};
