import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { JourneySection } from './components/JourneySection';
import { ActivitiesSection } from './components/ActivitiesSection';
import { StudentComplaintForm } from './components/StudentComplaintForm';
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
      {/* Clean Ambient Lighting (Strictly no watermarks or logos) */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden"
      >
        <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-orange-400/5 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-20 right-10 w-[600px] h-[600px] bg-amber-400/5 rounded-full blur-[160px]"></div>
      </div>

      {/* Page Content Layers */}
      <div className="relative z-10">
        <Navbar />
        <main id="main-content">
          <HeroSection />
          <AboutSection />
          <JourneySection />
          <ActivitiesSection />
          <StudentComplaintForm />
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
