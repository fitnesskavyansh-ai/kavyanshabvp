import React, { useState } from 'react';
import {
  ShieldCheck,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  Building,
  User,
  MessageSquare,
  Lock,
  ArrowRight,
  Info,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ComplaintFormState {
  fullName: string;
  collegeName: string;
  mobile: string;
  email: string;
  complaint: string;
  botcheck: string; // Honeypot spam protection field
}

interface ComplaintFormErrors {
  fullName?: string;
  collegeName?: string;
  mobile?: string;
  email?: string;
  complaint?: string;
}

export const StudentComplaintForm: React.FC = () => {
  const { showToast } = useApp();

  const [formData, setFormData] = useState<ComplaintFormState>({
    fullName: '',
    collegeName: '',
    mobile: '',
    email: '',
    complaint: '',
    botcheck: '',
  });

  const [errors, setErrors] = useState<ComplaintFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successDetails, setSuccessDetails] = useState<{
    referenceId: string;
    studentName: string;
    collegeName: string;
    submittedAt: string;
  } | null>(null);

  // Validate Indian 10-digit mobile number (+91 optional, digits 6-9 start)
  const validateMobile = (value: string): boolean => {
    const cleaned = value.replace(/[\s\-]/g, '');
    const indianMobileRegex = /^(?:\+91|91|0)?([6-9]\d{9})$/;
    return indianMobileRegex.test(cleaned);
  };

  // Extract clean 10-digit number
  const extractCleanMobile = (value: string): string => {
    const cleaned = value.replace(/[\s\-]/g, '');
    const match = cleaned.match(/^(?:\+91|91|0)?([6-9]\d{9})$/);
    return match ? match[1] : cleaned;
  };

  // Validate email if provided
  const validateEmail = (value: string): boolean => {
    if (!value.trim()) return true; // Optional field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value.trim());
  };

  const validateField = (name: keyof ComplaintFormState, value: string): string | undefined => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'कृपया अपना पूरा नाम दर्ज करें (Full Name is required)';
        if (value.trim().length < 2) return 'कृपया वैध नाम दर्ज करें (कम से कम 2 अक्षर)';
        return undefined;

      case 'collegeName':
        if (!value.trim()) return 'कृपया अपने कॉलेज या यूनिवर्सिटी का नाम दर्ज करें';
        if (value.trim().length < 2) return 'कृपया कॉलेज का पूरा नाम दर्ज करें';
        return undefined;

      case 'mobile':
        if (!value.trim()) return 'कृपया अपना 10 अंकों का मोबाइल नंबर दर्ज करें';
        if (!validateMobile(value)) {
          return 'कृपया 10 अंकों का वैध भारतीय मोबाइल नंबर दर्ज करें (उदा. 9876543210)';
        }
        return undefined;

      case 'email':
        if (value.trim() && !validateEmail(value)) {
          return 'कृपया एक मान्य ईमेल पता दर्ज करें अथवा इसे खाली छोड़ें';
        }
        return undefined;

      case 'complaint':
        if (!value.trim()) return 'कृपया अपनी शिकायत या समस्या का विवरण दर्ज करें';
        if (value.trim().length < 10) {
          return 'कृपया समस्या का थोड़ा और स्पष्ट विवरण दें (कम से कम 10 अक्षर)';
        }
        return undefined;

      default:
        return undefined;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const fieldError = validateField(name as keyof ComplaintFormState, value);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
    if (submitError) setSubmitError(null);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name as keyof ComplaintFormState, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const validateForm = (): boolean => {
    const newErrors: ComplaintFormErrors = {};
    const keys: (keyof ComplaintFormState)[] = ['fullName', 'collegeName', 'mobile', 'email', 'complaint'];

    keys.forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });

    setErrors(newErrors);
    setTouched({
      fullName: true,
      collegeName: true,
      mobile: true,
      email: true,
      complaint: true,
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate submissions if an API request is already in progress
    if (isSubmitting) {
      return;
    }

    // Spam honeypot detection
    if (formData.botcheck) {
      return;
    }

    if (!validateForm()) {
      showToast('कृपया फॉर्म में आवश्यक जानकारियों को सही करें', 'error');
      // Scroll to the first error field
      const firstErrorField = document.querySelector('[aria-invalid="true"]');
      if (firstErrorField) {
        (firstErrorField as HTMLElement).focus();
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const cleanMobile = extractCleanMobile(formData.mobile);
    const trimmedName = formData.fullName.trim();
    const trimmedCollege = formData.collegeName.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedComplaint = formData.complaint.trim();

    const timestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    const referenceId = `CMP-${Date.now().toString().slice(-6)}`;

    // Format subject exactly as required:
    // [New Complaint] - [Student Name] - [College Name]
    const emailSubject = `[New Complaint] - ${trimmedName} - ${trimmedCollege}`;

    // Format email body with all required fields:
    // Student Name, College / University Name, Mobile Number, Email ID, Complaint Details, Submission Date/Time, Website: kavyanshkayasthabvp.in
    const emailBody = `NEW STUDENT COMPLAINT DETAILS
==================================================
Student Name:
${trimmedName}

College / University Name:
${trimmedCollege}

Mobile Number:
${cleanMobile}

Email ID:
${trimmedEmail || 'Not provided'}

Complaint Details:
${trimmedComplaint}

Submission Date/Time:
${timestamp}

Reference ID:
${referenceId}

Website:
kavyanshkayasthabvp.in

Recipient:
kavyanshkayasthabvp@gmail.com
==================================================`;

    // Web3Forms Access Key from Vite Environment variable
    const web3formsKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim() || '';

    try {
      // Strictly verify that the access key is configured - do NOT fake success
      if (!web3formsKey || web3formsKey === 'your_web3forms_access_key_here') {
        throw new Error('MISSING_ACCESS_KEY');
      }

      // Prepare payload strictly according to Web3Forms API specifications
      // Note: The recipient email (kavyanshkayasthabvp@gmail.com) is bound to the access_key.
      // We must NOT pass an invalid 'to_email' field or assign the recipient's own address as the submitter's 'email'.
      const payload: Record<string, string> = {
        access_key: web3formsKey,
        subject: emailSubject,
        from_name: 'छात्र शिकायत पोर्टल (kavyanshkayasthabvp.in)',
        name: trimmedName,
        'Student Name': trimmedName,
        'College / University Name': trimmedCollege,
        'Mobile Number': cleanMobile,
        'Email ID': trimmedEmail || 'उपलब्ध नहीं (Not provided)',
        'Complaint Details': trimmedComplaint,
        'Submission Date/Time': timestamp,
        Website: 'kavyanshkayasthabvp.in',
        'Reference ID': referenceId,
        message: emailBody,
      };

      // Only attach student's email as sender/replyto if provided by the student
      if (trimmedEmail) {
        payload.email = trimmedEmail;
        payload.replyto = trimmedEmail;
      }

      // Direct Web3Forms submission via official API endpoint
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      let result: { success?: boolean; message?: string } | null = null;
      try {
        result = await response.json();
      } catch {
        throw new Error('सर्वर से अमान्य प्रतिक्रिया प्राप्त हुई (Invalid server response)');
      }

      // STRICT VALIDATION: Do NOT show success unless Web3Forms API actually returns { success: true }
      if (!response.ok || !result || result.success !== true) {
        const errorDetail = result?.message || `HTTP ${response.status} Error`;
        throw new Error(errorDetail);
      }

      // Optional non-blocking secondary storage to local database if Express backend is running
      try {
        fetch('/api/issues', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: trimmedName,
            mobile: cleanMobile,
            email: trimmedEmail,
            city: 'Mathura',
            areaLocality: trimmedCollege,
            category: 'Student Issue',
            title: `[छात्र शिकायत] ${trimmedCollege} - ${trimmedName}`,
            description: trimmedComplaint,
            preferredContact: 'Phone',
            consent: true,
            referenceId,
          }),
        }).catch(() => {});
      } catch {
        // Fallback for static hosting environments (Firebase Hosting)
      }

      // ONLY reach here when Web3Forms actually succeeded
      setSuccessDetails({
        referenceId,
        studentName: trimmedName,
        collegeName: trimmedCollege,
        submittedAt: timestamp,
      });
      setSubmitSuccess(true);
      showToast('आपकी शिकायत दर्ज कर ली गई है और ईमेल kavyanshkayasthabvp@gmail.com पर भेज दिया गया है।', 'success');

      // Reset form inputs
      setFormData({
        fullName: '',
        collegeName: '',
        mobile: '',
        email: '',
        complaint: '',
        botcheck: '',
      });
      setTouched({});
      setErrors({});
    } catch (err: unknown) {
      const rawError = err instanceof Error ? err.message : '';
      let hindiMsg = 'ईमेल सर्वर पर संदेश भेजने में समस्या हुई।';

      if (rawError === 'MISSING_ACCESS_KEY') {
        hindiMsg =
          'ईमेल प्रेषण सेवा की Access Key (VITE_WEB3FORMS_ACCESS_KEY) अभी कॉन्फ़िगर नहीं की गई है।';
      } else if (rawError) {
        hindiMsg = `ईमेल प्रेषण त्रुटि: ${rawError}`;
      }

      setSubmitError(
        `${hindiMsg}। शिकायत ईमेल पर प्रेषित नहीं हो सकी। कृपया व्यवस्थापक द्वारा पर्यावरण चर में मान्य Web3Forms Access Key दर्ज करें अथवा सीधे हेल्पलाइन +91 63950 14760 / ईमेल kavyanshkayasthabvp@gmail.com पर संपर्क करें।`
      );
      showToast('शिकायत दर्ज करने में त्रुटि हुई। संदेश नहीं भेजा जा सका।', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmitSuccess(false);
    setSubmitError(null);
    setSuccessDetails(null);
  };

  return (
    <section
      id="complaint-center"
      className="py-16 sm:py-24 bg-gradient-to-b from-[#faf9f6] via-white to-[#faf9f6] text-slate-900 border-b border-orange-200/80 relative"
      aria-labelledby="complaint-center-heading"
    >
      {/* Anchor for existing links pointing to #raise-issue */}
      <div id="raise-issue" className="absolute -top-24 left-0 pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-900 text-xs font-bold mb-3 border border-orange-300 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-orange-600" />
            <span>छात्र संवाद एवं सहायता मंच • Student Grievance & Feedback</span>
          </div>
          <h2
            id="complaint-center-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight font-hindi"
          >
            छात्र शिकायत एवं सुझाव केंद्र
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 font-medium leading-relaxed font-hindi max-w-2xl mx-auto">
            मथुरा, चौमुहां, छाता एवं कोसी क्षेत्र के समस्त छात्र-छात्राओं के कॉलेज, विश्वविद्यालय,
            छात्रवृत्ति, परीक्षा अथवा परिसर से संबंधित समस्याओं के समाधान हेतु एक सीधा, पारदर्शी एवं
            विश्वसनीय मंच।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Side: Trust & Guidelines Card (Visible on all devices, compact on mobile) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-200/90 shadow-lg shadow-orange-500/5 space-y-6">
              <div className="flex items-center gap-3 border-b border-orange-100 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black shadow-md flex-shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 font-hindi">
                    हमारा संकल्प व प्रक्रिया
                  </h3>
                  <p className="text-xs text-slate-500">Student First • Dedicated Support</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-700 font-hindi">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    १
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                      सीधा संगठन एवं प्रशासन तक
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      आपकी समस्या संबंधित कॉलेज प्रशासन अथवा विश्वविद्यालय तक पहुंचाई जाएगी।
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    २
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                      पूर्ण गोपनीयता का सम्मान
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      आपकी व्यक्तिगत जानकारी किसी भी सार्वजनिक पेज पर प्रदर्शित नहीं की जाती है।
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    ३
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                      समयबद्ध संपर्क व समाधान
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      शिकायत मिलते ही हमारी टीम विवरण की समीक्षा कर आपसे संपर्क करेगी।
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct helpline card */}
              <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 text-xs space-y-2">
                <div className="flex items-center gap-2 text-orange-800 font-bold">
                  <Info className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <span>अति-आवश्यक समस्या हेतु संपर्क:</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  यदि कोई आपातकालीन या तत्काल सहायता चाहिए, तो आप सीधे कॉल या व्हाट्सएप कर सकते हैं:
                </p>
                <div className="pt-1 flex flex-col gap-1.5 font-semibold text-slate-800">
                  <a
                    href="tel:+916395014760"
                    className="flex items-center gap-2 hover:text-orange-600 transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-orange-600" />
                    <span>+91 63950 14760 (हेल्पलाइन)</span>
                  </a>
                  <a
                    href="mailto:kavyanshkayasthabvp@gmail.com"
                    className="flex items-center gap-2 hover:text-orange-600 transition truncate"
                  >
                    <Mail className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
                    <span className="truncate">kavyanshkayasthabvp@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Professional Student Complaint Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-orange-200/90 shadow-xl shadow-orange-500/5 relative overflow-hidden">
              {/* Success View */}
              {submitSuccess && successDetails ? (
                <div
                  className="py-6 sm:py-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300"
                  role="status"
                  aria-live="polite"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-200 ring-8 ring-emerald-50/60 shadow-inner">
                    <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
                  </div>

                  <div className="space-y-3">
                    <span className="inline-block text-xs font-bold text-emerald-700 uppercase tracking-wider px-3 py-1 bg-emerald-100 rounded-full">
                      शिकायत सफलतापूर्वक दर्ज
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-hindi">
                      आपकी शिकायत दर्ज कर ली गई है। जल्द ही आपसे संपर्क किया जाएगा।
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                      धन्यवाद! आपकी समस्या संगठन के संज्ञान में आ चुकी है। आवश्यकता पड़ने पर आपके दिए
                      गए मोबाइल नंबर अथवा ईमेल पर संपर्क किया जाएगा।
                    </p>
                  </div>

                  {/* Summary Card (Without exposing sensitive full phone) */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs max-w-md mx-auto space-y-2">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                      <span className="text-slate-500">रिफरेंस नंबर:</span>
                      <span className="font-mono font-bold text-orange-600">
                        {successDetails.referenceId}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                      <span className="text-slate-500">छात्र का नाम:</span>
                      <span className="font-bold text-slate-800">{successDetails.studentName}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                      <span className="text-slate-500">कॉलेज / विश्वविद्यालय:</span>
                      <span className="font-semibold text-slate-800">
                        {successDetails.collegeName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-slate-500">दिनांक व समय:</span>
                      <span className="text-slate-700 text-[11px]">{successDetails.submittedAt}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-orange-300 bg-white text-orange-700 hover:bg-orange-50 font-bold text-xs sm:text-sm transition cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>एक और शिकायत दर्ज करें</span>
                    </button>
                    <a
                      href="#home"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-md transition"
                    >
                      <span>वेबसाइट पर जारी रखें</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ) : (
                /* The Active Form */
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="space-y-6"
                  aria-label="Student Complaint and Suggestion Form"
                >
                  {/* Honeypot field for anti-spam (invisible to normal users) */}
                  <input
                    type="text"
                    name="botcheck"
                    value={formData.botcheck}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    style={{ display: 'none' }}
                    aria-hidden="true"
                  />

                  {/* Top Form Introduction */}
                  <div className="border-b border-orange-100 pb-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 font-hindi flex items-center gap-2">
                        <span>शिकायत / सुझाव फॉर्म</span>
                      </h3>
                      <span className="text-[11px] font-medium text-slate-500">
                        <span className="text-red-500 font-bold">*</span> अनिवार्य फ़ील्ड
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      कृपया सभी विवरण स्पष्ट रूप से दर्ज करें ताकि आपकी समस्या का शीघ्र समाधान किया जा सके।
                    </p>
                  </div>

                  {/* Error Alert Box */}
                  {submitError && (
                    <div
                      className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-3"
                      role="alert"
                    >
                      <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-bold">शिकायत भेजने में समस्या:</p>
                        <p className="leading-relaxed">{submitError}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Field 1: पूरा नाम (Full Name) - Required */}
                    <div className="sm:col-span-1">
                      <label
                        htmlFor="complaint-fullName"
                        className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5 font-hindi"
                      >
                        पूरा नाम <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          id="complaint-fullName"
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Full Name"
                          required
                          aria-required="true"
                          aria-invalid={!!errors.fullName}
                          aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                          className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${
                            errors.fullName
                              ? 'border-red-400 bg-red-50/30 focus:ring-red-300'
                              : 'border-slate-200 focus:border-orange-500 focus:ring-orange-200'
                          }`}
                        />
                      </div>
                      {errors.fullName && (
                        <p
                          id="fullName-error"
                          className="mt-1.5 text-xs text-red-600 font-medium font-hindi flex items-center gap-1"
                        >
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{errors.fullName}</span>
                        </p>
                      )}
                    </div>

                    {/* Field 2: कॉलेज / यूनिवर्सिटी का नाम (College/University Name) - Required */}
                    <div className="sm:col-span-1">
                      <label
                        htmlFor="complaint-collegeName"
                        className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5 font-hindi"
                      >
                        कॉलेज / यूनिवर्सिटी का नाम <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Building className="w-4 h-4" />
                        </div>
                        <input
                          id="complaint-collegeName"
                          type="text"
                          name="collegeName"
                          value={formData.collegeName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="College/University Name"
                          required
                          aria-required="true"
                          aria-invalid={!!errors.collegeName}
                          aria-describedby={errors.collegeName ? 'collegeName-error' : undefined}
                          className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${
                            errors.collegeName
                              ? 'border-red-400 bg-red-50/30 focus:ring-red-300'
                              : 'border-slate-200 focus:border-orange-500 focus:ring-orange-200'
                          }`}
                        />
                      </div>
                      {errors.collegeName && (
                        <p
                          id="collegeName-error"
                          className="mt-1.5 text-xs text-red-600 font-medium font-hindi flex items-center gap-1"
                        >
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{errors.collegeName}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Field 3: मोबाइल नंबर (Mobile Number) - Required */}
                    <div className="sm:col-span-1">
                      <label
                        htmlFor="complaint-mobile"
                        className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5 font-hindi"
                      >
                        मोबाइल नंबर <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          id="complaint-mobile"
                          type="tel"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Mobile Number (10 Digits)"
                          maxLength={15}
                          required
                          aria-required="true"
                          aria-invalid={!!errors.mobile}
                          aria-describedby={errors.mobile ? 'mobile-error' : undefined}
                          className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${
                            errors.mobile
                              ? 'border-red-400 bg-red-50/30 focus:ring-red-300'
                              : 'border-slate-200 focus:border-orange-500 focus:ring-orange-200'
                          }`}
                        />
                      </div>
                      {errors.mobile ? (
                        <p
                          id="mobile-error"
                          className="mt-1.5 text-xs text-red-600 font-medium font-hindi flex items-center gap-1"
                        >
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{errors.mobile}</span>
                        </p>
                      ) : (
                        <p className="mt-1 text-[11px] text-slate-500">
                          भारतीय १० अंकों का मोबाइल नंबर (उदा. 9876543210)
                        </p>
                      )}
                    </div>

                    {/* Field 4: ईमेल आईडी (Email ID) - Optional */}
                    <div className="sm:col-span-1">
                      <label
                        htmlFor="complaint-email"
                        className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5 font-hindi"
                      >
                        ईमेल आईडी <span className="text-xs font-normal text-slate-500">(वैकल्पिक)</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          id="complaint-email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Email ID (Optional)"
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? 'email-error' : undefined}
                          className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${
                            errors.email
                              ? 'border-red-400 bg-red-50/30 focus:ring-red-300'
                              : 'border-slate-200 focus:border-orange-500 focus:ring-orange-200'
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <p
                          id="email-error"
                          className="mt-1.5 text-xs text-red-600 font-medium font-hindi flex items-center gap-1"
                        >
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Field 5: शिकायत / समस्या का विवरण (Complaint Details) - Required */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="complaint-details"
                        className="block text-xs sm:text-sm font-bold text-slate-900 font-hindi"
                      >
                        शिकायत / समस्या का विवरण <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[11px] text-slate-500">
                        {formData.complaint.length} अक्षर
                      </span>
                    </div>
                    <textarea
                      id="complaint-details"
                      name="complaint"
                      rows={5}
                      value={formData.complaint}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Complaint Details (कृपया अपनी समस्या, विभाग, कॉलेज अथवा संबंधित विषय का स्पष्ट विवरण यहां लिखें...)"
                      required
                      aria-required="true"
                      aria-invalid={!!errors.complaint}
                      aria-describedby={errors.complaint ? 'complaint-error' : undefined}
                      className={`w-full px-4 py-3 rounded-2xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition leading-relaxed resize-y min-h-[120px] ${
                        errors.complaint
                          ? 'border-red-400 bg-red-50/30 focus:ring-red-300'
                          : 'border-slate-200 focus:border-orange-500 focus:ring-orange-200'
                      }`}
                    />
                    {errors.complaint && (
                      <p
                        id="complaint-error"
                        className="mt-1.5 text-xs text-red-600 font-medium font-hindi flex items-center gap-1"
                      >
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{errors.complaint}</span>
                      </p>
                    )}
                  </div>

                  {/* Privacy Note */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 text-slate-600 text-xs flex items-start gap-2.5">
                    <Lock className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed font-hindi">
                      आपके द्वारा दी गई जानकारी का उपयोग केवल आपकी शिकायत/सुझाव पर संपर्क करने के
                      लिए किया जाएगा।
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      id="complaint-submit-button"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-extrabold text-base shadow-lg shadow-orange-600/25 hover:shadow-orange-600/35 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed border border-orange-500"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="font-hindi">शिकायत दर्ज की जा रही है...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span className="font-hindi">शिकायत दर्ज करें</span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-center text-slate-500 mt-2">
                      सुरक्षित HTTPS प्रेषण • ईमेल अलर्ट: kavyanshkayasthabvp@gmail.com
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
