import React from 'react';
import {
  Compass,
  Headphones,
  Users,
  GraduationCap,
  Landmark,
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const VisionSection: React.FC = () => {
  const { profile } = useApp();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Headphones':
        return <Headphones className="w-5 h-5" />;
      case 'Users':
        return <Users className="w-5 h-5" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5" />;
      case 'Landmark':
        return <Landmark className="w-5 h-5" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5" />;
      default:
        return <Compass className="w-5 h-5" />;
    }
  };

  return (
    <section id="vision" className="py-20 bg-gradient-to-b from-white via-orange-50/30 to-white text-slate-900 border-b border-orange-200/80 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Official ABVP Emblem Watermark in the Background Corner */}
      <div className="absolute -top-10 -left-10 sm:top-6 sm:left-8 w-60 h-60 sm:w-80 sm:h-80 pointer-events-none select-none opacity-15 sm:opacity-20 z-0">
        <img
          src="/abvp-logo.png"
          alt="ABVP Official Emblem Watermark"
          className="w-full h-full object-contain -rotate-6 filter drop-shadow-[0_0_35px_rgba(249,115,22,0.25)]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold mb-3 border border-orange-300 shadow-xs">
            <Compass className="w-3.5 h-3.5 text-orange-600" />
            <span>दृष्टिकोण एवं मूल्य • Core Public Values</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            मेरा दृष्टिकोण (My Vision)
          </h2>
          <p className="mt-3 text-base text-slate-600 font-medium">
            A balanced, transparent, and grounded commitment to student welfare and public service in Mathura.
          </p>
        </div>

        {/* 6 Vision Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile.visionPoints.map((point, index) => (
            <div
              key={index}
              className="bg-white border border-orange-200 rounded-2xl p-6 hover:border-orange-400 hover:shadow-lg transition duration-300 flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-orange-100 border border-orange-200 text-orange-600 flex items-center justify-center mb-4 shadow-xs">
                  {getIcon(point.icon)}
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2.5 leading-snug">
                  {point.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {point.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-orange-100 flex items-center gap-2 text-xs text-orange-600 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" />
                <span>Pillar {index + 1} of Public Service</span>
              </div>
            </div>
          ))}
        </div>

        {/* Statement of Humility & Neutrality */}
        <div className="mt-12 max-w-3xl mx-auto p-6 rounded-2xl bg-orange-50/80 border border-orange-200 text-center space-y-2 text-xs sm:text-sm text-slate-600 shadow-xs">
          <p className="font-bold text-slate-900 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-orange-600" />
            <span>जिम्मेदारी एवं यथार्थवादी दृष्टिकोण (Realistic Public Engagement)</span>
          </p>
          <p className="leading-relaxed font-medium">
            Main kisi jaadui ya asambhav samadhan ka daawa nahi karta. Mera prayas sadhaiv
            vidyarthiyo ke sath khade hokar unke vishay ko niyamit, shanti-priya evam sansthagat
            tareeqe se sambaddh adhikaariyon tak pahunchana aur nirantar prayasrat rehna hai.
          </p>
        </div>
      </div>
    </section>
  );
};
