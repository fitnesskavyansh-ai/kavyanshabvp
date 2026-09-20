import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Lock,
  LogOut,
  Plus,
  Search,
  Filter,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Upload,
  Image as ImageIcon,
  Video,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Calendar,
  X,
  ArrowLeft,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Smartphone,
  Sparkles,
  Layers,
  FileText,
  Copy,
  Check,
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { ActivityItem, ActivityCategory } from '../types';
import {
  getAllActivitiesAdmin,
  createActivity,
  updateActivity,
  deleteActivity,
  togglePublishStatus,
  uploadActivityMedia,
} from '../services/activityService';
import { isFirebaseConfigured, CONFIGURED_ADMIN_UID } from '../lib/firebase';

const CATEGORY_OPTIONS = [
  'छात्र संवाद एवं मांग पत्र (Student Dialogue & Grievances)',
  'परिसर सुविधाएं एवं आंदोलन (Campus Welfare)',
  'संगठनात्मक बैठक एवं योजना (ABVP Meeting)',
  'युवा सम्मेलन एवं करियर (Youth Conference & Career)',
  'रक्तदान एवं सामाजिक सेवा (Blood Donation & Social Service)',
  'जागरूकता एवं सांस्कृतिक कार्यक्रम (Awareness & Culture)',
  'अन्य गतिविधियाँ (Other Activities)',
];

interface UploadProgressItem {
  name: string;
  percent: number;
}

