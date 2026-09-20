import React, { useState } from 'react';
import {
  AlertCircle,
  Upload,
  CheckCircle2,
  Lock,
  FileText,
  Copy,
  Check,
  Shield,
  HelpCircle,
  Phone,
  Mail,
  X,
  MessageCircle,
  ExternalLink,
  Send,
  Printer,
} from 'lucide-react';
import { IssueCategory, IssueAttachment } from '../types';
import { useApp } from '../context/AppContext';

const ISSUE_CATEGORIES: IssueCategory[] = [
  'Student Issue',
  'College/University Issue',
  'Education',
  'Scholarship',
  'Hostel',
  'Examination',
  'Documentation',
  'Youth Issue',
  'Local Civic Issue',
  'Public Service',
  'Other',
];

export const RaiseIssueSection: React.FC = () => {
  const { showToast, setActivePolicyModal } = useApp();

  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    district: 'Mathura',
    city: 'Mathura',
    areaLocality: '',
    category: 'Student Issue' as IssueCategory,
    title: '',
    description: '',
    preferredContact: 'Phone' as 'Phone' | 'WhatsApp' | 'Email' | 'Any',
    consent: false,
  });

  const [attachment, setAttachment] = useState<IssueAttachment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    ticketNumber: string;
    referenceId?: string;
    heading?: string;
    message: string;
    mailtoUrl?: string;
    gmailWebUrl?: string;
    whatsappUrl?: string;
    complaintMemoText?: string;
    formattedDate?: string;
    emailRecipients?: string[];
    submittedIssue?: {
      fullName: string;
      mobile: string;
      email: string;
      category: string;
      title: string;
      description: string;
      areaLocality: string;
    };
  } | null>(null);
  const [copiedTicket, setCopiedTicket] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('File size must be under 10MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setAttachment({
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl,
      });
      showToast('Document attached successfully', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.mobile.trim() || !formData.title.trim() || !formData.description.trim()) {
      showToast('Please fill all required fields (Name, Mobile, Title, Description)', 'error');
      return;
    }

    if (!formData.consent) {
      showToast('Please agree to the privacy consent checkbox', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const snapshot = {
        fullName: formData.fullName,
        mobile: formData.mobile,
        email: formData.email,
        category: formData.category,
        title: formData.title,
        description: formData.description,
        areaLocality: formData.areaLocality,
      };

      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          attachment,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit issue');
      }

      const infoToStore = {
        ticketNumber: data.ticketNumber,
        fullName: formData.fullName,
        category: formData.category,
        title: formData.title,
        date: data.formattedDate || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      };
      try {
        sessionStorage.setItem('abvp_last_submitted_issue', JSON.stringify(infoToStore));
      } catch {
        // Ignore storage error
      }

      setSubmissionResult({
        ticketNumber: data.ticketNumber,
        referenceId: data.referenceId || data.ticketNumber,
        heading: data.heading || 'आपकी समस्या सफलतापूर्वक प्राप्त हो गई है।',
        message: data.message || 'आपकी दी गई जानकारी सुरक्षित रूप से दर्ज कर ली गई है। आवश्यक होने पर आपसे संपर्क किया जाएगा।',
        mailtoUrl: data.mailtoUrl,
        gmailWebUrl: data.gmailWebUrl,
        whatsappUrl: data.whatsappUrl,
        complaintMemoText: data.complaintMemoText,
        formattedDate: data.formattedDate || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }),
        emailRecipients: data.emailRecipients || ['kavyanshkayasthaabvp@gmail.com'],
        submittedIssue: snapshot,
      });
      showToast('आपकी समस्या सफलतापूर्वक प्राप्त हो गई है।', 'success');

      // Reset form
      setFormData({
        fullName: '',
        mobile: '',
        email: '',
        district: 'Mathura',
        city: 'Mathura',
        areaLocality: '',
        category: 'Student Issue',
        title: '',
        description: '',
        preferredContact: 'Phone',
        consent: false,
      });
      setAttachment(null);

      // Redirect visitor to custom success page /issue-submitted
      window.location.href = '/issue-submitted';
    } catch (err: any) {
      showToast(err.message || 'Submission error. Please check your inputs.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyTicket = () => {
    if (!submissionResult) return;
    navigator.clipboard.writeText(`Reference ID: ${submissionResult.ticketNumber}`);
    setCopiedTicket(true);
    showToast('Reference ID copied to clipboard', 'success');
    setTimeout(() => setCopiedTicket(false), 2500);
  };

  return (
    <section id="raise-issue" className="py-20 bg-gradient-to-b from-orange-50/60 via-white to-orange-50/50 text-slate-900 relative overflow-hidden border-b border-orange-200/80">
      {/* Subtle decorative glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-300 text-orange-800 text-xs font-bold mb-3 shadow-xs">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            <span>छात्र एवं जन समस्या निवारण मंच • Grievance Portal</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            अपनी समस्या बताएं (Raise an Issue)
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium">
            College, campus, scholarship, hostel, ya local youth issue se judi samasya yahan darj karein.
            Aapki jaankari poori tarah surakshit aur confidential rahegi.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 bg-orange-100/70 border border-orange-300/80 px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-orange-950 shadow-xs">
            <Phone className="w-3.5 h-3.5 text-orange-700 flex-shrink-0" />
            <span>Tatkaal Sahayata (Emergency/Urgent Helpline):</span>
            <a
              href="tel:+916395014760"
              className="font-bold text-orange-800 hover:text-orange-950 underline underline-offset-2"
            >
              +91 63950 14760
            </a>
          </div>
        </div>

        {/* Success Confirmation & Official Grievance Petition Slip */}
        {submissionResult ? (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            {/* Top Status Notification Banner */}
            <div className="bg-white border-2 border-emerald-500/80 rounded-2xl p-5 sm:p-6 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-500 flex items-center justify-center text-emerald-600 flex-shrink-0 shadow-xs">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wider">
                      <Check className="w-3 h-3" />
                      <span>शिकायत विधिवत पंजीकृत</span>
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      अलर्ट प्रेषित: <strong className="text-orange-600 font-mono">kavyanshkayasthabvp@gmail.com</strong>
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                    {submissionResult.heading || 'आपकी समस्या सफलतापूर्वक प्राप्त हो गई है।'}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm font-medium mt-0.5">
                    {submissionResult.message || 'आपकी दी गई जानकारी सुरक्षित रूप से दर्ज कर ली गई है। आवश्यक होने पर आपसे संपर्क किया जाएगा।'}
                  </p>
                </div>
              </div>

              {/* Quick Print Button */}
              <button
                type="button"
                onClick={() => window.print()}
                className="no-print inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition shadow flex-shrink-0"
                title="Print or Save as PDF"
              >
                <Printer className="w-4 h-4 text-orange-400" />
                <span>शिकायत पत्र प्रिंट / PDF</span>
              </button>
            </div>

            {/* Direct Action Toolbar */}
            <div className="no-print bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200 p-4 rounded-xl shadow-xs">
              <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-orange-600" />
                  <span>त्वरित कार्रवाई एवं प्रेषण (Instant Actions & Alerts):</span>
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Reference ID: <strong className="text-orange-600 font-mono">{submissionResult.ticketNumber}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
                {/* 1. Open Gmail Web Directly */}
                {submissionResult.gmailWebUrl && (
                  <a
                    href={submissionResult.gmailWebUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 px-3 rounded-lg shadow-xs transition"
                    title="Open directly in Gmail web browser"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Gmail में भेजें (काव्यंश जी को)</span>
                  </a>
                )}

                {/* 2. Standard Mailto */}
                {submissionResult.mailtoUrl && (
                  <a
                    href={submissionResult.mailtoUrl}
                    className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold py-2.5 px-3 rounded-lg shadow-xs transition"
                    title="Open in default Email app"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Email App से भेजें</span>
                  </a>
                )}

                {/* 3. WhatsApp Direct Alert */}
                {submissionResult.whatsappUrl && (
                  <a
                    href={submissionResult.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-3 rounded-lg shadow-xs transition"
                    title="Send pre-filled complaint letter via WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp (+91 63950 14760)</span>
                  </a>
                )}

                {/* 4. Copy Memo Button */}
                <button
                  type="button"
                  onClick={() => {
                    const text =
                      submissionResult.complaintMemoText ||
                      `ABVP Samasya #${submissionResult.ticketNumber}\nAavedak: ${submissionResult.submittedIssue?.fullName}\nMobile: ${submissionResult.submittedIssue?.mobile}\nCategory: ${submissionResult.submittedIssue?.category}\nTitle: ${submissionResult.submittedIssue?.title}\nVivaran: ${submissionResult.submittedIssue?.description}`;
                    navigator.clipboard.writeText(text);
                    setCopiedSummary(true);
                    showToast('संपूर्ण शिकायत प्रपत्र कॉपी हो गया', 'success');
                    setTimeout(() => setCopiedSummary(false), 2500);
                  }}
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-orange-50 border border-slate-300 hover:border-orange-300 text-slate-800 text-xs font-bold py-2.5 px-3 rounded-lg shadow-xs transition"
                >
                  {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-orange-600" />}
                  <span>शिकायत पत्र कॉपी करें</span>
                </button>
              </div>
            </div>

            {/* ============================================================ */}
            {/* THE AUTHENTIC OFFICIAL ABVP GRIEVANCE PETITION LETTER DOCUMENT */}
            {/* ============================================================ */}
            <div
              id="printable-grievance-letter"
              className="bg-white border-2 border-orange-600 rounded-2xl overflow-hidden shadow-2xl text-left"
            >
              {/* Top Tricolor Ribbon */}
              <div className="h-2 w-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38]"></div>

              {/* Official Letterhead Header with Real ABVP Logo */}
              <div className="bg-[#fffaf5] border-b-2 border-dashed border-orange-200 p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
                  {/* ABVP Logo */}
                  <div className="flex-shrink-0">
                    <img
                      src="/abvp-logo.png"
                      alt="ABVP Emblem"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-orange-600 p-1 bg-white shadow-md object-contain mx-auto"
                    />
                  </div>

                  {/* Letterhead Header Text */}
                  <div className="flex-1 space-y-1">
                    <h1 className="text-xl sm:text-2xl font-black text-orange-600 tracking-wide uppercase">
                      अखिल भारतीय विद्यार्थी परिषद (ABVP)
                    </h1>
                    <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                      मथुरा महानगर इकाई • उत्तर प्रदेश
                    </h2>
                    <div className="inline-block bg-orange-600 text-white text-xs font-black px-3 py-1 rounded shadow-xs uppercase tracking-wider">
                      छात्र अधिकार एवं जनसमस्या निवारण प्रकोष्ठ (Grievance Redressal Cell)
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-semibold pt-1">
                      कार्यालय: विद्यार्थी भवन, मथुरा • अधिकृत छात्र/नागरिक शिकायत पंजीकरण प्रपत्र
                    </p>
                  </div>

                  {/* Right Seal Emblem Stamp */}
                  <div className="flex-shrink-0 hidden md:block">
                    <div className="border-2 border-dashed border-orange-600 rounded-full w-24 h-24 flex flex-col items-center justify-center text-center p-2 font-black text-[9px] text-orange-700 uppercase leading-tight bg-white shadow-xs">
                      <span>OFFICIAL</span>
                      <span className="text-xs text-orange-800">SEAL</span>
                      <span>ABVP MTH</span>
                      <span className="text-[8px] text-slate-500">2026-27</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filing Ledger Bar (Reference ID & Filing Date) */}
              <div className="bg-slate-900 text-white px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-slate-400 font-bold uppercase tracking-wider">कार्यालय संदर्भ सं० (Reference ID):</span>
                  <span className="font-mono font-black text-sm text-white bg-orange-600 px-3 py-1 rounded tracking-wider shadow-xs">
                    {submissionResult.ticketNumber}
                  </span>
                  <button
                    type="button"
                    onClick={copyTicket}
                    className="no-print p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="Copy Reference ID"
                  >
                    {copiedTicket ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-orange-400" />}
                  </button>
                </div>

                <div className="text-slate-300 text-xs">
                  पंजीकरण दिनांक: <strong className="text-white">{submissionResult.formattedDate}</strong>
                </div>
              </div>

              {/* Document Body */}
              <div className="p-6 sm:p-8 space-y-6 text-slate-800 text-sm">
                {/* Formal Addressing Block */}
                <div className="border-b border-slate-200 pb-4 text-xs sm:text-sm leading-relaxed">
                  <span className="text-slate-500 uppercase font-bold text-[11px] block">प्रति (To),</span>
                  <div className="font-extrabold text-slate-900 text-base mt-0.5">श्री काव्यंश कायस्थ जी</div>
                  <div className="text-slate-700 font-medium">नगर मंत्री, अखिल भारतीय विद्यार्थी परिषद (ABVP) मथुरा महानगर</div>
                  <div className="text-slate-500 text-xs">विद्यार्थी भवन, मथुरा (उ.प्र.) • ईमेल: kavyanshkayasthabvp@gmail.com</div>
                </div>

                {/* Grievance Subject Box */}
                <div className="bg-orange-50/80 border-l-4 border-orange-600 p-4 rounded-r-xl">
                  <span className="text-[11px] font-black text-orange-700 uppercase tracking-wider block">
                    विषय (Grievance Subject):
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-orange-950 mt-1">
                    {submissionResult.submittedIssue?.title}
                  </h3>
                  <div className="text-xs text-slate-600 mt-1 flex items-center gap-3 flex-wrap">
                    <span>समस्या श्रेणी: <strong className="text-orange-700">{submissionResult.submittedIssue?.category}</strong></span>
                    <span>•</span>
                    <span>क्षेत्र/कॉलेज: <strong className="text-slate-900">{submissionResult.submittedIssue?.areaLocality || 'मथुरा'}</strong></span>
                  </div>
                </div>

                {/* Applicant Ledger Table */}
                <div className="space-y-2">
                  <div className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    [भाग 1] आवेदक / शिकायतकर्ता का अधिकृत विवरण (Applicant Particulars)
                  </div>
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs border-collapse">
                      <tbody>
                        <tr className="border-b border-slate-200">
                          <td className="w-1/3 py-2.5 px-4 bg-slate-50 font-bold text-slate-600">आवेदक का पूरा नाम:</td>
                          <td className="py-2.5 px-4 font-black text-slate-900 text-sm">{submissionResult.submittedIssue?.fullName}</td>
                        </tr>
                        <tr className="border-b border-slate-200 bg-white">
                          <td className="py-2.5 px-4 bg-slate-50 font-bold text-slate-600">संपर्क मोबाइल नंबर:</td>
                          <td className="py-2.5 px-4 font-black text-orange-600">
                            <a href={`tel:${submissionResult.submittedIssue?.mobile}`} className="hover:underline">
                              {submissionResult.submittedIssue?.mobile}
                            </a>
                            <a
                              href={`https://wa.me/91${submissionResult.submittedIssue?.mobile}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="no-print ml-3 inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-300 px-2 py-0.5 rounded text-[11px] font-bold"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </a>
                          </td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="py-2.5 px-4 bg-slate-50 font-bold text-slate-600">ईमेल आईडी:</td>
                          <td className="py-2.5 px-4 text-slate-800">
                            {submissionResult.submittedIssue?.email ? (
                              <a href={`mailto:${submissionResult.submittedIssue.email}`} className="text-sky-600 hover:underline">
                                {submissionResult.submittedIssue.email}
                              </a>
                            ) : (
                              <span className="text-slate-400 italic">उपलब्ध नहीं</span>
                            )}
                          </td>
                        </tr>
                        <tr className="border-b border-slate-200 bg-white">
                          <td className="py-2.5 px-4 bg-slate-50 font-bold text-slate-600">कॉलेज / इलाका / वार्ड:</td>
                          <td className="py-2.5 px-4 font-semibold text-slate-900">
                            {submissionResult.submittedIssue?.areaLocality || 'मथुरा'} (मथुरा)
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 bg-slate-50 font-bold text-slate-600">पंजीकरण स्थिति:</td>
                          <td className="py-2.5 px-4">
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-black">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>सफलतापूर्वक दर्ज (Registered & Assigned to ABVP Mathura)</span>
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Grievance Statement */}
                <div className="space-y-2">
                  <div className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    [भाग 2] समस्या / शिकायत का संपूर्ण विवरण (Official Grievance Statement)
                  </div>
                  <div className="p-5 rounded-xl bg-orange-50/40 border border-orange-200 text-slate-900 leading-relaxed font-serif text-sm sm:text-base whitespace-pre-wrap shadow-xs">
                    {submissionResult.submittedIssue?.description}
                  </div>
                </div>

                {/* Applicant Undertaking */}
                <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-3.5 text-xs text-slate-600 leading-relaxed">
                  <strong className="text-slate-900">आवेदक द्वारा घोषणा / Undertaking:</strong> "प्रमाणित किया जाता है कि उपरोक्त शिकायत विवरण सत्य है तथा छात्र/नागरिक हित में एबीवीपी मथुरा नेतृत्व से समाधान हेतु सहयोग एवं प्रशासनिक पैरवी की प्रार्थना की गई है।"
                </div>

                {/* Official Verification Seal & Signature Footer */}
                <div className="border-t-2 border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                  {/* Digital Security Code */}
                  <div className="space-y-1 text-center sm:text-left">
                    <div className="text-xs font-black text-slate-900">अखिल भारतीय विद्यार्थी परिषद • मथुरा महानगर</div>
                    <div className="text-[11px] text-slate-500">छात्र अधिकार एवं जनसमस्या निवारण प्रकोष्ठ</div>
                    <div className="font-mono text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1 rounded inline-block">
                      AUTH-ID: ABVP-MTH-VERIFIED-{submissionResult.ticketNumber}
                    </div>
                  </div>

                  {/* Digital Signature & Stamp */}
                  <div className="text-center sm:text-right space-y-1">
                    <div className="inline-block border-2 border-orange-600 rounded-full px-3 py-1 text-[10px] font-black text-orange-700 uppercase bg-orange-50/50 mb-1">
                      DIGITALLY CERTIFIED • ABVP MATHURA
                    </div>
                    <div className="text-base font-black text-slate-900">काव्यंश कायस्थ</div>
                    <div className="text-xs text-slate-600 font-semibold">नगर मंत्री, अखिल भारतीय विद्यार्थी परिषद (ABVP) मथुरा</div>
                    <div className="text-[11px] text-slate-500">हेल्पलाइन: +91 63950 14760 | ईमेल: kavyanshkayasthabvp@gmail.com</div>
                  </div>
                </div>
              </div>

              {/* Bottom Document Footnote */}
              <div className="bg-slate-100 border-t border-slate-200 px-6 py-3 text-center text-[11px] text-slate-500 font-medium">
                यह प्रपत्र ABVP मथुरा के आधिकारिक छात्र एवं जनसमस्या निवारण पोर्टल द्वारा स्वतः उत्पन्न अधिकृत शिकायत प्रपत्र है।
              </div>
            </div>

            {/* Bottom Reset Button */}
            <div className="no-print pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setSubmissionResult(null)}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold px-7 py-3 rounded-xl transition shadow"
              >
                <span>Submit Another Issue (अन्य समस्या बताएं)</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-orange-200/90 rounded-2xl p-6 sm:p-10 shadow-xl">
            {/* Privacy Box */}
            <div className="mb-8 p-4 rounded-xl bg-orange-50/80 border border-orange-200 flex items-start gap-3">
              <Shield className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 space-y-1">
                <p className="font-bold text-slate-900">
                  गोपनीयता आश्वासन (Strict Privacy Protection):
                </p>
                <p className="leading-relaxed text-slate-600 font-medium">
                  Aapka mobile number, email, aur uploaded documents kisi bhi public web page par pradarshit nahi kiye jaate.
                  Yeh data kewal samasya ke nidan aur aapse sampark hetu upyog kiya jata hai.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Name & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Full Name (पूरा नाम) <span className="text-orange-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Mobile Number (मोबाइल नंबर) <span className="text-orange-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                  />
                </div>
              </div>

              {/* Row 2: Email & Preferred Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Email Address (ईमेल — ऐच्छिक)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@example.com"
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Preferred Contact Method (संपर्क माध्यम)
                  </label>
                  <select
                    value={formData.preferredContact}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferredContact: e.target.value as any,
                      })
                    }
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                  >
                    <option value="Phone">Phone Call</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Email">Email</option>
                    <option value="Any">Any Convenient Method</option>
                  </select>
                </div>
              </div>

              {/* Row 3: District, City, Locality */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    District (जिला)
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    City (शहर)
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Area / College Locality
                  </label>
                  <input
                    type="text"
                    value={formData.areaLocality}
                    onChange={(e) => setFormData({ ...formData, areaLocality: e.target.value })}
                    placeholder="e.g. BSA College Road / Dampier Nagar"
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                  />
                </div>
              </div>

              {/* Row 4: Category & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
                <div className="sm:col-span-5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Issue Category (समस्या श्रेणी) <span className="text-orange-600">*</span>
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as IssueCategory })
                    }
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                  >
                    {ISSUE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-7">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Issue Title (समस्या का संक्षिप्त विषय) <span className="text-orange-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Scholarship portal verification biometric pending"
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                  />
                </div>
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Detailed Description (समस्या का पूर्ण विवरण) <span className="text-orange-600">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Kripya poori samasya vistrit roop se likhein (College/Institute name, Course, Roll No agar jaruri ho, aur apekshit sahyog)..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition resize-y"
                />
              </div>

              {/* Upload Photo / Document */}
              <div className="p-4 rounded-xl bg-orange-50/50 border border-dashed border-orange-300 space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Upload Photo / Document (आवेदन, रसीद या संबंधित फोटो — Max 10MB)
                </label>

                {attachment ? (
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200 text-xs shadow-xs">
                    <div className="flex items-center gap-2 text-slate-800 truncate">
                      <FileText className="w-4 h-4 text-orange-600 flex-shrink-0" />
                      <span className="truncate font-semibold">{attachment.name}</span>
                      <span className="text-slate-500">
                        ({(attachment.size / 1024).toFixed(0)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAttachment(null)}
                      className="text-red-500 hover:text-red-700 ml-2 font-bold"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 bg-white hover:bg-orange-50 text-slate-800 text-xs font-bold px-4 py-2 rounded-lg border border-orange-300 cursor-pointer transition shadow-xs">
                      <Upload className="w-3.5 h-3.5 text-orange-600" />
                      <span>Choose File (PDF/Image)</span>
                      <input
                        type="file"
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Optional: Attach application copy or evidence
                    </span>
                  </div>
                )}
              </div>

              {/* Consent Checkbox */}
              <div className="flex items-start gap-3 pt-2">
                <input
                  id="issue-consent-checkbox"
                  type="checkbox"
                  required
                  checked={formData.consent}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 bg-white"
                />
                <label htmlFor="issue-consent-checkbox" className="text-xs text-slate-600 leading-relaxed font-medium">
                  Main pushti karta hoon ki upar di gayi jaankari satya hai. Main samajhta hoon ki
                  meri jaankari kewal samasya nidaan hetu upyog ki jayegi aur prashasan tak pahunchane
                  ke liye sampark kiya ja sakta hai.{' '}
                  <button
                    type="button"
                    onClick={() => setActivePolicyModal('submission')}
                    className="text-orange-600 font-bold hover:underline"
                  >
                    View Submission & Privacy Policy
                  </button>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-orange-200">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-bit Encrypted Backend Submission</span>
                </div>

                <button
                  id="submit-issue-button"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 text-white font-black text-sm px-8 py-3 rounded-xl shadow-lg hover:shadow-orange-500/25 transition"
                >
                  {isSubmitting ? (
                    <span>Submitting Issue...</span>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      <span>Submit Issue (समस्या दर्ज करें)</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};
