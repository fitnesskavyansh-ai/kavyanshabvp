import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAdminAuth } from './AdminAuthContext';
import {
  ProfileConfig,
  SubmittedIssue,
  ContactMessage,
  ActivityItem,
  GalleryItem,
  UpdatePost,
  JourneyMilestone,
} from '../types';
import {
  INITIAL_PROFILE,
  INITIAL_ACTIVITIES,
  INITIAL_GALLERY,
  INITIAL_UPDATES,
  INITIAL_JOURNEY,
} from '../config/profileData';

interface AppContextType {
  profile: ProfileConfig;
  updateProfile: (newProfile: Partial<ProfileConfig>) => Promise<boolean>;
  journeyEntries: JourneyMilestone[];
  setJourneyEntries: React.Dispatch<React.SetStateAction<JourneyMilestone[]>>;
  addJourneyEntry: (entry: Omit<JourneyMilestone, 'id'>) => Promise<boolean>;
  updateJourneyEntry: (id: string, entry: Partial<JourneyMilestone>) => Promise<boolean>;
  deleteJourneyEntry: (id: string) => Promise<boolean>;
  togglePublishJourneyEntry: (id: string) => Promise<boolean>;
  refreshJourneyEntries: () => Promise<void>;
  galleryItems: GalleryItem[];
  setGalleryItems: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => Promise<boolean>;
  updateGalleryItem: (id: string, item: Partial<GalleryItem>) => Promise<boolean>;
  deleteGalleryItem: (id: string) => Promise<boolean>;
  togglePublishGalleryItem: (id: string) => Promise<boolean>;
  refreshGalleryItems: () => Promise<void>;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isIssueModalOpen: boolean;
  setIsIssueModalOpen: (open: boolean) => void;
  isPhotoUploadOpen: boolean;
  setIsPhotoUploadOpen: (open: boolean) => void;
  activePolicyModal: 'privacy' | 'terms' | 'submission' | null;
  setActivePolicyModal: (modal: 'privacy' | 'terms' | 'submission' | null) => void;
  adminToken: string | null;
  setAdminToken: (token: string | null) => void;
  toastMessage: { text: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  selectedCategoryFilter: string | null;
  setSelectedCategoryFilter: (cat: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<ProfileConfig>(INITIAL_PROFILE);
  const [journeyEntries, setJourneyEntries] = useState<JourneyMilestone[]>(INITIAL_JOURNEY);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isPhotoUploadOpen, setIsPhotoUploadOpen] = useState(false);
  const [activePolicyModal, setActivePolicyModal] = useState<'privacy' | 'terms' | 'submission' | null>(null);
  const { user, isAdmin } = useAdminAuth();
  const [adminToken, setAdminToken] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (user && isAdmin) {
      user
        .getIdToken()
        .then((token) => {
          if (isMounted) setAdminToken(token);
        })
        .catch(() => {
          if (isMounted) setAdminToken(null);
        });
    } else {
      setAdminToken(null);
    }
    return () => {
      isMounted = false;
    };
  }, [user, isAdmin]);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);

  const refreshJourneyEntries = async () => {
    try {
      const res = await fetch('/api/journey');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.journeyEntries) && data.journeyEntries.length > 0) {
          setJourneyEntries(data.journeyEntries);
        } else {
          setJourneyEntries(INITIAL_JOURNEY);
        }
      }
    } catch (err) {
      console.warn('Using baseline INITIAL_JOURNEY');
    }
  };

  const refreshGalleryItems = async () => {
    try {
      const headers: Record<string, string> = {};
      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
      }
      const res = await fetch('/api/gallery', { headers });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.gallery)) {
          setGalleryItems(data.gallery);
        }
      }
    } catch (err) {
      console.warn('Gallery items fetch fallback');
    }
  };

  // Fetch live profile overrides, journey entries, and gallery photos on load
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          if (data.profileOverrides && Object.keys(data.profileOverrides).length > 0) {
            const canonicalPhoto =
              data.profileOverrides.photo ||
              data.profileOverrides.photoUrl ||
              INITIAL_PROFILE.photo ||
              '/kavyansh-kayastha.jpg';

            setProfile((prev) => ({
              ...prev,
              ...data.profileOverrides,
              photo: canonicalPhoto,
              photoUrl: canonicalPhoto,
              socials: {
                ...prev.socials,
                ...(data.profileOverrides.socials || {}),
              },
            }));
          }
        }
      } catch (err) {
        console.warn('Using baseline profileData.ts configuration');
      }

      await Promise.all([refreshJourneyEntries(), refreshGalleryItems()]);
    }
    loadData();
  }, [adminToken]);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const updateProfile = async (newProfile: Partial<ProfileConfig>): Promise<boolean> => {
    try {
      const canonicalPhoto =
        newProfile.photo ||
        newProfile.photoUrl ||
        profile.photo ||
        profile.photoUrl ||
        '/kavyansh-kayastha.jpg';

      const merged = {
        ...profile,
        ...newProfile,
        photo: canonicalPhoto,
        photoUrl: canonicalPhoto,
      };
      setProfile(merged);

      if (adminToken) {
        await fetch('/api/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            ...newProfile,
            photo: canonicalPhoto,
            photoUrl: canonicalPhoto,
          }),
        });
      }
      showToast('Profile configuration updated successfully', 'success');
      return true;
    } catch (err) {
      showToast('Failed to save profile changes to server', 'error');
      return false;
    }
  };

  const addJourneyEntry = async (entry: Omit<JourneyMilestone, 'id'>): Promise<boolean> => {
    const tempId = `j-${Date.now()}`;
    const newEntry: JourneyMilestone = {
      ...entry,
      id: tempId,
      isPublished: entry.isPublished !== undefined ? entry.isPublished : true,
    };

    const updatedList = [...journeyEntries, newEntry];
    setJourneyEntries(updatedList);

    try {
      if (adminToken) {
        const res = await fetch('/api/journey', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify(newEntry),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.journeyEntries) {
            setJourneyEntries(data.journeyEntries);
          }
        }
      }
      showToast('Journey entry added successfully', 'success');
      return true;
    } catch (err) {
      showToast('Saved locally, server sync pending', 'info');
      return true;
    }
  };

  const updateJourneyEntry = async (id: string, partial: Partial<JourneyMilestone>): Promise<boolean> => {
    const updatedList = journeyEntries.map((item) =>
      item.id === id ? { ...item, ...partial } : item
    );
    setJourneyEntries(updatedList);

    try {
      if (adminToken) {
        const res = await fetch(`/api/journey/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify(partial),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.journeyEntries) {
            setJourneyEntries(data.journeyEntries);
          }
        }
      }
      showToast('Journey entry updated successfully', 'success');
      return true;
    } catch (err) {
      showToast('Updated locally', 'info');
      return true;
    }
  };

  const deleteJourneyEntry = async (id: string): Promise<boolean> => {
    const updatedList = journeyEntries.filter((item) => item.id !== id);
    setJourneyEntries(updatedList);

    try {
      if (adminToken) {
        const res = await fetch(`/api/journey/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.journeyEntries) {
            setJourneyEntries(data.journeyEntries);
          }
        }
      }
      showToast('Journey entry deleted', 'success');
      return true;
    } catch (err) {
      showToast('Deleted locally', 'info');
      return true;
    }
  };

  const togglePublishJourneyEntry = async (id: string): Promise<boolean> => {
    const target = journeyEntries.find((item) => item.id === id);
    if (!target) return false;
    const newStatus = target.isPublished === false ? true : false;
    return updateJourneyEntry(id, { isPublished: newStatus });
  };

  const addGalleryItem = async (item: Omit<GalleryItem, 'id'>): Promise<boolean> => {
    try {
      if (!adminToken) {
        showToast('Admin authentication required to upload photos.', 'error');
        return false;
      }
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(item),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (Array.isArray(data.gallery)) {
          setGalleryItems(data.gallery);
        } else if (data.galleryItem) {
          setGalleryItems((prev) => [data.galleryItem, ...prev]);
        }
        showToast('Official gallery photograph added successfully!', 'success');
        return true;
      } else {
        showToast(data.error || 'Failed to add gallery photo', 'error');
        return false;
      }
    } catch (err: any) {
      showToast(err.message || 'Error uploading gallery photo', 'error');
      return false;
    }
  };

  const updateGalleryItem = async (id: string, partial: Partial<GalleryItem>): Promise<boolean> => {
    try {
      if (!adminToken) {
        showToast('Admin authentication required.', 'error');
        return false;
      }
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(partial),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (Array.isArray(data.gallery)) {
          setGalleryItems(data.gallery);
        } else {
          setGalleryItems((prev) => prev.map((g) => (g.id === id ? { ...g, ...partial } : g)));
        }
        showToast('Gallery photograph updated successfully!', 'success');
        return true;
      } else {
        showToast(data.error || 'Failed to update gallery photo', 'error');
        return false;
      }
    } catch (err: any) {
      showToast(err.message || 'Error updating gallery photo', 'error');
      return false;
    }
  };

  const deleteGalleryItem = async (id: string): Promise<boolean> => {
    try {
      if (!adminToken) {
        showToast('Admin authentication required.', 'error');
        return false;
      }
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (Array.isArray(data.gallery)) {
          setGalleryItems(data.gallery);
        } else {
          setGalleryItems((prev) => prev.filter((g) => g.id !== id));
        }
        showToast('Gallery photograph deleted successfully.', 'success');
        return true;
      } else {
        showToast(data.error || 'Failed to delete gallery photo', 'error');
        return false;
      }
    } catch (err: any) {
      showToast(err.message || 'Error deleting gallery photo', 'error');
      return false;
    }
  };

  const togglePublishGalleryItem = async (id: string): Promise<boolean> => {
    const target = galleryItems.find((g) => g.id === id);
    if (!target) return false;
    const newStatus = target.isPublished === false;
    return updateGalleryItem(id, { isPublished: newStatus });
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        updateProfile,
        journeyEntries,
        setJourneyEntries,
        addJourneyEntry,
        updateJourneyEntry,
        deleteJourneyEntry,
        togglePublishJourneyEntry,
        refreshJourneyEntries,
        galleryItems,
        setGalleryItems,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        togglePublishGalleryItem,
        refreshGalleryItems,
        isAdminOpen,
        setIsAdminOpen,
        isIssueModalOpen,
        setIsIssueModalOpen,
        isPhotoUploadOpen,
        setIsPhotoUploadOpen,
        activePolicyModal,
        setActivePolicyModal,
        adminToken,
        setAdminToken,
        toastMessage,
        showToast,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
      }}
    >
      {children}
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="global-toast"
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl text-sm font-medium transition-all transform duration-300 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-800 text-white'
              : toastMessage.type === 'error'
              ? 'bg-red-800 text-white'
              : 'bg-slate-900 text-white'
          }`}
        >
          <span>{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white/70 hover:text-white text-base leading-none ml-2"
          >
            ✕
          </button>
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
