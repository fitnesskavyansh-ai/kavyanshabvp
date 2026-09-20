import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Briefcase,
  MapPin,
  Calendar,
  Compass,
  HeartHandshake,
  CheckCircle2,
  FileText,
  Building,
  Mail,
  Phone,
  Home,
  Camera,
  Copy,
  Check,
  Shield,
  ArrowUpRight,
  Lock,
  ShieldCheck,
  Instagram,
  Facebook,
  Twitter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AboutSection: React.FC = () => {
  const { profile, showToast } = useApp();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const photoSrc = profile.photo || profile.photoUrl || '/kavyansh-kayastha.jpg';

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const emailToCopy = profile.email || 'kavyanshkayasthabvp@gmail.com';
    navigator.clipboard.writeText(emailToCopy);
    setCopiedEmail(true);
    showToast('Email address copied to clipboard!', 'success');
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleCopyPhone = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const phoneToCopy = profile.phone || '6395014760';
    navigator.clipboard.writeText(phoneToCopy.replace(/\s+/g, ''));
    setCopiedPhone(true);
    showToast('Phone number copied to clipboard!', 'success');
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const hometownDisplay = profile.hometown || 'Bareilly, Uttar Pradesh, India';
  const emailDisplay = profile.email || 'kavyanshkayasthabvp@gmail.com';
  const phoneDisplay = profile.phone || '+91 63950 14760';
  const joiningDateDisplay = profile.joiningDate || 'June 2026';
  const educationDisplay = profile.education || '[COLLEGE / UNIVERSITY / COURSE]';

  return (
    <section id="about" className="py-16 sm:py-20 bg-gradient-to-b from-white via-orange-50/30 to-white border-b border-orange-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold mb-3 border border-orange-300 shadow-xs">
            <User className="w-3.5 h-3.5 text-orange-600" />
            <span>परिचय एवं संगठनात्मक विवरण • Profile & Background</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Personal & Academic Profile
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-medium font-hindi">
            काव्यांश कायस्थ • नगर मंत्री, चौमुहां–छाता–कोसी, मथुरा • अखिल भारतीय विद्यार्थी परिषद (ABVP)
          </p>
        </div>

        {/* PRIMARY SHOWCASE: PERSONAL & ACADEMIC DETAILS */}
        <div
          id="personal-details-card"
          className="relative bg-white border border-orange-200 rounded-2xl sm:rounded-3xl shadow-xs overflow-hidden mb-14"
        >
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
            {/* LEFT COLUMN: Profile Photo / Avatar & Identity Badge */}
            <div className="lg:col-span-4 bg-orange-50/40 border-b lg:border-b-0 lg:border-r border-orange-200 p-6 sm:p-8 flex flex-col items-center justify-between text-center relative">
              <div className="w-full flex flex-col items-center">
                {/* Photo or Monogram Avatar */}
                {/* Photo Avatar */}
                <div className="relative mb-5">
                  <div
                    className="relative w-44 h-52 sm:w-52 sm:h-60 rounded-2xl overflow-hidden bg-white border-2 border-orange-300 shadow-md flex flex-col items-center justify-center text-center p-2 ring-4 ring-orange-500/15"
                  >
                    <img
                      src={photoSrc}
                      alt={profile.name}
                      className="w-full h-full object-cover object-top rounded-xl"
                    />

                    {/* Subtle Badge: "Verified Official Photo" */}
                    <div className="absolute top-2 right-2 bg-slate-950/90 text-emerald-300 px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 shadow-xs border border-emerald-500/50">
                      <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                      <span>Official Photo</span>
                    </div>
                  </div>

                  {/* Role indicator pill */}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-orange-600 text-white border border-orange-400 px-3.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold whitespace-nowrap shadow-md font-hindi">
                    नगर मंत्री, चौमुहां–छाता–कोसी, मथुरा
                  </div>
                </div>

                {/* Identity Text */}
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-center gap-1.5 flex-wrap">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight font-hindi">
                      {profile.name}
                    </h3>
                  </div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 border border-orange-200 text-orange-900 text-xs font-bold font-hindi">
                    <span>{profile.communitySubtitle || 'कायस्थ'}</span>
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-orange-600 pt-1 font-hindi">
                    {profile.role || 'नगर मंत्री, चौमुहां–छाता–कोसी, मथुरा'}
                  </p>
                  <p className="text-xs text-slate-600 font-medium font-hindi">
                    {profile.organisation || 'अखिल भारतीय विद्यार्थी परिषद (ABVP)'}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium font-hindi">
                    मथुरा, उत्तर प्रदेश
                  </p>
                </div>
              </div>

              {/* Quick Actions in Left Column */}
              <div className="w-full pt-6 mt-6 border-t border-orange-200 space-y-2.5">
                <a
                  href={`mailto:${emailDisplay}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md shadow-orange-500/20 transition"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Me Directly</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <a
                  href={`tel:${(profile.phone || '+916395014760').replace(/\s+/g, '')}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-orange-50 text-slate-700 border border-orange-200 font-bold text-xs py-2 px-3 rounded-xl transition shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5 text-orange-600" />
                  <span>Call Kavyansh Kayastha</span>
                </a>

                {/* Social Connect Icons */}
                <div className="pt-2 border-t border-orange-200/70">
                  <p className="text-[11px] font-bold text-slate-500 mb-1.5 text-center">Social Media</p>
                  <div className="flex items-center justify-center gap-2">
                    <a
                      href={profile.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-600 border border-pink-200 hover:border-pink-400 transition shadow-xs flex items-center justify-center"
                      title="Follow on Instagram"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                    <a
                      href={profile.socials.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 hover:border-blue-400 transition shadow-xs flex items-center justify-center"
                      title="Connect on Facebook"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                    <a
                      href={profile.socials.twitterX}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 hover:border-slate-500 transition shadow-xs flex items-center justify-center"
                      title="Follow on X (Twitter)"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Personal & Academic Details Rows */}
            <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between bg-white">
              <div>
                {/* Header with Title and Public Profile badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-orange-100 gap-2 mb-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                      <span>Personal & Academic Details</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      सार्वजनिक, शैक्षिक एवं संगठनात्मक विवरण
                    </p>
                  </div>

                  {/* Public Profile Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold w-fit shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <Shield className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Public Profile</span>
                  </div>
                </div>

                {/* Structured Information Rows */}
                <dl className="divide-y divide-orange-100 text-sm">
                  {/* 1. Full Name */}
                  <div className="py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-orange-50/40 px-2.5 rounded-lg transition">
                    <dt className="text-slate-500 font-bold flex items-center gap-2.5 text-xs sm:text-sm">
                      <div className="w-7 h-7 rounded-lg bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 flex-shrink-0 shadow-xs">
                        <User className="w-4 h-4" />
                      </div>
                      <span>Full Name</span>
                    </dt>
                    <dd className="sm:text-right font-bold text-slate-900 pl-9 sm:pl-0 flex items-center sm:justify-end gap-2 flex-wrap">
                      <span className="text-base text-slate-900">{profile.name}</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-hindi bg-orange-100 text-orange-800 border border-orange-200">
                        {profile.communitySubtitle || 'कायस्थ'}
                      </span>
                    </dd>
                  </div>

                  {/* 2. Public Role */}
                  <div className="py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-orange-50/40 px-2.5 rounded-lg transition">
                    <dt className="text-slate-500 font-bold flex items-center gap-2.5 text-xs sm:text-sm">
                      <div className="w-7 h-7 rounded-lg bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 flex-shrink-0 shadow-xs">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <span>Public Role</span>
                    </dt>
                    <dd className="sm:text-right font-bold text-orange-600 pl-9 sm:pl-0 font-hindi">
                      {profile.role || 'नगर मंत्री, चौमुहां–छाता–कोसी, मथुरा'}
                    </dd>
                  </div>

                  {/* 3. Organisation */}
                  <div className="py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-orange-50/40 px-2.5 rounded-lg transition">
                    <dt className="text-slate-500 font-bold flex items-center gap-2.5 text-xs sm:text-sm">
                      <div className="w-7 h-7 rounded-lg bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 flex-shrink-0 shadow-xs">
                        <Building className="w-4 h-4" />
                      </div>
                      <span>Organisation</span>
                    </dt>
                    <dd className="sm:text-right font-bold text-slate-800 pl-9 sm:pl-0 flex items-center justify-start sm:justify-end gap-1.5 font-hindi">
                      <span>{profile.organisation || 'अखिल भारतीय विद्यार्थी परिषद (ABVP)'}</span>
                    </dd>
                  </div>

                  {/* 4. City / Region (Current Location: Mathura) */}
                  <div className="py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-slate-50/70 px-2.5 rounded-lg transition">
                    <dt className="text-slate-500 font-medium flex items-center gap-2.5 text-xs sm:text-sm">
                      <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <span>City / Region</span>
                        <span className="text-[11px] text-slate-400 block font-normal sm:inline sm:ml-1">
                          (Current Location)
                        </span>
                      </div>
                    </dt>
                    <dd className="sm:text-right pl-9 sm:pl-0">
                      <span className="font-semibold text-slate-900 block">{profile.city}</span>
                      <span className="text-xs text-orange-700 font-medium">
                        Active Karyakshetra (कार्यक्षेत्र)
                      </span>
                    </dd>
                  </div>

                  {/* 5. Hometown (Bareilly) */}
                  <div className="py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-slate-50/70 px-2.5 rounded-lg transition">
                    <dt className="text-slate-500 font-medium flex items-center gap-2.5 text-xs sm:text-sm">
                      <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0">
                        <Home className="w-4 h-4" />
                      </div>
                      <div>
                        <span>Hometown</span>
                        <span className="text-[11px] text-slate-400 block font-normal sm:inline sm:ml-1">
                          (गृह नगर)
                        </span>
                      </div>
                    </dt>
                    <dd className="sm:text-right pl-9 sm:pl-0">
                      <span className="font-semibold text-slate-900 block">{hometownDisplay}</span>
                      <span className="text-xs text-slate-500">Native Place</span>
                    </dd>
                  </div>

                  {/* 6. Education / Course */}
                  <div className="py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-slate-50/70 px-2.5 rounded-lg transition">
                    <dt className="text-slate-500 font-medium flex items-center gap-2.5 text-xs sm:text-sm">
                      <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <span>Education / Course</span>
                    </dt>
                    <dd className="sm:text-right pl-9 sm:pl-0">
                      <span className="font-semibold text-slate-900">
                        {educationDisplay}
                      </span>
                    </dd>
                  </div>

                  {/* 7. Joined ABVP */}
                  <div className="py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-slate-50/70 px-2.5 rounded-lg transition">
                    <dt className="text-slate-500 font-medium flex items-center gap-2.5 text-xs sm:text-sm">
                      <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <span>Joined ABVP</span>
                    </dt>
                    <dd className="sm:text-right pl-9 sm:pl-0 font-semibold text-slate-900">
                      {joiningDateDisplay}
                    </dd>
                  </div>

                  {/* 8. Phone / Helpline (Clickable with tel link, call button, and copy action) */}
                  <div className="py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/70 px-2.5 rounded-lg transition">
                    <dt className="text-slate-500 font-medium flex items-center gap-2.5 text-xs sm:text-sm">
                      <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <span>Phone / Helpline</span>
                    </dt>
                    <dd className="sm:text-right pl-9 sm:pl-0 flex items-center sm:justify-end gap-2 flex-wrap">
                      <a
                        href={`tel:${phoneDisplay.replace(/\s+/g, '')}`}
                        className="group inline-flex items-center gap-1.5 font-bold text-slate-900 hover:text-orange-600 text-sm transition"
                        title="Click to call helpline"
                      >
                        <span className="tracking-wide">
                          {phoneDisplay}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md group-hover:bg-emerald-600 group-hover:text-white transition">
                          <Phone className="w-3 h-3" />
                          <span>Call Now</span>
                        </span>
                      </a>

                      <button
                        type="button"
                        onClick={handleCopyPhone}
                        className="inline-flex items-center p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition"
                        title="Copy phone number to clipboard"
                      >
                        {copiedPhone ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </dd>
                  </div>

                  {/* 9. Email (Clickable with mailto link, mail icon, and subtle Email Me action) */}
                  <div className="py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/70 px-2.5 rounded-lg transition">
                    <dt className="text-slate-500 font-medium flex items-center gap-2.5 text-xs sm:text-sm">
                      <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span>Email</span>
                    </dt>
                    <dd className="sm:text-right pl-9 sm:pl-0 flex items-center sm:justify-end gap-2 flex-wrap">
                      <a
                        href={`mailto:${emailDisplay}`}
                        className="group inline-flex items-center gap-1.5 font-medium text-blue-700 hover:text-orange-600 text-sm transition"
                        title="Click to send an email"
                      >
                        <span className="underline decoration-blue-300 underline-offset-2 group-hover:decoration-orange-500 break-all">
                          {emailDisplay}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-orange-100 text-orange-800 px-2 py-0.5 rounded-md group-hover:bg-orange-600 group-hover:text-white transition">
                          <Mail className="w-3 h-3" />
                          <span>Email Me</span>
                        </span>
                      </a>

                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        className="inline-flex items-center p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition"
                        title="Copy email to clipboard"
                      >
                        {copiedEmail ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Verified Representation Note */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <span>
                    Current Location: <strong>Mathura</strong> • Hometown: <strong>Bareilly</strong>
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  Official ABVP Karyakarta Identity
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SUPPORTING NARRATIVE & SERVICE OBJECTIVES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Biography Narrative */}
          <div className="lg:col-span-7 bg-white border border-orange-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2.5">
              <Compass className="w-5 h-5 text-orange-600" />
              <span>सार्वजनिक परिचय (Public Identity)</span>
            </h3>
            <div className="space-y-4 text-slate-700 leading-relaxed text-base">
              <p className="font-semibold text-slate-900 bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-xl">
                {profile.detailedAbout}
              </p>

              <p>
                Mera manna hai ki chhatra shakti rashtra ki sabse mukhya urja hai. Campus
                mein adhyayan kar rahe vidyarthiyo ki choti-badi samasyaon—chahe wo
                scholarship verification ho, admission process ho, ya library aur hostel
                facilities—unhe samay par sunna aur college/university prashasan tak vinamrata
                evam dridhta ke sath pahunchana meri prathmikta rahi hai.
              </p>

              <p>
                Mathura nagar mein Akhil Bharatiya Vidyarthi Parishad ke karyakarta ke roop
                mein main sabhi saathi vidyarthiyo aur yuvaon ke sath milkar ek
                sakaratmak shaikshik vatavaran banane ke liye pratibaddh hoon.
              </p>
            </div>
          </div>

          {/* Public Service Objectives */}
          <div className="lg:col-span-5 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white rounded-2xl p-6 sm:p-8 shadow-lg shadow-orange-500/20 flex flex-col justify-between border border-orange-400">
            <div>
              <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-orange-100" />
                <span>Public-Service Objectives (लोकसेवा उद्देश्य)</span>
              </h3>
              <div className="space-y-3.5 text-sm text-orange-50 font-medium">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                  <span>Chhatra samasyaon ka bina kisi pakshpaat ke nidaan prayas</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                  <span>Shaikshik schemes aur scholarships par transparent guidance</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                  <span>Yuvaon mein samajik utardayitva aur sewa bhavna ka vistar</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                  <span>College aur civil prashasan ke sath peaceful dialogue</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-orange-400/60">
              <p className="text-xs text-orange-100 leading-relaxed font-medium">
                <FileText className="w-3.5 h-3.5 text-white inline mr-1" />
                <strong className="text-white">पारदर्शिता एवं जिम्मेदारी:</strong> Sabhi karyakram vidyarthi hit aur nishkam lok-sewa ke siddhanto par aadharit hain.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