export const AdminActivityDashboard: React.FC = () => {
  const {
    user,
    isAdmin,
    loading: authLoading,
    authError,
    signIn,
    signOut,
    resetPassword,
    clearError,
    refreshClaims,
    isFirebaseAvailable,
  } = useAdminAuth();

  // Login Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [loginMessage, setLoginMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);

  // Activities Data States
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Filter & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

  // Modal / Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  const [previewActivity, setPreviewActivity] = useState<ActivityItem | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<ActivityItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('चौमुहां, मथुरा (उ.प्र.)');
  const [description, setDescription] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [photos, setPhotos] = useState<string[]>([]);
  const [video, setVideo] = useState('');
  const [manualPhotoUrl, setManualPhotoUrl] = useState('');

  // Upload Progress
  const [uploadsInProgress, setUploadsInProgress] = useState<Record<string, number>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [copiedUid, setCopiedUid] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2500);
  };

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ type, text });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Load activities once authenticated
  const loadActivities = async () => {
    if (!isAdmin) return;
    setIsLoadingActivities(true);
    setLoadError(null);
    try {
      const data = await getAllActivitiesAdmin();
      setActivities(data);
    } catch (err: any) {
      console.error('Error loading activities for admin:', err);
      setLoadError(err.message || 'Failed to load activities from Firestore');
    } finally {
      setIsLoadingActivities(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadActivities();
    }
  }, [isAdmin]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginMessage(null);
    if (!email || !password) {
      setLoginMessage({ type: 'error', text: 'Please provide both email and password.' });
      return;
    }

    setIsSubmittingLogin(true);
    try {
      await signIn(email, password);
      setLoginMessage({ type: 'success', text: 'Authentication successful! Welcome to the Admin Desk.' });
    } catch (err: any) {
      setLoginMessage({
        type: 'error',
        text: err.message || 'Login failed. Please verify credentials.',
      });
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  // Handle Password Reset
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setIsSendingReset(true);
    try {
      await resetPassword(forgotEmail);
      showToast('Password reset link sent to ' + forgotEmail, 'success');
      setShowForgotModal(false);
      setForgotEmail('');
    } catch (err: any) {
      showToast(err.message || 'Failed to send reset email', 'error');
    } finally {
      setIsSendingReset(false);
    }
  };

  // Open Create Form
  const openCreateForm = () => {
    setIsEditing(false);
    setCurrentEditId(null);
    setTitle('');
    setCategory(CATEGORY_OPTIONS[0]);
    setCustomCategory('');
    setDate(new Date().toISOString().split('T')[0]);
    setLocation('चौमुहां, मथुरा (उ.प्र.)');
    setDescription('');
    setIsPublished(true);
    setPhotos([]);
    setVideo('');
    setManualPhotoUrl('');
    setUploadsInProgress({});
    setIsModalOpen(true);
  };

  // Open Edit Form
  const openEditForm = (item: ActivityItem) => {
    setIsEditing(true);
    setCurrentEditId(item.id);
    setTitle(item.title);
    if (CATEGORY_OPTIONS.includes(item.category)) {
      setCategory(item.category);
      setCustomCategory('');
    } else {
      setCategory('Other Activities');
      setCustomCategory(item.category);
    }
    setDate(item.date);
    setLocation(item.location);
    setDescription(item.description);
    setIsPublished(Boolean(item.published));
    setPhotos(item.photos || (item.photoUrl ? [item.photoUrl] : []));
    setVideo(item.video || '');
    setManualPhotoUrl('');
    setUploadsInProgress({});
    setIsModalOpen(true);
  };

  // Handle Multiple Photo Upload
  const handlePhotoFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList: File[] = Array.from(files) as File[];
    const tempId = currentEditId || 'temp_' + Date.now();

    for (const file of fileList) {
      const uploadKey = `${file.name}_${Date.now()}`;
      setUploadsInProgress((prev) => ({ ...prev, [uploadKey]: 5 }));

      try {
        const { downloadUrl } = await uploadActivityMedia(tempId, file, (percent) => {
          setUploadsInProgress((prev) => ({ ...prev, [uploadKey]: percent }));
        });

        setPhotos((prev) => [...prev, downloadUrl]);
        showToast(`Photo "${file.name}" uploaded successfully!`, 'success');
      } catch (err: any) {
        showToast(`Failed to upload "${file.name}": ${err.message}`, 'error');
      } finally {
        setUploadsInProgress((prev) => {
          const next = { ...prev };
          delete next[uploadKey];
          return next;
        });
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle Video Upload
  const handleVideoFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const tempId = currentEditId || 'temp_' + Date.now();
    const uploadKey = `video_${file.name}`;
    setUploadsInProgress((prev) => ({ ...prev, [uploadKey]: 5 }));

    try {
      const { downloadUrl } = await uploadActivityMedia(tempId, file, (percent) => {
        setUploadsInProgress((prev) => ({ ...prev, [uploadKey]: percent }));
      });
      setVideo(downloadUrl);
      showToast(`Video "${file.name}" uploaded successfully!`, 'success');
    } catch (err: any) {
      showToast(`Failed to upload video: ${err.message}`, 'error');
    } finally {
      setUploadsInProgress((prev) => {
        const next = { ...prev };
        delete next[uploadKey];
        return next;
      });
      if (videoInputRef.current) {
        videoInputRef.current.value = '';
      }
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const addManualPhoto = () => {
    if (!manualPhotoUrl.trim()) return;
    setPhotos((prev) => [...prev, manualPhotoUrl.trim()]);
    setManualPhotoUrl('');
  };

  // Save Activity (Create or Update)
  const handleSaveActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('Please provide both Title and Description.', 'error');
      return;
    }

    const finalCategory = category === 'Other Activities' && customCategory.trim()
      ? customCategory.trim()
      : category;

    setIsSaving(true);
    try {
      if (isEditing && currentEditId) {
        await updateActivity(currentEditId, {
          title: title.trim(),
          category: finalCategory,
          date,
          location: location.trim(),
          description: description.trim(),
          published: isPublished,
          photos,
          video: video.trim(),
        });
        showToast('Activity updated successfully!', 'success');
      } else {
        await createActivity({
          title: title.trim(),
          category: finalCategory,
          date,
          location: location.trim(),
          description: description.trim(),
          published: isPublished,
          photos,
          video: video.trim(),
        });
        showToast('New activity published/created successfully!', 'success');
      }

      setIsModalOpen(false);
      await loadActivities();
    } catch (err: any) {
      console.error('Save error:', err);
      showToast(err.message || 'Failed to save activity.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Quick Toggle Publish
  const handleTogglePublish = async (item: ActivityItem) => {
    try {
      const nextStatus = await togglePublishStatus(item.id, Boolean(item.published));
      setActivities((prev) =>
        prev.map((act) =>
          act.id === item.id ? { ...act, published: nextStatus } : act
        )
      );
      showToast(
        `Activity "${item.title.substring(0, 24)}..." is now ${nextStatus ? 'PUBLISHED' : 'UNPUBLISHED (Draft)'}`,
        'success'
      );
    } catch (err: any) {
      showToast(err.message || 'Failed to toggle publish status', 'error');
    }
  };

  // Confirm Delete
  const handleDeleteActivity = async () => {
    if (!deleteConfirmItem) return;
    setIsDeleting(true);
    try {
      await deleteActivity(deleteConfirmItem.id);
      setActivities((prev) => prev.filter((act) => act.id !== deleteConfirmItem.id));
      showToast(`Activity "${deleteConfirmItem.title}" deleted from Firestore.`, 'success');
      setDeleteConfirmItem(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete activity', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered List
  const filteredActivities = activities.filter((act) => {
    const matchesSearch =
      act.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === 'All' || act.category === filterCategory;

    const matchesStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'published'
        ? act.published === true
        : act.published === false;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate statistics
  const totalCount = activities.length;
  const publishedCount = activities.filter((a) => a.published).length;
  const draftCount = totalCount - publishedCount;
  const totalMedia = activities.reduce(
    (acc, cur) => acc + (cur.photos?.length || 0) + (cur.video ? 1 : 0),
    0
  );

  // If Auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
        <div className="w-14 h-14 rounded-2xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center mb-4 animate-pulse">
          <ShieldCheck className="w-7 h-7 text-orange-500" />
        </div>
        <h2 className="text-xl font-bold font-hindi text-white mb-2">
          सुरक्षित व्यवस्थापक प्रमाणीकरण (Verifying Admin Authorization)
        </h2>
        <p className="text-sm text-slate-400 max-w-sm text-center">
          Checking Firebase Authentication session and administrator authorization UID...
        </p>
      </div>
    );
  }

  // If Not Authenticated or Not Admin -> Show Login / Access Denied
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-orange-500 selection:text-white">
        {/* Top bar with back button */}
        <div className="p-4 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>सार्वजनिक पोर्टल पर वापस जाएँ (Back to Website)</span>
          </a>
          <div className="flex items-center gap-2 text-xs text-orange-400 font-mono">
            <Lock className="w-3.5 h-3.5" />
            <span>SINGLE-ADMIN ONLY</span>
          </div>
        </div>

        {/* Center Card */}
        <div className="max-w-md w-full mx-auto px-4 py-8">
          {/* If user is logged in but UID does not match VITE_ADMIN_UID */}
          {user && !isAdmin ? (
            <div className="bg-slate-900 border border-red-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center mx-auto mb-5 text-red-400">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-hindi mb-2">
                पहुंच अस्वीकृत (Access Denied)
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                Your account is signed in to Firebase, but its UID is <strong>not authorized</strong> as the designated administrator.
              </p>
              
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-left mb-5 space-y-2 text-xs">
                <div>
                  <div className="text-slate-400 text-[11px]">Signed in as:</div>
                  <div className="font-mono text-white break-all">{user.email}</div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Your Firebase UID:</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(user.uid)}
                      className="text-[10px] text-orange-400 hover:text-orange-300 font-bold inline-flex items-center gap-1 transition"
                    >
                      {copiedUid ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">कॉपी हो गया (Copied)</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>UID कॉपी करें (Copy)</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="font-mono text-amber-300 text-[11px] break-all bg-slate-900 px-2 py-1.5 rounded-lg border border-slate-800 mt-1 select-all">
                    {user.uid}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-[11px]">Authorized VITE_ADMIN_UID:</div>
                  <div className="font-mono text-slate-300 text-[11px] break-all bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 mt-0.5">
                    {CONFIGURED_ADMIN_UID ? CONFIGURED_ADMIN_UID : '(Not set in environment)'}
                  </div>
                </div>
              </div>

              <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-200 text-left mb-6">
                <strong>How to grant single-admin access:</strong>
                <p className="mt-1 text-[11px] text-slate-300 leading-relaxed">
                  Set this UID in your environment:
                  <code className="block mt-1.5 p-2 bg-black/60 rounded text-amber-300 font-mono text-[11px] break-all select-all">
                    VITE_ADMIN_UID={user.uid}
                  </code>
                  And ensure Firestore & Storage rules check <code className="text-amber-300">request.auth.uid == '{user.uid}'</code>.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => refreshClaims()}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>पुनः जांचें (Re-check)</span>
                </button>
                <button
                  onClick={() => signOut()}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
                >
                  लॉगआउट (Sign Out)
                </button>
              </div>
            </div>
          ) : (
            /* Login Form */
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center mx-auto mb-3 text-orange-500">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white font-hindi tracking-tight">
                  काव्यांश कायस्थ • व्यवस्थापक लॉगिन
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Single-Admin Activity Management System
                </p>
                <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-orange-950/50 border border-orange-500/30 text-[11px] text-orange-300 font-hindi">
                  <span>नगर मंत्री, चौमुहां-छाता-कोसी क्षेत्र, मथुरा</span>
                </div>
              </div>

              {!isFirebaseAvailable && (
                <div className="mb-5 p-3.5 rounded-2xl bg-amber-950/50 border border-amber-500/40 text-xs text-amber-200 leading-relaxed">
                  <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-300">
                    <AlertCircle className="w-4 h-4" />
                    <span>Firebase Configuration Pending</span>
                  </div>
                  Please add your <code>VITE_FIREBASE_*</code> keys in your environment to connect your live Firebase Auth and Firestore project.
                </div>
              )}

              {loginMessage && (
                <div
                  className={`mb-5 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    loginMessage.type === 'error'
                      ? 'bg-red-900/50 border border-red-700 text-red-200'
                      : 'bg-emerald-900/50 border border-emerald-700 text-emerald-200'
                  }`}
                >
                  {loginMessage.type === 'error' ? (
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span>{loginMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    व्यवस्थापक ईमेल (Admin Email)
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="fitnesskavyansh@gmail.com"
                    autoComplete="email"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 transition"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      पासवर्ड (Password)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-[11px] text-orange-400 hover:text-orange-300 font-medium"
                    >
                      पासवर्ड भूल गए?
                    </button>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingLogin}
                  className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmittingLogin ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>प्रमाणीकरण हो रहा है...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>सुरक्षित लॉगिन करें (Sign In via Firebase)</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-800 text-center text-[11px] text-slate-500">
                सुरक्षा नियम: केवल अधिकृत व्यवस्थापक को गतिविधि जोड़ने, संशोधित करने अथवा हटाने की अनुमति है।
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 text-center text-xs text-slate-500 border-t border-slate-800/80">
          काव्यांश कायस्थ • नगर मंत्री, चौमुहां-छाता-कोसी क्षेत्र, मथुरा (ABVP) • Secure Firebase Backend
        </div>

        {/* Forgot Password Modal */}
        {showForgotModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base font-hindi">पासवर्ड रीसेट (Password Reset)</h3>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Enter your registered admin email address to receive a secure Firebase password reset link.
              </p>
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
                />
                <button
                  type="submit"
                  disabled={isSendingReset}
                  className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs"
                >
                  {isSendingReset ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Authenticated Admin Interface
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-in slide-in-from-top-2 duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl border text-xs sm:text-sm font-bold text-white ${
              toast.type === 'success'
                ? 'bg-emerald-900/90 border-emerald-500 text-emerald-100'
                : toast.type === 'error'
                ? 'bg-red-900/90 border-red-500 text-red-100'
                : 'bg-slate-900/90 border-slate-600 text-slate-100'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            )}
            <span>{toast.text}</span>
          </div>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              title="Return to Public Site"
            >
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm sm:text-base text-white tracking-tight font-hindi">
                  काव्यांश कायस्थ
                </span>
                <span className="px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-[10px] font-bold text-orange-400 uppercase tracking-wider">
                  Admin Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-hindi hidden sm:block">
                नगर मंत्री, चौमुहां-छाता-कोसी क्षेत्र, मथुरा (ABVP) • Activity Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={openCreateForm}
              className="py-2 px-3.5 sm:px-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-500/20 transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>नई गतिविधि जोड़ें (Add Activity)</span>
            </button>

            <button
              onClick={() => signOut()}
              className="p-2 sm:py-2 sm:px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-red-300 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">लॉगआउट</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Statistics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="text-xs font-bold text-slate-400 font-hindi">कुल गतिविधियाँ (Total)</div>
            <div className="text-2xl font-black text-white mt-1">{totalCount}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="text-xs font-bold text-emerald-400 font-hindi">प्रकाशित (Published)</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{publishedCount}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="text-xs font-bold text-amber-400 font-hindi">ड्राफ्ट (Draft / Hidden)</div>
            <div className="text-2xl font-black text-amber-400 mt-1">{draftCount}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="text-xs font-bold text-cyan-400 font-hindi">मीडिया फाइलें (Photos/Video)</div>
            <div className="text-2xl font-black text-cyan-400 mt-1">{totalMedia}</div>
          </div>
        </div>

        {/* Search & Filter Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="गतिविधि खोजें (शीर्षक, स्थान, विवरण)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 font-hindi"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e: any) => setFilterStatus(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold"
            >
              <option value="all">सभी स्थिति (All Status)</option>
              <option value="published">केवल प्रकाशित (Published)</option>
              <option value="draft">केवल ड्राफ्ट (Draft)</option>
            </select>

            {/* Refresh Button */}
            <button
              onClick={loadActivities}
              disabled={isLoadingActivities}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Refresh List"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingActivities ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Load Error Notice */}
        {loadError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-xs sm:text-sm text-red-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">Error loading activities from Firestore</div>
              <div className="text-red-300 mt-0.5">{loadError}</div>
              <p className="text-[11px] text-slate-400 mt-2">
                Make sure your Firebase project is initialized and Firestore rules permit your administrator account.
              </p>
            </div>
          </div>
        )}

        {/* Activities List */}
        {isLoadingActivities ? (
          <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-3xl">
            <RefreshCw className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-3" />
            <div className="text-sm font-bold text-slate-300 font-hindi">गतिविधियाँ लोड हो रही हैं...</div>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-16 px-4 bg-slate-900 border border-slate-800 rounded-3xl">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Layers className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white font-hindi mb-1">
              कोई गतिविधि नहीं मिली (No Activities Found)
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5 font-hindi">
              {searchTerm || filterStatus !== 'all'
                ? 'फ़िल्टर के अनुसार कोई परिणाम नहीं मिला। कृपया फ़िल्टर बदलें।'
                : 'अभी तक कोई गतिविधि नहीं जोड़ी गई है। नई गतिविधि जोड़ने के लिए नीचे दिए गए बटन पर क्लिक करें।'}
            </p>
            <button
              onClick={openCreateForm}
              className="py-2.5 px-5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>पहली गतिविधि जोड़ें</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4 flex-1">
                  {/* Photo Thumbnail */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex-shrink-0 relative">
                    {activity.photos && activity.photos.length > 0 ? (
                      <img
                        src={activity.photos[0]}
                        alt={activity.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 text-[10px]">
                        <ImageIcon className="w-5 h-5 mb-1" />
                        <span>No Photo</span>
                      </div>
                    )}
                    {activity.photos && activity.photos.length > 1 && (
                      <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] text-white px-1.5 py-0.5 rounded font-bold">
                        +{activity.photos.length - 1}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          activity.published
                            ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                            : 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                        }`}
                      >
                        {activity.published ? 'प्रकाशित (Published)' : 'ड्राफ्ट (Draft)'}
                      </span>
                      <span className="text-[11px] font-bold text-orange-400 bg-orange-950/40 px-2 py-0.5 rounded-md">
                        {activity.category}
                      </span>
                      {activity.video && (
                        <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded flex items-center gap-1">
                          <Video className="w-3 h-3" />
                          <span>Video</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white font-hindi truncate">
                      {activity.title}
                    </h3>

                    <p className="text-xs text-slate-400 font-hindi line-clamp-2 mt-1">
                      {activity.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>{activity.date}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{activity.location}</span>
                      </span>
                      {activity.photos && (
                        <span>• {activity.photos.length} फोटो</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                  {/* Publish / Unpublish Toggle */}
                  <button
                    onClick={() => handleTogglePublish(activity)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                      activity.published
                        ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                        : 'bg-emerald-900/40 hover:bg-emerald-800/40 border-emerald-500/50 text-emerald-300'
                    }`}
                    title={activity.published ? 'Hide / Unpublish' : 'Publish to Website'}
                  >
                    {activity.published ? (
                      <>
                        <EyeOff className="w-4 h-4 text-amber-400" />
                        <span className="hidden lg:inline">अप्रकाशित करें</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 text-emerald-400" />
                        <span className="hidden lg:inline">प्रकाशित करें</span>
                      </>
                    )}
                  </button>

                  {/* Preview */}
                  <button
                    onClick={() => setPreviewActivity(activity)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition"
                    title="Live Public Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => openEditForm(activity)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-orange-400 transition"
                    title="Edit Activity"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => setDeleteConfirmItem(activity)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-red-900/30 border border-slate-700 hover:border-red-500/50 text-slate-400 hover:text-red-400 transition"
                    title="Delete Activity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* CREATE / EDIT ACTIVITY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900 sticky top-0 z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-500">
                  <Edit className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white font-hindi">
                    {isEditing ? 'गतिविधि संशोधित करें (Edit Activity)' : 'नई गतिविधि जोड़ें (Add New Activity)'}
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Saves securely to Firestore. Media stored in Firebase Storage.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveActivity} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 font-hindi">
                  गतिविधि का शीर्षक (Activity Title) *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="उदा. चौमुहां में छात्र संवाद एवं ज्ञापन प्रेषण"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-hindi"
                />
              </div>

              {/* Grid: Category, Date, Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 font-hindi">
                    श्रेणी (Category)
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {category === 'Other Activities' && (
                    <input
                      type="text"
                      placeholder="Custom Category name"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="mt-2 w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  )}
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 font-hindi">
                    दिनांक (Date) *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 font-hindi">
                    स्थान (Location) *
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="उदा. चौमुहां, मथुरा"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-hindi"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 font-hindi">
                  विस्तृत विवरण (Activity Description) *
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="गतिविधि, बैठक अथवा छात्र कल्याण कार्यक्रम का सम्पूर्ण विवरण यहाँ लिखें..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white font-hindi"
                ></textarea>
              </div>

              {/* Photos Section */}
              <div className="border border-slate-800 rounded-2xl p-4 bg-slate-950/60">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-orange-400" />
                    <span>फोटो अपलोड करें (Multiple Photos)</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {photos.length} फोटो संलग्न (Up to 15MB each)
                  </span>
                </div>

                {/* Upload Button */}
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoFilesSelected}
                    className="hidden"
                    id="photo-upload-input"
                  />
                  <label
                    htmlFor="photo-upload-input"
                    className="cursor-pointer py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white flex items-center gap-2 transition"
                  >
                    <Upload className="w-3.5 h-3.5 text-orange-400" />
                    <span>गैलरी / कैमरा से चुनें (Upload Photos)</span>
                  </label>

                  <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                    <input
                      type="url"
                      placeholder="अथवा फोटो URL यहाँ पेस्ट करें..."
                      value={manualPhotoUrl}
                      onChange={(e) => setManualPhotoUrl(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={addManualPhoto}
                      className="py-2 px-3 rounded-xl bg-slate-800 text-xs font-bold text-slate-300"
                    >
                      जोड़ें
                    </button>
                  </div>
                </div>

                {/* Uploads in Progress */}
                {Object.keys(uploadsInProgress).length > 0 && (
                  <div className="mb-3 space-y-2">
                    {Object.entries(uploadsInProgress).map(([key, pct]) => (
                      <div key={key} className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                        <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                          <span className="truncate max-w-xs">{key}</span>
                          <span className="font-mono text-orange-400">{pct}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-orange-500 h-1.5 transition-all duration-200"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Photo Previews */}
                {photos.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                    {photos.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-900 aspect-square"
                      >
                        <img
                          src={url}
                          alt={`Uploaded ${idx + 1}`}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(idx)}
                          className="absolute top-1 right-1 bg-red-600/90 text-white p-1 rounded-lg opacity-80 hover:opacity-100 transition shadow"
                          title="Remove photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 italic">
                    अभी कोई फोटो नहीं चुनी गई है।
                  </p>
                )}
              </div>

              {/* Video Section */}
              <div className="border border-slate-800 rounded-2xl p-4 bg-slate-950/60">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-cyan-400" />
                    <span>वीडियो संलग्न करें (Video Upload or Embed Link)</span>
                  </label>
                  <span className="text-[11px] text-slate-400">Up to 150MB</span>
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoFileSelected}
                    className="hidden"
                    id="video-upload-input"
                  />
                  <label
                    htmlFor="video-upload-input"
                    className="cursor-pointer py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white flex items-center gap-2 transition"
                  >
                    <Upload className="w-3.5 h-3.5 text-cyan-400" />
                    <span>वीडियो फाइल अपलोड करें</span>
                  </label>

                  <div className="flex-1 min-w-[240px]">
                    <input
                      type="url"
                      placeholder="अथवा यूट्यूब / वीडियो URL (YouTube, MP4)..."
                      value={video}
                      onChange={(e) => setVideo(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                {video && (
                  <div className="mt-3 p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div className="text-xs text-cyan-300 truncate max-w-md font-mono">
                      {video}
                    </div>
                    <button
                      type="button"
                      onClick={() => setVideo('')}
                      className="text-xs text-red-400 hover:text-red-300 ml-2"
                    >
                      हटाएं (Remove)
                    </button>
                  </div>
                )}
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <div className="text-xs font-bold text-white font-hindi">
                    सार्वजनिक वेबसाइट पर प्रकाशित करें (Publish Status)
                  </div>
                  <div className="text-[11px] text-slate-400 font-hindi">
                    {isPublished
                      ? 'यह गतिविधि वेबसाइट पर सभी आगंतुकों को तुरंत दिखाई देगी।'
                      : 'यह गतिविधि केवल ड्राफ्ट के रूप में सुरक्षित रहेगी।'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPublished(!isPublished)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
                    isPublished ? 'bg-emerald-600 justify-end' : 'bg-slate-700 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
                </button>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                >
                  रद्द करें (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-bold shadow-lg shadow-orange-500/20 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>सुरक्षित हो रहा है...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isEditing ? 'संशोधन सुरक्षित करें' : 'गतिविधि प्रकाशित करें'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewActivity && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-6 relative overflow-hidden my-auto shadow-2xl">
            <button
              onClick={() => setPreviewActivity(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold font-hindi mb-2">
                {previewActivity.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 font-hindi">
                {previewActivity.title}
              </h2>
              <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 font-hindi">
                <span>दिनांक: {previewActivity.date}</span>
                <span>स्थान: {previewActivity.location}</span>
              </div>
            </div>

            {/* Photos */}
            {previewActivity.photos && previewActivity.photos.length > 0 && (
              <div className="mb-4">
                <img
                  src={previewActivity.photos[0]}
                  alt={previewActivity.title}
                  className="w-full max-h-80 object-cover rounded-2xl border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                {previewActivity.photos.length > 1 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {previewActivity.photos.slice(1, 5).map((p, i) => (
                      <img
                        key={i}
                        src={p}
                        alt="Gallery"
                        className="w-full h-16 object-cover rounded-xl border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Video preview */}
            {previewActivity.video && (
              <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-700">Video Link: </span>
                <a
                  href={previewActivity.video}
                  target="_blank"
                  rel="noreferrer"
                  className="text-orange-600 underline break-all"
                >
                  {previewActivity.video}
                </a>
              </div>
            )}

            <p className="text-sm text-slate-700 font-hindi whitespace-pre-line leading-relaxed mb-6">
              {previewActivity.description}
            </p>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setPreviewActivity(null)}
                className="py-2 px-5 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                बंद करें (Close Preview)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-hindi mb-2">
              क्या आप इस गतिविधि को हटाना चाहते हैं?
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              "{deleteConfirmItem.title}" को Firestore डेटाबेस से स्थायी रूप से हटा दिया जाएगा।
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmItem(null)}
                className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
              >
                रद्द करें
              </button>
              <button
                onClick={handleDeleteActivity}
                disabled={isDeleting}
                className="py-2 px-5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                {isDeleting ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>हटाएं (Delete)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
