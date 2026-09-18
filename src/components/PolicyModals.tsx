import React from 'react';
import { X, ShieldCheck, FileText, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PolicyModals: React.FC = () => {
  const { activePolicyModal, setActivePolicyModal } = useApp();

  if (!activePolicyModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 text-slate-800 shadow-2xl relative border border-orange-200">
        <button
          onClick={() => setActivePolicyModal(null)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-orange-50 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {activePolicyModal === 'privacy' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-orange-100 pb-3">
              <div className="w-11 h-11 rounded-2xl bg-orange-100 border border-orange-300 text-orange-600 flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-950">Privacy Policy (गोपनीयता नीति)</h3>
                <p className="text-xs text-slate-500 font-medium">Last updated: Academic Year 2025–2026</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-600 leading-relaxed font-medium">
              <p>
                This personal portfolio website belongs to Nagar Mantri, Mathura (ABVP). We respect
                your fundamental right to privacy and are committed to maintaining the confidentiality of any information you share.
              </p>

              <h4 className="font-bold text-slate-950 text-sm">1. Information We Collect</h4>
              <p>
                When you submit a grievance via "Raise an Issue" or send a contact message, we collect: your name, mobile number, optional email address, locality/college, and the description of the problem.
              </p>

              <h4 className="font-bold text-slate-950 text-sm">2. Purpose of Collection</h4>
              <p>
                Your information is collected solely to assist you in resolving campus, educational, scholarship, hostel, or civic concerns by representing them before the appropriate authorities or college administrations.
              </p>

              <h4 className="font-bold text-slate-950 text-sm">3. No Public Exposure</h4>
              <p>
                Submitted phone numbers, personal identifiers, and attached documents are <strong>never</strong> published publicly on this website. Access is strictly restricted to the authorized student worker administration.
              </p>

              <h4 className="font-bold text-slate-950 text-sm">4. Right to Deletion</h4>
              <p>
                You may request immediate deletion of any submitted grievance record or contact message at any time by sending an email or contacting the grievance desk.
              </p>
            </div>
          </div>
        )}

        {activePolicyModal === 'terms' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-orange-100 pb-3">
              <div className="w-11 h-11 rounded-2xl bg-orange-100 border border-orange-300 text-orange-600 flex items-center justify-center shadow-xs">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-950">Terms of Public Use (उपयोग की शर्तें)</h3>
                <p className="text-xs text-slate-500 font-medium">Public Service Platform</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-600 leading-relaxed font-medium">
              <h4 className="font-bold text-slate-950 text-sm">1. Nature of the Website</h4>
              <p>
                This is a personal public service portfolio of an ABVP student organisation worker (Nagar Mantri, Mathura). It is designed to facilitate constructive student dialogue and communication. It is not an official portal of any university or government body.
              </p>

              <h4 className="font-bold text-slate-950 text-sm">2. Honest and Truthful Submissions</h4>
              <p>
                Users are requested to submit accurate, authentic information. Submitting false, defamatory, or abusive complaints is strictly discouraged.
              </p>

              <h4 className="font-bold text-slate-950 text-sm">3. Voluntary Representation</h4>
              <p>
                Representation of issues before administrative and institutional nodal officers is conducted voluntarily in good faith. No guarantee or financial fee is ever involved or promised.
              </p>
            </div>
          </div>
        )}

        {activePolicyModal === 'submission' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-orange-100 pb-3">
              <div className="w-11 h-11 rounded-2xl bg-orange-100 border border-orange-300 text-orange-600 flex items-center justify-center shadow-xs">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-950">Data & Issue Submission Policy</h3>
                <p className="text-xs text-slate-500 font-medium">Grievance Handling Protocol</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-600 leading-relaxed font-medium">
              <p>
                Every grievance submitted through "Raise an Issue (अपनी समस्या बताएं)" is assigned a unique reference ticket (e.g. <code>ABVP-2026-XXXX</code>) and stored in our secure database.
              </p>

              <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
                <li>
                  <strong>Direct Review:</strong> Reviewed directly by the Nagar Mantri and student leadership desk.
                </li>
                <li>
                  <strong>Authority Communication:</strong> When drafting a memorandum (gyapan) or approaching university officials, your case details are presented responsibly.
                </li>
                <li>
                  <strong>Status Updates:</strong> Issue status progresses transparently from <em>New → Under Review → In Progress → Resolved</em>.
                </li>
                <li>
                  <strong>Retention:</strong> Completed issues can be purged upon request.
                </li>
              </ul>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-orange-100 text-right">
          <button
            onClick={() => setActivePolicyModal(null)}
            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
