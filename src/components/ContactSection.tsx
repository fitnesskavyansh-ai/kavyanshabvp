import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  AlertCircle,
  Share2,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Copy,
  Check,
  Instagram,
  Facebook,
  Twitter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ContactSection: React.FC = () => {
  const { profile, showToast, setIsIssueModalOpen } = useApp();
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyPhone = () => {
    const rawNumber = (profile.phone || '6395014760').replace(/\s+/g, '');
    navigator.clipboard.writeText(rawNumber);
    setCopiedPhone(true);
    showToast('Phone number copied to clipboard!', 'success');
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const [form, setForm] = useState({
    name: '',
    contact: '',
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState<{
    message: string;
    mailtoUrl?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim() || !form.message.trim()) {
      showToast('Please fill required fields (Name, Contact, Message)', 'error');
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message');

      setSentSuccess({
        message: data.message || 'Message sent successfully',
        mailtoUrl: data.mailtoUrl,
      });
      showToast(data.message || 'Message sent successfully', 'success');
      setForm({ name: '', contact: '', subject: '', message: '' });
    } catch (err: any) {
      showToast(err.message || 'Error sending message', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-orange-50/40 via-white to-orange-50/30 text-slate-900 border-b border-orange-200/80 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-10 right-0 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Official ABVP Emblem Watermark */}
      <div className="absolute -bottom-8 -right-8 sm:bottom-4 sm:right-6 w-60 h-60 sm:w-80 sm:h-80 pointer-events-none select-none opacity-15 sm:opacity-20 z-0">
        <img
          src="/abvp-logo.png"
          alt="ABVP Emblem Watermark"
          className="w-full h-full object-contain rotate-6 filter drop-shadow-[0_0_35px_rgba(249,115,22,0.25)]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold mb-3 border border-orange-300 shadow-xs">
            <Mail className="w-3.5 h-3.5 text-orange-600" />
            <span>संपर्क एवं संवाद • Public Contact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Contact Me (मुझसे संपर्क करें)
          </h2>
          <p className="mt-3 text-base text-slate-600 font-medium">
            For campus interactions, student support, voluntary service, or public inquiries in Mathura.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Contact Details & Socials */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-orange-200 shadow-xs space-y-6">
              {/* Miniature Official Profile Strip */}
              <div className="flex items-center gap-3.5 pb-4 border-b border-orange-100">
                <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-orange-50 border border-orange-200 flex-shrink-0 shadow-xs">
                  <img
                    src={profile.photoUrl || '/kavyansh-kayastha.jpg'}
                    alt={profile.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900 leading-tight">
                    {profile.name}
                  </h4>
                  <p className="text-xs font-bold text-orange-600">
                    {profile.role}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {profile.organisation} • Mathura
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Public Reach & Office
              </h3>

              <div className="space-y-4 text-sm">
                {/* Phone */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 flex-shrink-0 shadow-xs">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 uppercase font-bold">
                        Phone / Helpline
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Active Call & WhatsApp
                      </span>
                    </div>

                    {profile.phone && profile.phone !== '[PHONE — OPTIONAL]' ? (
                      <div className="mt-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <a
                            href={`tel:${profile.phone.replace(/\s+/g, '')}`}
                            className="text-lg font-black text-slate-900 hover:text-orange-600 transition tracking-wide"
                            title="Direct Call Helpline"
                          >
                            {profile.phone}
                          </a>
                          <button
                            type="button"
                            onClick={handleCopyPhone}
                            className="inline-flex items-center p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
                            title="Copy number"
                          >
                            {copiedPhone ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {/* Quick Action Badges */}
                        <div className="flex items-center gap-2 flex-wrap pt-0.5">
                          <a
                            href={`tel:${profile.phone.replace(/\s+/g, '')}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs transition"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Call Now (कॉल करें)</span>
                          </a>

                          <a
                            href={`https://wa.me/${profile.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              'Namaste Kavyansh ji, main ABVP Mathura helpline ke madhyam se sampark kar raha/rahi hoon.'
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-500 text-sm font-mono">
                        {profile.phone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 flex-shrink-0 shadow-xs">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block uppercase font-bold">
                      Email Address
                    </span>
                    {profile.email && profile.email !== '[EMAIL]' ? (
                      <a
                        href={`mailto:${profile.email}`}
                        className="text-base font-bold text-slate-900 hover:text-orange-600 transition"
                      >
                        {profile.email}
                      </a>
                    ) : (
                      <span className="text-slate-500 text-sm font-mono">
                        {profile.email}
                      </span>
                    )}
                  </div>
                </div>

                {/* Office / Meeting Location */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 flex-shrink-0 shadow-xs">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block uppercase font-bold">
                      Office / Meeting Point
                    </span>
                    <span className="text-sm font-bold text-slate-900 block">
                      {profile.officeLocation}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Mathura, Uttar Pradesh, India</span>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-6 border-t border-orange-100">
                <span className="text-xs text-slate-500 block uppercase font-bold mb-3">
                  Connect on Social Media (सोशल मीडिया)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <a
                    id="contact-social-instagram"
                    href={profile.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-pink-50 hover:bg-pink-100 text-slate-900 border border-pink-200 hover:border-pink-400 transition font-bold shadow-xs"
                    title="Kavyansh Kayastha Instagram"
                  >
                    <div className="flex items-center gap-2">
                      <Instagram className="w-4 h-4 text-pink-600" />
                      <span>Instagram</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-pink-500" />
                  </a>
                  <a
                    id="contact-social-facebook"
                    href={profile.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-slate-900 border border-blue-200 hover:border-blue-400 transition font-bold shadow-xs"
                    title="Kavyansh Kayastha Facebook Page"
                  >
                    <div className="flex items-center gap-2">
                      <Facebook className="w-4 h-4 text-blue-600" />
                      <span>Facebook</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                  </a>
                  <a
                    id="contact-social-twitter"
                    href={profile.socials.twitterX}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 hover:border-slate-500 transition font-bold shadow-xs"
                    title="Kavyansh Kayastha X / Twitter"
                  >
                    <div className="flex items-center gap-2">
                      <Twitter className="w-4 h-4 text-slate-800" />
                      <span>X (Twitter)</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                  </a>
                </div>
              </div>

              {/* Quick Grievance CTA */}
              <div className="pt-2">
                <a
                  href="#raise-issue"
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-md shadow-orange-500/20 transition"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>अपनी समस्या बताएं (Raise an Issue)</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-orange-200 shadow-xs">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Send a Direct Message (संदेश भेजें)
              </h3>
              <p className="text-xs text-slate-500 mb-6 font-medium">
                Direct communication for youth activities, event invitations, or educational queries.
              </p>

              {sentSuccess ? (
                <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-300 rounded-xl text-center space-y-4">
                  <CheckCircle2 className="w-10 h-10 text-orange-600 mx-auto" />
                  <p className="text-base font-bold text-slate-900">
                    धन्यवाद! आपका संदेश सफलतापूर्वक भेज दिया गया है।
                  </p>
                  <p className="text-xs text-slate-600 font-medium">
                    आपका संदेश kavyanshkayasthabvp@gmail.com पर ईमेल अलर्ट के साथ भेज दिया गया है।
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-1">
                    {sentSuccess.mailtoUrl && (
                      <a
                        href={sentSuccess.mailtoUrl}
                        className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Gmail / Mail App से सीधे भेजें</span>
                      </a>
                    )}
                    <button
                      onClick={() => setSentSuccess(null)}
                      className="text-xs bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold transition shadow-xs"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                        Your Name (आपका नाम) <span className="text-orange-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Enter your name"
                        className="w-full bg-orange-50/40 border border-orange-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                        Phone or Email (फोन या ईमेल) <span className="text-orange-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={form.contact}
                        onChange={(e) => setForm({ ...form, contact: e.target.value })}
                        placeholder="e.g. 9876543210 or email"
                        className="w-full bg-orange-50/40 border border-orange-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Subject (विषय)
                    </label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="e.g. Campus Interaction / Student Support"
                      className="w-full bg-orange-50/40 border border-orange-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Your Message (संदेश) <span className="text-orange-600">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Write your message here..."
                      className="w-full bg-orange-50/40 border border-orange-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition shadow-md shadow-orange-500/20"
                  >
                    <Send className="w-4 h-4 text-white" />
                    <span>{sending ? 'Sending...' : 'Send Message (संदेश भेजें)'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
