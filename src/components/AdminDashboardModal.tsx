import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Lock,
  Search,
  Filter,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Save,
  LogOut,
  RefreshCw,
  MessageSquare,
  Sliders,
  Download,
  Compass,
  Plus,
  EyeOff,
  Check,
  Camera,
  Upload,
  Send,
  ExternalLink,
  Printer,
  Key,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import {
  SubmittedIssue,
  IssueStatus,
  IssuePriority,
  ContactMessage,
  JourneyMilestone,
  GalleryItem,
  GalleryCategory,
} from '../types';
import { useApp } from '../context/AppContext';

export const AdminDashboardModal: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    adminToken,
    setAdminToken,
    showToast,
    profile,
    updateProfile,
    journeyEntries,
    addJourneyEntry,
    updateJourneyEntry,
    deleteJourneyEntry,
    togglePublishJourneyEntry,
    galleryItems,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    togglePublishGalleryItem,
  } = useApp();

  // Login form state
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Tab: 'issues' | 'messages' | 'profile' | 'journey' | 'gallery'
  const [activeTab, setActiveTab] = useState<'issues' | 'messages' | 'profile' | 'journey' | 'gallery'>('issues');

  // Gallery Management State
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [galleryPhotoLoading, setGalleryPhotoLoading] = useState(false);
  const [galleryDragOver, setGalleryDragOver] = useState(false);
  const galleryPhotoInputRef = useRef<HTMLInputElement>(null);
  const [galleryForm, setGalleryForm] = useState<Omit<GalleryItem, 'id'>>({
    title: '',
    category: 'ABVP Activities',
    date: '2026',
    location: 'Mathura, Uttar Pradesh',
    description: '',
    imageUrl: '',
    isPublished: true,
  });

  const handleGalleryPhotoFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WEBP).', 'error');
      return;
    }
    setGalleryPhotoLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setGalleryForm((prev) => ({ ...prev, imageUrl: dataUrl }));
      setGalleryPhotoLoading(false);
    };
    reader.onerror = () => {
      showToast('Failed to read image file', 'error');
      setGalleryPhotoLoading(false);
    };
    reader.readAsDataURL(file);
  };

  // Journey Editing State
  const [editingJourneyId, setEditingJourneyId] = useState<string | null>(null);
  const [isAddingJourney, setIsAddingJourney] = useState(false);
  const [journeyForm, setJourneyForm] = useState<Omit<JourneyMilestone, 'id'>>({
    yearOrDate: '',
    title: '',
    englishLabel: '',
    description: '',
    category: 'Organisation',
    status: 'Active',
    location: 'Mathura, Uttar Pradesh',
    badge: '',
    photoUrl: '',
    isPublished: true,
    isCurrentResponsibility: false,
  });

  // Issues state
  const [issues, setIssues] = useState<SubmittedIssue[]>([]);
  const [issuesLoading, setIssuesLoading] = useState(false);
  const [counts, setCounts] = useState({
    total: 0,
    new: 0,
    underReview: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  });

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  // Selected issue for detail/edit modal
  const [selectedIssue, setSelectedIssue] = useState<SubmittedIssue | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<IssueStatus>('New');
  const [updatingPriority, setUpdatingPriority] = useState<IssuePriority>('Medium');
  const [updatingAssignedTo, setUpdatingAssignedTo] = useState('');
  const [updatingAdminNotes, setUpdatingAdminNotes] = useState('');
  const [updatingResolutionNotes, setUpdatingResolutionNotes] = useState('');
  const [isSavingIssue, setIsSavingIssue] = useState(false);
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [isResendingEmailId, setIsResendingEmailId] = useState<string | null>(null);
  const [smtpDiagnostics, setSmtpDiagnostics] = useState<{
    hasConfiguredSender: boolean;
    primaryRecipient: string;
    secondaryRecipient: string;
    lastAuthStatus: { tested: boolean; valid: boolean; error: string | null };
  } | null>(null);
  const [showSmtpConfig, setShowSmtpConfig] = useState(false);
  const [smtpEmailInput, setSmtpEmailInput] = useState('kavyanshkayasthabvp@gmail.com');
  const [smtpPassInput, setSmtpPassInput] = useState('');
  const [savingSmtp, setSavingSmtp] = useState(false);
  const [viewingMemoIssue, setViewingMemoIssue] = useState<SubmittedIssue | null>(null);

  // Contact messages state
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);

  // Profile Editor state
  const [editProfileData, setEditProfileData] = useState({
    name: profile.name,
    communitySubtitle: profile.communitySubtitle || 'कायस्थ',
    role: profile.role,
    organisation: profile.organisation,
    city: profile.city,
    hometown: profile.hometown || 'Bareilly, Uttar Pradesh, India',
    education: profile.education,
    phone: profile.phone,
    email: profile.email,
    photoUrl: profile.photoUrl,
    isPhotoLocked: profile.isPhotoLocked ?? false,
    shortIntro: profile.shortIntro,
    detailedAbout: profile.detailedAbout,
    residence: profile.residence,
    instagram: profile.socials.instagram,
    facebook: profile.socials.facebook,
    linkedin: profile.socials.linkedin,
    twitterX: profile.socials.twitterX,
  });

  const adminPhotoInputRef = useRef<HTMLInputElement>(null);
  const [pendingPhotoData, setPendingPhotoData] = useState<string | null>(null);
  const [showPhotoConfirmDialog, setShowPhotoConfirmDialog] = useState(false);
  const [isPhotoUpdating, setIsPhotoUpdating] = useState(false);

  const handleAdminPhotoPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WEBP).', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPendingPhotoData(dataUrl);
      setShowPhotoConfirmDialog(true);
    };
    reader.readAsDataURL(file);
    // reset input value so re-selecting same file triggers onChange
    e.target.value = '';
  };

  const handleConfirmReplacePhoto = async () => {
    if (!pendingPhotoData) return;
    setIsPhotoUpdating(true);
    try {
      const res = await fetch('/api/admin/profile-photo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ imageBase64: pendingPhotoData }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setEditProfileData((prev) => ({
          ...prev,
          photoUrl: data.photoUrl,
          isPhotoLocked: true,
        }));
        await updateProfile({
          photo: data.photoUrl,
          photoUrl: data.photoUrl,
          isPhotoLocked: true,
        });
        setShowPhotoConfirmDialog(false);
        setPendingPhotoData(null);
        showToast('Official profile photo replaced and updated throughout the website!', 'success');
      } else {
        showToast(data.error || 'Failed to replace profile photo', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error updating photo', 'error');
    } finally {
      setIsPhotoUpdating(false);
    }
  };

  const handleRemoveProfilePhoto = async () => {
    if (!window.confirm('Are you sure you want to remove the current profile photo?')) {
      return;
    }
    setIsPhotoUpdating(true);
    try {
      const res = await fetch('/api/admin/profile-photo', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setEditProfileData((prev) => ({
          ...prev,
          photoUrl: '',
          isPhotoLocked: false,
        }));
        await updateProfile({
          photo: '',
          photoUrl: '',
          isPhotoLocked: false,
        });
        showToast('Official profile photo removed successfully.', 'success');
      } else {
        showToast(data.error || 'Failed to remove profile photo', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error removing photo', 'error');
    } finally {
      setIsPhotoUpdating(false);
    }
  };

  // Verify or fetch data on load
  useEffect(() => {
    if (isAdminOpen && adminToken) {
      fetchIssues();
      fetchContactMessages();
      fetchSmtpStatus();
    }
  }, [isAdminOpen, adminToken, statusFilter, categoryFilter, searchTerm, dateFilter]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      localStorage.setItem('abvp_admin_token', data.token);
      setAdminToken(data.token);
      showToast('Welcome Nagar Mantri, Mathura. Admin access authorized.', 'success');
      setLoginPassword('');
    } catch (err: any) {
      showToast(err.message || 'Invalid credentials', 'error');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (adminToken) {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${adminToken}` },
        });
      }
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('abvp_admin_token');
    setAdminToken(null);
    showToast('Logged out of Admin Portal', 'info');
  };

  const fetchIssues = async () => {
    if (!adminToken) return;
    setIssuesLoading(true);

    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (searchTerm) params.append('search', searchTerm);
      if (dateFilter) params.append('date', dateFilter);

      const res = await fetch(`/api/issues?${params.toString()}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      if (res.status === 401) {
        handleLogout();
        return;
      }

      const data = await res.json();
      setIssues(data.issues || []);
      if (data.counts) {
        setCounts(data.counts);
      }
    } catch (err) {
      console.error('Error loading issues:', err);
    } finally {
      setIssuesLoading(false);
    }
  };

  const fetchContactMessages = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch('/api/contact', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setContactMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  const fetchSmtpStatus = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch('/api/admin/smtp-status', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSmtpDiagnostics(data);
      }
    } catch {
      // ignore
    }
  };

  const handleSendTestEmail = async () => {
    if (!adminToken) return;
    setIsTestingEmail(true);
    try {
      const res = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to dispatch test email');
      if (data.smtpDelivered) {
        showToast(data.message || 'सत्यापन ईमेल सफलतापूर्वक भेजा गया! kavyanshkayasthabvp@gmail.com पर इनबॉक्स चेक करें।', 'success');
      } else {
        showToast(data.message || 'सूचना: Google SMTP प्रमाणीकरण पूरा नहीं हुआ। 1-क्लिक ईमेल और व्हाट्सएप चालू है।', 'info');
      }
      fetchSmtpStatus();
    } catch (err: any) {
      showToast(err.message || 'Error sending test email', 'error');
    } finally {
      setIsTestingEmail(false);
    }
  };

  const handleSaveSmtpPassword = async () => {
    if (!adminToken) return;
    if (!smtpPassInput.trim()) {
      showToast('कृपया 16-अक्षरों का Google App Password दर्ज करें', 'error');
      return;
    }
    setSavingSmtp(true);
    try {
      const res = await fetch('/api/admin/save-smtp-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          smtpUser: smtpEmailInput.trim() || 'kavyanshkayasthabvp@gmail.com',
          smtpPass: smtpPassInput.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save App Password');
      showToast(data.message || 'Gmail SMTP पासवर्ड सफलतापूर्वक सत्यापित और सक्रिय हो गया!', 'success');
      setSmtpPassInput('');
      setShowSmtpConfig(false);
      fetchSmtpStatus();
    } catch (err: any) {
      showToast(err.message || 'SMTP Authentication failed', 'error');
    } finally {
      setSavingSmtp(false);
    }
  };

  const [isTriggeringRelay, setIsTriggeringRelay] = useState(false);
  const handleTriggerCloudRelay = async () => {
    if (!adminToken) return;
    setIsTriggeringRelay(true);
    try {
      const res = await fetch('/api/admin/trigger-cloud-relay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
      });
      const data = await res.json();
      showToast(data.message || 'क्लाउड रिले प्रेषित!', 'info');
    } catch (err: any) {
      showToast(err.message || 'Cloud Relay failed', 'error');
    } finally {
      setIsTriggeringRelay(false);
    }
  };

  const handleResendIssueEmail = async (issueId: string, ticketNumber: string) => {
    if (!adminToken) return;
    setIsResendingEmailId(issueId);
    try {
      const res = await fetch(`/api/issues/${issueId}/resend-email`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to resend issue email');
      showToast(`Ticket #${ticketNumber} का ईमेल अलर्ट पुनः भेज दिया गया है`, 'success');
      fetchIssues();
    } catch (err: any) {
      showToast(err.message || 'Failed to resend email', 'error');
    } finally {
      setIsResendingEmailId(null);
    }
  };

  const openIssueModal = (issue: SubmittedIssue) => {
    setSelectedIssue(issue);
    setUpdatingStatus(issue.status);
    setUpdatingPriority(issue.priority);
    setUpdatingAssignedTo(issue.assignedTo || '');
    setUpdatingAdminNotes(issue.adminNotes || '');
    setUpdatingResolutionNotes(issue.resolutionNotes || '');
  };

  const saveIssueUpdates = async () => {
    if (!selectedIssue || !adminToken) return;
    setIsSavingIssue(true);

    try {
      const res = await fetch(`/api/issues/${selectedIssue.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          status: updatingStatus,
          priority: updatingPriority,
          assignedTo: updatingAssignedTo,
          adminNotes: updatingAdminNotes,
          resolutionNotes: updatingResolutionNotes,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update issue');
      }

      showToast(`Issue ${selectedIssue.ticketNumber} updated successfully`, 'success');
      setSelectedIssue(null);
      fetchIssues();
    } catch (err: any) {
      showToast(err.message || 'Update failed', 'error');
    } finally {
      setIsSavingIssue(false);
    }
  };

  const markResolved = async (issueId: string) => {
    if (!adminToken) return;
    try {
      await fetch(`/api/issues/${issueId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          status: 'Resolved',
          resolutionNotes: 'Resolved by Nagar Mantri grievance desk on ' + new Date().toLocaleDateString(),
        }),
      });
      showToast('Issue marked as Resolved', 'success');
      fetchIssues();
      if (selectedIssue && selectedIssue.id === issueId) {
        setSelectedIssue(null);
      }
    } catch (e) {
      showToast('Failed to mark resolved', 'error');
    }
  };

  const deleteIssue = async (id: string, ticketNumber: string) => {
    if (!adminToken) return;
    if (!window.confirm(`Are you sure you want to delete grievance ${ticketNumber}? This action is irreversible.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/issues/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      if (res.ok) {
        showToast(`Issue ${ticketNumber} deleted`, 'info');
        setSelectedIssue(null);
        fetchIssues();
      }
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await updateProfile({
      name: editProfileData.name,
      communitySubtitle: editProfileData.communitySubtitle,
      role: editProfileData.role,
      organisation: editProfileData.organisation,
      city: editProfileData.city,
      hometown: editProfileData.hometown,
      education: editProfileData.education,
      phone: editProfileData.phone,
      email: editProfileData.email,
      photo: editProfileData.photoUrl,
      photoUrl: editProfileData.photoUrl,
      isPhotoLocked: editProfileData.isPhotoLocked,
      photoLockedAt: editProfileData.isPhotoLocked ? (profile.photoLockedAt || new Date().toISOString()) : undefined,
      shortIntro: editProfileData.shortIntro,
      detailedAbout: editProfileData.detailedAbout,
      residence: editProfileData.residence,
      socials: {
        instagram: editProfileData.instagram,
        facebook: editProfileData.facebook,
        linkedin: editProfileData.linkedin,
        twitterX: editProfileData.twitterX,
      },
    });

    if (ok) {
      showToast('Profile configuration updated and saved to database', 'success');
    }
  };

  if (!isAdminOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-6xl max-h-[95vh] flex flex-col shadow-2xl text-white overflow-hidden">
        {/* Modal Top Bar */}
        <div className="p-4 sm:px-6 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Nagar Mantri Admin Portal</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  Mathura
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Secure Grievance Management, Messages & Profile Control
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {adminToken && (
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {!adminToken ? (
            /* Login Form */
            <div className="max-w-md mx-auto py-12 px-4 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center mx-auto">
                  <Lock className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-white">Admin Authentication</h4>
                <p className="text-xs text-slate-400">
                  Enter your administrative credentials to manage student grievances and portal data.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                    Admin Username
                  </label>
                  <input
                    type="text"
                    required
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-[11px] text-orange-300">
                  <p className="font-semibold">Setup / Default Credentials:</p>
                  <p>Username: <code className="text-white font-mono">admin</code> | Password: <code className="text-white font-mono">abvp@mathura2026</code></p>
                  <p className="text-slate-400 mt-0.5">(Configurable anytime in <code className="text-slate-300">.env</code> or via environment variables)</p>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-2.5 rounded-xl text-sm transition shadow"
                >
                  {loginLoading ? 'Authenticating...' : 'Sign In to Admin Dashboard'}
                </button>
              </form>
            </div>
          ) : (
            /* Logged-in Dashboard */
            <div className="space-y-6">
              {/* Navigation Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('issues')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                      activeTab === 'issues'
                        ? 'bg-orange-600 text-white shadow'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Student Issues ({counts.total})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('messages')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                      activeTab === 'messages'
                        ? 'bg-orange-600 text-white shadow'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Contact Inquiries ({contactMessages.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                      activeTab === 'profile'
                        ? 'bg-orange-600 text-white shadow'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Sliders className="w-4 h-4" />
                    <span>Edit Profile Data</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('journey')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                      activeTab === 'journey'
                        ? 'bg-orange-600 text-white shadow'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Compass className="w-4 h-4" />
                    <span>Manage Journey ({journeyEntries.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('gallery')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                      activeTab === 'gallery'
                        ? 'bg-orange-600 text-white shadow'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Camera className="w-4 h-4" />
                    <span>Manage Gallery ({galleryItems.length})</span>
                  </button>
                </div>

                <button
                  onClick={fetchIssues}
                  className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition"
                  title="Refresh data"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>
              </div>

              {/* TAB 1: ISSUES MANAGEMENT */}
              {activeTab === 'issues' && (
                <div className="space-y-6">
                  {/* Email Alert System Banner */}
                  <div className="bg-gradient-to-r from-orange-950/60 via-slate-900 to-amber-950/40 border border-orange-500/40 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 flex-shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-white uppercase tracking-wider">ईमेल अधिसूचना प्रणाली (Email Dispatch Pipeline)</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {smtpDiagnostics?.lastAuthStatus?.valid ? 'SMTP Live & Verified' : 'Portal Storage & 1-Click Alert Active'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          New grievances are dispatched to: <strong className="text-orange-300">{smtpDiagnostics?.primaryRecipient || 'kavyanshkayasthabvp@gmail.com'}</strong>
                          {smtpDiagnostics?.secondaryRecipient && (
                            <> &amp; <strong className="text-orange-300">{smtpDiagnostics.secondaryRecipient}</strong></>
                          )}
                        </p>
                        {smtpDiagnostics?.lastAuthStatus?.tested && !smtpDiagnostics.lastAuthStatus.valid && (
                          <p className="text-[11px] text-amber-400/90 mt-1">
                            ℹ️ Google SMTP नोट: Google ने पासवर्ड अस्वीकार किया (BadCredentials)। सीधे बैकग्राउंड SMTP हेतु Google Account में 16-अक्षरों का नया App Password बनाएं। पोर्टल डाटा व 1-क्लिक अलर्ट पूरी तरह सुरक्षित हैं।
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setShowSmtpConfig(!showSmtpConfig)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition shadow-xs"
                      >
                        <Key className="w-3.5 h-3.5 text-orange-400" />
                        <span>{showSmtpConfig ? 'Hide SMTP Setup' : 'Configure App Password'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleTriggerCloudRelay}
                        disabled={isTriggeringRelay}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold transition shadow-xs"
                        title="Send test via FormSubmit Cloud Relay directly to kavyanshkayasthabvp@gmail.com"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>{isTriggeringRelay ? 'Dispatching...' : 'Cloud Relay Test'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSendTestEmail}
                        disabled={isTestingEmail}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-xs font-bold transition shadow-xs"
                        title="Send a verification test email"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isTestingEmail ? 'Sending Test...' : 'Send Test Email (टेस्ट ईमेल)'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Collapsible SMTP 16-Letter App Password Config Form */}
                  {showSmtpConfig && (
                    <div className="bg-slate-900 border border-orange-500/50 rounded-xl p-4 sm:p-5 space-y-4 animate-in fade-in duration-200">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Key className="w-4 h-4 text-orange-400" />
                          <h4 className="text-xs sm:text-sm font-bold text-white">
                            Google Gmail 16-अक्षर App Password सेटअप (Direct Background SMTP)
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowSmtpConfig(false)}
                          className="text-slate-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        यदि आप चाहते हैं कि छात्र द्वारा फॉर्म भरते ही Google के बैकग्राउंड सर्वर से सीधे <strong>kavyanshkayasthabvp@gmail.com</strong> पर ईमेल आ जाए, तो अपने Google Account से 16-अक्षर का <strong>App Password</strong> नीचे दर्ज करें:
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-5">
                          <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                            Gmail ID (ईमेल आईडी)
                          </label>
                          <input
                            type="email"
                            value={smtpEmailInput}
                            onChange={(e) => setSmtpEmailInput(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                          />
                        </div>

                        <div className="sm:col-span-5">
                          <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                            16-अक्षरों का Google App Password (e.g. abcd efgh ijkl mnop)
                          </label>
                          <input
                            type="password"
                            placeholder="xxxx xxxx xxxx xxxx"
                            value={smtpPassInput}
                            onChange={(e) => setSmtpPassInput(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                          />
                        </div>

                        <div className="sm:col-span-2 flex items-end">
                          <button
                            type="button"
                            disabled={savingSmtp || !smtpPassInput.trim()}
                            onClick={handleSaveSmtpPassword}
                            className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 shadow"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>{savingSmtp ? 'Saving...' : 'Save & Verify'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Google Quick Help */}
                      <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
                        <div className="font-bold text-slate-300">16-अक्षर App Password कैसे प्राप्त करें (How to get in 30 seconds):</div>
                        <ol className="list-decimal list-inside space-y-0.5 text-slate-400">
                          <li>Google Account खोलें (<a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="text-orange-400 underline">myaccount.google.com/apppasswords</a>)</li>
                          <li>App का नाम दर्ज करें (जैसे: <strong>ABVP Portal</strong>) और <strong>Create</strong> पर क्लिक करें।</li>
                          <li>दिखाई देने वाला 16-अक्षरों का कोड ऊपर बॉक्स में पेस्ट कर <strong>Save &amp; Verify</strong> दबाएं।</li>
                        </ol>
                      </div>
                    </div>
                  )}

                  {/* Dashboard Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-xl">
                      <p className="text-xs text-slate-400 font-medium">Total Issues</p>
                      <p className="text-2xl font-extrabold text-white mt-1">{counts.total}</p>
                    </div>
                    <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-xl">
                      <p className="text-xs text-amber-400 font-medium">New</p>
                      <p className="text-2xl font-extrabold text-amber-300 mt-1">{counts.new}</p>
                    </div>
                    <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-xl">
                      <p className="text-xs text-blue-400 font-medium">In Progress</p>
                      <p className="text-2xl font-extrabold text-blue-300 mt-1">{counts.inProgress}</p>
                    </div>
                    <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-xl">
                      <p className="text-xs text-emerald-400 font-medium">Resolved</p>
                      <p className="text-2xl font-extrabold text-emerald-300 mt-1">{counts.resolved}</p>
                    </div>
                    <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-xl col-span-2 sm:col-span-1">
                      <p className="text-xs text-slate-400 font-medium">Closed</p>
                      <p className="text-2xl font-extrabold text-slate-300 mt-1">{counts.closed}</p>
                    </div>
                  </div>

                  {/* Search and Filters Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-700">
                    <div className="sm:col-span-4 relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Search ticket, name, phone, title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                      >
                        <option value="all">All Statuses</option>
                        <option value="New">New</option>
                        <option value="Under Review">Under Review</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                      >
                        <option value="all">All Categories</option>
                        <option value="Student Issue">Student Issue</option>
                        <option value="College/University Issue">College/University Issue</option>
                        <option value="Education">Education</option>
                        <option value="Scholarship">Scholarship</option>
                        <option value="Hostel">Hostel</option>
                        <option value="Examination">Examination</option>
                        <option value="Documentation">Documentation</option>
                        <option value="Youth Issue">Youth Issue</option>
                        <option value="Local Civic Issue">Local Civic Issue</option>
                        <option value="Public Service">Public Service</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  {/* Issues Table */}
                  <div className="border border-slate-700 rounded-xl overflow-hidden bg-slate-900/90 shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-slate-800 text-slate-200 uppercase font-semibold border-b border-slate-700">
                          <tr>
                            <th className="px-3 py-3">ID / Date</th>
                            <th className="px-3 py-3">Name</th>
                            <th className="px-3 py-3">Category</th>
                            <th className="px-3 py-3">Location</th>
                            <th className="px-3 py-3">Issue Title</th>
                            <th className="px-3 py-3">Status</th>
                            <th className="px-3 py-3">Priority</th>
                            <th className="px-3 py-3">Assigned To</th>
                            <th className="px-3 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {issuesLoading ? (
                            <tr>
                              <td colSpan={9} className="text-center py-8 text-slate-400">
                                Loading issues...
                              </td>
                            </tr>
                          ) : issues.length === 0 ? (
                            <tr>
                              <td colSpan={9} className="text-center py-8 text-slate-400">
                                No grievances found matching current filters.
                              </td>
                            </tr>
                          ) : (
                            issues.map((issue) => (
                              <tr key={issue.id} className="hover:bg-slate-800/50 transition">
                                <td className="px-3 py-3 whitespace-nowrap">
                                  <div className="font-mono font-bold text-orange-400">
                                    {issue.ticketNumber}
                                  </div>
                                  <div className="text-[10px] text-slate-400">
                                    {new Date(issue.createdAt).toLocaleDateString()}
                                  </div>
                                </td>

                                <td className="px-3 py-3 whitespace-nowrap">
                                  <div className="font-semibold text-white">{issue.fullName}</div>
                                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                                    <Phone className="w-3 h-3 text-slate-500" />
                                    <span>{issue.mobile}</span>
                                  </div>
                                </td>

                                <td className="px-3 py-3 whitespace-nowrap">
                                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[11px]">
                                    {issue.category}
                                  </span>
                                </td>

                                <td className="px-3 py-3 max-w-[140px] truncate">
                                  <span className="text-slate-300">{issue.areaLocality || issue.city}</span>
                                </td>

                                <td className="px-3 py-3 max-w-xs truncate">
                                  <div className="font-medium text-slate-200 truncate">{issue.title}</div>
                                  <div className="text-[10px] text-slate-400 truncate">{issue.description}</div>
                                </td>

                                <td className="px-3 py-3 whitespace-nowrap">
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                                      issue.status === 'New'
                                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                        : issue.status === 'In Progress'
                                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                        : issue.status === 'Resolved'
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                        : issue.status === 'Under Review'
                                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                        : 'bg-slate-700 text-slate-400'
                                    }`}
                                  >
                                    {issue.status}
                                  </span>
                                </td>

                                <td className="px-3 py-3 whitespace-nowrap">
                                  <span
                                    className={`text-[11px] font-semibold ${
                                      issue.priority === 'Urgent' || issue.priority === 'High'
                                        ? 'text-red-400'
                                        : issue.priority === 'Medium'
                                        ? 'text-amber-400'
                                        : 'text-slate-400'
                                    }`}
                                  >
                                    {issue.priority}
                                  </span>
                                </td>

                                <td className="px-3 py-3 whitespace-nowrap text-slate-300">
                                  {issue.assignedTo || 'Unassigned'}
                                </td>

                                <td className="px-3 py-3 whitespace-nowrap text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => setViewingMemoIssue(issue)}
                                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-600 text-slate-300 hover:text-white transition"
                                      title="अधिकृत शिकायत प्रपत्र / लेटरहेड देखें (Official ABVP Memo)"
                                    >
                                      <Printer className="w-3.5 h-3.5 text-amber-400" />
                                    </button>

                                    <button
                                      onClick={() => handleResendIssueEmail(issue.id, issue.ticketNumber)}
                                      disabled={isResendingEmailId === issue.id}
                                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-orange-600 text-slate-300 hover:text-white transition disabled:opacity-50"
                                      title="Resend email alert to kavyanshkayasthabvp@gmail.com"
                                    >
                                      <Mail className="w-3.5 h-3.5 text-orange-400" />
                                    </button>

                                    <button
                                      onClick={() => openIssueModal(issue)}
                                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-orange-600 text-slate-300 hover:text-white transition"
                                      title="View & Edit Issue"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </button>

                                    {issue.status !== 'Resolved' && (
                                      <button
                                        onClick={() => markResolved(issue.id)}
                                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white transition"
                                        title="Mark Resolved"
                                      >
                                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                                      </button>
                                    )}

                                    <button
                                      onClick={() => deleteIssue(issue.id, issue.ticketNumber)}
                                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white transition"
                                      title="Delete Record"
                                    >
                                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CONTACT MESSAGES */}
              {activeTab === 'messages' && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-200">Public Contact Messages</h4>
                  <div className="space-y-3">
                    {contactMessages.length === 0 ? (
                      <p className="text-xs text-slate-400 py-6 text-center">No messages received yet.</p>
                    ) : (
                      contactMessages.map((msg) => (
                        <div key={msg.id} className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">{msg.name}</span>
                              <span className="text-xs text-slate-400">({msg.contact})</span>
                              <span className="text-[10px] text-slate-500">
                                {new Date(msg.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-orange-400">{msg.subject}</p>
                            <p className="text-xs text-slate-300">{msg.message}</p>
                          </div>
                          <a
                            href={`tel:${msg.contact}`}
                            className="text-xs bg-slate-700 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg transition"
                          >
                            Contact
                          </a>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: LIVE PROFILE CONFIGURATION EDITOR */}
              {activeTab === 'profile' && (
                <div className="max-w-3xl mx-auto space-y-6">
                  <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-xl text-xs text-orange-200">
                    <p className="font-bold mb-1">Centralized Profile Data Editor</p>
                    <p>
                      You can change your public name, photo, phone, email, and bio right here.
                      Changes update immediately and persist across sessions.
                    </p>
                  </div>

                  <form onSubmit={handleProfileSave} className="space-y-4 bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={editProfileData.name}
                          onChange={(e) => setEditProfileData({ ...editProfileData, name: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                          Community Subtitle (e.g. कायस्थ)
                        </label>
                        <input
                          type="text"
                          value={editProfileData.communitySubtitle}
                          onChange={(e) => setEditProfileData({ ...editProfileData, communitySubtitle: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                          City / Region (Current Location)
                        </label>
                        <input
                          type="text"
                          value={editProfileData.city}
                          onChange={(e) => setEditProfileData({ ...editProfileData, city: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                          Hometown (गृह नगर)
                        </label>
                        <input
                          type="text"
                          value={editProfileData.hometown}
                          onChange={(e) => setEditProfileData({ ...editProfileData, hometown: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                          Public Role
                        </label>
                        <input
                          type="text"
                          value={editProfileData.role}
                          onChange={(e) => setEditProfileData({ ...editProfileData, role: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                          Organisation
                        </label>
                        <input
                          type="text"
                          value={editProfileData.organisation}
                          onChange={(e) => setEditProfileData({ ...editProfileData, organisation: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                          Phone (Public)
                        </label>
                        <input
                          type="text"
                          value={editProfileData.phone}
                          onChange={(e) => setEditProfileData({ ...editProfileData, phone: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={editProfileData.email}
                          onChange={(e) => setEditProfileData({ ...editProfileData, email: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    {/* Admin Profile Settings -> Profile Photo Section */}
                    <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">
                              Profile Settings
                            </span>
                            <span className="text-slate-500">→</span>
                            <span className="text-xs font-bold text-white">
                              Profile Photo
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Server-authorized administrative photo control. Public visitors have strictly read-only access.
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <input
                            type="file"
                            ref={adminPhotoInputRef}
                            accept="image/*"
                            onChange={handleAdminPhotoPick}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => adminPhotoInputRef.current?.click()}
                            disabled={isPhotoUpdating}
                            className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>{editProfileData.photoUrl ? 'Replace Profile Photo' : 'Upload Profile Photo'}</span>
                          </button>

                          {editProfileData.photoUrl && (
                            <button
                              type="button"
                              onClick={handleRemoveProfilePhoto}
                              disabled={isPhotoUpdating}
                              className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 border border-red-800/80 text-red-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove Photo</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                        <div className="relative w-24 h-28 sm:w-28 sm:h-32 rounded-xl bg-slate-950 border-2 border-slate-700 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-md">
                          {editProfileData.photoUrl ? (
                            <img
                              src={editProfileData.photoUrl}
                              alt="Active Profile Photo"
                              className="w-full h-full object-cover object-top"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center p-2 text-center text-slate-500">
                              <Camera className="w-7 h-7 text-slate-600 mb-1" />
                              <span className="text-[10px] font-semibold">No Photo</span>
                            </div>
                          )}
                          <div className="absolute top-1 left-1 bg-slate-900/80 p-0.5 rounded shadow">
                            <img src="/abvp-logo.png" alt="ABVP" className="w-3.5 h-3.5 rounded-full" />
                          </div>
                        </div>

                        <div className="flex-1 space-y-2 text-xs">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-orange-300 font-semibold text-[11px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                              <span>Official Profile Photo</span>
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                              Centralized Source: profile.photo
                            </span>
                          </div>

                          <p className="text-slate-400 leading-relaxed text-[11px]">
                            When you upload a new photo, it is verified and stored server-side as the official profile photograph and instantly synchronized across Homepage hero, About Me, Journey, and Contact areas.
                          </p>

                          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Server-Side Authorization Enforced: Public users cannot modify this photo.</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                        Short Intro Quote (Hero section)
                      </label>
                      <textarea
                        rows={2}
                        value={editProfileData.shortIntro}
                        onChange={(e) => setEditProfileData({ ...editProfileData, shortIntro: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                        Detailed About Me Narrative
                      </label>
                      <textarea
                        rows={3}
                        value={editProfileData.detailedAbout}
                        onChange={(e) => setEditProfileData({ ...editProfileData, detailedAbout: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                          Instagram Profile
                        </label>
                        <input
                          type="text"
                          value={editProfileData.instagram}
                          onChange={(e) => setEditProfileData({ ...editProfileData, instagram: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                          Facebook Profile
                        </label>
                        <input
                          type="text"
                          value={editProfileData.facebook}
                          onChange={(e) => setEditProfileData({ ...editProfileData, facebook: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow transition"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Profile Changes</span>
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 4: JOURNEY TIMELINE MANAGEMENT */}
              {activeTab === 'journey' && (
                <div className="space-y-6">
                  {/* Top Header & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
                    <div>
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <Compass className="w-4 h-4 text-orange-400" />
                        <span>Timeline & Milestones (मेरी संगठनात्मक यात्रा)</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Add, edit, publish/unpublish, or remove milestones from your public journey section.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setIsAddingJourney(true);
                        setEditingJourneyId(null);
                        setJourneyForm({
                          yearOrDate: '',
                          title: '',
                          englishLabel: '',
                          description: '',
                          category: 'Organisation',
                          status: 'Active',
                          location: 'Mathura, Uttar Pradesh',
                          badge: '',
                          photoUrl: '',
                          isPublished: true,
                          isCurrentResponsibility: false,
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow transition flex-shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Milestone</span>
                    </button>
                  </div>

                  {/* Add / Edit Form Modal/Drawer */}
                  {(isAddingJourney || editingJourneyId) && (
                    <div className="bg-slate-900 border border-orange-500/50 rounded-2xl p-6 shadow-xl space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <h5 className="text-sm font-bold text-white flex items-center gap-2">
                          <Edit className="w-4 h-4 text-orange-400" />
                          <span>
                            {isAddingJourney ? 'Add New Milestone' : 'Edit Journey Milestone'}
                          </span>
                        </h5>
                        <button
                          onClick={() => {
                            setIsAddingJourney(false);
                            setEditingJourneyId(null);
                          }}
                          className="text-slate-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        {/* Date */}
                        <div>
                          <label className="block font-semibold text-slate-300 uppercase mb-1">
                            Date / Timeline Label <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={journeyForm.yearOrDate}
                            onChange={(e) => setJourneyForm({ ...journeyForm, yearOrDate: e.target.value })}
                            placeholder="e.g. June 2026, 9 September 2026"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                          />
                        </div>

                        {/* Title (Hindi) */}
                        <div>
                          <label className="block font-semibold text-slate-300 uppercase mb-1">
                            Title (Hindi) <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={journeyForm.title}
                            onChange={(e) => setJourneyForm({ ...journeyForm, title: e.target.value })}
                            placeholder="e.g. नगर मंत्री, मथुरा"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-hindi"
                          />
                        </div>

                        {/* English Label */}
                        <div>
                          <label className="block font-semibold text-slate-300 uppercase mb-1">
                            English Label
                          </label>
                          <input
                            type="text"
                            value={journeyForm.englishLabel || ''}
                            onChange={(e) => setJourneyForm({ ...journeyForm, englishLabel: e.target.value })}
                            placeholder="e.g. Current Responsibility, ABVP Journey Begins"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                          />
                        </div>

                        {/* Category */}
                        <div>
                          <label className="block font-semibold text-slate-300 uppercase mb-1">
                            Category
                          </label>
                          <select
                            value={journeyForm.category}
                            onChange={(e) => setJourneyForm({ ...journeyForm, category: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                          >
                            <option value="ABVP Journey">ABVP Journey</option>
                            <option value="Organisation">Organisation</option>
                            <option value="Organisational Journey">Organisational Journey</option>
                            <option value="Current Responsibility">Current Responsibility</option>
                            <option value="Present">Present</option>
                            <option value="Student Welfare">Student Welfare</option>
                          </select>
                        </div>

                        {/* Status Label */}
                        <div>
                          <label className="block font-semibold text-slate-300 uppercase mb-1">
                            Status / Pill Text
                          </label>
                          <input
                            type="text"
                            value={journeyForm.status || ''}
                            onChange={(e) => setJourneyForm({ ...journeyForm, status: e.target.value })}
                            placeholder="e.g. Journey Begins, CURRENT, Active"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                          />
                        </div>

                        {/* Location */}
                        <div>
                          <label className="block font-semibold text-slate-300 uppercase mb-1">
                            Location (Optional)
                          </label>
                          <input
                            type="text"
                            value={journeyForm.location || ''}
                            onChange={(e) => setJourneyForm({ ...journeyForm, location: e.target.value })}
                            placeholder="e.g. Mathura, Uttar Pradesh"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                          />
                        </div>

                        {/* Photo URL */}
                        <div className="sm:col-span-2">
                          <label className="block font-semibold text-slate-300 uppercase mb-1">
                            Photo / Image Attachment (URL or Base64 data)
                          </label>
                          <input
                            type="text"
                            value={journeyForm.photoUrl || ''}
                            onChange={(e) => setJourneyForm({ ...journeyForm, photoUrl: e.target.value })}
                            placeholder="https://... or data:image/..."
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                          />
                        </div>

                        {/* Description (Hindi) */}
                        <div className="sm:col-span-2">
                          <label className="block font-semibold text-slate-300 uppercase mb-1">
                            Description (Hindi) <span className="text-red-400">*</span>
                          </label>
                          <textarea
                            rows={3}
                            value={journeyForm.description}
                            onChange={(e) => setJourneyForm({ ...journeyForm, description: e.target.value })}
                            placeholder="संगठनात्मक यात्रा का विवरण..."
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-hindi leading-relaxed"
                          />
                        </div>

                        {/* Toggles: Current Responsibility & Published */}
                        <div className="sm:col-span-2 flex flex-wrap items-center gap-6 pt-2">
                          <label className="inline-flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(journeyForm.isCurrentResponsibility)}
                              onChange={(e) =>
                                setJourneyForm({
                                  ...journeyForm,
                                  isCurrentResponsibility: e.target.checked,
                                  badge: e.target.checked ? 'वर्तमान दायित्व' : journeyForm.badge,
                                })
                              }
                              className="rounded border-slate-700 bg-slate-800 text-orange-600 focus:ring-orange-500 w-4 h-4"
                            />
                            <span className="text-xs text-white font-semibold">
                              Highlight as Current Responsibility (वर्तमान दायित्व — Saffron Accent)
                            </span>
                          </label>

                          <label className="inline-flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={journeyForm.isPublished !== false}
                              onChange={(e) =>
                                setJourneyForm({ ...journeyForm, isPublished: e.target.checked })
                              }
                              className="rounded border-slate-700 bg-slate-800 text-orange-600 focus:ring-orange-500 w-4 h-4"
                            />
                            <span className="text-xs text-slate-300">
                              Published on Public Website
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingJourney(false);
                            setEditingJourneyId(null);
                          }}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl text-slate-300"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (!journeyForm.yearOrDate.trim() || !journeyForm.title.trim()) {
                              showToast('Please enter both date and title', 'error');
                              return;
                            }
                            if (editingJourneyId) {
                              await updateJourneyEntry(editingJourneyId, journeyForm);
                              setEditingJourneyId(null);
                            } else {
                              await addJourneyEntry(journeyForm);
                              setIsAddingJourney(false);
                            }
                          }}
                          className="inline-flex items-center gap-1.5 px-5 py-2 bg-orange-600 hover:bg-orange-500 text-xs font-bold text-white rounded-xl shadow"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{editingJourneyId ? 'Save Changes' : 'Create Milestone'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* List of Milestones */}
                  <div className="space-y-3">
                    {journeyEntries.map((item, index) => {
                      const isCurrent =
                        item.isCurrentResponsibility ||
                        item.status === 'CURRENT' ||
                        item.title.includes('नगर मंत्री');

                      return (
                        <div
                          key={item.id || index}
                          className={`p-4 rounded-xl border transition-all ${
                            isCurrent
                              ? 'bg-slate-800/90 border-orange-500/70 shadow-md'
                              : 'bg-slate-800/50 border-slate-700/80 hover:border-slate-600'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-slate-900 text-orange-400 border border-slate-700">
                                  {item.yearOrDate}
                                </span>
                                {item.englishLabel && (
                                  <span className="text-xs font-semibold text-slate-400">
                                    • {item.englishLabel}
                                  </span>
                                )}
                                {isCurrent && (
                                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-orange-600 text-white">
                                    वर्तमान दायित्व (CURRENT)
                                  </span>
                                )}
                                {item.isPublished === false && (
                                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-red-900/60 text-red-200 border border-red-700/50 flex items-center gap-1">
                                    <EyeOff className="w-3 h-3" />
                                    <span>Unpublished (Hidden)</span>
                                  </span>
                                )}
                              </div>

                              <h5 className="text-base font-bold text-white font-hindi">
                                {item.title}
                              </h5>

                              <p className="text-xs text-slate-300 font-hindi leading-relaxed line-clamp-2">
                                {item.description}
                              </p>
                            </div>

                            {/* Actions Column */}
                            <div className="flex items-center gap-2 flex-shrink-0 pt-2 sm:pt-0">
                              {/* Toggle Publish */}
                              <button
                                onClick={() => togglePublishJourneyEntry(item.id)}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1 transition ${
                                  item.isPublished === false
                                    ? 'bg-slate-700 border-slate-600 text-slate-300 hover:text-white'
                                    : 'bg-emerald-900/30 border-emerald-700/50 text-emerald-300 hover:bg-emerald-900/50'
                                }`}
                                title={item.isPublished === false ? 'Click to Publish' : 'Click to Hide'}
                              >
                                {item.isPublished === false ? (
                                  <>
                                    <EyeOff className="w-3.5 h-3.5" />
                                    <span>Hidden</span>
                                  </>
                                ) : (
                                  <>
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Live</span>
                                  </>
                                )}
                              </button>

                              {/* Edit */}
                              <button
                                onClick={() => {
                                  setEditingJourneyId(item.id);
                                  setIsAddingJourney(false);
                                  setJourneyForm({
                                    yearOrDate: item.yearOrDate,
                                    title: item.title,
                                    englishLabel: item.englishLabel || '',
                                    description: item.description,
                                    category: item.category || 'Organisation',
                                    status: item.status || 'Active',
                                    location: item.location || 'Mathura, Uttar Pradesh',
                                    badge: item.badge || '',
                                    photoUrl: item.photoUrl || '',
                                    isPublished: item.isPublished !== false,
                                    isCurrentResponsibility: Boolean(item.isCurrentResponsibility),
                                  });
                                }}
                                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-white flex items-center gap-1 transition"
                              >
                                <Edit className="w-3.5 h-3.5 text-orange-400" />
                                <span>Edit</span>
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => {
                                  if (confirm(`Remove timeline entry "${item.title}"?`)) {
                                    deleteJourneyEntry(item.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg text-xs text-red-400 hover:text-red-200 hover:bg-red-500/20 transition"
                                title="Delete entry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 5: OFFICIAL ACTIVITY GALLERY MANAGEMENT */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  {/* Top Header & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
                    <div>
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <Camera className="w-4 h-4 text-orange-400" />
                        <span>Official Activity Gallery (गतिविधियों की तस्वीरें)</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Upload and manage authentic photographs of public-service moments and student initiatives. Published photos appear publicly on the website.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setIsAddingGallery(true);
                        setEditingGalleryId(null);
                        setGalleryForm({
                          title: '',
                          category: 'ABVP Activities',
                          date: '2026',
                          location: 'Mathura, Uttar Pradesh',
                          description: '',
                          imageUrl: '',
                          isPublished: true,
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow transition flex-shrink-0 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Activity Photo</span>
                    </button>
                  </div>

                  {/* Add / Edit Form Modal/Drawer */}
                  {(isAddingGallery || editingGalleryId) && (
                    <div className="bg-slate-900 border border-orange-500/50 rounded-2xl p-6 shadow-xl space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <h5 className="text-sm font-bold text-white flex items-center gap-2">
                          <Edit className="w-4 h-4 text-orange-400" />
                          <span>
                            {isAddingGallery ? 'Upload New Activity Photograph' : 'Edit Activity Photograph'}
                          </span>
                        </h5>
                        <button
                          onClick={() => {
                            setIsAddingGallery(false);
                            setEditingGalleryId(null);
                          }}
                          className="text-slate-400 hover:text-white p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        {/* Title */}
                        <div className="sm:col-span-2">
                          <label className="block font-semibold text-slate-300 uppercase mb-1">
                            Activity Title <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={galleryForm.title}
                            onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                            placeholder="e.g. छात्र संवाद एवं संगठनात्मक बैठक, मथुरा"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-hindi text-sm focus:border-orange-500 focus:outline-none"
                          />
                        </div>

                        {/* Category */}
                        <div>
                          <label className="block font-semibold text-slate-300 uppercase mb-1">
                            Category <span className="text-red-400">*</span>
                          </label>
                          <select
                            value={galleryForm.category}
                            onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value as GalleryCategory })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
                          >
                            <option value="ABVP Activities">ABVP Activities</option>
                            <option value="Student Activities">Student Activities</option>
                            <option value="Public Interaction">Public Interaction</option>
                            <option value="Social Activities">Social Activities</option>
                            <option value="Events">Events</option>
                            <option value="Personal / Professional">Personal / Professional</option>
                          </select>
                        </div>

                        {/* Date */}
                        <div>
                          <label className="block font-semibold text-slate-300 uppercase mb-1">
                            Date / Timeline
                          </label>
                          <input
                            type="text"
                            value={galleryForm.date || ''}
                            onChange={(e) => setGalleryForm({ ...galleryForm, date: e.target.value })}
                            placeholder="e.g. September 2026, 2026"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
                          />
                        </div>

                        {/* Location */}
                        <div className="sm:col-span-2">
                          <label className="block font-semibold text-slate-300 uppercase mb-1">
                            Location
                          </label>
                          <input
                            type="text"
                            value={galleryForm.location || ''}
                            onChange={(e) => setGalleryForm({ ...galleryForm, location: e.target.value })}
                            placeholder="e.g. Mathura, Uttar Pradesh"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
                          />
                        </div>

                        {/* Description */}
                        <div className="sm:col-span-2">
                          <label className="block font-semibold text-slate-300 uppercase mb-1">
                            Description / Notes
                          </label>
                          <textarea
                            rows={3}
                            value={galleryForm.description || ''}
                            onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                            placeholder="Detailed notes or context regarding this activity or public interaction..."
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
                          />
                        </div>

                        {/* Photo Upload: Drag & Drop + File Picker + Instant Preview */}
                        <div className="sm:col-span-2 space-y-2">
                          <label className="block font-semibold text-slate-300 uppercase">
                            Photograph <span className="text-red-400">*</span>
                          </label>

                          <input
                            type="file"
                            ref={galleryPhotoInputRef}
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleGalleryPhotoFile(file);
                              e.target.value = '';
                            }}
                            className="hidden"
                          />

                          {galleryForm.imageUrl ? (
                            <div className="relative rounded-xl border border-slate-700 bg-slate-800/80 p-3 flex items-center gap-4">
                              <div className="w-28 h-20 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 flex-shrink-0">
                                <img
                                  src={galleryForm.imageUrl}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  <span>Image attached and ready</span>
                                </p>
                                <p className="text-[11px] text-slate-400 mt-1">
                                  Will be stored in official uploads on the server upon saving.
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => galleryPhotoInputRef.current?.click()}
                                  className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition cursor-pointer"
                                >
                                  Replace
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setGalleryForm((prev) => ({ ...prev, imageUrl: '' }))}
                                  className="p-1.5 rounded-lg bg-red-900/40 hover:bg-red-900/60 text-red-300 transition cursor-pointer"
                                  title="Remove image"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              onDragOver={(e) => {
                                e.preventDefault();
                                setGalleryDragOver(true);
                              }}
                              onDragLeave={(e) => {
                                e.preventDefault();
                                setGalleryDragOver(false);
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                setGalleryDragOver(false);
                                const file = e.dataTransfer.files?.[0];
                                if (file) handleGalleryPhotoFile(file);
                              }}
                              onClick={() => galleryPhotoInputRef.current?.click()}
                              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center ${
                                galleryDragOver
                                  ? 'border-orange-500 bg-orange-500/10'
                                  : 'border-slate-700 hover:border-orange-500/70 bg-slate-800/40 hover:bg-slate-800/80'
                              }`}
                            >
                              {galleryPhotoLoading ? (
                                <div className="flex items-center gap-2 text-orange-400 py-4">
                                  <Loader2 className="w-6 h-6 animate-spin" />
                                  <span className="font-semibold text-xs">Loading image...</span>
                                </div>
                              ) : (
                                <>
                                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center mb-2">
                                    <Upload className="w-6 h-6" />
                                  </div>
                                  <p className="text-xs font-bold text-white">
                                    Click or Drag & Drop activity photo here
                                  </p>
                                  <p className="text-[11px] text-slate-400 mt-1">
                                    Supports JPG, PNG, WEBP (Max 10MB). Image is saved to official server storage.
                                  </p>
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Publish State */}
                        <div className="sm:col-span-2 pt-2">
                          <label className="inline-flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={galleryForm.isPublished !== false}
                              onChange={(e) =>
                                setGalleryForm({ ...galleryForm, isPublished: e.target.checked })
                              }
                              className="rounded border-slate-700 bg-slate-800 text-orange-600 focus:ring-orange-500 w-4 h-4"
                            />
                            <span className="text-xs text-white font-medium">
                              Publish on public website (Visible in public Gallery)
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Form Actions */}
                      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingGallery(false);
                            setEditingGalleryId(null);
                          }}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl text-slate-300 transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (!galleryForm.title.trim()) {
                              showToast('Please enter an activity title', 'error');
                              return;
                            }
                            if (!galleryForm.imageUrl) {
                              showToast('Please upload an activity photograph', 'error');
                              return;
                            }
                            if (editingGalleryId) {
                              await updateGalleryItem(editingGalleryId, galleryForm);
                              setEditingGalleryId(null);
                            } else {
                              await addGalleryItem(galleryForm);
                              setIsAddingGallery(false);
                            }
                          }}
                          className="inline-flex items-center gap-1.5 px-5 py-2 bg-orange-600 hover:bg-orange-500 text-xs font-bold text-white rounded-xl shadow transition cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{editingGalleryId ? 'Save Changes' : 'Publish Activity Photo'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* List of Gallery Photos */}
                  {galleryItems.length === 0 ? (
                    <div className="bg-slate-800/40 border border-slate-700/80 rounded-2xl p-10 text-center space-y-3">
                      <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center mx-auto">
                        <Camera className="w-7 h-7" />
                      </div>
                      <h5 className="text-base font-bold text-white">No Gallery Photographs Yet</h5>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        The public gallery currently displays the clean empty state ("गतिविधियों की तस्वीरें जल्द उपलब्ध होंगी"). Upload verified photos here to publish them.
                      </p>
                      <button
                        onClick={() => {
                          setIsAddingGallery(true);
                          setEditingGalleryId(null);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow transition cursor-pointer mt-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Upload First Activity Photo</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {galleryItems.map((item) => (
                        <div
                          key={item.id}
                          className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between hover:border-slate-600 transition group"
                        >
                          <div className="relative aspect-video bg-slate-900 overflow-hidden">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 left-2 flex items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-950/80 text-orange-400 border border-slate-700 backdrop-blur-xs">
                                {item.category}
                              </span>
                            </div>
                            <div className="absolute top-2 right-2">
                              {item.isPublished !== false ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 backdrop-blur-xs flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  <span>Live</span>
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950/80 text-slate-400 border border-slate-700 backdrop-blur-xs flex items-center gap-1">
                                  <EyeOff className="w-3 h-3" />
                                  <span>Hidden</span>
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                {item.date && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-orange-400" />
                                    <span>{item.date}</span>
                                  </span>
                                )}
                                {item.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-orange-400" />
                                    <span className="truncate max-w-[140px]">{item.location}</span>
                                  </span>
                                )}
                              </div>

                              <h5 className="text-sm font-bold text-white font-hindi line-clamp-2">
                                {item.title}
                              </h5>

                              {item.description && (
                                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                  {item.description}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-700/60 mt-3">
                              <button
                                onClick={() => togglePublishGalleryItem(item.id)}
                                className={`px-2 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1 transition cursor-pointer ${
                                  item.isPublished === false
                                    ? 'bg-slate-700 border-slate-600 text-slate-300 hover:text-white'
                                    : 'bg-emerald-900/30 border-emerald-700/50 text-emerald-300 hover:bg-emerald-900/50'
                                }`}
                                title={item.isPublished === false ? 'Click to Publish' : 'Click to Hide'}
                              >
                                {item.isPublished === false ? (
                                  <>
                                    <EyeOff className="w-3 h-3" />
                                    <span>Hidden</span>
                                  </>
                                ) : (
                                  <>
                                    <Eye className="w-3 h-3" />
                                    <span>Published</span>
                                  </>
                                )}
                              </button>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => {
                                    setEditingGalleryId(item.id);
                                    setIsAddingGallery(false);
                                    setGalleryForm({
                                      title: item.title,
                                      category: item.category,
                                      date: item.date || '',
                                      location: item.location || '',
                                      description: item.description || '',
                                      imageUrl: item.imageUrl,
                                      isPublished: item.isPublished !== false,
                                    });
                                  }}
                                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-white flex items-center gap-1 transition cursor-pointer"
                                >
                                  <Edit className="w-3 h-3 text-orange-400" />
                                  <span>Edit</span>
                                </button>

                                <button
                                  onClick={() => {
                                    if (confirm(`Delete gallery photograph "${item.title}"? This cannot be undone.`)) {
                                      deleteGalleryItem(item.id);
                                    }
                                  }}
                                  className="p-1 rounded-lg text-xs text-red-400 hover:text-red-200 hover:bg-red-500/20 transition cursor-pointer"
                                  title="Delete photo"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Issue Detailed Inspection & Management Modal */}
        {selectedIssue && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono font-bold text-orange-400">
                    {selectedIssue.ticketNumber}
                  </span>
                  <h3 className="text-lg font-bold text-white">{selectedIssue.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedIssue(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Applicant Details */}
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Applicant Name</span>
                  <span className="font-semibold text-white">{selectedIssue.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Contact Phone</span>
                  <a
                    href={`tel:${selectedIssue.mobile}`}
                    className="font-semibold text-orange-400 hover:underline"
                  >
                    {selectedIssue.mobile}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block">Preferred Contact</span>
                  <span className="text-slate-200">{selectedIssue.preferredContact}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Location / Locality</span>
                  <span className="text-slate-200">
                    {selectedIssue.areaLocality || selectedIssue.city}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Category</span>
                  <span className="text-slate-200">{selectedIssue.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Submission Date</span>
                  <span className="text-slate-200">
                    {new Date(selectedIssue.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Issue Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Full Issue Description
                </label>
                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-sm text-slate-200 leading-relaxed">
                  {selectedIssue.description}
                </div>
              </div>

              {/* Attachment if present */}
              {selectedIssue.attachment && (
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-200 truncate">
                    <FileText className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span className="truncate">{selectedIssue.attachment.name}</span>
                  </div>
                  <a
                    href={selectedIssue.attachment.dataUrl}
                    download={selectedIssue.attachment.name}
                    className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded-md text-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Attachment</span>
                  </a>
                </div>
              )}

              {/* Status, Priority & Assignment Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Status
                  </label>
                  <select
                    value={updatingStatus}
                    onChange={(e) => setUpdatingStatus(e.target.value as IssueStatus)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="New">New</option>
                    <option value="Under Review">Under Review</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Priority
                  </label>
                  <select
                    value={updatingPriority}
                    onChange={(e) => setUpdatingPriority(e.target.value as IssuePriority)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Assigned To
                  </label>
                  <input
                    type="text"
                    value={updatingAssignedTo}
                    onChange={(e) => setUpdatingAssignedTo(e.target.value)}
                    placeholder="e.g. Nagar Mantri"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Internal Notes (आंतरिक टिप्पणियां — Admin only)
                </label>
                <textarea
                  rows={2}
                  value={updatingAdminNotes}
                  onChange={(e) => setUpdatingAdminNotes(e.target.value)}
                  placeholder="Official notes on communication with college nodal officer or administration..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              {/* Resolution Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Resolution Notes (समाधान विवरण)
                </label>
                <textarea
                  rows={2}
                  value={updatingResolutionNotes}
                  onChange={(e) => setUpdatingResolutionNotes(e.target.value)}
                  placeholder="Outcome of grievance representation..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => deleteIssue(selectedIssue.id, selectedIssue.ticketNumber)}
                    className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 px-3 py-2 rounded-lg hover:bg-red-500/10 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Record</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleResendIssueEmail(selectedIssue.id, selectedIssue.ticketNumber)}
                    disabled={isResendingEmailId === selectedIssue.id}
                    className="flex items-center gap-1.5 text-xs text-orange-300 hover:text-white px-3 py-2 rounded-lg bg-orange-600/20 hover:bg-orange-600/40 border border-orange-500/30 transition disabled:opacity-50"
                    title="Resend email alert to kavyanshkayasthabvp@gmail.com"
                  >
                    <Mail className="w-3.5 h-3.5 text-orange-400" />
                    <span>{isResendingEmailId === selectedIssue.id ? 'Sending...' : 'Resend Email Alert'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewingMemoIssue(selectedIssue)}
                    className="flex items-center gap-1.5 text-xs text-amber-300 hover:text-white px-3 py-2 rounded-lg bg-amber-600/20 hover:bg-amber-600/40 border border-amber-500/30 transition"
                    title="अधिकृत शिकायत प्रपत्र / लेटरहेड देखें"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-400" />
                    <span>Official Slip</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedIssue(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isSavingIssue}
                    onClick={saveIssueUpdates}
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-xs font-bold text-white rounded-lg shadow"
                  >
                    {isSavingIssue ? 'Saving...' : 'Save Updates'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* OFFICIAL ABVP MEMO INSPECTION & PRINT MODAL */}
        {viewingMemoIssue && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/90 backdrop-blur-md">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-orange-500/40 text-slate-900">
              {/* Modal Control Bar */}
              <div className="no-print bg-slate-900 text-white px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-10">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-400" />
                  <span className="text-xs sm:text-sm font-bold">
                    अधिकृत छात्र/नागरिक शिकायत प्रपत्र • {viewingMemoIssue.ticketNumber}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold transition shadow"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewingMemoIssue(null)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Authentic ABVP Petition Letterhead Document */}
              <div id="printable-grievance-letter" className="bg-white">
                {/* Top Tricolor Ribbon */}
                <div className="h-2 w-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38]"></div>

                {/* Header */}
                <div className="bg-[#fffaf5] border-b-2 border-dashed border-orange-200 p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
                    <img
                      src="/abvp-logo.png"
                      alt="ABVP Emblem"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-orange-600 p-1 bg-white shadow-md object-contain mx-auto"
                    />

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

                    <div className="border-2 border-dashed border-orange-600 rounded-full w-24 h-24 hidden md:flex flex-col items-center justify-center text-center p-2 font-black text-[9px] text-orange-700 uppercase leading-tight bg-white shadow-xs">
                      <span>OFFICIAL</span>
                      <span className="text-xs text-orange-800">SEAL</span>
                      <span>ABVP MTH</span>
                      <span className="text-[8px] text-slate-500">2026-27</span>
                    </div>
                  </div>
                </div>

                {/* Reference ID Strip */}
                <div className="bg-slate-900 text-white px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">कार्यालय संदर्भ सं० (Reference ID):</span>
                    <span className="font-mono font-black text-sm text-white bg-orange-600 px-3 py-1 rounded tracking-wider shadow-xs">
                      {viewingMemoIssue.ticketNumber}
                    </span>
                  </div>

                  <div className="text-slate-300 text-xs">
                    पंजीकरण दिनांक: <strong className="text-white">{new Date(viewingMemoIssue.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })}</strong>
                  </div>
                </div>

                {/* Particulars & Content */}
                <div className="p-6 sm:p-8 space-y-6 text-slate-800 text-sm">
                  <div className="border-b border-slate-200 pb-4 text-xs sm:text-sm leading-relaxed">
                    <span className="text-slate-500 uppercase font-bold text-[11px] block">प्रति (To),</span>
                    <div className="font-extrabold text-slate-900 text-base mt-0.5">श्री काव्यंश कायस्थ जी</div>
                    <div className="text-slate-700 font-medium">नगर मंत्री, अखिल भारतीय विद्यार्थी परिषद (ABVP) मथुरा महानगर</div>
                    <div className="text-slate-500 text-xs">विद्यार्थी भवन, मथुरा (उ.प्र.) • ईमेल: kavyanshkayasthabvp@gmail.com</div>
                  </div>

                  <div className="bg-orange-50/80 border-l-4 border-orange-600 p-4 rounded-r-xl">
                    <span className="text-[11px] font-black text-orange-700 uppercase tracking-wider block">
                      विषय (Grievance Subject):
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-orange-950 mt-1">
                      {viewingMemoIssue.title}
                    </h3>
                    <div className="text-xs text-slate-600 mt-1 flex items-center gap-3 flex-wrap">
                      <span>समस्या श्रेणी: <strong className="text-orange-700">{viewingMemoIssue.category}</strong></span>
                      <span>•</span>
                      <span>क्षेत्र/कॉलेज: <strong className="text-slate-900">{viewingMemoIssue.areaLocality || viewingMemoIssue.city || 'मथुरा'}</strong></span>
                      <span>•</span>
                      <span>प्राथमिकता: <strong className="text-red-700">{viewingMemoIssue.priority}</strong></span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-black text-slate-700 uppercase tracking-wider">
                      [भाग 1] आवेदक / शिकायतकर्ता का अधिकृत विवरण (Applicant Particulars)
                    </div>
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                      <table className="w-full text-left text-xs border-collapse">
                        <tbody>
                          <tr className="border-b border-slate-200">
                            <td className="w-1/3 py-2.5 px-4 bg-slate-50 font-bold text-slate-600">आवेदक का पूरा नाम:</td>
                            <td className="py-2.5 px-4 font-black text-slate-900 text-sm">{viewingMemoIssue.fullName}</td>
                          </tr>
                          <tr className="border-b border-slate-200 bg-white">
                            <td className="py-2.5 px-4 bg-slate-50 font-bold text-slate-600">संपर्क मोबाइल नंबर:</td>
                            <td className="py-2.5 px-4 font-black text-orange-600">
                              <a href={`tel:${viewingMemoIssue.mobile}`} className="hover:underline">
                                {viewingMemoIssue.mobile}
                              </a>
                            </td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="py-2.5 px-4 bg-slate-50 font-bold text-slate-600">ईमेल आईडी:</td>
                            <td className="py-2.5 px-4 text-slate-800">{viewingMemoIssue.email || 'उपलब्ध नहीं'}</td>
                          </tr>
                          <tr className="border-b border-slate-200 bg-white">
                            <td className="py-2.5 px-4 bg-slate-50 font-bold text-slate-600">कॉलेज / इलाका / वार्ड:</td>
                            <td className="py-2.5 px-4 font-semibold text-slate-900">
                              {viewingMemoIssue.areaLocality || viewingMemoIssue.city || 'मथुरा'} (मथुरा)
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-4 bg-slate-50 font-bold text-slate-600">वर्तमान स्थिति:</td>
                            <td className="py-2.5 px-4 font-bold text-emerald-700">{viewingMemoIssue.status}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-black text-slate-700 uppercase tracking-wider">
                      [भाग 2] समस्या / शिकायत का संपूर्ण विवरण (Official Grievance Statement)
                    </div>
                    <div className="p-5 rounded-xl bg-orange-50/40 border border-orange-200 text-slate-900 leading-relaxed font-serif text-sm sm:text-base whitespace-pre-wrap shadow-xs">
                      {viewingMemoIssue.description}
                    </div>
                  </div>

                  {/* Sign-off & Stamp */}
                  <div className="border-t-2 border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="space-y-1 text-center sm:text-left">
                      <div className="text-xs font-black text-slate-900">अखिल भारतीय विद्यार्थी परिषद • मथुरा महानगर</div>
                      <div className="text-[11px] text-slate-500">छात्र अधिकार एवं जनसमस्या निवारण प्रकोष्ठ</div>
                      <div className="font-mono text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1 rounded inline-block">
                        AUTH-ID: ABVP-MTH-VERIFIED-{viewingMemoIssue.ticketNumber}
                      </div>
                    </div>

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

                <div className="bg-slate-100 border-t border-slate-200 px-6 py-3 text-center text-[11px] text-slate-500 font-medium">
                  यह प्रपत्र ABVP मथुरा के आधिकारिक छात्र एवं जनसमस्या निवारण पोर्टल द्वारा स्वतः उत्पन्न अधिकृत शिकायत प्रपत्र है।
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Photo Replacement Confirmation Dialog */}
        {showPhotoConfirmDialog && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400 flex-shrink-0">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Replace Profile Photo?
                  </h3>
                  <p className="text-xs text-slate-400">
                    Administrative Confirmation Required
                  </p>
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
                <p className="text-sm font-semibold text-slate-200">
                  Are you sure you want to replace the current profile photo?
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The selected image will become the official profile photo for Kavyansh Kayastha and will immediately update across all public pages (Hero, About Me, Journey, Contact).
                </p>

                {/* Photo Comparison / Preview */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">Current Photo</span>
                    <div className="w-24 h-28 rounded-lg border border-slate-700 bg-slate-900 overflow-hidden flex items-center justify-center">
                      {editProfileData.photoUrl ? (
                        <img src={editProfileData.photoUrl} alt="Current" className="w-full h-full object-cover object-top" />
                      ) : (
                        <span className="text-[10px] text-slate-500">None</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase font-bold text-orange-400 mb-1">New Photo Preview</span>
                    <div className="w-24 h-28 rounded-lg border-2 border-orange-500 bg-slate-900 overflow-hidden flex items-center justify-center shadow-md">
                      {pendingPhotoData ? (
                        <img src={pendingPhotoData} alt="New Preview" className="w-full h-full object-cover object-top" />
                      ) : (
                        <span className="text-[10px] text-slate-500">No Image</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowPhotoConfirmDialog(false);
                    setPendingPhotoData(null);
                  }}
                  disabled={isPhotoUpdating}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirmReplacePhoto}
                  disabled={isPhotoUpdating}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white transition flex items-center gap-1.5 shadow-md shadow-orange-600/30 disabled:opacity-50 cursor-pointer"
                >
                  {isPhotoUpdating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Replacing...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Replace Photo</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
