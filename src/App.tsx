import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { JourneySection } from './components/JourneySection';
import { ActivitiesSection } from './components/ActivitiesSection';
import { RaiseIssueSection } from './components/RaiseIssueSection';
import { GallerySection } from './components/GallerySection';
import { UpdatesSection } from './components/UpdatesSection';
import { VisionSection } from './components/VisionSection';
import { ResourcesSection } from './components/ResourcesSection';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { MobileBottomBar } from './components/MobileBottomBar';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { PolicyModals } from './components/PolicyModals';
import { IssueSubmittedPage } from './components/IssueSubmittedPage';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const ToastNotification: React.FC = () => {
  const { toast } = useApp();
  if (!toast) return null;

  return (
    <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top-3 duration-200">
      <div
        className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border text-xs sm:text-sm font-semibold text-white ${
          toast.type === 'success'
            ? 'bg-emerald-800 border-emerald-600'
            : toast.type === 'error'
            ? 'bg-red-800 border-red-600'
            : 'bg-slate-800 border-slate-600'
        }`}
      >
        {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />}
        {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-300 flex-shrink-0" />}
        {toast.type === 'info' && <Info className="w-4 h-4 text-blue-300 flex-shrink-0" />}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};

const MainContent: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-[#faf8f5] text-slate-900 selection:bg-orange-500 selection:text-white pb-16 md:pb-0 overflow-x-hidden">
      {/* Full-Page Fixed Transparent ABVP Logo Background Watermark (Center & Corners) */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none select-none z-0 flex items-center justify-center overflow-hidden"
      >
        {/* 1. Center Giant Watermark */}
        <div className="w-[360px] h-[360px] sm:w-[560px] sm:h-[560px] lg:w-[760px] lg:h-[760px] opacity-[0.08] sm:opacity-[0.10] transition-all duration-700 filter drop-shadow-[0_0_50px_rgba(249,115,22,0.2)]">
          <img
            src="/abvp-logo.png"
            alt="ABVP Official Emblem Center Watermark"
            className="w-full h-full object-contain"
          />
        </div>

        {/* 2. Top-Right Corner Watermark */}
        <div className="absolute -top-12 -right-12 sm:-top-16 sm:-right-16 w-56 h-56 sm:w-72 sm:h-72 lg:w-88 lg:h-88 opacity-[0.09] sm:opacity-[0.12] rotate-12">
          <img
            src="/abvp-logo.png"
            alt="ABVP Emblem Top Corner Watermark"
            className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(249,115,22,0.2)]"
          />
        </div>

        {/* 3. Bottom-Left Corner Watermark */}
        <div className="absolute -bottom-12 -left-12 sm:-bottom-16 sm:-left-16 w-56 h-56 sm:w-72 sm:h-72 lg:w-88 lg:h-88 opacity-[0.07] sm:opacity-[0.09] -rotate-12">
          <img
            src="/abvp-logo.png"
            alt="ABVP Emblem Bottom Corner Watermark"
            className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(249,115,22,0.2)]"
          />
        </div>

        {/* Subtle Ambient Saffron & Warm Glows behind page */}
        <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-orange-400/10 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-20 right-10 w-[600px] h-[600px] bg-amber-400/10 rounded-full blur-[160px]"></div>
      </div>

      {/* Page Content Layers (rendered cleanly over watermark) */}
      <div className="relative z-10">
        <Navbar />
        <main id="main-content">
          <HeroSection />
          <AboutSection />
          <JourneySection />
          <ActivitiesSection />
          <RaiseIssueSection />
          <GallerySection />
          <UpdatesSection />
          <VisionSection />
          <ResourcesSection />
          <FAQSection />
          <ContactSection />
        </main>
        <Footer />
        <MobileBottomBar />
      </div>

      {/* Overlays and Modals */}
      <AdminDashboardModal />
      <PolicyModals />
      <ToastNotification />
    </div>
  );
};

export default function App() {
  const [currentPath, setCurrentPath] = React.useState(() => window.location.pathname);

  React.useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const isIssueSubmitted = currentPath === '/issue-submitted' || currentPath === '/issue-submitted/';

  return (
    <AppProvider>
      {isIssueSubmitted ? <IssueSubmittedPage /> : <MainContent />}
    </AppProvider>
  );
}
